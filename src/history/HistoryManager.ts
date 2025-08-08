// history/HistoryManager.ts
import type { IHistoryManager, ICommand } from "../commands/interfaces";

// History Manager - Single Responsibility Principle
export class HistoryManager implements IHistoryManager {
  private undoStack: ICommand[] = [];
  private redoStack: ICommand[] = [];
  private maxHistorySize: number;

  constructor(maxHistorySize: number = 100) {
    this.maxHistorySize = maxHistorySize;
  }

  executeCommand(command: ICommand): void {
    // Execute the command
    command.execute();

    // Add to undo stack
    this.undoStack.push(command);

    // Clear redo stack since we're executing a new command
    this.redoStack = [];

    // Maintain history size limit
    if (this.undoStack.length > this.maxHistorySize) {
      this.undoStack.shift(); // Remove oldest command
    }
  }

  undo(): boolean {
    if (this.undoStack.length === 0) {
      return false;
    }

    const command = this.undoStack.pop();
    if (command) {
      command.undo();
      this.redoStack.push(command);
      return true;
    }
    return false;
  }

  redo(): boolean {
    if (this.redoStack.length === 0) {
      return false;
    }

    const command = this.redoStack.pop();
    if (command) {
      command.execute();
      this.undoStack.push(command);
      return true;
    }
    return false;
  }

  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  getUndoDescription(): string | null {
    if (this.undoStack.length === 0) {
      return null;
    }
    const lastCommand = this.undoStack[this.undoStack.length - 1];
    return `Undo: ${lastCommand.getDescription()}`;
  }

  getRedoDescription(): string | null {
    if (this.redoStack.length === 0) {
      return null;
    }
    const nextCommand = this.redoStack[this.redoStack.length - 1];
    return `Redo: ${nextCommand.getDescription()}`;
  }

  clear(): void {
    this.undoStack = [];
    this.redoStack = [];
  }

  // Additional utility methods
  getUndoStackSize(): number {
    return this.undoStack.length;
  }

  getRedoStackSize(): number {
    return this.redoStack.length;
  }

  // Get history summary for debugging
  getHistorySummary(): { undoCommands: string[]; redoCommands: string[] } {
    return {
      undoCommands: this.undoStack.map((cmd) => cmd.getDescription()),
      redoCommands: this.redoStack.map((cmd) => cmd.getDescription()),
    };
  }
}
