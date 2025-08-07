// Logical Functions
import { FunctionRegistry } from "../FunctionRegistry";

export function registerLogicalFunctions(registry: FunctionRegistry) {
  registry.register(
    "IF",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length < 2 || args.length > 3) {
        throw new Error("IF requires 2 or 3 arguments");
      }
      return args[0] ? args[1] : args[2] || false;
    },
    {
      description:
        "Returns one value if a condition is true and another value if it's false",
      syntax: "IF(condition, value_if_true, [value_if_false])",
      category: "Logical",
      examples: ['IF(A1>10, "High", "Low")'],
    }
  );

  registry.register(
    "AND",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      return args.flat().every((arg) => Boolean(arg));
    },
    {
      description: "Returns TRUE if all conditions are TRUE",
      syntax: "AND(logical1, [logical2], ...)",
      category: "Logical",
      examples: ["AND(A1>5, B1<10)", "AND(TRUE, TRUE, FALSE)"],
    }
  );

  registry.register(
    "OR",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      return args.flat().some((arg) => Boolean(arg));
    },
    {
      description: "Returns TRUE if any condition is TRUE",
      syntax: "OR(logical1, [logical2], ...)",
      category: "Logical",
      examples: ["OR(A1>5, B1<10)", "OR(FALSE, FALSE, TRUE)"],
    }
  );

  registry.register(
    "NOT",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length !== 1) throw new Error("NOT requires exactly 1 argument");
      return !args[0];
    },
    {
      description: "Reverses the logic of its argument",
      syntax: "NOT(logical)",
      category: "Logical",
      examples: ["NOT(TRUE)", "NOT(A1>5)"],
    }
  );

  registry.register(
    "XOR",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      const trueCount = args.flat().filter((arg) => Boolean(arg)).length;
      return trueCount % 2 === 1;
    },
    {
      description: "Returns TRUE if an odd number of conditions are TRUE",
      syntax: "XOR(logical1, [logical2], ...)",
      category: "Logical",
      examples: ["XOR(TRUE, FALSE)", "XOR(A1>5, B1<10, C1=0)"],
    }
  );

  registry.register(
    "IFERROR",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length !== 2)
        throw new Error("IFERROR requires exactly 2 arguments");
      try {
        const result = args[0];
        return typeof result === "string" && result.startsWith("#")
          ? args[1]
          : result;
      } catch {
        return args[1];
      }
    },
    {
      description:
        "Returns a value you specify if a formula evaluates to an error",
      syntax: "IFERROR(value, value_if_error)",
      category: "Logical",
      examples: ['IFERROR(A1/B1, "Division by zero")'],
    }
  );

  registry.register(
    "IFNA",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length !== 2)
        throw new Error("IFNA requires exactly 2 arguments");
      return args[0] === "#N/A" ? args[1] : args[0];
    },
    {
      description:
        "Returns a value you specify if the expression resolves to #N/A",
      syntax: "IFNA(value, value_if_na)",
      category: "Logical",
      examples: ['IFNA(VLOOKUP(A1, B:C, 2, FALSE), "Not found")'],
    }
  );

  registry.register(
    "LET",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length < 3 || args.length % 2 === 0) {
        throw new Error(
          "LET requires an odd number of arguments (name1, value1, ..., calculation)"
        );
      }

      // Create a temporary context with variable assignments
      const variables = new Map();

      // Process name-value pairs
      for (let i = 0; i < args.length - 1; i += 2) {
        const varName = String(args[i]);
        const varValue = args[i + 1];
        variables.set(varName, varValue);
      }

      // Return the final calculation (last argument)
      // In a full implementation, this would substitute variables in the calculation
      return args[args.length - 1];
    },
    {
      description: "Assigns names to calculation results",
      syntax: "LET(name1, value1, [name2, value2, ...], calculation)",
      category: "Logical",
      examples: ["LET(x, A1*2, y, B1*3, x+y)"],
    }
  );

  registry.register(
    "SWITCH",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length < 3)
        throw new Error("SWITCH requires at least 3 arguments");

      const expression = args[0];
      const hasDefault = args.length % 2 === 0;
      const defaultValue = hasDefault ? args[args.length - 1] : "#N/A";

      // Check value-result pairs
      for (let i = 1; i < args.length - (hasDefault ? 1 : 0); i += 2) {
        if (expression === args[i]) {
          return args[i + 1];
        }
      }

      return defaultValue;
    },
    {
      description:
        "Evaluates an expression and returns the corresponding value",
      syntax:
        "SWITCH(expression, value1, result1, [value2, result2], ..., [default])",
      category: "Logical",
      examples: ['SWITCH(A1, 1, "One", 2, "Two", 3, "Three", "Other")'],
    }
  );

  registry.register(
    "TRUE",
    () => {
      return true;
    },
    {
      description: "Returns the logical value TRUE",
      syntax: "TRUE()",
      category: "Logical",
      examples: ["TRUE()", "IF(TRUE(), 1, 0)"],
    }
  );

  registry.register(
    "FALSE",
    () => {
      return false;
    },
    {
      description: "Returns the logical value FALSE",
      syntax: "FALSE()",
      category: "Logical",
      examples: ["FALSE()", "IF(FALSE(), 1, 0)"],
    }
  );

  registry.register(
    "IFS",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length < 2 || args.length % 2 !== 0) {
        throw new Error(
          "IFS requires an even number of arguments (pairs of condition and value)"
        );
      }

      // Check condition-value pairs
      for (let i = 0; i < args.length; i += 2) {
        if (args[i]) {
          return args[i + 1];
        }
      }

      throw new Error("#N/A - No conditions met in IFS");
    },
    {
      description:
        "Checks whether one or more conditions are met and returns a value that corresponds to the first TRUE condition",
      syntax: "IFS(condition1, value1, [condition2, value2], ...)",
      category: "Logical",
      examples: ['IFS(A1>90, "A", A1>80, "B", A1>70, "C", TRUE(), "F")'],
    }
  );

  // Advanced array functions (simplified implementations)
  registry.register(
    "MAKEARRAY",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length !== 3) {
        throw new Error(
          "MAKEARRAY requires exactly 3 arguments (rows, columns, lambda)"
        );
      }

      const rows = parseInt(args[0] as string);
      const cols = parseInt(args[1] as string);
      const lambda = args[2]; // In a full implementation, this would be a function

      if (rows <= 0 || cols <= 0) {
        throw new Error("Rows and columns must be positive integers");
      }

      const result: number[][] = [];
      for (let r = 0; r < rows; r++) {
        const row: number[] = [];
        for (let c = 0; c < cols; c++) {
          // Simplified: just return row*cols + col as placeholder
          // In full implementation, would apply lambda function with r, c parameters
          if (typeof lambda === "function") {
            row.push(lambda(r + 1, c + 1));
          } else {
            row.push(r * cols + c + 1);
          }
        }
        result.push(row);
      }

      return result.flat(); // Flatten to return as CellValue[]
    },
    {
      description:
        "Returns a calculated array of a specified row and column size, by applying a LAMBDA",
      syntax: "MAKEARRAY(rows, cols, lambda)",
      category: "Logical",
      examples: ["MAKEARRAY(3, 3, LAMBDA(r,c,r*c))"],
    }
  );

  registry.register(
    "MAP",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length < 2) {
        throw new Error("MAP requires at least 2 arguments (array and lambda)");
      }

      const array = args[0];
      const lambda = args[args.length - 1]; // Last argument is the lambda

      if (!Array.isArray(array)) {
        throw new Error("First argument must be an array");
      }

      // Simplified implementation - in full version would handle multiple arrays and proper lambda
      return array.map((item) => {
        if (typeof lambda === "function") {
          return lambda(item);
        } else {
          // Placeholder transformation
          return typeof item === "number" ? item * 2 : item;
        }
      });
    },
    {
      description:
        "Returns an array formed by mapping each value in the array(s) to a new value by applying a LAMBDA",
      syntax: "MAP(array1, [array2, ...], lambda)",
      category: "Logical",
      examples: ["MAP(A1:A5, LAMBDA(x, x*2))"],
    }
  );

  registry.register(
    "REDUCE",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length !== 3) {
        throw new Error(
          "REDUCE requires exactly 3 arguments (initial_value, array, lambda)"
        );
      }

      const initialValue = args[0];
      const array = args[1];
      const lambda = args[2];

      if (!Array.isArray(array)) {
        throw new Error("Second argument must be an array");
      }

      let accumulator = initialValue;
      for (const item of array.flat()) {
        if (typeof lambda === "function") {
          accumulator = lambda(accumulator, item);
        } else {
          // Simplified: just sum numeric values
          const num = parseFloat(item);
          if (!isNaN(num)) {
            accumulator = (parseFloat(accumulator) || 0) + num;
          }
        }
      }

      return accumulator;
    },
    {
      description:
        "Reduces an array to an accumulated value by applying a LAMBDA to each value and returning the total value in the accumulator",
      syntax: "REDUCE(initial_value, array, lambda)",
      category: "Logical",
      examples: ["REDUCE(0, A1:A5, LAMBDA(acc, val, acc + val))"],
    }
  );

  registry.register(
    "SCAN",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length !== 3) {
        throw new Error(
          "SCAN requires exactly 3 arguments (initial_value, array, lambda)"
        );
      }

      const initialValue = args[0];
      const array = args[1];
      const lambda = args[2];

      if (!Array.isArray(array)) {
        throw new Error("Second argument must be an array");
      }

      const result = [initialValue];
      let accumulator = initialValue;

      for (const item of array.flat()) {
        if (typeof lambda === "function") {
          accumulator = lambda(accumulator, item);
        } else {
          // Simplified: just sum numeric values
          const num = parseFloat(item);
          if (!isNaN(num)) {
            accumulator = (parseFloat(accumulator) || 0) + num;
          }
        }
        result.push(accumulator);
      }

      return result;
    },
    {
      description:
        "Scans an array by applying a LAMBDA to each value and returns an array that has each intermediate value",
      syntax: "SCAN(initial_value, array, lambda)",
      category: "Logical",
      examples: ["SCAN(0, A1:A5, LAMBDA(acc, val, acc + val))"],
    }
  );

  registry.register(
    "BYROW",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length !== 2) {
        throw new Error("BYROW requires exactly 2 arguments (array, lambda)");
      }

      const array = args[0];
      const lambda = args[1];

      if (!Array.isArray(array)) {
        throw new Error("First argument must be an array");
      }

      // Ensure we have a 2D array
      const matrix = Array.isArray(array[0]) ? array : [array];

      const result: number[] = [];
      for (const row of matrix) {
        if (typeof lambda === "function") {
          result.push(lambda(row));
        } else {
          // Simplified: return sum of row
          const sum = row.reduce(
            (acc: number, val: unknown) => acc + (parseFloat(String(val)) || 0),
            0
          );
          result.push(sum);
        }
      }

      return result;
    },
    {
      description:
        "Applies a LAMBDA to each row and returns an array of the results",
      syntax: "BYROW(array, lambda)",
      category: "Logical",
      examples: ["BYROW(A1:C3, LAMBDA(row, SUM(row)))"],
    }
  );

  registry.register(
    "BYCOL",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length !== 2) {
        throw new Error("BYCOL requires exactly 2 arguments (array, lambda)");
      }

      const array = args[0];
      const lambda = args[1];

      if (!Array.isArray(array)) {
        throw new Error("First argument must be an array");
      }

      // Ensure we have a 2D array
      const matrix = Array.isArray(array[0]) ? array : [array];

      if (matrix.length === 0) return [];

      const numCols = Math.max(...matrix.map((row) => row.length));
      const result = [];

      for (let col = 0; col < numCols; col++) {
        const column = matrix.map((row) => row[col] || "");
        if (typeof lambda === "function") {
          result.push(lambda(column));
        } else {
          // Simplified: return sum of column
          const sum = column.reduce(
            (acc, val) => acc + (parseFloat(val) || 0),
            0
          );
          result.push(sum);
        }
      }

      return result;
    },
    {
      description:
        "Applies a LAMBDA to each column and returns an array of the results",
      syntax: "BYCOL(array, lambda)",
      category: "Logical",
      examples: ["BYCOL(A1:C3, LAMBDA(col, SUM(col)))"],
    }
  );

  registry.register(
    "LAMBDA",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      // LAMBDA is a special function that creates reusable custom functions
      // This is a simplified placeholder implementation
      // In a full implementation, this would create a proper function object

      if (args.length < 2) {
        throw new Error(
          "LAMBDA requires at least 2 arguments (parameters and calculation)"
        );
      }

      // Return the calculation result directly (simplified)
      // In a full implementation, this would create a proper lambda function
      return args[args.length - 1];
    },
    {
      description:
        "Create custom, reusable functions and call them by a friendly name",
      syntax: "LAMBDA(parameter1, [parameter2, ...], calculation)",
      category: "Logical",
      examples: ["LAMBDA(x, y, x*y)", "LAMBDA(x, x^2 + 2*x + 1)"],
    }
  );
}
