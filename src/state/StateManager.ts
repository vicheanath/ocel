// state/StateManager.ts - High-performance state manager with graph algorithms
import type { IStateManager } from "../commands/interfaces";
import type { SpreadsheetData, CellRange, CellData } from "../types";

// Spatial partitioning for fast cell lookups
class SpatialPartition {
  private partitions: Map<string, Set<string>> = new Map();
  private readonly PARTITION_SIZE = 10;

  private getPartitionKey(row: number, col: number): string {
    const partitionRow = Math.floor(row / this.PARTITION_SIZE);
    const partitionCol = Math.floor(col / this.PARTITION_SIZE);
    return `${partitionRow},${partitionCol}`;
  }

  addCell(cellId: string, row: number, col: number) {
    const key = this.getPartitionKey(row, col);
    if (!this.partitions.has(key)) {
      this.partitions.set(key, new Set());
    }
    this.partitions.get(key)!.add(cellId);
  }

  removeCell(cellId: string, row: number, col: number) {
    const key = this.getPartitionKey(row, col);
    const partition = this.partitions.get(key);
    if (partition) {
      partition.delete(cellId);
      if (partition.size === 0) {
        this.partitions.delete(key);
      }
    }
  }

  getCellsInRegion(
    startRow: number,
    startCol: number,
    endRow: number,
    endCol: number
  ): Set<string> {
    const result = new Set<string>();

    const startPartitionRow = Math.floor(startRow / this.PARTITION_SIZE);
    const startPartitionCol = Math.floor(startCol / this.PARTITION_SIZE);
    const endPartitionRow = Math.floor(endRow / this.PARTITION_SIZE);
    const endPartitionCol = Math.floor(endCol / this.PARTITION_SIZE);

    for (let pRow = startPartitionRow; pRow <= endPartitionRow; pRow++) {
      for (let pCol = startPartitionCol; pCol <= endPartitionCol; pCol++) {
        const key = `${pRow},${pCol}`;
        const partition = this.partitions.get(key);
        if (partition) {
          partition.forEach((cellId) => result.add(cellId));
        }
      }
    }

    return result;
  }
}

// Change tracking for optimized updates
interface ChangeSet {
  added: Map<string, CellData>;
  modified: Map<string, { old: CellData; new: CellData }>;
  deleted: Set<string>;
  timestamp: number;
}

// State Manager with Graph Algorithms and Performance Optimizations
export class StateManager implements IStateManager {
  private data: SpreadsheetData;
  private selectedCell: string;
  private selectedRange: CellRange | null;
  private spatialIndex: SpatialPartition;
  private changeHistory: ChangeSet[] = [];
  private cellCache: Map<string, { data: CellData; hash: string }> = new Map();

  // Callbacks
  private onStateChange?: (data: SpreadsheetData) => void;
  private onSelectionChange?: (cell: string, range: CellRange | null) => void;

  // Performance monitoring
  private metrics = {
    stateUpdates: 0,
    cacheHits: 0,
    cacheMisses: 0,
    spatialLookups: 0,
  };

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
    this.spatialIndex = new SpatialPartition();

