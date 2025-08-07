# Database Functions

Functions for working with structured data tables and performing database-like operations.

*This document contains 10 functions.*

---

## DAVERAGE

**Description:** Returns the average of selected database entries

**Syntax:** `DAVERAGE(database, field, criteria)`

**Category:** Database

**Examples:**
- `DAVERAGE(A1:E10, "Score", G1:G2)`

---

## DCOUNT

**Description:** Counts the cells that contain numbers in a database

**Syntax:** `DCOUNT(database, field, criteria)`

**Category:** Database

**Examples:**
- `DCOUNT(A1:E10, "Age", G1:G2)`

---

## DCOUNTA

**Description:** Counts nonblank cells in a database

**Syntax:** `DCOUNTA(database, field, criteria)`

**Category:** Database

**Examples:**
- `DCOUNTA(A1:E10, "Name", G1:G2)`

---

## DGET

**Description:** Extracts from a database a single record that matches the specified criteria

**Syntax:** `DGET(database, field, criteria)`

**Category:** Database

**Examples:**
- `DGET(A1:E10, "Name", G1:G2)`

---

## DMAX

**Description:** Returns the maximum value among selected database entries

**Syntax:** `DMAX(database, field, criteria)`

**Category:** Database

**Examples:**
- `DMAX(A1:E10, "Sales", G1:G2)`

---

## DMIN

**Description:** Returns the minimum value among selected database entries

**Syntax:** `DMIN(database, field, criteria)`

**Category:** Database

**Examples:**
- `DMIN(A1:E10, "Price", G1:G2)`

---

## DPRODUCT

**Description:** Multiplies the values in a particular field of records that match the criteria

**Syntax:** `DPRODUCT(database, field, criteria)`

**Category:** Database

**Examples:**
- `DPRODUCT(A1:E10, "Quantity", G1:G2)`

---

## DSTDEV

**Description:** Estimates the standard deviation based on a sample of selected database entries

**Syntax:** `DSTDEV(database, field, criteria)`

**Category:** Database

**Examples:**
- `DSTDEV(A1:E10, "Score", G1:G2)`

---

## DSUM

**Description:** Returns the sum of selected database entries

**Syntax:** `DSUM(database, field, criteria)`

**Category:** Database

**Examples:**
- `DSUM(A1:E10, "Sales", G1:G2)`

---

## DVAR

**Description:** Estimates variance based on a sample of selected database entries

**Syntax:** `DVAR(database, field, criteria)`

**Category:** Database

**Examples:**
- `DVAR(A1:E10, "Sales", G1:G2)`

