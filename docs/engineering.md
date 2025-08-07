# Engineering Functions

Specialized functions for engineering calculations and number system conversions.

*This document contains 26 functions.*

---

## BIN2DEC

**Description:** Converts a binary number to decimal

**Syntax:** `BIN2DEC(number)`

**Category:** Engineering

**Examples:**
- `BIN2DEC(1010)`

---

## BIN2HEX

**Description:** Converts a binary number to hexadecimal

**Syntax:** `BIN2HEX(number, [places])`

**Category:** Engineering

**Examples:**
- `BIN2HEX(11111011)`
- `BIN2HEX(11111011, 4)`

---

## BIN2OCT

**Description:** Converts a binary number to octal

**Syntax:** `BIN2OCT(number, [places])`

**Category:** Engineering

**Examples:**
- `BIN2OCT(1001)`
- `BIN2OCT(1001, 3)`

---

## BITAND

**Description:** Returns a bitwise AND of two numbers

**Syntax:** `BITAND(number1, number2)`

**Category:** Engineering

**Examples:**
- `BITAND(13, 25)`

---

## BITLSHIFT

**Description:** Returns a number shifted left by specified number of bits

**Syntax:** `BITLSHIFT(number, shift_amount)`

**Category:** Engineering

**Examples:**
- `BITLSHIFT(4, 2)`

---

## BITOR

**Description:** Returns a bitwise OR of two numbers

**Syntax:** `BITOR(number1, number2)`

**Category:** Engineering

**Examples:**
- `BITOR(13, 25)`

---

## BITRSHIFT

**Description:** Returns a number shifted right by specified number of bits

**Syntax:** `BITRSHIFT(number, shift_amount)`

**Category:** Engineering

**Examples:**
- `BITRSHIFT(16, 2)`

---

## BITXOR

**Description:** Returns a bitwise XOR of two numbers

**Syntax:** `BITXOR(number1, number2)`

**Category:** Engineering

**Examples:**
- `BITXOR(13, 25)`

---

## COMPLEX

**Description:** Converts real and imaginary coefficients into a complex number

**Syntax:** `COMPLEX(real_num, i_num, [suffix])`

**Category:** Engineering

**Examples:**
- `COMPLEX(3, 4, "j")`

---

## CONVERT

**Description:** Converts a number from one measurement system to another

**Syntax:** `CONVERT(number, from_unit, to_unit)`

**Category:** Engineering

**Examples:**
- `CONVERT(1, "m", "ft")`
- `CONVERT(32, "F", "C")`

---

## DEC2BIN

**Description:** Converts a decimal number to binary

**Syntax:** `DEC2BIN(number, [places])`

**Category:** Engineering

**Examples:**
- `DEC2BIN(10)`
- `DEC2BIN(10, 8)`

---

## DEC2HEX

**Description:** Converts a decimal number to hexadecimal

**Syntax:** `DEC2HEX(number, [places])`

**Category:** Engineering

**Examples:**
- `DEC2HEX(255)`
- `DEC2HEX(255, 4)`

---

## DEC2OCT

**Description:** Converts a decimal number to octal

**Syntax:** `DEC2OCT(number, [places])`

**Category:** Engineering

**Examples:**
- `DEC2OCT(64)`
- `DEC2OCT(64, 3)`

---

## DELTA

**Description:** Tests whether two values are equal. Returns 1 if they are equal; returns 0 otherwise

**Syntax:** `DELTA(number1, [number2])`

**Category:** Engineering

**Examples:**
- `DELTA(5, 4)`
- `DELTA(5, 5)`

---

## ERF

**Description:** Returns the error function

**Syntax:** `ERF(lower_limit, [upper_limit])`

**Category:** Engineering

**Examples:**
- `ERF(1)`
- `ERF(0, 1)`

---

## ERFC

**Description:** Returns the complementary error function

**Syntax:** `ERFC(x)`

**Category:** Engineering

**Examples:**
- `ERFC(1)`
- `ERFC(0.5)`

---

## GESTEP

**Description:** Returns 1 if number ≥ step; returns 0 otherwise

**Syntax:** `GESTEP(number, [step])`

**Category:** Engineering

**Examples:**
- `GESTEP(5, 4)`
- `GESTEP(5, 5)`
- `GESTEP(-4, -5)`

---

## HEX2BIN

**Description:** Converts a hexadecimal number to binary

**Syntax:** `HEX2BIN(number, [places])`

**Category:** Engineering

**Examples:**
- `HEX2BIN("F")`
- `HEX2BIN("F", 8)`

---

## HEX2DEC

**Description:** Converts a hexadecimal number to decimal

**Syntax:** `HEX2DEC(number)`

**Category:** Engineering

**Examples:**
- `HEX2DEC("FF")`

---

## HEX2OCT

**Description:** Converts a hexadecimal number to octal

**Syntax:** `HEX2OCT(number, [places])`

**Category:** Engineering

**Examples:**
- `HEX2OCT("F")`
- `HEX2OCT("F", 3)`

---

## IMABS

**Description:** Returns the absolute value (modulus) of a complex number

**Syntax:** `IMABS(inumber)`

**Category:** Engineering

**Examples:**
- `IMABS("5+12i")`
- `IMABS("3-4i")`

---

## IMAGINARY

**Description:** Returns the imaginary coefficient of a complex number

**Syntax:** `IMAGINARY(inumber)`

**Category:** Engineering

**Examples:**
- `IMAGINARY("6+9i")`
- `IMAGINARY("2-i")`

---

## IMREAL

**Description:** Returns the real coefficient of a complex number

**Syntax:** `IMREAL(inumber)`

**Category:** Engineering

**Examples:**
- `IMREAL("6+9i")`
- `IMREAL("2-i")`

---

## OCT2BIN

**Description:** Converts an octal number to binary

**Syntax:** `OCT2BIN(number, [places])`

**Category:** Engineering

**Examples:**
- `OCT2BIN(7)`
- `OCT2BIN(7, 3)`

---

## OCT2DEC

**Description:** Converts an octal number to decimal

**Syntax:** `OCT2DEC(number)`

**Category:** Engineering

**Examples:**
- `OCT2DEC(77)`

---

## OCT2HEX

**Description:** Converts an octal number to hexadecimal

**Syntax:** `OCT2HEX(number, [places])`

**Category:** Engineering

**Examples:**
- `OCT2HEX(100)`
- `OCT2HEX(100, 4)`

