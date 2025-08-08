// commands/index.ts
export * from "./interfaces";
export { BaseCommand } from "./BaseCommand";
export { CommandFactory } from "./CommandFactory";
export * from "./ConcreteCommands";

// Re-export types for easier importing
export type {
  ICommand,
  IStateManager,
  IHistoryManager,
  ICommandFactory,
  MergeData,
  AffectedCellData,
} from "./interfaces";
