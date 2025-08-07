// Math and Trigonometry Functions
import { FunctionRegistry } from "../FunctionRegistry";

export function registerMathFunctions(registry: FunctionRegistry) {
  // Basic math functions
  registry.register(
    "SUM",
    (args) => {
      const numbers = args.flat().map((arg) => {
        const num = parseFloat(arg);
        return isNaN(num) ? 0 : num;
      });
      return numbers.reduce((sum, val) => sum + val, 0);
    },
    {
      description: "Adds all numbers in a range of cells",
      syntax: "SUM(number1, [number2], ...)",
      category: "Math",
      examples: ["SUM(A1:A10)", "SUM(5, 10, 15)"],
    }
  );

  registry.register(
    "PRODUCT",
    (args) => {
      const numbers = args
        .flat()
        .map((arg) => parseFloat(arg))
        .filter((n) => !isNaN(n));
      return numbers.length > 0
        ? numbers.reduce((prod, val) => prod * val, 1)
        : 0;
    },
    {
      description: "Multiplies all the numbers given as arguments",
      syntax: "PRODUCT(number1, [number2], ...)",
      category: "Math",
      examples: ["PRODUCT(A1:A10)", "PRODUCT(2, 3, 4)"],
    }
  );

  registry.register(
    "POWER",
    (args) => {
      if (args.length !== 2)
        throw new Error("POWER requires exactly 2 arguments");
      return Math.pow(parseFloat(args[0]), parseFloat(args[1]));
    },
    {
      description: "Returns the result of a number raised to a power",
      syntax: "POWER(number, power)",
      category: "Math",
      examples: ["POWER(2, 3)", "POWER(A1, 2)"],
    }
  );

  registry.register(
    "SQRT",
    (args) => {
      if (args.length !== 1)
        throw new Error("SQRT requires exactly 1 argument");
      const num = parseFloat(args[0]);
      if (num < 0)
        throw new Error("Cannot calculate square root of negative number");
      return Math.sqrt(num);
    },
    {
      description: "Returns the square root of a number",
      syntax: "SQRT(number)",
      category: "Math",
      examples: ["SQRT(16)", "SQRT(A1)"],
    }
  );

  registry.register(
    "ABS",
    (args) => {
      if (args.length !== 1) throw new Error("ABS requires exactly 1 argument");
      return Math.abs(parseFloat(args[0]));
    },
    {
      description: "Returns the absolute value of a number",
      syntax: "ABS(number)",
      category: "Math",
      examples: ["ABS(-5)", "ABS(A1)"],
    }
  );

  registry.register(
    "ROUND",
    (args) => {
      if (args.length < 1 || args.length > 2)
        throw new Error("ROUND requires 1-2 arguments");
      const num = parseFloat(args[0]);
      const digits = args.length > 1 ? parseInt(args[1]) : 0;
      return Math.round(num * Math.pow(10, digits)) / Math.pow(10, digits);
    },
    {
      description: "Rounds a number to a specified number of digits",
      syntax: "ROUND(number, [num_digits])",
      category: "Math",
      examples: ["ROUND(3.14159, 2)", "ROUND(A1, 0)"],
    }
  );

  registry.register(
    "CEILING",
    (args) => {
      if (args.length < 1 || args.length > 2)
        throw new Error("CEILING requires 1-2 arguments");
      const num = parseFloat(args[0]);
      const significance = args.length > 1 ? parseFloat(args[1]) : 1;
      return Math.ceil(num / significance) * significance;
    },
    {
      description:
        "Rounds a number up to the nearest integer or multiple of significance",
      syntax: "CEILING(number, [significance])",
      category: "Math",
      examples: ["CEILING(3.2)", "CEILING(4.3, 0.5)"],
    }
  );

  registry.register(
    "FLOOR",
    (args) => {
      if (args.length < 1 || args.length > 2)
        throw new Error("FLOOR requires 1-2 arguments");
      const num = parseFloat(args[0]);
      const significance = args.length > 1 ? parseFloat(args[1]) : 1;
      return Math.floor(num / significance) * significance;
    },
    {
      description:
        "Rounds a number down to the nearest integer or multiple of significance",
      syntax: "FLOOR(number, [significance])",
      category: "Math",
      examples: ["FLOOR(3.8)", "FLOOR(4.7, 0.5)"],
    }
  );

  // Trigonometry functions
  registry.register(
    "SIN",
    (args) => {
      if (args.length !== 1) throw new Error("SIN requires exactly 1 argument");
      return Math.sin(parseFloat(args[0]));
    },
    {
      description: "Returns the sine of an angle",
      syntax: "SIN(number)",
      category: "Math",
      examples: ["SIN(PI()/2)", "SIN(RADIANS(90))"],
    }
  );

  registry.register(
    "COS",
    (args) => {
      if (args.length !== 1) throw new Error("COS requires exactly 1 argument");
      return Math.cos(parseFloat(args[0]));
    },
    {
      description: "Returns the cosine of an angle",
      syntax: "COS(number)",
      category: "Math",
      examples: ["COS(0)", "COS(RADIANS(90))"],
    }
  );

  registry.register(
    "TAN",
    (args) => {
      if (args.length !== 1) throw new Error("TAN requires exactly 1 argument");
      return Math.tan(parseFloat(args[0]));
    },
    {
      description: "Returns the tangent of an angle",
      syntax: "TAN(number)",
      category: "Math",
      examples: ["TAN(PI()/4)", "TAN(RADIANS(45))"],
    }
  );

  registry.register("PI", () => Math.PI, {
    description: "Returns the value of pi",
    syntax: "PI()",
    category: "Math",
    examples: ["PI()", "2*PI()"],
  });

  registry.register(
    "RADIANS",
    (args) => {
      if (args.length !== 1)
        throw new Error("RADIANS requires exactly 1 argument");
      return (parseFloat(args[0]) * Math.PI) / 180;
    },
    {
      description: "Converts degrees to radians",
      syntax: "RADIANS(angle)",
      category: "Math",
      examples: ["RADIANS(90)", "RADIANS(180)"],
    }
  );

  registry.register(
    "DEGREES",
    (args) => {
      if (args.length !== 1)
        throw new Error("DEGREES requires exactly 1 argument");
      return (parseFloat(args[0]) * 180) / Math.PI;
    },
    {
      description: "Converts radians to degrees",
      syntax: "DEGREES(angle)",
      category: "Math",
      examples: ["DEGREES(PI())", "DEGREES(PI()/2)"],
    }
  );

  registry.register(
    "MOD",
    (args) => {
      if (args.length !== 2)
        throw new Error("MOD requires exactly 2 arguments");
      return parseFloat(args[0]) % parseFloat(args[1]);
    },
    {
      description: "Returns the remainder from division",
      syntax: "MOD(number, divisor)",
      category: "Math",
      examples: ["MOD(10, 3)", "MOD(A1, B1)"],
    }
  );

  // Advanced math functions
  registry.register(
    "SUMIFS",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length < 3 || args.length % 2 === 0) {
        throw new Error(
          "SUMIFS requires an odd number of arguments (sum_range, criteria_range1, criteria1, ...)"
        );
      }

      const sumRange = args[0];
      if (!Array.isArray(sumRange)) {
        throw new Error("Sum range must be an array");
      }

      let total = 0;
      for (let i = 0; i < sumRange.length; i++) {
        let meetsCriteria = true;

        // Check all criteria pairs
        for (let j = 1; j < args.length; j += 2) {
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
          const num = parseFloat(sumRange[i]);
          if (!isNaN(num)) {
            total += num;
          }
        }
      }

      return total;
    },
    {
      description: "Adds the cells in a range that meet multiple criteria",
      syntax:
        "SUMIFS(sum_range, criteria_range1, criteria1, [criteria_range2, criteria2], ...)",
      category: "Math",
      examples: ['SUMIFS(D2:D10, A2:A10, "Product", B2:B10, ">10")'],
    }
  );

  registry.register(
    "LOG",
    (args) => {
      if (args.length < 1 || args.length > 2)
        throw new Error("LOG requires 1-2 arguments");
      const num = parseFloat(args[0]);
      const base = args.length > 1 ? parseFloat(args[1]) : 10;
      return Math.log(num) / Math.log(base);
    },
    {
      description: "Returns the logarithm of a number to a specified base",
      syntax: "LOG(number, [base])",
      category: "Math",
      examples: ["LOG(100)", "LOG(8, 2)"],
    }
  );

  registry.register(
    "LN",
    (args) => {
      if (args.length !== 1) throw new Error("LN requires exactly 1 argument");
      return Math.log(parseFloat(args[0]));
    },
    {
      description: "Returns the natural logarithm of a number",
      syntax: "LN(number)",
      category: "Math",
      examples: ["LN(EXP(1))", "LN(10)"],
    }
  );

  registry.register(
    "EXP",
    (args) => {
      if (args.length !== 1) throw new Error("EXP requires exactly 1 argument");
      return Math.exp(parseFloat(args[0]));
    },
    {
      description: "Returns e raised to the power of a given number",
      syntax: "EXP(number)",
      category: "Math",
      examples: ["EXP(1)", "EXP(2)"],
    }
  );

  // Additional trigonometry functions
  registry.register(
    "ACOS",
    (args) => {
      if (args.length !== 1)
        throw new Error("ACOS requires exactly 1 argument");
      const num = parseFloat(args[0]);
      if (num < -1 || num > 1)
        throw new Error("ACOS input must be between -1 and 1");
      return Math.acos(num);
    },
    {
      description: "Returns the arccosine of a number",
      syntax: "ACOS(number)",
      category: "Math",
      examples: ["ACOS(0.5)", "ACOS(-1)"],
    }
  );

  registry.register(
    "ASIN",
    (args) => {
      if (args.length !== 1)
        throw new Error("ASIN requires exactly 1 argument");
      const num = parseFloat(args[0]);
      if (num < -1 || num > 1)
        throw new Error("ASIN input must be between -1 and 1");
      return Math.asin(num);
    },
    {
      description: "Returns the arcsine of a number",
      syntax: "ASIN(number)",
      category: "Math",
      examples: ["ASIN(0.5)", "ASIN(1)"],
    }
  );

  registry.register(
    "ATAN",
    (args) => {
      if (args.length !== 1)
        throw new Error("ATAN requires exactly 1 argument");
      return Math.atan(parseFloat(args[0]));
    },
    {
      description: "Returns the arctangent of a number",
      syntax: "ATAN(number)",
      category: "Math",
      examples: ["ATAN(1)", "ATAN(0)"],
    }
  );

  registry.register(
    "ATAN2",
    (args) => {
      if (args.length !== 2)
        throw new Error("ATAN2 requires exactly 2 arguments");
      return Math.atan2(parseFloat(args[0]), parseFloat(args[1]));
    },
    {
      description: "Returns the arctangent from x- and y-coordinates",
      syntax: "ATAN2(x_num, y_num)",
      category: "Math",
      examples: ["ATAN2(1, 1)", "ATAN2(4, 3)"],
    }
  );

  // Hyperbolic functions
  registry.register(
    "SINH",
    (args) => {
      if (args.length !== 1)
        throw new Error("SINH requires exactly 1 argument");
      return Math.sinh(parseFloat(args[0]));
    },
    {
      description: "Returns the hyperbolic sine of a number",
      syntax: "SINH(number)",
      category: "Math",
      examples: ["SINH(1)", "SINH(0)"],
    }
  );

  registry.register(
    "COSH",
    (args) => {
      if (args.length !== 1)
        throw new Error("COSH requires exactly 1 argument");
      return Math.cosh(parseFloat(args[0]));
    },
    {
      description: "Returns the hyperbolic cosine of a number",
      syntax: "COSH(number)",
      category: "Math",
      examples: ["COSH(0)", "COSH(1)"],
    }
  );

  registry.register(
    "TANH",
    (args) => {
      if (args.length !== 1)
        throw new Error("TANH requires exactly 1 argument");
      return Math.tanh(parseFloat(args[0]));
    },
    {
      description: "Returns the hyperbolic tangent of a number",
      syntax: "TANH(number)",
      category: "Math",
      examples: ["TANH(0)", "TANH(1)"],
    }
  );

  registry.register(
    "ACOSH",
    (args) => {
      if (args.length !== 1)
        throw new Error("ACOSH requires exactly 1 argument");
      const num = parseFloat(args[0]);
      if (num < 1) throw new Error("ACOSH input must be >= 1");
      return Math.acosh(num);
    },
    {
      description: "Returns the inverse hyperbolic cosine of a number",
      syntax: "ACOSH(number)",
      category: "Math",
      examples: ["ACOSH(1)", "ACOSH(2)"],
    }
  );

  registry.register(
    "ASINH",
    (args) => {
      if (args.length !== 1)
        throw new Error("ASINH requires exactly 1 argument");
      return Math.asinh(parseFloat(args[0]));
    },
    {
      description: "Returns the inverse hyperbolic sine of a number",
      syntax: "ASINH(number)",
      category: "Math",
      examples: ["ASINH(1)", "ASINH(0)"],
    }
  );

  registry.register(
    "ATANH",
    (args) => {
      if (args.length !== 1)
        throw new Error("ATANH requires exactly 1 argument");
      const num = parseFloat(args[0]);
      if (num <= -1 || num >= 1)
        throw new Error("ATANH input must be between -1 and 1 (exclusive)");
      return Math.atanh(num);
    },
    {
      description: "Returns the inverse hyperbolic tangent of a number",
      syntax: "ATANH(number)",
      category: "Math",
      examples: ["ATANH(0.5)", "ATANH(-0.5)"],
    }
  );

  // Additional rounding functions
  registry.register(
    "ROUNDUP",
    (args) => {
      if (args.length < 1 || args.length > 2)
        throw new Error("ROUNDUP requires 1-2 arguments");
      const num = parseFloat(args[0]);
      const digits = args.length > 1 ? parseInt(args[1]) : 0;
      const multiplier = Math.pow(10, digits);
      return Math.ceil(num * multiplier) / multiplier;
    },
    {
      description: "Rounds a number up, away from zero",
      syntax: "ROUNDUP(number, [num_digits])",
      category: "Math",
      examples: ["ROUNDUP(3.14159, 2)", "ROUNDUP(-3.14, 1)"],
    }
  );

  registry.register(
    "ROUNDDOWN",
    (args) => {
      if (args.length < 1 || args.length > 2)
        throw new Error("ROUNDDOWN requires 1-2 arguments");
      const num = parseFloat(args[0]);
      const digits = args.length > 1 ? parseInt(args[1]) : 0;
      const multiplier = Math.pow(10, digits);
      return Math.floor(num * multiplier) / multiplier;
    },
    {
      description: "Rounds a number down, toward zero",
      syntax: "ROUNDDOWN(number, [num_digits])",
      category: "Math",
      examples: ["ROUNDDOWN(3.14159, 2)", "ROUNDDOWN(-3.14, 1)"],
    }
  );

  registry.register(
    "INT",
    (args) => {
      if (args.length !== 1) throw new Error("INT requires exactly 1 argument");
      return Math.floor(parseFloat(args[0]));
    },
    {
      description: "Rounds a number down to the nearest integer",
      syntax: "INT(number)",
      category: "Math",
      examples: ["INT(3.7)", "INT(-3.7)"],
    }
  );

  registry.register(
    "TRUNC",
    (args) => {
      if (args.length < 1 || args.length > 2)
        throw new Error("TRUNC requires 1-2 arguments");
      const num = parseFloat(args[0]);
      const digits = args.length > 1 ? parseInt(args[1]) : 0;
      const multiplier = Math.pow(10, digits);
      return Math.trunc(num * multiplier) / multiplier;
    },
    {
      description: "Truncates a number to an integer",
      syntax: "TRUNC(number, [num_digits])",
      category: "Math",
      examples: ["TRUNC(3.14159, 2)", "TRUNC(-3.14)"],
    }
  );

  registry.register(
    "EVEN",
    (args) => {
      if (args.length !== 1)
        throw new Error("EVEN requires exactly 1 argument");
      const num = parseFloat(args[0]);
      return num >= 0 ? Math.ceil(num / 2) * 2 : Math.floor(num / 2) * 2;
    },
    {
      description: "Rounds a number up to the nearest even integer",
      syntax: "EVEN(number)",
      category: "Math",
      examples: ["EVEN(3)", "EVEN(-2.5)"],
    }
  );

  registry.register(
    "ODD",
    (args) => {
      if (args.length !== 1) throw new Error("ODD requires exactly 1 argument");
      const num = parseFloat(args[0]);
      const abs = Math.abs(num);
      const rounded = Math.ceil(abs);
      const oddRounded = rounded % 2 === 0 ? rounded + 1 : rounded;
      return num >= 0 ? oddRounded : -oddRounded;
    },
    {
      description: "Rounds a number up to the nearest odd integer",
      syntax: "ODD(number)",
      category: "Math",
      examples: ["ODD(2)", "ODD(-2.5)"],
    }
  );

  // Additional math functions
  registry.register(
    "SIGN",
    (args) => {
      if (args.length !== 1)
        throw new Error("SIGN requires exactly 1 argument");
      return Math.sign(parseFloat(args[0]));
    },
    {
      description: "Returns the sign of a number",
      syntax: "SIGN(number)",
      category: "Math",
      examples: ["SIGN(10)", "SIGN(-5)", "SIGN(0)"],
    }
  );

  registry.register(
    "FACT",
    (args) => {
      if (args.length !== 1)
        throw new Error("FACT requires exactly 1 argument");
      const num = parseInt(args[0]);
      if (num < 0) throw new Error("FACT requires a non-negative integer");
      if (num > 170) throw new Error("FACT result would be too large");
      let result = 1;
      for (let i = 2; i <= num; i++) {
        result *= i;
      }
      return result;
    },
    {
      description: "Returns the factorial of a number",
      syntax: "FACT(number)",
      category: "Math",
      examples: ["FACT(5)", "FACT(0)"],
    }
  );

  registry.register(
    "SQRTPI",
    (args) => {
      if (args.length !== 1)
        throw new Error("SQRTPI requires exactly 1 argument");
      const num = parseFloat(args[0]);
      if (num < 0) throw new Error("SQRTPI requires a non-negative number");
      return Math.sqrt(num * Math.PI);
    },
    {
      description: "Returns the square root of (number * pi)",
      syntax: "SQRTPI(number)",
      category: "Math",
      examples: ["SQRTPI(1)", "SQRTPI(4)"],
    }
  );

  registry.register(
    "LOG10",
    (args) => {
      if (args.length !== 1)
        throw new Error("LOG10 requires exactly 1 argument");
      const num = parseFloat(args[0]);
      if (num <= 0) throw new Error("LOG10 requires a positive number");
      return Math.log10(num);
    },
    {
      description: "Returns the base-10 logarithm of a number",
      syntax: "LOG10(number)",
      category: "Math",
      examples: ["LOG10(100)", "LOG10(10)"],
    }
  );

  registry.register(
    "RAND",
    () => {
      return Math.random();
    },
    {
      description: "Returns a random number between 0 and 1",
      syntax: "RAND()",
      category: "Math",
      examples: ["RAND()", "RAND()*10"],
    }
  );

  registry.register(
    "RANDBETWEEN",
    (args) => {
      if (args.length !== 2)
        throw new Error("RANDBETWEEN requires exactly 2 arguments");
      const bottom = parseInt(args[0]);
      const top = parseInt(args[1]);
      if (bottom > top)
        throw new Error("Bottom value must be less than or equal to top value");
      return Math.floor(Math.random() * (top - bottom + 1)) + bottom;
    },
    {
      description: "Returns a random number between the numbers you specify",
      syntax: "RANDBETWEEN(bottom, top)",
      category: "Math",
      examples: ["RANDBETWEEN(1, 10)", "RANDBETWEEN(-5, 5)"],
    }
  );

  registry.register(
    "QUOTIENT",
    (args) => {
      if (args.length !== 2)
        throw new Error("QUOTIENT requires exactly 2 arguments");
      const numerator = parseFloat(args[0]);
      const denominator = parseFloat(args[1]);
      if (denominator === 0) throw new Error("Division by zero");
      return Math.trunc(numerator / denominator);
    },
    {
      description: "Returns the integer portion of a division",
      syntax: "QUOTIENT(numerator, denominator)",
      category: "Math",
      examples: ["QUOTIENT(10, 3)", "QUOTIENT(-10, 3)"],
    }
  );

  registry.register(
    "MROUND",
    (args) => {
      if (args.length !== 2)
        throw new Error("MROUND requires exactly 2 arguments");
      const number = parseFloat(args[0]);
      const multiple = parseFloat(args[1]);
      if (multiple === 0) return 0;
      if ((number > 0 && multiple < 0) || (number < 0 && multiple > 0)) {
        throw new Error("Number and multiple must have the same sign");
      }
      return Math.round(number / multiple) * multiple;
    },
    {
      description: "Returns a number rounded to the desired multiple",
      syntax: "MROUND(number, multiple)",
      category: "Math",
      examples: ["MROUND(10, 3)", "MROUND(1.3, 0.2)"],
    }
  );

  // Sum functions
  registry.register(
    "SUMIF",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length < 2 || args.length > 3) {
        throw new Error("SUMIF requires 2-3 arguments");
      }

      const range = args[0];
      const criteria = String(args[1]);
      const sumRange = args.length > 2 ? args[2] : range;

      if (!Array.isArray(range) || !Array.isArray(sumRange)) {
        throw new Error("Range and sum range must be arrays");
      }

      let total = 0;
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

        if (meetsCriteria && i < sumRange.length) {
          const num = parseFloat(sumRange[i]);
          if (!isNaN(num)) {
            total += num;
          }
        }
      }

      return total;
    },
    {
      description: "Adds the cells specified by a given criteria",
      syntax: "SUMIF(range, criteria, [sum_range])",
      category: "Math",
      examples: ['SUMIF(A1:A10, ">5")', 'SUMIF(A1:A10, "Apple", B1:B10)'],
    }
  );

  registry.register(
    "SUMPRODUCT",
    (args) => {
      if (args.length === 0)
        throw new Error("SUMPRODUCT requires at least 1 argument");

      const arrays = args.map((arg) => (Array.isArray(arg) ? arg : [arg]));
      const length = Math.max(...arrays.map((arr) => arr.length));

      let total = 0;
      for (let i = 0; i < length; i++) {
        let product = 1;
        for (const array of arrays) {
          const value = i < array.length ? parseFloat(array[i]) : 0;
          product *= isNaN(value) ? 0 : value;
        }
        total += product;
      }

      return total;
    },
    {
      description:
        "Returns the sum of the products of corresponding array components",
      syntax: "SUMPRODUCT(array1, [array2], [array3], ...)",
      category: "Math",
      examples: ["SUMPRODUCT(A1:A3, B1:B3)", "SUMPRODUCT({1,2,3}, {4,5,6})"],
    }
  );

  registry.register(
    "SUMSQ",
    (args) => {
      const numbers = args.flat().map((arg) => {
        const num = parseFloat(arg);
        return isNaN(num) ? 0 : num;
      });
      return numbers.reduce((sum, val) => sum + val * val, 0);
    },
    {
      description: "Returns the sum of the squares of the arguments",
      syntax: "SUMSQ(number1, [number2], ...)",
      category: "Math",
      examples: ["SUMSQ(A1:A10)", "SUMSQ(3, 4, 5)"],
    }
  );

  // Greatest Common Divisor and Least Common Multiple
  registry.register(
    "GCD",
    (args) => {
      if (args.length === 0)
        throw new Error("GCD requires at least 1 argument");

      const gcd = (a: number, b: number): number =>
        b === 0 ? Math.abs(a) : gcd(b, a % b);

      const numbers = args
        .flat()
        .map((arg) => Math.abs(parseInt(arg)))
        .filter((n) => !isNaN(n) && n > 0);
      if (numbers.length === 0)
        throw new Error("GCD requires positive integers");

      return numbers.reduce(gcd);
    },
    {
      description: "Returns the greatest common divisor",
      syntax: "GCD(number1, [number2], ...)",
      category: "Math",
      examples: ["GCD(24, 36)", "GCD(12, 18, 24)"],
    }
  );

  registry.register(
    "LCM",
    (args) => {
      if (args.length === 0)
        throw new Error("LCM requires at least 1 argument");

      const gcd = (a: number, b: number): number =>
        b === 0 ? Math.abs(a) : gcd(b, a % b);
      const lcm = (a: number, b: number): number => Math.abs(a * b) / gcd(a, b);

      const numbers = args
        .flat()
        .map((arg) => Math.abs(parseInt(arg)))
        .filter((n) => !isNaN(n) && n > 0);
      if (numbers.length === 0)
        throw new Error("LCM requires positive integers");

      return numbers.reduce(lcm);
    },
    {
      description: "Returns the least common multiple",
      syntax: "LCM(number1, [number2], ...)",
      category: "Math",
      examples: ["LCM(6, 8)", "LCM(12, 18, 24)"],
    }
  );

  // Combinatorics
  registry.register(
    "COMBIN",
    (args) => {
      if (args.length !== 2)
        throw new Error("COMBIN requires exactly 2 arguments");
      const n = parseInt(args[0]);
      const k = parseInt(args[1]);

      if (n < 0 || k < 0 || k > n)
        throw new Error("Invalid arguments for COMBIN");

      let result = 1;
      for (let i = 0; i < k; i++) {
        result = (result * (n - i)) / (i + 1);
      }
      return Math.round(result);
    },
    {
      description:
        "Returns the number of combinations for a given number of objects",
      syntax: "COMBIN(number, number_chosen)",
      category: "Math",
      examples: ["COMBIN(8, 3)", "COMBIN(10, 2)"],
    }
  );
}
