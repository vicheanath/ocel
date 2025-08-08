// commands/CommandFactory.ts
import type { ICommandFactory, IStateManager, ICommand } from "./interfaces";
import type { CellRange } from "../types";
import {
  CellUpdateCommand,
  DataChangeCommand,
  EnhancedMergeCommand,
} from "./ConcreteCommands";
import type { DataChangeSnapshot, CellSnapshot } from "./interfaces";

// Command Factory - Factory Pattern & Open/Closed Principle
export class CommandFactory implements ICommandFactory {
  private stateManager: IStateManager;

  constructor(stateManager: IStateManager) {
    this.stateManager = stateManager;
  }

  createCellUpdateCommand(
    cellId: string,
    newValue: string
    // oldValue parameter removed - we capture actual cell data instead
  ): CellUpdateCommand {
    return new CellUpdateCommand(this.stateManager, cellId, newValue);
  }

  createFormatCommand(
    cellIds: string[]
    // formatChanges parameter removed - enhanced version uses comprehensive snapshots
  ): ICommand {
    const currentState = this.stateManager.getCurrentState();
    const cellsSnapshot: Record<string, CellSnapshot | null> = {};

    cellIds.forEach((cellId) => {
      const cell = currentState[cellId];
      if (cell) {
        // Create comprehensive snapshot of current cell state
        cellsSnapshot[cellId] = {
          rawValue: cell.rawValue,
          computedValue: cell.computedValue,
          displayValue: cell.displayValue,
          style: { ...cell.style }, // Deep copy current style
          type: cell.type,
          formula: cell.formula,
        };
      } else {
        cellsSnapshot[cellId] = null;
      }
    });

    const snapshot: DataChangeSnapshot = {
      cellsSnapshot,
      affectedCells: cellIds,
      changeType: "format" as const,
    };

    return new DataChangeCommand(
      this.stateManager,
      snapshot,
      `Format cells: ${cellIds.join(", ")}`
    );
  }

  createMergeCommand(
    range: CellRange
    // Legacy parameters removed - enhanced version uses DataChangeSnapshot
  ): ICommand {
    return new EnhancedMergeCommand(this.stateManager, range);
  }

  createUnmergeCommand(
    cellId: string
    // Legacy parameters removed - enhanced version uses DataChangeSnapshot
  ): ICommand {
    const currentState = this.stateManager.getCurrentState();
    const cellsSnapshot: Record<string, CellSnapshot | null> = {};

    // Find all cells that will be affected by unmerge
    Object.keys(currentState).forEach((id) => {
      const cell = currentState[id];
      if (cell && cell.merged) {
        // Check if this merged cell will be affected by unmerge
        if (id === cellId || id.startsWith(cellId)) {
          cellsSnapshot[id] = {
            rawValue: cell.rawValue,
            computedValue: cell.computedValue,
            displayValue: cell.displayValue,
            style: { ...cell.style },
            type: cell.type,
            formula: cell.formula,
          };
        }
      }
    });

    const snapshot: DataChangeSnapshot = {
      cellsSnapshot,
      affectedCells: Object.keys(cellsSnapshot),
      changeType: "unmerge" as const,
    };

    return new DataChangeCommand(
      this.stateManager,
      snapshot,
      `Unmerge cells starting from ${cellId}`
    );
  }

  createBulkUpdateCommand(
    changes: Record<string, { newValue: string; oldValue: string }>
  ): DataChangeCommand {
    // Create a snapshot for bulk changes
    const currentState = this.stateManager.getCurrentState();
    const cellsSnapshot: Record<string, CellSnapshot | null> = {};
    const affectedCells = Object.keys(changes);

    affectedCells.forEach((cellId) => {
      const change = changes[cellId];
      const cell = currentState[cellId];

      // Create new cell data with the new value
      if (cell) {
        cellsSnapshot[cellId] = {
          rawValue: change.newValue,
          computedValue: change.newValue, // Will be recalculated by formula engine
          displayValue: change.newValue,
          formula: cell.formula,
          style: { ...cell.style },
          type: cell.type,
        };
      } else {
        // Create new cell
        cellsSnapshot[cellId] = {
          rawValue: change.newValue,
          computedValue: change.newValue,
          displayValue: change.newValue,
          style: {},
          type: "text" as const,
        };
      }
    });

    const snapshot: DataChangeSnapshot = {
      cellsSnapshot,
      affectedCells,
      changeType: "bulk",
    };

    return new DataChangeCommand(
      this.stateManager,
      snapshot,
      `Bulk update ${affectedCells.length} cells`
    );
  }

  // New method for creating comprehensive data change commands
  createDataChangeCommand(
    snapshot: DataChangeSnapshot,
    description: string
  ): DataChangeCommand {
    return new DataChangeCommand(this.stateManager, snapshot, description);
  }
}
