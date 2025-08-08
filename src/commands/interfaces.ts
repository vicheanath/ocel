// commands/interfaces.ts
import type { SpreadsheetData, CellRange, CellStyle } from "../types";

// Command Pattern Interface - Single Responsibility Principle
export interface ICommand {
  execute(): void;
  undo(): void;
  getDescription(): string;
}

// State Manager Interface - Interface Segregation Principle
export interface IStateManager {
  getCurrentState(): SpreadsheetData;
  setState(data: SpreadsheetData): void;
  getSelectedCell(): string;
  setSelectedCell(cellId: string): void;
  getSelectedRange(): CellRange | null;
  setSelectedRange(range: CellRange | null): void;
}

// History Manager Interface - Single Responsibility Principle
export interface IHistoryManager {
  executeCommand(command: ICommand): void;
  undo(): boolean;
  redo(): boolean;
  canUndo(): boolean;
  canRedo(): boolean;
  getUndoDescription(): string | null;
  getRedoDescription(): string | null;
  clear(): void;
}

// Comprehensive data change tracking
export interface CellSnapshot {
  rawValue: string;
  computedValue: string | number | boolean;
  displayValue: string;
  formula?: string;
  style: CellStyle;
  type: "text" | "number" | "formula" | "boolean";
  merged?: CellRange;
}

export interface DataChangeSnapshot {
  cellsSnapshot: Record<string, CellSnapshot | null>; // null means cell was deleted
  affectedCells: string[];
  changeType:
    | "cell-update"
    | "format"
    | "merge"
    | "unmerge"
    | "bulk"
    | "composite";
  metadata?: Record<string, string | number | boolean>;
}

// Merge operation data types (kept for compatibility)
export interface MergeData {
  range: CellRange;
  cellData: Record<string, string>;
}

export interface AffectedCellData {
  rawValue: string;
  computedValue: string | number | boolean;
  displayValue: string;
}

// Command Factory Interface - Open/Closed Principle
export interface ICommandFactory {
  createCellUpdateCommand(
    cellId: string,
    newValue: string
    // oldValue parameter removed - we capture actual cell data instead
  ): ICommand;
  createFormatCommand(
    cellIds: string[]
    // formatChanges parameter removed - enhanced version uses comprehensive snapshots
  ): ICommand;
  createMergeCommand(
    range: CellRange
    // Legacy parameters removed - enhanced version uses DataChangeSnapshot
  ): ICommand;
  createUnmergeCommand(
    cellId: string
    // Legacy parameters removed - enhanced version uses DataChangeSnapshot
  ): ICommand;
  createBulkUpdateCommand(
    changes: Record<string, { newValue: string; oldValue: string }>
  ): ICommand;
}
