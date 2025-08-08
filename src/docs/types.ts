// Auto-generated types for function documentation
// Generated on: 2025-08-08T00:17:43.099Z

export interface FunctionDoc {
  name: string;
  description: string;
  syntax: string;
  category: string;
  examples: string[];
  sourceFile: string;
}

export interface CategoryDoc {
  name: string;
  displayName: string;
  functions: FunctionDoc[];
  description: string;
}

export interface DocsData {
  categories: CategoryDoc[];
  totalFunctions: number;
  lastUpdated: string;
}

// Function categories for easy reference
export const FUNCTION_CATEGORIES = [
  {
    "name": "database",
    "displayName": "Database",
    "description": "Functions for working with structured data tables and performing database-like operations.",
    "count": 10
  },
  {
    "name": "date-time",
    "displayName": "Date & Time",
    "description": "Functions for date and time calculations, formatting, and manipulation.",
    "count": 23
  },
  {
    "name": "engineering",
    "displayName": "Engineering",
    "description": "Specialized functions for engineering calculations and number system conversions.",
    "count": 26
  },
  {
    "name": "financial",
    "displayName": "Financial",
    "description": "Functions for financial calculations including loans, investments, and cash flows.",
    "count": 26
  },
  {
    "name": "information",
    "displayName": "Information",
    "description": "Functions for testing cell contents and retrieving information about data types.",
    "count": 22
  },
  {
    "name": "legacy",
    "displayName": "Legacy",
    "description": "Compatibility functions maintained for backward compatibility.",
    "count": 13
  },
  {
    "name": "logical",
    "displayName": "Logical",
    "description": "Functions for logical operations and conditional testing.",
    "count": 19
  },
  {
    "name": "lookup-reference",
    "displayName": "Lookup & Reference",
    "description": "Functions for searching and referencing data within tables and ranges.",
    "count": 9
  },
  {
    "name": "math-trigonometry",
    "displayName": "Math & Trigonometry",
    "description": "Mathematical and trigonometric functions for calculations and analysis.",
    "count": 49
  },
  {
    "name": "statistical",
    "displayName": "Statistical",
    "description": "Functions for statistical analysis and probability calculations.",
    "count": 49
  },
  {
    "name": "text",
    "displayName": "Text",
    "description": "Functions for text manipulation, formatting, and string operations.",
    "count": 49
  },
  {
    "name": "web",
    "displayName": "Web",
    "description": "Functions for web-based operations and data retrieval.",
    "count": 3
  }
] as const;
