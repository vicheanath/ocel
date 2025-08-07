# Financial Functions

Functions for financial calculations including loans, investments, and cash flows.

*This document contains 26 functions.*

---

## CUMIPMT

**Description:** Returns the cumulative interest paid between two periods

**Syntax:** `CUMIPMT(rate, nper, pv, start_period, end_period, type)`

**Category:** Financial

**Examples:**
- `CUMIPMT(0.09/12, 30*12, 125000, 13, 24, 0)`

---

## CUMPRINC

**Description:** Returns the cumulative principal paid on a loan between two periods

**Syntax:** `CUMPRINC(rate, nper, pv, start_period, end_period, type)`

**Category:** Financial

**Examples:**
- `CUMPRINC(0.09/12, 30*12, 125000, 13, 24, 0)`

---

## DB

**Description:** Returns the depreciation of an asset for a specified period by using the fixed-declining balance method

**Syntax:** `DB(cost, salvage, life, period, [month])`

**Category:** Financial

**Examples:**
- `DB(1000000, 100000, 6, 1, 7)`

---

## DDB

**Description:** Returns the depreciation of an asset for a specified period by using the double-declining balance method or some other method that you specify

**Syntax:** `DDB(cost, salvage, life, period, [factor])`

**Category:** Financial

**Examples:**
- `DDB(2400, 300, 10, 1, 2)`

---

## DOLLARDE

**Description:** Converts a dollar price, expressed as a fraction, into a dollar price, expressed as a decimal number

**Syntax:** `DOLLARDE(fractional_dollar, fraction)`

**Category:** Financial

**Examples:**
- `DOLLARDE(1.02, 16)`

---

## DOLLARFR

**Description:** Converts a dollar price, expressed as a decimal number, into a dollar price, expressed as a fraction

**Syntax:** `DOLLARFR(decimal_dollar, fraction)`

**Category:** Financial

**Examples:**
- `DOLLARFR(1.125, 16)`

---

## EFFECT

**Description:** Returns the effective annual interest rate

**Syntax:** `EFFECT(nominal_rate, npery)`

**Category:** Financial

**Examples:**
- `EFFECT(0.0525, 4)`

---

## FV

**Description:** Returns the future value of an investment

**Syntax:** `FV(rate, nper, pmt, [pv], [type])`

**Category:** Financial

**Examples:**
- `FV(0.06/12, 10*12, -200, -500, 1)`

---

## FVSCHEDULE

**Description:** Returns the future value of an initial principal after applying a series of compound interest rates

**Syntax:** `FVSCHEDULE(principal, schedule)`

**Category:** Financial

**Examples:**
- `FVSCHEDULE(1, {0.09, 0.11, 0.1})`

---

## IPMT

**Description:** Returns the interest payment for an investment for a given period

**Syntax:** `IPMT(rate, per, nper, pv, [fv], [type])`

**Category:** Financial

**Examples:**
- `IPMT(0.1/12, 1, 3*12, 8000)`

---

## IRR

**Description:** Returns the internal rate of return for a series of cash flows

**Syntax:** `IRR(values, [guess])`

**Category:** Financial

**Examples:**
- `IRR(A1:A5)`
- `IRR({-10000,2000,4000,8000})`

---

## ISPMT

**Description:** Calculates the interest paid during a specific period of an investment

**Syntax:** `ISPMT(rate, per, nper, pv)`

**Category:** Financial

**Examples:**
- `ISPMT(0.1/12, 1, 3*12, 8000)`

---

## MIRR

**Description:** Returns the internal rate of return where positive and negative cash flows are financed at different rates

**Syntax:** `MIRR(values, finance_rate, reinvest_rate)`

**Category:** Financial

**Examples:**
- `MIRR({-120000,39000,30000,21000,37000,46000}, 0.1, 0.12)`

---

## NOMINAL

**Description:** Returns the annual nominal interest rate

**Syntax:** `NOMINAL(effect_rate, npery)`

**Category:** Financial

**Examples:**
- `NOMINAL(0.053543, 4)`

---

## NPER

**Description:** Returns the number of periods for an investment

**Syntax:** `NPER(rate, pmt, pv, [fv], [type])`

**Category:** Financial

**Examples:**
- `NPER(0.12/12, -100, -1000, 10000, 1)`

---

## NPV

**Description:** Returns the net present value of an investment

**Syntax:** `NPV(rate, value1, [value2], ...)`

**Category:** Financial

**Examples:**
- `NPV(0.1, -10000, 3000, 4200, 6800)`

---

## PDURATION

**Description:** Returns the number of periods required by an investment to reach a specified value

**Syntax:** `PDURATION(rate, pv, fv)`

**Category:** Financial

**Examples:**
- `PDURATION(0.025, 2000, 2200)`

---

## PMT

**Description:** Returns the periodic payment for an annuity

**Syntax:** `PMT(rate, nper, pv, [fv], [type])`

**Category:** Financial

**Examples:**
- `PMT(0.08/12, 10*12, 10000)`

---

## PPMT

**Description:** Returns the payment on the principal for an investment for a given period

**Syntax:** `PPMT(rate, per, nper, pv, [fv], [type])`

**Category:** Financial

**Examples:**
- `PPMT(0.1/12, 1, 3*12, 8000)`

---

## PV

**Description:** Returns the present value of an investment

**Syntax:** `PV(rate, nper, pmt, [fv], [type])`

**Category:** Financial

**Examples:**
- `PV(0.08/12, 10*12, -100, 0, 0)`

---

## RATE

**Description:** Returns the interest rate per period of an annuity

**Syntax:** `RATE(nper, pmt, pv, [fv], [type], [guess])`

**Category:** Financial

**Examples:**
- `RATE(4*12, -200, 8000)`

---

## RRI

**Description:** Returns an equivalent interest rate for the growth of an investment

**Syntax:** `RRI(nper, pv, fv)`

**Category:** Financial

**Examples:**
- `RRI(96, -10000, 11000)`

---

## SLN

**Description:** Returns the straight-line depreciation of an asset for one period

**Syntax:** `SLN(cost, salvage, life)`

**Category:** Financial

**Examples:**
- `SLN(30000, 7500, 10)`

---

## SYD

**Description:** Returns the sum-of-years' digits depreciation of an asset for a specified period

**Syntax:** `SYD(cost, salvage, life, per)`

**Category:** Financial

**Examples:**
- `SYD(30000, 7500, 10, 1)`

---

## XIRR

**Description:** Returns the internal rate of return for a schedule of cash flows that is not necessarily periodic

**Syntax:** `XIRR(values, dates, [guess])`

**Category:** Financial

**Examples:**
- `XIRR({-10000, 2750, 4250, 3250, 2750}, {"1/1/2008", "3/1/2008", "10/30/2008", "2/15/2009", "4/1/2009"})`

---

## XNPV

**Description:** Returns the net present value for a schedule of cash flows that is not necessarily periodic

**Syntax:** `XNPV(rate, values, dates)`

**Category:** Financial

**Examples:**
- `XNPV(0.09, {-10000, 2750, 4250, 3250, 2750}, {"1/1/2008", "3/1/2008", "10/30/2008", "2/15/2009", "4/1/2009"})`

