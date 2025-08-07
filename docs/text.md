# Text Functions

Functions for text manipulation, formatting, and string operations.

*This document contains 49 functions.*

---

## ARRAYTOTEXT

**Description:** Returns an array of text values from any specified range

**Syntax:** `ARRAYTOTEXT(array, [format])`

**Category:** Text

**Examples:**
- `ARRAYTOTEXT({1,2,3})`

---

## ASC

**Description:** Changes full-width (double-byte) English letters or katakana within a character string to half-width (single-byte) characters

**Syntax:** `ASC(text)`

**Category:** Text

**Examples:**
- `ASC("Ａ")`

---

## BAHTTEXT

**Description:** Converts a number to text, using the ß (baht) currency format

**Syntax:** `BAHTTEXT(number)`

**Category:** Text

**Examples:**
- `BAHTTEXT(1234.56)`

---

## CHAR

**Description:** Returns the character specified by the code number

**Syntax:** `CHAR(number)`

**Category:** Text

**Examples:**
- `CHAR(65)`
- `CHAR(97)`

---

## CLEAN

**Description:** Removes all nonprintable characters from text

**Syntax:** `CLEAN(text)`

**Category:** Text

**Examples:**
- `CLEAN("Hello\x07World")`

---

## CODE

**Description:** Returns a numeric code for the first character in a text string

**Syntax:** `CODE(text)`

**Category:** Text

**Examples:**
- `CODE("A")`
- `CODE("a")`

---

## CONCAT

**Description:** Combines text from multiple cells

**Syntax:** `CONCAT(text1, [text2], ...)`

**Category:** Text

**Examples:**
- `CONCAT(A1, " ", B1)`

---

## CONCATENATE

**Description:** Joins several text items into one text item

**Syntax:** `CONCATENATE(text1, [text2], ...)`

**Category:** Text

**Examples:**
- `CONCATENATE("Hello", " ", "World")`

---

## DBCS

**Description:** Changes half-width (single-byte) English letters or katakana within a character string to full-width (double-byte) characters

**Syntax:** `DBCS(text)`

**Category:** Text

**Examples:**
- `DBCS("A")`

---

## DETECTLANGUAGE

**Description:** Identifies the language of a specified text

**Syntax:** `DETECTLANGUAGE(text)`

**Category:** Text

**Examples:**
- `DETECTLANGUAGE("Hello World")`

---

## DOLLAR

**Description:** Converts a number to text, using the $ (dollar) currency format

**Syntax:** `DOLLAR(number, [decimals])`

**Category:** Text

**Examples:**
- `DOLLAR(1234.567)`
- `DOLLAR(-1234.567, 1)`

---

## EXACT

**Description:** Checks to see if two text values are identical

**Syntax:** `EXACT(text1, text2)`

**Category:** Text

**Examples:**
- `EXACT("Word", "word")`
- `EXACT("Word", "Word")`

---

## FIND

**Description:** Finds one text value within another (case-sensitive)

**Syntax:** `FIND(find_text, within_text, [start_num])`

**Category:** Text

**Examples:**
- `FIND("World", "Hello World")`
- `FIND("o", A1, 2)`

---

## FINDB

**Description:** Finds one text value within another (case-sensitive, byte-based)

**Syntax:** `FINDB(find_text, within_text, [start_num])`

**Category:** Text

**Examples:**
- `FINDB("World", "Hello World")`

---

## FIXED

**Description:** Formats a number as text with a fixed number of decimals

**Syntax:** `FIXED(number, [decimals], [no_commas])`

**Category:** Text

**Examples:**
- `FIXED(1234.567, 1)`
- `FIXED(1234.567, 1, TRUE)`

---

## LEFT

**Description:** Returns the leftmost characters from a text value

**Syntax:** `LEFT(text, [num_chars])`

**Category:** Text

**Examples:**
- `LEFT("Hello", 3)`

---

## LEFTB

**Description:** Returns the leftmost characters from a text value (byte-based)

**Syntax:** `LEFTB(text, [num_bytes])`

**Category:** Text

