#!/usr/bin/env node

/**
 * Script to generate markdown documentation for database functions
 * Usage: node scripts/generateDatabaseFunctionsDocs.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the database functions file
const databaseFunctionsPath = path.join(
  __dirname,
  "../src/formulaEngine/functions/databaseFunctions.ts"
);
const databaseFunctionsContent = fs.readFileSync(databaseFunctionsPath, "utf8");

// Parse function registrations
function parseFunctions(content) {
  const functions = [];

  // Split into individual registry.register blocks
  const registerBlocks = content.split("registry.register(").slice(1);

  registerBlocks.forEach((block) => {
    // Find the function name
    const nameMatch = block.match(/^\s*"([^"]+)"/);
    if (!nameMatch) return;
    const name = nameMatch[1];

    // Find the metadata object - improved regex to handle multiline
    const metadataMatch = block.match(
      /{\s*description:\s*"([^"]*)",\s*syntax:\s*"([^"]*)",\s*category:\s*"([^"]*)",\s*examples:\s*\[([\s\S]*?)\]/
    );
    if (!metadataMatch) return;

    const [, description, syntax, category, examplesStr] = metadataMatch;

    // Parse examples - handle quotes better
    const examples = [];
    const exampleMatches =
      examplesStr.match(/'([^']*)'/g) || examplesStr.match(/"([^"]*)"/g) || [];
    exampleMatches.forEach((match) => {
      const cleaned = match.replace(/^['"]|['"]$/g, "");
      if (cleaned.length > 0) {
        examples.push(cleaned);
      }
    });

    functions.push({
      name,
      description,
      syntax,
      category,
      examples,
    });
  });

  return functions;
}

// Generate markdown content
function generateMarkdown(functions) {
  let markdown = `# Database Functions Documentation

This document provides comprehensive documentation for all database functions available in the React Sheet application.

## Overview

Database functions in Excel are designed to work with structured data tables (databases) and allow you to extract information, perform calculations, and analyze data based on specified criteria.

## Function Reference

`;

  functions.forEach((func, index) => {
    markdown += `### ${func.name}

**Description:** ${func.description}

**Syntax:** \`${func.syntax}\`

**Category:** ${func.category}

**Parameters:**
- \`database\`: The range of cells that makes up the list or database
- \`field\`: Indicates which column is used in the function (column name or index)
- \`criteria\`: The range of cells that contains the conditions you specify

**Examples:**
${func.examples.map((example) => `- \`${example}\``).join("\n")}

**Usage Notes:**
- The database parameter should be a range that includes column headers
- The field parameter can be either a column name (in quotes) or a column index number
- The criteria range should include at least one column header and one condition

`;

    if (index < functions.length - 1) {
      markdown += "---\n\n";
    }
  });

  // Add additional sections
  markdown += `
## Database Function Categories

All database functions follow a similar pattern and work with three main parameters:

1. **Database Range**: A table of data with headers in the first row
2. **Field**: The column to perform the operation on
3. **Criteria**: Conditions that determine which records to include

## Common Use Cases

### Data Analysis
- Use \`DSUM\`, \`DAVERAGE\`, \`DMAX\`, and \`DMIN\` for statistical analysis of subsets of data
- Use \`DCOUNT\` and \`DCOUNTA\` for counting records that meet specific criteria

### Data Validation
- Use \`DGET\` to retrieve a single value when you know only one record should match
- Use \`DCOUNT\` to verify the number of matching records before using \`DGET\`

### Statistical Analysis
- Use \`DSTDEV\` and \`DVAR\` for calculating standard deviation and variance of data subsets

## Best Practices

1. **Always use column headers**: Database functions require the first row of your database range to contain column headers
2. **Set up criteria ranges properly**: Create a separate area with column headers and criteria values
3. **Use exact field names**: When using field names (strings), ensure they exactly match the column headers
4. **Handle empty results**: Be prepared for functions to return 0 or throw errors when no matching records are found

## Example Database Structure

\`\`\`
| Name    | Department | Salary | Years |
|---------|------------|--------|-------|
| Alice   | Sales      | 50000  | 3     |
| Bob     | Marketing  | 45000  | 2     |
| Charlie | Sales      | 55000  | 5     |
| Diana   | IT         | 60000  | 4     |
\`\`\`

## Example Criteria Structure

\`\`\`
| Department |
|------------|
| Sales      |
\`\`\`

With this setup, you could use:
- \`DSUM(A1:D5, "Salary", F1:F2)\` to get the total salary for Sales department
- \`DAVERAGE(A1:D5, "Years", F1:F2)\` to get the average years of experience in Sales

## Error Handling

Database functions may throw errors in the following situations:
- **Wrong number of arguments**: All database functions require exactly 3 arguments
- **No matching records**: \`DGET\` will throw an error if no records match the criteria
- **Multiple matching records**: \`DGET\` will throw an error if more than one record matches
- **Invalid field reference**: If the field parameter doesn't exist in the database

## Implementation Notes

The current implementation provides simplified versions of Excel's database functions:
- Criteria matching is basic and may not support all Excel criteria formats
- Functions assume the database parameter is an array of objects
- Field parameter matching is simplified
- Error handling follows basic Excel patterns

---

*Generated on ${new Date().toLocaleString()}*
`;

  return markdown;
}

// Main execution
try {
  console.log("🔍 Parsing database functions...");
  const functions = parseFunctions(databaseFunctionsContent);

  console.log(`✅ Found ${functions.length} database functions`);

  console.log("📝 Generating markdown documentation...");
  const markdown = generateMarkdown(functions);

  // Write to output file
  const outputPath = path.join(__dirname, "../docs/DATABASE_FUNCTIONS.md");

  // Create docs directory if it doesn't exist
  const docsDir = path.dirname(outputPath);
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, markdown, "utf8");

  console.log(`✅ Documentation generated successfully!`);
  console.log(`📄 Output saved to: ${outputPath}`);
  console.log(
    `📊 Functions documented: ${functions.map((f) => f.name).join(", ")}`
  );
} catch (error) {
  console.error("❌ Error generating documentation:", error.message);
  process.exit(1);
}
