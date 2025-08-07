// Text Functions
import { FunctionRegistry } from "../FunctionRegistry";

export function registerTextFunctions(registry: FunctionRegistry) {
  registry.register(
    "CONCAT",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      return args.flat().join("");
    },
    {
      description: "Combines text from multiple cells",
      syntax: "CONCAT(text1, [text2], ...)",
      category: "Text",
      examples: ['CONCAT(A1, " ", B1)'],
    }
  );

  registry.register(
    "CONCATENATE",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      return args.flat().join("");
    },
    {
      description: "Joins several text items into one text item",
      syntax: "CONCATENATE(text1, [text2], ...)",
      category: "Text",
      examples: ['CONCATENATE("Hello", " ", "World")'],
    }
  );

  registry.register(
    "LEFT",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length < 1 || args.length > 2)
        throw new Error("LEFT requires 1-2 arguments");
      const text = String(args[0]);
      const numChars = args.length > 1 ? parseInt(args[1]) : 1;
      return text.substring(0, Math.max(0, numChars));
    },
    {
      description: "Returns the leftmost characters from a text value",
      syntax: "LEFT(text, [num_chars])",
      category: "Text",
      examples: ['LEFT("Hello", 3)', "LEFT(A1, 5)"],
    }
  );

  registry.register(
    "RIGHT",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length < 1 || args.length > 2)
        throw new Error("RIGHT requires 1-2 arguments");
      const text = String(args[0]);
      const numChars = args.length > 1 ? parseInt(args[1]) : 1;
      return text.substring(Math.max(0, text.length - numChars));
    },
    {
      description: "Returns the rightmost characters from a text value",
      syntax: "RIGHT(text, [num_chars])",
      category: "Text",
      examples: ['RIGHT("Hello", 3)', "RIGHT(A1, 2)"],
    }
  );

  registry.register(
    "MID",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length !== 3)
        throw new Error("MID requires exactly 3 arguments");
      const text = String(args[0]);
      const start = parseInt(args[1]) - 1; // Excel is 1-based
      const length = parseInt(args[2]);
      return text.substring(Math.max(0, start), Math.max(0, start + length));
    },
    {
      description: "Returns a specific number of characters from a text string",
      syntax: "MID(text, start_num, num_chars)",
      category: "Text",
      examples: ['MID("Hello World", 7, 5)', "MID(A1, 2, 3)"],
    }
  );

  registry.register(
    "LEN",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length !== 1) throw new Error("LEN requires exactly 1 argument");
      return String(args[0]).length;
    },
    {
      description: "Returns the number of characters in a text string",
      syntax: "LEN(text)",
      category: "Text",
      examples: ['LEN("Hello")', "LEN(A1)"],
    }
  );

  registry.register(
    "UPPER",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length !== 1)
        throw new Error("UPPER requires exactly 1 argument");
      return String(args[0]).toUpperCase();
    },
    {
      description: "Converts text to uppercase",
      syntax: "UPPER(text)",
      category: "Text",
      examples: ['UPPER("hello")', "UPPER(A1)"],
    }
  );

  registry.register(
    "LOWER",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length !== 1)
        throw new Error("LOWER requires exactly 1 argument");
      return String(args[0]).toLowerCase();
    },
    {
      description: "Converts text to lowercase",
      syntax: "LOWER(text)",
      category: "Text",
      examples: ['LOWER("HELLO")', "LOWER(A1)"],
    }
  );

  registry.register(
    "PROPER",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length !== 1)
        throw new Error("PROPER requires exactly 1 argument");
      return String(args[0]).replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      );
    },
    {
      description: "Capitalizes the first letter in each word of a text value",
      syntax: "PROPER(text)",
      category: "Text",
      examples: ['PROPER("hello world")', "PROPER(A1)"],
    }
  );

  registry.register(
    "TRIM",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length !== 1)
        throw new Error("TRIM requires exactly 1 argument");
      return String(args[0]).trim().replace(/\s+/g, " ");
    },
    {
      description: "Removes spaces from text",
      syntax: "TRIM(text)",
      category: "Text",
      examples: ['TRIM("  Hello World  ")', "TRIM(A1)"],
    }
  );

  registry.register(
    "SUBSTITUTE",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length < 3 || args.length > 4)
        throw new Error("SUBSTITUTE requires 3-4 arguments");
      const text = String(args[0]);
      const oldText = String(args[1]);
      const newText = String(args[2]);
      const instanceNum = args.length > 3 ? parseInt(args[3]) : null;

      if (instanceNum) {
        let count = 0;
        let index = 0;
        while (index < text.length) {
          const found = text.indexOf(oldText, index);
          if (found === -1) break;
          count++;
          if (count === instanceNum) {
            return (
              text.substring(0, found) +
              newText +
              text.substring(found + oldText.length)
            );
          }
          index = found + 1;
        }
        return text;
      } else {
        return text.split(oldText).join(newText);
      }
    },
    {
      description: "Substitutes new text for old text in a text string",
      syntax: "SUBSTITUTE(text, old_text, new_text, [instance_num])",
      category: "Text",
      examples: [
        'SUBSTITUTE("Hello World", "World", "Excel")',
        'SUBSTITUTE(A1, "old", "new", 1)',
      ],
    }
  );

  registry.register(
    "FIND",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length < 2 || args.length > 3)
        throw new Error("FIND requires 2-3 arguments");
      const findText = String(args[0]);
      const withinText = String(args[1]);
      const startNum = args.length > 2 ? parseInt(args[2]) - 1 : 0; // Excel is 1-based

      const index = withinText.indexOf(findText, startNum);
      return index >= 0 ? index + 1 : "#VALUE!"; // Excel is 1-based
    },
    {
      description: "Finds one text value within another (case-sensitive)",
      syntax: "FIND(find_text, within_text, [start_num])",
      category: "Text",
      examples: ['FIND("World", "Hello World")', 'FIND("o", A1, 2)'],
    }
  );

  registry.register(
    "SEARCH",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length < 2 || args.length > 3)
        throw new Error("SEARCH requires 2-3 arguments");
      const findText = String(args[0]).toLowerCase();
      const withinText = String(args[1]).toLowerCase();
      const startNum = args.length > 2 ? parseInt(args[2]) - 1 : 0; // Excel is 1-based

      const index = withinText.indexOf(findText, startNum);
      return index >= 0 ? index + 1 : "#VALUE!"; // Excel is 1-based
    },
    {
      description: "Finds one text value within another (case-insensitive)",
      syntax: "SEARCH(find_text, within_text, [start_num])",
      category: "Text",
      examples: ['SEARCH("world", "Hello World")', 'SEARCH("O", A1, 2)'],
    }
  );

  registry.register(
    "REPLACE",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length !== 4)
        throw new Error("REPLACE requires exactly 4 arguments");
      const oldText = String(args[0]);
      const startNum = parseInt(args[1]) - 1; // Excel is 1-based
      const numChars = parseInt(args[2]);
      const newText = String(args[3]);

      return (
        oldText.substring(0, startNum) +
        newText +
        oldText.substring(startNum + numChars)
      );
    },
    {
      description: "Replaces characters within text",
      syntax: "REPLACE(old_text, start_num, num_chars, new_text)",
      category: "Text",
      examples: [
        'REPLACE("Hello World", 7, 5, "Excel")',
        'REPLACE(A1, 1, 3, "ABC")',
      ],
    }
  );

  registry.register(
    "REPT",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length !== 2)
        throw new Error("REPT requires exactly 2 arguments");
      const text = String(args[0]);
      const numTimes = parseInt(args[1]);
      return text.repeat(Math.max(0, numTimes));
    },
    {
      description: "Repeats text a given number of times",
      syntax: "REPT(text, number_times)",
      category: "Text",
      examples: ['REPT("*", 5)', "REPT(A1, 3)"],
    }
  );

  registry.register(
    "TEXTBEFORE",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length < 2 || args.length > 4)
        throw new Error("TEXTBEFORE requires 2-4 arguments");

      const text = String(args[0]);
      const delimiter = String(args[1]);
      const instanceNum = args[2] || 1;
      const matchMode = args[3] || 0; // 0 = case-sensitive, 1 = case-insensitive

      if (instanceNum < 1) return "#VALUE!";

      let searchText = text;
      let searchDelimiter = delimiter;

      if (matchMode === 1) {
        searchText = text.toLowerCase();
        searchDelimiter = delimiter.toLowerCase();
      }

      let foundCount = 0;
      let index = 0;

      while (index < searchText.length) {
        const foundIndex = searchText.indexOf(searchDelimiter, index);
        if (foundIndex === -1) break;

        foundCount++;
        if (foundCount === instanceNum) {
          return text.substring(0, foundIndex);
        }

        index = foundIndex + searchDelimiter.length;
      }

      return "#N/A";
    },
    {
      description:
        "Returns text that occurs before a given character or string",
      syntax: "TEXTBEFORE(text, delimiter, [instance_num], [match_mode])",
      category: "Text",
      examples: [
        'TEXTBEFORE("Hello World", " ")',
        'TEXTBEFORE("A-B-C", "-", 2)',
      ],
    }
  );

  registry.register(
    "TEXTAFTER",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length < 2 || args.length > 4)
        throw new Error("TEXTAFTER requires 2-4 arguments");

      const text = String(args[0]);
      const delimiter = String(args[1]);
      const instanceNum = args[2] || 1;
      const matchMode = args[3] || 0; // 0 = case-sensitive, 1 = case-insensitive

      if (instanceNum < 1) return "#VALUE!";

      let searchText = text;
      let searchDelimiter = delimiter;

      if (matchMode === 1) {
        searchText = text.toLowerCase();
        searchDelimiter = delimiter.toLowerCase();
      }

      let foundCount = 0;
      let index = 0;

      while (index < searchText.length) {
        const foundIndex = searchText.indexOf(searchDelimiter, index);
        if (foundIndex === -1) break;

        foundCount++;
        if (foundCount === instanceNum) {
          return text.substring(foundIndex + delimiter.length);
        }

        index = foundIndex + searchDelimiter.length;
      }

      return "#N/A";
    },
    {
      description: "Returns text that occurs after a given character or string",
      syntax: "TEXTAFTER(text, delimiter, [instance_num], [match_mode])",
      category: "Text",
      examples: ['TEXTAFTER("Hello World", " ")', 'TEXTAFTER("A-B-C", "-", 1)'],
    }
  );

  registry.register(
    "VALUE",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length !== 1)
        throw new Error("VALUE requires exactly 1 argument");
      const text = String(args[0]).trim();
      const num = parseFloat(text);
      if (isNaN(num)) throw new Error("#VALUE!");
      return num;
    },
    {
      description:
        "Converts a text string that represents a number to a number",
      syntax: "VALUE(text)",
      category: "Text",
      examples: ['VALUE("123")', 'VALUE("3.14")'],
    }
  );

  registry.register(
    "TEXT",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length !== 2)
        throw new Error("TEXT requires exactly 2 arguments");
      const value = args[0];
      const format = String(args[1]);

      // Simplified formatting - would need full implementation for all Excel formats
      if (format.includes("0") || format.includes("#")) {
        const num = parseFloat(value);
        if (!isNaN(num)) {
          const decimalPlaces = (format.match(/\.0+/) || [""])[0].length - 1;
          if (decimalPlaces > 0) {
            return num.toFixed(decimalPlaces);
          }
          return Math.round(num).toString();
        }
      }

      return String(value);
    },
    {
      description: "Formats a number and converts it to text",
      syntax: "TEXT(value, format_text)",
      category: "Text",
      examples: ['TEXT(1234.567, "0.00")', 'TEXT(0.75, "0%")'],
    }
  );

  registry.register(
    "CHAR",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length !== 1)
        throw new Error("CHAR requires exactly 1 argument");
      const code = parseInt(args[0]);
      if (code < 1 || code > 255) return "#VALUE!";
      return String.fromCharCode(code);
    },
    {
      description: "Returns the character specified by the code number",
      syntax: "CHAR(number)",
      category: "Text",
      examples: ["CHAR(65)", "CHAR(97)"],
    }
  );

  registry.register(
    "CODE",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length !== 1)
        throw new Error("CODE requires exactly 1 argument");
      const text = String(args[0]);
      if (text.length === 0) return "#VALUE!";
      return text.charCodeAt(0);
    },
    {
      description:
        "Returns a numeric code for the first character in a text string",
      syntax: "CODE(text)",
      category: "Text",
      examples: ['CODE("A")', 'CODE("a")'],
    }
  );

  registry.register(
    "CLEAN",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length !== 1)
        throw new Error("CLEAN requires exactly 1 argument");
      const text = String(args[0]);
      // Remove non-printable characters (keep only printable ASCII)
      let result = "";
      for (let i = 0; i < text.length; i++) {
        const code = text.charCodeAt(i);
        if (code >= 32 && code <= 126) {
          result += text[i];
        }
      }
      return result;
    },
    {
      description: "Removes all nonprintable characters from text",
      syntax: "CLEAN(text)",
      category: "Text",
      examples: ['CLEAN("Hello\x07World")'],
    }
  );

  registry.register(
    "EXACT",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length !== 2)
        throw new Error("EXACT requires exactly 2 arguments");
      return String(args[0]) === String(args[1]);
    },
    {
      description: "Checks to see if two text values are identical",
      syntax: "EXACT(text1, text2)",
      category: "Text",
      examples: ['EXACT("Word", "word")', 'EXACT("Word", "Word")'],
    }
  );

  registry.register(
    "FIXED",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length < 1 || args.length > 3)
        throw new Error("FIXED requires 1-3 arguments");
      const number = parseFloat(args[0]);
      const decimals = args.length > 1 ? parseInt(args[1]) : 2;
      const noCommas = args.length > 2 ? Boolean(args[2]) : false;

      if (isNaN(number)) return "#VALUE!";

      let result = number.toFixed(Math.max(0, decimals));

      if (!noCommas) {
        // Add thousands separators
        const parts = result.split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        result = parts.join(".");
      }

      return result;
    },
    {
      description: "Formats a number as text with a fixed number of decimals",
      syntax: "FIXED(number, [decimals], [no_commas])",
      category: "Text",
      examples: ["FIXED(1234.567, 1)", "FIXED(1234.567, 1, TRUE)"],
    }
  );

  registry.register(
    "DOLLAR",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length < 1 || args.length > 2)
        throw new Error("DOLLAR requires 1-2 arguments");
      const number = parseFloat(args[0]);
      const decimals = args.length > 1 ? parseInt(args[1]) : 2;

      if (isNaN(number)) return "#VALUE!";

      const formatted = number.toFixed(Math.max(0, decimals));
      const parts = formatted.split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      const result = parts.join(".");

      return number >= 0
        ? `$${result}`
        : `($${Math.abs(number).toFixed(Math.max(0, decimals))})`;
    },
    {
      description:
        "Converts a number to text, using the $ (dollar) currency format",
      syntax: "DOLLAR(number, [decimals])",
      category: "Text",
      examples: ["DOLLAR(1234.567)", "DOLLAR(-1234.567, 1)"],
    }
  );

  registry.register(
    "T",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length !== 1) throw new Error("T requires exactly 1 argument");
      const value = args[0];
      return typeof value === "string" ? value : "";
    },
    {
      description: "Converts its arguments to text",
      syntax: "T(value)",
      category: "Text",
      examples: ['T("Hello")', "T(123)"],
    }
  );

  registry.register(
    "TEXTJOIN",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length < 3)
        throw new Error("TEXTJOIN requires at least 3 arguments");
      const delimiter = String(args[0]);
      const ignoreEmpty = Boolean(args[1]);
      const textArray = args.slice(2).flat();

      const filteredArray = ignoreEmpty
        ? textArray.filter((item) => String(item).trim() !== "")
        : textArray;

      return filteredArray.map((item) => String(item)).join(delimiter);
    },
    {
      description: "Combines the text from multiple ranges and/or strings",
      syntax: "TEXTJOIN(delimiter, ignore_empty, text1, [text2], ...)",
      category: "Text",
      examples: [
        'TEXTJOIN(", ", TRUE, "Apple", "Orange", "", "Banana")',
        'TEXTJOIN("-", FALSE, A1:A3)',
      ],
    }
  );

  registry.register(
    "TEXTSPLIT",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length < 2 || args.length > 4)
        throw new Error("TEXTSPLIT requires 2-4 arguments");

      const text = String(args[0]);
      const colDelimiter = String(args[1]);
      const rowDelimiter = args.length > 2 ? String(args[2]) : null;
      const ignoreEmpty = args.length > 3 ? Boolean(args[3]) : false;

      let result: string[];

      if (rowDelimiter) {
        // Split by rows first, then by columns
        const rows = text.split(rowDelimiter);
        result = [];
        for (const row of rows) {
          const cols = row.split(colDelimiter);
          result.push(...cols);
        }
      } else {
        // Split by columns only
        result = text.split(colDelimiter);
      }

      if (ignoreEmpty) {
        result = result.filter((item) => item.trim() !== "");
      }

      return result;
    },
    {
      description: "Splits text strings by using column and row delimiters",
      syntax: "TEXTSPLIT(text, col_delimiter, [row_delimiter], [ignore_empty])",
      category: "Text",
      examples: ['TEXTSPLIT("A,B,C", ",")', 'TEXTSPLIT("A,B;C,D", ",", ";")'],
    }
  );

  registry.register(
    "UNICHAR",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length !== 1)
        throw new Error("UNICHAR requires exactly 1 argument");
      const code = parseInt(args[0]);
      if (code < 1 || code > 1114111) return "#VALUE!";

      try {
        return String.fromCodePoint(code);
      } catch {
        return "#VALUE!";
      }
    },
    {
      description:
        "Returns the Unicode character that is referenced by the given numeric value",
      syntax: "UNICHAR(number)",
      category: "Text",
      examples: ["UNICHAR(65)", "UNICHAR(8364)"],
    }
  );

  registry.register(
    "UNICODE",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length !== 1)
        throw new Error("UNICODE requires exactly 1 argument");
      const text = String(args[0]);
      if (text.length === 0) return "#VALUE!";
      return text.codePointAt(0) || "#VALUE!";
    },
    {
      description:
        "Returns the number (code point) that corresponds to the first character of the text",
      syntax: "UNICODE(text)",
      category: "Text",
      examples: ['UNICODE("A")', 'UNICODE("€")'],
    }
  );

  registry.register(
    "NUMBERVALUE",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length < 1 || args.length > 3)
        throw new Error("NUMBERVALUE requires 1-3 arguments");

      const text = String(args[0]);
      const decimalSeparator = args.length > 1 ? String(args[1]) : ".";
      const groupSeparator = args.length > 2 ? String(args[2]) : ",";

      // Clean the text by removing group separators and replacing decimal separator
      let cleanText = text.trim();

      // Handle percentage
      const isPercentage = cleanText.includes("%");
      cleanText = cleanText.replace("%", "");

      // Replace custom separators with standard ones
      if (groupSeparator !== ",") {
        cleanText = cleanText.replace(
          new RegExp("\\" + groupSeparator, "g"),
          ""
        );
      } else {
        cleanText = cleanText.replace(/,/g, "");
      }

      if (decimalSeparator !== ".") {
        cleanText = cleanText.replace(decimalSeparator, ".");
      }

      const num = parseFloat(cleanText);
      if (isNaN(num)) return "#VALUE!";

      return isPercentage ? num / 100 : num;
    },
    {
      description: "Converts text to number in a locale-independent manner",
      syntax: "NUMBERVALUE(text, [decimal_separator], [group_separator])",
      category: "Text",
      examples: [
        'NUMBERVALUE("1,234.56")',
        'NUMBERVALUE("1.234,56", ",", ".")',
        'NUMBERVALUE("50%")',
      ],
    }
  );

  // Simplified implementations for byte-based functions (treating as regular string functions)
  registry.register(
    "LEFTB",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      // For simplicity, treating bytes as characters
      if (args.length < 1 || args.length > 2)
        throw new Error("LEFTB requires 1-2 arguments");
      const text = String(args[0]);
      const numBytes = args.length > 1 ? parseInt(args[1]) : 1;
      return text.substring(0, Math.max(0, numBytes));
    },
    {
      description:
        "Returns the leftmost characters from a text value (byte-based)",
      syntax: "LEFTB(text, [num_bytes])",
      category: "Text",
      examples: ['LEFTB("Hello", 3)'],
    }
  );

  registry.register(
    "RIGHTB",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      // For simplicity, treating bytes as characters
      if (args.length < 1 || args.length > 2)
        throw new Error("RIGHTB requires 1-2 arguments");
      const text = String(args[0]);
      const numBytes = args.length > 1 ? parseInt(args[1]) : 1;
      return text.substring(Math.max(0, text.length - numBytes));
    },
    {
      description:
        "Returns the rightmost characters from a text value (byte-based)",
      syntax: "RIGHTB(text, [num_bytes])",
      category: "Text",
      examples: ['RIGHTB("Hello", 3)'],
    }
  );

  registry.register(
    "MIDB",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      // For simplicity, treating bytes as characters
      if (args.length !== 3)
        throw new Error("MIDB requires exactly 3 arguments");
      const text = String(args[0]);
      const start = parseInt(args[1]) - 1; // Excel is 1-based
      const length = parseInt(args[2]);
      return text.substring(Math.max(0, start), Math.max(0, start + length));
    },
    {
      description:
        "Returns a specific number of characters from a text string starting at the position you specify (byte-based)",
      syntax: "MIDB(text, start_num, num_bytes)",
      category: "Text",
      examples: ['MIDB("Hello World", 7, 5)'],
    }
  );

  registry.register(
    "LENB",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      // For simplicity, treating bytes as characters
      if (args.length !== 1)
        throw new Error("LENB requires exactly 1 argument");
      return String(args[0]).length;
    },
    {
      description: "Returns the number of bytes in a text string",
      syntax: "LENB(text)",
      category: "Text",
      examples: ['LENB("Hello")'],
    }
  );

  registry.register(
    "FINDB",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      // For simplicity, treating bytes as characters
      if (args.length < 2 || args.length > 3)
        throw new Error("FINDB requires 2-3 arguments");
      const findText = String(args[0]);
      const withinText = String(args[1]);
      const startNum = args.length > 2 ? parseInt(args[2]) - 1 : 0; // Excel is 1-based

      const index = withinText.indexOf(findText, startNum);
      return index >= 0 ? index + 1 : "#VALUE!"; // Excel is 1-based
    },
    {
      description:
        "Finds one text value within another (case-sensitive, byte-based)",
      syntax: "FINDB(find_text, within_text, [start_num])",
      category: "Text",
      examples: ['FINDB("World", "Hello World")'],
    }
  );

  registry.register(
    "SEARCHB",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      // For simplicity, treating bytes as characters
      if (args.length < 2 || args.length > 3)
        throw new Error("SEARCHB requires 2-3 arguments");
      const findText = String(args[0]).toLowerCase();
      const withinText = String(args[1]).toLowerCase();
      const startNum = args.length > 2 ? parseInt(args[2]) - 1 : 0; // Excel is 1-based

      const index = withinText.indexOf(findText, startNum);
      return index >= 0 ? index + 1 : "#VALUE!"; // Excel is 1-based
    },
    {
      description:
        "Finds one text value within another (case-insensitive, byte-based)",
      syntax: "SEARCHB(find_text, within_text, [start_num])",
      category: "Text",
      examples: ['SEARCHB("world", "Hello World")'],
    }
  );

  registry.register(
    "REPLACEB",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      // For simplicity, treating bytes as characters
      if (args.length !== 4)
        throw new Error("REPLACEB requires exactly 4 arguments");
      const oldText = String(args[0]);
      const startNum = parseInt(args[1]) - 1; // Excel is 1-based
      const numBytes = parseInt(args[2]);
      const newText = String(args[3]);

      return (
        oldText.substring(0, startNum) +
        newText +
        oldText.substring(startNum + numBytes)
      );
    },
    {
      description: "Replaces characters within text (byte-based)",
      syntax: "REPLACEB(old_text, start_num, num_bytes, new_text)",
      category: "Text",
      examples: ['REPLACEB("Hello World", 7, 5, "Excel")'],
    }
  );

  // Placeholder implementations for advanced functions
  registry.register(
    "ASC",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length !== 1) throw new Error("ASC requires exactly 1 argument");
      const text = String(args[0]);
      // Simplified implementation - would need full-width to half-width conversion
      return text;
    },
    {
      description:
        "Changes full-width (double-byte) English letters or katakana within a character string to half-width (single-byte) characters",
      syntax: "ASC(text)",
      category: "Text",
      examples: ['ASC("Ａ")'],
    }
  );

  registry.register(
    "DBCS",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length !== 1)
        throw new Error("DBCS requires exactly 1 argument");
      const text = String(args[0]);
      // Simplified implementation - would need half-width to full-width conversion
      return text;
    },
    {
      description:
        "Changes half-width (single-byte) English letters or katakana within a character string to full-width (double-byte) characters",
      syntax: "DBCS(text)",
      category: "Text",
      examples: ['DBCS("A")'],
    }
  );

  registry.register(
    "PHONETIC",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length !== 1)
        throw new Error("PHONETIC requires exactly 1 argument");
      // Simplified implementation - would need phonetic extraction
      return String(args[0]);
    },
    {
      description:
        "Extracts the phonetic (furigana) characters from a text string",
      syntax: "PHONETIC(text)",
      category: "Text",
      examples: ['PHONETIC("東京")'],
    }
  );

  registry.register(
    "BAHTTEXT",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length !== 1)
        throw new Error("BAHTTEXT requires exactly 1 argument");
      const number = parseFloat(args[0]);
      if (isNaN(number)) return "#VALUE!";
      // Simplified implementation
      return `${number.toFixed(2)} Baht`;
    },
    {
      description:
        "Converts a number to text, using the ß (baht) currency format",
      syntax: "BAHTTEXT(number)",
      category: "Text",
      examples: ["BAHTTEXT(1234.56)"],
    }
  );

  // Regex functions (basic implementations)
  registry.register(
    "REGEXTEST",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length !== 2)
        throw new Error("REGEXTEST requires exactly 2 arguments");
      const text = String(args[0]);
      const pattern = String(args[1]);

      try {
        const regex = new RegExp(pattern);
        return regex.test(text);
      } catch {
        return "#VALUE!";
      }
    },
    {
      description: "Determines whether any part of text matches the pattern",
      syntax: "REGEXTEST(text, pattern)",
      category: "Text",
      examples: ['REGEXTEST("Hello123", "\\d+")'],
    }
  );

  registry.register(
    "REGEXEXTRACT",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length !== 2)
        throw new Error("REGEXEXTRACT requires exactly 2 arguments");
      const text = String(args[0]);
      const pattern = String(args[1]);

      try {
        const regex = new RegExp(pattern);
        const match = text.match(regex);
        return match ? match[0] : "#N/A";
      } catch {
        return "#VALUE!";
      }
    },
    {
      description:
        "Extracts strings within the provided text that matches the pattern",
      syntax: "REGEXEXTRACT(text, pattern)",
      category: "Text",
      examples: ['REGEXEXTRACT("Hello123World", "\\d+")'],
    }
  );

  registry.register(
    "REGEXREPLACE",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length !== 3)
        throw new Error("REGEXREPLACE requires exactly 3 arguments");
      const text = String(args[0]);
      const pattern = String(args[1]);
      const replacement = String(args[2]);

      try {
        const regex = new RegExp(pattern, "g");
        return text.replace(regex, replacement);
      } catch {
        return "#VALUE!";
      }
    },
    {
      description:
        "Replaces strings within the provided text that matches the pattern with replacement",
      syntax: "REGEXREPLACE(text, pattern, replacement)",
      category: "Text",
      examples: ['REGEXREPLACE("Hello123World", "\\d+", "XXX")'],
    }
  );

  // Placeholder for Microsoft 365 functions that require external APIs
  registry.register(
    "DETECTLANGUAGE",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length !== 1)
        throw new Error("DETECTLANGUAGE requires exactly 1 argument");
      return "#N/A - Requires Microsoft 365 API";
    },
    {
      description: "Identifies the language of a specified text",
      syntax: "DETECTLANGUAGE(text)",
      category: "Text",
      examples: ['DETECTLANGUAGE("Hello World")'],
    }
  );

  registry.register(
    "TRANSLATE",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length !== 3)
        throw new Error("TRANSLATE requires exactly 3 arguments");
      return "#N/A - Requires Microsoft 365 API";
    },
    {
      description: "Translates a text from one language to another",
      syntax: "TRANSLATE(text, from_language, to_language)",
      category: "Text",
      examples: ['TRANSLATE("Hello", "en", "es")'],
    }
  );

  registry.register(
    "ARRAYTOTEXT",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length < 1 || args.length > 2)
        throw new Error("ARRAYTOTEXT requires 1-2 arguments");
      const array = args[0];
      const format = args.length > 1 ? parseInt(args[1]) : 0; // 0 = concise, 1 = strict

      if (Array.isArray(array)) {
        if (format === 1) {
          return JSON.stringify(array);
        } else {
          return array.join(", ");
        }
      }

      return String(array);
    },
    {
      description: "Returns an array of text values from any specified range",
      syntax: "ARRAYTOTEXT(array, [format])",
      category: "Text",
      examples: ["ARRAYTOTEXT({1,2,3})"],
    }
  );

  registry.register(
    "VALUETOTEXT",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length < 1 || args.length > 2)
        throw new Error("VALUETOTEXT requires 1-2 arguments");
      const value = args[0];
      const format = args.length > 1 ? parseInt(args[1]) : 0; // 0 = concise, 1 = strict

      if (format === 1) {
        return JSON.stringify(value);
      }

      return String(value);
    },
    {
      description: "Returns text from any specified value",
      syntax: "VALUETOTEXT(value, [format])",
      category: "Text",
      examples: ["VALUETOTEXT(123)", "VALUETOTEXT(TRUE, 1)"],
    }
  );
}
