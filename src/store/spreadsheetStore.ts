// store/spreadsheetStore.ts - Zustand store for spreadsheet state management
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { SpreadsheetData, CellRange, CellStyle } from "../types";
import { FormulaEngine } from "../formulaEngine/FormulaEngine";
import {
  createEmptyGrid,
  formatCellValue,
  getCellId,
  getCellsInRange,
  getOrCreateCell,
} from "../utils/spreadsheetUtils";

// Tab interface
export interface SpreadsheetTab {
  id: string;
  name: string;
  data: SpreadsheetData;
  selectedCell: string;
  selectedRange: CellRange | null;
  formulaBarValue: string;
  isEditingFormula: boolean;
  isDirty: boolean;
  createdAt: number;
  lastModified: number;
}

// Store state interface
interface SpreadsheetStore {
  // Tabs management
  tabs: SpreadsheetTab[];
  activeTabId: string;
  tabCounter: number;

  // Formula engine
  formulaEngine: FormulaEngine;

  // UI state
  isImportDialogOpen: boolean;

  // Actions for tabs
  addTab: (name?: string) => string;
  removeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  renameTab: (tabId: string, name: string) => void;
  duplicateTab: (tabId: string) => string;

  // Actions for active tab
  updateCell: (cellId: string, value: string) => void;
  setSelectedCell: (cellId: string) => void;
  setSelectedRange: (range: CellRange | null) => void;
  setFormulaBarValue: (value: string) => void;
  setIsEditingFormula: (editing: boolean) => void;
  applyFormatting: (style: Partial<CellStyle>) => void;
  mergeCells: () => void;
  unmergeCells: () => void;

  // Bulk operations
  importData: (data: SpreadsheetData) => void;
  loadSampleData: (data: SpreadsheetData) => void;
  clearSheet: () => void;

  // UI actions
  setImportDialogOpen: (open: boolean) => void;

  // Getters
  getActiveTab: () => SpreadsheetTab | undefined;
  getTabData: (tabId?: string) => SpreadsheetData;
  getSelectedCell: (tabId?: string) => string;
  getSelectedRange: (tabId?: string) => CellRange | null;
}

const ROWS = 50;
const COLS = 26;

// Create initial tab
const createInitialTab = (id: string, name: string): SpreadsheetTab => ({
  id,
  name,
  data: createEmptyGrid(ROWS, COLS),
  selectedCell: "A1",
  selectedRange: null,
  formulaBarValue: "",
  isEditingFormula: false,
  isDirty: false,
  createdAt: Date.now(),
  lastModified: Date.now(),
});

