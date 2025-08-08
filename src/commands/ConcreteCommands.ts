// commands/ConcreteCommands.ts
import { BaseCommand } from "./BaseCommand";
import type {
  IStateManager,
  DataChangeSnapshot,
  CellSnapshot,
} from "./interfaces";
import type { CellRange, CellData } from "../types";
import { getCellsInRange, getCellId } from "../utils/spreadsheetUtils";

// Enhanced Data Change Command - Handles any type of data change
export class DataChangeCommand extends BaseCommand {
  private beforeSnapshot: DataChangeSnapshot | null = null;
  private snapshotData: DataChangeSnapshot;

  constructor(
    stateManager: IStateManager,
    snapshot: DataChangeSnapshot,
    description: string
    // oldValue parameter removed - comprehensive snapshot contains all needed data
  ) {
    super(stateManager, description);
    this.snapshotData = snapshot;
    // We'll capture the before state when execute() is called
  }

  private captureCurrentState(affectedCells: string[]): DataChangeSnapshot {
    const currentState = this.stateManager.getCurrentState();
    const cellsSnapshot: Record<string, CellSnapshot | null> = {};

    affectedCells.forEach((cellId) => {
      const cell = currentState[cellId];
      if (cell) {
        cellsSnapshot[cellId] = {
          rawValue: cell.rawValue,
          computedValue: cell.computedValue,
          displayValue: cell.displayValue,
          style: { ...cell.style },
          type: cell.type,
          formula: cell.formula,
        };
      } else {
        cellsSnapshot[cellId] = null;
      }
    });

    return {
      cellsSnapshot,
      affectedCells: affectedCells,
      changeType: this.snapshotData.changeType,
    };
  }

  execute(): void {
    // Capture current state before making changes
    if (!this.beforeSnapshot) {
      this.beforeSnapshot = this.captureCurrentState(
        this.snapshotData.affectedCells
      );
    }

    const currentState = this.stateManager.getCurrentState();
    const newState = { ...currentState };

    // Apply all cell changes from the snapshot data
    Object.entries(this.snapshotData.cellsSnapshot).forEach(
      ([cellId, cellSnapshot]) => {
        if (cellSnapshot === null) {
          // Cell should be deleted
          delete newState[cellId];
        } else {
          // Apply the cell snapshot
          newState[cellId] = {
            id: cellId,
            rawValue: cellSnapshot.rawValue,
            computedValue: cellSnapshot.computedValue,
            displayValue: cellSnapshot.displayValue,
            formula: cellSnapshot.formula,
            style: { ...cellSnapshot.style },
            type: cellSnapshot.type,
            merged: cellSnapshot.merged,
          } as CellData;
        }
      }
    );

    this.stateManager.setState(newState);
  }

  undo(): void {
    if (!this.beforeSnapshot) return;

    const currentState = this.stateManager.getCurrentState();
    const newState = { ...currentState };

    // Restore from before snapshot (the original state)
    Object.entries(this.beforeSnapshot.cellsSnapshot).forEach(
      ([cellId, cellSnapshot]) => {
        if (cellSnapshot === null) {
          // Cell should be deleted
          delete newState[cellId];
        } else {
          // Restore the original cell
          newState[cellId] = {
            id: cellId,
            rawValue: cellSnapshot.rawValue,
            computedValue: cellSnapshot.computedValue,
            displayValue: cellSnapshot.displayValue,
            formula: cellSnapshot.formula,
            style: { ...cellSnapshot.style },
            type: cellSnapshot.type,
            merged: cellSnapshot.merged,
          } as CellData;
        }
      }
    );

    this.stateManager.setState(newState);
  }
}

// Cell Update Command - Single Responsibility (Legacy, kept for compatibility)
export class CellUpdateCommand extends BaseCommand {
  private cellId: string;
  private newValue: string;
  private oldCellData: CellData | null = null;

  constructor(
    stateManager: IStateManager,
    cellId: string,
    newValue: string
    // oldValue parameter removed - we capture the actual cell data instead
  ) {
    super(stateManager, `Update cell ${cellId}`);
    this.cellId = cellId;
    this.newValue = newValue;
  }

  execute(): void {
    const currentState = this.stateManager.getCurrentState();
    this.oldCellData = currentState[this.cellId]
      ? { ...currentState[this.cellId] }
      : null;

    // This will trigger the formula engine and update dependents
    // The actual calculation should be handled by the state manager
    this.stateManager.setState({
      ...currentState,
      [this.cellId]: {
        ...currentState[this.cellId],
        rawValue: this.newValue,
      },
    });
  }

  undo(): void {
    const currentState = this.stateManager.getCurrentState();
    if (this.oldCellData) {
      this.stateManager.setState({
        ...currentState,
        [this.cellId]: this.oldCellData,
      });
    } else {
      const newState = { ...currentState };
      delete newState[this.cellId];
      this.stateManager.setState(newState);
    }
  }
}

// Enhanced Merge Command with full data tracking
export class EnhancedMergeCommand extends BaseCommand {
  private range: CellRange;
  private afterSnapshot: DataChangeSnapshot | null = null;

  constructor(stateManager: IStateManager, range: CellRange) {
    super(
      stateManager,
      `Merge cells ${getCellId(range.start)}:${getCellId(range.end)}`
    );
    this.range = range;
  }

