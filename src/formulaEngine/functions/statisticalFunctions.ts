// Statistical Functions
import { FunctionRegistry } from "../FunctionRegistry";

export function registerStatisticalFunctions(registry: FunctionRegistry) {
  registry.register(
    "AVERAGE",
    (args) => {
      const numbers = args
        .flat()
        .map((arg) => parseFloat(arg))
        .filter((n) => !isNaN(n));
      if (numbers.length === 0) return 0;
      return numbers.reduce((sum, val) => sum + val, 0) / numbers.length;
    },
    {
      description: "Calculates the average of numbers",
      syntax: "AVERAGE(number1, [number2], ...)",
      category: "Statistical",
      examples: ["AVERAGE(B2:B20)"],
    }
  );

  registry.register(
    "MAX",
    (args) => {
      const numbers = args
        .flat()
        .map((arg) => parseFloat(arg))
        .filter((n) => !isNaN(n));
      return numbers.length > 0 ? Math.max(...numbers) : 0;
    },
    {
      description: "Returns the largest value in a set of values",
      syntax: "MAX(number1, [number2], ...)",
      category: "Statistical",
      examples: ["MAX(C3:C15)"],
    }
  );

  registry.register(
    "MIN",
    (args) => {
      const numbers = args
        .flat()
        .map((arg) => parseFloat(arg))
        .filter((n) => !isNaN(n));
      return numbers.length > 0 ? Math.min(...numbers) : 0;
    },
    {
      description: "Returns the smallest value in a set of values",
      syntax: "MIN(number1, [number2], ...)",
      category: "Statistical",
      examples: ["MIN(D4:D20)"],
    }
  );

  registry.register(
    "COUNT",
    (args) => {
      return args
        .flat()
        .filter(
          (arg) =>
            !isNaN(parseFloat(arg)) &&
            arg !== null &&
            arg !== undefined &&
            arg !== ""
        ).length;
    },
    {
      description: "Counts the number of cells that contain numbers",
      syntax: "COUNT(value1, [value2], ...)",
      category: "Statistical",
      examples: ["COUNT(E5:E25)"],
    }
  );

  registry.register(
    "COUNTA",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      return args
        .flat()
        .filter((arg) => arg !== null && arg !== undefined && arg !== "")
        .length;
    },
    {
      description: "Counts the number of cells that are not empty",
      syntax: "COUNTA(value1, [value2], ...)",
      category: "Statistical",
      examples: ["COUNTA(A1:A10)"],
    }
  );

  registry.register(
    "COUNTBLANK",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      return args
        .flat()
        .filter((arg) => arg === null || arg === undefined || arg === "")
        .length;
    },
    {
      description: "Counts empty cells in a range",
      syntax: "COUNTBLANK(range)",
      category: "Statistical",
      examples: ["COUNTBLANK(A1:A10)"],
    }
  );

  registry.register(
    "COUNTIFS",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length < 2 || args.length % 2 !== 0) {
        throw new Error(
          "COUNTIFS requires an even number of arguments (criteria_range1, criteria1, ...)"
        );
      }

      const firstRange = args[0];
      if (!Array.isArray(firstRange)) {
        throw new Error("Criteria ranges must be arrays");
      }

      let count = 0;
      for (let i = 0; i < firstRange.length; i++) {
        let meetsCriteria = true;

        // Check all criteria pairs
        for (let j = 0; j < args.length; j += 2) {
          const criteriaRange = args[j];
          const criteria = String(args[j + 1]);

          if (!Array.isArray(criteriaRange) || i >= criteriaRange.length) {
            meetsCriteria = false;
            break;
          }

          const cellValue = String(criteriaRange[i] || "");

          // Handle different criteria operators
          if (criteria.startsWith(">=")) {
            meetsCriteria =
              parseFloat(cellValue) >= parseFloat(criteria.slice(2));
          } else if (criteria.startsWith("<=")) {
            meetsCriteria =
              parseFloat(cellValue) <= parseFloat(criteria.slice(2));
          } else if (criteria.startsWith(">")) {
            meetsCriteria =
              parseFloat(cellValue) > parseFloat(criteria.slice(1));
          } else if (criteria.startsWith("<")) {
            meetsCriteria =
              parseFloat(cellValue) < parseFloat(criteria.slice(1));
          } else if (criteria.startsWith("!=") || criteria.startsWith("<>")) {
            meetsCriteria = cellValue !== criteria.slice(2);
          } else {
            meetsCriteria = cellValue === criteria;
          }

          if (!meetsCriteria) break;
        }

        if (meetsCriteria) {
          count++;
        }
      }

      return count;
    },
    {
      description:
        "Counts the number of cells within a range that meet multiple criteria",
      syntax:
        "COUNTIFS(criteria_range1, criteria1, [criteria_range2, criteria2], ...)",
      category: "Statistical",
      examples: ['COUNTIFS(A2:A10, "Product", B2:B10, ">10")'],
    }
  );

  registry.register(
    "MEDIAN",
    (args) => {
      const numbers = args
        .flat()
        .map((arg) => parseFloat(arg))
        .filter((n) => !isNaN(n))
        .sort((a, b) => a - b);

      if (numbers.length === 0) return 0;

      const mid = Math.floor(numbers.length / 2);
      return numbers.length % 2 !== 0
        ? numbers[mid]
        : (numbers[mid - 1] + numbers[mid]) / 2;
    },
    {
      description: "Returns the median of the given numbers",
      syntax: "MEDIAN(number1, [number2], ...)",
      category: "Statistical",
      examples: ["MEDIAN(A1:A10)", "MEDIAN(1, 2, 3, 4, 5)"],
    }
  );

  registry.register(
    "MODE",
    (args) => {
      const numbers = args
        .flat()
        .map((arg) => parseFloat(arg))
        .filter((n) => !isNaN(n));

      if (numbers.length === 0) return "#N/A";

      const frequency: Record<number, number> = {};
      let maxCount = 0;
      let mode: number = 0;

      numbers.forEach((num) => {
        frequency[num] = (frequency[num] || 0) + 1;
        if (frequency[num] > maxCount) {
          maxCount = frequency[num];
          mode = num;
        }
      });

      return maxCount > 1 ? mode : "#N/A";
    },
    {
      description: "Returns the most common value in a data set",
      syntax: "MODE(number1, [number2], ...)",
      category: "Statistical",
      examples: ["MODE(A1:A10)", "MODE(1, 2, 2, 3, 4)"],
    }
  );

  registry.register(
    "STDEV",
    (args) => {
      const numbers = args
        .flat()
        .map((arg) => parseFloat(arg))
        .filter((n) => !isNaN(n));

      if (numbers.length < 2) return "#DIV/0!";

      const mean = numbers.reduce((sum, val) => sum + val, 0) / numbers.length;
      const variance =
        numbers.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
        (numbers.length - 1);
      return Math.sqrt(variance);
    },
    {
      description: "Estimates standard deviation based on a sample",
      syntax: "STDEV(number1, [number2], ...)",
      category: "Statistical",
      examples: ["STDEV(A1:A10)"],
    }
  );

  registry.register(
    "VAR",
    (args) => {
      const numbers = args
        .flat()
        .map((arg) => parseFloat(arg))
        .filter((n) => !isNaN(n));

      if (numbers.length < 2) return "#DIV/0!";

      const mean = numbers.reduce((sum, val) => sum + val, 0) / numbers.length;
      return (
        numbers.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
        (numbers.length - 1)
      );
    },
    {
      description: "Estimates variance based on a sample",
      syntax: "VAR(number1, [number2], ...)",
      category: "Statistical",
      examples: ["VAR(A1:A10)"],
    }
  );

  registry.register(
    "RANK",
    (args) => {
      if (args.length < 2 || args.length > 3)
        throw new Error("RANK requires 2-3 arguments");

      const number = parseFloat(args[0]);
      const ref = Array.isArray(args[1]) ? args[1].flat() : [args[1]];
      const order = args.length > 2 ? parseInt(args[2]) : 0; // 0 = descending, 1 = ascending

      const numbers = ref
        .map((arg) => parseFloat(arg))
        .filter((n) => !isNaN(n));
      numbers.sort(order === 0 ? (a, b) => b - a : (a, b) => a - b);

      const index = numbers.indexOf(number);
      return index >= 0 ? index + 1 : "#N/A";
    },
    {
      description: "Returns the rank of a number in a list of numbers",
      syntax: "RANK(number, ref, [order])",
      category: "Statistical",
      examples: ["RANK(A2, A$1:A$10)", "RANK(5, {1,2,3,4,5}, 1)"],
    }
  );

  // Additional statistical functions
  registry.register(
    "AVEDEV",
    (args) => {
      const numbers = args
        .flat()
        .map((arg) => parseFloat(arg))
        .filter((n) => !isNaN(n));

      if (numbers.length === 0) return 0;

      const mean = numbers.reduce((sum, val) => sum + val, 0) / numbers.length;
      const avgDev =
        numbers.reduce((sum, val) => sum + Math.abs(val - mean), 0) /
        numbers.length;

      return avgDev;
    },
    {
      description:
        "Returns the average of the absolute deviations of data points from their mean",
      syntax: "AVEDEV(number1, [number2], ...)",
      category: "Statistical",
      examples: ["AVEDEV(A1:A10)"],
    }
  );

  registry.register(
    "AVERAGEA",
    (args) => {
      let sum = 0;
      let count = 0;

      args.flat().forEach((arg) => {
        if (arg !== null && arg !== undefined && arg !== "") {
          if (typeof arg === "boolean") {
            sum += arg ? 1 : 0;
            count++;
          } else if (typeof arg === "string" && !isNaN(parseFloat(arg))) {
            sum += parseFloat(arg);
            count++;
          } else if (!isNaN(parseFloat(arg))) {
            sum += parseFloat(arg);
            count++;
          } else {
            // Text values count as 0
            count++;
          }
        }
      });

      return count > 0 ? sum / count : 0;
    },
    {
      description:
        "Returns the average of its arguments, including numbers, text, and logical values",
      syntax: "AVERAGEA(value1, [value2], ...)",
      category: "Statistical",
      examples: ["AVERAGEA(A1:A10)"],
    }
  );

  registry.register(
    "AVERAGEIF",
    (args) => {
      if (args.length < 2 || args.length > 3) {
        throw new Error("AVERAGEIF requires 2-3 arguments");
      }

      const range = Array.isArray(args[0]) ? args[0].flat() : [args[0]];
      const criteria = String(args[1]);
      const averageRange =
        args.length > 2
          ? Array.isArray(args[2])
            ? args[2].flat()
            : [args[2]]
          : range;

      let sum = 0;
      let count = 0;

      for (let i = 0; i < range.length; i++) {
        const cellValue = String(range[i] || "");
        let meetsCriteria = false;

        // Handle different criteria operators
        if (criteria.startsWith(">=")) {
          meetsCriteria =
            parseFloat(cellValue) >= parseFloat(criteria.slice(2));
        } else if (criteria.startsWith("<=")) {
          meetsCriteria =
            parseFloat(cellValue) <= parseFloat(criteria.slice(2));
        } else if (criteria.startsWith(">")) {
          meetsCriteria = parseFloat(cellValue) > parseFloat(criteria.slice(1));
        } else if (criteria.startsWith("<")) {
          meetsCriteria = parseFloat(cellValue) < parseFloat(criteria.slice(1));
        } else if (criteria.startsWith("!=") || criteria.startsWith("<>")) {
          meetsCriteria = cellValue !== criteria.slice(2);
        } else {
          meetsCriteria = cellValue === criteria;
        }

        if (meetsCriteria && i < averageRange.length) {
          const value = parseFloat(averageRange[i]);
          if (!isNaN(value)) {
            sum += value;
            count++;
          }
        }
      }

      return count > 0 ? sum / count : "#DIV/0!";
    },
    {
      description:
        "Returns the average (arithmetic mean) of all the cells in a range that meet a given criteria",
      syntax: "AVERAGEIF(range, criteria, [average_range])",
      category: "Statistical",
      examples: ['AVERAGEIF(A2:A10, ">5")'],
    }
  );

  registry.register(
    "AVERAGEIFS",
    (args) => {
      if (args.length < 3 || args.length % 2 === 0) {
        throw new Error(
          "AVERAGEIFS requires an odd number of arguments (average_range, criteria_range1, criteria1, ...)"
        );
      }

      const averageRange = Array.isArray(args[0]) ? args[0].flat() : [args[0]];
      let sum = 0;
      let count = 0;

      for (let i = 0; i < averageRange.length; i++) {
        let meetsCriteria = true;

        // Check all criteria pairs
        for (let j = 1; j < args.length; j += 2) {
          const criteriaRange = Array.isArray(args[j])
            ? args[j].flat()
            : [args[j]];
          const criteria = String(args[j + 1]);

          if (i >= criteriaRange.length) {
            meetsCriteria = false;
            break;
          }

          const cellValue = String(criteriaRange[i] || "");

          // Handle different criteria operators
          if (criteria.startsWith(">=")) {
            meetsCriteria =
              parseFloat(cellValue) >= parseFloat(criteria.slice(2));
          } else if (criteria.startsWith("<=")) {
            meetsCriteria =
              parseFloat(cellValue) <= parseFloat(criteria.slice(2));
          } else if (criteria.startsWith(">")) {
            meetsCriteria =
              parseFloat(cellValue) > parseFloat(criteria.slice(1));
          } else if (criteria.startsWith("<")) {
            meetsCriteria =
              parseFloat(cellValue) < parseFloat(criteria.slice(1));
          } else if (criteria.startsWith("!=") || criteria.startsWith("<>")) {
            meetsCriteria = cellValue !== criteria.slice(2);
          } else {
            meetsCriteria = cellValue === criteria;
          }

          if (!meetsCriteria) break;
        }

        if (meetsCriteria) {
          const value = parseFloat(averageRange[i]);
          if (!isNaN(value)) {
            sum += value;
            count++;
          }
        }
      }

      return count > 0 ? sum / count : "#DIV/0!";
    },
    {
      description:
        "Returns the average (arithmetic mean) of all cells that meet multiple criteria",
      syntax:
        "AVERAGEIFS(average_range, criteria_range1, criteria1, [criteria_range2, criteria2], ...)",
      category: "Statistical",
      examples: ['AVERAGEIFS(B2:B10, A2:A10, "Product", C2:C10, ">10")'],
    }
  );

  registry.register(
    "COUNTIF",
    (args) => {
      if (args.length !== 2) {
        throw new Error("COUNTIF requires exactly 2 arguments");
      }

      const range = Array.isArray(args[0]) ? args[0].flat() : [args[0]];
      const criteria = String(args[1]);
      let count = 0;

      range.forEach((cellValue) => {
        const value = String(cellValue || "");
        let meetsCriteria = false;

        // Handle different criteria operators
        if (criteria.startsWith(">=")) {
          meetsCriteria = parseFloat(value) >= parseFloat(criteria.slice(2));
        } else if (criteria.startsWith("<=")) {
          meetsCriteria = parseFloat(value) <= parseFloat(criteria.slice(2));
        } else if (criteria.startsWith(">")) {
          meetsCriteria = parseFloat(value) > parseFloat(criteria.slice(1));
        } else if (criteria.startsWith("<")) {
          meetsCriteria = parseFloat(value) < parseFloat(criteria.slice(1));
        } else if (criteria.startsWith("!=") || criteria.startsWith("<>")) {
          meetsCriteria = value !== criteria.slice(2);
        } else {
          meetsCriteria = value === criteria;
        }

        if (meetsCriteria) {
          count++;
        }
      });

      return count;
    },
    {
      description:
        "Counts the number of cells within a range that meet the given criteria",
      syntax: "COUNTIF(range, criteria)",
      category: "Statistical",
      examples: ['COUNTIF(A2:A10, ">5")'],
    }
  );

  registry.register(
    "MAXA",
    (args) => {
      let max = -Infinity;
      let hasValue = false;

      args.flat().forEach((arg) => {
        if (arg !== null && arg !== undefined && arg !== "") {
          hasValue = true;
          if (typeof arg === "boolean") {
            max = Math.max(max, arg ? 1 : 0);
          } else if (typeof arg === "string" && !isNaN(parseFloat(arg))) {
            max = Math.max(max, parseFloat(arg));
          } else if (!isNaN(parseFloat(arg))) {
            max = Math.max(max, parseFloat(arg));
          } else {
            // Text values count as 0
            max = Math.max(max, 0);
          }
        }
      });

      return hasValue ? max : 0;
    },
    {
      description:
        "Returns the maximum value in a list of arguments, including numbers, text, and logical values",
      syntax: "MAXA(value1, [value2], ...)",
      category: "Statistical",
      examples: ["MAXA(A1:A10)"],
    }
  );

  registry.register(
    "MAXIFS",
    (args) => {
      if (args.length < 3 || args.length % 2 === 0) {
        throw new Error(
          "MAXIFS requires an odd number of arguments (max_range, criteria_range1, criteria1, ...)"
        );
      }

      const maxRange = Array.isArray(args[0]) ? args[0].flat() : [args[0]];
      let max = -Infinity;
      let hasValue = false;

      for (let i = 0; i < maxRange.length; i++) {
        let meetsCriteria = true;

        // Check all criteria pairs
        for (let j = 1; j < args.length; j += 2) {
          const criteriaRange = Array.isArray(args[j])
            ? args[j].flat()
            : [args[j]];
          const criteria = String(args[j + 1]);

          if (i >= criteriaRange.length) {
            meetsCriteria = false;
            break;
          }

          const cellValue = String(criteriaRange[i] || "");

          // Handle different criteria operators
          if (criteria.startsWith(">=")) {
            meetsCriteria =
              parseFloat(cellValue) >= parseFloat(criteria.slice(2));
          } else if (criteria.startsWith("<=")) {
            meetsCriteria =
              parseFloat(cellValue) <= parseFloat(criteria.slice(2));
          } else if (criteria.startsWith(">")) {
            meetsCriteria =
              parseFloat(cellValue) > parseFloat(criteria.slice(1));
          } else if (criteria.startsWith("<")) {
            meetsCriteria =
              parseFloat(cellValue) < parseFloat(criteria.slice(1));
          } else if (criteria.startsWith("!=") || criteria.startsWith("<>")) {
            meetsCriteria = cellValue !== criteria.slice(2);
          } else {
            meetsCriteria = cellValue === criteria;
          }

          if (!meetsCriteria) break;
        }

        if (meetsCriteria) {
          const value = parseFloat(maxRange[i]);
          if (!isNaN(value)) {
            max = Math.max(max, value);
            hasValue = true;
          }
        }
      }

      return hasValue ? max : 0;
    },
    {
      description:
        "Returns the maximum value among cells specified by a given set of conditions or criteria",
      syntax:
        "MAXIFS(max_range, criteria_range1, criteria1, [criteria_range2, criteria2], ...)",
      category: "Statistical",
      examples: ['MAXIFS(B2:B10, A2:A10, "Product", C2:C10, ">10")'],
    }
  );

  registry.register(
    "MINA",
    (args) => {
      let min = Infinity;
      let hasValue = false;

      args.flat().forEach((arg) => {
        if (arg !== null && arg !== undefined && arg !== "") {
          hasValue = true;
          if (typeof arg === "boolean") {
            min = Math.min(min, arg ? 1 : 0);
          } else if (typeof arg === "string" && !isNaN(parseFloat(arg))) {
            min = Math.min(min, parseFloat(arg));
          } else if (!isNaN(parseFloat(arg))) {
            min = Math.min(min, parseFloat(arg));
          } else {
            // Text values count as 0
            min = Math.min(min, 0);
          }
        }
      });

      return hasValue ? min : 0;
    },
    {
      description:
        "Returns the smallest value in a list of arguments, including numbers, text, and logical values",
      syntax: "MINA(value1, [value2], ...)",
      category: "Statistical",
      examples: ["MINA(A1:A10)"],
    }
  );

  registry.register(
    "MINIFS",
    (args) => {
      if (args.length < 3 || args.length % 2 === 0) {
        throw new Error(
          "MINIFS requires an odd number of arguments (min_range, criteria_range1, criteria1, ...)"
        );
      }

      const minRange = Array.isArray(args[0]) ? args[0].flat() : [args[0]];
      let min = Infinity;
      let hasValue = false;

      for (let i = 0; i < minRange.length; i++) {
        let meetsCriteria = true;

        // Check all criteria pairs
        for (let j = 1; j < args.length; j += 2) {
          const criteriaRange = Array.isArray(args[j])
            ? args[j].flat()
            : [args[j]];
          const criteria = String(args[j + 1]);

          if (i >= criteriaRange.length) {
            meetsCriteria = false;
            break;
          }

          const cellValue = String(criteriaRange[i] || "");

          // Handle different criteria operators
          if (criteria.startsWith(">=")) {
            meetsCriteria =
              parseFloat(cellValue) >= parseFloat(criteria.slice(2));
          } else if (criteria.startsWith("<=")) {
            meetsCriteria =
              parseFloat(cellValue) <= parseFloat(criteria.slice(2));
          } else if (criteria.startsWith(">")) {
            meetsCriteria =
              parseFloat(cellValue) > parseFloat(criteria.slice(1));
          } else if (criteria.startsWith("<")) {
            meetsCriteria =
              parseFloat(cellValue) < parseFloat(criteria.slice(1));
          } else if (criteria.startsWith("!=") || criteria.startsWith("<>")) {
            meetsCriteria = cellValue !== criteria.slice(2);
          } else {
            meetsCriteria = cellValue === criteria;
          }

          if (!meetsCriteria) break;
        }

        if (meetsCriteria) {
          const value = parseFloat(minRange[i]);
          if (!isNaN(value)) {
            min = Math.min(min, value);
            hasValue = true;
          }
        }
      }

      return hasValue ? min : 0;
    },
    {
      description:
        "Returns the minimum value among cells specified by a given set of conditions or criteria",
      syntax:
        "MINIFS(min_range, criteria_range1, criteria1, [criteria_range2, criteria2], ...)",
      category: "Statistical",
      examples: ['MINIFS(B2:B10, A2:A10, "Product", C2:C10, ">10")'],
    }
  );

  registry.register(
    "GEOMEAN",
    (args) => {
      const numbers = args
        .flat()
        .map((arg) => parseFloat(arg))
        .filter((n) => !isNaN(n) && n > 0); // Geometric mean requires positive numbers

      if (numbers.length === 0) return "#NUM!";

      const product = numbers.reduce((prod, val) => prod * val, 1);
      return Math.pow(product, 1 / numbers.length);
    },
    {
      description: "Returns the geometric mean",
      syntax: "GEOMEAN(number1, [number2], ...)",
      category: "Statistical",
      examples: ["GEOMEAN(A1:A10)"],
    }
  );

  registry.register(
    "HARMEAN",
    (args) => {
      const numbers = args
        .flat()
        .map((arg) => parseFloat(arg))
        .filter((n) => !isNaN(n) && n > 0); // Harmonic mean requires positive numbers

      if (numbers.length === 0) return "#NUM!";

      const reciprocalSum = numbers.reduce((sum, val) => sum + 1 / val, 0);
      return numbers.length / reciprocalSum;
    },
    {
      description: "Returns the harmonic mean",
      syntax: "HARMEAN(number1, [number2], ...)",
      category: "Statistical",
      examples: ["HARMEAN(A1:A10)"],
    }
  );

  registry.register(
    "LARGE",
    (args) => {
      if (args.length !== 2) {
        throw new Error("LARGE requires exactly 2 arguments");
      }

      const numbers = (Array.isArray(args[0]) ? args[0].flat() : [args[0]])
        .map((arg) => parseFloat(arg))
        .filter((n) => !isNaN(n))
        .sort((a, b) => b - a); // Sort in descending order

      const k = parseInt(args[1]);
      if (k < 1 || k > numbers.length) return "#NUM!";

      return numbers[k - 1];
    },
    {
      description: "Returns the k-th largest value in a data set",
      syntax: "LARGE(array, k)",
      category: "Statistical",
      examples: ["LARGE(A1:A10, 2)"],
    }
  );

  registry.register(
    "SMALL",
    (args) => {
      if (args.length !== 2) {
        throw new Error("SMALL requires exactly 2 arguments");
      }

      const numbers = (Array.isArray(args[0]) ? args[0].flat() : [args[0]])
        .map((arg) => parseFloat(arg))
        .filter((n) => !isNaN(n))
        .sort((a, b) => a - b); // Sort in ascending order

      const k = parseInt(args[1]);
      if (k < 1 || k > numbers.length) return "#NUM!";

      return numbers[k - 1];
    },
    {
      description: "Returns the k-th smallest value in a data set",
      syntax: "SMALL(array, k)",
      category: "Statistical",
      examples: ["SMALL(A1:A10, 2)"],
    }
  );

  registry.register(
    "PERCENTILE.INC",
    (args) => {
      if (args.length !== 2) {
        throw new Error("PERCENTILE.INC requires exactly 2 arguments");
      }

      const numbers = (Array.isArray(args[0]) ? args[0].flat() : [args[0]])
        .map((arg) => parseFloat(arg))
        .filter((n) => !isNaN(n))
        .sort((a, b) => a - b);

      const k = parseFloat(args[1]);
      if (k < 0 || k > 1) return "#NUM!";
      if (numbers.length === 0) return "#NUM!";

      if (k === 0) return numbers[0];
      if (k === 1) return numbers[numbers.length - 1];

      const index = k * (numbers.length - 1);
      const lower = Math.floor(index);
      const upper = Math.ceil(index);

      if (lower === upper) {
        return numbers[lower];
      } else {
        const weight = index - lower;
        return numbers[lower] * (1 - weight) + numbers[upper] * weight;
      }
    },
    {
      description: "Returns the k-th percentile of values in a range",
      syntax: "PERCENTILE.INC(array, k)",
      category: "Statistical",
      examples: ["PERCENTILE.INC(A1:A10, 0.75)"],
    }
  );

  registry.register(
    "QUARTILE.INC",
    (args) => {
      if (args.length !== 2) {
        throw new Error("QUARTILE.INC requires exactly 2 arguments");
      }

      const numbers = (Array.isArray(args[0]) ? args[0].flat() : [args[0]])
        .map((arg) => parseFloat(arg))
        .filter((n) => !isNaN(n))
        .sort((a, b) => a - b);

      const quart = parseInt(args[1]);
      if (quart < 0 || quart > 4) return "#NUM!";
      if (numbers.length === 0) return "#NUM!";

      if (quart === 0) return numbers[0];
      if (quart === 4) return numbers[numbers.length - 1];

      const k = quart / 4;
      const index = k * (numbers.length - 1);
      const lower = Math.floor(index);
      const upper = Math.ceil(index);

      if (lower === upper) {
        return numbers[lower];
      } else {
        const weight = index - lower;
        return numbers[lower] * (1 - weight) + numbers[upper] * weight;
      }
    },
    {
      description: "Returns the quartile of a data set",
      syntax: "QUARTILE.INC(array, quart)",
      category: "Statistical",
      examples: ["QUARTILE.INC(A1:A10, 1)"],
    }
  );

  registry.register(
    "RANK.EQ",
    (args) => {
      if (args.length < 2 || args.length > 3)
        throw new Error("RANK.EQ requires 2-3 arguments");

      const number = parseFloat(args[0]);
      const ref = Array.isArray(args[1]) ? args[1].flat() : [args[1]];
      const order = args.length > 2 ? parseInt(args[2]) : 0; // 0 = descending, 1 = ascending

      const numbers = ref
        .map((arg) => parseFloat(arg))
        .filter((n) => !isNaN(n));

      numbers.sort(order === 0 ? (a, b) => b - a : (a, b) => a - b);

      const index = numbers.indexOf(number);
      return index >= 0 ? index + 1 : "#N/A";
    },
    {
      description: "Returns the rank of a number in a list of numbers",
      syntax: "RANK.EQ(number, ref, [order])",
      category: "Statistical",
      examples: ["RANK.EQ(A2, A$1:A$10)", "RANK.EQ(5, {1,2,3,4,5}, 1)"],
    }
  );

  registry.register(
    "RANK.AVG",
    (args) => {
      if (args.length < 2 || args.length > 3)
        throw new Error("RANK.AVG requires 2-3 arguments");

      const number = parseFloat(args[0]);
      const ref = Array.isArray(args[1]) ? args[1].flat() : [args[1]];
      const order = args.length > 2 ? parseInt(args[2]) : 0; // 0 = descending, 1 = ascending

      const numbers = ref
        .map((arg) => parseFloat(arg))
        .filter((n) => !isNaN(n));

      // Count occurrences and find ranks
      const occurrences = numbers.filter((n) => n === number).length;
      if (occurrences === 0) return "#N/A";

      numbers.sort(order === 0 ? (a, b) => b - a : (a, b) => a - b);

      const firstIndex = numbers.indexOf(number);
      if (occurrences === 1) {
        return firstIndex + 1;
      } else {
        // Average rank for tied values
        const lastIndex = numbers.lastIndexOf(number);
        return (firstIndex + lastIndex) / 2 + 1;
      }
    },
    {
      description:
        "Returns the rank of a number in a list of numbers (average for ties)",
      syntax: "RANK.AVG(number, ref, [order])",
      category: "Statistical",
      examples: ["RANK.AVG(A2, A$1:A$10)", "RANK.AVG(5, {1,2,3,4,5}, 1)"],
    }
  );

  registry.register(
    "SKEW",
    (args) => {
      const numbers = args
        .flat()
        .map((arg) => parseFloat(arg))
        .filter((n) => !isNaN(n));

      if (numbers.length < 3) return "#DIV/0!";

      const n = numbers.length;
      const mean = numbers.reduce((sum, val) => sum + val, 0) / n;
      const variance =
        numbers.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
        (n - 1);
      const stdDev = Math.sqrt(variance);

      if (stdDev === 0) return "#DIV/0!";

      const skewness = numbers.reduce(
        (sum, val) => sum + Math.pow((val - mean) / stdDev, 3),
        0
      );
      return (n / ((n - 1) * (n - 2))) * skewness;
    },
    {
      description: "Returns the skewness of a distribution",
      syntax: "SKEW(number1, [number2], ...)",
      category: "Statistical",
      examples: ["SKEW(A1:A10)"],
    }
  );

  registry.register(
    "KURT",
    (args) => {
      const numbers = args
        .flat()
        .map((arg) => parseFloat(arg))
        .filter((n) => !isNaN(n));

      if (numbers.length < 4) return "#DIV/0!";

      const n = numbers.length;
      const mean = numbers.reduce((sum, val) => sum + val, 0) / n;
      const variance =
        numbers.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
        (n - 1);
      const stdDev = Math.sqrt(variance);

      if (stdDev === 0) return "#DIV/0!";

      const kurtosis = numbers.reduce(
        (sum, val) => sum + Math.pow((val - mean) / stdDev, 4),
        0
      );
      return (
        ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) * kurtosis -
        (3 * Math.pow(n - 1, 2)) / ((n - 2) * (n - 3))
      );
    },
    {
      description: "Returns the kurtosis of a data set",
      syntax: "KURT(number1, [number2], ...)",
      category: "Statistical",
      examples: ["KURT(A1:A10)"],
    }
  );

  registry.register(
    "TRIMMEAN",
    (args) => {
      if (args.length !== 2) {
        throw new Error("TRIMMEAN requires exactly 2 arguments");
      }

      const numbers = (Array.isArray(args[0]) ? args[0].flat() : [args[0]])
        .map((arg) => parseFloat(arg))
        .filter((n) => !isNaN(n))
        .sort((a, b) => a - b);

      const percent = parseFloat(args[1]);
      if (percent < 0 || percent > 1) return "#NUM!";
      if (numbers.length === 0) return 0;

      const trimCount = Math.floor((numbers.length * percent) / 2);
      const trimmedNumbers = numbers.slice(
        trimCount,
        numbers.length - trimCount
      );

      if (trimmedNumbers.length === 0) return 0;
      return (
        trimmedNumbers.reduce((sum, val) => sum + val, 0) /
        trimmedNumbers.length
      );
    },
    {
      description: "Returns the mean of the interior of a data set",
      syntax: "TRIMMEAN(array, percent)",
      category: "Statistical",
      examples: ["TRIMMEAN(A1:A10, 0.2)"],
    }
  );

  registry.register(
    "STDEV.S",
    (args) => {
      const numbers = args
        .flat()
        .map((arg) => parseFloat(arg))
        .filter((n) => !isNaN(n));

      if (numbers.length < 2) return "#DIV/0!";

      const mean = numbers.reduce((sum, val) => sum + val, 0) / numbers.length;
      const variance =
        numbers.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
        (numbers.length - 1);
      return Math.sqrt(variance);
    },
    {
      description: "Estimates standard deviation based on a sample",
      syntax: "STDEV.S(number1, [number2], ...)",
      category: "Statistical",
      examples: ["STDEV.S(A1:A10)"],
    }
  );

  registry.register(
    "STDEV.P",
    (args) => {
      const numbers = args
        .flat()
        .map((arg) => parseFloat(arg))
        .filter((n) => !isNaN(n));

      if (numbers.length === 0) return "#DIV/0!";

      const mean = numbers.reduce((sum, val) => sum + val, 0) / numbers.length;
      const variance =
        numbers.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
        numbers.length;
      return Math.sqrt(variance);
    },
    {
      description:
        "Calculates standard deviation based on the entire population",
      syntax: "STDEV.P(number1, [number2], ...)",
      category: "Statistical",
      examples: ["STDEV.P(A1:A10)"],
    }
  );

  registry.register(
    "VAR.S",
    (args) => {
      const numbers = args
        .flat()
        .map((arg) => parseFloat(arg))
        .filter((n) => !isNaN(n));

      if (numbers.length < 2) return "#DIV/0!";

      const mean = numbers.reduce((sum, val) => sum + val, 0) / numbers.length;
      return (
        numbers.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
        (numbers.length - 1)
      );
    },
    {
      description: "Estimates variance based on a sample",
      syntax: "VAR.S(number1, [number2], ...)",
      category: "Statistical",
      examples: ["VAR.S(A1:A10)"],
    }
  );

  registry.register(
    "VAR.P",
    (args) => {
      const numbers = args
        .flat()
        .map((arg) => parseFloat(arg))
        .filter((n) => !isNaN(n));

      if (numbers.length === 0) return "#DIV/0!";

      const mean = numbers.reduce((sum, val) => sum + val, 0) / numbers.length;
      return (
        numbers.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
        numbers.length
      );
    },
    {
      description: "Calculates variance based on the entire population",
      syntax: "VAR.P(number1, [number2], ...)",
      category: "Statistical",
      examples: ["VAR.P(A1:A10)"],
    }
  );

  registry.register(
    "DEVSQ",
    (args) => {
      const numbers = args
        .flat()
        .map((arg) => parseFloat(arg))
        .filter((n) => !isNaN(n));

      if (numbers.length === 0) return 0;

      const mean = numbers.reduce((sum, val) => sum + val, 0) / numbers.length;
      return numbers.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0);
    },
    {
      description: "Returns the sum of squares of deviations",
      syntax: "DEVSQ(number1, [number2], ...)",
      category: "Statistical",
      examples: ["DEVSQ(A1:A10)"],
    }
  );

  registry.register(
    "CORREL",
    (args) => {
      if (args.length !== 2) {
        throw new Error("CORREL requires exactly 2 arguments");
      }

      const array1 = Array.isArray(args[0]) ? args[0].flat() : [args[0]];
      const array2 = Array.isArray(args[1]) ? args[1].flat() : [args[1]];

      if (array1.length !== array2.length) return "#N/A";

      const pairs = array1
        .map((val, i) => ({
          x: parseFloat(val),
          y: parseFloat(array2[i]),
        }))
        .filter((pair) => !isNaN(pair.x) && !isNaN(pair.y));

      if (pairs.length < 2) return "#DIV/0!";

      const n = pairs.length;
      const sumX = pairs.reduce((sum, pair) => sum + pair.x, 0);
      const sumY = pairs.reduce((sum, pair) => sum + pair.y, 0);
      const sumXY = pairs.reduce((sum, pair) => sum + pair.x * pair.y, 0);
      const sumX2 = pairs.reduce((sum, pair) => sum + pair.x * pair.x, 0);
      const sumY2 = pairs.reduce((sum, pair) => sum + pair.y * pair.y, 0);

      const numerator = n * sumXY - sumX * sumY;
      const denominator = Math.sqrt(
        (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY)
      );

      return denominator === 0 ? "#DIV/0!" : numerator / denominator;
    },
    {
      description: "Returns the correlation coefficient between two data sets",
      syntax: "CORREL(array1, array2)",
      category: "Statistical",
      examples: ["CORREL(A1:A10, B1:B10)"],
    }
  );

  registry.register(
    "PEARSON",
    (args) => {
      if (args.length !== 2) {
        throw new Error("PEARSON requires exactly 2 arguments");
      }

      // PEARSON is identical to CORREL
      const array1 = Array.isArray(args[0]) ? args[0].flat() : [args[0]];
      const array2 = Array.isArray(args[1]) ? args[1].flat() : [args[1]];

      if (array1.length !== array2.length) return "#N/A";

      const pairs = array1
        .map((val, i) => ({
          x: parseFloat(val),
          y: parseFloat(array2[i]),
        }))
        .filter((pair) => !isNaN(pair.x) && !isNaN(pair.y));

      if (pairs.length < 2) return "#DIV/0!";

      const n = pairs.length;
      const sumX = pairs.reduce((sum, pair) => sum + pair.x, 0);
      const sumY = pairs.reduce((sum, pair) => sum + pair.y, 0);
      const sumXY = pairs.reduce((sum, pair) => sum + pair.x * pair.y, 0);
      const sumX2 = pairs.reduce((sum, pair) => sum + pair.x * pair.x, 0);
      const sumY2 = pairs.reduce((sum, pair) => sum + pair.y * pair.y, 0);

      const numerator = n * sumXY - sumX * sumY;
      const denominator = Math.sqrt(
        (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY)
      );

      return denominator === 0 ? "#DIV/0!" : numerator / denominator;
    },
    {
      description: "Returns the Pearson product moment correlation coefficient",
      syntax: "PEARSON(array1, array2)",
      category: "Statistical",
      examples: ["PEARSON(A1:A10, B1:B10)"],
    }
  );

  registry.register(
    "RSQ",
    (args) => {
      if (args.length !== 2) {
        throw new Error("RSQ requires exactly 2 arguments");
      }

      const array1 = Array.isArray(args[0]) ? args[0].flat() : [args[0]];
      const array2 = Array.isArray(args[1]) ? args[1].flat() : [args[1]];

      if (array1.length !== array2.length) return "#N/A";

      const pairs = array1
        .map((val, i) => ({
          x: parseFloat(val),
          y: parseFloat(array2[i]),
        }))
        .filter((pair) => !isNaN(pair.x) && !isNaN(pair.y));

      if (pairs.length < 2) return "#DIV/0!";

      const n = pairs.length;
      const sumX = pairs.reduce((sum, pair) => sum + pair.x, 0);
      const sumY = pairs.reduce((sum, pair) => sum + pair.y, 0);
      const sumXY = pairs.reduce((sum, pair) => sum + pair.x * pair.y, 0);
      const sumX2 = pairs.reduce((sum, pair) => sum + pair.x * pair.x, 0);
      const sumY2 = pairs.reduce((sum, pair) => sum + pair.y * pair.y, 0);

      const numerator = n * sumXY - sumX * sumY;
      const denominator = Math.sqrt(
        (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY)
      );

      if (denominator === 0) return "#DIV/0!";

      const correlation = numerator / denominator;
      return correlation * correlation; // R-squared is correlation squared
    },
    {
      description:
        "Returns the square of the Pearson product moment correlation coefficient",
      syntax: "RSQ(known_y_s, known_x_s)",
      category: "Statistical",
      examples: ["RSQ(A1:A10, B1:B10)"],
    }
  );

  registry.register(
    "STANDARDIZE",
    (args) => {
      if (args.length !== 3) {
        throw new Error("STANDARDIZE requires exactly 3 arguments");
      }

      const x = parseFloat(args[0]);
      const mean = parseFloat(args[1]);
      const standardDev = parseFloat(args[2]);

      if (isNaN(x) || isNaN(mean) || isNaN(standardDev)) return "#VALUE!";
      if (standardDev <= 0) return "#NUM!";

      return (x - mean) / standardDev;
    },
    {
      description: "Returns a normalized value",
      syntax: "STANDARDIZE(x, mean, standard_dev)",
      category: "Statistical",
      examples: ["STANDARDIZE(42, 40, 1.5)"],
    }
  );

  // Legacy functions for backward compatibility
  registry.register(
    "STDEVP",
    (args) => {
      const numbers = args
        .flat()
        .map((arg) => parseFloat(arg))
        .filter((n) => !isNaN(n));

      if (numbers.length === 0) return "#DIV/0!";

      const mean = numbers.reduce((sum, val) => sum + val, 0) / numbers.length;
      const variance =
        numbers.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
        numbers.length;
      return Math.sqrt(variance);
    },
    {
      description:
        "[Legacy] Calculates standard deviation based on the entire population",
      syntax: "STDEVP(number1, [number2], ...)",
      category: "Statistical",
      examples: ["STDEVP(A1:A10)"],
    }
  );

  registry.register(
    "VARP",
    (args) => {
      const numbers = args
        .flat()
        .map((arg) => parseFloat(arg))
        .filter((n) => !isNaN(n));

      if (numbers.length === 0) return "#DIV/0!";

      const mean = numbers.reduce((sum, val) => sum + val, 0) / numbers.length;
      return (
        numbers.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
        numbers.length
      );
    },
    {
      description:
        "[Legacy] Calculates variance based on the entire population",
      syntax: "VARP(number1, [number2], ...)",
      category: "Statistical",
      examples: ["VARP(A1:A10)"],
    }
  );

  registry.register(
    "PERCENTILE",
    (args) => {
      if (args.length !== 2) {
        throw new Error("PERCENTILE requires exactly 2 arguments");
      }

      const numbers = (Array.isArray(args[0]) ? args[0].flat() : [args[0]])
        .map((arg) => parseFloat(arg))
        .filter((n) => !isNaN(n))
        .sort((a, b) => a - b);

      const k = parseFloat(args[1]);
      if (k < 0 || k > 1) return "#NUM!";
      if (numbers.length === 0) return "#NUM!";

      if (k === 0) return numbers[0];
      if (k === 1) return numbers[numbers.length - 1];

      const index = k * (numbers.length - 1);
      const lower = Math.floor(index);
      const upper = Math.ceil(index);

      if (lower === upper) {
        return numbers[lower];
      } else {
        const weight = index - lower;
        return numbers[lower] * (1 - weight) + numbers[upper] * weight;
      }
    },
    {
      description: "[Legacy] Returns the k-th percentile of values in a range",
      syntax: "PERCENTILE(array, k)",
      category: "Statistical",
      examples: ["PERCENTILE(A1:A10, 0.75)"],
    }
  );

  registry.register(
    "QUARTILE",
    (args) => {
      if (args.length !== 2) {
        throw new Error("QUARTILE requires exactly 2 arguments");
      }

      const numbers = (Array.isArray(args[0]) ? args[0].flat() : [args[0]])
        .map((arg) => parseFloat(arg))
        .filter((n) => !isNaN(n))
        .sort((a, b) => a - b);

      const quart = parseInt(args[1]);
      if (quart < 0 || quart > 4) return "#NUM!";
      if (numbers.length === 0) return "#NUM!";

      if (quart === 0) return numbers[0];
      if (quart === 4) return numbers[numbers.length - 1];

      const k = quart / 4;
      const index = k * (numbers.length - 1);
      const lower = Math.floor(index);
      const upper = Math.ceil(index);

      if (lower === upper) {
        return numbers[lower];
      } else {
        const weight = index - lower;
        return numbers[lower] * (1 - weight) + numbers[upper] * weight;
      }
    },
    {
      description: "[Legacy] Returns the quartile of a data set",
      syntax: "QUARTILE(array, quart)",
      category: "Statistical",
      examples: ["QUARTILE(A1:A10, 1)"],
    }
  );

  registry.register(
    "PERCENTRANK",
    (args) => {
      if (args.length < 2 || args.length > 3) {
        throw new Error("PERCENTRANK requires 2-3 arguments");
      }

      const array = Array.isArray(args[0]) ? args[0].flat() : [args[0]];
      const x = parseFloat(args[1]);
      const significance = args.length > 2 ? parseInt(args[2]) : 3;

      const numbers = array
        .map((arg) => parseFloat(arg))
        .filter((n) => !isNaN(n))
        .sort((a, b) => a - b);

      if (numbers.length === 0) return "#NUM!";
      if (x < numbers[0] || x > numbers[numbers.length - 1]) return "#N/A";

      let count = 0;
      for (const num of numbers) {
        if (num < x) count++;
      }

      const rank = count / (numbers.length - 1);
      const multiplier = Math.pow(10, significance);
      return Math.round(rank * multiplier) / multiplier;
    },
    {
      description:
        "[Legacy] Returns the percentage rank of a value in a data set",
      syntax: "PERCENTRANK(array, x, [significance])",
      category: "Statistical",
      examples: ["PERCENTRANK(A1:A10, 2)", "PERCENTRANK(A1:A10, 2, 4)"],
    }
  );

  registry.register(
    "FORECAST",
    (args) => {
      if (args.length !== 3) {
        throw new Error("FORECAST requires exactly 3 arguments");
      }

      const x = parseFloat(args[0]);
      const knownYs = Array.isArray(args[1]) ? args[1].flat() : [args[1]];
      const knownXs = Array.isArray(args[2]) ? args[2].flat() : [args[2]];

      if (knownYs.length !== knownXs.length || knownYs.length === 0)
        return "#N/A";

      const pairs = knownYs
        .map((y, i) => ({
          x: parseFloat(knownXs[i]),
          y: parseFloat(y),
        }))
        .filter((pair) => !isNaN(pair.x) && !isNaN(pair.y));

      if (pairs.length < 2) return "#DIV/0!";

      const n = pairs.length;
      const sumX = pairs.reduce((sum, pair) => sum + pair.x, 0);
      const sumY = pairs.reduce((sum, pair) => sum + pair.y, 0);
      const sumXY = pairs.reduce((sum, pair) => sum + pair.x * pair.y, 0);
      const sumX2 = pairs.reduce((sum, pair) => sum + pair.x * pair.x, 0);

      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;

      return slope * x + intercept;
    },
    {
      description:
        "[Legacy] Calculates, or predicts, a future value by using existing values",
      syntax: "FORECAST(x, known_y_s, known_x_s)",
      category: "Statistical",
      examples: ["FORECAST(30, A1:A10, B1:B10)"],
    }
  );

  registry.register(
    "COVAR",
    (args) => {
      if (args.length !== 2) {
        throw new Error("COVAR requires exactly 2 arguments");
      }

      const array1 = Array.isArray(args[0]) ? args[0].flat() : [args[0]];
      const array2 = Array.isArray(args[1]) ? args[1].flat() : [args[1]];

      if (array1.length !== array2.length || array1.length === 0) return "#N/A";

      const pairs = array1
        .map((val, i) => ({
          x: parseFloat(val),
          y: parseFloat(array2[i]),
        }))
        .filter((pair) => !isNaN(pair.x) && !isNaN(pair.y));

      if (pairs.length === 0) return "#DIV/0!";

      const n = pairs.length;
      const meanX = pairs.reduce((sum, pair) => sum + pair.x, 0) / n;
      const meanY = pairs.reduce((sum, pair) => sum + pair.y, 0) / n;

      const covariance =
        pairs.reduce(
          (sum, pair) => sum + (pair.x - meanX) * (pair.y - meanY),
          0
        ) / n; // Population covariance

      return covariance;
    },
    {
      description:
        "[Legacy] Returns covariance, the average of the products of paired deviations",
      syntax: "COVAR(array1, array2)",
      category: "Statistical",
      examples: ["COVAR(A1:A10, B1:B10)"],
    }
  );

  registry.register(
    "CONFIDENCE",
    (args) => {
      if (args.length !== 3) {
        throw new Error("CONFIDENCE requires exactly 3 arguments");
      }

      const alpha = parseFloat(args[0]);
      const standardDev = parseFloat(args[1]);
      const size = parseFloat(args[2]);

      if (alpha <= 0 || alpha >= 1) return "#NUM!";
      if (standardDev <= 0) return "#NUM!";
      if (size < 1) return "#NUM!";

      // Calculate critical z-value for two-tailed test
      const zAlpha = 1.96; // Approximation for 95% confidence (alpha = 0.05)

      return zAlpha * (standardDev / Math.sqrt(size));
    },
    {
      description:
        "[Legacy] Returns the confidence interval for a population mean",
      syntax: "CONFIDENCE(alpha, standard_dev, size)",
      category: "Statistical",
      examples: ["CONFIDENCE(0.05, 2.5, 50)"],
    }
  );
}
