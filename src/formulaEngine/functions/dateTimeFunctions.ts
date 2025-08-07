// Date and Time Functions
import { FunctionRegistry } from "../FunctionRegistry";

export function registerDateTimeFunctions(registry: FunctionRegistry) {
  registry.register(
    "TODAY",
    () => {
      const today = new Date();
      return new Date(today.getFullYear(), today.getMonth(), today.getDate())
        .toISOString()
        .split("T")[0];
    },
    {
      description: "Returns the current date",
      syntax: "TODAY()",
      category: "Date & Time",
      examples: ["TODAY()"],
    }
  );

  registry.register(
    "NOW",
    () => {
      return new Date().toISOString();
    },
    {
      description: "Returns the current date and time",
      syntax: "NOW()",
      category: "Date & Time",
      examples: ["NOW()"],
    }
  );

  registry.register(
    "DATE",
    (args) => {
      if (args.length !== 3)
        throw new Error("DATE requires exactly 3 arguments");
      const year = parseInt(args[0]);
      const month = parseInt(args[1]) - 1; // JavaScript months are 0-based
      const day = parseInt(args[2]);
      return new Date(year, month, day).toISOString().split("T")[0];
    },
    {
      description: "Returns a date from year, month, and day values",
      syntax: "DATE(year, month, day)",
      category: "Date & Time",
      examples: ["DATE(2023, 12, 25)", "DATE(A1, B1, C1)"],
    }
  );

  registry.register(
    "TIME",
    (args) => {
      if (args.length !== 3)
        throw new Error("TIME requires exactly 3 arguments");
      const hour = parseInt(args[0]);
      const minute = parseInt(args[1]);
      const second = parseInt(args[2]);

      // Return as decimal fraction of a day
      return (hour * 3600 + minute * 60 + second) / 86400;
    },
    {
      description: "Returns a time from hour, minute, and second values",
      syntax: "TIME(hour, minute, second)",
      category: "Date & Time",
      examples: ["TIME(15, 30, 0)", "TIME(A1, B1, C1)"],
    }
  );

  registry.register(
    "YEAR",
    (args) => {
      if (args.length !== 1)
        throw new Error("YEAR requires exactly 1 argument");
      const date = new Date(args[0]);
      return date.getFullYear();
    },
    {
      description: "Returns the year of a date",
      syntax: "YEAR(serial_number)",
      category: "Date & Time",
      examples: ["YEAR(TODAY())", "YEAR(A1)"],
    }
  );

  registry.register(
    "MONTH",
    (args) => {
      if (args.length !== 1)
        throw new Error("MONTH requires exactly 1 argument");
      const date = new Date(args[0]);
      return date.getMonth() + 1; // JavaScript months are 0-based
    },
    {
      description: "Returns the month of a date",
      syntax: "MONTH(serial_number)",
      category: "Date & Time",
      examples: ["MONTH(TODAY())", "MONTH(A1)"],
    }
  );

  registry.register(
    "DAY",
    (args) => {
      if (args.length !== 1) throw new Error("DAY requires exactly 1 argument");
      const date = new Date(args[0]);
      return date.getDate();
    },
    {
      description: "Returns the day of a date",
      syntax: "DAY(serial_number)",
      category: "Date & Time",
      examples: ["DAY(TODAY())", "DAY(A1)"],
    }
  );

  registry.register(
    "HOUR",
    (args) => {
      if (args.length !== 1)
        throw new Error("HOUR requires exactly 1 argument");
      const date = new Date(args[0]);
      return date.getHours();
    },
    {
      description: "Returns the hour of a time value",
      syntax: "HOUR(serial_number)",
      category: "Date & Time",
      examples: ["HOUR(NOW())", "HOUR(A1)"],
    }
  );

  registry.register(
    "MINUTE",
    (args) => {
      if (args.length !== 1)
        throw new Error("MINUTE requires exactly 1 argument");
      const date = new Date(args[0]);
      return date.getMinutes();
    },
    {
      description: "Returns the minutes of a time value",
      syntax: "MINUTE(serial_number)",
      category: "Date & Time",
      examples: ["MINUTE(NOW())", "MINUTE(A1)"],
    }
  );

  registry.register(
    "SECOND",
    (args) => {
      if (args.length !== 1)
        throw new Error("SECOND requires exactly 1 argument");
      const date = new Date(args[0]);
      return date.getSeconds();
    },
    {
      description: "Returns the seconds of a time value",
      syntax: "SECOND(serial_number)",
      category: "Date & Time",
      examples: ["SECOND(NOW())", "SECOND(A1)"],
    }
  );

  registry.register(
    "WEEKDAY",
    (args) => {
      if (args.length < 1 || args.length > 2)
        throw new Error("WEEKDAY requires 1-2 arguments");
      const date = new Date(args[0]);
      const returnType = args.length > 1 ? parseInt(args[1]) : 1;

      const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday

      switch (returnType) {
        case 1: // 1 = Sunday, 7 = Saturday
          return dayOfWeek + 1;
        case 2: // 1 = Monday, 7 = Sunday
          return dayOfWeek === 0 ? 7 : dayOfWeek;
        case 3: // 0 = Monday, 6 = Sunday
          return dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        default:
          return dayOfWeek + 1;
      }
    },
    {
      description: "Returns the day of the week for a date",
      syntax: "WEEKDAY(serial_number, [return_type])",
      category: "Date & Time",
      examples: ["WEEKDAY(TODAY())", "WEEKDAY(A1, 2)"],
    }
  );

  registry.register(
    "DATEDIF",
    (args) => {
      if (args.length !== 3)
        throw new Error("DATEDIF requires exactly 3 arguments");

      const startDate = new Date(args[0]);
      const endDate = new Date(args[1]);
      const unit = String(args[2]).toUpperCase();

      const diffTime = endDate.getTime() - startDate.getTime();

      switch (unit) {
        case "D": // Days
          return Math.floor(diffTime / (1000 * 60 * 60 * 24));
        case "M": // Months
          return (
            (endDate.getFullYear() - startDate.getFullYear()) * 12 +
            (endDate.getMonth() - startDate.getMonth())
          );
        case "Y": // Years
          return endDate.getFullYear() - startDate.getFullYear();
        case "MD": {
          // Days ignoring months and years
          const tempDate = new Date(
            endDate.getFullYear(),
            endDate.getMonth(),
            startDate.getDate()
          );
          return Math.floor(
            (endDate.getTime() - tempDate.getTime()) / (1000 * 60 * 60 * 24)
          );
        }
        case "YM": // Months ignoring years
          return endDate.getMonth() - startDate.getMonth();
        case "YD": {
          // Days ignoring years
          const yearDiff = endDate.getFullYear() - startDate.getFullYear();
          const adjustedStart = new Date(startDate.getTime());
          adjustedStart.setFullYear(adjustedStart.getFullYear() + yearDiff);
          return Math.floor(
            (endDate.getTime() - adjustedStart.getTime()) /
              (1000 * 60 * 60 * 24)
          );
        }
        default:
          throw new Error("Invalid unit for DATEDIF");
      }
    },
    {
      description: "Calculates the difference between two dates",
      syntax: "DATEDIF(start_date, end_date, unit)",
      category: "Date & Time",
      examples: [
        'DATEDIF(A1, B1, "D")',
        'DATEDIF(DATE(2020,1,1), TODAY(), "Y")',
      ],
    }
  );

  registry.register(
    "WORKDAY",
    (args) => {
      if (args.length < 2 || args.length > 3)
        throw new Error("WORKDAY requires 2-3 arguments");

      const startDate = new Date(args[0]);
      const days = parseInt(args[1]);
      const holidays =
        args.length > 2 ? (Array.isArray(args[2]) ? args[2] : [args[2]]) : [];

      const currentDate = new Date(startDate);
      let addedDays = 0;
      const increment = days > 0 ? 1 : -1;
      const targetDays = Math.abs(days);

      while (addedDays < targetDays) {
        currentDate.setDate(currentDate.getDate() + increment);

        // Skip weekends (Saturday = 6, Sunday = 0)
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) continue;

        // Skip holidays
        const isHoliday = holidays.some((holiday) => {
          const holidayDate = new Date(holiday);
          return currentDate.toDateString() === holidayDate.toDateString();
        });
        if (isHoliday) continue;

        addedDays++;
      }

      return currentDate.toISOString().split("T")[0];
    },
    {
      description:
        "Returns a date that is a specified number of working days from the start date",
      syntax: "WORKDAY(start_date, days, [holidays])",
      category: "Date & Time",
      examples: ["WORKDAY(TODAY(), 10)", "WORKDAY(A1, 5, B1:B10)"],
    }
  );

  registry.register(
    "DATEVALUE",
    (args) => {
      if (args.length !== 1) throw new Error("DATEVALUE requires 1 argument");
      const dateText = String(args[0]);
      const date = new Date(dateText);

      if (isNaN(date.getTime())) {
        throw new Error("Invalid date text");
      }

      // Return as Excel serial number (days since January 1, 1900)
      const excelEpoch = new Date(1900, 0, 1);
      const diffTime = date.getTime() - excelEpoch.getTime();
      return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 2; // +2 for Excel leap year bug
    },
    {
      description: "Converts a date in the form of text to a serial number",
      syntax: "DATEVALUE(date_text)",
      category: "Date & Time",
      examples: ['DATEVALUE("1/1/2008")', 'DATEVALUE("30-Dec-2008")'],
    }
  );

  registry.register(
    "TIMEVALUE",
    (args) => {
      if (args.length !== 1) throw new Error("TIMEVALUE requires 1 argument");
      const timeText = String(args[0]);

      // Parse time string (simplified implementation)
      const timeMatch = timeText.match(
        /(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\s*(AM|PM))?/i
      );
      if (!timeMatch) {
        throw new Error("Invalid time text");
      }

      let hours = parseInt(timeMatch[1]);
      const minutes = parseInt(timeMatch[2]);
      const seconds = parseInt(timeMatch[3]) || 0;
      const ampm = timeMatch[4];

      if (ampm) {
        if (ampm.toUpperCase() === "PM" && hours !== 12) hours += 12;
        if (ampm.toUpperCase() === "AM" && hours === 12) hours = 0;
      }

      // Return as decimal fraction of a day
      return (hours * 3600 + minutes * 60 + seconds) / 86400;
    },
    {
      description: "Converts a time in the form of text to a serial number",
      syntax: "TIMEVALUE(time_text)",
      category: "Date & Time",
      examples: ['TIMEVALUE("3:32 AM")', 'TIMEVALUE("22:48:00")'],
    }
  );

  registry.register(
    "DAYS",
    (args) => {
      if (args.length !== 2)
        throw new Error("DAYS requires exactly 2 arguments");
      const endDate = new Date(args[0]);
      const startDate = new Date(args[1]);

      if (isNaN(endDate.getTime()) || isNaN(startDate.getTime())) {
        throw new Error("Invalid date arguments");
      }

      const diffTime = endDate.getTime() - startDate.getTime();
      return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    },
    {
      description: "Returns the number of days between two dates",
      syntax: "DAYS(end_date, start_date)",
      category: "Date & Time",
      examples: ["DAYS(TODAY(), A2)", 'DAYS("3/15/11", "2/1/11")'],
    }
  );

  registry.register(
    "DAYS360",
    (args) => {
      if (args.length < 2 || args.length > 3)
        throw new Error("DAYS360 requires 2-3 arguments");

      const startDate = new Date(args[0]);
      const endDate = new Date(args[1]);
      const method = args.length > 2 ? Boolean(args[2]) : false; // US method by default

      const startYear = startDate.getFullYear();
      const startMonth = startDate.getMonth() + 1;
      let startDay = startDate.getDate();

      const endYear = endDate.getFullYear();
      const endMonth = endDate.getMonth() + 1;
      let endDay = endDate.getDate();

      if (!method) {
        // US (NASD) method
        if (startDay === 31) startDay = 30;
        if (endDay === 31 && startDay === 30) endDay = 30;
      } else {
        // European method
        if (startDay === 31) startDay = 30;
        if (endDay === 31) endDay = 30;
      }

      return (
        (endYear - startYear) * 360 +
        (endMonth - startMonth) * 30 +
        (endDay - startDay)
      );
    },
    {
      description:
        "Calculates the number of days between two dates based on a 360-day year",
      syntax: "DAYS360(start_date, end_date, [method])",
      category: "Date & Time",
      examples: ["DAYS360(A2, A3)", 'DAYS360("1/30/2011", "2/1/2011")'],
    }
  );

  registry.register(
    "EDATE",
    (args) => {
      if (args.length !== 2)
        throw new Error("EDATE requires exactly 2 arguments");
      const startDate = new Date(args[0]);
      const months = parseInt(args[1]);

      if (isNaN(startDate.getTime())) {
        throw new Error("Invalid start date");
      }

      const resultDate = new Date(startDate);
      resultDate.setMonth(resultDate.getMonth() + months);

      return resultDate.toISOString().split("T")[0];
    },
    {
      description:
        "Returns the serial number of the date that is the indicated number of months before or after the start date",
      syntax: "EDATE(start_date, months)",
      category: "Date & Time",
      examples: ["EDATE(TODAY(), 1)", 'EDATE("1/15/2011", -1)'],
    }
  );

  registry.register(
    "EOMONTH",
    (args) => {
      if (args.length !== 2)
        throw new Error("EOMONTH requires exactly 2 arguments");
      const startDate = new Date(args[0]);
      const months = parseInt(args[1]);

      if (isNaN(startDate.getTime())) {
        throw new Error("Invalid start date");
      }

      const resultDate = new Date(startDate);
      resultDate.setMonth(resultDate.getMonth() + months + 1, 0); // Set to last day of target month

      return resultDate.toISOString().split("T")[0];
    },
    {
      description:
        "Returns the serial number of the last day of the month before or after a specified number of months",
      syntax: "EOMONTH(start_date, months)",
      category: "Date & Time",
      examples: ["EOMONTH(TODAY(), 1)", 'EOMONTH("1/1/2011", -3)'],
    }
  );

  registry.register(
    "NETWORKDAYS",
    (args) => {
      if (args.length < 2 || args.length > 3)
        throw new Error("NETWORKDAYS requires 2-3 arguments");

      const startDate = new Date(args[0]);
      const endDate = new Date(args[1]);
      const holidays =
        args.length > 2 ? (Array.isArray(args[2]) ? args[2] : [args[2]]) : [];

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error("Invalid date arguments");
      }

      const start = new Date(Math.min(startDate.getTime(), endDate.getTime()));
      const end = new Date(Math.max(startDate.getTime(), endDate.getTime()));

      let workDays = 0;
      const currentDate = new Date(start);

      while (currentDate <= end) {
        const dayOfWeek = currentDate.getDay();

        // Skip weekends
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          // Check if it's not a holiday
          const isHoliday = holidays.some((holiday) => {
            const holidayDate = new Date(holiday);
            return currentDate.toDateString() === holidayDate.toDateString();
          });

          if (!isHoliday) {
            workDays++;
          }
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }

      return startDate.getTime() > endDate.getTime() ? -workDays : workDays;
    },
    {
      description: "Returns the number of whole workdays between two dates",
      syntax: "NETWORKDAYS(start_date, end_date, [holidays])",
      category: "Date & Time",
      examples: ["NETWORKDAYS(A2, A3)", "NETWORKDAYS(TODAY(), A2, B2:B5)"],
    }
  );

  registry.register(
    "WEEKNUM",
    (args) => {
      if (args.length < 1 || args.length > 2)
        throw new Error("WEEKNUM requires 1-2 arguments");

      const date = new Date(args[0]);
      const returnType = args.length > 1 ? parseInt(args[1]) : 1;

      if (isNaN(date.getTime())) {
        throw new Error("Invalid date argument");
      }

      const year = date.getFullYear();
      const startOfYear = new Date(year, 0, 1);

      // Adjust start of year based on return type
      let firstWeekStart;
      switch (returnType) {
        case 1: // Week begins on Sunday
        case 17: // Week begins on Sunday
          firstWeekStart = new Date(startOfYear);
          firstWeekStart.setDate(1 - startOfYear.getDay());
          break;
        case 2: // Week begins on Monday
        case 21: {
          // Week begins on Monday
          firstWeekStart = new Date(startOfYear);
          const dayOfWeek = startOfYear.getDay();
          firstWeekStart.setDate(1 - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
          break;
        }
        default:
          firstWeekStart = new Date(startOfYear);
          firstWeekStart.setDate(1 - startOfYear.getDay());
      }

      const diffTime = date.getTime() - firstWeekStart.getTime();
      return Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7)) + 1;
    },
    {
      description:
        "Converts a serial number to a number representing where the week falls numerically with a year",
      syntax: "WEEKNUM(serial_number, [return_type])",
      category: "Date & Time",
      examples: ["WEEKNUM(TODAY())", 'WEEKNUM("3/9/2012", 2)'],
    }
  );

  registry.register(
    "ISOWEEKNUM",
    (args) => {
      if (args.length !== 1) throw new Error("ISOWEEKNUM requires 1 argument");
      const date = new Date(args[0]);

      if (isNaN(date.getTime())) {
        throw new Error("Invalid date argument");
      }

      // ISO week calculation
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();

      // Create a copy of the date
      const target = new Date(year, month, day);

      // ISO week starts on Monday, so adjust
      const dayOfWeek = (target.getDay() + 6) % 7; // Monday = 0, Sunday = 6
      target.setDate(target.getDate() - dayOfWeek + 3); // Thursday of this week

      // January 4th is always in week 1
      const jan4 = new Date(target.getFullYear(), 0, 4);
      const jan4DayOfWeek = (jan4.getDay() + 6) % 7;
      jan4.setDate(jan4.getDate() - jan4DayOfWeek + 3);

      const diffTime = target.getTime() - jan4.getTime();
      return Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7)) + 1;
    },
    {
      description:
        "Returns the number of the ISO week number of the year for a given date",
      syntax: "ISOWEEKNUM(date)",
      category: "Date & Time",
      examples: ["ISOWEEKNUM(TODAY())", 'ISOWEEKNUM("3/9/2012")'],
    }
  );

  registry.register(
    "YEARFRAC",
    (args) => {
      if (args.length < 2 || args.length > 3)
        throw new Error("YEARFRAC requires 2-3 arguments");

      const startDate = new Date(args[0]);
      const endDate = new Date(args[1]);
      const basis = args.length > 2 ? parseInt(args[2]) : 0;

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error("Invalid date arguments");
      }

      const start =
        startDate.getTime() <= endDate.getTime() ? startDate : endDate;
      const end =
        startDate.getTime() <= endDate.getTime() ? endDate : startDate;

      // Helper function for 360-day calculations
      const calculate360DayCount = (
        startDt: Date,
        endDt: Date,
        european: boolean
      ): number => {
        let startDay = startDt.getDate();
        let endDay = endDt.getDate();

        if (!european) {
          // US method
          if (startDay === 31) startDay = 30;
          if (endDay === 31 && startDay === 30) endDay = 30;
        } else {
          // European method
          if (startDay === 31) startDay = 30;
          if (endDay === 31) endDay = 30;
        }

        return (
          (endDt.getFullYear() - startDt.getFullYear()) * 360 +
          (endDt.getMonth() - startDt.getMonth()) * 30 +
          (endDay - startDay)
        );
      };

      switch (basis) {
        case 0: // 30/360 US
          return calculate360DayCount(start, end, false) / 360;
        case 1: {
          // Actual/actual
          const startYear = start.getFullYear();
          const endYear = end.getFullYear();

          if (startYear === endYear) {
            const isLeapYear =
              (startYear % 4 === 0 && startYear % 100 !== 0) ||
              startYear % 400 === 0;
            const daysInYear = isLeapYear ? 366 : 365;
            const diffTime = end.getTime() - start.getTime();
            const daysDiff = diffTime / (1000 * 60 * 60 * 24);
            return daysDiff / daysInYear;
          } else {
            // Multi-year calculation (simplified)
            const diffTime = end.getTime() - start.getTime();
            const daysDiff = diffTime / (1000 * 60 * 60 * 24);
            return daysDiff / 365.25; // Average
          }
        }
        case 2: {
          // Actual/360
          const diffTime = end.getTime() - start.getTime();
          const daysDiff = diffTime / (1000 * 60 * 60 * 24);
          return daysDiff / 360;
        }
        case 3: {
          // Actual/365
          const diffTime = end.getTime() - start.getTime();
          const daysDiff = diffTime / (1000 * 60 * 60 * 24);
          return daysDiff / 365;
        }
        case 4: // 30/360 European
          return calculate360DayCount(start, end, true) / 360;
        default:
          throw new Error("Invalid basis argument");
      }
    },
    {
      description:
        "Returns the year fraction representing the number of whole days between start_date and end_date",
      syntax: "YEARFRAC(start_date, end_date, [basis])",
      category: "Date & Time",
      examples: ["YEARFRAC(A2, A3)", 'YEARFRAC("1/1/2012", "7/30/2012", 1)'],
    }
  );
}
