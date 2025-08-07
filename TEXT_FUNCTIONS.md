# Text Functions Implementation

This document describes the comprehensive implementation of Excel-compatible text functions in the React spreadsheet application.

## Functions Implemented

### Core Text Functions

#### CHAR

**Description:** Returns the character specified by the code number
**Syntax:** `CHAR(number)`
**Examples:**

- `CHAR(65)` returns `"A"`
- `CHAR(97)` returns `"a"`

#### CODE

**Description:** Returns a numeric code for the first character in a text string
**Syntax:** `CODE(text)`
**Examples:**

- `CODE("A")` returns `65`
- `CODE("a")` returns `97`

#### CLEAN

**Description:** Removes all nonprintable characters from text
**Syntax:** `CLEAN(text)`
**Examples:**

- `CLEAN("Hello\x07World")` returns `"HelloWorld"`

#### CONCAT

**Description:** Combines text from multiple cells
**Syntax:** `CONCAT(text1, [text2], ...)`
**Examples:**

- `CONCAT(A1, " ", B1)`

#### CONCATENATE

**Description:** Joins several text items into one text item
**Syntax:** `CONCATENATE(text1, [text2], ...)`
**Examples:**

- `CONCATENATE("Hello", " ", "World")` returns `"Hello World"`

### Text Extraction Functions

#### LEFT/LEFTB

**Description:** Returns the leftmost characters from a text value
**Syntax:** `LEFT(text, [num_chars])` / `LEFTB(text, [num_bytes])`
**Examples:**

- `LEFT("Hello", 3)` returns `"Hel"`

#### RIGHT/RIGHTB

**Description:** Returns the rightmost characters from a text value
**Syntax:** `RIGHT(text, [num_chars])` / `RIGHTB(text, [num_bytes])`
**Examples:**

- `RIGHT("Hello", 3)` returns `"llo"`

#### MID/MIDB

**Description:** Returns a specific number of characters from a text string
**Syntax:** `MID(text, start_num, num_chars)` / `MIDB(text, start_num, num_bytes)`
**Examples:**

- `MID("Hello World", 7, 5)` returns `"World"`

#### LEN/LENB

**Description:** Returns the number of characters in a text string
**Syntax:** `LEN(text)` / `LENB(text)`
**Examples:**

- `LEN("Hello")` returns `5`

### Text Search Functions

#### FIND/FINDB

**Description:** Finds one text value within another (case-sensitive)
**Syntax:** `FIND(find_text, within_text, [start_num])`
**Examples:**

- `FIND("World", "Hello World")` returns `7`

#### SEARCH/SEARCHB

**Description:** Finds one text value within another (case-insensitive)
**Syntax:** `SEARCH(find_text, within_text, [start_num])`
**Examples:**

- `SEARCH("world", "Hello World")` returns `7`

#### EXACT

**Description:** Checks to see if two text values are identical
**Syntax:** `EXACT(text1, text2)`
**Examples:**

- `EXACT("Word", "word")` returns `FALSE`
- `EXACT("Word", "Word")` returns `TRUE`

### Text Case Functions

#### UPPER

**Description:** Converts text to uppercase
**Syntax:** `UPPER(text)`
**Examples:**

- `UPPER("hello")` returns `"HELLO"`

#### LOWER

**Description:** Converts text to lowercase
**Syntax:** `LOWER(text)`
**Examples:**

- `LOWER("HELLO")` returns `"hello"`

#### PROPER

**Description:** Capitalizes the first letter in each word
**Syntax:** `PROPER(text)`
**Examples:**

- `PROPER("hello world")` returns `"Hello World"`

### Text Replacement Functions

#### SUBSTITUTE

**Description:** Substitutes new text for old text in a text string
**Syntax:** `SUBSTITUTE(text, old_text, new_text, [instance_num])`
**Examples:**

- `SUBSTITUTE("Hello World", "World", "Excel")` returns `"Hello Excel"`

