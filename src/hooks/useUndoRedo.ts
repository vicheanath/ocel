// hooks/useUndoRedo.ts
import { useMemo, useCallback, useState, useEffect } from "react";
import type { SpreadsheetData, CellRange, CellStyle } from "../types";
import { StateManager } from "../state/StateManager";
import { HistoryManager } from "../history/HistoryManager";
import { CommandFactory } from "../commands/CommandFactory";
import type { CellSnapshot, DataChangeSnapshot } from "../commands/interfaces";

// Custom Hook for Undo/Redo functionality - Single Responsibility
export const useUndoRedo = (
  initialData: SpreadsheetData,
  onDataChange: (data: SpreadsheetData) => void,
  onSelectionChange: (cell: string, range: CellRange | null) => void
) => {
  const [, forceUpdate] = useState(0);

  // Create managers with Dependency Injection
  const { stateManager, historyManager, commandFactory } = useMemo(() => {
    const stateManager = new StateManager(
      initialData,
      onDataChange,
      onSelectionChange
    );
    const historyManager = new HistoryManager(100);
    const commandFactory = new CommandFactory(stateManager);

    return { stateManager, historyManager, commandFactory };
  }, [initialData, onDataChange, onSelectionChange]);

  // Force re-render when history changes
  const triggerUpdate = useCallback(() => {
    forceUpdate((prev) => prev + 1);
  }, []);

  // Update cell with undo/redo support
  const updateCell = useCallback(
    (cellId: string, newValue: string) => {
      const currentData = stateManager.getCurrentState();
      const oldValue = currentData[cellId]?.rawValue || "";

      if (oldValue !== newValue) {
        const command = commandFactory.createCellUpdateCommand(
          cellId,
          newValue
        );
        historyManager.executeCommand(command);
        triggerUpdate();
      }
    },
    [stateManager, historyManager, commandFactory, triggerUpdate]
  );

  // Apply formatting with undo/redo support
  const applyFormatting = useCallback(
    (cellIds: string[], style: Partial<CellStyle>) => {
      const currentData = stateManager.getCurrentState();
      const cellsSnapshot: Record<string, CellSnapshot | null> = {};

      // Create snapshot with desired formatting applied
      cellIds.forEach((cellId) => {
        const cell = currentData[cellId];
        if (cell) {
          cellsSnapshot[cellId] = {
            rawValue: cell.rawValue,
            computedValue: cell.computedValue,
            displayValue: cell.displayValue,
            style: { ...cell.style, ...style }, // Apply new styling
            type: cell.type,
            formula: cell.formula,
          };
        } else {
          // Create new cell with formatting if it doesn't exist
          cellsSnapshot[cellId] = {
            rawValue: "",
            computedValue: "",
            displayValue: "",
            style: style,
            type: "text" as const,
            formula: undefined,
          };
        }
      });

      const snapshot: DataChangeSnapshot = {
        cellsSnapshot,
        affectedCells: cellIds,
        changeType: "format" as const,
      };

      const command = commandFactory.createDataChangeCommand(
        snapshot,
        `Format cells: ${cellIds.join(", ")}`
      );
      historyManager.executeCommand(command);
      triggerUpdate();
    },
    [stateManager, historyManager, commandFactory, triggerUpdate]
  );

  // Merge cells with undo/redo support
  const mergeCells = useCallback(
    (range: CellRange) => {
      // Enhanced merge command automatically handles affected cells
      const command = commandFactory.createMergeCommand(range);
      historyManager.executeCommand(command);
      triggerUpdate();
    },
    [historyManager, commandFactory, triggerUpdate]
  );

  // Unmerge cells with undo/redo support
  const unmergeCells = useCallback(
    (cellId: string) => {
      const currentData = stateManager.getCurrentState();
      const cellData = currentData[cellId];

      if (cellData?.merged) {
        // Enhanced unmerge command automatically handles the merged range
        const command = commandFactory.createUnmergeCommand(cellId);
        historyManager.executeCommand(command);
        triggerUpdate();
      }
    },
    [stateManager, historyManager, commandFactory, triggerUpdate]
  );

  // Bulk update with undo/redo support (useful for paste operations)
  const bulkUpdate = useCallback(
    (changes: Record<string, { newValue: string; oldValue: string }>) => {
      if (Object.keys(changes).length > 0) {
        const command = commandFactory.createBulkUpdateCommand(changes);
        historyManager.executeCommand(command);
        triggerUpdate();
      }
    },
    [historyManager, commandFactory, triggerUpdate]
  );

  // Undo operation
  const undo = useCallback(() => {
    if (historyManager.undo()) {
      triggerUpdate();
    }
  }, [historyManager, triggerUpdate]);

  // Redo operation
  const redo = useCallback(() => {
    if (historyManager.redo()) {
      triggerUpdate();
    }
  }, [historyManager, triggerUpdate]);

  // Clear history
  const clearHistory = useCallback(() => {
    historyManager.clear();
    triggerUpdate();
  }, [historyManager, triggerUpdate]);

  // Update state manager when external data changes
  useEffect(() => {
    stateManager.setState(initialData);
  }, [initialData, stateManager]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        if (event.key === "z" && !event.shiftKey) {
          event.preventDefault();
          undo();
        } else if ((event.key === "z" && event.shiftKey) || event.key === "y") {
          event.preventDefault();
          redo();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  return {
    // State management
    stateManager,

    // Operations with undo/redo
    updateCell,
    applyFormatting,
    mergeCells,
    unmergeCells,
    bulkUpdate,

    // Undo/Redo operations
    undo,
    redo,
    clearHistory,

    // State queries
    canUndo: historyManager.canUndo(),
    canRedo: historyManager.canRedo(),
    undoDescription: historyManager.getUndoDescription(),
    redoDescription: historyManager.getRedoDescription(),

    // History information
    historySize: historyManager.getUndoStackSize(),
    historySummary: historyManager.getHistorySummary(),
  };
};
