// formulaEngine/FormulaEvaluator.ts
import type { ASTNode } from "./FormulaParser";
import { FunctionRegistry } from "./FunctionRegistry";
import type { SpreadsheetData } from "../types";
import { DependencyGraph } from "./DependencyGraph";

type FormulaValue = string | number | boolean | null;

export class FormulaEvaluator {
  private registry: FunctionRegistry;
  private dependencyGraph: DependencyGraph;

  constructor(registry: FunctionRegistry, dependencyGraph: DependencyGraph) {
    this.registry = registry;
    this.dependencyGraph = dependencyGraph;
  }

  evaluate(
    node: ASTNode,
    currentCellId: string,
    spreadsheetData: SpreadsheetData
  ): FormulaValue {
    try {
      const result = this.evaluateNode(node, currentCellId, spreadsheetData);
      // If result is an array (from range), return the first value or empty string
      return Array.isArray(result) ? result[0] ?? "" : result;
    } catch (error) {
      console.error(`Evaluation error in cell ${currentCellId}:`, error);
      return `#ERROR!`;
    }
  }

  private evaluateNode(
    node: ASTNode,
    currentCellId: string,
    spreadsheetData: SpreadsheetData
  ): FormulaValue | FormulaValue[] {
    switch (node.type) {
      case "literal":
        return node.value;

      case "cell": {
        // Register dependency
        this.dependencyGraph.addDependency(currentCellId, node.cellId);

        const cell = spreadsheetData[node.cellId];
        if (!cell) return 0;

        // Return computed value for formula cells, display value for others
        return cell.type === "formula" ? cell.computedValue : cell.displayValue;
      }

      case "range": {
        // Register dependencies
        this.dependencyGraph.addDependency(currentCellId, node.start);
        this.dependencyGraph.addDependency(currentCellId, node.end);

        return this.getRangeValues(node.start, node.end, spreadsheetData);
      }

      case "function": {
        const args = node.args.map((arg) =>
          this.evaluateNode(arg, currentCellId, spreadsheetData)
        );

        return this.registry.execute(node.name, args, {
          cellId: currentCellId,
          spreadsheetData,
        });
      }

      case "binary":
        return this.evaluateBinaryOperation(
          node,
          currentCellId,
          spreadsheetData
        );

      case "unary":
        return this.evaluateUnaryOperation(
          node,
          currentCellId,
          spreadsheetData
        );
    }
  }

  private evaluateBinaryOperation(
    node: ASTNode & { type: "binary" },
    currentCellId: string,
    spreadsheetData: SpreadsheetData
  ): FormulaValue {
    const left = this.evaluateNode(node.left, currentCellId, spreadsheetData);
    const right = this.evaluateNode(node.right, currentCellId, spreadsheetData);

    // Helper function to convert to safe values
    const toSafeValue = (
      value: FormulaValue | FormulaValue[]
    ): string | number => {
      if (Array.isArray(value)) {
        const firstValue = value[0] ?? 0;
        if (typeof firstValue === "boolean") return firstValue ? 1 : 0;
        return firstValue;
      }
      if (value === null) return 0;
      if (typeof value === "boolean") return value ? 1 : 0;
      return value;
    };

    const leftSafe = toSafeValue(left);
    const rightSafe = toSafeValue(right);

    // Convert to numbers if possible
    const numLeft =
      typeof leftSafe === "number" ? leftSafe : parseFloat(String(leftSafe));
    const numRight =
      typeof rightSafe === "number" ? rightSafe : parseFloat(String(rightSafe));
    const isNumeric = !isNaN(numLeft) && !isNaN(numRight);

    switch (node.operator) {
      case "+":
        return isNumeric
          ? numLeft + numRight
          : String(leftSafe) + String(rightSafe);
      case "-":
        return isNumeric ? numLeft - numRight : 0;
      case "*":
        return isNumeric ? numLeft * numRight : 0;
      case "/":
        if (numRight === 0) return "#DIV/0!";
        return isNumeric ? numLeft / numRight : 0;
      case "^":
        return Math.pow(numLeft, numRight);
      case "=":
        return leftSafe === rightSafe;
      case ">":
        return leftSafe > rightSafe;
      case "<":
        return leftSafe < rightSafe;
      case ">=":
        return leftSafe >= rightSafe;
      case "<=":
        return leftSafe <= rightSafe;
      case "<>":
        return leftSafe !== rightSafe;
      default:
        throw new Error(`Unknown operator: ${node.operator}`);
    }
  }

  private evaluateUnaryOperation(
    node: ASTNode & { type: "unary" },
    currentCellId: string,
    spreadsheetData: SpreadsheetData
  ): FormulaValue {
    const operand = this.evaluateNode(
      node.operand,
      currentCellId,
      spreadsheetData
    );

    // Handle array values by taking the first element
    const safeOperand = Array.isArray(operand) ? operand[0] ?? 0 : operand ?? 0;
    const num =
      typeof safeOperand === "number"
        ? safeOperand
        : parseFloat(String(safeOperand));

    switch (node.operator) {
      case "-":
        return isNaN(num) ? 0 : -num;
      default:
        throw new Error(`Unknown unary operator: ${node.operator}`);
    }
  }

  private getRangeValues(
    startCellId: string,
    endCellId: string,
    spreadsheetData: SpreadsheetData
  ): FormulaValue[] {
    const values = [];
    const start = this.parseCellId(startCellId);
    const end = this.parseCellId(endCellId);

    const minRow = Math.min(start.row, end.row);
    const maxRow = Math.max(start.row, end.row);
    const minCol = Math.min(start.col, end.col);
    const maxCol = Math.max(start.col, end.col);

    for (let row = minRow; row <= maxRow; row++) {
      for (let col = minCol; col <= maxCol; col++) {
        const cellId = this.getCellId(row, col);
        const cell = spreadsheetData[cellId];

        if (cell) {
          values.push(
            cell.type === "formula" ? cell.computedValue : cell.displayValue
          );
        } else {
          values.push(null);
        }
      }
    }

    return values;
  }

  private parseCellId(cellId: string): { row: number; col: number } {
    const match = cellId.match(/^([A-Z]+)(\d+)$/);
    if (!match) throw new Error(`Invalid cell ID: ${cellId}`);

    const colLetters = match[1];
    const row = parseInt(match[2]);

    let col = 0;
    for (let i = 0; i < colLetters.length; i++) {
      col = col * 26 + (colLetters.charCodeAt(i) - 65);
    }

    return { row: row - 1, col };
  }

  private getCellId(row: number, col: number): string {
    let colPart = "";
    let c = col;

    while (c >= 0) {
      colPart = String.fromCharCode(65 + (c % 26)) + colPart;
      c = Math.floor(c / 26) - 1;
    }

    return `${colPart}${row + 1}`;
  }
}