  execute(): void {
    const currentState = this.stateManager.getCurrentState();
    const newState = { ...currentState };
    const cells = getCellsInRange(this.range);
    const masterCellId = getCellId(this.range.start);

    // Store after snapshot before changes
    this.afterSnapshot = this.createSnapshot(currentState, cells, "merge");

    // Merge logic: Set merged range on master cell and clear others
    if (newState[masterCellId]) {
      newState[masterCellId] = {
        ...newState[masterCellId],
        merged: this.range,
      };
    } else {
      // Create master cell if it doesn't exist
      newState[masterCellId] = {
        id: masterCellId,
        rawValue: "",
        computedValue: "",
        displayValue: "",
        style: {},
        type: "text",
        merged: this.range,
      } as CellData;
    }

    // Clear other cells in the range but preserve their data in the master cell if needed
    let mergedContent = "";

    cells.forEach((cellId) => {
      if (cellId !== masterCellId && newState[cellId]) {
        // Collect content from cells being merged
        if (newState[cellId].rawValue && !mergedContent) {
          mergedContent = newState[cellId].rawValue;
        }

        // Clear the cell
        newState[cellId] = {
          ...newState[cellId],
          rawValue: "",
          computedValue: "",
          displayValue: "",
          merged: undefined,
        };
      }
    });

    // Apply merged content to master cell if master was empty
    if (!newState[masterCellId].rawValue && mergedContent) {
      newState[masterCellId] = {
        ...newState[masterCellId],
        rawValue: mergedContent,
        computedValue: mergedContent,
        displayValue: mergedContent,
      };
    }

    this.stateManager.setState(newState);
  }

  undo(): void {
    if (!this.afterSnapshot) return;

    const currentState = this.stateManager.getCurrentState();
    const newState = { ...currentState };

    // Restore all cells from the after snapshot
    Object.entries(this.afterSnapshot.cellsSnapshot).forEach(
      ([cellId, cellSnapshot]) => {
        if (cellSnapshot === null) {
          delete newState[cellId];
        } else {
          newState[cellId] = {
            id: cellId,
            rawValue: cellSnapshot.rawValue,
            computedValue: cellSnapshot.computedValue,
            displayValue: cellSnapshot.displayValue,
            formula: cellSnapshot.formula,
            style: { ...cellSnapshot.style },
            type: cellSnapshot.type,
            merged: cellSnapshot.merged,
          } as CellData;
        }
      }
    );

    this.stateManager.setState(newState);
  }

  private createSnapshot(
    state: Record<string, CellData>,
    affectedCells: string[],
    changeType: DataChangeSnapshot["changeType"]
  ): DataChangeSnapshot {
    const cellsSnapshot: Record<string, CellSnapshot | null> = {};

    affectedCells.forEach((cellId) => {
      const cell = state[cellId];
      if (cell) {
        cellsSnapshot[cellId] = {
          rawValue: cell.rawValue,
          computedValue: cell.computedValue,
          displayValue: cell.displayValue,
          formula: cell.formula,
          style: { ...cell.style },
          type: cell.type,
          merged: cell.merged,
        };
      } else {
        cellsSnapshot[cellId] = null;
      }
    });

    return {
      cellsSnapshot,
      affectedCells: [...affectedCells],
      changeType,
      metadata: {
        rangeStart: `${this.range.start.row},${this.range.start.col}`,
        rangeEnd: `${this.range.end.row},${this.range.end.col}`,
      },
    };
  }
}

// Enhanced Unmerge Command
export class EnhancedUnmergeCommand extends BaseCommand {
  private cellId: string;
  private afterSnapshot: DataChangeSnapshot | null = null;

  constructor(stateManager: IStateManager, cellId: string) {
    super(stateManager, `Unmerge cell ${cellId}`);
    this.cellId = cellId;
  }

  execute(): void {
    const currentState = this.stateManager.getCurrentState();
    const newState = { ...currentState };
    const cell = newState[this.cellId];

    if (!cell?.merged) return; // Nothing to unmerge

    const affectedCells = getCellsInRange(cell.merged);

    // Store after snapshot before changes
    this.afterSnapshot = this.createSnapshot(
      currentState,
      affectedCells,
      "unmerge"
    );

    // Remove merge from the cell
    newState[this.cellId] = {
      ...cell,
      merged: undefined,
    };

    this.stateManager.setState(newState);
  }

  undo(): void {
    if (!this.afterSnapshot) return;

    const currentState = this.stateManager.getCurrentState();
    const newState = { ...currentState };

    // Restore from after snapshot (which includes the merged state)
    Object.entries(this.afterSnapshot.cellsSnapshot).forEach(
      ([cellId, cellSnapshot]) => {
        if (cellSnapshot === null) {
          delete newState[cellId];
        } else {
          newState[cellId] = {
            id: cellId,
            rawValue: cellSnapshot.rawValue,
            computedValue: cellSnapshot.computedValue,
            displayValue: cellSnapshot.displayValue,
            formula: cellSnapshot.formula,
            style: { ...cellSnapshot.style },
            type: cellSnapshot.type,
            merged: cellSnapshot.merged,
          } as CellData;
        }
      }
    );

    this.stateManager.setState(newState);
  }

  private createSnapshot(
    state: Record<string, CellData>,
    affectedCells: string[],
    changeType: DataChangeSnapshot["changeType"]
  ): DataChangeSnapshot {
    const cellsSnapshot: Record<string, CellSnapshot | null> = {};

    affectedCells.forEach((cellId) => {
      const cell = state[cellId];
      if (cell) {
        cellsSnapshot[cellId] = {
          rawValue: cell.rawValue,
          computedValue: cell.computedValue,
          displayValue: cell.displayValue,
          formula: cell.formula,
          style: { ...cell.style },
          type: cell.type,
          merged: cell.merged,
        };
      } else {
        cellsSnapshot[cellId] = null;
      }
    });

    return {
      cellsSnapshot,
      affectedCells: [...affectedCells],
      changeType,
    };
  }
}
