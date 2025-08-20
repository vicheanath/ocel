// formulaEngine/FormulaEngine.ts
import type { CellValue, SpreadsheetData } from "../types";
import { FunctionRegistry } from "./FunctionRegistry";
import { DependencyGraph } from "./DependencyGraph";
import { FormulaParser } from "./FormulaParser";
import { FormulaEvaluator } from "./FormulaEvaluator";

interface CachedResult {
  value: CellValue;
  timestamp: number;
  dependencyFingerprint: string; // Hash of dependencies' values
}

export class FormulaEngine {
  private parser: FormulaParser;
  private evaluator: FormulaEvaluator;
  private registry: FunctionRegistry;
  private dependencyGraph: DependencyGraph;
  private computationCache: Map<string, CachedResult> = new Map();
  private isCalculating = false;

  constructor() {
    this.registry = FunctionRegistry.getInstance();
    this.dependencyGraph = new DependencyGraph();
    this.parser = new FormulaParser(this.registry);
    this.evaluator = new FormulaEvaluator(this.registry, this.dependencyGraph);
  }

  // Main evaluation method with aggressive caching and incremental updates
  evaluate(
    cellId: string,
    formula: string,
    spreadsheetData: SpreadsheetData
  ): CellValue {
    try {
      // Check if we can use cached result
      const cachedResult = this.getCachedResultIfValid(cellId, spreadsheetData);
      if (cachedResult !== null) {
        return cachedResult;
      }

      const ast = this.parser.parse(formula);
      const computedValue = this.evaluator.evaluate(
        ast,
        cellId,
        spreadsheetData
      );

      // Update dependencies
      const dependencies = this.parser.extractDependencies(ast);
      this.dependencyGraph.updateDependencies(cellId, dependencies);

      // Cache the result
      const dependencyFingerprint = this.createDependencyFingerprint(
        dependencies,
        spreadsheetData
      );
      this.computationCache.set(cellId, {
        value: computedValue === null ? "" : computedValue,
        timestamp: Date.now(),
        dependencyFingerprint,
      });

      // Mark as clean in dependency graph
      this.dependencyGraph.markClean([cellId]);

      // Convert null to empty string to match CellValue type
      return computedValue === null ? "" : computedValue;
    } catch (error) {
      console.error(`Error evaluating formula for ${cellId}:`, error);
      return `#ERROR!`;
    }
  }

  // Optimized batch recalculation using topological sort
  recalculateAll(spreadsheetData: SpreadsheetData): SpreadsheetData {
    if (this.isCalculating) {
      return spreadsheetData;
    }

    this.isCalculating = true;
    const newData = { ...spreadsheetData };

    try {
      // Get cells that need recalculation in dependency order
      const dirtyCells = this.dependencyGraph.getDirtyCellsInOrder();

      if (dirtyCells.length === 0) {
        return newData;
      }

      // Process cells in topological order
      for (const cellId of dirtyCells) {
        const cell = newData[cellId];
        if (cell?.formula) {
          const newValue = this.evaluate(cellId, cell.formula, newData);
          newData[cellId] = {
            ...cell,
            computedValue: newValue,
            displayValue: this.formatCellValue(newValue),
          };
        }
      }

      // Clear dirty flags
      this.dependencyGraph.clearDirtyFlags();

      return newData;
    } finally {
      this.isCalculating = false;
    }
  }

  // Incremental recalculation when a cell changes
  recalculateFromCell(
    changedCellId: string,
    spreadsheetData: SpreadsheetData
  ): SpreadsheetData {
    if (this.isCalculating) {
      return spreadsheetData;
    }

    this.isCalculating = true;
    const newData = { ...spreadsheetData };

    try {
      // Mark the changed cell and its dependents as dirty
      this.dependencyGraph.markSubgraphDirty(changedCellId);

      // Invalidate cached results for affected cells
      this.invalidateCacheForCell(changedCellId);

      // Get affected cells in dependency order
      const affectedCells = this.dependencyGraph.getDirtyCellsInOrder();

      // Recalculate only affected cells
      for (const cellId of affectedCells) {
        const cell = newData[cellId];
        if (cell?.formula) {
          const newValue = this.evaluate(cellId, cell.formula, newData);
          newData[cellId] = {
            ...cell,
            computedValue: newValue,
            displayValue: this.formatCellValue(newValue),
          };
        }
      }

      return newData;
    } finally {
      this.isCalculating = false;
    }
  }