export const useSpreadsheetStore = create<SpreadsheetStore>()(
  subscribeWithSelector(
    immer((set, get) => ({
      // Initial state
      tabs: [createInitialTab("tab-1", "Sheet1")],
      activeTabId: "tab-1",
      tabCounter: 1,
      formulaEngine: new FormulaEngine(),
      isImportDialogOpen: false,

      // Tab management actions
      addTab: (name?: string) => {
        const newTabId = `tab-${Date.now()}`;
        const newCounter = get().tabCounter + 1;
        const tabName = name || `Sheet${newCounter}`;

        set((state) => {
          state.tabCounter = newCounter;
          state.tabs.push(createInitialTab(newTabId, tabName));
          state.activeTabId = newTabId;
        });

        return newTabId;
      },

      removeTab: (tabId: string) => {
        const state = get();
        if (state.tabs.length <= 1) return; // Don't remove the last tab

        set((draft) => {
          const tabIndex = draft.tabs.findIndex(
            (tab: SpreadsheetTab) => tab.id === tabId
          );
          if (tabIndex === -1) return;

          draft.tabs.splice(tabIndex, 1);

          // If removing active tab, switch to adjacent tab
          if (draft.activeTabId === tabId) {
            const newActiveIndex = Math.min(tabIndex, draft.tabs.length - 1);
            draft.activeTabId = draft.tabs[newActiveIndex].id;
          }
        });
      },

      setActiveTab: (tabId: string) => {
        set((state) => {
          state.activeTabId = tabId;
        });
      },

      renameTab: (tabId: string, name: string) => {
        set((state) => {
          const tab = state.tabs.find((t: SpreadsheetTab) => t.id === tabId);
          if (tab) {
            tab.name = name;
            tab.lastModified = Date.now();
            tab.isDirty = true;
          }
        });
      },

      duplicateTab: (tabId: string) => {
        const state = get();
        const sourceTab = state.tabs.find(
          (t: SpreadsheetTab) => t.id === tabId
        );
        if (!sourceTab) return "";

        const newTabId = `tab-${Date.now()}`;
        const newCounter = state.tabCounter + 1;

        set((draft) => {
          draft.tabCounter = newCounter;
          const duplicatedTab: SpreadsheetTab = {
            ...sourceTab,
            id: newTabId,
            name: `${sourceTab.name} (Copy)`,
            data: JSON.parse(JSON.stringify(sourceTab.data)), // Deep clone
            createdAt: Date.now(),
            lastModified: Date.now(),
            isDirty: false,
          };
          draft.tabs.push(duplicatedTab);
          draft.activeTabId = newTabId;
        });

        return newTabId;
      },

      // Active tab actions
      updateCell: (cellId: string, value: string) => {
        const state = get();
        const activeTab = state.tabs.find(
          (t: SpreadsheetTab) => t.id === state.activeTabId
        );
        if (!activeTab) return;

        set((draft) => {
          const tab = draft.tabs.find(
            (t: SpreadsheetTab) => t.id === draft.activeTabId
          );
          if (!tab) return;

          const cell = getOrCreateCell(tab.data, cellId);
          cell.rawValue = value;

          // Handle formulas
          if (value.startsWith("=")) {
            cell.type = "formula";
            cell.formula = value;
            try {
              cell.computedValue = state.formulaEngine.evaluate(
                cellId,
                value,
                tab.data
              );
              cell.displayValue = formatCellValue(cell.computedValue);
            } catch {
              cell.computedValue = "#ERROR!";
              cell.displayValue = "#ERROR!";
            }
          } else {
            cell.type = "text";
            cell.computedValue = value;
            cell.displayValue = value;
            delete cell.formula;
          }

          tab.data[cellId] = cell;

          // Recalculate dependent cells
          tab.data = state.formulaEngine.recalculateFromCell(cellId, tab.data);

          tab.lastModified = Date.now();
          tab.isDirty = true;
        });
      },

      setSelectedCell: (cellId: string) => {
        set((state) => {
          const tab = state.tabs.find(
            (t: SpreadsheetTab) => t.id === state.activeTabId
          );
          if (tab) {
            tab.selectedCell = cellId;
            // Reset formula bar if not editing
            if (!tab.isEditingFormula) {
              tab.formulaBarValue = "";
            }
          }
        });
      },

      setSelectedRange: (range: CellRange | null) => {
        set((state) => {
          const tab = state.tabs.find(
            (t: SpreadsheetTab) => t.id === state.activeTabId
          );
          if (tab) {
            tab.selectedRange = range;
          }
        });
      },

      setFormulaBarValue: (value: string) => {
        set((state) => {
          const tab = state.tabs.find(
            (t: SpreadsheetTab) => t.id === state.activeTabId
          );
          if (tab) {
            tab.formulaBarValue = value;
          }
        });
      },

      setIsEditingFormula: (editing: boolean) => {
        set((state) => {
          const tab = state.tabs.find(
            (t: SpreadsheetTab) => t.id === state.activeTabId
          );
          if (tab) {
            tab.isEditingFormula = editing;
          }
        });
      },

      applyFormatting: (style: Partial<CellStyle>) => {
        const state = get();
        const activeTab = state.tabs.find(
          (t: SpreadsheetTab) => t.id === state.activeTabId
        );
        if (!activeTab) return;

        set((draft) => {
          const tab = draft.tabs.find(
            (t: SpreadsheetTab) => t.id === draft.activeTabId
          );
          if (!tab) return;

          const cellsToUpdate = tab.selectedRange
            ? getCellsInRange(tab.selectedRange)
            : [tab.selectedCell];

          cellsToUpdate.forEach((cellId) => {
            if (tab.data[cellId]) {
              tab.data[cellId] = {
                ...tab.data[cellId],
                style: {
                  ...tab.data[cellId].style,
                  ...style,
                },
              };
            }
          });

          tab.lastModified = Date.now();
          tab.isDirty = true;
        });
      },

      mergeCells: () => {
        const state = get();
        const activeTab = state.tabs.find(
          (t: SpreadsheetTab) => t.id === state.activeTabId
        );
        if (!activeTab?.selectedRange) return;

        set((draft) => {
          const tab = draft.tabs.find(
            (t: SpreadsheetTab) => t.id === draft.activeTabId
          );
          if (!tab?.selectedRange) return;

          const cells = getCellsInRange(tab.selectedRange);
          const masterCellId = getCellId(tab.selectedRange.start);

          // Set merged range on master cell
          tab.data[masterCellId] = {
            ...tab.data[masterCellId],
            merged: tab.selectedRange,
          };

          // Clear other cells in the range
          cells.forEach((cellId) => {
            if (cellId !== masterCellId && tab.data[cellId]) {
              tab.data[cellId] = {
                ...tab.data[cellId],
                rawValue: "",
                computedValue: "",
                displayValue: "",
                merged: undefined,
              };
            }
          });

          tab.selectedCell = masterCellId;
          tab.selectedRange = null;
          tab.lastModified = Date.now();
          tab.isDirty = true;
        });
      },

      unmergeCells: () => {
        const state = get();
        const activeTab = state.tabs.find(
          (t: SpreadsheetTab) => t.id === state.activeTabId
        );
        if (!activeTab) return;

        const cell = activeTab.data[activeTab.selectedCell];
        if (!cell?.merged) return;

        set((draft) => {
          const tab = draft.tabs.find(
            (t: SpreadsheetTab) => t.id === draft.activeTabId
          );
          if (!tab) return;

          const cellData = tab.data[tab.selectedCell];
          if (cellData) {
            delete cellData.merged;
            tab.lastModified = Date.now();
            tab.isDirty = true;
          }
        });
      },

      // Bulk operations
      importData: (data: SpreadsheetData) => {
        const state = get();

        set((draft) => {
          const tab = draft.tabs.find(
            (t: SpreadsheetTab) => t.id === draft.activeTabId
          );
          if (!tab) return;

          // Process formulas in batch
          const formulaCells: Array<{ cellId: string; formula: string }> = [];
          Object.entries(data).forEach(([cellId, cellData]) => {
            if (cellData.type === "formula" && cellData.formula) {
              formulaCells.push({ cellId, formula: cellData.formula });
            }
          });

          // Batch process formulas
          tab.data = state.formulaEngine.batchEvaluate(formulaCells, data);
          tab.selectedCell = "A1";
          tab.selectedRange = null;
          tab.formulaBarValue = "";
          tab.lastModified = Date.now();
          tab.isDirty = true;
        });
      },

      loadSampleData: (data: SpreadsheetData) => {
        get().importData(data);
      },

      clearSheet: () => {
        set((state) => {
          const tab = state.tabs.find(
            (t: SpreadsheetTab) => t.id === state.activeTabId
          );
          if (tab) {
            tab.data = createEmptyGrid(ROWS, COLS);
            tab.selectedCell = "A1";
            tab.selectedRange = null;
            tab.formulaBarValue = "";
            tab.lastModified = Date.now();
            tab.isDirty = true;
          }
        });
      },

      // UI actions
      setImportDialogOpen: (open: boolean) => {
        set((state) => {
          state.isImportDialogOpen = open;
        });
      },

      // Getters
      getActiveTab: () => {
        const state = get();
        return state.tabs.find(
          (t: SpreadsheetTab) => t.id === state.activeTabId
        );
      },

      getTabData: (tabId?: string) => {
        const state = get();
        const targetTabId = tabId || state.activeTabId;
        const tab = state.tabs.find(
          (t: SpreadsheetTab) => t.id === targetTabId
        );
        return tab?.data || {};
      },

      getSelectedCell: (tabId?: string) => {
        const state = get();
        const targetTabId = tabId || state.activeTabId;
        const tab = state.tabs.find(
          (t: SpreadsheetTab) => t.id === targetTabId
        );
        return tab?.selectedCell || "A1";
      },

      getSelectedRange: (tabId?: string) => {
        const state = get();
        const targetTabId = tabId || state.activeTabId;
        const tab = state.tabs.find(
          (t: SpreadsheetTab) => t.id === targetTabId
        );
        return tab?.selectedRange || null;
      },
    }))
  )
);