#### REPLACE/REPLACEB

**Description:** Replaces characters within text
**Syntax:** `REPLACE(old_text, start_num, num_chars, new_text)`
**Examples:**

- `REPLACE("Hello World", 7, 5, "Excel")` returns `"Hello Excel"`

### Text Manipulation Functions

#### TRIM

**Description:** Removes spaces from text
**Syntax:** `TRIM(text)`
**Examples:**

- `TRIM("  Hello World  ")` returns `"Hello World"`

#### REPT

**Description:** Repeats text a given number of times
**Syntax:** `REPT(text, number_times)`
**Examples:**

- `REPT("*", 5)` returns `"*****"`

#### TEXTBEFORE (2024)

**Description:** Returns text that occurs before a given character or string
**Syntax:** `TEXTBEFORE(text, delimiter, [instance_num], [match_mode])`
**Examples:**

- `TEXTBEFORE("Hello World", " ")` returns `"Hello"`

#### TEXTAFTER (2024)

**Description:** Returns text that occurs after a given character or string
**Syntax:** `TEXTAFTER(text, delimiter, [instance_num], [match_mode])`
**Examples:**

- `TEXTAFTER("Hello World", " ")` returns `"World"`

#### TEXTJOIN (2019)

**Description:** Combines text from multiple ranges and/or strings
**Syntax:** `TEXTJOIN(delimiter, ignore_empty, text1, [text2], ...)`
**Examples:**

- `TEXTJOIN(", ", TRUE, "Apple", "Orange", "", "Banana")` returns `"Apple, Orange, Banana"`

#### TEXTSPLIT (2024)

**Description:** Splits text strings by using column and row delimiters
**Syntax:** `TEXTSPLIT(text, col_delimiter, [row_delimiter], [ignore_empty])`
**Examples:**

- `TEXTSPLIT("A,B,C", ",")` returns `["A", "B", "C"]`

### Formatting Functions

#### TEXT

**Description:** Formats a number and converts it to text
**Syntax:** `TEXT(value, format_text)`
**Examples:**

- `TEXT(1234.567, "0.00")` returns `"1234.57"`

#### FIXED

**Description:** Formats a number as text with a fixed number of decimals
**Syntax:** `FIXED(number, [decimals], [no_commas])`
**Examples:**

- `FIXED(1234.567, 1)` returns `"1,234.6"`

#### DOLLAR

**Description:** Converts a number to text using dollar currency format
**Syntax:** `DOLLAR(number, [decimals])`
**Examples:**

- `DOLLAR(1234.567)` returns `"$1,234.57"`

### Conversion Functions

#### VALUE

**Description:** Converts a text string that represents a number to a number
**Syntax:** `VALUE(text)`
**Examples:**

- `VALUE("123")` returns `123`

#### NUMBERVALUE (2013)

**Description:** Converts text to number in a locale-independent manner
**Syntax:** `NUMBERVALUE(text, [decimal_separator], [group_separator])`
**Examples:**

- `NUMBERVALUE("1,234.56")` returns `1234.56`
- `NUMBERVALUE("50%")` returns `0.5`

#### T

**Description:** Converts its arguments to text
**Syntax:** `T(value)`
**Examples:**

- `T("Hello")` returns `"Hello"`
- `T(123)` returns `""`

### Unicode Functions (2013)

#### UNICHAR

**Description:** Returns the Unicode character referenced by the given numeric value
**Syntax:** `UNICHAR(number)`
**Examples:**

- `UNICHAR(65)` returns `"A"`
- `UNICHAR(8364)` returns `"€"`

#### UNICODE

**Description:** Returns the number (code point) that corresponds to the first character
**Syntax:** `UNICODE(text)`
**Examples:**

- `UNICODE("A")` returns `65`
- `UNICODE("€")` returns `8364`

### Array Functions (2021)

#### ARRAYTOTEXT

