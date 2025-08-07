# Logical Functions

Functions for logical operations and conditional testing.

*This document contains 19 functions.*

---

## AND

**Description:** Returns TRUE if all conditions are TRUE

**Syntax:** `AND(logical1, [logical2], ...)`

**Category:** Logical

**Examples:**
- `AND(A1>5, B1<10)`
- `AND(TRUE, TRUE, FALSE)`

---

## BYCOL

**Description:** Applies a LAMBDA to each column and returns an array of the results

**Syntax:** `BYCOL(array, lambda)`

**Category:** Logical

**Examples:**
- `BYCOL(A1:C3, LAMBDA(col, SUM(col)))`

---

## BYROW

**Description:** Applies a LAMBDA to each row and returns an array of the results

**Syntax:** `BYROW(array, lambda)`

**Category:** Logical

**Examples:**
- `BYROW(A1:C3, LAMBDA(row, SUM(row)))`

---

## FALSE

**Description:** Returns the logical value FALSE

**Syntax:** `FALSE()`

**Category:** Logical

**Examples:**
- `FALSE()`
- `IF(FALSE(), 1, 0)`

---

## IF

**Description:** Returns one value if a condition is true and another value if it's false

**Syntax:** `IF(condition, value_if_true, [value_if_false])`

**Category:** Logical

**Examples:**
- `IF(A1>10, "High", "Low")`

---

## IFERROR

**Description:** Returns a value you specify if a formula evaluates to an error

**Syntax:** `IFERROR(value, value_if_error)`

**Category:** Logical

**Examples:**
- `IFERROR(A1/B1, "Division by zero")`

---

## IFNA

**Description:** Returns a value you specify if the expression resolves to #N/A

**Syntax:** `IFNA(value, value_if_na)`

**Category:** Logical

**Examples:**
- `IFNA(VLOOKUP(A1, B:C, 2, FALSE), "Not found")`

---

## IFS

**Description:** Checks whether one or more conditions are met and returns a value that corresponds to the first TRUE condition

**Syntax:** `IFS(condition1, value1, [condition2, value2], ...)`

**Category:** Logical

**Examples:**
- `IFS(A1>90, "A", A1>80, "B", A1>70, "C", TRUE(), "F")`

---

## LAMBDA

**Description:** Create custom, reusable functions and call them by a friendly name

**Syntax:** `LAMBDA(parameter1, [parameter2, ...], calculation)`

**Category:** Logical

**Examples:**
- `LAMBDA(x, y, x*y)`
- `LAMBDA(x, x^2 + 2*x + 1)`

---

## LET

**Description:** Assigns names to calculation results

**Syntax:** `LET(name1, value1, [name2, value2, ...], calculation)`

**Category:** Logical

**Examples:**
- `LET(x, A1*2, y, B1*3, x+y)`

---

## MAKEARRAY

**Description:** Returns a calculated array of a specified row and column size, by applying a LAMBDA

**Syntax:** `MAKEARRAY(rows, cols, lambda)`

**Category:** Logical

**Examples:**
- `MAKEARRAY(3, 3, LAMBDA(r,c,r*c))`

---

## MAP

**Description:** Returns an array formed by mapping each value in the array(s) to a new value by applying a LAMBDA

**Syntax:** `MAP(array1, [array2, ...], lambda)`

**Category:** Logical

**Examples:**
- `MAP(A1:A5, LAMBDA(x, x*2))`

---

## NOT

**Description:** Reverses the logic of its argument

**Syntax:** `NOT(logical)`

**Category:** Logical

**Examples:**
- `NOT(TRUE)`
- `NOT(A1>5)`

---

## OR

**Description:** Returns TRUE if any condition is TRUE

**Syntax:** `OR(logical1, [logical2], ...)`

**Category:** Logical

**Examples:**
- `OR(A1>5, B1<10)`
- `OR(FALSE, FALSE, TRUE)`

---

## REDUCE

**Description:** Reduces an array to an accumulated value by applying a LAMBDA to each value and returning the total value in the accumulator

**Syntax:** `REDUCE(initial_value, array, lambda)`

**Category:** Logical

**Examples:**
- `REDUCE(0, A1:A5, LAMBDA(acc, val, acc + val))`

---

## SCAN

**Description:** Scans an array by applying a LAMBDA to each value and returns an array that has each intermediate value

**Syntax:** `SCAN(initial_value, array, lambda)`

**Category:** Logical

**Examples:**
- `SCAN(0, A1:A5, LAMBDA(acc, val, acc + val))`

---

## SWITCH

**Description:** Evaluates an expression and returns the corresponding value

**Syntax:** `SWITCH(expression, value1, result1, [value2, result2], ..., [default])`

**Category:** Logical

**Examples:**
- `SWITCH(A1, 1, "One", 2, "Two", 3, "Three", "Other")`

---

## TRUE

**Description:** Returns the logical value TRUE

**Syntax:** `TRUE()`

**Category:** Logical

**Examples:**
- `TRUE()`
- `IF(TRUE(), 1, 0)`

---

## XOR

**Description:** Returns TRUE if an odd number of conditions are TRUE

**Syntax:** `XOR(logical1, [logical2], ...)`

**Category:** Logical

**Examples:**
- `XOR(TRUE, FALSE)`
- `XOR(A1>5, B1<10, C1=0)`

