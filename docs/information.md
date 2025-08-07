# Information Functions

Functions for testing cell contents and retrieving information about data types.

*This document contains 22 functions.*

---

## CELL

**Description:** Returns information about the formatting, location, or contents of a cell

**Syntax:** `CELL(info_type, [reference])`

**Category:** Information

**Examples:**
- `CELL("address", A1)`
- `CELL("row", A1)`
- `CELL("col", A1)`

---

## ERROR.TYPE

**Description:** Returns a number corresponding to an error type

**Syntax:** `ERROR.TYPE(error_val)`

**Category:** Information

**Examples:**
- `ERROR.TYPE(#DIV/0!)`

---

## INFO

**Description:** Returns information about the current operating environment

**Syntax:** `INFO(type_text)`

**Category:** Information

**Examples:**
- `INFO("system")`
- `INFO("release")`

---

## ISBLANK

**Description:** Returns TRUE if the value is blank

**Syntax:** `ISBLANK(value)`

**Category:** Information

**Examples:**
- `ISBLANK(A1)`

---

## ISERR

**Description:** Returns TRUE if the value is any error value except #N/A

**Syntax:** `ISERR(value)`

**Category:** Information

**Examples:**
- `ISERR(A1/0)`
- `ISERR(#VALUE!)`

---

## ISERROR

**Description:** Returns TRUE if the value is an error

**Syntax:** `ISERROR(value)`

**Category:** Information

**Examples:**
- `ISERROR(A1/0)`

---

## ISEVEN

**Description:** Returns TRUE if the number is even

**Syntax:** `ISEVEN(number)`

**Category:** Information

**Examples:**
- `ISEVEN(4)`

---

## ISFORMULA

**Description:** Returns TRUE if there is a reference to a cell that contains a formula

**Syntax:** `ISFORMULA(reference)`

**Category:** Information

**Examples:**
- `ISFORMULA(A1)`

---

## ISLOGICAL

**Description:** Returns TRUE if the value is a logical value

**Syntax:** `ISLOGICAL(value)`

**Category:** Information

**Examples:**
- `ISLOGICAL(TRUE)`

---

## ISNA

**Description:** Returns TRUE if the value is #N/A

**Syntax:** `ISNA(value)`

**Category:** Information

**Examples:**
- `ISNA(#N/A)`

---

## ISNONTEXT

**Description:** Returns TRUE if the value is not text

**Syntax:** `ISNONTEXT(value)`

**Category:** Information

**Examples:**
- `ISNONTEXT(123)`

---

## ISNUMBER

**Description:** Returns TRUE if the value is a number

**Syntax:** `ISNUMBER(value)`

**Category:** Information

**Examples:**
- `ISNUMBER(123)`

---

## ISODD

**Description:** Returns TRUE if the number is odd

**Syntax:** `ISODD(number)`

**Category:** Information

**Examples:**
- `ISODD(3)`

---

## ISOMITTED

**Description:** Checks whether the value in a LAMBDA is missing and returns TRUE or FALSE

**Syntax:** `ISOMITTED(argument)`

**Category:** Information

**Examples:**
- `ISOMITTED(value)`

---

## ISREF

**Description:** Returns TRUE if the value is a reference

**Syntax:** `ISREF(value)`

**Category:** Information

**Examples:**
- `ISREF(A1)`
- `ISREF(A1:B10)`

---

## ISTEXT

**Description:** Returns TRUE if the value is text

**Syntax:** `ISTEXT(value)`

**Category:** Information

**Examples:**
- `ISTEXT("Hello")`

---

## N

**Description:** Returns a value converted to a number

**Syntax:** `N(value)`

**Category:** Information

**Examples:**
- `N("123")`

---

## NA

**Description:** Returns the error value #N/A

**Syntax:** `NA()`

**Category:** Information

**Examples:**
- `NA()`

---

## SHEET

**Description:** Returns the sheet number of the referenced sheet

**Syntax:** `SHEET([value])`

**Category:** Information

**Examples:**
- `SHEET()`
- `SHEET(A1)`

---

## SHEETS

**Description:** Returns the number of sheets in a reference

**Syntax:** `SHEETS([reference])`

**Category:** Information

**Examples:**
- `SHEETS()`
- `SHEETS(A1:B10)`

---

## STOCKHISTORY

**Description:** Retrieves historical data about a financial instrument

**Syntax:** `STOCKHISTORY(stock, [start_date], [end_date], [interval], [headers], [properties])`

**Category:** Information

**Examples:**
- `STOCKHISTORY("MSFT")`

---

## TYPE

**Description:** Returns a number indicating the data type of a value

**Syntax:** `TYPE(value)`

**Category:** Information

**Examples:**
- `TYPE("text")`

