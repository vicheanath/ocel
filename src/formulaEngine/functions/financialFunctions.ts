// Financial Functions
import { FunctionRegistry } from "../FunctionRegistry";

export function registerFinancialFunctions(registry: FunctionRegistry) {
  registry.register(
    "PV",
    (args) => {
      if (args.length < 3 || args.length > 5)
        throw new Error("PV requires 3-5 arguments");

      const rate = parseFloat(args[0]);
      const nper = parseInt(args[1]);
      const pmt = parseFloat(args[2]);
      const fv = args.length > 3 ? parseFloat(args[3]) : 0;
      const type = args.length > 4 ? parseInt(args[4]) : 0;

      if (rate === 0) {
        return -(pmt * nper + fv);
      }

      const pvAnnuity =
        pmt * ((1 - Math.pow(1 + rate, -nper)) / rate) * (1 + rate * type);
      const pvLumpSum = fv / Math.pow(1 + rate, nper);

      return -(pvAnnuity + pvLumpSum);
    },
    {
      description: "Returns the present value of an investment",
      syntax: "PV(rate, nper, pmt, [fv], [type])",
      category: "Financial",
      examples: ["PV(0.08/12, 10*12, -100, 0, 0)"],
    }
  );

  registry.register(
    "FV",
    (args) => {
      if (args.length < 3 || args.length > 5)
        throw new Error("FV requires 3-5 arguments");

      const rate = parseFloat(args[0]);
      const nper = parseInt(args[1]);
      const pmt = parseFloat(args[2]);
      const pv = args.length > 3 ? parseFloat(args[3]) : 0;
      const type = args.length > 4 ? parseInt(args[4]) : 0;

      if (rate === 0) {
        return -(pv + pmt * nper);
      }

      const fvAnnuity =
        pmt * (((Math.pow(1 + rate, nper) - 1) / rate) * (1 + rate * type));
      const fvLumpSum = pv * Math.pow(1 + rate, nper);

      return -(fvAnnuity + fvLumpSum);
    },
    {
      description: "Returns the future value of an investment",
      syntax: "FV(rate, nper, pmt, [pv], [type])",
      category: "Financial",
      examples: ["FV(0.06/12, 10*12, -200, -500, 1)"],
    }
  );

  registry.register(
    "PMT",
    (args) => {
      if (args.length < 3 || args.length > 5)
        throw new Error("PMT requires 3-5 arguments");

      const rate = parseFloat(args[0]);
      const nper = parseInt(args[1]);
      const pv = parseFloat(args[2]);
      const fv = args.length > 3 ? parseFloat(args[3]) : 0;
      const type = args.length > 4 ? parseInt(args[4]) : 0;

      if (rate === 0) {
        return -(pv + fv) / nper;
      }

      const pvFactor = (1 - Math.pow(1 + rate, -nper)) / rate;
      const fvFactor = fv / Math.pow(1 + rate, nper);

      return -(pv + fvFactor) / (pvFactor * (1 + rate * type));
    },
    {
      description: "Returns the periodic payment for an annuity",
      syntax: "PMT(rate, nper, pv, [fv], [type])",
      category: "Financial",
      examples: ["PMT(0.08/12, 10*12, 10000)"],
    }
  );

  registry.register(
    "RATE",
    (args) => {
      if (args.length < 3 || args.length > 6)
        throw new Error("RATE requires 3-6 arguments");

      const nper = parseInt(args[0]);
      const pmt = parseFloat(args[1]);
      const pv = parseFloat(args[2]);
      const fv = args.length > 3 ? parseFloat(args[3]) : 0;
      const type = args.length > 4 ? parseInt(args[4]) : 0;
      const guess = args.length > 5 ? parseFloat(args[5]) : 0.1;

      // Newton-Raphson iteration for rate calculation (simplified)
      let rate = guess;
      for (let i = 0; i < 20; i++) {
        const f =
          pv +
          fv / Math.pow(1 + rate, nper) +
          pmt * (1 + rate * type) * ((1 - Math.pow(1 + rate, -nper)) / rate);
        const df =
          (-nper * fv) / Math.pow(1 + rate, nper + 1) +
          pmt *
            (1 + rate * type) *
            ((nper * Math.pow(1 + rate, -nper - 1)) / rate -
              (1 - Math.pow(1 + rate, -nper)) / (rate * rate)) +
          pmt * type * ((1 - Math.pow(1 + rate, -nper)) / rate);

        const newRate = rate - f / df;
        if (Math.abs(newRate - rate) < 1e-6) {
          return newRate;
        }
        rate = newRate;
      }

      return rate;
    },
    {
      description: "Returns the interest rate per period of an annuity",
      syntax: "RATE(nper, pmt, pv, [fv], [type], [guess])",
      category: "Financial",
      examples: ["RATE(4*12, -200, 8000)"],
    }
  );

  registry.register(
    "NPV",
    (args) => {
      if (args.length < 2) throw new Error("NPV requires at least 2 arguments");

      const rate = parseFloat(args[0]);
      const values = args
        .slice(1)
        .flat()
        .map((v) => parseFloat(v));

      return values.reduce((npv, value, index) => {
        return npv + value / Math.pow(1 + rate, index + 1);
      }, 0);
    },
    {
      description: "Returns the net present value of an investment",
      syntax: "NPV(rate, value1, [value2], ...)",
      category: "Financial",
      examples: ["NPV(0.1, -10000, 3000, 4200, 6800)"],
    }
  );

  registry.register(
    "IRR",
    (args) => {
      if (args.length < 1 || args.length > 2)
        throw new Error("IRR requires 1-2 arguments");

      const values = Array.isArray(args[0])
        ? args[0].map((v) => parseFloat(v))
        : [parseFloat(args[0])];
      const guess = args.length > 1 ? parseFloat(args[1]) : 0.1;

      // Newton-Raphson iteration for IRR calculation
      let rate = guess;
      for (let i = 0; i < 20; i++) {
        let npv = 0;
        let dnpv = 0;

        for (let j = 0; j < values.length; j++) {
          const power = Math.pow(1 + rate, j);
          npv += values[j] / power;
          dnpv -= (j * values[j]) / (power * (1 + rate));
        }

        const newRate = rate - npv / dnpv;
        if (Math.abs(newRate - rate) < 1e-6) {
          return newRate;
        }
        rate = newRate;
      }

      return rate;
    },
    {
      description:
        "Returns the internal rate of return for a series of cash flows",
      syntax: "IRR(values, [guess])",
      category: "Financial",
      examples: ["IRR(A1:A5)", "IRR({-10000,2000,4000,8000})"],
    }
  );

  registry.register(
    "NPER",
    (args) => {
      if (args.length < 3 || args.length > 5)
        throw new Error("NPER requires 3-5 arguments");

      const rate = parseFloat(args[0]);
      const pmt = parseFloat(args[1]);
      const pv = parseFloat(args[2]);
      const fv = args.length > 3 ? parseFloat(args[3]) : 0;
      const type = args.length > 4 ? parseInt(args[4]) : 0;

      if (rate === 0) {
        return -(pv + fv) / pmt;
      }

      const term1 = pmt * (1 + rate * type) - fv * rate;
      const term2 = pv * rate + pmt * (1 + rate * type);

      if (term1 === 0) {
        throw new Error("Cannot calculate NPER - invalid parameters");
      }

      return Math.log(term1 / term2) / Math.log(1 + rate);
    },
    {
      description: "Returns the number of periods for an investment",
      syntax: "NPER(rate, pmt, pv, [fv], [type])",
      category: "Financial",
      examples: ["NPER(0.12/12, -100, -1000, 10000, 1)"],
    }
  );

  registry.register(
    "IPMT",
    (args) => {
      if (args.length < 4 || args.length > 6)
        throw new Error("IPMT requires 4-6 arguments");

      const rate = parseFloat(args[0]);
      const per = parseInt(args[1]);
      const nper = parseInt(args[2]);
      const pv = parseFloat(args[3]);
      const fv = args.length > 4 ? parseFloat(args[4]) : 0;
      const type = args.length > 5 ? parseInt(args[5]) : 0;

      if (per < 1 || per > nper) {
        throw new Error("Period must be between 1 and nper");
      }

      // Calculate the payment amount
      const pmt = (() => {
        if (rate === 0) {
          return -(pv + fv) / nper;
        }
        const pvFactor = (1 - Math.pow(1 + rate, -nper)) / rate;
        const fvFactor = fv / Math.pow(1 + rate, nper);
        return -(pv + fvFactor) / (pvFactor * (1 + rate * type));
      })();

      if (rate === 0) {
        return 0;
      }

      if (type === 0) {
        // Calculate remaining balance after (per-1) payments
        const fv_per_minus_1 = -(
          pmt * ((Math.pow(1 + rate, per - 1) - 1) / rate) +
          pv * Math.pow(1 + rate, per - 1)
        );
        return fv_per_minus_1 * rate;
      } else {
        // Payment at beginning of period
        if (per === 1) {
          return 0;
        }
        const fv_per_minus_2 = -(
          pmt * ((Math.pow(1 + rate, per - 2) - 1) / rate) +
          pv * Math.pow(1 + rate, per - 2)
        );
        return fv_per_minus_2 * rate;
      }
    },
    {
      description:
        "Returns the interest payment for an investment for a given period",
      syntax: "IPMT(rate, per, nper, pv, [fv], [type])",
      category: "Financial",
      examples: ["IPMT(0.1/12, 1, 3*12, 8000)"],
    }
  );

  registry.register(
    "PPMT",
    (args) => {
      if (args.length < 4 || args.length > 6)
        throw new Error("PPMT requires 4-6 arguments");

      const rate = parseFloat(args[0]);
      const per = parseInt(args[1]);
      const nper = parseInt(args[2]);
      const pv = parseFloat(args[3]);
      const fv = args.length > 4 ? parseFloat(args[4]) : 0;
      const type = args.length > 5 ? parseInt(args[5]) : 0;

      // Calculate the payment amount
      const pmt = (() => {
        if (rate === 0) {
          return -(pv + fv) / nper;
        }
        const pvFactor = (1 - Math.pow(1 + rate, -nper)) / rate;
        const fvFactor = fv / Math.pow(1 + rate, nper);
        return -(pv + fvFactor) / (pvFactor * (1 + rate * type));
      })();

      // Calculate interest payment for the period
      const ipmt = (() => {
        if (per < 1 || per > nper) {
          throw new Error("Period must be between 1 and nper");
        }

        if (rate === 0) {
          return 0;
        }

        if (type === 0) {
          const fv_per_minus_1 = -(
            pmt * ((Math.pow(1 + rate, per - 1) - 1) / rate) +
            pv * Math.pow(1 + rate, per - 1)
          );
          return fv_per_minus_1 * rate;
        } else {
          if (per === 1) {
            return 0;
          }
          const fv_per_minus_2 = -(
            pmt * ((Math.pow(1 + rate, per - 2) - 1) / rate) +
            pv * Math.pow(1 + rate, per - 2)
          );
          return fv_per_minus_2 * rate;
        }
      })();

      return pmt - ipmt;
    },
    {
      description:
        "Returns the payment on the principal for an investment for a given period",
      syntax: "PPMT(rate, per, nper, pv, [fv], [type])",
      category: "Financial",
      examples: ["PPMT(0.1/12, 1, 3*12, 8000)"],
    }
  );

  registry.register(
    "SLN",
    (args) => {
      if (args.length !== 3)
        throw new Error("SLN requires exactly 3 arguments");

      const cost = parseFloat(args[0]);
      const salvage = parseFloat(args[1]);
      const life = parseFloat(args[2]);

      if (life === 0) throw new Error("Life cannot be zero");

      return (cost - salvage) / life;
    },
    {
      description:
        "Returns the straight-line depreciation of an asset for one period",
      syntax: "SLN(cost, salvage, life)",
      category: "Financial",
      examples: ["SLN(30000, 7500, 10)"],
    }
  );

  registry.register(
    "DB",
    (args) => {
      if (args.length < 4 || args.length > 5)
        throw new Error("DB requires 4-5 arguments");

      const cost = parseFloat(args[0]);
      const salvage = parseFloat(args[1]);
      const life = parseFloat(args[2]);
      const period = parseFloat(args[3]);
      const month = args.length > 4 ? parseFloat(args[4]) : 12;

      if (life <= 0 || period <= 0 || month <= 0) {
        throw new Error("Life, period, and month must be positive");
      }

      const rate = 1 - Math.pow(salvage / cost, 1 / life);

      if (period === 1) {
        return (cost * rate * month) / 12;
      }

      let totalDepreciation = (cost * rate * month) / 12;
      for (let i = 2; i <= period; i++) {
        const remainingValue = cost - totalDepreciation;
        const currentDepreciation = remainingValue * rate;
        if (i === period) {
          return currentDepreciation;
        }
        totalDepreciation += currentDepreciation;
      }

      return 0;
    },
    {
      description:
        "Returns the depreciation of an asset for a specified period by using the fixed-declining balance method",
      syntax: "DB(cost, salvage, life, period, [month])",
      category: "Financial",
      examples: ["DB(1000000, 100000, 6, 1, 7)"],
    }
  );

  registry.register(
    "DDB",
    (args) => {
      if (args.length < 4 || args.length > 5)
        throw new Error("DDB requires 4-5 arguments");

      const cost = parseFloat(args[0]);
      const salvage = parseFloat(args[1]);
      const life = parseFloat(args[2]);
      const period = parseFloat(args[3]);
      const factor = args.length > 4 ? parseFloat(args[4]) : 2;

      if (cost <= 0 || salvage < 0 || life <= 0 || period <= 0) {
        throw new Error(
          "Invalid arguments: cost, life, and period must be positive; salvage must be non-negative"
        );
      }

      if (period > life) {
        return 0;
      }

      if (salvage >= cost) {
        return 0;
      }

      const rate = factor / life;
      let bookValue = cost;

      for (let i = 1; i <= period; i++) {
        // Calculate depreciation for this period
        // Cannot depreciate below salvage value
        const maxDepreciation = bookValue - salvage;
        const standardDepreciation = bookValue * rate;
        const depreciation = Math.min(standardDepreciation, maxDepreciation);

        if (i === period) {
          return Math.max(0, depreciation);
        }

        bookValue -= depreciation;

        // If we've reached salvage value, no more depreciation
        if (bookValue <= salvage) {
          return 0;
        }
      }

      return 0;
    },
    {
      description:
        "Returns the depreciation of an asset for a specified period by using the double-declining balance method or some other method that you specify",
      syntax: "DDB(cost, salvage, life, period, [factor])",
      category: "Financial",
      examples: ["DDB(2400, 300, 10, 1, 2)"],
    }
  );

  registry.register(
    "SYD",
    (args) => {
      if (args.length !== 4)
        throw new Error("SYD requires exactly 4 arguments");

      const cost = parseFloat(args[0]);
      const salvage = parseFloat(args[1]);
      const life = parseFloat(args[2]);
      const per = parseFloat(args[3]);

      if (per > life || per <= 0) {
        throw new Error("Period must be between 1 and life");
      }

      const sumOfYears = (life * (life + 1)) / 2;
      const yearsRemaining = life - per + 1;

      return (cost - salvage) * (yearsRemaining / sumOfYears);
    },
    {
      description:
        "Returns the sum-of-years' digits depreciation of an asset for a specified period",
      syntax: "SYD(cost, salvage, life, per)",
      category: "Financial",
      examples: ["SYD(30000, 7500, 10, 1)"],
    }
  );

  registry.register(
    "EFFECT",
    (args) => {
      if (args.length !== 2)
        throw new Error("EFFECT requires exactly 2 arguments");

      const nominalRate = parseFloat(args[0]);
      const npery = parseInt(args[1]);

      if (nominalRate <= 0 || npery < 1) {
        throw new Error("Nominal rate must be positive and npery must be >= 1");
      }

      return Math.pow(1 + nominalRate / npery, npery) - 1;
    },
    {
      description: "Returns the effective annual interest rate",
      syntax: "EFFECT(nominal_rate, npery)",
      category: "Financial",
      examples: ["EFFECT(0.0525, 4)"],
    }
  );

  registry.register(
    "NOMINAL",
    (args) => {
      if (args.length !== 2)
        throw new Error("NOMINAL requires exactly 2 arguments");

      const effectRate = parseFloat(args[0]);
      const npery = parseInt(args[1]);

      if (effectRate <= 0 || npery < 1) {
        throw new Error("Effect rate must be positive and npery must be >= 1");
      }

      return npery * (Math.pow(1 + effectRate, 1 / npery) - 1);
    },
    {
      description: "Returns the annual nominal interest rate",
      syntax: "NOMINAL(effect_rate, npery)",
      category: "Financial",
      examples: ["NOMINAL(0.053543, 4)"],
    }
  );

  registry.register(
    "FVSCHEDULE",
    (args) => {
      if (args.length !== 2)
        throw new Error("FVSCHEDULE requires exactly 2 arguments");

      const principal = parseFloat(args[0]);
      const schedule = Array.isArray(args[1])
        ? args[1].map((r) => parseFloat(r))
        : [parseFloat(args[1])];

      return schedule.reduce((fv, rate) => fv * (1 + rate), principal);
    },
    {
      description:
        "Returns the future value of an initial principal after applying a series of compound interest rates",
      syntax: "FVSCHEDULE(principal, schedule)",
      category: "Financial",
      examples: ["FVSCHEDULE(1, {0.09, 0.11, 0.1})"],
    }
  );

  registry.register(
    "MIRR",
    (args) => {
      if (args.length !== 3)
        throw new Error("MIRR requires exactly 3 arguments");

      const values = Array.isArray(args[0])
        ? args[0].map((v) => parseFloat(v))
        : [parseFloat(args[0])];
      const financeRate = parseFloat(args[1]);
      const reinvestRate = parseFloat(args[2]);

      const negativeValues: Array<{ value: number; period: number }> = [];
      const positiveValues: Array<{ value: number; period: number }> = [];

      values.forEach((value, index) => {
        if (value < 0) {
          negativeValues.push({ value, period: index });
        } else if (value > 0) {
          positiveValues.push({ value, period: index });
        }
      });

      if (negativeValues.length === 0 || positiveValues.length === 0) {
        throw new Error(
          "Values must contain both positive and negative numbers"
        );
      }

      const n = values.length - 1;

      // Present value of negative cash flows
      const npvNegative = negativeValues.reduce((sum, item) => {
        return sum + item.value / Math.pow(1 + financeRate, item.period);
      }, 0);

      // Future value of positive cash flows
      const fvPositive = positiveValues.reduce((sum, item) => {
        return sum + item.value * Math.pow(1 + reinvestRate, n - item.period);
      }, 0);

      return Math.pow(-fvPositive / npvNegative, 1 / n) - 1;
    },
    {
      description:
        "Returns the internal rate of return where positive and negative cash flows are financed at different rates",
      syntax: "MIRR(values, finance_rate, reinvest_rate)",
      category: "Financial",
      examples: ["MIRR({-120000,39000,30000,21000,37000,46000}, 0.1, 0.12)"],
    }
  );

  registry.register(
    "PDURATION",
    (args) => {
      if (args.length !== 3)
        throw new Error("PDURATION requires exactly 3 arguments");

      const rate = parseFloat(args[0]);
      const pv = parseFloat(args[1]);
      const fv = parseFloat(args[2]);

      if (rate <= 0 || pv <= 0 || fv <= 0) {
        throw new Error("All arguments must be positive");
      }

      return Math.log(fv / pv) / Math.log(1 + rate);
    },
    {
      description:
        "Returns the number of periods required by an investment to reach a specified value",
      syntax: "PDURATION(rate, pv, fv)",
      category: "Financial",
      examples: ["PDURATION(0.025, 2000, 2200)"],
    }
  );

  registry.register(
    "RRI",
    (args) => {
      if (args.length !== 3)
        throw new Error("RRI requires exactly 3 arguments");

      const nper = parseFloat(args[0]);
      const pv = parseFloat(args[1]);
      const fv = parseFloat(args[2]);

      if (nper <= 0 || pv === 0) {
        throw new Error("Invalid arguments for RRI");
      }

      return Math.pow(fv / pv, 1 / nper) - 1;
    },
    {
      description:
        "Returns an equivalent interest rate for the growth of an investment",
      syntax: "RRI(nper, pv, fv)",
      category: "Financial",
      examples: ["RRI(96, -10000, 11000)"],
    }
  );

  registry.register(
    "DOLLARDE",
    (args) => {
      if (args.length !== 2)
        throw new Error("DOLLARDE requires exactly 2 arguments");

      const fractionalDollar = parseFloat(args[0]);
      const fraction = parseInt(args[1]);

      if (fraction <= 0) {
        throw new Error("Fraction must be positive");
      }

      const wholeDollars = Math.floor(fractionalDollar);
      const fractionalPart = fractionalDollar - wholeDollars;

      return wholeDollars + fractionalPart / fraction;
    },
    {
      description:
        "Converts a dollar price, expressed as a fraction, into a dollar price, expressed as a decimal number",
      syntax: "DOLLARDE(fractional_dollar, fraction)",
      category: "Financial",
      examples: ["DOLLARDE(1.02, 16)"],
    }
  );

  registry.register(
    "DOLLARFR",
    (args) => {
      if (args.length !== 2)
        throw new Error("DOLLARFR requires exactly 2 arguments");

      const decimalDollar = parseFloat(args[0]);
      const fraction = parseInt(args[1]);

      if (fraction <= 0) {
        throw new Error("Fraction must be positive");
      }

      const wholeDollars = Math.floor(decimalDollar);
      const decimalPart = decimalDollar - wholeDollars;

      return wholeDollars + decimalPart * fraction;
    },
    {
      description:
        "Converts a dollar price, expressed as a decimal number, into a dollar price, expressed as a fraction",
      syntax: "DOLLARFR(decimal_dollar, fraction)",
      category: "Financial",
      examples: ["DOLLARFR(1.125, 16)"],
    }
  );

  registry.register(
    "ISPMT",
    (args) => {
      if (args.length !== 4)
        throw new Error("ISPMT requires exactly 4 arguments");

      const rate = parseFloat(args[0]);
      const per = parseFloat(args[1]);
      const nper = parseFloat(args[2]);
      const pv = parseFloat(args[3]);

      return (-pv * rate * (per - 1)) / nper;
    },
    {
      description:
        "Calculates the interest paid during a specific period of an investment",
      syntax: "ISPMT(rate, per, nper, pv)",
      category: "Financial",
      examples: ["ISPMT(0.1/12, 1, 3*12, 8000)"],
    }
  );

  registry.register(
    "CUMIPMT",
    (args) => {
      if (args.length !== 6)
        throw new Error("CUMIPMT requires exactly 6 arguments");

      const rate = parseFloat(args[0]);
      const nper = parseInt(args[1]);
      const pv = parseFloat(args[2]);
      const startPeriod = parseInt(args[3]);
      const endPeriod = parseInt(args[4]);
      const type = parseInt(args[5]);

      if (startPeriod < 1 || endPeriod < startPeriod || endPeriod > nper) {
        throw new Error("Invalid period range");
      }

      let cumulativeInterest = 0;

      for (let period = startPeriod; period <= endPeriod; period++) {
        // Calculate IPMT for each period and sum them
        const pmt = (() => {
          if (rate === 0) {
            return -pv / nper;
          }
          const pvFactor = (1 - Math.pow(1 + rate, -nper)) / rate;
          return -pv / (pvFactor * (1 + rate * type));
        })();

        let ipmt;
        if (rate === 0) {
          ipmt = 0;
        } else if (type === 0) {
          const fv_per_minus_1 = -(
            pmt * ((Math.pow(1 + rate, period - 1) - 1) / rate) +
            pv * Math.pow(1 + rate, period - 1)
          );
          ipmt = fv_per_minus_1 * rate;
        } else {
          if (period === 1) {
            ipmt = 0;
          } else {
            const fv_per_minus_2 = -(
              pmt * ((Math.pow(1 + rate, period - 2) - 1) / rate) +
              pv * Math.pow(1 + rate, period - 2)
            );
            ipmt = fv_per_minus_2 * rate;
          }
        }

        cumulativeInterest += ipmt;
      }

      return cumulativeInterest;
    },
    {
      description: "Returns the cumulative interest paid between two periods",
      syntax: "CUMIPMT(rate, nper, pv, start_period, end_period, type)",
      category: "Financial",
      examples: ["CUMIPMT(0.09/12, 30*12, 125000, 13, 24, 0)"],
    }
  );

  registry.register(
    "CUMPRINC",
    (args) => {
      if (args.length !== 6)
        throw new Error("CUMPRINC requires exactly 6 arguments");

      const rate = parseFloat(args[0]);
      const nper = parseInt(args[1]);
      const pv = parseFloat(args[2]);
      const startPeriod = parseInt(args[3]);
      const endPeriod = parseInt(args[4]);
      const type = parseInt(args[5]);

      if (startPeriod < 1 || endPeriod < startPeriod || endPeriod > nper) {
        throw new Error("Invalid period range");
      }

      let cumulativePrincipal = 0;

      for (let period = startPeriod; period <= endPeriod; period++) {
        // Calculate PPMT for each period and sum them
        const pmt = (() => {
          if (rate === 0) {
            return -pv / nper;
          }
          const pvFactor = (1 - Math.pow(1 + rate, -nper)) / rate;
          return -pv / (pvFactor * (1 + rate * type));
        })();

        let ipmt;
        if (rate === 0) {
          ipmt = 0;
        } else if (type === 0) {
          const fv_per_minus_1 = -(
            pmt * ((Math.pow(1 + rate, period - 1) - 1) / rate) +
            pv * Math.pow(1 + rate, period - 1)
          );
          ipmt = fv_per_minus_1 * rate;
        } else {
          if (period === 1) {
            ipmt = 0;
          } else {
            const fv_per_minus_2 = -(
              pmt * ((Math.pow(1 + rate, period - 2) - 1) / rate) +
              pv * Math.pow(1 + rate, period - 2)
            );
            ipmt = fv_per_minus_2 * rate;
          }
        }

        const ppmt = pmt - ipmt;
        cumulativePrincipal += ppmt;
      }

      return cumulativePrincipal;
    },
    {
      description:
        "Returns the cumulative principal paid on a loan between two periods",
      syntax: "CUMPRINC(rate, nper, pv, start_period, end_period, type)",
      category: "Financial",
      examples: ["CUMPRINC(0.09/12, 30*12, 125000, 13, 24, 0)"],
    }
  );

  registry.register(
    "XNPV",
    (args) => {
      if (args.length !== 3)
        throw new Error("XNPV requires exactly 3 arguments");

      const rate = parseFloat(args[0]);
      const values = Array.isArray(args[1])
        ? args[1].map((v) => parseFloat(v))
        : [parseFloat(args[1])];
      const dates = Array.isArray(args[2])
        ? args[2].map((d) => new Date(d))
        : [new Date(args[2])];

      if (values.length !== dates.length) {
        throw new Error("Values and dates arrays must be the same length");
      }

      if (values.length === 0) {
        return 0;
      }

      const baseDate = dates[0];
      let xnpv = 0;

      for (let i = 0; i < values.length; i++) {
        const daysDiff =
          (dates[i].getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24);
        const yearsDiff = daysDiff / 365.25;
        xnpv += values[i] / Math.pow(1 + rate, yearsDiff);
      }

      return xnpv;
    },
    {
      description:
        "Returns the net present value for a schedule of cash flows that is not necessarily periodic",
      syntax: "XNPV(rate, values, dates)",
      category: "Financial",
      examples: [
        'XNPV(0.09, {-10000, 2750, 4250, 3250, 2750}, {"1/1/2008", "3/1/2008", "10/30/2008", "2/15/2009", "4/1/2009"})',
      ],
    }
  );

  registry.register(
    "XIRR",
    (args) => {
      if (args.length < 2 || args.length > 3)
        throw new Error("XIRR requires 2-3 arguments");

      const values = Array.isArray(args[0])
        ? args[0].map((v) => parseFloat(v))
        : [parseFloat(args[0])];
      const dates = Array.isArray(args[1])
        ? args[1].map((d) => new Date(d))
        : [new Date(args[1])];
      const guess = args.length > 2 ? parseFloat(args[2]) : 0.1;

      if (values.length !== dates.length) {
        throw new Error("Values and dates arrays must be the same length");
      }

      if (values.length < 2) {
        throw new Error("Need at least 2 values for XIRR");
      }

      const baseDate = dates[0];

      // Newton-Raphson method for XIRR
      let rate = guess;
      for (let iteration = 0; iteration < 20; iteration++) {
        let f = 0;
        let df = 0;

        for (let i = 0; i < values.length; i++) {
          const daysDiff =
            (dates[i].getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24);
          const yearsDiff = daysDiff / 365.25;

          const factor = Math.pow(1 + rate, yearsDiff);
          f += values[i] / factor;
          df -= (values[i] * yearsDiff) / (factor * (1 + rate));
        }

        const newRate = rate - f / df;
        if (Math.abs(newRate - rate) < 1e-6) {
          return newRate;
        }
        rate = newRate;
      }

      return rate;
    },
    {
      description:
        "Returns the internal rate of return for a schedule of cash flows that is not necessarily periodic",
      syntax: "XIRR(values, dates, [guess])",
      category: "Financial",
      examples: [
        'XIRR({-10000, 2750, 4250, 3250, 2750}, {"1/1/2008", "3/1/2008", "10/30/2008", "2/15/2009", "4/1/2009"})',
      ],
    }
  );
}
