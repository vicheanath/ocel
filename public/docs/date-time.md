# Date & Time Functions

Functions for date and time calculations, formatting, and manipulation.

*This document contains 23 functions.*

---

## DATE

**Description:** Returns a date from year, month, and day values

**Syntax:** `DATE(year, month, day)`

**Category:** Date & Time

**Examples:**
- `DATE(2023, 12, 25)`
- `DATE(A1, B1, C1)`

---

## DATEDIF

**Description:** Calculates the difference between two dates

**Syntax:** `DATEDIF(start_date, end_date, unit)`

**Category:** Date & Time

**Examples:**
- `DATEDIF(A1, B1, "D")`
- `DATEDIF(DATE(2020,1,1), TODAY(), "Y")`

---

## DATEVALUE

**Description:** Converts a date in the form of text to a serial number

**Syntax:** `DATEVALUE(date_text)`

**Category:** Date & Time

**Examples:**
- `DATEVALUE("1/1/2008")`
- `DATEVALUE("30-Dec-2008")`

---

## DAY

**Description:** Returns the day of a date

**Syntax:** `DAY(serial_number)`

**Category:** Date & Time

**Examples:**
- `DAY(TODAY())`
- `DAY(A1)`

---

## DAYS

**Description:** Returns the number of days between two dates

**Syntax:** `DAYS(end_date, start_date)`

**Category:** Date & Time

**Examples:**
- `DAYS("3/15/11", "2/1/11")`

---

## DAYS360

**Description:** Calculates the number of days between two dates based on a 360-day year

**Syntax:** `DAYS360(start_date, end_date, [method])`

**Category:** Date & Time

**Examples:**
- `DAYS360("1/30/2011", "2/1/2011")`

---

## EDATE

**Description:** Returns the serial number of the date that is the indicated number of months before or after the start date

**Syntax:** `EDATE(start_date, months)`

**Category:** Date & Time

**Examples:**
- `EDATE("1/15/2011", -1)`

---

## EOMONTH

**Description:** Returns the serial number of the last day of the month before or after a specified number of months

**Syntax:** `EOMONTH(start_date, months)`

**Category:** Date & Time

**Examples:**
- `EOMONTH("1/1/2011", -3)`

---

## HOUR

**Description:** Returns the hour of a time value

**Syntax:** `HOUR(serial_number)`

**Category:** Date & Time

**Examples:**
- `HOUR(NOW())`
- `HOUR(A1)`

---

## ISOWEEKNUM

**Description:** Returns the number of the ISO week number of the year for a given date

**Syntax:** `ISOWEEKNUM(date)`

**Category:** Date & Time

**Examples:**
- `ISOWEEKNUM("3/9/2012")`

---

## MINUTE

**Description:** Returns the minutes of a time value

**Syntax:** `MINUTE(serial_number)`

**Category:** Date & Time

**Examples:**
- `MINUTE(NOW())`
- `MINUTE(A1)`

---

## MONTH

**Description:** Returns the month of a date

**Syntax:** `MONTH(serial_number)`

**Category:** Date & Time

**Examples:**
- `MONTH(TODAY())`
- `MONTH(A1)`

---

## NETWORKDAYS

**Description:** Returns the number of whole workdays between two dates

**Syntax:** `NETWORKDAYS(start_date, end_date, [holidays])`

**Category:** Date & Time

**Examples:**
- `NETWORKDAYS(A2, A3)`
- `NETWORKDAYS(TODAY(), A2, B2:B5)`

---

## NOW

**Description:** Returns the current date and time

**Syntax:** `NOW()`

**Category:** Date & Time

**Examples:**
- `NOW()`

---

## SECOND

**Description:** Returns the seconds of a time value

**Syntax:** `SECOND(serial_number)`

**Category:** Date & Time

**Examples:**
- `SECOND(NOW())`
- `SECOND(A1)`

---

## TIME

**Description:** Returns a time from hour, minute, and second values

**Syntax:** `TIME(hour, minute, second)`

**Category:** Date & Time

**Examples:**
- `TIME(15, 30, 0)`
- `TIME(A1, B1, C1)`

---

## TIMEVALUE

**Description:** Converts a time in the form of text to a serial number

**Syntax:** `TIMEVALUE(time_text)`

**Category:** Date & Time

**Examples:**
- `TIMEVALUE("3:32 AM")`
- `TIMEVALUE("22:48:00")`

---

## TODAY

**Description:** Returns the current date

**Syntax:** `TODAY()`

**Category:** Date & Time

**Examples:**
- `TODAY()`

---

## WEEKDAY

**Description:** Returns the day of the week for a date

**Syntax:** `WEEKDAY(serial_number, [return_type])`

**Category:** Date & Time

**Examples:**
- `WEEKDAY(TODAY())`
- `WEEKDAY(A1, 2)`

---

## WEEKNUM

**Description:** Converts a serial number to a number representing where the week falls numerically with a year

**Syntax:** `WEEKNUM(serial_number, [return_type])`

**Category:** Date & Time

**Examples:**
- `WEEKNUM("3/9/2012", 2)`

---

## WORKDAY

**Description:** Returns a date that is a specified number of working days from the start date

**Syntax:** `WORKDAY(start_date, days, [holidays])`

**Category:** Date & Time

**Examples:**
- `WORKDAY(TODAY(), 10)`
- `WORKDAY(A1, 5, B1:B10)`

---

## YEAR

**Description:** Returns the year of a date

**Syntax:** `YEAR(serial_number)`

**Category:** Date & Time

**Examples:**
- `YEAR(TODAY())`
- `YEAR(A1)`

---

## YEARFRAC

**Description:** Returns the year fraction representing the number of whole days between start_date and end_date

**Syntax:** `YEARFRAC(start_date, end_date, [basis])`

**Category:** Date & Time

**Examples:**
- `YEARFRAC("1/1/2012", "7/30/2012", 1)`