**Description:** Returns an array of text values from any specified range
**Syntax:** `ARRAYTOTEXT(array, [format])`
**Examples:**

- `ARRAYTOTEXT({1,2,3})` returns `"1, 2, 3"`

#### VALUETOTEXT

**Description:** Returns text from any specified value
**Syntax:** `VALUETOTEXT(value, [format])`
**Examples:**

- `VALUETOTEXT(123)` returns `"123"`

### Regular Expression Functions (Microsoft 365)

#### REGEXTEST

**Description:** Determines whether any part of text matches the pattern
**Syntax:** `REGEXTEST(text, pattern)`
**Examples:**

- `REGEXTEST("Hello123", "\\d+")` returns `TRUE`

#### REGEXEXTRACT

**Description:** Extracts strings that match the pattern
**Syntax:** `REGEXEXTRACT(text, pattern)`
**Examples:**

- `REGEXEXTRACT("Hello123World", "\\d+")` returns `"123"`

#### REGEXREPLACE

**Description:** Replaces strings that match the pattern with replacement
**Syntax:** `REGEXREPLACE(text, pattern, replacement)`
**Examples:**

- `REGEXREPLACE("Hello123World", "\\d+", "XXX")` returns `"HelloXXXWorld"`

### Special Character Functions

#### ASC

**Description:** Changes full-width characters to half-width characters
**Syntax:** `ASC(text)`
**Note:** Simplified implementation

#### DBCS (2013)

**Description:** Changes half-width characters to full-width characters
**Syntax:** `DBCS(text)`
**Note:** Simplified implementation

#### PHONETIC

**Description:** Extracts phonetic (furigana) characters from text
**Syntax:** `PHONETIC(text)`
**Note:** Simplified implementation

#### BAHTTEXT

**Description:** Converts a number to text using Thai baht currency format
**Syntax:** `BAHTTEXT(number)`
**Examples:**

- `BAHTTEXT(1234.56)` returns `"1234.56 Baht"`

### Microsoft 365 API Functions

#### DETECTLANGUAGE

**Description:** Identifies the language of specified text
**Syntax:** `DETECTLANGUAGE(text)`
**Note:** Requires Microsoft 365 API (placeholder implementation)

#### TRANSLATE

**Description:** Translates text from one language to another
**Syntax:** `TRANSLATE(text, from_language, to_language)`
**Note:** Requires Microsoft 365 API (placeholder implementation)

## Implementation Notes

### Categories

- **Core Functions**: Basic text operations and character handling
- **Extraction Functions**: LEFT, RIGHT, MID variants
- **Search Functions**: FIND, SEARCH, EXACT
- **Case Functions**: UPPER, LOWER, PROPER
- **Replacement Functions**: SUBSTITUTE, REPLACE
- **Formatting Functions**: TEXT, FIXED, DOLLAR
- **Unicode Support**: UNICHAR, UNICODE functions
- **Regex Support**: Basic regex functionality
- **Advanced Features**: Array handling, splitting, joining

### Error Handling

All functions follow Excel's error handling patterns:

- `#VALUE!` for invalid input or processing errors
- `#N/A` for missing data
- Proper argument count validation

### Browser Compatibility

- **Basic Functions**: Universal support
- **Unicode Functions**: Modern browser support required
- **Regex Functions**: ES2015+ support required
- **API Functions**: Require external service integration

### Testing

Functions can be tested in the spreadsheet by entering formulas like:

- `=CHAR(65)` → `"A"`
- `=TEXTJOIN(", ", TRUE, "A", "B", "C")` → `"A, B, C"`
- `=REGEXTEST("Hello123", "\\d+")` → `TRUE`

## Performance Considerations

- **Simple Functions**: Optimized for speed
- **Complex Functions**: May require caching for large datasets
- **Regex Functions**: Performance depends on pattern complexity
- **Array Functions**: Memory usage scales with array size

The implementation provides comprehensive Excel compatibility while maintaining good performance for typical spreadsheet operations.
