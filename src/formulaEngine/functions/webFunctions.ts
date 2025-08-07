// Web Functions
import { FunctionRegistry } from "../FunctionRegistry";

export function registerWebFunctions(registry: FunctionRegistry) {
  registry.register(
    "ENCODEURL",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length !== 1) {
        throw new Error("ENCODEURL requires exactly 1 argument");
      }

      const text = String(args[0]);
      try {
        return encodeURIComponent(text);
      } catch {
        return "#VALUE!";
      }
    },
    {
      description: "Returns a URL-encoded string",
      syntax: "ENCODEURL(text)",
      category: "Web",
      examples: [
        'ENCODEURL("Hello World")',
        'ENCODEURL("user@example.com")',
        'ENCODEURL("a b c")',
      ],
    }
  );

  registry.register(
    "FILTERXML",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length !== 2) {
        throw new Error("FILTERXML requires exactly 2 arguments");
      }

      const xmlText = String(args[0]);
      const xpath = String(args[1]);

      try {
        // Create a DOM parser to parse the XML
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");

        // Check for parsing errors
        const parserError = xmlDoc.querySelector("parsererror");
        if (parserError) {
          return "#VALUE!";
        }

        // Simple XPath evaluation using basic DOM methods
        const result = evaluateSimpleXPath(xmlDoc, xpath);
        return result;
      } catch {
        return "#VALUE!";
      }
    },
    {
      description:
        "Returns specific data from the XML content by using the specified XPath",
      syntax: "FILTERXML(xml_text, xpath)",
      category: "Web",
      examples: [
        'FILTERXML("<root><item>value</item></root>", "//item")',
        'FILTERXML(A1, "//price")',
        'FILTERXML("<data><name>John</name></data>", "//name")',
      ],
    }
  );

  registry.register(
    "WEBSERVICE",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (args, _context) => {
      if (args.length !== 1) {
        throw new Error("WEBSERVICE requires exactly 1 argument");
      }

      const url = String(args[0]);

      try {
        // Validate URL format
        new URL(url);

        // Note: In a real implementation, this would need to handle async operations
        // For now, we'll return a placeholder that indicates the function needs async support
        return "#N/A - WEBSERVICE requires async support";
      } catch (error) {
        if (error instanceof TypeError && error.message.includes("URL")) {
          return "#VALUE! - Invalid URL";
        }
        return "#N/A - Network error";
      }
    },
    {
      description: "Returns data from a web service",
      syntax: "WEBSERVICE(url)",
      category: "Web",
      examples: [
        'WEBSERVICE("https://api.example.com/data")',
        'WEBSERVICE("https://httpbin.org/json")',
        "WEBSERVICE(A1)",
      ],
    }
  );
}

// Helper function to evaluate simple XPath expressions
function evaluateSimpleXPath(
  xmlDoc: Document,
  xpath: string
): string | string[] {
  // This is a simplified XPath evaluator for basic expressions
  // In a production environment, you might want to use a full XPath library

  try {
    // Handle simple cases like //tagname, /root/item, etc.
    if (xpath.startsWith("//")) {
      const tagName = xpath.substring(2);
      const elements = xmlDoc.getElementsByTagName(tagName);
      if (elements.length === 0) return "#N/A";
      if (elements.length === 1) return elements[0].textContent || "";

      // Return array of values if multiple elements found
      const values: string[] = [];
      for (let i = 0; i < elements.length; i++) {
        values.push(elements[i].textContent || "");
      }
      return values;
    }

    // Handle absolute paths like /root/item
    if (xpath.startsWith("/")) {
      const pathParts = xpath.split("/").filter((part) => part !== "");
      let currentElement: Element | null = xmlDoc.documentElement;

      for (const part of pathParts) {
        if (!currentElement) return "#N/A";

        // Handle array index notation like item[1]
        let tagName = part;
        let index = 0;
        const indexMatch = part.match(/^([^[]+)\[(\d+)\]$/);
        if (indexMatch) {
          tagName = indexMatch[1];
          index = parseInt(indexMatch[2]) - 1; // XPath uses 1-based indexing
        }

        const children: Element[] = Array.from(currentElement.children).filter(
          (child) => child.tagName === tagName
        );

        if (children.length === 0) return "#N/A";
        if (indexMatch) {
          if (index >= children.length) return "#N/A";
          currentElement = children[index];
        } else {
          currentElement = children[0];
        }
      }

      return currentElement?.textContent || "";
    }

    // Handle attribute selections like @attribute
    if (xpath.startsWith("@")) {
      const attrName = xpath.substring(1);
      const rootElement = xmlDoc.documentElement;
      return rootElement?.getAttribute(attrName) || "#N/A";
    }

    return "#VALUE! - Unsupported XPath expression";
  } catch {
    return "#VALUE!";
  }
}
