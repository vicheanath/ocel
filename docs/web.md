# Web Functions

Functions for web-based operations and data retrieval.

*This document contains 3 functions.*

---

## ENCODEURL

**Description:** Returns a URL-encoded string

**Syntax:** `ENCODEURL(text)`

**Category:** Web

**Examples:**
- `ENCODEURL("Hello World")`
- `ENCODEURL("user@example.com")`
- `ENCODEURL("a b c")`

---

## FILTERXML

**Description:** Returns specific data from the XML content by using the specified XPath

**Syntax:** `FILTERXML(xml_text, xpath)`

**Category:** Web

**Examples:**
- `FILTERXML("<root><item>value</item></root>", "//item")`
- `FILTERXML(A1, "//price")`
- `FILTERXML("<data><name>John</name></data>", "//name")`

---

## WEBSERVICE

**Description:** Returns data from a web service

**Syntax:** `WEBSERVICE(url)`

**Category:** Web

**Examples:**
- `WEBSERVICE("https://api.example.com/data")`
- `WEBSERVICE("https://httpbin.org/json")`

