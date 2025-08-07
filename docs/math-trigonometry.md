# Math & Trigonometry Functions

Mathematical and trigonometric functions for calculations and analysis.

*This document contains 49 functions.*

---

## ABS

**Description:** Returns the absolute value of a number

**Syntax:** `ABS(number)`

**Category:** Math

**Examples:**
- `ABS(-5)`
- `ABS(A1)`

---

## ACOS

**Description:** Returns the arccosine of a number

**Syntax:** `ACOS(number)`

**Category:** Math

**Examples:**
- `ACOS(0.5)`
- `ACOS(-1)`

---

## ACOSH

**Description:** Returns the inverse hyperbolic cosine of a number

**Syntax:** `ACOSH(number)`

**Category:** Math

**Examples:**
- `ACOSH(1)`
- `ACOSH(2)`

---

## ASIN

**Description:** Returns the arcsine of a number

**Syntax:** `ASIN(number)`

**Category:** Math

**Examples:**
- `ASIN(0.5)`
- `ASIN(1)`

---

## ASINH

**Description:** Returns the inverse hyperbolic sine of a number

**Syntax:** `ASINH(number)`

**Category:** Math

**Examples:**
- `ASINH(1)`
- `ASINH(0)`

---

## ATAN

**Description:** Returns the arctangent of a number

**Syntax:** `ATAN(number)`

**Category:** Math

**Examples:**
- `ATAN(1)`
- `ATAN(0)`

---

## ATAN2

**Description:** Returns the arctangent from x- and y-coordinates

**Syntax:** `ATAN2(x_num, y_num)`

**Category:** Math

**Examples:**
- `ATAN2(1, 1)`
- `ATAN2(4, 3)`

---

## ATANH

**Description:** Returns the inverse hyperbolic tangent of a number

**Syntax:** `ATANH(number)`

**Category:** Math

**Examples:**
- `ATANH(0.5)`
- `ATANH(-0.5)`

---

## CEILING

**Description:** Rounds a number up to the nearest integer or multiple of significance

**Syntax:** `CEILING(number, [significance])`

**Category:** Math

**Examples:**
- `CEILING(3.2)`
- `CEILING(4.3, 0.5)`

---

## COMBIN

**Description:** Returns the number of combinations for a given number of objects

**Syntax:** `COMBIN(number, number_chosen)`

**Category:** Math

**Examples:**
- `COMBIN(8, 3)`
- `COMBIN(10, 2)`

---

## COS

**Description:** Returns the cosine of an angle

**Syntax:** `COS(number)`

**Category:** Math

**Examples:**
- `COS(0)`
- `COS(RADIANS(90))`

---

## COSH

**Description:** Returns the hyperbolic cosine of a number

**Syntax:** `COSH(number)`

**Category:** Math

**Examples:**
- `COSH(0)`
- `COSH(1)`

---

## DEGREES

**Description:** Converts radians to degrees

**Syntax:** `DEGREES(angle)`

**Category:** Math

**Examples:**
- `DEGREES(PI())`
- `DEGREES(PI()/2)`

---

## EVEN

**Description:** Rounds a number up to the nearest even integer

**Syntax:** `EVEN(number)`

**Category:** Math

**Examples:**
- `EVEN(3)`
- `EVEN(-2.5)`

---

## EXP

**Description:** Returns e raised to the power of a given number

**Syntax:** `EXP(number)`

**Category:** Math

**Examples:**
- `EXP(1)`
- `EXP(2)`

---

## FACT

**Description:** Returns the factorial of a number

**Syntax:** `FACT(number)`

**Category:** Math

**Examples:**
- `FACT(5)`
- `FACT(0)`

---

## FLOOR

**Description:** Rounds a number down to the nearest integer or multiple of significance

**Syntax:** `FLOOR(number, [significance])`

**Category:** Math

**Examples:**
- `FLOOR(3.8)`
- `FLOOR(4.7, 0.5)`

---

## GCD

**Description:** Returns the greatest common divisor

**Syntax:** `GCD(number1, [number2], ...)`

**Category:** Math

**Examples:**
- `GCD(24, 36)`
- `GCD(12, 18, 24)`

---

## INT

**Description:** Rounds a number down to the nearest integer

**Syntax:** `INT(number)`

**Category:** Math

**Examples:**
- `INT(3.7)`
- `INT(-3.7)`

---

## LCM

**Description:** Returns the least common multiple

**Syntax:** `LCM(number1, [number2], ...)`

**Category:** Math

**Examples:**
- `LCM(6, 8)`
- `LCM(12, 18, 24)`

---

## LN

**Description:** Returns the natural logarithm of a number

**Syntax:** `LN(number)`

**Category:** Math

**Examples:**
- `LN(EXP(1))`
- `LN(10)`

---

## LOG

**Description:** Returns the logarithm of a number to a specified base

**Syntax:** `LOG(number, [base])`

**Category:** Math

**Examples:**
- `LOG(100)`
- `LOG(8, 2)`

---

## LOG10

**Description:** Returns the base-10 logarithm of a number

**Syntax:** `LOG10(number)`

**Category:** Math

**Examples:**
- `LOG10(100)`
- `LOG10(10)`

---

## MOD

**Description:** Returns the remainder from division

**Syntax:** `MOD(number, divisor)`

**Category:** Math

**Examples:**
- `MOD(10, 3)`
- `MOD(A1, B1)`

---

## MROUND

**Description:** Returns a number rounded to the desired multiple

**Syntax:** `MROUND(number, multiple)`

**Category:** Math

**Examples:**
- `MROUND(10, 3)`
- `MROUND(1.3, 0.2)`

---

## ODD

**Description:** Rounds a number up to the nearest odd integer

**Syntax:** `ODD(number)`

