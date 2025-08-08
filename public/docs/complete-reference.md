# React Sheet - Complete Function Reference

*Last updated: 2025-08-08T00:17:43.098Z*

## Overview

React Sheet provides 298 functions across 12 categories, designed to be compatible with Excel formulas while offering enhanced web functionality.

## Quick Navigation

- [Database](#database) (10 functions)
- [Date & Time](#date-time) (23 functions)
- [Engineering](#engineering) (26 functions)
- [Financial](#financial) (26 functions)
- [Information](#information) (22 functions)
- [Legacy](#legacy) (13 functions)
- [Logical](#logical) (19 functions)
- [Lookup & Reference](#lookup-reference) (9 functions)
- [Math & Trigonometry](#math-trigonometry) (49 functions)
- [Statistical](#statistical) (49 functions)
- [Text](#text) (49 functions)
- [Web](#web) (3 functions)

---

## Database

Functions for working with structured data tables and performing database-like operations.

### Functions in this category:

#### DAVERAGE

**Returns the average of selected database entries**

- **Syntax:** `DAVERAGE(database, field, criteria)`
- **Examples:** `DAVERAGE(A1:E10, "Score", G1:G2)`

#### DCOUNT

**Counts the cells that contain numbers in a database**

- **Syntax:** `DCOUNT(database, field, criteria)`
- **Examples:** `DCOUNT(A1:E10, "Age", G1:G2)`

#### DCOUNTA

**Counts nonblank cells in a database**

- **Syntax:** `DCOUNTA(database, field, criteria)`
- **Examples:** `DCOUNTA(A1:E10, "Name", G1:G2)`

#### DGET

**Extracts from a database a single record that matches the specified criteria**

- **Syntax:** `DGET(database, field, criteria)`
- **Examples:** `DGET(A1:E10, "Name", G1:G2)`

#### DMAX

**Returns the maximum value among selected database entries**

- **Syntax:** `DMAX(database, field, criteria)`
- **Examples:** `DMAX(A1:E10, "Sales", G1:G2)`

#### DMIN

**Returns the minimum value among selected database entries**

- **Syntax:** `DMIN(database, field, criteria)`
- **Examples:** `DMIN(A1:E10, "Price", G1:G2)`

#### DPRODUCT

**Multiplies the values in a particular field of records that match the criteria**

- **Syntax:** `DPRODUCT(database, field, criteria)`
- **Examples:** `DPRODUCT(A1:E10, "Quantity", G1:G2)`

#### DSTDEV

**Estimates the standard deviation based on a sample of selected database entries**

- **Syntax:** `DSTDEV(database, field, criteria)`
- **Examples:** `DSTDEV(A1:E10, "Score", G1:G2)`

#### DSUM

**Returns the sum of selected database entries**

- **Syntax:** `DSUM(database, field, criteria)`
- **Examples:** `DSUM(A1:E10, "Sales", G1:G2)`

#### DVAR

**Estimates variance based on a sample of selected database entries**

- **Syntax:** `DVAR(database, field, criteria)`
- **Examples:** `DVAR(A1:E10, "Sales", G1:G2)`



---

## Date & Time

Functions for date and time calculations, formatting, and manipulation.

### Functions in this category:

#### DATE

**Returns a date from year, month, and day values**

- **Syntax:** `DATE(year, month, day)`
- **Examples:** `DATE(2023, 12, 25)`, `DATE(A1, B1, C1)`

#### DATEDIF

**Calculates the difference between two dates**

- **Syntax:** `DATEDIF(start_date, end_date, unit)`
- **Examples:** `DATEDIF(A1, B1, "D")`, `DATEDIF(DATE(2020,1,1), TODAY(), "Y")`

#### DATEVALUE

**Converts a date in the form of text to a serial number**

- **Syntax:** `DATEVALUE(date_text)`
- **Examples:** `DATEVALUE("1/1/2008")`, `DATEVALUE("30-Dec-2008")`

#### DAY

**Returns the day of a date**

- **Syntax:** `DAY(serial_number)`
- **Examples:** `DAY(TODAY())`, `DAY(A1)`

#### DAYS

**Returns the number of days between two dates**

- **Syntax:** `DAYS(end_date, start_date)`
- **Examples:** `DAYS("3/15/11", "2/1/11")`

#### DAYS360

**Calculates the number of days between two dates based on a 360-day year**

- **Syntax:** `DAYS360(start_date, end_date, [method])`
- **Examples:** `DAYS360("1/30/2011", "2/1/2011")`

#### EDATE

**Returns the serial number of the date that is the indicated number of months before or after the start date**

- **Syntax:** `EDATE(start_date, months)`
- **Examples:** `EDATE("1/15/2011", -1)`

#### EOMONTH

**Returns the serial number of the last day of the month before or after a specified number of months**

- **Syntax:** `EOMONTH(start_date, months)`
- **Examples:** `EOMONTH("1/1/2011", -3)`

#### HOUR

**Returns the hour of a time value**

- **Syntax:** `HOUR(serial_number)`
- **Examples:** `HOUR(NOW())`, `HOUR(A1)`

#### ISOWEEKNUM

**Returns the number of the ISO week number of the year for a given date**

- **Syntax:** `ISOWEEKNUM(date)`
- **Examples:** `ISOWEEKNUM("3/9/2012")`

#### MINUTE

**Returns the minutes of a time value**

- **Syntax:** `MINUTE(serial_number)`
- **Examples:** `MINUTE(NOW())`, `MINUTE(A1)`

#### MONTH

**Returns the month of a date**

- **Syntax:** `MONTH(serial_number)`
- **Examples:** `MONTH(TODAY())`, `MONTH(A1)`

#### NETWORKDAYS

**Returns the number of whole workdays between two dates**

- **Syntax:** `NETWORKDAYS(start_date, end_date, [holidays])`
- **Examples:** `NETWORKDAYS(A2, A3)`, `NETWORKDAYS(TODAY(), A2, B2:B5)`

#### NOW

**Returns the current date and time**

- **Syntax:** `NOW()`
- **Examples:** `NOW()`

#### SECOND

**Returns the seconds of a time value**

- **Syntax:** `SECOND(serial_number)`
- **Examples:** `SECOND(NOW())`, `SECOND(A1)`

#### TIME

**Returns a time from hour, minute, and second values**

- **Syntax:** `TIME(hour, minute, second)`
- **Examples:** `TIME(15, 30, 0)`, `TIME(A1, B1, C1)`

#### TIMEVALUE

**Converts a time in the form of text to a serial number**

- **Syntax:** `TIMEVALUE(time_text)`
- **Examples:** `TIMEVALUE("3:32 AM")`, `TIMEVALUE("22:48:00")`

#### TODAY

**Returns the current date**

- **Syntax:** `TODAY()`
- **Examples:** `TODAY()`

#### WEEKDAY

**Returns the day of the week for a date**

- **Syntax:** `WEEKDAY(serial_number, [return_type])`
- **Examples:** `WEEKDAY(TODAY())`, `WEEKDAY(A1, 2)`

#### WEEKNUM

**Converts a serial number to a number representing where the week falls numerically with a year**

- **Syntax:** `WEEKNUM(serial_number, [return_type])`
- **Examples:** `WEEKNUM("3/9/2012", 2)`

#### WORKDAY

**Returns a date that is a specified number of working days from the start date**

- **Syntax:** `WORKDAY(start_date, days, [holidays])`
- **Examples:** `WORKDAY(TODAY(), 10)`, `WORKDAY(A1, 5, B1:B10)`

#### YEAR

**Returns the year of a date**

- **Syntax:** `YEAR(serial_number)`
- **Examples:** `YEAR(TODAY())`, `YEAR(A1)`

#### YEARFRAC

**Returns the year fraction representing the number of whole days between start_date and end_date**

- **Syntax:** `YEARFRAC(start_date, end_date, [basis])`
- **Examples:** `YEARFRAC("1/1/2012", "7/30/2012", 1)`



---

## Engineering

Specialized functions for engineering calculations and number system conversions.

### Functions in this category:

#### BIN2DEC

**Converts a binary number to decimal**

- **Syntax:** `BIN2DEC(number)`
- **Examples:** `BIN2DEC(1010)`

#### BIN2HEX

**Converts a binary number to hexadecimal**

- **Syntax:** `BIN2HEX(number, [places])`
- **Examples:** `BIN2HEX(11111011)`, `BIN2HEX(11111011, 4)`

#### BIN2OCT

**Converts a binary number to octal**

- **Syntax:** `BIN2OCT(number, [places])`
- **Examples:** `BIN2OCT(1001)`, `BIN2OCT(1001, 3)`

#### BITAND

**Returns a bitwise AND of two numbers**

- **Syntax:** `BITAND(number1, number2)`
- **Examples:** `BITAND(13, 25)`

#### BITLSHIFT

**Returns a number shifted left by specified number of bits**

- **Syntax:** `BITLSHIFT(number, shift_amount)`
- **Examples:** `BITLSHIFT(4, 2)`

#### BITOR

**Returns a bitwise OR of two numbers**

- **Syntax:** `BITOR(number1, number2)`
- **Examples:** `BITOR(13, 25)`

#### BITRSHIFT

**Returns a number shifted right by specified number of bits**

- **Syntax:** `BITRSHIFT(number, shift_amount)`
- **Examples:** `BITRSHIFT(16, 2)`

#### BITXOR

**Returns a bitwise XOR of two numbers**

- **Syntax:** `BITXOR(number1, number2)`
- **Examples:** `BITXOR(13, 25)`

#### COMPLEX

**Converts real and imaginary coefficients into a complex number**

- **Syntax:** `COMPLEX(real_num, i_num, [suffix])`
- **Examples:** `COMPLEX(3, 4, "j")`

#### CONVERT

**Converts a number from one measurement system to another**

- **Syntax:** `CONVERT(number, from_unit, to_unit)`
- **Examples:** `CONVERT(1, "m", "ft")`, `CONVERT(32, "F", "C")`

#### DEC2BIN

**Converts a decimal number to binary**

- **Syntax:** `DEC2BIN(number, [places])`
- **Examples:** `DEC2BIN(10)`, `DEC2BIN(10, 8)`

#### DEC2HEX

**Converts a decimal number to hexadecimal**

- **Syntax:** `DEC2HEX(number, [places])`
- **Examples:** `DEC2HEX(255)`, `DEC2HEX(255, 4)`

#### DEC2OCT

**Converts a decimal number to octal**

- **Syntax:** `DEC2OCT(number, [places])`
- **Examples:** `DEC2OCT(64)`, `DEC2OCT(64, 3)`

#### DELTA

**Tests whether two values are equal. Returns 1 if they are equal; returns 0 otherwise**

- **Syntax:** `DELTA(number1, [number2])`
- **Examples:** `DELTA(5, 4)`, `DELTA(5, 5)`

#### ERF

**Returns the error function**

- **Syntax:** `ERF(lower_limit, [upper_limit])`
- **Examples:** `ERF(1)`, `ERF(0, 1)`

#### ERFC

**Returns the complementary error function**

- **Syntax:** `ERFC(x)`
- **Examples:** `ERFC(1)`, `ERFC(0.5)`

#### GESTEP

**Returns 1 if number ≥ step; returns 0 otherwise**

- **Syntax:** `GESTEP(number, [step])`
- **Examples:** `GESTEP(5, 4)`, `GESTEP(5, 5)`, `GESTEP(-4, -5)`

#### HEX2BIN

**Converts a hexadecimal number to binary**

- **Syntax:** `HEX2BIN(number, [places])`
- **Examples:** `HEX2BIN("F")`, `HEX2BIN("F", 8)`

#### HEX2DEC

**Converts a hexadecimal number to decimal**

- **Syntax:** `HEX2DEC(number)`
- **Examples:** `HEX2DEC("FF")`

#### HEX2OCT

**Converts a hexadecimal number to octal**

- **Syntax:** `HEX2OCT(number, [places])`
- **Examples:** `HEX2OCT("F")`, `HEX2OCT("F", 3)`

#### IMABS

**Returns the absolute value (modulus) of a complex number**

- **Syntax:** `IMABS(inumber)`
- **Examples:** `IMABS("5+12i")`, `IMABS("3-4i")`

#### IMAGINARY

**Returns the imaginary coefficient of a complex number**

- **Syntax:** `IMAGINARY(inumber)`
- **Examples:** `IMAGINARY("6+9i")`, `IMAGINARY("2-i")`

#### IMREAL

**Returns the real coefficient of a complex number**

- **Syntax:** `IMREAL(inumber)`
- **Examples:** `IMREAL("6+9i")`, `IMREAL("2-i")`

#### OCT2BIN

**Converts an octal number to binary**

- **Syntax:** `OCT2BIN(number, [places])`
- **Examples:** `OCT2BIN(7)`, `OCT2BIN(7, 3)`

#### OCT2DEC

**Converts an octal number to decimal**

- **Syntax:** `OCT2DEC(number)`
- **Examples:** `OCT2DEC(77)`

#### OCT2HEX

**Converts an octal number to hexadecimal**

- **Syntax:** `OCT2HEX(number, [places])`
- **Examples:** `OCT2HEX(100)`, `OCT2HEX(100, 4)`



---

## Financial

Functions for financial calculations including loans, investments, and cash flows.

### Functions in this category:

#### CUMIPMT

**Returns the cumulative interest paid between two periods**

- **Syntax:** `CUMIPMT(rate, nper, pv, start_period, end_period, type)`
- **Examples:** `CUMIPMT(0.09/12, 30*12, 125000, 13, 24, 0)`

#### CUMPRINC

**Returns the cumulative principal paid on a loan between two periods**

- **Syntax:** `CUMPRINC(rate, nper, pv, start_period, end_period, type)`
- **Examples:** `CUMPRINC(0.09/12, 30*12, 125000, 13, 24, 0)`

#### DB

**Returns the depreciation of an asset for a specified period by using the fixed-declining balance method**

- **Syntax:** `DB(cost, salvage, life, period, [month])`
- **Examples:** `DB(1000000, 100000, 6, 1, 7)`

#### DDB

**Returns the depreciation of an asset for a specified period by using the double-declining balance method or some other method that you specify**

- **Syntax:** `DDB(cost, salvage, life, period, [factor])`
- **Examples:** `DDB(2400, 300, 10, 1, 2)`

#### DOLLARDE

**Converts a dollar price, expressed as a fraction, into a dollar price, expressed as a decimal number**

- **Syntax:** `DOLLARDE(fractional_dollar, fraction)`
- **Examples:** `DOLLARDE(1.02, 16)`

#### DOLLARFR

**Converts a dollar price, expressed as a decimal number, into a dollar price, expressed as a fraction**

- **Syntax:** `DOLLARFR(decimal_dollar, fraction)`
- **Examples:** `DOLLARFR(1.125, 16)`

#### EFFECT

**Returns the effective annual interest rate**

- **Syntax:** `EFFECT(nominal_rate, npery)`
- **Examples:** `EFFECT(0.0525, 4)`

#### FV

**Returns the future value of an investment**

- **Syntax:** `FV(rate, nper, pmt, [pv], [type])`
- **Examples:** `FV(0.06/12, 10*12, -200, -500, 1)`

#### FVSCHEDULE

**Returns the future value of an initial principal after applying a series of compound interest rates**

- **Syntax:** `FVSCHEDULE(principal, schedule)`
- **Examples:** `FVSCHEDULE(1, {0.09, 0.11, 0.1})`

#### IPMT

**Returns the interest payment for an investment for a given period**

- **Syntax:** `IPMT(rate, per, nper, pv, [fv], [type])`
- **Examples:** `IPMT(0.1/12, 1, 3*12, 8000)`

#### IRR

**Returns the internal rate of return for a series of cash flows**

- **Syntax:** `IRR(values, [guess])`
- **Examples:** `IRR(A1:A5)`, `IRR({-10000,2000,4000,8000})`

#### ISPMT

**Calculates the interest paid during a specific period of an investment**

- **Syntax:** `ISPMT(rate, per, nper, pv)`
- **Examples:** `ISPMT(0.1/12, 1, 3*12, 8000)`

#### MIRR

**Returns the internal rate of return where positive and negative cash flows are financed at different rates**

- **Syntax:** `MIRR(values, finance_rate, reinvest_rate)`
- **Examples:** `MIRR({-120000,39000,30000,21000,37000,46000}, 0.1, 0.12)`

#### NOMINAL

**Returns the annual nominal interest rate**

- **Syntax:** `NOMINAL(effect_rate, npery)`
- **Examples:** `NOMINAL(0.053543, 4)`

#### NPER

**Returns the number of periods for an investment**

- **Syntax:** `NPER(rate, pmt, pv, [fv], [type])`
- **Examples:** `NPER(0.12/12, -100, -1000, 10000, 1)`

#### NPV

**Returns the net present value of an investment**

- **Syntax:** `NPV(rate, value1, [value2], ...)`
- **Examples:** `NPV(0.1, -10000, 3000, 4200, 6800)`

#### PDURATION

**Returns the number of periods required by an investment to reach a specified value**

- **Syntax:** `PDURATION(rate, pv, fv)`
- **Examples:** `PDURATION(0.025, 2000, 2200)`

#### PMT

**Returns the periodic payment for an annuity**

- **Syntax:** `PMT(rate, nper, pv, [fv], [type])`
- **Examples:** `PMT(0.08/12, 10*12, 10000)`

#### PPMT

**Returns the payment on the principal for an investment for a given period**

- **Syntax:** `PPMT(rate, per, nper, pv, [fv], [type])`
- **Examples:** `PPMT(0.1/12, 1, 3*12, 8000)`

#### PV

**Returns the present value of an investment**

- **Syntax:** `PV(rate, nper, pmt, [fv], [type])`
- **Examples:** `PV(0.08/12, 10*12, -100, 0, 0)`

#### RATE

**Returns the interest rate per period of an annuity**

- **Syntax:** `RATE(nper, pmt, pv, [fv], [type], [guess])`
- **Examples:** `RATE(4*12, -200, 8000)`

#### RRI

**Returns an equivalent interest rate for the growth of an investment**

- **Syntax:** `RRI(nper, pv, fv)`
- **Examples:** `RRI(96, -10000, 11000)`

#### SLN

**Returns the straight-line depreciation of an asset for one period**

- **Syntax:** `SLN(cost, salvage, life)`
- **Examples:** `SLN(30000, 7500, 10)`

#### SYD

**Returns the sum-of-years' digits depreciation of an asset for a specified period**

- **Syntax:** `SYD(cost, salvage, life, per)`
- **Examples:** `SYD(30000, 7500, 10, 1)`

#### XIRR

**Returns the internal rate of return for a schedule of cash flows that is not necessarily periodic**

- **Syntax:** `XIRR(values, dates, [guess])`
- **Examples:** `XIRR({-10000, 2750, 4250, 3250, 2750}, {"1/1/2008", "3/1/2008", "10/30/2008", "2/15/2009", "4/1/2009"})`

#### XNPV

**Returns the net present value for a schedule of cash flows that is not necessarily periodic**

- **Syntax:** `XNPV(rate, values, dates)`
- **Examples:** `XNPV(0.09, {-10000, 2750, 4250, 3250, 2750}, {"1/1/2008", "3/1/2008", "10/30/2008", "2/15/2009", "4/1/2009"})`



---

## Information

Functions for testing cell contents and retrieving information about data types.

### Functions in this category:

#### CELL

**Returns information about the formatting, location, or contents of a cell**

- **Syntax:** `CELL(info_type, [reference])`
- **Examples:** `CELL("address", A1)`, `CELL("row", A1)`, `CELL("col", A1)`

#### ERROR.TYPE

**Returns a number corresponding to an error type**

- **Syntax:** `ERROR.TYPE(error_val)`
- **Examples:** `ERROR.TYPE(#DIV/0!)`

#### INFO

**Returns information about the current operating environment**

- **Syntax:** `INFO(type_text)`
- **Examples:** `INFO("system")`, `INFO("release")`

#### ISBLANK

**Returns TRUE if the value is blank**

- **Syntax:** `ISBLANK(value)`
- **Examples:** `ISBLANK(A1)`

#### ISERR

**Returns TRUE if the value is any error value except #N/A**

- **Syntax:** `ISERR(value)`
- **Examples:** `ISERR(A1/0)`, `ISERR(#VALUE!)`

#### ISERROR

**Returns TRUE if the value is an error**

- **Syntax:** `ISERROR(value)`
- **Examples:** `ISERROR(A1/0)`

#### ISEVEN

**Returns TRUE if the number is even**

- **Syntax:** `ISEVEN(number)`
- **Examples:** `ISEVEN(4)`

#### ISFORMULA

**Returns TRUE if there is a reference to a cell that contains a formula**

- **Syntax:** `ISFORMULA(reference)`
- **Examples:** `ISFORMULA(A1)`

#### ISLOGICAL

**Returns TRUE if the value is a logical value**

- **Syntax:** `ISLOGICAL(value)`
- **Examples:** `ISLOGICAL(TRUE)`

#### ISNA

**Returns TRUE if the value is #N/A**

- **Syntax:** `ISNA(value)`
- **Examples:** `ISNA(#N/A)`

#### ISNONTEXT

**Returns TRUE if the value is not text**

- **Syntax:** `ISNONTEXT(value)`
- **Examples:** `ISNONTEXT(123)`

#### ISNUMBER

**Returns TRUE if the value is a number**

- **Syntax:** `ISNUMBER(value)`
- **Examples:** `ISNUMBER(123)`

#### ISODD

**Returns TRUE if the number is odd**

- **Syntax:** `ISODD(number)`
- **Examples:** `ISODD(3)`

#### ISOMITTED

**Checks whether the value in a LAMBDA is missing and returns TRUE or FALSE**

- **Syntax:** `ISOMITTED(argument)`
- **Examples:** `ISOMITTED(value)`

#### ISREF

**Returns TRUE if the value is a reference**

- **Syntax:** `ISREF(value)`
- **Examples:** `ISREF(A1)`, `ISREF(A1:B10)`

#### ISTEXT

**Returns TRUE if the value is text**

- **Syntax:** `ISTEXT(value)`
- **Examples:** `ISTEXT("Hello")`

#### N

**Returns a value converted to a number**

- **Syntax:** `N(value)`
- **Examples:** `N("123")`

#### NA

**Returns the error value #N/A**

- **Syntax:** `NA()`
- **Examples:** `NA()`

#### SHEET

**Returns the sheet number of the referenced sheet**

- **Syntax:** `SHEET([value])`
- **Examples:** `SHEET()`, `SHEET(A1)`

#### SHEETS

**Returns the number of sheets in a reference**

- **Syntax:** `SHEETS([reference])`
- **Examples:** `SHEETS()`, `SHEETS(A1:B10)`

#### STOCKHISTORY

**Retrieves historical data about a financial instrument**

- **Syntax:** `STOCKHISTORY(stock, [start_date], [end_date], [interval], [headers], [properties])`
- **Examples:** `STOCKHISTORY("MSFT")`

#### TYPE

**Returns a number indicating the data type of a value**

- **Syntax:** `TYPE(value)`
- **Examples:** `TYPE("text")`



---

## Legacy

Compatibility functions maintained for backward compatibility.

### Functions in this category:

#### BETADIST

**[Legacy] Returns the beta cumulative distribution function**

- **Syntax:** `BETADIST(x, alpha, beta, [A], [B])`
- **Examples:** `BETADIST(2, 8, 10, 1, 3)`

#### BINOMDIST

**[Legacy] Returns the individual term binomial distribution probability**

- **Syntax:** `BINOMDIST(number_s, trials, probability_s, cumulative)`
- **Examples:** `BINOMDIST(6, 10, 0.5, FALSE)`

#### CHIDIST

**[Legacy] Returns the one-tailed probability of the chi-squared distribution**

- **Syntax:** `CHIDIST(x, degrees_freedom)`
- **Examples:** `CHIDIST(18.307, 10)`

#### CRITBINOM

**[Legacy] Returns the smallest value for which the cumulative binomial distribution is less than or equal to a criterion value**

- **Syntax:** `CRITBINOM(trials, probability_s, alpha)`
- **Examples:** `CRITBINOM(6, 0.5, 0.75)`

#### EXPONDIST

**[Legacy] Returns the exponential distribution**

- **Syntax:** `EXPONDIST(x, lambda, cumulative)`
- **Examples:** `EXPONDIST(0.2, 10, TRUE)`

#### NORMDIST

**[Legacy] Returns the normal cumulative distribution**

- **Syntax:** `NORMDIST(x, mean, standard_dev, cumulative)`
- **Examples:** `NORMDIST(42, 40, 1.5, TRUE)`

#### NORMINV

**[Legacy] Returns the inverse of the normal cumulative distribution**

- **Syntax:** `NORMINV(probability, mean, standard_dev)`
- **Examples:** `NORMINV(0.908789, 40, 1.5)`

#### NORMSDIST

**[Legacy] Returns the standard normal cumulative distribution**

- **Syntax:** `NORMSDIST(z)`
- **Examples:** `NORMSDIST(1.333333)`

#### NORMSINV

**[Legacy] Returns the inverse of the standard normal cumulative distribution**

- **Syntax:** `NORMSINV(probability)`
- **Examples:** `NORMSINV(0.908789)`

#### POISSON

**[Legacy] Returns the Poisson distribution**

- **Syntax:** `POISSON(x, mean, cumulative)`
- **Examples:** `POISSON(2, 5, TRUE)`

#### TTEST

**[Legacy] Returns the probability associated with a Student's t-test**

- **Syntax:** `TTEST(array1, array2, tails, type)`
- **Examples:** `TTEST(A1:A10, B1:B10, 2, 1)`

#### WEIBULL

**[Legacy] Returns the Weibull distribution**

- **Syntax:** `WEIBULL(x, alpha, beta, cumulative)`
- **Examples:** `WEIBULL(105, 20, 100, TRUE)`

#### ZTEST

**[Legacy] Returns the one-tailed probability-value of a z-test**

- **Syntax:** `ZTEST(array, x, [sigma])`
- **Examples:** `ZTEST(A1:A10, 4)`, `ZTEST(A1:A10, 4, 1)`



---

## Logical

Functions for logical operations and conditional testing.

### Functions in this category:

#### AND

**Returns TRUE if all conditions are TRUE**

- **Syntax:** `AND(logical1, [logical2], ...)`
- **Examples:** `AND(A1>5, B1<10)`, `AND(TRUE, TRUE, FALSE)`

#### BYCOL

**Applies a LAMBDA to each column and returns an array of the results**

- **Syntax:** `BYCOL(array, lambda)`
- **Examples:** `BYCOL(A1:C3, LAMBDA(col, SUM(col)))`

#### BYROW

**Applies a LAMBDA to each row and returns an array of the results**

- **Syntax:** `BYROW(array, lambda)`
- **Examples:** `BYROW(A1:C3, LAMBDA(row, SUM(row)))`

#### FALSE

**Returns the logical value FALSE**

- **Syntax:** `FALSE()`
- **Examples:** `FALSE()`, `IF(FALSE(), 1, 0)`

#### IF

**Returns one value if a condition is true and another value if it's false**

- **Syntax:** `IF(condition, value_if_true, [value_if_false])`
- **Examples:** `IF(A1>10, "High", "Low")`

#### IFERROR

**Returns a value you specify if a formula evaluates to an error**

- **Syntax:** `IFERROR(value, value_if_error)`
- **Examples:** `IFERROR(A1/B1, "Division by zero")`

#### IFNA

**Returns a value you specify if the expression resolves to #N/A**

- **Syntax:** `IFNA(value, value_if_na)`
- **Examples:** `IFNA(VLOOKUP(A1, B:C, 2, FALSE), "Not found")`

#### IFS

**Checks whether one or more conditions are met and returns a value that corresponds to the first TRUE condition**

- **Syntax:** `IFS(condition1, value1, [condition2, value2], ...)`
- **Examples:** `IFS(A1>90, "A", A1>80, "B", A1>70, "C", TRUE(), "F")`

#### LAMBDA

**Create custom, reusable functions and call them by a friendly name**

- **Syntax:** `LAMBDA(parameter1, [parameter2, ...], calculation)`
- **Examples:** `LAMBDA(x, y, x*y)`, `LAMBDA(x, x^2 + 2*x + 1)`

#### LET

**Assigns names to calculation results**

- **Syntax:** `LET(name1, value1, [name2, value2, ...], calculation)`
- **Examples:** `LET(x, A1*2, y, B1*3, x+y)`

#### MAKEARRAY

**Returns a calculated array of a specified row and column size, by applying a LAMBDA**

- **Syntax:** `MAKEARRAY(rows, cols, lambda)`
- **Examples:** `MAKEARRAY(3, 3, LAMBDA(r,c,r*c))`

#### MAP

**Returns an array formed by mapping each value in the array(s) to a new value by applying a LAMBDA**

- **Syntax:** `MAP(array1, [array2, ...], lambda)`
- **Examples:** `MAP(A1:A5, LAMBDA(x, x*2))`

#### NOT

**Reverses the logic of its argument**

- **Syntax:** `NOT(logical)`
- **Examples:** `NOT(TRUE)`, `NOT(A1>5)`

#### OR

**Returns TRUE if any condition is TRUE**

- **Syntax:** `OR(logical1, [logical2], ...)`
- **Examples:** `OR(A1>5, B1<10)`, `OR(FALSE, FALSE, TRUE)`

#### REDUCE

**Reduces an array to an accumulated value by applying a LAMBDA to each value and returning the total value in the accumulator**

- **Syntax:** `REDUCE(initial_value, array, lambda)`
- **Examples:** `REDUCE(0, A1:A5, LAMBDA(acc, val, acc + val))`

#### SCAN

**Scans an array by applying a LAMBDA to each value and returns an array that has each intermediate value**

- **Syntax:** `SCAN(initial_value, array, lambda)`
- **Examples:** `SCAN(0, A1:A5, LAMBDA(acc, val, acc + val))`

#### SWITCH

**Evaluates an expression and returns the corresponding value**

- **Syntax:** `SWITCH(expression, value1, result1, [value2, result2], ..., [default])`
- **Examples:** `SWITCH(A1, 1, "One", 2, "Two", 3, "Three", "Other")`

#### TRUE

**Returns the logical value TRUE**

- **Syntax:** `TRUE()`
- **Examples:** `TRUE()`, `IF(TRUE(), 1, 0)`

#### XOR

**Returns TRUE if an odd number of conditions are TRUE**

- **Syntax:** `XOR(logical1, [logical2], ...)`
- **Examples:** `XOR(TRUE, FALSE)`, `XOR(A1>5, B1<10, C1=0)`



---

## Lookup & Reference

Functions for searching and referencing data within tables and ranges.

### Functions in this category:

#### FILTER

**Filters a range of data based on criteria you define**

- **Syntax:** `FILTER(array, include, [if_empty])`
- **Examples:** `FILTER(A2:A10, B2:B10>10, "No matches")`

#### HLOOKUP

**Looks for a value in the top row of a table**

- **Syntax:** `HLOOKUP(lookup_value, table_array, row_index, [range_lookup])`
- **Examples:** `HLOOKUP(A2, A1:F10, 3, FALSE)`

#### INDEX

**Returns the value of an element in a table or array, selected by row and column number**

- **Syntax:** `INDEX(array, row, [column])`
- **Examples:** `INDEX(A1:C10, 3, 2)`, `INDEX(A1:A10, 5)`

#### INDIRECT

**Returns the value specified by a text string representing a cell reference**

- **Syntax:** `INDIRECT(ref_text)`
- **Examples:** `INDIRECT("A1")`, `INDIRECT("B"&ROW())`

#### MATCH

**Returns the relative position of an item in an array**

- **Syntax:** `MATCH(lookup_value, lookup_array, [match_type])`
- **Examples:** `MATCH(40, B2:B10, 0)`, `MATCH(A1, 1:1, 0)`

#### OFFSET

**Returns a reference offset from a given reference by a specified number of rows and columns**

- **Syntax:** `OFFSET(reference, rows, cols, [height], [width])`
- **Examples:** `OFFSET(A1, 2, 3)`, `OFFSET(B5, -1, 1)`

#### UNIQUE

**Returns a list of unique values in a list or range**

- **Syntax:** `UNIQUE(array)`
- **Examples:** `UNIQUE(A2:A10)`

#### VLOOKUP

**Looks for a value in the leftmost column of a table**

- **Syntax:** `VLOOKUP(lookup_value, table_array, col_index, [range_lookup])`
- **Examples:** `VLOOKUP(A2, D2:F100, 3, FALSE)`

#### XLOOKUP

**Searches a range and returns an item corresponding to the first match**

- **Syntax:** `XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode], [search_mode])`
- **Examples:** `XLOOKUP("Apple", A2:A10, B2:B10, "Not Found")`



---

## Math & Trigonometry

Mathematical and trigonometric functions for calculations and analysis.

### Functions in this category:

#### ABS

**Returns the absolute value of a number**

- **Syntax:** `ABS(number)`
- **Examples:** `ABS(-5)`, `ABS(A1)`

#### ACOS

**Returns the arccosine of a number**

- **Syntax:** `ACOS(number)`
- **Examples:** `ACOS(0.5)`, `ACOS(-1)`

#### ACOSH

**Returns the inverse hyperbolic cosine of a number**

- **Syntax:** `ACOSH(number)`
- **Examples:** `ACOSH(1)`, `ACOSH(2)`

#### ASIN

**Returns the arcsine of a number**

- **Syntax:** `ASIN(number)`
- **Examples:** `ASIN(0.5)`, `ASIN(1)`

#### ASINH

**Returns the inverse hyperbolic sine of a number**

- **Syntax:** `ASINH(number)`
- **Examples:** `ASINH(1)`, `ASINH(0)`

#### ATAN

**Returns the arctangent of a number**

- **Syntax:** `ATAN(number)`
- **Examples:** `ATAN(1)`, `ATAN(0)`

#### ATAN2

**Returns the arctangent from x- and y-coordinates**

- **Syntax:** `ATAN2(x_num, y_num)`
- **Examples:** `ATAN2(1, 1)`, `ATAN2(4, 3)`

#### ATANH

**Returns the inverse hyperbolic tangent of a number**

- **Syntax:** `ATANH(number)`
- **Examples:** `ATANH(0.5)`, `ATANH(-0.5)`

#### CEILING

**Rounds a number up to the nearest integer or multiple of significance**

- **Syntax:** `CEILING(number, [significance])`
- **Examples:** `CEILING(3.2)`, `CEILING(4.3, 0.5)`

#### COMBIN

**Returns the number of combinations for a given number of objects**

- **Syntax:** `COMBIN(number, number_chosen)`
- **Examples:** `COMBIN(8, 3)`, `COMBIN(10, 2)`

#### COS

**Returns the cosine of an angle**

- **Syntax:** `COS(number)`
- **Examples:** `COS(0)`, `COS(RADIANS(90))`

#### COSH

**Returns the hyperbolic cosine of a number**

- **Syntax:** `COSH(number)`
- **Examples:** `COSH(0)`, `COSH(1)`

#### DEGREES

**Converts radians to degrees**

- **Syntax:** `DEGREES(angle)`
- **Examples:** `DEGREES(PI())`, `DEGREES(PI()/2)`

#### EVEN

**Rounds a number up to the nearest even integer**

- **Syntax:** `EVEN(number)`
- **Examples:** `EVEN(3)`, `EVEN(-2.5)`

#### EXP

**Returns e raised to the power of a given number**

- **Syntax:** `EXP(number)`
- **Examples:** `EXP(1)`, `EXP(2)`

#### FACT

**Returns the factorial of a number**

- **Syntax:** `FACT(number)`
- **Examples:** `FACT(5)`, `FACT(0)`

#### FLOOR

**Rounds a number down to the nearest integer or multiple of significance**

- **Syntax:** `FLOOR(number, [significance])`
- **Examples:** `FLOOR(3.8)`, `FLOOR(4.7, 0.5)`

#### GCD

**Returns the greatest common divisor**

- **Syntax:** `GCD(number1, [number2], ...)`
- **Examples:** `GCD(24, 36)`, `GCD(12, 18, 24)`

#### INT

**Rounds a number down to the nearest integer**

- **Syntax:** `INT(number)`
- **Examples:** `INT(3.7)`, `INT(-3.7)`

#### LCM

**Returns the least common multiple**

- **Syntax:** `LCM(number1, [number2], ...)`
- **Examples:** `LCM(6, 8)`, `LCM(12, 18, 24)`

#### LN

**Returns the natural logarithm of a number**

- **Syntax:** `LN(number)`
- **Examples:** `LN(EXP(1))`, `LN(10)`

#### LOG

**Returns the logarithm of a number to a specified base**

- **Syntax:** `LOG(number, [base])`
- **Examples:** `LOG(100)`, `LOG(8, 2)`

#### LOG10

**Returns the base-10 logarithm of a number**

- **Syntax:** `LOG10(number)`
- **Examples:** `LOG10(100)`, `LOG10(10)`

#### MOD

**Returns the remainder from division**

- **Syntax:** `MOD(number, divisor)`
- **Examples:** `MOD(10, 3)`, `MOD(A1, B1)`

#### MROUND

**Returns a number rounded to the desired multiple**

- **Syntax:** `MROUND(number, multiple)`
- **Examples:** `MROUND(10, 3)`, `MROUND(1.3, 0.2)`

#### ODD

**Rounds a number up to the nearest odd integer**

- **Syntax:** `ODD(number)`
- **Examples:** `ODD(2)`, `ODD(-2.5)`

#### PI

**Returns the value of pi**

- **Syntax:** `PI()`
- **Examples:** `PI()`, `2*PI()`

#### POWER

**Returns the result of a number raised to a power**

- **Syntax:** `POWER(number, power)`
- **Examples:** `POWER(2, 3)`, `POWER(A1, 2)`

#### PRODUCT

**Multiplies all the numbers given as arguments**

- **Syntax:** `PRODUCT(number1, [number2], ...)`
- **Examples:** `PRODUCT(A1:A10)`, `PRODUCT(2, 3, 4)`

#### QUOTIENT

**Returns the integer portion of a division**

- **Syntax:** `QUOTIENT(numerator, denominator)`
- **Examples:** `QUOTIENT(10, 3)`, `QUOTIENT(-10, 3)`

#### RADIANS

**Converts degrees to radians**

- **Syntax:** `RADIANS(angle)`
- **Examples:** `RADIANS(90)`, `RADIANS(180)`

#### RAND

**Returns a random number between 0 and 1**

- **Syntax:** `RAND()`
- **Examples:** `RAND()`, `RAND()*10`

#### RANDBETWEEN

**Returns a random number between the numbers you specify**

- **Syntax:** `RANDBETWEEN(bottom, top)`
- **Examples:** `RANDBETWEEN(1, 10)`, `RANDBETWEEN(-5, 5)`

#### ROUND

**Rounds a number to a specified number of digits**

- **Syntax:** `ROUND(number, [num_digits])`
- **Examples:** `ROUND(3.14159, 2)`, `ROUND(A1, 0)`

#### ROUNDDOWN

**Rounds a number down, toward zero**

- **Syntax:** `ROUNDDOWN(number, [num_digits])`
- **Examples:** `ROUNDDOWN(3.14159, 2)`, `ROUNDDOWN(-3.14, 1)`

#### ROUNDUP

**Rounds a number up, away from zero**

- **Syntax:** `ROUNDUP(number, [num_digits])`
- **Examples:** `ROUNDUP(3.14159, 2)`, `ROUNDUP(-3.14, 1)`

#### SIGN

**Returns the sign of a number**

- **Syntax:** `SIGN(number)`
- **Examples:** `SIGN(10)`, `SIGN(-5)`, `SIGN(0)`

#### SIN

**Returns the sine of an angle**

- **Syntax:** `SIN(number)`
- **Examples:** `SIN(PI()/2)`, `SIN(RADIANS(90))`

#### SINH

**Returns the hyperbolic sine of a number**

- **Syntax:** `SINH(number)`
- **Examples:** `SINH(1)`, `SINH(0)`

#### SQRT

**Returns the square root of a number**

- **Syntax:** `SQRT(number)`
- **Examples:** `SQRT(16)`, `SQRT(A1)`

#### SQRTPI

**Returns the square root of (number * pi)**

- **Syntax:** `SQRTPI(number)`
- **Examples:** `SQRTPI(1)`, `SQRTPI(4)`

#### SUM

**Adds all numbers in a range of cells**

- **Syntax:** `SUM(number1, [number2], ...)`
- **Examples:** `SUM(A1:A10)`, `SUM(5, 10, 15)`

#### SUMIF

**Adds the cells specified by a given criteria**

- **Syntax:** `SUMIF(range, criteria, [sum_range])`
- **Examples:** `SUMIF(A1:A10, ">5")`, `SUMIF(A1:A10, "Apple", B1:B10)`

#### SUMIFS

**Adds the cells in a range that meet multiple criteria**

- **Syntax:** `SUMIFS(sum_range, criteria_range1, criteria1, [criteria_range2, criteria2], ...)`
- **Examples:** `SUMIFS(D2:D10, A2:A10, "Product", B2:B10, ">10")`

#### SUMPRODUCT

**Returns the sum of the products of corresponding array components**

- **Syntax:** `SUMPRODUCT(array1, [array2], [array3], ...)`
- **Examples:** `SUMPRODUCT(A1:A3, B1:B3)`, `SUMPRODUCT({1,2,3}, {4,5,6})`

#### SUMSQ

**Returns the sum of the squares of the arguments**

- **Syntax:** `SUMSQ(number1, [number2], ...)`
- **Examples:** `SUMSQ(A1:A10)`, `SUMSQ(3, 4, 5)`

#### TAN

**Returns the tangent of an angle**

- **Syntax:** `TAN(number)`
- **Examples:** `TAN(PI()/4)`, `TAN(RADIANS(45))`

#### TANH

**Returns the hyperbolic tangent of a number**

- **Syntax:** `TANH(number)`
- **Examples:** `TANH(0)`, `TANH(1)`

#### TRUNC

**Truncates a number to an integer**

- **Syntax:** `TRUNC(number, [num_digits])`
- **Examples:** `TRUNC(3.14159, 2)`, `TRUNC(-3.14)`



---

## Statistical

Functions for statistical analysis and probability calculations.

### Functions in this category:

#### AVEDEV

**Returns the average of the absolute deviations of data points from their mean**

- **Syntax:** `AVEDEV(number1, [number2], ...)`
- **Examples:** `AVEDEV(A1:A10)`

#### AVERAGE

**Calculates the average of numbers**

- **Syntax:** `AVERAGE(number1, [number2], ...)`
- **Examples:** `AVERAGE(B2:B20)`

#### AVERAGEA

**Returns the average of its arguments, including numbers, text, and logical values**

- **Syntax:** `AVERAGEA(value1, [value2], ...)`
- **Examples:** `AVERAGEA(A1:A10)`

#### AVERAGEIF

**Returns the average (arithmetic mean) of all the cells in a range that meet a given criteria**

- **Syntax:** `AVERAGEIF(range, criteria, [average_range])`
- **Examples:** `AVERAGEIF(A2:A10, ">5")`

#### AVERAGEIFS

**Returns the average (arithmetic mean) of all cells that meet multiple criteria**

- **Syntax:** `AVERAGEIFS(average_range, criteria_range1, criteria1, [criteria_range2, criteria2], ...)`
- **Examples:** `AVERAGEIFS(B2:B10, A2:A10, "Product", C2:C10, ">10")`

#### CONFIDENCE

**[Legacy] Returns the confidence interval for a population mean**

- **Syntax:** `CONFIDENCE(alpha, standard_dev, size)`
- **Examples:** `CONFIDENCE(0.05, 2.5, 50)`

#### CORREL

**Returns the correlation coefficient between two data sets**

- **Syntax:** `CORREL(array1, array2)`
- **Examples:** `CORREL(A1:A10, B1:B10)`

#### COUNT

**Counts the number of cells that contain numbers**

- **Syntax:** `COUNT(value1, [value2], ...)`
- **Examples:** `COUNT(E5:E25)`

#### COUNTA

**Counts the number of cells that are not empty**

- **Syntax:** `COUNTA(value1, [value2], ...)`
- **Examples:** `COUNTA(A1:A10)`

#### COUNTBLANK

**Counts empty cells in a range**

- **Syntax:** `COUNTBLANK(range)`
- **Examples:** `COUNTBLANK(A1:A10)`

#### COUNTIF

**Counts the number of cells within a range that meet the given criteria**

- **Syntax:** `COUNTIF(range, criteria)`
- **Examples:** `COUNTIF(A2:A10, ">5")`

#### COUNTIFS

**Counts the number of cells within a range that meet multiple criteria**

- **Syntax:** `COUNTIFS(criteria_range1, criteria1, [criteria_range2, criteria2], ...)`
- **Examples:** `COUNTIFS(A2:A10, "Product", B2:B10, ">10")`

#### COVAR

**[Legacy] Returns covariance, the average of the products of paired deviations**

- **Syntax:** `COVAR(array1, array2)`
- **Examples:** `COVAR(A1:A10, B1:B10)`

#### DEVSQ

**Returns the sum of squares of deviations**

- **Syntax:** `DEVSQ(number1, [number2], ...)`
- **Examples:** `DEVSQ(A1:A10)`

#### FORECAST

**[Legacy] Calculates, or predicts, a future value by using existing values**

- **Syntax:** `FORECAST(x, known_y_s, known_x_s)`
- **Examples:** `FORECAST(30, A1:A10, B1:B10)`

#### GEOMEAN

**Returns the geometric mean**

- **Syntax:** `GEOMEAN(number1, [number2], ...)`
- **Examples:** `GEOMEAN(A1:A10)`

#### HARMEAN

**Returns the harmonic mean**

- **Syntax:** `HARMEAN(number1, [number2], ...)`
- **Examples:** `HARMEAN(A1:A10)`

#### KURT

**Returns the kurtosis of a data set**

- **Syntax:** `KURT(number1, [number2], ...)`
- **Examples:** `KURT(A1:A10)`

#### LARGE

**Returns the k-th largest value in a data set**

- **Syntax:** `LARGE(array, k)`
- **Examples:** `LARGE(A1:A10, 2)`

#### MAX

**Returns the largest value in a set of values**

- **Syntax:** `MAX(number1, [number2], ...)`
- **Examples:** `MAX(C3:C15)`

#### MAXA

**Returns the maximum value in a list of arguments, including numbers, text, and logical values**

- **Syntax:** `MAXA(value1, [value2], ...)`
- **Examples:** `MAXA(A1:A10)`

#### MAXIFS

**Returns the maximum value among cells specified by a given set of conditions or criteria**

- **Syntax:** `MAXIFS(max_range, criteria_range1, criteria1, [criteria_range2, criteria2], ...)`
- **Examples:** `MAXIFS(B2:B10, A2:A10, "Product", C2:C10, ">10")`

#### MEDIAN

**Returns the median of the given numbers**

- **Syntax:** `MEDIAN(number1, [number2], ...)`
- **Examples:** `MEDIAN(A1:A10)`, `MEDIAN(1, 2, 3, 4, 5)`

#### MIN

**Returns the smallest value in a set of values**

- **Syntax:** `MIN(number1, [number2], ...)`
- **Examples:** `MIN(D4:D20)`

#### MINA

**Returns the smallest value in a list of arguments, including numbers, text, and logical values**

- **Syntax:** `MINA(value1, [value2], ...)`
- **Examples:** `MINA(A1:A10)`

#### MINIFS

**Returns the minimum value among cells specified by a given set of conditions or criteria**

- **Syntax:** `MINIFS(min_range, criteria_range1, criteria1, [criteria_range2, criteria2], ...)`
- **Examples:** `MINIFS(B2:B10, A2:A10, "Product", C2:C10, ">10")`

#### MODE

**Returns the most common value in a data set**

- **Syntax:** `MODE(number1, [number2], ...)`
- **Examples:** `MODE(A1:A10)`, `MODE(1, 2, 2, 3, 4)`

#### PEARSON

**Returns the Pearson product moment correlation coefficient**

- **Syntax:** `PEARSON(array1, array2)`
- **Examples:** `PEARSON(A1:A10, B1:B10)`

#### PERCENTILE

**[Legacy] Returns the k-th percentile of values in a range**

- **Syntax:** `PERCENTILE(array, k)`
- **Examples:** `PERCENTILE(A1:A10, 0.75)`

#### PERCENTILE.INC

**Returns the k-th percentile of values in a range**

- **Syntax:** `PERCENTILE.INC(array, k)`
- **Examples:** `PERCENTILE.INC(A1:A10, 0.75)`

#### PERCENTRANK

**[Legacy] Returns the percentage rank of a value in a data set**

- **Syntax:** `PERCENTRANK(array, x, [significance])`
- **Examples:** `PERCENTRANK(A1:A10, 2)`, `PERCENTRANK(A1:A10, 2, 4)`

#### QUARTILE

**[Legacy] Returns the quartile of a data set**

- **Syntax:** `QUARTILE(array, quart)`
- **Examples:** `QUARTILE(A1:A10, 1)`

#### QUARTILE.INC

**Returns the quartile of a data set**

- **Syntax:** `QUARTILE.INC(array, quart)`
- **Examples:** `QUARTILE.INC(A1:A10, 1)`

#### RANK

**Returns the rank of a number in a list of numbers**

- **Syntax:** `RANK(number, ref, [order])`
- **Examples:** `RANK(A2, A$1:A$10)`, `RANK(5, {1,2,3,4,5}, 1)`

#### RANK.AVG

**Returns the rank of a number in a list of numbers (average for ties)**

- **Syntax:** `RANK.AVG(number, ref, [order])`
- **Examples:** `RANK.AVG(A2, A$1:A$10)`, `RANK.AVG(5, {1,2,3,4,5}, 1)`

#### RANK.EQ

**Returns the rank of a number in a list of numbers**

- **Syntax:** `RANK.EQ(number, ref, [order])`
- **Examples:** `RANK.EQ(A2, A$1:A$10)`, `RANK.EQ(5, {1,2,3,4,5}, 1)`

#### RSQ

**Returns the square of the Pearson product moment correlation coefficient**

- **Syntax:** `RSQ(known_y_s, known_x_s)`
- **Examples:** `RSQ(A1:A10, B1:B10)`

#### SKEW

**Returns the skewness of a distribution**

- **Syntax:** `SKEW(number1, [number2], ...)`
- **Examples:** `SKEW(A1:A10)`

#### SMALL

**Returns the k-th smallest value in a data set**

- **Syntax:** `SMALL(array, k)`
- **Examples:** `SMALL(A1:A10, 2)`

#### STANDARDIZE

**Returns a normalized value**

- **Syntax:** `STANDARDIZE(x, mean, standard_dev)`
- **Examples:** `STANDARDIZE(42, 40, 1.5)`

#### STDEV

**Estimates standard deviation based on a sample**

- **Syntax:** `STDEV(number1, [number2], ...)`
- **Examples:** `STDEV(A1:A10)`

#### STDEV.P

**Calculates standard deviation based on the entire population**

- **Syntax:** `STDEV.P(number1, [number2], ...)`
- **Examples:** `STDEV.P(A1:A10)`

#### STDEV.S

**Estimates standard deviation based on a sample**

- **Syntax:** `STDEV.S(number1, [number2], ...)`
- **Examples:** `STDEV.S(A1:A10)`

#### STDEVP

**[Legacy] Calculates standard deviation based on the entire population**

- **Syntax:** `STDEVP(number1, [number2], ...)`
- **Examples:** `STDEVP(A1:A10)`

#### TRIMMEAN

**Returns the mean of the interior of a data set**

- **Syntax:** `TRIMMEAN(array, percent)`
- **Examples:** `TRIMMEAN(A1:A10, 0.2)`

#### VAR

**Estimates variance based on a sample**

- **Syntax:** `VAR(number1, [number2], ...)`
- **Examples:** `VAR(A1:A10)`

#### VAR.P

**Calculates variance based on the entire population**

- **Syntax:** `VAR.P(number1, [number2], ...)`
- **Examples:** `VAR.P(A1:A10)`

#### VAR.S

**Estimates variance based on a sample**

- **Syntax:** `VAR.S(number1, [number2], ...)`
- **Examples:** `VAR.S(A1:A10)`

#### VARP

**[Legacy] Calculates variance based on the entire population**

- **Syntax:** `VARP(number1, [number2], ...)`
- **Examples:** `VARP(A1:A10)`



---

## Text

Functions for text manipulation, formatting, and string operations.

### Functions in this category:

#### ARRAYTOTEXT

**Returns an array of text values from any specified range**

- **Syntax:** `ARRAYTOTEXT(array, [format])`
- **Examples:** `ARRAYTOTEXT({1,2,3})`

#### ASC

**Changes full-width (double-byte) English letters or katakana within a character string to half-width (single-byte) characters**

- **Syntax:** `ASC(text)`
- **Examples:** `ASC("Ａ")`

#### BAHTTEXT

**Converts a number to text, using the ß (baht) currency format**

- **Syntax:** `BAHTTEXT(number)`
- **Examples:** `BAHTTEXT(1234.56)`

#### CHAR

**Returns the character specified by the code number**

- **Syntax:** `CHAR(number)`
- **Examples:** `CHAR(65)`, `CHAR(97)`

#### CLEAN

**Removes all nonprintable characters from text**

- **Syntax:** `CLEAN(text)`
- **Examples:** `CLEAN("Hello\x07World")`

#### CODE

**Returns a numeric code for the first character in a text string**

- **Syntax:** `CODE(text)`
- **Examples:** `CODE("A")`, `CODE("a")`

#### CONCAT

**Combines text from multiple cells**

- **Syntax:** `CONCAT(text1, [text2], ...)`
- **Examples:** `CONCAT(A1, " ", B1)`

#### CONCATENATE

**Joins several text items into one text item**

- **Syntax:** `CONCATENATE(text1, [text2], ...)`
- **Examples:** `CONCATENATE("Hello", " ", "World")`

#### DBCS

**Changes half-width (single-byte) English letters or katakana within a character string to full-width (double-byte) characters**

- **Syntax:** `DBCS(text)`
- **Examples:** `DBCS("A")`

#### DETECTLANGUAGE

**Identifies the language of a specified text**

- **Syntax:** `DETECTLANGUAGE(text)`
- **Examples:** `DETECTLANGUAGE("Hello World")`

#### DOLLAR

**Converts a number to text, using the $ (dollar) currency format**

- **Syntax:** `DOLLAR(number, [decimals])`
- **Examples:** `DOLLAR(1234.567)`, `DOLLAR(-1234.567, 1)`

#### EXACT

**Checks to see if two text values are identical**

- **Syntax:** `EXACT(text1, text2)`
- **Examples:** `EXACT("Word", "word")`, `EXACT("Word", "Word")`

#### FIND

**Finds one text value within another (case-sensitive)**

- **Syntax:** `FIND(find_text, within_text, [start_num])`
- **Examples:** `FIND("World", "Hello World")`, `FIND("o", A1, 2)`

#### FINDB

**Finds one text value within another (case-sensitive, byte-based)**

- **Syntax:** `FINDB(find_text, within_text, [start_num])`
- **Examples:** `FINDB("World", "Hello World")`

#### FIXED

**Formats a number as text with a fixed number of decimals**

- **Syntax:** `FIXED(number, [decimals], [no_commas])`
- **Examples:** `FIXED(1234.567, 1)`, `FIXED(1234.567, 1, TRUE)`

#### LEFT

**Returns the leftmost characters from a text value**

- **Syntax:** `LEFT(text, [num_chars])`
- **Examples:** `LEFT("Hello", 3)`

#### LEFTB

**Returns the leftmost characters from a text value (byte-based)**

- **Syntax:** `LEFTB(text, [num_bytes])`
- **Examples:** `LEFTB("Hello", 3)`

#### LEN

**Returns the number of characters in a text string**

- **Syntax:** `LEN(text)`
- **Examples:** `LEN("Hello")`

#### LENB

**Returns the number of bytes in a text string**

- **Syntax:** `LENB(text)`
- **Examples:** `LENB("Hello")`

#### LOWER

**Converts text to lowercase**

- **Syntax:** `LOWER(text)`
- **Examples:** `LOWER("HELLO")`

#### MID

**Returns a specific number of characters from a text string**

- **Syntax:** `MID(text, start_num, num_chars)`
- **Examples:** `MID("Hello World", 7, 5)`

#### MIDB

**Returns a specific number of characters from a text string starting at the position you specify (byte-based)**

- **Syntax:** `MIDB(text, start_num, num_bytes)`
- **Examples:** `MIDB("Hello World", 7, 5)`

#### NUMBERVALUE

**Converts text to number in a locale-independent manner**

- **Syntax:** `NUMBERVALUE(text, [decimal_separator], [group_separator])`
- **Examples:** `NUMBERVALUE("1,234.56")`, `NUMBERVALUE("1.234,56", ",", ".")`, `NUMBERVALUE("50%")`

#### PHONETIC

**Extracts the phonetic (furigana) characters from a text string**

- **Syntax:** `PHONETIC(text)`
- **Examples:** `PHONETIC("東京")`

#### PROPER

**Capitalizes the first letter in each word of a text value**

- **Syntax:** `PROPER(text)`
- **Examples:** `PROPER("hello world")`

#### REGEXEXTRACT

**Extracts strings within the provided text that matches the pattern**

- **Syntax:** `REGEXEXTRACT(text, pattern)`
- **Examples:** `REGEXEXTRACT("Hello123World", "\\d+")`

#### REGEXREPLACE

**Replaces strings within the provided text that matches the pattern with replacement**

- **Syntax:** `REGEXREPLACE(text, pattern, replacement)`
- **Examples:** `REGEXREPLACE("Hello123World", "\\d+", "XXX")`

#### REGEXTEST

**Determines whether any part of text matches the pattern**

- **Syntax:** `REGEXTEST(text, pattern)`
- **Examples:** `REGEXTEST("Hello123", "\\d+")`

#### REPLACE

**Replaces characters within text**

- **Syntax:** `REPLACE(old_text, start_num, num_chars, new_text)`
- **Examples:** `REPLACE("Hello World", 7, 5, "Excel")`, `REPLACE(A1, 1, 3, "ABC")`

#### REPLACEB

**Replaces characters within text (byte-based)**

- **Syntax:** `REPLACEB(old_text, start_num, num_bytes, new_text)`
- **Examples:** `REPLACEB("Hello World", 7, 5, "Excel")`

#### REPT

**Repeats text a given number of times**

- **Syntax:** `REPT(text, number_times)`
- **Examples:** `REPT("*", 5)`

#### RIGHT

**Returns the rightmost characters from a text value**

- **Syntax:** `RIGHT(text, [num_chars])`
- **Examples:** `RIGHT("Hello", 3)`

#### RIGHTB

**Returns the rightmost characters from a text value (byte-based)**

- **Syntax:** `RIGHTB(text, [num_bytes])`
- **Examples:** `RIGHTB("Hello", 3)`

#### SEARCH

**Finds one text value within another (case-insensitive)**

- **Syntax:** `SEARCH(find_text, within_text, [start_num])`
- **Examples:** `SEARCH("world", "Hello World")`, `SEARCH("O", A1, 2)`

#### SEARCHB

**Finds one text value within another (case-insensitive, byte-based)**

- **Syntax:** `SEARCHB(find_text, within_text, [start_num])`
- **Examples:** `SEARCHB("world", "Hello World")`

#### SUBSTITUTE

**Substitutes new text for old text in a text string**

- **Syntax:** `SUBSTITUTE(text, old_text, new_text, [instance_num])`
- **Examples:** `SUBSTITUTE("Hello World", "World", "Excel")`, `SUBSTITUTE(A1, "old", "new", 1)`

#### T

**Converts its arguments to text**

- **Syntax:** `T(value)`
- **Examples:** `T("Hello")`

#### TEXT

**Formats a number and converts it to text**

- **Syntax:** `TEXT(value, format_text)`
- **Examples:** `TEXT(1234.567, "0.00")`, `TEXT(0.75, "0%")`

#### TEXTAFTER

**Returns text that occurs after a given character or string**

- **Syntax:** `TEXTAFTER(text, delimiter, [instance_num], [match_mode])`
- **Examples:** `TEXTAFTER("Hello World", " ")`, `TEXTAFTER("A-B-C", "-", 1)`

#### TEXTBEFORE

**Returns text that occurs before a given character or string**

- **Syntax:** `TEXTBEFORE(text, delimiter, [instance_num], [match_mode])`
- **Examples:** `TEXTBEFORE("Hello World", " ")`, `TEXTBEFORE("A-B-C", "-", 2)`

#### TEXTJOIN

**Combines the text from multiple ranges and/or strings**

- **Syntax:** `TEXTJOIN(delimiter, ignore_empty, text1, [text2], ...)`
- **Examples:** `TEXTJOIN(", ", TRUE, "Apple", "Orange", "", "Banana")`, `TEXTJOIN("-", FALSE, A1:A3)`

#### TEXTSPLIT

**Splits text strings by using column and row delimiters**

- **Syntax:** `TEXTSPLIT(text, col_delimiter, [row_delimiter], [ignore_empty])`
- **Examples:** `TEXTSPLIT("A,B,C", ",")`, `TEXTSPLIT("A,B;C,D", ",", ";")`

#### TRANSLATE

**Translates a text from one language to another**

- **Syntax:** `TRANSLATE(text, from_language, to_language)`
- **Examples:** `TRANSLATE("Hello", "en", "es")`

#### TRIM

**Removes spaces from text**

- **Syntax:** `TRIM(text)`
- **Examples:** `TRIM("  Hello World  ")`

#### UNICHAR

**Returns the Unicode character that is referenced by the given numeric value**

- **Syntax:** `UNICHAR(number)`
- **Examples:** `UNICHAR(65)`, `UNICHAR(8364)`

#### UNICODE

**Returns the number (code point) that corresponds to the first character of the text**

- **Syntax:** `UNICODE(text)`
- **Examples:** `UNICODE("A")`, `UNICODE("€")`

#### UPPER

**Converts text to uppercase**

- **Syntax:** `UPPER(text)`
- **Examples:** `UPPER("hello")`

#### VALUE

**Converts a text string that represents a number to a number**

- **Syntax:** `VALUE(text)`
- **Examples:** `VALUE("123")`, `VALUE("3.14")`

#### VALUETOTEXT

**Returns text from any specified value**

- **Syntax:** `VALUETOTEXT(value, [format])`
- **Examples:** `VALUETOTEXT(123)`, `VALUETOTEXT(TRUE, 1)`



---

## Web

Functions for web-based operations and data retrieval.

### Functions in this category:

#### ENCODEURL

**Returns a URL-encoded string**

- **Syntax:** `ENCODEURL(text)`
- **Examples:** `ENCODEURL("Hello World")`, `ENCODEURL("user@example.com")`, `ENCODEURL("a b c")`

#### FILTERXML

**Returns specific data from the XML content by using the specified XPath**

- **Syntax:** `FILTERXML(xml_text, xpath)`
- **Examples:** `FILTERXML("<root><item>value</item></root>", "//item")`, `FILTERXML(A1, "//price")`, `FILTERXML("<data><name>John</name></data>", "//name")`

#### WEBSERVICE

**Returns data from a web service**

- **Syntax:** `WEBSERVICE(url)`
- **Examples:** `WEBSERVICE("https://api.example.com/data")`, `WEBSERVICE("https://httpbin.org/json")`



---