**Examples:**
- `LEFTB("Hello", 3)`

---

## LEN

**Description:** Returns the number of characters in a text string

**Syntax:** `LEN(text)`

**Category:** Text

**Examples:**
- `LEN("Hello")`

---

## LENB

**Description:** Returns the number of bytes in a text string

**Syntax:** `LENB(text)`

**Category:** Text

**Examples:**
- `LENB("Hello")`

---

## LOWER

**Description:** Converts text to lowercase

**Syntax:** `LOWER(text)`

**Category:** Text

**Examples:**
- `LOWER("HELLO")`

---

## MID

**Description:** Returns a specific number of characters from a text string

**Syntax:** `MID(text, start_num, num_chars)`

**Category:** Text

**Examples:**
- `MID("Hello World", 7, 5)`

---

## MIDB

**Description:** Returns a specific number of characters from a text string starting at the position you specify (byte-based)

**Syntax:** `MIDB(text, start_num, num_bytes)`

**Category:** Text

**Examples:**
- `MIDB("Hello World", 7, 5)`

---

## NUMBERVALUE

**Description:** Converts text to number in a locale-independent manner

**Syntax:** `NUMBERVALUE(text, [decimal_separator], [group_separator])`

**Category:** Text

**Examples:**
- `NUMBERVALUE("1,234.56")`
- `NUMBERVALUE("1.234,56", ",", ".")`
- `NUMBERVALUE("50%")`

---

## PHONETIC

**Description:** Extracts the phonetic (furigana) characters from a text string

**Syntax:** `PHONETIC(text)`

**Category:** Text

**Examples:**
- `PHONETIC("東京")`

---

## PROPER

**Description:** Capitalizes the first letter in each word of a text value

**Syntax:** `PROPER(text)`

**Category:** Text

**Examples:**
- `PROPER("hello world")`

---

## REGEXEXTRACT

**Description:** Extracts strings within the provided text that matches the pattern

**Syntax:** `REGEXEXTRACT(text, pattern)`

**Category:** Text

**Examples:**
- `REGEXEXTRACT("Hello123World", "\\d+")`

---

## REGEXREPLACE

**Description:** Replaces strings within the provided text that matches the pattern with replacement

**Syntax:** `REGEXREPLACE(text, pattern, replacement)`

**Category:** Text

**Examples:**
- `REGEXREPLACE("Hello123World", "\\d+", "XXX")`

---

## REGEXTEST

**Description:** Determines whether any part of text matches the pattern

**Syntax:** `REGEXTEST(text, pattern)`

**Category:** Text

**Examples:**
- `REGEXTEST("Hello123", "\\d+")`

---

## REPLACE

**Description:** Replaces characters within text

**Syntax:** `REPLACE(old_text, start_num, num_chars, new_text)`

**Category:** Text

**Examples:**
- `REPLACE("Hello World", 7, 5, "Excel")`
- `REPLACE(A1, 1, 3, "ABC")`

---

## REPLACEB

**Description:** Replaces characters within text (byte-based)

**Syntax:** `REPLACEB(old_text, start_num, num_bytes, new_text)`

**Category:** Text

**Examples:**
- `REPLACEB("Hello World", 7, 5, "Excel")`

---

## REPT

**Description:** Repeats text a given number of times

**Syntax:** `REPT(text, number_times)`

**Category:** Text

**Examples:**
- `REPT("*", 5)`

---

## RIGHT

**Description:** Returns the rightmost characters from a text value

**Syntax:** `RIGHT(text, [num_chars])`

**Category:** Text

**Examples:**
- `RIGHT("Hello", 3)`

---

## RIGHTB

**Description:** Returns the rightmost characters from a text value (byte-based)

**Syntax:** `RIGHTB(text, [num_bytes])`

**Category:** Text

**Examples:**
- `RIGHTB("Hello", 3)`

---

## SEARCH

**Description:** Finds one text value within another (case-insensitive)

**Syntax:** `SEARCH(find_text, within_text, [start_num])`

**Category:** Text

