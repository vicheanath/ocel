// Legacy Excel Functions for backward compatibility
import { FunctionRegistry } from "../FunctionRegistry";

export function registerLegacyFunctions(registry: FunctionRegistry) {
  // Distribution Functions

  registry.register(
    "BETADIST",
    (args) => {
      if (args.length < 3 || args.length > 6) {
        throw new Error("BETADIST requires 3-6 arguments");
      }

      const x = parseFloat(args[0]);
      const alpha = parseFloat(args[1]);
      const beta = parseFloat(args[2]);
      const A = args.length > 3 ? parseFloat(args[3]) : 0;
      const B = args.length > 4 ? parseFloat(args[4]) : 1;

      if (x < A || x > B || alpha <= 0 || beta <= 0) return "#NUM!";

      // Simplified beta distribution calculation
      // Note: This is a basic approximation - full implementation would require special functions
      const normalizedX = (x - A) / (B - A);
      return (
        Math.pow(normalizedX, alpha - 1) * Math.pow(1 - normalizedX, beta - 1)
      );
    },
    {
      description: "[Legacy] Returns the beta cumulative distribution function",
      syntax: "BETADIST(x, alpha, beta, [A], [B])",
      category: "Statistical",
      examples: ["BETADIST(2, 8, 10, 1, 3)"],
    }
  );

  registry.register(
    "BINOMDIST",
    (args) => {
      if (args.length !== 4) {
        throw new Error("BINOMDIST requires exactly 4 arguments");
      }

      const numberS = parseInt(args[0]);
      const trials = parseInt(args[1]);
      const probabilityS = parseFloat(args[2]);
      const cumulative = Boolean(args[3]);

      if (numberS < 0 || trials < 0 || numberS > trials) return "#NUM!";
      if (probabilityS < 0 || probabilityS > 1) return "#NUM!";

      // Binomial coefficient
      const binomCoeff = (n: number, k: number): number => {
        if (k > n || k < 0) return 0;
        if (k === 0 || k === n) return 1;

        let result = 1;
        for (let i = 1; i <= k; i++) {
          result = (result * (n - i + 1)) / i;
        }
        return result;
      };

      if (!cumulative) {
        // Probability mass function
        return (
          binomCoeff(trials, numberS) *
          Math.pow(probabilityS, numberS) *
          Math.pow(1 - probabilityS, trials - numberS)
        );
      } else {
        // Cumulative distribution function
        let sum = 0;
        for (let k = 0; k <= numberS; k++) {
          sum +=
            binomCoeff(trials, k) *
            Math.pow(probabilityS, k) *
            Math.pow(1 - probabilityS, trials - k);
        }
        return sum;
      }
    },
    {
      description:
        "[Legacy] Returns the individual term binomial distribution probability",
      syntax: "BINOMDIST(number_s, trials, probability_s, cumulative)",
      category: "Statistical",
      examples: ["BINOMDIST(6, 10, 0.5, FALSE)"],
    }
  );

  registry.register(
    "EXPONDIST",
    (args) => {
      if (args.length !== 3) {
        throw new Error("EXPONDIST requires exactly 3 arguments");
      }

      const x = parseFloat(args[0]);
      const lambda = parseFloat(args[1]);
      const cumulative = Boolean(args[2]);

      if (x < 0 || lambda <= 0) return "#NUM!";

      if (!cumulative) {
        // Probability density function
        return lambda * Math.exp(-lambda * x);
      } else {
        // Cumulative distribution function
        return 1 - Math.exp(-lambda * x);
      }
    },
    {
      description: "[Legacy] Returns the exponential distribution",
      syntax: "EXPONDIST(x, lambda, cumulative)",
      category: "Statistical",
      examples: ["EXPONDIST(0.2, 10, TRUE)"],
    }
  );

  registry.register(
    "NORMDIST",
    (args) => {
      if (args.length !== 4) {
        throw new Error("NORMDIST requires exactly 4 arguments");
      }

      const x = parseFloat(args[0]);
      const mean = parseFloat(args[1]);
      const standardDev = parseFloat(args[2]);
      const cumulative = Boolean(args[3]);

      if (standardDev <= 0) return "#NUM!";

      const z = (x - mean) / standardDev;

      if (!cumulative) {
        // Probability density function
        return (
          (1 / (standardDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z)
        );
      } else {
        // Cumulative distribution function (approximation)
        return 0.5 * (1 + erf(z / Math.sqrt(2)));
      }
    },
    {
      description: "[Legacy] Returns the normal cumulative distribution",
      syntax: "NORMDIST(x, mean, standard_dev, cumulative)",
      category: "Statistical",
      examples: ["NORMDIST(42, 40, 1.5, TRUE)"],
    }
  );

  registry.register(
    "NORMSDIST",
    (args) => {
      if (args.length !== 1) {
        throw new Error("NORMSDIST requires exactly 1 argument");
      }

      const z = parseFloat(args[0]);

      // Standard normal cumulative distribution function (approximation)
      return 0.5 * (1 + erf(z / Math.sqrt(2)));
    },
    {
      description:
        "[Legacy] Returns the standard normal cumulative distribution",
      syntax: "NORMSDIST(z)",
      category: "Statistical",
      examples: ["NORMSDIST(1.333333)"],
    }
  );

  registry.register(
    "POISSON",
    (args) => {
      if (args.length !== 3) {
        throw new Error("POISSON requires exactly 3 arguments");
      }

      const x = parseInt(args[0]);
      const mean = parseFloat(args[1]);
      const cumulative = Boolean(args[2]);

      if (x < 0 || mean <= 0) return "#NUM!";

      const factorial = (n: number): number => {
        if (n <= 1) return 1;
        return n * factorial(n - 1);
      };

      if (!cumulative) {
        // Probability mass function
        return (Math.pow(mean, x) * Math.exp(-mean)) / factorial(x);
      } else {
        // Cumulative distribution function
        let sum = 0;
        for (let k = 0; k <= x; k++) {
          sum += (Math.pow(mean, k) * Math.exp(-mean)) / factorial(k);
        }
        return sum;
      }
    },
    {
      description: "[Legacy] Returns the Poisson distribution",
      syntax: "POISSON(x, mean, cumulative)",
      category: "Statistical",
      examples: ["POISSON(2, 5, TRUE)"],
    }
  );

  registry.register(
    "WEIBULL",
    (args) => {
      if (args.length !== 4) {
        throw new Error("WEIBULL requires exactly 4 arguments");
      }

      const x = parseFloat(args[0]);
      const alpha = parseFloat(args[1]); // shape parameter
      const beta = parseFloat(args[2]); // scale parameter
      const cumulative = Boolean(args[3]);

      if (x < 0 || alpha <= 0 || beta <= 0) return "#NUM!";

      if (!cumulative) {
        // Probability density function
        return (
          (alpha / beta) *
          Math.pow(x / beta, alpha - 1) *
          Math.exp(-Math.pow(x / beta, alpha))
        );
      } else {
        // Cumulative distribution function
        return 1 - Math.exp(-Math.pow(x / beta, alpha));
      }
    },
    {
      description: "[Legacy] Returns the Weibull distribution",
      syntax: "WEIBULL(x, alpha, beta, cumulative)",
      category: "Statistical",
      examples: ["WEIBULL(105, 20, 100, TRUE)"],
    }
  );

  // Test Functions

  registry.register(
    "TTEST",
    (args) => {
      if (args.length !== 4) {
        throw new Error("TTEST requires exactly 4 arguments");
      }

      const array1 = Array.isArray(args[0]) ? args[0].flat() : [args[0]];
      const array2 = Array.isArray(args[1]) ? args[1].flat() : [args[1]];
      const tails = parseInt(args[2]);
      const type = parseInt(args[3]);

      if (tails !== 1 && tails !== 2) return "#NUM!";
      if (type < 1 || type > 3) return "#NUM!";

      const nums1 = array1.map((x) => parseFloat(x)).filter((n) => !isNaN(n));
      const nums2 = array2.map((x) => parseFloat(x)).filter((n) => !isNaN(n));

      if (nums1.length < 2 || nums2.length < 2) return "#DIV/0!";

      const mean1 = nums1.reduce((sum, val) => sum + val, 0) / nums1.length;
      const mean2 = nums2.reduce((sum, val) => sum + val, 0) / nums2.length;

      const var1 =
        nums1.reduce((sum, val) => sum + Math.pow(val - mean1, 2), 0) /
        (nums1.length - 1);
      const var2 =
        nums2.reduce((sum, val) => sum + Math.pow(val - mean2, 2), 0) /
        (nums2.length - 1);

      let tStat: number;
      let df: number;

      switch (type) {
        case 1: {
          // Paired
          if (nums1.length !== nums2.length) return "#N/A";
          const diffs = nums1.map((val, i) => val - nums2[i]);
          const meanDiff =
            diffs.reduce((sum, val) => sum + val, 0) / diffs.length;
          const varDiff =
            diffs.reduce((sum, val) => sum + Math.pow(val - meanDiff, 2), 0) /
            (diffs.length - 1);
          tStat = meanDiff / Math.sqrt(varDiff / diffs.length);
          df = diffs.length - 1;
          break;
        }
        case 2: {
          // Two-sample equal variance
          const pooledVar =
            ((nums1.length - 1) * var1 + (nums2.length - 1) * var2) /
            (nums1.length + nums2.length - 2);
          tStat =
            (mean1 - mean2) /
            Math.sqrt(pooledVar * (1 / nums1.length + 1 / nums2.length));
          df = nums1.length + nums2.length - 2;
          break;
        }
        case 3: {
          // Two-sample unequal variance
          const se = Math.sqrt(var1 / nums1.length + var2 / nums2.length);
          tStat = (mean1 - mean2) / se;
          df =
            Math.pow(var1 / nums1.length + var2 / nums2.length, 2) /
            (Math.pow(var1 / nums1.length, 2) / (nums1.length - 1) +
              Math.pow(var2 / nums2.length, 2) / (nums2.length - 1));
          break;
        }
        default:
          return "#NUM!";
      }

      // Simplified p-value calculation (approximation)
      const p = 2 * (1 - Math.abs(tStat) / (Math.abs(tStat) + Math.sqrt(df)));
      return tails === 1 ? p / 2 : p;
    },
    {
      description:
        "[Legacy] Returns the probability associated with a Student's t-test",
      syntax: "TTEST(array1, array2, tails, type)",
      category: "Statistical",
      examples: ["TTEST(A1:A10, B1:B10, 2, 1)"],
    }
  );

  registry.register(
    "ZTEST",
    (args) => {
      if (args.length < 2 || args.length > 3) {
        throw new Error("ZTEST requires 2-3 arguments");
      }

      const array = Array.isArray(args[0]) ? args[0].flat() : [args[0]];
      const x = parseFloat(args[1]);
      const sigma = args.length > 2 ? parseFloat(args[2]) : null;

      const numbers = array
        .map((val) => parseFloat(val))
        .filter((n) => !isNaN(n));
      if (numbers.length === 0) return "#DIV/0!";

      const sampleMean =
        numbers.reduce((sum, val) => sum + val, 0) / numbers.length;

      let standardError: number;
      if (sigma !== null) {
        standardError = sigma / Math.sqrt(numbers.length);
      } else {
        const sampleStd = Math.sqrt(
          numbers.reduce((sum, val) => sum + Math.pow(val - sampleMean, 2), 0) /
            (numbers.length - 1)
        );
        standardError = sampleStd / Math.sqrt(numbers.length);
      }

      const z = (sampleMean - x) / standardError;

      // Two-tailed p-value
      return 2 * (1 - Math.abs(z) / (Math.abs(z) + 2.7)); // Simplified approximation
    },
    {
      description:
        "[Legacy] Returns the one-tailed probability-value of a z-test",
      syntax: "ZTEST(array, x, [sigma])",
      category: "Statistical",
      examples: ["ZTEST(A1:A10, 4)", "ZTEST(A1:A10, 4, 1)"],
    }
  );

  // Inverse Functions

  registry.register(
    "NORMINV",
    (args) => {
      if (args.length !== 3) {
        throw new Error("NORMINV requires exactly 3 arguments");
      }

      const probability = parseFloat(args[0]);
      const mean = parseFloat(args[1]);
      const standardDev = parseFloat(args[2]);

      if (probability <= 0 || probability >= 1) return "#NUM!";
      if (standardDev <= 0) return "#NUM!";

      // Approximation of inverse normal distribution
      const z = Math.sqrt(
        -2 * Math.log(probability < 0.5 ? probability : 1 - probability)
      );
      const sign = probability < 0.5 ? -1 : 1;

      return mean + sign * standardDev * z;
    },
    {
      description:
        "[Legacy] Returns the inverse of the normal cumulative distribution",
      syntax: "NORMINV(probability, mean, standard_dev)",
      category: "Statistical",
      examples: ["NORMINV(0.908789, 40, 1.5)"],
    }
  );

  registry.register(
    "NORMSINV",
    (args) => {
      if (args.length !== 1) {
        throw new Error("NORMSINV requires exactly 1 argument");
      }

      const probability = parseFloat(args[0]);

      if (probability <= 0 || probability >= 1) return "#NUM!";

      // Approximation of inverse standard normal distribution
      const z = Math.sqrt(
        -2 * Math.log(probability < 0.5 ? probability : 1 - probability)
      );
      return probability < 0.5 ? -z : z;
    },
    {
      description:
        "[Legacy] Returns the inverse of the standard normal cumulative distribution",
      syntax: "NORMSINV(probability)",
      category: "Statistical",
      examples: ["NORMSINV(0.908789)"],
    }
  );

  // Chi-square Functions

  registry.register(
    "CHIDIST",
    (args) => {
      if (args.length !== 2) {
        throw new Error("CHIDIST requires exactly 2 arguments");
      }

      const x = parseFloat(args[0]);
      const degreesOfFreedom = parseInt(args[1]);

      if (x < 0 || degreesOfFreedom < 1) return "#NUM!";

      // Simplified chi-square distribution calculation
      // This is a basic approximation
      return Math.exp(-x / 2) * Math.pow(x, degreesOfFreedom / 2 - 1);
    },
    {
      description:
        "[Legacy] Returns the one-tailed probability of the chi-squared distribution",
      syntax: "CHIDIST(x, degrees_freedom)",
      category: "Statistical",
      examples: ["CHIDIST(18.307, 10)"],
    }
  );

  registry.register(
    "CRITBINOM",
    (args) => {
      if (args.length !== 3) {
        throw new Error("CRITBINOM requires exactly 3 arguments");
      }

      const trials = parseInt(args[0]);
      const probabilityS = parseFloat(args[1]);
      const alpha = parseFloat(args[2]);

      if (
        trials < 0 ||
        probabilityS < 0 ||
        probabilityS > 1 ||
        alpha < 0 ||
        alpha > 1
      ) {
        return "#NUM!";
      }

      // Find smallest value for which cumulative binomial distribution >= (1-alpha)
      const binomCoeff = (n: number, k: number): number => {
        if (k > n || k < 0) return 0;
        if (k === 0 || k === n) return 1;

        let result = 1;
        for (let i = 1; i <= k; i++) {
          result = (result * (n - i + 1)) / i;
        }
        return result;
      };

      let cumulative = 0;
      for (let k = 0; k <= trials; k++) {
        cumulative +=
          binomCoeff(trials, k) *
          Math.pow(probabilityS, k) *
          Math.pow(1 - probabilityS, trials - k);

        if (cumulative >= 1 - alpha) {
          return k;
        }
      }

      return trials;
    },
    {
      description:
        "[Legacy] Returns the smallest value for which the cumulative binomial distribution is less than or equal to a criterion value",
      syntax: "CRITBINOM(trials, probability_s, alpha)",
      category: "Statistical",
      examples: ["CRITBINOM(6, 0.5, 0.75)"],
    }
  );
}

// Helper function for error function approximation
function erf(x: number): number {
  // Abramowitz and Stegun approximation
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);

  const t = 1.0 / (1.0 + p * x);
  const y =
    1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return sign * y;
}
