# Statistical Functions

Functions for statistical analysis and probability calculations.

*This document contains 49 functions.*

---

## AVEDEV

**Description:** Returns the average of the absolute deviations of data points from their mean

**Syntax:** `AVEDEV(number1, [number2], ...)`

**Category:** Statistical

**Examples:**
- `AVEDEV(A1:A10)`

---

## AVERAGE

**Description:** Calculates the average of numbers

**Syntax:** `AVERAGE(number1, [number2], ...)`

**Category:** Statistical

**Examples:**
- `AVERAGE(B2:B20)`

---

## AVERAGEA

**Description:** Returns the average of its arguments, including numbers, text, and logical values

**Syntax:** `AVERAGEA(value1, [value2], ...)`

**Category:** Statistical

**Examples:**
- `AVERAGEA(A1:A10)`

---

## AVERAGEIF

**Description:** Returns the average (arithmetic mean) of all the cells in a range that meet a given criteria

**Syntax:** `AVERAGEIF(range, criteria, [average_range])`

**Category:** Statistical

**Examples:**
- `AVERAGEIF(A2:A10, ">5")`

---

## AVERAGEIFS

**Description:** Returns the average (arithmetic mean) of all cells that meet multiple criteria

**Syntax:** `AVERAGEIFS(average_range, criteria_range1, criteria1, [criteria_range2, criteria2], ...)`

**Category:** Statistical

**Examples:**
- `AVERAGEIFS(B2:B10, A2:A10, "Product", C2:C10, ">10")`

---

## CONFIDENCE

**Description:** [Legacy] Returns the confidence interval for a population mean

**Syntax:** `CONFIDENCE(alpha, standard_dev, size)`

**Category:** Statistical

**Examples:**
- `CONFIDENCE(0.05, 2.5, 50)`

---

## CORREL

**Description:** Returns the correlation coefficient between two data sets

**Syntax:** `CORREL(array1, array2)`

**Category:** Statistical

**Examples:**
- `CORREL(A1:A10, B1:B10)`

---

## COUNT

**Description:** Counts the number of cells that contain numbers

**Syntax:** `COUNT(value1, [value2], ...)`

**Category:** Statistical

**Examples:**
- `COUNT(E5:E25)`

---

## COUNTA

**Description:** Counts the number of cells that are not empty

**Syntax:** `COUNTA(value1, [value2], ...)`

**Category:** Statistical

**Examples:**
- `COUNTA(A1:A10)`

---

## COUNTBLANK

**Description:** Counts empty cells in a range

**Syntax:** `COUNTBLANK(range)`

**Category:** Statistical

**Examples:**
- `COUNTBLANK(A1:A10)`

---

## COUNTIF

**Description:** Counts the number of cells within a range that meet the given criteria

**Syntax:** `COUNTIF(range, criteria)`

**Category:** Statistical

**Examples:**
- `COUNTIF(A2:A10, ">5")`

---

## COUNTIFS

**Description:** Counts the number of cells within a range that meet multiple criteria

**Syntax:** `COUNTIFS(criteria_range1, criteria1, [criteria_range2, criteria2], ...)`

**Category:** Statistical

**Examples:**
- `COUNTIFS(A2:A10, "Product", B2:B10, ">10")`

---

## COVAR

**Description:** [Legacy] Returns covariance, the average of the products of paired deviations

**Syntax:** `COVAR(array1, array2)`

**Category:** Statistical

**Examples:**
- `COVAR(A1:A10, B1:B10)`

---

## DEVSQ

**Description:** Returns the sum of squares of deviations

**Syntax:** `DEVSQ(number1, [number2], ...)`

**Category:** Statistical

**Examples:**
- `DEVSQ(A1:A10)`

---

## FORECAST

**Description:** [Legacy] Calculates, or predicts, a future value by using existing values

**Syntax:** `FORECAST(x, known_y_s, known_x_s)`

**Category:** Statistical

**Examples:**
- `FORECAST(30, A1:A10, B1:B10)`

---

## GEOMEAN

**Description:** Returns the geometric mean

**Syntax:** `GEOMEAN(number1, [number2], ...)`

