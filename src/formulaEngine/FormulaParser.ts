// formulaEngine/FormulaParser.ts
import { FunctionRegistry } from "./FunctionRegistry";

export type ASTNode =
  | { type: "literal"; value: string | number | boolean }
  | { type: "cell"; cellId: string }
  | { type: "range"; start: string; end: string }
  | { type: "function"; name: string; args: ASTNode[] }
  | { type: "binary"; operator: string; left: ASTNode; right: ASTNode }
  | { type: "unary"; operator: string; operand: ASTNode };

export class FormulaParser {
  private registry: FunctionRegistry;

  constructor(registry: FunctionRegistry) {
    this.registry = registry;
  }

  parse(formula: string): ASTNode {
    // Remove the leading '=' if present
    const expression = formula.startsWith("=") ? formula.substring(1) : formula;

    return this.parseExpression(expression);
  }

  private parseExpression(expr: string): ASTNode {
    // This is a simplified parser - a real implementation would use
    // a proper tokenizer and recursive descent parser
    expr = expr.trim();

    // Check for cell reference
    const cellRefMatch = expr.match(/^[A-Z]+\d+$/);
    if (cellRefMatch) {
      return { type: "cell", cellId: expr };
    }

    // Check for cell range
    const rangeMatch = expr.match(/^([A-Z]+\d+):([A-Z]+\d+)$/);
    if (rangeMatch) {
      return { type: "range", start: rangeMatch[1], end: rangeMatch[2] };
    }

    // Check for function call
    const funcMatch = expr.match(/^([A-Z]+)\((.*)\)$/);
    if (funcMatch) {
      const funcName = funcMatch[1];
      const argsStr = funcMatch[2];

      // Validate function exists
      if (!this.registry.isFunctionRegistered(funcName)) {
        throw new Error(`Unknown function: ${funcName}`);
      }

      const args = this.parseArguments(argsStr);
      return { type: "function", name: funcName, args };
    }

    // Check for binary operations
    const operators = [
      "+",
      "-",
      "*",
      "/",
      "^",
      "=",
      ">",
      "<",
      ">=",
      "<=",
      "<>",
    ];
    for (const op of operators) {
      const index = expr.lastIndexOf(op);
      if (index > -1) {
        const left = this.parseExpression(expr.substring(0, index));
        const right = this.parseExpression(expr.substring(index + op.length));
        return { type: "binary", operator: op, left, right };
      }
    }

    // Check for unary operations
    if (expr.startsWith("-")) {
      return {
        type: "unary",
        operator: "-",
        operand: this.parseExpression(expr.substring(1)),
      };
    }

    // Try to parse as literal
    if (expr === "TRUE") return { type: "literal", value: true };
    if (expr === "FALSE") return { type: "literal", value: false };
    if (expr === "NULL" || expr === "") return { type: "literal", value: "" };

    const num = parseFloat(expr);
    if (!isNaN(num)) return { type: "literal", value: num };

    // String literal (quoted)
    if (expr.startsWith('"') && expr.endsWith('"')) {
      return { type: "literal", value: expr.slice(1, -1) };
    }

    throw new Error(`Unable to parse expression: ${expr}`);
  }

  private parseArguments(argsStr: string): ASTNode[] {
    const args: ASTNode[] = [];
    let current = "";
    let depth = 0;

    for (let i = 0; i < argsStr.length; i++) {
      const char = argsStr[i];

      if (char === "(") depth++;
      if (char === ")") depth--;

      if (char === "," && depth === 0) {
        args.push(this.parseExpression(current));
        current = "";
      } else {
        current += char;
      }
    }

    if (current.trim()) {
      args.push(this.parseExpression(current));
    }

    return args;
  }

  extractDependencies(node: ASTNode): string[] {
    const dependencies = new Set<string>();

    const traverse = (n: ASTNode) => {
      switch (n.type) {
        case "cell":
          dependencies.add(n.cellId);
          break;
        case "range":
          dependencies.add(n.start);
          dependencies.add(n.end);
          break;
        case "function":
        case "binary":
        case "unary":
          if ("args" in n) {
            n.args.forEach(traverse);
          }
          if ("left" in n) {
            traverse(n.left);
            traverse(n.right);
          }
          if ("operand" in n) {
            traverse(n.operand);
          }
          break;
      }
    };

    traverse(node);
    return Array.from(dependencies);
  }
}