    // Build initial spatial index
    this.rebuildSpatialIndex();
  }

  // Rebuild spatial index from current data
  private rebuildSpatialIndex() {
    this.spatialIndex = new SpatialPartition();
    Object.keys(this.data).forEach((cellId) => {
      const { row, col } = this.parseCellId(cellId);
      this.spatialIndex.addCell(cellId, row, col);
    });
  }

  // Parse cell ID to row/col coordinates
  private parseCellId(cellId: string): { row: number; col: number } {
    const match = cellId.match(/^([A-Z]+)(\d+)$/);
    if (!match) throw new Error(`Invalid cell ID: ${cellId}`);

    const colLetters = match[1];
    const row = parseInt(match[2]) - 1;

    let col = 0;
    for (let i = 0; i < colLetters.length; i++) {
      col = col * 26 + (colLetters.charCodeAt(i) - 65);
    }

    return { row, col };
  }

  // Simple hash function
  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return hash.toString();
  }

  // Get cell data with caching
  private getCachedCellData(cellId: string): CellData | undefined {
    const cached = this.cellCache.get(cellId);
    if (cached) {
      const currentCell = this.data[cellId];
      if (currentCell) {
        const currentHash = this.hashString(JSON.stringify(currentCell));
        if (cached.hash === currentHash) {
          this.metrics.cacheHits++;
          return cached.data;
        }
      }
      // Cache is invalid
      this.cellCache.delete(cellId);
    }

    this.metrics.cacheMisses++;
    const cellData = this.data[cellId];
    if (cellData) {
      const hash = this.hashString(JSON.stringify(cellData));
      this.cellCache.set(cellId, { data: cellData, hash });
    }

    return cellData;
  }

  getCurrentState(): SpreadsheetData {
    return this.data;
  }

  setState(data: SpreadsheetData): void {
    const oldData = { ...this.data };
    this.data = { ...data };

    // Track changes for optimization
    const changeSet = this.computeChangeSet(oldData, this.data);
    this.changeHistory.push(changeSet);

    // Limit history size
    if (this.changeHistory.length > 100) {
      this.changeHistory.shift();
    }

    // Update spatial index incrementally
    this.updateSpatialIndexFromChanges(changeSet);

    this.metrics.stateUpdates++;

    this.onStateChange?.(this.data);
  }

  // Compute what changed between two states
  private computeChangeSet(
    oldData: SpreadsheetData,
    newData: SpreadsheetData
  ): ChangeSet {
    const changeSet: ChangeSet = {
      added: new Map(),
      modified: new Map(),
      deleted: new Set(),
      timestamp: Date.now(),
    };

    // Find added and modified cells
    Object.keys(newData).forEach((cellId) => {
      if (!oldData[cellId]) {
        changeSet.added.set(cellId, newData[cellId]);
      } else {
        const oldHash = this.hashString(JSON.stringify(oldData[cellId]));
        const newHash = this.hashString(JSON.stringify(newData[cellId]));
        if (oldHash !== newHash) {
          changeSet.modified.set(cellId, {
            old: oldData[cellId],
            new: newData[cellId],
          });
        }
      }
    });

    // Find deleted cells
    Object.keys(oldData).forEach((cellId) => {
      if (!newData[cellId]) {
        changeSet.deleted.add(cellId);
      }
    });

    return changeSet;
  }

  // Update spatial index based on changes
  private updateSpatialIndexFromChanges(changeSet: ChangeSet) {
    // Handle deleted cells
    changeSet.deleted.forEach((cellId) => {
      try {
        const { row, col } = this.parseCellId(cellId);
        this.spatialIndex.removeCell(cellId, row, col);
      } catch {
        // Invalid cell ID, skip
      }
    });

    // Handle added cells
    changeSet.added.forEach((_, cellId) => {
      try {
        const { row, col } = this.parseCellId(cellId);
        this.spatialIndex.addCell(cellId, row, col);
      } catch {
        // Invalid cell ID, skip
      }
    });

    // Modified cells don't change position, so no spatial index update needed
  }

  getSelectedCell(): string {
    return this.selectedCell;
  }

  setSelectedCell(cellId: string): void {
    if (this.selectedCell !== cellId) {
      this.selectedCell = cellId;
      this.onSelectionChange?.(this.selectedCell, this.selectedRange);
    }
  }

  getSelectedRange(): CellRange | null {
    return this.selectedRange;
  }

  setSelectedRange(range: CellRange | null): void {
    if (JSON.stringify(this.selectedRange) !== JSON.stringify(range)) {
      this.selectedRange = range;
      this.onSelectionChange?.(this.selectedCell, this.selectedRange);
    }
  }

  // Optimized batch update with spatial awareness
  updateState(updates: Record<string, CellData>): void {
    const newData = { ...this.data };
    const affectedRegions = new Set<string>();

    // Apply updates and track affected regions
    Object.entries(updates).forEach(([cellId, cellData]) => {
      if (cellData !== undefined) {
        newData[cellId] = cellData;

        // Track which spatial partitions are affected
        try {
          const { row, col } = this.parseCellId(cellId);
          const partitionKey = `${Math.floor(row / 10)},${Math.floor(
            col / 10
          )}`;
          affectedRegions.add(partitionKey);
        } catch {
          // Invalid cell ID, skip spatial tracking
        }
      }
    });

    this.setState(newData);
  }

  // Get cells in a region efficiently using spatial indexing
  getCellsInRegion(
    startRow: number,
    startCol: number,
    endRow: number,
    endCol: number
  ): CellData[] {
    this.metrics.spatialLookups++;

    const cellIds = this.spatialIndex.getCellsInRegion(
      startRow,
      startCol,
      endRow,
      endCol
    );
    const result: CellData[] = [];

    cellIds.forEach((cellId) => {
      try {
        const { row, col } = this.parseCellId(cellId);
        if (
          row >= startRow &&
          row <= endRow &&
          col >= startCol &&
          col <= endCol
        ) {
          const cellData = this.getCachedCellData(cellId);
          if (cellData) {
            result.push(cellData);
          }
        }
      } catch {
        // Invalid cell ID, skip
      }
    });

    return result;
  }

  // Get recently changed cells for incremental updates
  getRecentChanges(since?: number): ChangeSet[] {
    const threshold = since || Date.now() - 5000; // Default: last 5 seconds
    return this.changeHistory.filter(
      (changeSet) => changeSet.timestamp >= threshold
    );
  }

  // Helper method to update a single cell efficiently
  updateCell(cellId: string, updates: Partial<CellData>): void {
    const existingCell = this.getCachedCellData(cellId);
    const newCell = existingCell
      ? { ...existingCell, ...updates }
      : {
          id: cellId,
          rawValue: "",
          computedValue: "",
          displayValue: "",
          type: "text" as const,
          style: {
            fontSize: 14,
            textColor: "#000000",
            backgroundColor: "#ffffff",
            horizontalAlign: "left" as const,
            verticalAlign: "top" as const,
          },
          ...updates,
        };

    this.updateState({ [cellId]: newCell });
  }

  // Legacy methods for backward compatibility
  getCellData(cellId: string): CellData | undefined {
    return this.getCachedCellData(cellId);
  }

  hasCellData(cellId: string): boolean {
    return cellId in this.data && this.data[cellId] !== undefined;
  }

  // Performance monitoring
  getPerformanceMetrics() {
    return {
      ...this.metrics,
      cacheSize: this.cellCache.size,
      historySize: this.changeHistory.length,
      cacheHitRate:
        this.metrics.cacheHits /
          (this.metrics.cacheHits + this.metrics.cacheMisses) || 0,
    };
  }

  // Clear caches for memory management
  clearCaches() {
    this.cellCache.clear();
    this.changeHistory = [];
  }

  // Optimize state by removing empty cells and compacting data
  optimizeState() {
    const optimizedData: SpreadsheetData = {};

    Object.entries(this.data).forEach(([cellId, cellData]) => {
      // Keep cell if it has content or custom styling
      if (
        cellData.rawValue ||
        cellData.style?.backgroundColor !== "#ffffff" ||
        cellData.style?.textColor !== "#000000" ||
        cellData.style?.bold ||
        cellData.style?.italic ||
        cellData.merged
      ) {
        optimizedData[cellId] = cellData;
      }
    });

    this.setState(optimizedData);
    this.clearCaches();
    this.rebuildSpatialIndex();
  }
}
