# Undo/Redo System Documentation

## Overview

This undo/redo system for the React Spreadsheet application follows SOLID principles and design patterns to provide a robust, maintainable, and extensible solution for managing user actions and state changes.

## Architecture

### Design Patterns Used

1. **Command Pattern** - All user actions are encapsulated as command objects that can be executed and undone
2. **Factory Pattern** - Commands are created through a centralized factory
3. **State Manager Pattern** - Centralized state management with callbacks
4. **Observer Pattern** - State changes trigger UI updates through callbacks
5. **Template Method Pattern** - Base command class defines the execution flow

### SOLID Principles Applied

1. **Single Responsibility Principle (SRP)**

   - `HistoryManager` - Only manages command history
   - `StateManager` - Only manages spreadsheet state
   - Each command class has one specific responsibility

2. **Open/Closed Principle (OCP)**

   - Easy to add new command types without modifying existing code
   - Command factory can be extended with new command creators

3. **Liskov Substitution Principle (LSP)**

   - All commands implement the same `ICommand` interface
   - Commands can be used interchangeably

4. **Interface Segregation Principle (ISP)**

   - Separate interfaces for different responsibilities
   - `IStateManager`, `IHistoryManager`, `ICommandFactory`, `ICommand`

5. **Dependency Inversion Principle (DIP)**
   - High-level modules depend on abstractions (interfaces)
   - Commands depend on `IStateManager` interface, not concrete implementation

## Core Components

### 1. Command System (`src/commands/`)

#### Interfaces (`interfaces.ts`)

```typescript
ICommand - Base interface for all commands
IStateManager - Interface for state management
IHistoryManager - Interface for history management
ICommandFactory - Interface for command creation
```

#### Base Command (`BaseCommand.ts`)

Abstract base class that implements the Template Method pattern:

```typescript
abstract class BaseCommand implements ICommand {
  abstract execute(): void;
  abstract undo(): void;
  getDescription(): string;
  protected updateState(cellUpdates: Record<string, Partial<CellData>>): void;
}
```

#### Concrete Commands (`ConcreteCommands.ts`)

- `CellUpdateCommand` - Handles cell value changes
- `FormatCommand` - Handles formatting changes
- `MergeCommand` - Handles cell merging
- `UnmergeCommand` - Handles cell unmerging
- `BulkUpdateCommand` - Handles multiple cell updates
- `CompositeCommand` - Groups multiple commands

#### Command Factory (`CommandFactory.ts`)

Creates command instances using the Factory pattern:

```typescript
class CommandFactory implements ICommandFactory {
  createCellUpdateCommand(
    cellId: string,
    newValue: string,
    oldValue: string
  ): ICommand;
  createFormatCommand(
    cellIds: string[],
    newStyle: Partial<CellStyle>,
    oldStyles: Record<string, CellStyle>
  ): ICommand;
  // ... other factory methods
}
```

### 2. State Management (`src/state/`)

#### State Manager (`StateManager.ts`)

Centralized state management with callback support:

```typescript
class StateManager implements IStateManager {
  getCurrentState(): SpreadsheetData;
  setState(data: SpreadsheetData): void;
  getSelectedCell(): string;
  setSelectedCell(cellId: string): void;
  // ... other state management methods
}
```

### 3. History Management (`src/history/`)

#### History Manager (`HistoryManager.ts`)

Manages command execution and history:

```typescript
class HistoryManager implements IHistoryManager {
  executeCommand(command: ICommand): void;
  undo(): boolean;
  redo(): boolean;
  canUndo(): boolean;
  canRedo(): boolean;
  // ... other history methods
}
```

### 4. React Integration (`src/hooks/`)

#### useUndoRedo Hook (`useUndoRedo.ts`)

Custom React hook that integrates all components:

```typescript
const useUndoRedo = (
  initialData: SpreadsheetData,
  onDataChange: (data: SpreadsheetData) => void,
  onSelectionChange: (cell: string, range: CellRange | null) => void
) => {
  return {
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
    canUndo,
    canRedo,
    undoDescription,
    redoDescription,
    historySize,
  };
};
```

## Usage

### 1. Basic Integration

Replace your existing Spreadsheet component with the new `SpreadsheetWithUndoRedo`:

```typescript
// In your main App.tsx
import SpreadsheetWithUndoRedo from "./components/SpreadsheetWithUndoRedo";

function App() {
  return <SpreadsheetWithUndoRedo />;
}
```

### 2. Custom Implementation