**Category:** Statistical

**Examples:**
- `GEOMEAN(A1:A10)`

---

## HARMEAN

**Description:** Returns the harmonic mean

**Syntax:** `HARMEAN(number1, [number2], ...)`

**Category:** Statistical

**Examples:**
- `HARMEAN(A1:A10)`

---

## KURT

**Description:** Returns the kurtosis of a data set

**Syntax:** `KURT(number1, [number2], ...)`

**Category:** Statistical

**Examples:**
- `KURT(A1:A10)`

---

## LARGE

**Description:** Returns the k-th largest value in a data set

**Syntax:** `LARGE(array, k)`

**Category:** Statistical

**Examples:**
- `LARGE(A1:A10, 2)`

---

## MAX

**Description:** Returns the largest value in a set of values

**Syntax:** `MAX(number1, [number2], ...)`

**Category:** Statistical

**Examples:**
- `MAX(C3:C15)`

---

## MAXA

**Description:** Returns the maximum value in a list of arguments, including numbers, text, and logical values

**Syntax:** `MAXA(value1, [value2], ...)`

**Category:** Statistical

**Examples:**
- `MAXA(A1:A10)`

---

## MAXIFS

**Description:** Returns the maximum value among cells specified by a given set of conditions or criteria

**Syntax:** `MAXIFS(max_range, criteria_range1, criteria1, [criteria_range2, criteria2], ...)`

**Category:** Statistical

**Examples:**
- `MAXIFS(B2:B10, A2:A10, "Product", C2:C10, ">10")`

---

## MEDIAN

**Description:** Returns the median of the given numbers

**Syntax:** `MEDIAN(number1, [number2], ...)`

**Category:** Statistical

**Examples:**
- `MEDIAN(A1:A10)`
- `MEDIAN(1, 2, 3, 4, 5)`

---

## MIN

**Description:** Returns the smallest value in a set of values

**Syntax:** `MIN(number1, [number2], ...)`

**Category:** Statistical

**Examples:**
- `MIN(D4:D20)`

---

## MINA

**Description:** Returns the smallest value in a list of arguments, including numbers, text, and logical values

**Syntax:** `MINA(value1, [value2], ...)`

**Category:** Statistical

**Examples:**
- `MINA(A1:A10)`

---

## MINIFS

**Description:** Returns the minimum value among cells specified by a given set of conditions or criteria

**Syntax:** `MINIFS(min_range, criteria_range1, criteria1, [criteria_range2, criteria2], ...)`

**Category:** Statistical

**Examples:**
- `MINIFS(B2:B10, A2:A10, "Product", C2:C10, ">10")`

---

## MODE

**Description:** Returns the most common value in a data set

**Syntax:** `MODE(number1, [number2], ...)`

**Category:** Statistical

**Examples:**
- `MODE(A1:A10)`
- `MODE(1, 2, 2, 3, 4)`

---

## PEARSON

**Description:** Returns the Pearson product moment correlation coefficient

**Syntax:** `PEARSON(array1, array2)`

**Category:** Statistical

**Examples:**
- `PEARSON(A1:A10, B1:B10)`

---

## PERCENTILE

**Description:** [Legacy] Returns the k-th percentile of values in a range

**Syntax:** `PERCENTILE(array, k)`

**Category:** Statistical

**Examples:**
- `PERCENTILE(A1:A10, 0.75)`

---

## PERCENTILE.INC

**Description:** Returns the k-th percentile of values in a range

**Syntax:** `PERCENTILE.INC(array, k)`

**Category:** Statistical

**Examples:**
- `PERCENTILE.INC(A1:A10, 0.75)`

---

## PERCENTRANK

**Description:** [Legacy] Returns the percentage rank of a value in a data set

**Syntax:** `PERCENTRANK(array, x, [significance])`

**Category:** Statistical

**Examples:**
- `PERCENTRANK(A1:A10, 2)`
- `PERCENTRANK(A1:A10, 2, 4)`

---

## QUARTILE

**Description:** [Legacy] Returns the quartile of a data set

**Syntax:** `QUARTILE(array, quart)`

**Category:** Statistical

**Examples:**
- `QUARTILE(A1:A10, 1)`

