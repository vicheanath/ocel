# Legacy Functions

Compatibility functions maintained for backward compatibility.

*This document contains 13 functions.*

---

## BETADIST

**Description:** [Legacy] Returns the beta cumulative distribution function

**Syntax:** `BETADIST(x, alpha, beta, [A], [B])`

**Category:** Statistical

**Examples:**
- `BETADIST(2, 8, 10, 1, 3)`

---

## BINOMDIST

**Description:** [Legacy] Returns the individual term binomial distribution probability

**Syntax:** `BINOMDIST(number_s, trials, probability_s, cumulative)`

**Category:** Statistical

**Examples:**
- `BINOMDIST(6, 10, 0.5, FALSE)`

---

## CHIDIST

**Description:** [Legacy] Returns the one-tailed probability of the chi-squared distribution

**Syntax:** `CHIDIST(x, degrees_freedom)`

**Category:** Statistical

**Examples:**
- `CHIDIST(18.307, 10)`

---

## CRITBINOM

**Description:** [Legacy] Returns the smallest value for which the cumulative binomial distribution is less than or equal to a criterion value

**Syntax:** `CRITBINOM(trials, probability_s, alpha)`

**Category:** Statistical

**Examples:**
- `CRITBINOM(6, 0.5, 0.75)`

---

## EXPONDIST

**Description:** [Legacy] Returns the exponential distribution

**Syntax:** `EXPONDIST(x, lambda, cumulative)`

**Category:** Statistical

**Examples:**
- `EXPONDIST(0.2, 10, TRUE)`

---

## NORMDIST

**Description:** [Legacy] Returns the normal cumulative distribution

**Syntax:** `NORMDIST(x, mean, standard_dev, cumulative)`

**Category:** Statistical

**Examples:**
- `NORMDIST(42, 40, 1.5, TRUE)`

---

## NORMINV

**Description:** [Legacy] Returns the inverse of the normal cumulative distribution

**Syntax:** `NORMINV(probability, mean, standard_dev)`

**Category:** Statistical

**Examples:**
- `NORMINV(0.908789, 40, 1.5)`

---

## NORMSDIST

**Description:** [Legacy] Returns the standard normal cumulative distribution

**Syntax:** `NORMSDIST(z)`

**Category:** Statistical

**Examples:**
- `NORMSDIST(1.333333)`

---

## NORMSINV

**Description:** [Legacy] Returns the inverse of the standard normal cumulative distribution

**Syntax:** `NORMSINV(probability)`

**Category:** Statistical

**Examples:**
- `NORMSINV(0.908789)`

---

## POISSON

**Description:** [Legacy] Returns the Poisson distribution

**Syntax:** `POISSON(x, mean, cumulative)`

**Category:** Statistical

**Examples:**
- `POISSON(2, 5, TRUE)`

---

## TTEST

**Description:** [Legacy] Returns the probability associated with a Student's t-test

**Syntax:** `TTEST(array1, array2, tails, type)`

**Category:** Statistical

**Examples:**
- `TTEST(A1:A10, B1:B10, 2, 1)`

---

## WEIBULL

**Description:** [Legacy] Returns the Weibull distribution

**Syntax:** `WEIBULL(x, alpha, beta, cumulative)`

**Category:** Statistical

**Examples:**
- `WEIBULL(105, 20, 100, TRUE)`

---

## ZTEST

**Description:** [Legacy] Returns the one-tailed probability-value of a z-test

**Syntax:** `ZTEST(array, x, [sigma])`

**Category:** Statistical

**Examples:**
- `ZTEST(A1:A10, 4)`
- `ZTEST(A1:A10, 4, 1)`