**Category:** Math

**Examples:**
- `ODD(2)`
- `ODD(-2.5)`

---

## PI

**Description:** Returns the value of pi

**Syntax:** `PI()`

**Category:** Math

**Examples:**
- `PI()`
- `2*PI()`

---

## POWER

**Description:** Returns the result of a number raised to a power

**Syntax:** `POWER(number, power)`

**Category:** Math

**Examples:**
- `POWER(2, 3)`
- `POWER(A1, 2)`

---

## PRODUCT

**Description:** Multiplies all the numbers given as arguments

**Syntax:** `PRODUCT(number1, [number2], ...)`

**Category:** Math

**Examples:**
- `PRODUCT(A1:A10)`
- `PRODUCT(2, 3, 4)`

---

## QUOTIENT

**Description:** Returns the integer portion of a division

**Syntax:** `QUOTIENT(numerator, denominator)`

**Category:** Math

**Examples:**
- `QUOTIENT(10, 3)`
- `QUOTIENT(-10, 3)`

---

## RADIANS

**Description:** Converts degrees to radians

**Syntax:** `RADIANS(angle)`

**Category:** Math

**Examples:**
- `RADIANS(90)`
- `RADIANS(180)`

---

## RAND

**Description:** Returns a random number between 0 and 1

**Syntax:** `RAND()`

**Category:** Math

**Examples:**
- `RAND()`
- `RAND()*10`

---

## RANDBETWEEN

**Description:** Returns a random number between the numbers you specify

**Syntax:** `RANDBETWEEN(bottom, top)`

**Category:** Math

**Examples:**
- `RANDBETWEEN(1, 10)`
- `RANDBETWEEN(-5, 5)`

---

## ROUND

**Description:** Rounds a number to a specified number of digits

**Syntax:** `ROUND(number, [num_digits])`

**Category:** Math

**Examples:**
- `ROUND(3.14159, 2)`
- `ROUND(A1, 0)`

---

## ROUNDDOWN

**Description:** Rounds a number down, toward zero

**Syntax:** `ROUNDDOWN(number, [num_digits])`

**Category:** Math

**Examples:**
- `ROUNDDOWN(3.14159, 2)`
- `ROUNDDOWN(-3.14, 1)`

---

## ROUNDUP

**Description:** Rounds a number up, away from zero

**Syntax:** `ROUNDUP(number, [num_digits])`

**Category:** Math

**Examples:**
- `ROUNDUP(3.14159, 2)`
- `ROUNDUP(-3.14, 1)`

---

## SIGN

**Description:** Returns the sign of a number

**Syntax:** `SIGN(number)`

**Category:** Math

**Examples:**
- `SIGN(10)`
- `SIGN(-5)`
- `SIGN(0)`

---

## SIN

**Description:** Returns the sine of an angle

**Syntax:** `SIN(number)`

**Category:** Math

**Examples:**
- `SIN(PI()/2)`
- `SIN(RADIANS(90))`

---

## SINH

**Description:** Returns the hyperbolic sine of a number

**Syntax:** `SINH(number)`

**Category:** Math

**Examples:**
- `SINH(1)`
- `SINH(0)`

---

## SQRT

**Description:** Returns the square root of a number

**Syntax:** `SQRT(number)`

**Category:** Math

**Examples:**
- `SQRT(16)`
- `SQRT(A1)`

---

## SQRTPI

**Description:** Returns the square root of (number * pi)

**Syntax:** `SQRTPI(number)`

**Category:** Math

**Examples:**
- `SQRTPI(1)`
- `SQRTPI(4)`

---

## SUM

**Description:** Adds all numbers in a range of cells

**Syntax:** `SUM(number1, [number2], ...)`

**Category:** Math

**Examples:**
- `SUM(A1:A10)`
- `SUM(5, 10, 15)`

---

## SUMIF

**Description:** Adds the cells specified by a given criteria

**Syntax:** `SUMIF(range, criteria, [sum_range])`

**Category:** Math

**Examples:**
- `SUMIF(A1:A10, ">5")`
- `SUMIF(A1:A10, "Apple", B1:B10)`

---

## SUMIFS

**Description:** Adds the cells in a range that meet multiple criteria

**Syntax:** `SUMIFS(sum_range, criteria_range1, criteria1, [criteria_range2, criteria2], ...)`

**Category:** Math

**Examples:**
- `SUMIFS(D2:D10, A2:A10, "Product", B2:B10, ">10")`

---

## SUMPRODUCT

**Description:** Returns the sum of the products of corresponding array components

**Syntax:** `SUMPRODUCT(array1, [array2], [array3], ...)`

**Category:** Math

**Examples:**
- `SUMPRODUCT(A1:A3, B1:B3)`
- `SUMPRODUCT({1,2,3}, {4,5,6})`

---

## SUMSQ

**Description:** Returns the sum of the squares of the arguments

**Syntax:** `SUMSQ(number1, [number2], ...)`

**Category:** Math

**Examples:**
- `SUMSQ(A1:A10)`
- `SUMSQ(3, 4, 5)`

---

## TAN

**Description:** Returns the tangent of an angle

**Syntax:** `TAN(number)`

**Category:** Math

**Examples:**
- `TAN(PI()/4)`
- `TAN(RADIANS(45))`

---

## TANH

**Description:** Returns the hyperbolic tangent of a number

**Syntax:** `TANH(number)`

**Category:** Math

**Examples:**
- `TANH(0)`
- `TANH(1)`

---

## TRUNC

**Description:** Truncates a number to an integer

**Syntax:** `TRUNC(number, [num_digits])`

**Category:** Math

**Examples:**
- `TRUNC(3.14159, 2)`
- `TRUNC(-3.14)`

