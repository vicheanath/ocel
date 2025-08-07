#!/usr/bin/env tsx

/**
 * TypeScript script to generate structured documentation data
 * Usage: npx tsx scripts/generateDocsData.ts
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Types for our documentation structure
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

// Configuration for function files
const functionFiles: Array<{
  file: string;
  name: string;
  description: string;
}> = [
  {
    file: "databaseFunctions.ts",
    name: "Database",
    description:
      "Functions for working with structured data tables and performing database-like operations.",
  },
  {
    file: "dateTimeFunctions.ts",
    name: "Date & Time",
    description:
      "Functions for date and time calculations, formatting, and manipulation.",
  },
  {
    file: "engineeringFunctions.ts",
    name: "Engineering",
    description:
      "Specialized functions for engineering calculations and number system conversions.",
  },
  {
    file: "financialFunctions.ts",
    name: "Financial",
    description:
      "Functions for financial calculations including loans, investments, and cash flows.",
  },
  {
    file: "informationFunctions.ts",
    name: "Information",
    description:
      "Functions for testing cell contents and retrieving information about data types.",
  },
  {
    file: "legacyFunctions.ts",
    name: "Legacy",
    description:
      "Compatibility functions maintained for backward compatibility.",
  },
  {
    file: "logicalFunctions.ts",
    name: "Logical",
    description: "Functions for logical operations and conditional testing.",
  },
  {
    file: "lookupFunctions.ts",
    name: "Lookup & Reference",
    description:
      "Functions for searching and referencing data within tables and ranges.",
  },
  {
    file: "mathFunctions.ts",
    name: "Math & Trigonometry",
    description:
      "Mathematical and trigonometric functions for calculations and analysis.",
  },
  {
    file: "statisticalFunctions.ts",
    name: "Statistical",
    description:
      "Functions for statistical analysis and probability calculations.",
  },
  {
    file: "textFunctions.ts",
    name: "Text",
    description:
      "Functions for text manipulation, formatting, and string operations.",
  },
  {
    file: "webFunctions.ts",
    name: "Web",
    description: "Functions for web-based operations and data retrieval.",
  },
];

// Parse function registrations from TypeScript content
function parseFunctions(content: string, fileName: string): FunctionDoc[] {
  const functions: FunctionDoc[] = [];

  // Split into individual registry.register blocks
  const registerBlocks = content.split("registry.register(").slice(1);

  registerBlocks.forEach((block) => {
    try {
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
      const examples: string[] = [];
      const exampleMatches =
        examplesStr.match(/'([^']*)'/g) ||
        examplesStr.match(/"([^"]*)"/g) ||
        [];
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
        sourceFile: fileName,
      });
    } catch (error) {
      console.warn(`Warning: Failed to parse function in ${fileName}:`, error);
    }
  });

  return functions;
}

// Generate markdown content for a category
function generateCategoryMarkdown(category: CategoryDoc): string {
  let markdown = `# ${category.displayName} Functions

${category.description}

*This document contains ${category.functions.length} functions.*

---

`;

  category.functions
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((func, index) => {
      markdown += `## ${func.name}

**Description:** ${func.description}

**Syntax:** \`${func.syntax}\`

**Category:** ${func.category}

**Examples:**
${func.examples.map((example) => `- \`${example}\``).join("\n")}

`;

      if (index < category.functions.length - 1) {
        markdown += "---\n\n";
      }
    });

  return markdown;
}

// Generate comprehensive markdown
function generateComprehensiveMarkdown(docsData: DocsData): string {
  let markdown = `# React Sheet - Complete Function Reference

*Last updated: ${docsData.lastUpdated}*

## Overview

React Sheet provides ${docsData.totalFunctions} functions across ${
    docsData.categories.length
  } categories, designed to be compatible with Excel formulas while offering enhanced web functionality.

## Quick Navigation

${docsData.categories
  .map(
    (cat) =>
      `- [${cat.displayName}](#${cat.displayName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")}) (${cat.functions.length} functions)`
  )
  .join("\n")}

---

`;

  // Add each category
  docsData.categories.forEach((category) => {
    markdown += `## ${category.displayName}

${category.description}

### Functions in this category:

${category.functions
  .sort((a, b) => a.name.localeCompare(b.name))
  .map(
    (func) => `#### ${func.name}

**${func.description}**

- **Syntax:** \`${func.syntax}\`
- **Examples:** ${func.examples.map((ex) => `\`${ex}\``).join(", ")}

`
  )
  .join("")}

---

`;
  });

  return markdown;
}

// Main execution
async function main() {
  try {
    console.log("🔍 Generating TypeScript documentation data...");

    const functionsDir = path.join(__dirname, "../src/formulaEngine/functions");
    const categories: CategoryDoc[] = [];
    let totalFunctions = 0;

    for (const { file, name, description } of functionFiles) {
      const filePath = path.join(functionsDir, file);

      if (fs.existsSync(filePath)) {
        console.log(`📖 Processing ${file}...`);
        const content = fs.readFileSync(filePath, "utf8");
        const functions = parseFunctions(content, file);

        if (functions.length > 0) {
          const category: CategoryDoc = {
            name: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            displayName: name,
            functions,
            description,
          };

          categories.push(category);
          totalFunctions += functions.length;
          console.log(`  ✅ Found ${functions.length} functions`);
        }
      } else {
        console.log(`  ⚠️  File not found: ${file}`);
      }
    }

    const docsData: DocsData = {
      categories,
      totalFunctions,
      lastUpdated: new Date().toISOString(),
    };

    // Create output directories
    const docsDir = path.join(__dirname, "../docs");
    const srcDocsDir = path.join(__dirname, "../src/docs");

    [docsDir, srcDocsDir].forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    // Generate JSON data for React app
    const jsonOutput = path.join(srcDocsDir, "functionsData.json");
    fs.writeFileSync(jsonOutput, JSON.stringify(docsData, null, 2), "utf8");
    console.log(`📄 JSON data saved to: ${jsonOutput}`);

    // Generate TypeScript types file
    const typesOutput = path.join(srcDocsDir, "types.ts");
    const typesContent = `// Auto-generated types for function documentation
// Generated on: ${new Date().toISOString()}

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
export const FUNCTION_CATEGORIES = ${JSON.stringify(
      categories.map((cat) => ({
        name: cat.name,
        displayName: cat.displayName,
        description: cat.description,
        count: cat.functions.length,
      })),
      null,
      2
    )} as const;
`;

    fs.writeFileSync(typesOutput, typesContent, "utf8");
    console.log(`📄 TypeScript types saved to: ${typesOutput}`);

    // Generate individual category markdown files
    categories.forEach((category) => {
      const categoryMarkdown = generateCategoryMarkdown(category);
      const categoryFileName = `${category.name}.md`;
      const categoryPath = path.join(docsDir, categoryFileName);

      fs.writeFileSync(categoryPath, categoryMarkdown, "utf8");
      console.log(`  📄 Category docs saved to: ${categoryFileName}`);
    });

    // Generate comprehensive markdown
    const comprehensiveMarkdown = generateComprehensiveMarkdown(docsData);
    const comprehensivePath = path.join(docsDir, "complete-reference.md");
    fs.writeFileSync(comprehensivePath, comprehensiveMarkdown, "utf8");

    console.log("\n✅ Documentation generation complete!");
    console.log(`📊 Total functions: ${totalFunctions}`);
    console.log(`📚 Categories: ${categories.length}`);
    console.log(`📄 Files generated: ${categories.length + 2}`);

    // Print summary
    console.log("\n📈 Category Summary:");
    categories
      .sort((a, b) => b.functions.length - a.functions.length)
      .forEach((cat) => {
        console.log(`  ${cat.displayName}: ${cat.functions.length} functions`);
      });
  } catch (error) {
    console.error("❌ Error generating documentation:", error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main as generateDocsData };