For custom integration, use the `useUndoRedo` hook:

```typescript
import { useUndoRedo } from "./hooks/useUndoRedo";

const MySpreadsheet = () => {
  const [data, setData] = useState(initialData);

  const undoRedoSystem = useUndoRedo(initialData, setData, (cell, range) => {
    // Handle selection changes
  });

  const handleCellUpdate = (cellId: string, value: string) => {
    undoRedoSystem.updateCell(cellId, value);
  };

  return (
    <div>
      <button onClick={undoRedoSystem.undo} disabled={!undoRedoSystem.canUndo}>
        Undo
      </button>
      <button onClick={undoRedoSystem.redo} disabled={!undoRedoSystem.canRedo}>
        Redo
      </button>
      {/* Your spreadsheet components */}
    </div>
  );
};
```

### 3. Keyboard Shortcuts

The system automatically handles keyboard shortcuts:

- `Ctrl+Z` (or `Cmd+Z` on Mac) - Undo
- `Ctrl+Y` or `Ctrl+Shift+Z` (or `Cmd+Y`/`Cmd+Shift+Z` on Mac) - Redo

## Extending the System

### Adding New Commands

1. Create a new command class:

```typescript
export class MyCustomCommand extends BaseCommand {
  constructor(stateManager: IStateManager /* other params */) {
    super(stateManager, "My Custom Operation");
  }

  execute(): void {
    // Implementation
  }

  undo(): void {
    // Reverse the operation
  }
}
```

2. Add factory method:

```typescript
// In CommandFactory.ts
createMyCustomCommand(/* params */): MyCustomCommand {
  return new MyCustomCommand(this.stateManager, /* params */);
}

// In interfaces.ts
interface ICommandFactory {
  // ... existing methods
  createMyCustomCommand(/* params */): ICommand;
}
```

3. Use in your component:

```typescript
const command = commandFactory.createMyCustomCommand(/* params */);
historyManager.executeCommand(command);
```

### Custom State Managers

Implement the `IStateManager` interface for custom state handling:

```typescript
class MyCustomStateManager implements IStateManager {
  getCurrentState(): SpreadsheetData {
    /* implementation */
  }
  setState(data: SpreadsheetData): void {
    /* implementation */
  }
  // ... implement other required methods
}
```

## Features

### Current Capabilities

- ✅ Cell value updates
- ✅ Formatting changes (bold, italic, colors, etc.)
- ✅ Cell merging/unmerging
- ✅ Bulk operations (paste, import)
- ✅ Keyboard shortcuts (Ctrl+Z, Ctrl+Y)
- ✅ History size limiting (default: 100 operations)
- ✅ Operation descriptions for UI tooltips
- ✅ Formula engine integration
- ✅ Dependent cell updates

### Planned Enhancements

- [ ] Macro recording and playback
- [ ] Conditional undo/redo (skip certain operations)
- [ ] Branching history (multiple undo paths)
- [ ] Persistent history (save/load)
- [ ] Performance optimizations for large datasets

## Performance Considerations

### Memory Management

- History is limited to 100 operations by default (configurable)
- Old commands are automatically removed when limit is exceeded
- Efficient deep cloning only when necessary

### Optimization Strategies

- Commands store minimal data required for undo/redo
- Bulk operations are grouped into single commands
- State changes are batched to minimize re-renders

## Testing

### Unit Tests

```bash
# Run command tests
npm test commands

# Run state management tests
npm test state

# Run history tests
npm test history
```

### Integration Tests

```bash
# Run hook tests
npm test useUndoRedo

# Run component tests
npm test SpreadsheetWithUndoRedo
```

## Troubleshooting

### Common Issues

1. **Commands not executing**

   - Check if command factory is properly initialized
   - Verify state manager is connected

2. **Undo/Redo not working**

   - Ensure history manager is receiving commands
   - Check if commands implement undo() correctly

3. **Memory leaks**

   - Verify history size limit is set appropriately
   - Check for circular references in command data

4. **Performance issues**
   - Consider increasing batch size for bulk operations
   - Review command complexity and data storage

### Debug Information

Enable debug mode to see history information:

```typescript
// The SpreadsheetWithUndoRedo component includes debug info in development mode
// Check browser console for detailed history state
```

## Contributing

When contributing to the undo/redo system:

1. Follow SOLID principles
2. Add comprehensive tests
3. Update documentation
4. Consider backward compatibility
5. Performance impact assessment

## License

This undo/redo system is part of the React Sheet project and follows the same license terms.
