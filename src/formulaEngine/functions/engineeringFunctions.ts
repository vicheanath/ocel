// Engineering Functions
import { FunctionRegistry } from "../FunctionRegistry";

export function registerEngineeringFunctions(registry: FunctionRegistry) {
  registry.register(
    "BIN2DEC",
    (args) => {
      if (args.length !== 1) throw new Error("BIN2DEC requires 1 argument");
      const binary = args[0].toString();

      if (!/^[01]+$/.test(binary)) {
        throw new Error("Invalid binary number");
      }

      return parseInt(binary, 2);
    },
    {
      description: "Converts a binary number to decimal",
      syntax: "BIN2DEC(number)",
      category: "Engineering",
      examples: ["BIN2DEC(1010)"],
    }
  );

  registry.register(
    "DEC2BIN",
    (args) => {
      if (args.length < 1 || args.length > 2)
        throw new Error("DEC2BIN requires 1-2 arguments");
      const decimal = parseInt(args[0]);
      const places = args.length > 1 ? parseInt(args[1]) : undefined;

      if (decimal < -512 || decimal > 511) {
        throw new Error("Number must be between -512 and 511");
      }

      const binary = (decimal >>> 0).toString(2);

      if (places !== undefined) {
        return binary.padStart(places, "0");
      }

      return binary;
    },
    {
      description: "Converts a decimal number to binary",
      syntax: "DEC2BIN(number, [places])",
      category: "Engineering",
      examples: ["DEC2BIN(10)", "DEC2BIN(10, 8)"],
    }
  );

  registry.register(
    "HEX2DEC",
    (args) => {
      if (args.length !== 1) throw new Error("HEX2DEC requires 1 argument");
      const hex = args[0].toString().toUpperCase();

      if (!/^[0-9A-F]+$/.test(hex)) {
        throw new Error("Invalid hexadecimal number");
      }

      return parseInt(hex, 16);
    },
    {
      description: "Converts a hexadecimal number to decimal",
      syntax: "HEX2DEC(number)",
      category: "Engineering",
      examples: ['HEX2DEC("FF")'],
    }
  );

  registry.register(
    "DEC2HEX",
    (args) => {
      if (args.length < 1 || args.length > 2)
        throw new Error("DEC2HEX requires 1-2 arguments");
      const decimal = parseInt(args[0]);
      const places = args.length > 1 ? parseInt(args[1]) : undefined;

      const hex = decimal.toString(16).toUpperCase();

      if (places !== undefined) {
        return hex.padStart(places, "0");
      }

      return hex;
    },
    {
      description: "Converts a decimal number to hexadecimal",
      syntax: "DEC2HEX(number, [places])",
      category: "Engineering",
      examples: ["DEC2HEX(255)", "DEC2HEX(255, 4)"],
    }
  );

  registry.register(
    "OCT2DEC",
    (args) => {
      if (args.length !== 1) throw new Error("OCT2DEC requires 1 argument");
      const octal = args[0].toString();

      if (!/^[0-7]+$/.test(octal)) {
        throw new Error("Invalid octal number");
      }

      return parseInt(octal, 8);
    },
    {
      description: "Converts an octal number to decimal",
      syntax: "OCT2DEC(number)",
      category: "Engineering",
      examples: ["OCT2DEC(77)"],
    }
  );

  registry.register(
    "DEC2OCT",
    (args) => {
      if (args.length < 1 || args.length > 2)
        throw new Error("DEC2OCT requires 1-2 arguments");
      const decimal = parseInt(args[0]);
      const places = args.length > 1 ? parseInt(args[1]) : undefined;

      const octal = decimal.toString(8);

      if (places !== undefined) {
        return octal.padStart(places, "0");
      }

      return octal;
    },
    {
      description: "Converts a decimal number to octal",
      syntax: "DEC2OCT(number, [places])",
      category: "Engineering",
      examples: ["DEC2OCT(64)", "DEC2OCT(64, 3)"],
    }
  );

  registry.register(
    "BITAND",
    (args) => {
      if (args.length !== 2) throw new Error("BITAND requires 2 arguments");
      const num1 = parseInt(args[0]);
      const num2 = parseInt(args[1]);

      if (
        num1 < 0 ||
        num1 > 281474976710655 ||
        num2 < 0 ||
        num2 > 281474976710655
      ) {
        throw new Error("Numbers must be between 0 and 2^48-1");
      }

      return num1 & num2;
    },
    {
      description: "Returns a bitwise AND of two numbers",
      syntax: "BITAND(number1, number2)",
      category: "Engineering",
      examples: ["BITAND(13, 25)"],
    }
  );

  registry.register(
    "BITOR",
    (args) => {
      if (args.length !== 2) throw new Error("BITOR requires 2 arguments");
      const num1 = parseInt(args[0]);
      const num2 = parseInt(args[1]);

      if (
        num1 < 0 ||
        num1 > 281474976710655 ||
        num2 < 0 ||
        num2 > 281474976710655
      ) {
        throw new Error("Numbers must be between 0 and 2^48-1");
      }

      return num1 | num2;
    },
    {
      description: "Returns a bitwise OR of two numbers",
      syntax: "BITOR(number1, number2)",
      category: "Engineering",
      examples: ["BITOR(13, 25)"],
    }
  );

  registry.register(
    "BITXOR",
    (args) => {
      if (args.length !== 2) throw new Error("BITXOR requires 2 arguments");
      const num1 = parseInt(args[0]);
      const num2 = parseInt(args[1]);

      if (
        num1 < 0 ||
        num1 > 281474976710655 ||
        num2 < 0 ||
        num2 > 281474976710655
      ) {
        throw new Error("Numbers must be between 0 and 2^48-1");
      }

      return num1 ^ num2;
    },
    {
      description: "Returns a bitwise XOR of two numbers",
      syntax: "BITXOR(number1, number2)",
      category: "Engineering",
      examples: ["BITXOR(13, 25)"],
    }
  );

  registry.register(
    "BITLSHIFT",
    (args) => {
      if (args.length !== 2) throw new Error("BITLSHIFT requires 2 arguments");
      const number = parseInt(args[0]);
      const shiftAmount = parseInt(args[1]);

      if (number < 0 || number > 281474976710655) {
        throw new Error("Number must be between 0 and 2^48-1");
      }

      return number << shiftAmount;
    },
    {
      description: "Returns a number shifted left by specified number of bits",
      syntax: "BITLSHIFT(number, shift_amount)",
      category: "Engineering",
      examples: ["BITLSHIFT(4, 2)"],
    }
  );

  registry.register(
    "BITRSHIFT",
    (args) => {
      if (args.length !== 2) throw new Error("BITRSHIFT requires 2 arguments");
      const number = parseInt(args[0]);
      const shiftAmount = parseInt(args[1]);

      if (number < 0 || number > 281474976710655) {
        throw new Error("Number must be between 0 and 2^48-1");
      }

      return number >> shiftAmount;
    },
    {
      description: "Returns a number shifted right by specified number of bits",
      syntax: "BITRSHIFT(number, shift_amount)",
      category: "Engineering",
      examples: ["BITRSHIFT(16, 2)"],
    }
  );

  registry.register(
    "DELTA",
    (args) => {
      if (args.length < 1 || args.length > 2)
        throw new Error("DELTA requires 1-2 arguments");
      const number1 = parseFloat(args[0]);
      const number2 = args.length > 1 ? parseFloat(args[1]) : 0;

      return number1 === number2 ? 1 : 0;
    },
    {
      description:
        "Tests whether two values are equal. Returns 1 if they are equal; returns 0 otherwise",
      syntax: "DELTA(number1, [number2])",
      category: "Engineering",
      examples: ["DELTA(5, 4)", "DELTA(5, 5)"],
    }
  );

  registry.register(
    "GESTEP",
    (args) => {
      if (args.length < 1 || args.length > 2)
        throw new Error("GESTEP requires 1-2 arguments");
      const number = parseFloat(args[0]);
      const step = args.length > 1 ? parseFloat(args[1]) : 0;

      return number >= step ? 1 : 0;
    },
    {
      description: "Returns 1 if number ≥ step; returns 0 otherwise",
      syntax: "GESTEP(number, [step])",
      category: "Engineering",
      examples: ["GESTEP(5, 4)", "GESTEP(5, 5)", "GESTEP(-4, -5)"],
    }
  );

  // Additional base conversion functions
  registry.register(
    "BIN2HEX",
    (args) => {
      if (args.length < 1 || args.length > 2)
        throw new Error("BIN2HEX requires 1-2 arguments");
      const binary = args[0].toString();
      const places = args.length > 1 ? parseInt(args[1]) : undefined;

      if (!/^[01]+$/.test(binary)) {
        throw new Error("Invalid binary number");
      }

      const decimal = parseInt(binary, 2);
      const hex = decimal.toString(16).toUpperCase();

      if (places !== undefined) {
        return hex.padStart(places, "0");
      }

      return hex;
    },
    {
      description: "Converts a binary number to hexadecimal",
      syntax: "BIN2HEX(number, [places])",
      category: "Engineering",
      examples: ["BIN2HEX(11111011)", "BIN2HEX(11111011, 4)"],
    }
  );

  registry.register(
    "BIN2OCT",
    (args) => {
      if (args.length < 1 || args.length > 2)
        throw new Error("BIN2OCT requires 1-2 arguments");
      const binary = args[0].toString();
      const places = args.length > 1 ? parseInt(args[1]) : undefined;

      if (!/^[01]+$/.test(binary)) {
        throw new Error("Invalid binary number");
      }

      const decimal = parseInt(binary, 2);
      const octal = decimal.toString(8);

      if (places !== undefined) {
        return octal.padStart(places, "0");
      }

      return octal;
    },
    {
      description: "Converts a binary number to octal",
      syntax: "BIN2OCT(number, [places])",
      category: "Engineering",
      examples: ["BIN2OCT(1001)", "BIN2OCT(1001, 3)"],
    }
  );

  registry.register(
    "HEX2BIN",
    (args) => {
      if (args.length < 1 || args.length > 2)
        throw new Error("HEX2BIN requires 1-2 arguments");
      const hex = args[0].toString().toUpperCase();
      const places = args.length > 1 ? parseInt(args[1]) : undefined;

      if (!/^[0-9A-F]+$/.test(hex)) {
        throw new Error("Invalid hexadecimal number");
      }

      const decimal = parseInt(hex, 16);
      const binary = decimal.toString(2);

      if (places !== undefined) {
        return binary.padStart(places, "0");
      }

      return binary;
    },
    {
      description: "Converts a hexadecimal number to binary",
      syntax: "HEX2BIN(number, [places])",
      category: "Engineering",
      examples: ['HEX2BIN("F")', 'HEX2BIN("F", 8)'],
    }
  );

  registry.register(
    "HEX2OCT",
    (args) => {
      if (args.length < 1 || args.length > 2)
        throw new Error("HEX2OCT requires 1-2 arguments");
      const hex = args[0].toString().toUpperCase();
      const places = args.length > 1 ? parseInt(args[1]) : undefined;

      if (!/^[0-9A-F]+$/.test(hex)) {
        throw new Error("Invalid hexadecimal number");
      }

      const decimal = parseInt(hex, 16);
      const octal = decimal.toString(8);

      if (places !== undefined) {
        return octal.padStart(places, "0");
      }

      return octal;
    },
    {
      description: "Converts a hexadecimal number to octal",
      syntax: "HEX2OCT(number, [places])",
      category: "Engineering",
      examples: ['HEX2OCT("F")', 'HEX2OCT("F", 3)'],
    }
  );

  registry.register(
    "OCT2BIN",
    (args) => {
      if (args.length < 1 || args.length > 2)
        throw new Error("OCT2BIN requires 1-2 arguments");
      const octal = args[0].toString();
      const places = args.length > 1 ? parseInt(args[1]) : undefined;

      if (!/^[0-7]+$/.test(octal)) {
        throw new Error("Invalid octal number");
      }

      const decimal = parseInt(octal, 8);
      const binary = decimal.toString(2);

      if (places !== undefined) {
        return binary.padStart(places, "0");
      }

      return binary;
    },
    {
      description: "Converts an octal number to binary",
      syntax: "OCT2BIN(number, [places])",
      category: "Engineering",
      examples: ["OCT2BIN(7)", "OCT2BIN(7, 3)"],
    }
  );

  registry.register(
    "OCT2HEX",
    (args) => {
      if (args.length < 1 || args.length > 2)
        throw new Error("OCT2HEX requires 1-2 arguments");
      const octal = args[0].toString();
      const places = args.length > 1 ? parseInt(args[1]) : undefined;

      if (!/^[0-7]+$/.test(octal)) {
        throw new Error("Invalid octal number");
      }

      const decimal = parseInt(octal, 8);
      const hex = decimal.toString(16).toUpperCase();

      if (places !== undefined) {
        return hex.padStart(places, "0");
      }

      return hex;
    },
    {
      description: "Converts an octal number to hexadecimal",
      syntax: "OCT2HEX(number, [places])",
      category: "Engineering",
      examples: ["OCT2HEX(100)", "OCT2HEX(100, 4)"],
    }
  );

  // Complex number functions
  registry.register(
    "COMPLEX",
    (args) => {
      if (args.length < 2 || args.length > 3)
        throw new Error("COMPLEX requires 2-3 arguments");
      const real = parseFloat(args[0]);
      const imaginary = parseFloat(args[1]);
      const suffix = args.length > 2 ? args[2].toString() : "i";

      if (suffix !== "i" && suffix !== "j") {
        throw new Error("Suffix must be 'i' or 'j'");
      }

      if (real === 0 && imaginary === 0) return "0";
      if (real === 0)
        return imaginary === 1
          ? suffix
          : imaginary === -1
          ? "-" + suffix
          : imaginary + suffix;
      if (imaginary === 0) return real.toString();
      if (imaginary === 1) return real + "+" + suffix;
      if (imaginary === -1) return real + "-" + suffix;
      if (imaginary > 0) return real + "+" + imaginary + suffix;
      return real + "" + imaginary + suffix;
    },
    {
      description:
        "Converts real and imaginary coefficients into a complex number",
      syntax: "COMPLEX(real_num, i_num, [suffix])",
      category: "Engineering",
      examples: ["COMPLEX(3, 4)", 'COMPLEX(3, 4, "j")'],
    }
  );

  registry.register(
    "IMREAL",
    (args) => {
      if (args.length !== 1) throw new Error("IMREAL requires 1 argument");
      const complex = args[0].toString();

      // Parse complex number - simplified implementation
      if (complex === "0") return 0;

      const match = complex.match(/^([+-]?[\d.]+)([+-][\d.]*[ij])?$/);
      if (match) {
        return parseFloat(match[1]);
      }

      // If it's just imaginary part
      if (complex.match(/^[+-]?[\d.]*[ij]$/)) return 0;

      throw new Error("Invalid complex number format");
    },
    {
      description: "Returns the real coefficient of a complex number",
      syntax: "IMREAL(inumber)",
      category: "Engineering",
      examples: ['IMREAL("6+9i")', 'IMREAL("2-i")'],
    }
  );

  registry.register(
    "IMAGINARY",
    (args) => {
      if (args.length !== 1) throw new Error("IMAGINARY requires 1 argument");
      const complex = args[0].toString();

      if (complex === "0") return 0;

      // Parse complex number - simplified implementation
      const match = complex.match(/^([+-]?[\d.]+)?([+-]?[\d.]*)[ij]$/);
      if (match) {
        const imagPart = match[2];
        if (imagPart === "" || imagPart === "+") return 1;
        if (imagPart === "-") return -1;
        return parseFloat(imagPart);
      }

      // If it's just real part
      if (!complex.includes("i") && !complex.includes("j")) return 0;

      throw new Error("Invalid complex number format");
    },
    {
      description: "Returns the imaginary coefficient of a complex number",
      syntax: "IMAGINARY(inumber)",
      category: "Engineering",
      examples: ['IMAGINARY("6+9i")', 'IMAGINARY("2-i")'],
    }
  );

  registry.register(
    "IMABS",
    (args) => {
      if (args.length !== 1) throw new Error("IMABS requires 1 argument");
      const complex = args[0].toString();

      // Helper function to parse complex number
      const parseComplex = (num: string) => {
        if (num === "0") return { real: 0, imag: 0 };

        const match = num.match(/^([+-]?[\d.]+)?([+-]?[\d.]*)[ij]?$/);
        if (!match) throw new Error("Invalid complex number format");

        let real = 0,
          imag = 0;

        if (num.includes("i") || num.includes("j")) {
          const parts = num.replace(/[ij]/, "").split(/([+-])/);
          real = parts[0] ? parseFloat(parts[0]) : 0;
          if (parts.length > 1) {
            const imagStr = parts.slice(1).join("");
            if (imagStr === "+" || imagStr === "") imag = 1;
            else if (imagStr === "-") imag = -1;
            else imag = parseFloat(imagStr);
          }
        } else {
          real = parseFloat(num);
        }

        return { real, imag };
      };

      const { real, imag } = parseComplex(complex);
      return Math.sqrt(real * real + imag * imag);
    },
    {
      description: "Returns the absolute value (modulus) of a complex number",
      syntax: "IMABS(inumber)",
      category: "Engineering",
      examples: ['IMABS("5+12i")', 'IMABS("3-4i")'],
    }
  );

  // Error functions
  registry.register(
    "ERF",
    (args) => {
      if (args.length < 1 || args.length > 2)
        throw new Error("ERF requires 1-2 arguments");
      const x = parseFloat(args[0]);
      const upperLimit = args.length > 1 ? parseFloat(args[1]) : undefined;

      // Simplified implementation using approximation
      const erfApprox = (t: number) => {
        const a1 = 0.254829592;
        const a2 = -0.284496736;
        const a3 = 1.421413741;
        const a4 = -1.453152027;
        const a5 = 1.061405429;
        const p = 0.3275911;

        const sign = t < 0 ? -1 : 1;
        const absT = Math.abs(t);

        const u = 1.0 / (1.0 + p * absT);
        const y =
          1.0 -
          ((((a5 * u + a4) * u + a3) * u + a2) * u + a1) *
            u *
            Math.exp(-absT * absT);

        return sign * y;
      };

      if (upperLimit !== undefined) {
        return erfApprox(upperLimit) - erfApprox(x);
      }

      return erfApprox(x);
    },
    {
      description: "Returns the error function",
      syntax: "ERF(lower_limit, [upper_limit])",
      category: "Engineering",
      examples: ["ERF(1)", "ERF(0, 1)"],
    }
  );

  registry.register(
    "ERFC",
    (args) => {
      if (args.length !== 1) throw new Error("ERFC requires 1 argument");
      const x = parseFloat(args[0]);

      // ERFC(x) = 1 - ERF(x)
      const erfApprox = (t: number) => {
        const a1 = 0.254829592;
        const a2 = -0.284496736;
        const a3 = 1.421413741;
        const a4 = -1.453152027;
        const a5 = 1.061405429;
        const p = 0.3275911;

        const sign = t < 0 ? -1 : 1;
        const absT = Math.abs(t);

        const u = 1.0 / (1.0 + p * absT);
        const y =
          1.0 -
          ((((a5 * u + a4) * u + a3) * u + a2) * u + a1) *
            u *
            Math.exp(-absT * absT);

        return sign * y;
      };

      return 1 - erfApprox(x);
    },
    {
      description: "Returns the complementary error function",
      syntax: "ERFC(x)",
      category: "Engineering",
      examples: ["ERFC(1)", "ERFC(0.5)"],
    }
  );

  // Unit conversion function (simplified implementation)
  registry.register(
    "CONVERT",
    (args) => {
      if (args.length !== 3) throw new Error("CONVERT requires 3 arguments");
      const number = parseFloat(args[0]);
      const fromUnit = args[1].toString().toLowerCase();
      const toUnit = args[2].toString().toLowerCase();

      // Helper function for temperature conversions
      const convertTemperature = (
        value: number,
        from: string,
        to: string
      ): number => {
        if (from === to) return value;

        // Convert to Celsius first
        let celsius: number;
        switch (from) {
          case "c":
            celsius = value;
            break;
          case "f":
            celsius = ((value - 32) * 5) / 9;
            break;
          case "k":
            celsius = value - 273.15;
            break;
          default:
            throw new Error(`Unknown temperature unit: ${from}`);
        }

        // Convert from Celsius to target
        switch (to) {
          case "c":
            return celsius;
          case "f":
            return (celsius * 9) / 5 + 32;
          case "k":
            return celsius + 273.15;
          default:
            throw new Error(`Unknown temperature unit: ${to}`);
        }
      };

      // Temperature conversions (special handling)
      if (
        (fromUnit === "c" || fromUnit === "f" || fromUnit === "k") &&
        (toUnit === "c" || toUnit === "f" || toUnit === "k")
      ) {
        return convertTemperature(number, fromUnit, toUnit);
      }

      // Regular conversions (multiplication factors)
      const conversions: { [key: string]: { [key: string]: number } } = {
        // Length conversions (base: meter)
        m: { m: 1, cm: 100, mm: 1000, in: 39.3701, ft: 3.28084, yd: 1.09361 },
        cm: {
          m: 0.01,
          cm: 1,
          mm: 10,
          in: 0.393701,
          ft: 0.0328084,
          yd: 0.0109361,
        },
        mm: {
          m: 0.001,
          cm: 0.1,
          mm: 1,
          in: 0.0393701,
          ft: 0.00328084,
          yd: 0.00109361,
        },
        in: {
          m: 0.0254,
          cm: 2.54,
          mm: 25.4,
          in: 1,
          ft: 0.0833333,
          yd: 0.0277778,
        },
        ft: { m: 0.3048, cm: 30.48, mm: 304.8, in: 12, ft: 1, yd: 0.333333 },
        yd: { m: 0.9144, cm: 91.44, mm: 914.4, in: 36, ft: 3, yd: 1 },

        // Weight conversions (base: gram)
        g: { g: 1, kg: 0.001, oz: 0.035274, lb: 0.00220462 },
        kg: { g: 1000, kg: 1, oz: 35.274, lb: 2.20462 },
        oz: { g: 28.3495, kg: 0.0283495, oz: 1, lb: 0.0625 },
        lb: { g: 453.592, kg: 0.453592, oz: 16, lb: 1 },
      };

      if (!conversions[fromUnit]) {
        throw new Error(`Unknown source unit: ${fromUnit}`);
      }

      if (!conversions[fromUnit][toUnit]) {
        throw new Error(`Cannot convert from ${fromUnit} to ${toUnit}`);
      }

      const conversionFactor = conversions[fromUnit][toUnit];
      return number * conversionFactor;
    },
    {
      description: "Converts a number from one measurement system to another",
      syntax: "CONVERT(number, from_unit, to_unit)",
      category: "Engineering",
      examples: ['CONVERT(1, "m", "ft")', 'CONVERT(32, "F", "C")'],
    }
  );
}
