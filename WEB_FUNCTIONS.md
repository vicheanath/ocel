# Web Functions Implementation

This document describes the implementation of three Excel-compatible web functions in the React spreadsheet application.

## Functions Implemented

### ENCODEURL (2013)

**Description:** Returns a URL-encoded string

**Syntax:** `ENCODEURL(text)`

**Parameters:**

- `text`: The text to be URL-encoded

**Examples:**

- `ENCODEURL("Hello World")` returns `"Hello%20World"`
- `ENCODEURL("user@example.com")` returns `"user%40example.com"`
- `ENCODEURL("a b c")` returns `"a%20b%20c"`

**Implementation Notes:**

- Uses JavaScript's built-in `encodeURIComponent()` function
- Returns `#VALUE!` if encoding fails

### FILTERXML (2013)

**Description:** Returns specific data from the XML content by using the specified XPath

**Syntax:** `FILTERXML(xml_text, xpath)`

**Parameters:**

- `xml_text`: The XML content as text
- `xpath`: The XPath expression to filter the XML data

**Examples:**

- `FILTERXML("<root><item>value</item></root>", "//item")` returns `"value"`
- `FILTERXML("<data><name>John</name></data>", "//name")` returns `"John"`

**Supported XPath Expressions:**

- `//tagname` - Find all elements with the specified tag name
- `/root/item` - Absolute path from root
- `/root/item[1]` - Array index notation (1-based)
- `@attribute` - Attribute selection (root element only)

**Implementation Notes:**

- Uses browser's native DOMParser
- Supports basic XPath expressions (not full XPath specification)
- Returns `#VALUE!` for malformed XML or invalid XPath
- Returns `#N/A` if no matching elements found
- Returns array of values if multiple elements match

### WEBSERVICE (2013)

**Description:** Returns data from a web service

**Syntax:** `WEBSERVICE(url)`

**Parameters:**

- `url`: The URL of the web service

**Examples:**

- `WEBSERVICE("https://api.example.com/data")`
- `WEBSERVICE("https://httpbin.org/json")`

**Implementation Notes:**

- **Current Status:** Placeholder implementation that validates URL format
- Returns `#N/A - WEBSERVICE requires async support` for valid URLs
- Returns `#VALUE! - Invalid URL` for malformed URLs
- **Future Enhancement:** Full implementation would require async formula evaluation support

## Technical Implementation

### File Structure

```
src/formulaEngine/functions/webFunctions.ts
```

### Registration

The functions are registered in `FunctionRegistry.ts` and automatically available in the spreadsheet.

### Error Handling

All functions follow Excel's error handling patterns:

- `#VALUE!` for invalid input or processing errors
- `#N/A` for missing data or network errors
- Descriptive error messages where appropriate

### Browser Compatibility

- **ENCODEURL**: Universal browser support
- **FILTERXML**: Requires DOMParser support (modern browsers)
- **WEBSERVICE**: Requires fetch API support (modern browsers)

### Security Considerations

- WEBSERVICE function should implement CORS handling
- URL validation prevents some malicious inputs
- Consider implementing request timeouts and size limits for production use

## Testing

The functions can be tested by entering formulas in the spreadsheet:

1. **ENCODEURL Test:**

   ```
   =ENCODEURL("Hello World!")
   ```

2. **FILTERXML Test:**

   ```
   =FILTERXML("<books><book>Harry Potter</book><book>Lord of the Rings</book></books>", "//book")
   ```

3. **WEBSERVICE Test:**
   ```
   =WEBSERVICE("https://httpbin.org/json")
   ```
   (Currently returns placeholder message)