// Selectors for better performance
export const useActiveTab = () =>
  useSpreadsheetStore((state) =>
    state.tabs.find((t: SpreadsheetTab) => t.id === state.activeTabId)
  );

export const useTabData = () =>
  useSpreadsheetStore((state) => {
    const activeTab = state.tabs.find(
      (t: SpreadsheetTab) => t.id === state.activeTabId
    );
    return activeTab?.data || {};
  });

export const useSelectedCell = () =>
  useSpreadsheetStore((state) => {
    const activeTab = state.tabs.find(
      (t: SpreadsheetTab) => t.id === state.activeTabId
    );
    return activeTab?.selectedCell || "A1";
  });

export const useSelectedRange = () =>
  useSpreadsheetStore((state) => {
    const activeTab = state.tabs.find(
      (t: SpreadsheetTab) => t.id === state.activeTabId
    );
    return activeTab?.selectedRange || null;
  });

export const useFormulaBarValue = () =>
  useSpreadsheetStore((state) => {
    const activeTab = state.tabs.find(
      (t: SpreadsheetTab) => t.id === state.activeTabId
    );
    return activeTab?.formulaBarValue || "";
  });

export const useIsEditingFormula = () =>
  useSpreadsheetStore((state) => {
    const activeTab = state.tabs.find(
      (t: SpreadsheetTab) => t.id === state.activeTabId
    );
    return activeTab?.isEditingFormula || false;
  });
