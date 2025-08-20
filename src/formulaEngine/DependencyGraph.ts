// formulaEngine/DependencyGraph.ts

interface DependencyNode {
  dependents: Set<string>; // Cells that depend on this cell
  dependencies: Set<string>; // Cells this cell depends on
  level: number; // Topological depth for efficient sorting
}

export class DependencyGraph {
  private graph: Map<string, DependencyNode>;
  private topologicalCache: string[] | null = null;
  private invalidCacheSet = new Set<string>(); // Track what needs recalculation

  constructor() {
    this.graph = new Map();
  }

  private getOrCreateNode(cellId: string): DependencyNode {
    if (!this.graph.has(cellId)) {
      this.graph.set(cellId, {
        dependents: new Set(),
        dependencies: new Set(),
        level: 0,
      });
    }
    return this.graph.get(cellId)!;
  }

  addDependency(dependentCellId: string, referencedCellId: string) {
    const referencedNode = this.getOrCreateNode(referencedCellId);
    const dependentNode = this.getOrCreateNode(dependentCellId);

    // Add bidirectional references
    referencedNode.dependents.add(dependentCellId);
    dependentNode.dependencies.add(referencedCellId);

    // Invalidate topological cache
    this.topologicalCache = null;

    // Mark dependent cell and its dependents as dirty
    this.markSubgraphDirty(dependentCellId);
  }

  removeDependency(dependentCellId: string, referencedCellId: string) {
    const referencedNode = this.graph.get(referencedCellId);
    const dependentNode = this.graph.get(dependentCellId);

    if (referencedNode) {
      referencedNode.dependents.delete(dependentCellId);
      if (
        referencedNode.dependents.size === 0 &&
        referencedNode.dependencies.size === 0
      ) {
        this.graph.delete(referencedCellId);
      }
    }

    if (dependentNode) {
      dependentNode.dependencies.delete(referencedCellId);
      if (
        dependentNode.dependents.size === 0 &&
        dependentNode.dependencies.size === 0
      ) {
        this.graph.delete(dependentCellId);
      }
    }

    this.topologicalCache = null;
  }

  removeAllDependenciesForCell(cellId: string) {
    const node = this.graph.get(cellId);
    if (!node) return;

    // Remove from all dependencies
    for (const dep of node.dependencies) {
      const depNode = this.graph.get(dep);
      if (depNode) {
        depNode.dependents.delete(cellId);
        if (depNode.dependents.size === 0 && depNode.dependencies.size === 0) {
          this.graph.delete(dep);
        }
      }
    }

    // Remove from all dependents
    for (const dependent of node.dependents) {
      const dependentNode = this.graph.get(dependent);
      if (dependentNode) {
        dependentNode.dependencies.delete(cellId);
      }
    }

    this.graph.delete(cellId);
    this.topologicalCache = null;
    this.invalidCacheSet.delete(cellId);
  }

  getDependents(cellId: string): string[] {
    const node = this.graph.get(cellId);
    return node ? Array.from(node.dependents) : [];
  }

  getDirectDependencies(cellId: string): string[] {
    const node = this.graph.get(cellId);
    return node ? Array.from(node.dependencies) : [];
  }

  // Get all transitive dependencies (deep dependencies)
  getAllDependencies(cellId: string): Set<string> {
    const visited = new Set<string>();
    const stack = [cellId];

    while (stack.length > 0) {
      const current = stack.pop()!;
      if (visited.has(current)) continue;

      visited.add(current);
      const dependencies = this.getDirectDependencies(current);
      stack.push(...dependencies);
    }

    visited.delete(cellId); // Remove self
    return visited;
  }

  // Get all transitive dependents (cells affected by this cell)
  getAllDependents(cellId: string): Set<string> {
    const visited = new Set<string>();
    const stack = [cellId];

    while (stack.length > 0) {
      const current = stack.pop()!;
      if (visited.has(current)) continue;

      visited.add(current);
      const dependents = this.getDependents(current);
      stack.push(...dependents);
    }

    visited.delete(cellId); // Remove self
    return visited;
  }

  updateDependencies(cellId: string, newDependencies: string[]) {
    // Remove existing dependencies
    this.removeAllDependenciesForCell(cellId);

    // Add new dependencies
    newDependencies.forEach((depId) => {
      this.addDependency(cellId, depId);
    });
  }

