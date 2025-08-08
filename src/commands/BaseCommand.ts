// commands/BaseCommand.ts
import type { ICommand, IStateManager } from "./interfaces";
import type { CellData } from "../types";

// Abstract Command Class - Template Method Pattern
export abstract class BaseCommand implements ICommand {
  protected stateManager: IStateManager;
  protected description: string;

  constructor(stateManager: IStateManager, description: string) {
    this.stateManager = stateManager;
    this.description = description;
  }

  abstract execute(): void;
  abstract undo(): void;

  getDescription(): string {
    return this.description;
  }

  protected updateState(cellUpdates: Record<string, Partial<CellData>>): void {
    const currentState = this.stateManager.getCurrentState();
    const newState = { ...currentState };

    Object.entries(cellUpdates).forEach(([cellId, cellData]) => {
      if (cellData && newState[cellId]) {
        newState[cellId] = { ...currentState[cellId], ...cellData };
      } else if (cellData) {
        newState[cellId] = cellData as CellData;
      }
    });

    this.stateManager.setState(newState);
  }
}
