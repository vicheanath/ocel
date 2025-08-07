# Text Functions Test Cases

This file contains test cases to verify the implementation of text functions in the spreadsheet.

## Basic Text Function Tests

### Character Functions

- `=CHAR(65)` should return `"A"`
- `=CHAR(97)` should return `"a"`
- `=CODE("A")` should return `65`
- `=CODE("a")` should return `97`

### Text Cleaning

- `=CLEAN("Hello World")` should return `"Hello World"`
- `=TRIM("  Hello  World  ")` should return `"Hello World"`

### Text Comparison

- `=EXACT("Word", "word")` should return `FALSE`
- `=EXACT("Word", "Word")` should return `TRUE`

### Formatting Functions

- `=FIXED(1234.567, 1)` should return `"1,234.6"`
- `=FIXED(1234.567, 1, TRUE)` should return `"1234.6"`
- `=DOLLAR(1234.567)` should return `"$1,234.57"`
- `=DOLLAR(-1234.567, 1)` should return `"($1234.6)"`

### Text Joining

- `=TEXTJOIN(", ", TRUE, "Apple", "Orange", "", "Banana")` should return `"Apple, Orange, Banana"`
- `=TEXTJOIN("-", FALSE, "A", "B", "C")` should return `"A-B-C"`

### Text Splitting

- `=TEXTSPLIT("A,B,C", ",")` should return array `["A", "B", "C"]`
- `=TEXTSPLIT("A,B;C,D", ",", ";")` should return array `["A", "B", "C", "D"]`

### Unicode Functions

- `=UNICHAR(65)` should return `"A"`
- `=UNICHAR(8364)` should return `"€"`
- `=UNICODE("A")` should return `65`
- `=UNICODE("€")` should return `8364`

### Number Conversion

- `=NUMBERVALUE("1,234.56")` should return `1234.56`
- `=NUMBERVALUE("50%")` should return `0.5`
- `=NUMBERVALUE("1.234,56", ",", ".")` should return `1234.56`

### Type Conversion

- `=T("Hello")` should return `"Hello"`
- `=T(123)` should return `""`
- `=VALUE("123.45")` should return `123.45`

### Regular Expressions

- `=REGEXTEST("Hello123", "\\d+")` should return `TRUE`
- `=REGEXTEST("Hello", "\\d+")` should return `FALSE`
- `=REGEXEXTRACT("Hello123World", "\\d+")` should return `"123"`
- `=REGEXREPLACE("Hello123World", "\\d+", "XXX")` should return `"HelloXXXWorld"`

### Array Functions

- `=ARRAYTOTEXT({1,2,3})` should return `"1, 2, 3"`
- `=VALUETOTEXT(123)` should return `"123"`
- `=VALUETOTEXT(TRUE, 1)` should return `"true"`

## Advanced Test Cases

### Complex Text Operations

- `=TEXTBEFORE("user@example.com", "@")` should return `"user"`
- `=TEXTAFTER("user@example.com", "@")` should return `"example.com"`
- `=SUBSTITUTE("Hello World Hello", "Hello", "Hi", 1)` should return `"Hi World Hello"`

### Case Sensitivity Tests

- `=FIND("world", "Hello World")` should return `#VALUE!` (case-sensitive)
- `=SEARCH("world", "Hello World")` should return `7` (case-insensitive)

### Error Cases

- `=CHAR(256)` should return `#VALUE!` (out of range)
- `=CODE("")` should return `#VALUE!` (empty string)
- `=UNICHAR(0)` should return `#VALUE!` (invalid code point)

### Formatting Edge Cases

- `=FIXED(0, 0)` should return `"0"`
- `=DOLLAR(0)` should return `"$0.00"`
- `=TEXT(1234, "0.00")` should return `"1234.00"`

## Web Functions Tests

### URL Encoding

- `=ENCODEURL("Hello World")` should return `"Hello%20World"`
- `=ENCODEURL("user@example.com")` should return `"user%40example.com"`

### XML Processing

- `=FILTERXML("<root><item>value</item></root>", "//item")` should return `"value"`
- `=FILTERXML("<data><name>John</name><age>30</age></data>", "//name")` should return `"John"`

### Web Services (Placeholder)

- `=WEBSERVICE("https://httpbin.org/json")` should return placeholder message

## Performance Tests

### Large Text Operations

Test with large strings to verify performance:

- `=REPT("A", 1000)` should return 1000 A's
- `=LEN(REPT("Hello", 200))` should return `1000`

### Regex Performance

Test regex functions with various patterns:

- `=REGEXTEST(REPT("Hello123", 100), "\\d+")`
- `=REGEXREPLACE(REPT("abc123", 50), "\\d+", "XXX")`

## Usage Instructions

1. Open the React spreadsheet application
2. Enter the test formulas in different cells
3. Verify the results match the expected outputs
4. Test error cases to ensure proper error handling
5. Test edge cases and performance with large data

## Expected Behavior

All functions should:

- Return correct results for valid inputs
- Return appropriate error values (`#VALUE!`, `#N/A`) for invalid inputs
- Handle edge cases gracefully
- Maintain Excel compatibility where possible
- Perform efficiently for typical use cases