  hasCircularDependency(startCellId: string): boolean {
    const visited = new Set<string>();
    const stack = new Set<string>();

    const dfs = (currentId: string): boolean => {
      if (stack.has(currentId)) return true;
      if (visited.has(currentId)) return false;

      visited.add(currentId);
      stack.add(currentId);

      const dependents = this.getDependents(currentId);
      for (const dep of dependents) {
        if (dfs(dep)) return true;
      }

      stack.delete(currentId);
      return false;
    };

    return dfs(startCellId);
  }

  // Topological sort for efficient formula recalculation
  getTopologicalOrder(): string[] {
    if (this.topologicalCache) {
      return this.topologicalCache;
    }

    const result: string[] = [];
    const visited = new Set<string>();
    const temp = new Set<string>();

    const visit = (cellId: string): boolean => {
      if (temp.has(cellId)) {
        // Circular dependency detected
        return false;
      }
      if (visited.has(cellId)) {
        return true;
      }

      temp.add(cellId);
      const dependencies = this.getDirectDependencies(cellId);

      for (const dep of dependencies) {
        if (!visit(dep)) {
          return false;
        }
      }

      temp.delete(cellId);
      visited.add(cellId);
      result.push(cellId);

      return true;
    };

    // Visit all nodes
    for (const cellId of this.graph.keys()) {
      if (!visited.has(cellId)) {
        if (!visit(cellId)) {
          // Circular dependency found, return empty order
          return [];
        }
      }
    }

    this.topologicalCache = result;
    return result;
  }

  // Get cells that need recalculation in dependency order
  getDirtyCellsInOrder(): string[] {
    if (this.invalidCacheSet.size === 0) {
      return [];
    }

    const topOrder = this.getTopologicalOrder();
    const dirtyCells = topOrder.filter((cellId) =>
      this.invalidCacheSet.has(cellId)
    );

    return dirtyCells;
  }

  // Mark a cell and all its dependents as dirty
  markSubgraphDirty(cellId: string) {
    const dependents = this.getAllDependents(cellId);
    this.invalidCacheSet.add(cellId);
    dependents.forEach((dep) => this.invalidCacheSet.add(dep));
  }

  // Mark cells as clean after recalculation
  markClean(cellIds: string[]) {
    cellIds.forEach((cellId) => this.invalidCacheSet.delete(cellId));
  }

  // Check if a cell is dirty (needs recalculation)
  isDirty(cellId: string): boolean {
    return this.invalidCacheSet.has(cellId);
  }

  // Get all dirty cells
  getDirtyCells(): Set<string> {
    return new Set(this.invalidCacheSet);
  }

  // Clear all dirty flags
  clearDirtyFlags() {
    this.invalidCacheSet.clear();
  }

  // Get calculation levels for efficient parallel processing
  getCalculationLevels(): string[][] {
    const topOrder = this.getTopologicalOrder();
    const levels: string[][] = [];
    const cellLevels = new Map<string, number>();

    // Calculate level for each cell
    for (const cellId of topOrder) {
      const dependencies = this.getDirectDependencies(cellId);
      const maxDepLevel = Math.max(
        0,
        ...dependencies.map((dep) => cellLevels.get(dep) || 0)
      );
      const level = maxDepLevel + 1;

      cellLevels.set(cellId, level);

      // Add to appropriate level array
      while (levels.length <= level) {
        levels.push([]);
      }
      levels[level].push(cellId);
    }

    return levels.filter((level) => level.length > 0);
  }

  // Analyze dependency statistics for optimization
  getStats(): {
    totalNodes: number;
    totalEdges: number;
    maxDepth: number;
    avgDependents: number;
    avgDependencies: number;
    circularDependencies: boolean;
  } {
    const totalNodes = this.graph.size;
    let totalEdges = 0;
    let maxDepth = 0;
    let totalDependents = 0;
    let totalDependencies = 0;

    for (const [, node] of this.graph) {
      totalEdges += node.dependents.size;
      totalDependents += node.dependents.size;
      totalDependencies += node.dependencies.size;
    }

    const levels = this.getCalculationLevels();
    maxDepth = levels.length;

    return {
      totalNodes,
      totalEdges,
      maxDepth,
      avgDependents: totalNodes > 0 ? totalDependents / totalNodes : 0,
      avgDependencies: totalNodes > 0 ? totalDependencies / totalNodes : 0,
      circularDependencies: this.getTopologicalOrder().length === 0,
    };
  }
}
