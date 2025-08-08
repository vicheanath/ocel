// state/StateManager.ts
import type { IStateManager } from "../commands/interfaces";
import type { SpreadsheetData, CellRange, CellData } from "../types";

// State Manager - Single Responsibility Principle
export class StateManager implements IStateManager {
  private data: SpreadsheetData;
  private selectedCell: string;
  private selectedRange: CellRange | null;
  private onStateChange?: (data: SpreadsheetData) => void;
  private onSelectionChange?: (cell: string, range: CellRange | null) => void;

  constructor(
    initialData: SpreadsheetData,
    onStateChange?: (data: SpreadsheetData) => void,
    onSelectionChange?: (cell: string, range: CellRange | null) => void
  ) {
    this.data = initialData;
    this.selectedCell = "A1";
    this.selectedRange = null;
    this.onStateChange = onStateChange;
    this.onSelectionChange = onSelectionChange;
  }

  getCurrentState(): SpreadsheetData {
    return this.data;
  }

  setState(data: SpreadsheetData): void {
    this.data = { ...data };
    this.onStateChange?.(this.data);
  }

  getSelectedCell(): string {
    return this.selectedCell;
  }

  setSelectedCell(cellId: string): void {
    this.selectedCell = cellId;
    this.onSelectionChange?.(this.selectedCell, this.selectedRange);
  }

  getSelectedRange(): CellRange | null {
    return this.selectedRange;
  }

  setSelectedRange(range: CellRange | null): void {
    this.selectedRange = range;
    this.onSelectionChange?.(this.selectedCell, this.selectedRange);
  }

  // Helper method to update both state and notify listeners
  updateState(updates: Record<string, CellData>): void {
    const newData = { ...this.data };
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        newData[key] = value;
      }
    });
    this.setState(newData);
  }

  // Helper method to get cell data safely
  getCellData(cellId: string) {
    return this.data[cellId];
  }

  // Helper method to check if cell exists
  hasCellData(cellId: string): boolean {
    return cellId in this.data && this.data[cellId] !== undefined;
  }
}