  // Check if cached result is still valid
  private getCachedResultIfValid(
    cellId: string,
    spreadsheetData: SpreadsheetData
  ): CellValue | null {
    const cached = this.computationCache.get(cellId);
    if (!cached) {
      return null;
    }

    // Check if dependencies have changed
    const dependencies = this.dependencyGraph.getDirectDependencies(cellId);
    const currentFingerprint = this.createDependencyFingerprint(
      dependencies,
      spreadsheetData
    );

    if (cached.dependencyFingerprint === currentFingerprint) {
      return cached.value;
    }

    // Cache is invalid, remove it
    this.computationCache.delete(cellId);
    return null;
  }

  // Create a fingerprint of dependency values for cache validation
  private createDependencyFingerprint(
    dependencies: string[],
    spreadsheetData: SpreadsheetData
  ): string {
    const values = dependencies
      .map((depId) => {
        const cell = spreadsheetData[depId];
        return cell ? `${depId}:${cell.computedValue}` : `${depId}:empty`;
      })
      .sort(); // Sort for consistent fingerprint

    return this.hashString(values.join("|"));
  }

  // Simple hash function for fingerprinting
  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  // Invalidate cache for a cell and all its dependents
  private invalidateCacheForCell(cellId: string) {
    this.computationCache.delete(cellId);

    const dependents = this.dependencyGraph.getAllDependents(cellId);
    dependents.forEach((dependent) => {
      this.computationCache.delete(dependent);
    });
  }

  // Format cell value for display
  private formatCellValue(value: CellValue): string {
    if (typeof value === "number") {
      // Format numbers with reasonable precision
      if (Number.isInteger(value)) {
        return value.toString();
      } else {
        return value.toFixed(10).replace(/\.?0+$/, "");
      }
    }
    return String(value);
  }

  // Batch processing for multiple cell updates
  batchEvaluate(
    updates: Array<{ cellId: string; formula: string }>,
    spreadsheetData: SpreadsheetData
  ): SpreadsheetData {
    if (this.isCalculating) {
      return spreadsheetData;
    }

    this.isCalculating = true;
    let newData = { ...spreadsheetData };

    try {
      // Mark all changed cells as dirty
      const changedCells = new Set<string>();

      for (const { cellId, formula } of updates) {
        changedCells.add(cellId);
        this.dependencyGraph.markSubgraphDirty(cellId);
        this.invalidateCacheForCell(cellId);

        // Update the cell's formula immediately
        if (newData[cellId]) {
          newData[cellId] = {
            ...newData[cellId],
            rawValue: formula,
            formula: formula.startsWith("=") ? formula : undefined,
            type: formula.startsWith("=") ? "formula" : "text",
          };
        }
      }

      // Recalculate all affected cells in dependency order
      newData = this.recalculateAll(newData);

      return newData;
    } finally {
      this.isCalculating = false;
    }
  }

  // Get performance statistics
  getPerformanceStats(): {
    cacheSize: number;
    cacheHitRate: number;
    dependencyStats: ReturnType<DependencyGraph["getStats"]>;
  } {
    const dependencyStats = this.dependencyGraph.getStats();

    return {
      cacheSize: this.computationCache.size,
      cacheHitRate: 0, // TODO: Track cache hits vs misses
      dependencyStats,
    };
  }

  // Clear all caches (useful for testing or memory cleanup)
  clearCaches() {
    this.computationCache.clear();
    this.dependencyGraph.clearDirtyFlags();
  }

  // Public methods for backward compatibility
  getDependents(cellId: string): string[] {
    return this.dependencyGraph.getDependents(cellId);
  }

  getFunctionMetadata(functionName: string) {
    return this.registry.getFunctionMetadata(functionName);
  }

  getAllFunctions() {
    return this.registry.getAllFunctions();
  }

  // Get calculation order for debugging
  getCalculationOrder(): string[] {
    return this.dependencyGraph.getTopologicalOrder();
  }

  // Check for circular dependencies
  hasCircularDependency(cellId: string): boolean {
    return this.dependencyGraph.hasCircularDependency(cellId);
  }
}
