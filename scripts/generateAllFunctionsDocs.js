#!/usr/bin/env node

/**
 * Script to generate markdown documentation for ALL functions
 * Usage: node scripts/generateAllFunctionsDocs.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration for function files
const functionFiles = [
  { file: "databaseFunctions.ts", name: "Database Functions" },
  { file: "dateTimeFunctions.ts", name: "Date & Time Functions" },
  { file: "engineeringFunctions.ts", name: "Engineering Functions" },
  { file: "financialFunctions.ts", name: "Financial Functions" },
  { file: "informationFunctions.ts", name: "Information Functions" },
  { file: "legacyFunctions.ts", name: "Legacy Functions" },
  { file: "logicalFunctions.ts", name: "Logical Functions" },
  { file: "lookupFunctions.ts", name: "Lookup & Reference Functions" },
  { file: "mathFunctions.ts", name: "Math & Trigonometry Functions" },
  { file: "statisticalFunctions.ts", name: "Statistical Functions" },
  { file: "textFunctions.ts", name: "Text Functions" },
  { file: "webFunctions.ts", name: "Web Functions" },
];

// Parse function registrations from TypeScript content
function parseFunctions(content, fileName) {
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
      sourceFile: fileName,
    });
  });

  return functions;
}

// Generate comprehensive markdown content
function generateMarkdown(allFunctions) {
  const functionsByCategory = {};

  // Group functions by category
  allFunctions.forEach((func) => {
    if (!functionsByCategory[func.category]) {
      functionsByCategory[func.category] = [];
    }
    functionsByCategory[func.category].push(func);
  });

  let markdown = `# React Sheet - Function Reference

This document provides comprehensive documentation for all functions available in the React Sheet application.

*Last updated: ${new Date().toLocaleString()}*

## Table of Contents

`;

  // Generate table of contents
  Object.keys(functionsByCategory)
    .sort()
    .forEach((category) => {
      markdown += `- [${category} Functions](#${category
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")}-functions)\n`;
    });

  markdown += `
## Overview

React Sheet supports ${allFunctions.length} functions across ${
    Object.keys(functionsByCategory).length
  } categories. Each function is designed to be compatible with Excel formulas while providing additional functionality for web-based spreadsheets.

`;

  // Generate documentation for each category
  Object.keys(functionsByCategory)
    .sort()
    .forEach((category) => {
      const functions = functionsByCategory[category];

      markdown += `## ${category} Functions

`;

      functions
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach((func) => {
          markdown += `### ${func.name}

**Description:** ${func.description}

**Syntax:** \`${func.syntax}\`

**Examples:**
${func.examples.map((example) => `- \`${example}\``).join("\n")}

`;
        });

      markdown += `---

`;
    });

  // Add summary section
  markdown += `
## Function Summary

| Category | Function Count | Functions |
|----------|----------------|-----------|
`;

  Object.keys(functionsByCategory)
    .sort()
    .forEach((category) => {
      const functions = functionsByCategory[category];
      const functionNames = functions
        .map((f) => f.name)
        .sort()
        .join(", ");
      markdown += `| ${category} | ${functions.length} | ${functionNames} |\n`;
    });

  return markdown;
}

// Generate individual category documentation
function generateCategoryMarkdown(category, functions) {
  let markdown = `# ${category} Functions

This document provides detailed documentation for all ${category.toLowerCase()} functions.

*Generated on ${new Date().toLocaleString()}*

## Functions in this Category

`;

  functions
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((func, index) => {
      markdown += `### ${func.name}

**Description:** ${func.description}

**Syntax:** \`${func.syntax}\`

**Examples:**
${func.examples.map((example) => `- \`${example}\``).join("\n")}

**Notes:**
- Source: \`${func.sourceFile}\`
- Category: ${func.category}

`;

      if (index < functions.length - 1) {
        markdown += "---\n\n";
      }
    });

  return markdown;
}

// Main execution
async function main() {
  try {
    console.log("🔍 Scanning function files...");

    const functionsDir = path.join(__dirname, "../src/formulaEngine/functions");
    const allFunctions = [];

    for (const { file, name } of functionFiles) {
      const filePath = path.join(functionsDir, file);

      if (fs.existsSync(filePath)) {
        console.log(`📖 Reading ${file}...`);
        const content = fs.readFileSync(filePath, "utf8");
        const functions = parseFunctions(content, file);

        console.log(`  ✅ Found ${functions.length} functions in ${file}`);
        allFunctions.push(...functions);

        // Generate individual category documentation
        if (functions.length > 0) {
          const categoryMarkdown = generateCategoryMarkdown(name, functions);
          const categoryFileName = file.replace(".ts", ".md").toUpperCase();
          const categoryOutputPath = path.join(
            __dirname,
            "../docs",
            categoryFileName
          );

          // Create docs directory if it doesn't exist
          const docsDir = path.dirname(categoryOutputPath);
          if (!fs.existsSync(docsDir)) {
            fs.mkdirSync(docsDir, { recursive: true });
          }

          fs.writeFileSync(categoryOutputPath, categoryMarkdown, "utf8");
          console.log(`  📄 Individual docs saved to: ${categoryFileName}`);
        }
      } else {
        console.log(`  ⚠️  File not found: ${file}`);
      }
    }

    console.log(`\n📊 Total functions found: ${allFunctions.length}`);

    console.log("📝 Generating comprehensive documentation...");
    const markdown = generateMarkdown(allFunctions);

    // Write to main output file
    const outputPath = path.join(__dirname, "../docs/FUNCTIONS_REFERENCE.md");
    fs.writeFileSync(outputPath, markdown, "utf8");

    console.log(`✅ Comprehensive documentation generated!`);
    console.log(`📄 Main output saved to: FUNCTIONS_REFERENCE.md`);

    // Generate summary
    const functionsByCategory = {};
    allFunctions.forEach((func) => {
      if (!functionsByCategory[func.category]) {
        functionsByCategory[func.category] = [];
      }
      functionsByCategory[func.category].push(func);
    });

    console.log("\n📈 Summary:");
    Object.keys(functionsByCategory)
      .sort()
      .forEach((category) => {
        console.log(
          `  ${category}: ${functionsByCategory[category].length} functions`
        );
      });
  } catch (error) {
    console.error("❌ Error generating documentation:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the script
main();