**Examples:**
- `SEARCH("world", "Hello World")`
- `SEARCH("O", A1, 2)`

---

## SEARCHB

**Description:** Finds one text value within another (case-insensitive, byte-based)

**Syntax:** `SEARCHB(find_text, within_text, [start_num])`

**Category:** Text

**Examples:**
- `SEARCHB("world", "Hello World")`

---

## SUBSTITUTE

**Description:** Substitutes new text for old text in a text string

**Syntax:** `SUBSTITUTE(text, old_text, new_text, [instance_num])`

**Category:** Text

**Examples:**
- `SUBSTITUTE("Hello World", "World", "Excel")`
- `SUBSTITUTE(A1, "old", "new", 1)`

---

## T

**Description:** Converts its arguments to text

**Syntax:** `T(value)`

**Category:** Text

**Examples:**
- `T("Hello")`

---

## TEXT

**Description:** Formats a number and converts it to text

**Syntax:** `TEXT(value, format_text)`

**Category:** Text

**Examples:**
- `TEXT(1234.567, "0.00")`
- `TEXT(0.75, "0%")`

---

## TEXTAFTER

**Description:** Returns text that occurs after a given character or string

**Syntax:** `TEXTAFTER(text, delimiter, [instance_num], [match_mode])`

**Category:** Text

**Examples:**
- `TEXTAFTER("Hello World", " ")`
- `TEXTAFTER("A-B-C", "-", 1)`

---

## TEXTBEFORE

**Description:** Returns text that occurs before a given character or string

**Syntax:** `TEXTBEFORE(text, delimiter, [instance_num], [match_mode])`

**Category:** Text

**Examples:**
- `TEXTBEFORE("Hello World", " ")`
- `TEXTBEFORE("A-B-C", "-", 2)`

---

## TEXTJOIN

**Description:** Combines the text from multiple ranges and/or strings

**Syntax:** `TEXTJOIN(delimiter, ignore_empty, text1, [text2], ...)`

**Category:** Text

**Examples:**
- `TEXTJOIN(", ", TRUE, "Apple", "Orange", "", "Banana")`
- `TEXTJOIN("-", FALSE, A1:A3)`

---

## TEXTSPLIT

**Description:** Splits text strings by using column and row delimiters

**Syntax:** `TEXTSPLIT(text, col_delimiter, [row_delimiter], [ignore_empty])`

**Category:** Text

**Examples:**
- `TEXTSPLIT("A,B,C", ",")`
- `TEXTSPLIT("A,B;C,D", ",", ";")`

---

## TRANSLATE

**Description:** Translates a text from one language to another

**Syntax:** `TRANSLATE(text, from_language, to_language)`

**Category:** Text

**Examples:**
- `TRANSLATE("Hello", "en", "es")`

---

## TRIM

**Description:** Removes spaces from text

**Syntax:** `TRIM(text)`

**Category:** Text

**Examples:**
- `TRIM("  Hello World  ")`

---

## UNICHAR

**Description:** Returns the Unicode character that is referenced by the given numeric value

**Syntax:** `UNICHAR(number)`

**Category:** Text

**Examples:**
- `UNICHAR(65)`
- `UNICHAR(8364)`

---

## UNICODE

**Description:** Returns the number (code point) that corresponds to the first character of the text

**Syntax:** `UNICODE(text)`

**Category:** Text

**Examples:**
- `UNICODE("A")`
- `UNICODE("€")`

---

## UPPER

**Description:** Converts text to uppercase

**Syntax:** `UPPER(text)`

**Category:** Text

**Examples:**
- `UPPER("hello")`

---

## VALUE

**Description:** Converts a text string that represents a number to a number

**Syntax:** `VALUE(text)`

**Category:** Text

**Examples:**
- `VALUE("123")`
- `VALUE("3.14")`

---

## VALUETOTEXT

**Description:** Returns text from any specified value

**Syntax:** `VALUETOTEXT(value, [format])`

**Category:** Text

**Examples:**
- `VALUETOTEXT(123)`
- `VALUETOTEXT(TRUE, 1)`

