// Information Functions
import { FunctionRegistry } from "../FunctionRegistry";

export function registerInformationFunctions(registry: FunctionRegistry) {
  registry.register(
    "ISBLANK",
    (args) => {
      if (args.length !== 1) throw new Error("ISBLANK requires 1 argument");
      return args[0] === "" || args[0] === null || args[0] === undefined;
    },
    {
      description: "Returns TRUE if the value is blank",
      syntax: "ISBLANK(value)",
      category: "Information",
      examples: ["ISBLANK(A1)"],
    }
  );

  registry.register(
    "ISERROR",
    (args) => {
      if (args.length !== 1) throw new Error("ISERROR requires 1 argument");
      const value = args[0];
      return (
        value instanceof Error ||
        (typeof value === "string" &&
          (value.startsWith("#") ||
            value === "#ERROR!" ||
            value === "#VALUE!" ||
            value === "#REF!" ||
            value === "#NAME?" ||
            value === "#NUM!" ||
            value === "#N/A" ||
            value === "#DIV/0!"))
      );
    },
    {
      description: "Returns TRUE if the value is an error",
      syntax: "ISERROR(value)",
      category: "Information",
      examples: ["ISERROR(A1/0)"],
    }
  );

  registry.register(
    "ISLOGICAL",
    (args) => {
      if (args.length !== 1) throw new Error("ISLOGICAL requires 1 argument");
      return typeof args[0] === "boolean";
    },
    {
      description: "Returns TRUE if the value is a logical value",
      syntax: "ISLOGICAL(value)",
      category: "Information",
      examples: ["ISLOGICAL(TRUE)"],
    }
  );

  registry.register(
    "ISNA",
    (args) => {
      if (args.length !== 1) throw new Error("ISNA requires 1 argument");
      return args[0] === "#N/A" || args[0] === "#NA";
    },
    {
      description: "Returns TRUE if the value is #N/A",
      syntax: "ISNA(value)",
      category: "Information",
      examples: ["ISNA(#N/A)"],
    }
  );

  registry.register(
    "ISNONTEXT",
    (args) => {
      if (args.length !== 1) throw new Error("ISNONTEXT requires 1 argument");
      return typeof args[0] !== "string";
    },
    {
      description: "Returns TRUE if the value is not text",
      syntax: "ISNONTEXT(value)",
      category: "Information",
      examples: ["ISNONTEXT(123)"],
    }
  );

  registry.register(
    "ISNUMBER",
    (args) => {
      if (args.length !== 1) throw new Error("ISNUMBER requires 1 argument");
      return typeof args[0] === "number" && !isNaN(args[0]);
    },
    {
      description: "Returns TRUE if the value is a number",
      syntax: "ISNUMBER(value)",
      category: "Information",
      examples: ["ISNUMBER(123)"],
    }
  );

  registry.register(
    "ISODD",
    (args) => {
      if (args.length !== 1) throw new Error("ISODD requires 1 argument");
      const num = parseFloat(args[0]);
      if (isNaN(num)) throw new Error("ISODD requires a numeric value");
      return Math.abs(Math.floor(num)) % 2 === 1;
    },
    {
      description: "Returns TRUE if the number is odd",
      syntax: "ISODD(number)",
      category: "Information",
      examples: ["ISODD(3)"],
    }
  );

  registry.register(
    "ISEVEN",
    (args) => {
      if (args.length !== 1) throw new Error("ISEVEN requires 1 argument");
      const num = parseFloat(args[0]);
      if (isNaN(num)) throw new Error("ISEVEN requires a numeric value");
      return Math.abs(Math.floor(num)) % 2 === 0;
    },
    {
      description: "Returns TRUE if the number is even",
      syntax: "ISEVEN(number)",
      category: "Information",
      examples: ["ISEVEN(4)"],
    }
  );

  registry.register(
    "ISTEXT",
    (args) => {
      if (args.length !== 1) throw new Error("ISTEXT requires 1 argument");
      return typeof args[0] === "string" && args[0] !== "";
    },
    {
      description: "Returns TRUE if the value is text",
      syntax: "ISTEXT(value)",
      category: "Information",
      examples: ['ISTEXT("Hello")'],
    }
  );

  registry.register(
    "TYPE",
    (args) => {
      if (args.length !== 1) throw new Error("TYPE requires 1 argument");
      const value = args[0];

      if (typeof value === "number") return 1;
      if (typeof value === "string" && value !== "") return 2;
      if (typeof value === "boolean") return 4;
      if (
        value instanceof Error ||
        (typeof value === "string" && value.startsWith("#"))
      )
        return 16;
      if (Array.isArray(value)) return 64;

      return 1; // Default to number for empty/undefined
    },
    {
      description: "Returns a number indicating the data type of a value",
      syntax: "TYPE(value)",
      category: "Information",
      examples: ["TYPE(123)", 'TYPE("text")', "TYPE(TRUE)"],
    }
  );

  registry.register(
    "N",
    (args) => {
      if (args.length !== 1) throw new Error("N requires 1 argument");
      const value = args[0];

      if (typeof value === "number") return value;
      if (typeof value === "boolean") return value ? 1 : 0;
      if (value instanceof Date) return value.getTime();

      return 0;
    },
    {
      description: "Returns a value converted to a number",
      syntax: "N(value)",
      category: "Information",
      examples: ["N(TRUE)", 'N("123")', "N(FALSE)"],
    }
  );

  registry.register(
    "NA",
    () => {
      return "#N/A";
    },
    {
      description: "Returns the error value #N/A",
      syntax: "NA()",
      category: "Information",
      examples: ["NA()"],
    }
  );

  registry.register(
    "ERROR.TYPE",
    (args) => {
      if (args.length !== 1) throw new Error("ERROR.TYPE requires 1 argument");
      const value = args[0];

      if (value === "#NULL!" || value === "#ERROR!") return 1;
      if (value === "#DIV/0!") return 2;
      if (value === "#VALUE!") return 3;
      if (value === "#REF!") return 4;
      if (value === "#NAME?") return 5;
      if (value === "#NUM!") return 6;
      if (value === "#N/A" || value === "#NA") return 7;

      throw new Error("Value is not an error");
    },
    {
      description: "Returns a number corresponding to an error type",
      syntax: "ERROR.TYPE(error_val)",
      category: "Information",
      examples: ["ERROR.TYPE(#DIV/0!)"],
    }
  );

  registry.register(
    "INFO",
    (args) => {
      if (args.length !== 1) throw new Error("INFO requires 1 argument");
      const type = args[0].toLowerCase();

      switch (type) {
        case "directory":
          return "/";
        case "numfile":
          return 1;
        case "origin":
          return 0;
        case "osversion":
          return "Web Browser";
        case "recalc":
          return "Automatic";
        case "release":
          return "16.0";
        case "system":
          return "pc";
        default:
          throw new Error("Unknown info type");
      }
    },
    {
      description:
        "Returns information about the current operating environment",
      syntax: "INFO(type_text)",
      category: "Information",
      examples: ['INFO("system")', 'INFO("release")'],
    }
  );

  registry.register(
    "ISERR",
    (args) => {
      if (args.length !== 1) throw new Error("ISERR requires 1 argument");
      const value = args[0];
      const isError =
        value instanceof Error ||
        (typeof value === "string" &&
          (value.startsWith("#") ||
            value === "#ERROR!" ||
            value === "#VALUE!" ||
            value === "#REF!" ||
            value === "#NAME?" ||
            value === "#NUM!" ||
            value === "#DIV/0!"));
      // ISERR returns TRUE for all errors EXCEPT #N/A
      return isError && value !== "#N/A" && value !== "#NA";
    },
    {
      description: "Returns TRUE if the value is any error value except #N/A",
      syntax: "ISERR(value)",
      category: "Information",
      examples: ["ISERR(A1/0)", "ISERR(#VALUE!)"],
    }
  );

  registry.register(
    "ISFORMULA",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length !== 1) throw new Error("ISFORMULA requires 1 argument");
      // In a full implementation, this would check if the referenced cell contains a formula
      // For now, we'll return false as a placeholder since we'd need cell reference context
      return false;
    },
    {
      description:
        "Returns TRUE if there is a reference to a cell that contains a formula",
      syntax: "ISFORMULA(reference)",
      category: "Information",
      examples: ["ISFORMULA(A1)"],
    }
  );

  registry.register(
    "ISREF",
    (args) => {
      if (args.length !== 1) throw new Error("ISREF requires 1 argument");
      const value = args[0];
      // In Excel, this checks if the value is a cell reference
      // For our implementation, we'll check if it's a string that looks like a cell reference
      if (typeof value === "string") {
        const cellRefPattern = /^[A-Z]+[1-9]\d*$/;
        const rangeRefPattern = /^[A-Z]+[1-9]\d*:[A-Z]+[1-9]\d*$/;
        return cellRefPattern.test(value) || rangeRefPattern.test(value);
      }
      return false;
    },
    {
      description: "Returns TRUE if the value is a reference",
      syntax: "ISREF(value)",
      category: "Information",
      examples: ["ISREF(A1)", "ISREF(A1:B10)"],
    }
  );

  registry.register(
    "ISOMITTED",
    (args) => {
      if (args.length !== 1) throw new Error("ISOMITTED requires 1 argument");
      // In Excel, this is used within LAMBDA functions to check if a parameter was omitted
      // For our simplified implementation, we'll check if the value is undefined, null, or empty
      const value = args[0];
      return value === undefined || value === null || value === "";
    },
    {
      description:
        "Checks whether the value in a LAMBDA is missing and returns TRUE or FALSE",
      syntax: "ISOMITTED(argument)",
      category: "Information",
      examples: ["ISOMITTED(value)"],
    }
  );

  registry.register(
    "CELL",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length < 1 || args.length > 2) {
        throw new Error("CELL requires 1-2 arguments");
      }

      const infoType = String(args[0]).toLowerCase();
      const reference = args.length > 1 ? args[1] : "A1"; // Default reference

      // Simplified implementation - in a full version this would examine actual cell properties
      switch (infoType) {
        case "address":
          return typeof reference === "string" ? reference : "A1";
        case "col":
          // Extract column number from reference like A1 -> 1, B1 -> 2, etc.
          if (typeof reference === "string") {
            const match = reference.match(/^([A-Z]+)/);
            if (match) {
              let col = 0;
              const letters = match[1];
              for (let i = 0; i < letters.length; i++) {
                col = col * 26 + (letters.charCodeAt(i) - 64);
              }
              return col;
            }
          }
          return 1;
        case "row":
          // Extract row number from reference like A1 -> 1, A10 -> 10
          if (typeof reference === "string") {
            const match = reference.match(/(\d+)/);
            return match ? parseInt(match[1]) : 1;
          }
          return 1;
        case "contents":
          return ""; // Would return actual cell contents in full implementation
        case "type":
          return "v"; // v = value, l = label, b = blank
        case "format":
          return "G"; // General format
        case "color":
          return 0; // 0 = automatic color, 1 = color for negative values
        case "parentheses":
          return 0; // 0 = no parentheses, 1 = parentheses for negative values
        case "prefix":
          return ""; // Text alignment prefix
        case "protect":
          return 1; // 1 = cell is locked, 0 = cell is not locked
        case "width":
          return 10; // Column width
        case "filename":
          return ""; // Filename (empty for unsaved workbook)
        default:
          throw new Error(`Unknown CELL info type: ${infoType}`);
      }
    },
    {
      description:
        "Returns information about the formatting, location, or contents of a cell",
      syntax: "CELL(info_type, [reference])",
      category: "Information",
      examples: ['CELL("address", A1)', 'CELL("row", A1)', 'CELL("col", A1)'],
    }
  );

  registry.register(
    "SHEET",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length > 1) throw new Error("SHEET requires 0-1 arguments");

      // In Excel, this returns the sheet number of the referenced sheet
      // For our implementation, we'll return 1 as we have a single sheet
      return 1;
    },
    {
      description: "Returns the sheet number of the referenced sheet",
      syntax: "SHEET([value])",
      category: "Information",
      examples: ["SHEET()", "SHEET(A1)"],
    }
  );

  registry.register(
    "SHEETS",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length > 1) throw new Error("SHEETS requires 0-1 arguments");

      // In Excel, this returns the number of sheets in a reference
      // For our implementation, we'll return 1 as we have a single sheet
      return 1;
    },
    {
      description: "Returns the number of sheets in a reference",
      syntax: "SHEETS([reference])",
      category: "Information",
      examples: ["SHEETS()", "SHEETS(A1:B10)"],
    }
  );

  registry.register(
    "STOCKHISTORY",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length < 1 || args.length > 6) {
        throw new Error("STOCKHISTORY requires 1-6 arguments");
      }

      // This is a placeholder implementation as real stock data would require an external API
      // In a full implementation, this would fetch real financial data
      const symbol = String(args[0]);

      // Return a simple placeholder message
      return `Historical data for ${symbol} not available in this implementation`;
    },
    {
      description: "Retrieves historical data about a financial instrument",
      syntax:
        "STOCKHISTORY(stock, [start_date], [end_date], [interval], [headers], [properties])",
      category: "Information",
      examples: ['STOCKHISTORY("MSFT")'],
    }
  );
}
