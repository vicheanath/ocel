// formulaEngine/DependencyGraph.ts
export class DependencyGraph {
  private graph: Map<string, Set<string>>;

  constructor() {
    this.graph = new Map();
  }

  addDependency(dependentCellId: string, referencedCellId: string) {
    if (!this.graph.has(referencedCellId)) {
      this.graph.set(referencedCellId, new Set());
    }
    this.graph.get(referencedCellId)!.add(dependentCellId);
  }

  removeDependency(dependentCellId: string, referencedCellId: string) {
    if (this.graph.has(referencedCellId)) {
      const dependents = this.graph.get(referencedCellId)!;
      dependents.delete(dependentCellId);
      
      if (dependents.size === 0) {
        this.graph.delete(referencedCellId);
      }
    }
  }

  removeAllDependenciesForCell(cellId: string) {
    // Remove this cell as a dependent from all referenced cells
    for (const [referenced, dependents] of this.graph) {
      if (dependents.has(cellId)) {
        dependents.delete(cellId);
        if (dependents.size === 0) {
          this.graph.delete(referenced);
        }
      }
    }
    
    // Remove any dependencies this cell might have
    this.graph.delete(cellId);
  }

  getDependents(cellId: string): string[] {
    return Array.from(this.graph.get(cellId) || []);
  }

  getDirectDependencies(cellId: string): string[] {
    const dependencies: string[] = [];
    for (const [referenced, dependents] of this.graph) {
      if (dependents.has(cellId)) {
        dependencies.push(referenced);
      }
    }
    return dependencies;
  }

  updateDependencies(cellId: string, newDependencies: string[]) {
    // Remove existing dependencies
    this.removeAllDependenciesForCell(cellId);
    
    // Add new dependencies
    newDependencies.forEach(depId => {
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
}