---

## QUARTILE.INC

**Description:** Returns the quartile of a data set

**Syntax:** `QUARTILE.INC(array, quart)`

**Category:** Statistical

**Examples:**
- `QUARTILE.INC(A1:A10, 1)`

---

## RANK

**Description:** Returns the rank of a number in a list of numbers

**Syntax:** `RANK(number, ref, [order])`

**Category:** Statistical

**Examples:**
- `RANK(A2, A$1:A$10)`
- `RANK(5, {1,2,3,4,5}, 1)`

---

## RANK.AVG

**Description:** Returns the rank of a number in a list of numbers (average for ties)

**Syntax:** `RANK.AVG(number, ref, [order])`

**Category:** Statistical

**Examples:**
- `RANK.AVG(A2, A$1:A$10)`
- `RANK.AVG(5, {1,2,3,4,5}, 1)`

---

## RANK.EQ

**Description:** Returns the rank of a number in a list of numbers

**Syntax:** `RANK.EQ(number, ref, [order])`

**Category:** Statistical

**Examples:**
- `RANK.EQ(A2, A$1:A$10)`
- `RANK.EQ(5, {1,2,3,4,5}, 1)`

---

## RSQ

**Description:** Returns the square of the Pearson product moment correlation coefficient

**Syntax:** `RSQ(known_y_s, known_x_s)`

**Category:** Statistical

**Examples:**
- `RSQ(A1:A10, B1:B10)`

---

## SKEW

**Description:** Returns the skewness of a distribution

**Syntax:** `SKEW(number1, [number2], ...)`

**Category:** Statistical

**Examples:**
- `SKEW(A1:A10)`

---

## SMALL

**Description:** Returns the k-th smallest value in a data set

**Syntax:** `SMALL(array, k)`

**Category:** Statistical

**Examples:**
- `SMALL(A1:A10, 2)`

---

## STANDARDIZE

**Description:** Returns a normalized value

**Syntax:** `STANDARDIZE(x, mean, standard_dev)`

**Category:** Statistical

**Examples:**
- `STANDARDIZE(42, 40, 1.5)`

---

## STDEV

**Description:** Estimates standard deviation based on a sample

**Syntax:** `STDEV(number1, [number2], ...)`

**Category:** Statistical

**Examples:**
- `STDEV(A1:A10)`

---

## STDEV.P

**Description:** Calculates standard deviation based on the entire population

**Syntax:** `STDEV.P(number1, [number2], ...)`

**Category:** Statistical

**Examples:**
- `STDEV.P(A1:A10)`

---

## STDEV.S

**Description:** Estimates standard deviation based on a sample

**Syntax:** `STDEV.S(number1, [number2], ...)`

**Category:** Statistical

**Examples:**
- `STDEV.S(A1:A10)`

---

## STDEVP

**Description:** [Legacy] Calculates standard deviation based on the entire population

**Syntax:** `STDEVP(number1, [number2], ...)`

**Category:** Statistical

**Examples:**
- `STDEVP(A1:A10)`

---

## TRIMMEAN

**Description:** Returns the mean of the interior of a data set

**Syntax:** `TRIMMEAN(array, percent)`

**Category:** Statistical

**Examples:**
- `TRIMMEAN(A1:A10, 0.2)`

---

## VAR

**Description:** Estimates variance based on a sample

**Syntax:** `VAR(number1, [number2], ...)`

**Category:** Statistical

**Examples:**
- `VAR(A1:A10)`

---

## VAR.P

**Description:** Calculates variance based on the entire population

**Syntax:** `VAR.P(number1, [number2], ...)`

**Category:** Statistical

**Examples:**
- `VAR.P(A1:A10)`

---

## VAR.S

**Description:** Estimates variance based on a sample

**Syntax:** `VAR.S(number1, [number2], ...)`

**Category:** Statistical

**Examples:**
- `VAR.S(A1:A10)`

---

## VARP

**Description:** [Legacy] Calculates variance based on the entire population

**Syntax:** `VARP(number1, [number2], ...)`

**Category:** Statistical

**Examples:**
- `VARP(A1:A10)`

