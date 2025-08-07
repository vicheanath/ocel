// Database Functions
import { FunctionRegistry } from "../FunctionRegistry";

export function registerDatabaseFunctions(registry: FunctionRegistry) {
  registry.register(
    "DSUM",
    (args) => {
      if (args.length !== 3) throw new Error("DSUM requires 3 arguments");

      // Simplified implementation - assumes args are database, field, criteria
      const database = Array.isArray(args[0]) ? args[0] : [args[0]];
      const field = args[1];

      // Basic sum implementation for matching records
      return database.reduce((sum, record) => {
        if (typeof record === "object" && record[field] !== undefined) {
          const value = parseFloat(record[field]);
          return sum + (isNaN(value) ? 0 : value);
        }
        return sum;
      }, 0);
    },
    {
      description: "Returns the sum of selected database entries",
      syntax: "DSUM(database, field, criteria)",
      category: "Database",
      examples: ['DSUM(A1:E10, "Sales", G1:G2)'],
    }
  );

  registry.register(
    "DCOUNT",
    (args) => {
      if (args.length !== 3) throw new Error("DCOUNT requires 3 arguments");

      const database = Array.isArray(args[0]) ? args[0] : [args[0]];
      const field = args[1];

      return database.reduce((count, record) => {
        if (
          typeof record === "object" &&
          record[field] !== undefined &&
          record[field] !== ""
        ) {
          return count + 1;
        }
        return count;
      }, 0);
    },
    {
      description: "Counts the cells that contain numbers in a database",
      syntax: "DCOUNT(database, field, criteria)",
      category: "Database",
      examples: ['DCOUNT(A1:E10, "Age", G1:G2)'],
    }
  );

  registry.register(
    "DCOUNTA",
    (args) => {
      if (args.length !== 3) throw new Error("DCOUNTA requires 3 arguments");

      const database = Array.isArray(args[0]) ? args[0] : [args[0]];
      const field = args[1];

      return database.reduce((count, record) => {
        if (
          typeof record === "object" &&
          record[field] !== undefined &&
          record[field] !== null
        ) {
          return count + 1;
        }
        return count;
      }, 0);
    },
    {
      description: "Counts nonblank cells in a database",
      syntax: "DCOUNTA(database, field, criteria)",
      category: "Database",
      examples: ['DCOUNTA(A1:E10, "Name", G1:G2)'],
    }
  );

  registry.register(
    "DAVERAGE",
    (args) => {
      if (args.length !== 3) throw new Error("DAVERAGE requires 3 arguments");

      const database = Array.isArray(args[0]) ? args[0] : [args[0]];
      const field = args[1];

      let sum = 0;
      let count = 0;

      database.forEach((record) => {
        if (typeof record === "object" && record[field] !== undefined) {
          const value = parseFloat(record[field]);
          if (!isNaN(value)) {
            sum += value;
            count++;
          }
        }
      });

      return count > 0 ? sum / count : 0;
    },
    {
      description: "Returns the average of selected database entries",
      syntax: "DAVERAGE(database, field, criteria)",
      category: "Database",
      examples: ['DAVERAGE(A1:E10, "Score", G1:G2)'],
    }
  );

  registry.register(
    "DMAX",
    (args) => {
      if (args.length !== 3) throw new Error("DMAX requires 3 arguments");

      const database = Array.isArray(args[0]) ? args[0] : [args[0]];
      const field = args[1];

      let max = -Infinity;

      database.forEach((record) => {
        if (typeof record === "object" && record[field] !== undefined) {
          const value = parseFloat(record[field]);
          if (!isNaN(value) && value > max) {
            max = value;
          }
        }
      });

      return max === -Infinity ? 0 : max;
    },
    {
      description: "Returns the maximum value among selected database entries",
      syntax: "DMAX(database, field, criteria)",
      category: "Database",
      examples: ['DMAX(A1:E10, "Sales", G1:G2)'],
    }
  );

  registry.register(
    "DMIN",
    (args) => {
      if (args.length !== 3) throw new Error("DMIN requires 3 arguments");

      const database = Array.isArray(args[0]) ? args[0] : [args[0]];
      const field = args[1];

      let min = Infinity;

      database.forEach((record) => {
        if (typeof record === "object" && record[field] !== undefined) {
          const value = parseFloat(record[field]);
          if (!isNaN(value) && value < min) {
            min = value;
          }
        }
      });

      return min === Infinity ? 0 : min;
    },
    {
      description: "Returns the minimum value among selected database entries",
      syntax: "DMIN(database, field, criteria)",
      category: "Database",
      examples: ['DMIN(A1:E10, "Price", G1:G2)'],
    }
  );

  registry.register(
    "DPRODUCT",
    (args) => {
      if (args.length !== 3) throw new Error("DPRODUCT requires 3 arguments");

      const database = Array.isArray(args[0]) ? args[0] : [args[0]];
      const field = args[1];

      let product = 1;
      let hasValues = false;

      database.forEach((record) => {
        if (typeof record === "object" && record[field] !== undefined) {
          const value = parseFloat(record[field]);
          if (!isNaN(value)) {
            product *= value;
            hasValues = true;
          }
        }
      });

      return hasValues ? product : 0;
    },
    {
      description:
        "Multiplies the values in a particular field of records that match the criteria",
      syntax: "DPRODUCT(database, field, criteria)",
      category: "Database",
      examples: ['DPRODUCT(A1:E10, "Quantity", G1:G2)'],
    }
  );

  registry.register(
    "DSTDEV",
    (args) => {
      if (args.length !== 3) throw new Error("DSTDEV requires 3 arguments");

      const database = Array.isArray(args[0]) ? args[0] : [args[0]];
      const field = args[1];

      const values: number[] = [];

      database.forEach((record) => {
        if (typeof record === "object" && record[field] !== undefined) {
          const value = parseFloat(record[field]);
          if (!isNaN(value)) {
            values.push(value);
          }
        }
      });

      if (values.length < 2) return 0;

      const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
      const variance =
        values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
        (values.length - 1);

      return Math.sqrt(variance);
    },
    {
      description:
        "Estimates the standard deviation based on a sample of selected database entries",
      syntax: "DSTDEV(database, field, criteria)",
      category: "Database",
      examples: ['DSTDEV(A1:E10, "Score", G1:G2)'],
    }
  );

  registry.register(
    "DVAR",
    (args) => {
      if (args.length !== 3) throw new Error("DVAR requires 3 arguments");

      const database = Array.isArray(args[0]) ? args[0] : [args[0]];
      const field = args[1];

      const values: number[] = [];

      database.forEach((record) => {
        if (typeof record === "object" && record[field] !== undefined) {
          const value = parseFloat(record[field]);
          if (!isNaN(value)) {
            values.push(value);
          }
        }
      });

      if (values.length < 2) return 0;

      const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
      return (
        values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
        (values.length - 1)
      );
    },
    {
      description:
        "Estimates variance based on a sample of selected database entries",
      syntax: "DVAR(database, field, criteria)",
      category: "Database",
      examples: ['DVAR(A1:E10, "Sales", G1:G2)'],
    }
  );

  registry.register(
    "DGET",
    (args) => {
      if (args.length !== 3) throw new Error("DGET requires 3 arguments");

      const database = Array.isArray(args[0]) ? args[0] : [args[0]];
      const field = args[1];

      const matchingRecords = database.filter((record) => {
        return typeof record === "object" && record[field] !== undefined;
      });

      if (matchingRecords.length === 0) {
        throw new Error("No matching records found");
      } else if (matchingRecords.length > 1) {
        throw new Error("Multiple matching records found");
      }

      return matchingRecords[0][field];
    },
    {
      description:
        "Extracts from a database a single record that matches the specified criteria",
      syntax: "DGET(database, field, criteria)",
      category: "Database",
      examples: ['DGET(A1:E10, "Name", G1:G2)'],
    }
  );
}
