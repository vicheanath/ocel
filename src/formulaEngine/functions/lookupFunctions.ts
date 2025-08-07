// Lookup and Reference Functions
import { FunctionRegistry } from "../FunctionRegistry";

export function registerLookupFunctions(registry: FunctionRegistry) {
  registry.register(
    "VLOOKUP",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      // Simplified VLOOKUP implementation
      if (args.length < 3) {
        throw new Error("VLOOKUP requires at least 3 arguments");
      }

      const lookupValue = args[0];
      const tableRange = args[1];
      const colIndex = parseInt(args[2]) - 1;
      const exactMatch = args[3] || false;

      if (!Array.isArray(tableRange)) {
        throw new Error("Second argument must be a range");
      }

      for (const row of tableRange) {
        if (exactMatch) {
          if (row[0] === lookupValue) {
            return row[colIndex];
          }
        } else {
          if (row[0].includes(lookupValue)) {
            return row[colIndex];
          }
        }
      }

      return "#N/A";
    },
    {
      description: "Looks for a value in the leftmost column of a table",
      syntax: "VLOOKUP(lookup_value, table_array, col_index, [range_lookup])",
      category: "Lookup",
      examples: ["VLOOKUP(A2, D2:F100, 3, FALSE)"],
    }
  );

  registry.register(
    "HLOOKUP",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length < 3) {
        throw new Error("HLOOKUP requires at least 3 arguments");
      }

      const lookupValue = args[0];
      const tableRange = args[1];
      const rowIndex = parseInt(args[2]) - 1;
      const exactMatch = args[3] || false;

      if (!Array.isArray(tableRange) || !Array.isArray(tableRange[0])) {
        throw new Error("Second argument must be a 2D array");
      }

      // Search in the first row
      const firstRow = tableRange[0];
      for (let i = 0; i < firstRow.length; i++) {
        if (exactMatch) {
          if (firstRow[i] === lookupValue) {
            return tableRange[rowIndex] ? tableRange[rowIndex][i] : "#REF!";
          }
        } else {
          if (String(firstRow[i]).includes(String(lookupValue))) {
            return tableRange[rowIndex] ? tableRange[rowIndex][i] : "#REF!";
          }
        }
      }

      return "#N/A";
    },
    {
      description: "Looks for a value in the top row of a table",
      syntax: "HLOOKUP(lookup_value, table_array, row_index, [range_lookup])",
      category: "Lookup",
      examples: ["HLOOKUP(A2, A1:F10, 3, FALSE)"],
    }
  );

  registry.register(
    "INDEX",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length < 2 || args.length > 3) {
        throw new Error(
          "INDEX requires 2 or 3 arguments: INDEX(array, row, [column])"
        );
      }

      const array = args[0];
      const rowIndex = parseInt(args[1]) - 1; // Convert to 0-based index
      const colIndex = args.length > 2 ? parseInt(args[2]) - 1 : 0; // Optional column index

      if (!Array.isArray(array)) {
        throw new Error("First argument must be an array or range");
      }

      // Handle 1D array (single column/row)
      if (!Array.isArray(array[0])) {
        if (rowIndex < 0 || rowIndex >= array.length) {
          return "#REF!";
        }
        return array[rowIndex];
      }

      // Handle 2D array (multiple rows/columns)
      if (rowIndex < 0 || rowIndex >= array.length) {
        return "#REF!";
      }
      if (colIndex < 0 || colIndex >= array[rowIndex].length) {
        return "#REF!";
      }

      return array[rowIndex][colIndex];
    },
    {
      description:
        "Returns the value of an element in a table or array, selected by row and column number",
      syntax: "INDEX(array, row, [column])",
      category: "Lookup",
      examples: ["INDEX(A1:C10, 3, 2)", "INDEX(A1:A10, 5)"],
    }
  );

  registry.register(
    "MATCH",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length < 2 || args.length > 3) {
        throw new Error("MATCH requires 2-3 arguments");
      }

      const lookupValue = args[0];
      const lookupArray = Array.isArray(args[1]) ? args[1].flat() : [args[1]];
      const matchType = args.length > 2 ? parseInt(args[2]) : 1;

      for (let i = 0; i < lookupArray.length; i++) {
        if (matchType === 0) {
          // Exact match
          if (lookupArray[i] === lookupValue) {
            return i + 1; // Excel is 1-based
          }
        } else if (matchType === 1) {
          // Largest value less than or equal to lookup_value
          if (parseFloat(lookupArray[i]) <= parseFloat(lookupValue)) {
            // Continue to find the largest such value
            if (
              i === lookupArray.length - 1 ||
              parseFloat(lookupArray[i + 1]) > parseFloat(lookupValue)
            ) {
              return i + 1;
            }
          }
        } else if (matchType === -1) {
          // Smallest value greater than or equal to lookup_value
          if (parseFloat(lookupArray[i]) >= parseFloat(lookupValue)) {
            return i + 1;
          }
        }
      }

      return "#N/A";
    },
    {
      description: "Returns the relative position of an item in an array",
      syntax: "MATCH(lookup_value, lookup_array, [match_type])",
      category: "Lookup",
      examples: ["MATCH(40, B2:B10, 0)", "MATCH(A1, 1:1, 0)"],
    }
  );

  registry.register(
    "INDIRECT",
    (args, context) => {
      if (args.length !== 1) {
        throw new Error("INDIRECT requires exactly 1 argument");
      }

      const cellReference = String(args[0]).toUpperCase();

      // Validate cell reference format (e.g., "A1", "B10", etc.)
      const cellIdPattern = /^[A-Z]+\d+$/;
      if (!cellIdPattern.test(cellReference)) {
        return "#REF!";
      }

      // Get the referenced cell value
      const cell = context.spreadsheetData[cellReference];
      if (!cell) {
        return 0; // Empty cell returns 0
      }

      // Return computed value for formula cells, display value for others
      return cell.type === "formula" ? cell.computedValue : cell.displayValue;
    },
    {
      description:
        "Returns the value specified by a text string representing a cell reference",
      syntax: "INDIRECT(ref_text)",
      category: "Lookup",
      examples: ['INDIRECT("A1")', 'INDIRECT("B"&ROW())'],
    }
  );

  registry.register(
    "OFFSET",
    (args, context) => {
      if (args.length < 3 || args.length > 5) {
        throw new Error(
          "OFFSET requires 3-5 arguments: OFFSET(reference, rows, cols, [height], [width])"
        );
      }

      const baseCell = String(args[0]).toUpperCase();
      const rowOffset = parseInt(args[1]) || 0;
      const colOffset = parseInt(args[2]) || 0;
      // height and width are optional for returning ranges (not implemented in this basic version)

      // Parse base cell reference
      const baseCellMatch = baseCell.match(/^([A-Z]+)(\d+)$/);
      if (!baseCellMatch) {
        return "#REF!";
      }

      const baseCol = baseCellMatch[1];
      const baseRow = parseInt(baseCellMatch[2]);

      // Calculate offset position
      let newCol = 0;
      for (let i = 0; i < baseCol.length; i++) {
        newCol = newCol * 26 + (baseCol.charCodeAt(i) - 65);
      }
      newCol += colOffset;

      const newRow = baseRow + rowOffset;

      // Convert back to cell reference
      if (newCol < 0 || newRow < 1) {
        return "#REF!";
      }

      let colPart = "";
      let c = newCol;
      while (c >= 0) {
        colPart = String.fromCharCode(65 + (c % 26)) + colPart;
        c = Math.floor(c / 26) - 1;
      }

      const targetCell = `${colPart}${newRow}`;
      const cell = context.spreadsheetData[targetCell];

      if (!cell) {
        return 0; // Empty cell returns 0
      }

      return cell.type === "formula" ? cell.computedValue : cell.displayValue;
    },
    {
      description:
        "Returns a reference offset from a given reference by a specified number of rows and columns",
      syntax: "OFFSET(reference, rows, cols, [height], [width])",
      category: "Lookup",
      examples: ["OFFSET(A1, 2, 3)", "OFFSET(B5, -1, 1)"],
    }
  );

  registry.register(
    "XLOOKUP",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length < 3 || args.length > 6) {
        throw new Error("XLOOKUP requires 3-6 arguments");
      }

      const lookupValue = args[0];
      const lookupArray = args[1];
      const returnArray = args[2];
      const ifNotFound = args[3] || "#N/A";
      const matchMode = args[4] || 0; // 0 = exact match
      const searchMode = args[5] || 1; // 1 = first to last

      if (!Array.isArray(lookupArray) || !Array.isArray(returnArray)) {
        throw new Error("Lookup and return arrays must be arrays");
      }

      if (lookupArray.length !== returnArray.length) {
        throw new Error("Lookup and return arrays must have the same length");
      }

      let foundIndex = -1;

      // Search for value
      for (let i = 0; i < lookupArray.length; i++) {
        const searchIndex = searchMode === -1 ? lookupArray.length - 1 - i : i;
        const cellValue = lookupArray[searchIndex];

        if (matchMode === 0) {
          // Exact match
          if (cellValue === lookupValue) {
            foundIndex = searchIndex;
            break;
          }
        } else if (matchMode === -1) {
          // Exact match or next smallest
          if (parseFloat(cellValue) <= parseFloat(lookupValue)) {
            foundIndex = searchIndex;
            if (cellValue === lookupValue) break;
          }
        } else if (matchMode === 1) {
          // Exact match or next largest
          if (parseFloat(cellValue) >= parseFloat(lookupValue)) {
            foundIndex = searchIndex;
            if (cellValue === lookupValue) break;
          }
        }
      }

      return foundIndex >= 0 ? returnArray[foundIndex] : ifNotFound;
    },
    {
      description:
        "Searches a range and returns an item corresponding to the first match",
      syntax:
        "XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode], [search_mode])",
      category: "Lookup",
      examples: ['XLOOKUP("Apple", A2:A10, B2:B10, "Not Found")'],
    }
  );

  registry.register(
    "FILTER",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length < 2 || args.length > 3) {
        throw new Error("FILTER requires 2-3 arguments");
      }

      const array = args[0];
      const include = args[1];
      const ifEmpty = args[2] || "#N/A";

      if (!Array.isArray(array) || !Array.isArray(include)) {
        throw new Error("Array and include arguments must be arrays");
      }

      if (array.length !== include.length) {
        throw new Error("Array and include must have the same length");
      }

      const filtered = [];
      for (let i = 0; i < array.length; i++) {
        if (include[i]) {
          filtered.push(array[i]);
        }
      }

      return filtered.length > 0 ? filtered : ifEmpty;
    },
    {
      description: "Filters a range of data based on criteria you define",
      syntax: "FILTER(array, include, [if_empty])",
      category: "Lookup",
      examples: ['FILTER(A2:A10, B2:B10>10, "No matches")'],
    }
  );

  registry.register(
    "UNIQUE",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length !== 1) {
        throw new Error("UNIQUE requires exactly 1 argument");
      }

      const array = args[0];
      if (!Array.isArray(array)) {
        throw new Error("Argument must be an array");
      }

      const unique = [];
      const seen = new Set();

      for (const value of array) {
        const stringValue = String(value);
        if (!seen.has(stringValue)) {
          seen.add(stringValue);
          unique.push(value);
        }
      }

      return unique;
    },
    {
      description: "Returns a list of unique values in a list or range",
      syntax: "UNIQUE(array)",
      category: "Lookup",
      examples: ["UNIQUE(A2:A10)"],
    }
  );
}
