// formulaEngine/FormulaEngine.ts
import type { CellValue, SpreadsheetData } from "../types";
import { FunctionRegistry } from "./FunctionRegistry";
import { DependencyGraph } from "./DependencyGraph";
import { FormulaParser } from "./FormulaParser";
import { FormulaEvaluator } from "./FormulaEvaluator";

export class FormulaEngine {
  private parser: FormulaParser;
  private evaluator: FormulaEvaluator;
  private registry: FunctionRegistry;
  private dependencyGraph: DependencyGraph;

  constructor() {
    this.registry = FunctionRegistry.getInstance();
    this.dependencyGraph = new DependencyGraph();
    this.parser = new FormulaParser(this.registry);
    this.evaluator = new FormulaEvaluator(this.registry, this.dependencyGraph);
  }

  evaluate(
    cellId: string,
    formula: string,
    spreadsheetData: SpreadsheetData
  ): CellValue {
    try {
      const ast = this.parser.parse(formula);
      const computedValue = this.evaluator.evaluate(
        ast,
        cellId,
        spreadsheetData
      );

      // Update dependencies
      const dependencies = this.parser.extractDependencies(ast);
      this.dependencyGraph.updateDependencies(cellId, dependencies);

      // Convert null to empty string to match CellValue type
      return computedValue === null ? "" : computedValue;
    } catch (error) {
      console.error(`Error evaluating formula for ${cellId}:`, error);
      return `#ERROR!`;
    }
  }

  getDependents(cellId: string): string[] {
    return this.dependencyGraph.getDependents(cellId);
  }

  getFunctionMetadata(functionName: string) {
    return this.registry.getFunctionMetadata(functionName);
  }

  getAllFunctions() {
    return this.registry.getAllFunctions();
  }
}
