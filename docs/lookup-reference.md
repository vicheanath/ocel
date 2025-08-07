# Lookup & Reference Functions

Functions for searching and referencing data within tables and ranges.

*This document contains 9 functions.*

---

## FILTER

**Description:** Filters a range of data based on criteria you define

**Syntax:** `FILTER(array, include, [if_empty])`

**Category:** Lookup

**Examples:**
- `FILTER(A2:A10, B2:B10>10, "No matches")`

---

## HLOOKUP

**Description:** Looks for a value in the top row of a table

**Syntax:** `HLOOKUP(lookup_value, table_array, row_index, [range_lookup])`

**Category:** Lookup

**Examples:**
- `HLOOKUP(A2, A1:F10, 3, FALSE)`

---

## INDEX

**Description:** Returns the value of an element in a table or array, selected by row and column number

**Syntax:** `INDEX(array, row, [column])`

**Category:** Lookup

**Examples:**
- `INDEX(A1:C10, 3, 2)`
- `INDEX(A1:A10, 5)`

---

## INDIRECT

**Description:** Returns the value specified by a text string representing a cell reference

**Syntax:** `INDIRECT(ref_text)`

**Category:** Lookup

**Examples:**
- `INDIRECT("A1")`
- `INDIRECT("B"&ROW())`

---

## MATCH

**Description:** Returns the relative position of an item in an array

**Syntax:** `MATCH(lookup_value, lookup_array, [match_type])`

**Category:** Lookup

**Examples:**
- `MATCH(40, B2:B10, 0)`
- `MATCH(A1, 1:1, 0)`

---

## OFFSET

**Description:** Returns a reference offset from a given reference by a specified number of rows and columns

**Syntax:** `OFFSET(reference, rows, cols, [height], [width])`

**Category:** Lookup

**Examples:**
- `OFFSET(A1, 2, 3)`
- `OFFSET(B5, -1, 1)`

---

## UNIQUE

**Description:** Returns a list of unique values in a list or range

**Syntax:** `UNIQUE(array)`

**Category:** Lookup

**Examples:**
- `UNIQUE(A2:A10)`

---

## VLOOKUP

**Description:** Looks for a value in the leftmost column of a table

**Syntax:** `VLOOKUP(lookup_value, table_array, col_index, [range_lookup])`

**Category:** Lookup

**Examples:**
- `VLOOKUP(A2, D2:F100, 3, FALSE)`

---

## XLOOKUP

**Description:** Searches a range and returns an item corresponding to the first match

**Syntax:** `XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode], [search_mode])`

**Category:** Lookup

**Examples:**
- `XLOOKUP("Apple", A2:A10, B2:B10, "Not Found")`

