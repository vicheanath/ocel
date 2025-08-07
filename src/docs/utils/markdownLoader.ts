import type { DocsData, CategoryDoc, FunctionDoc } from "../types";

// Configuration for function categories and their markdown files
const categoryConfigs = [
  {
    name: "database",
    displayName: "Database",
    description:
      "Functions for working with structured data tables and performing database-like operations.",
  },
  {
    name: "date-time",
    displayName: "Date & Time",
    description:
      "Functions for date and time calculations, formatting, and manipulation.",
  },
  {
    name: "engineering",
    displayName: "Engineering",
    description:
      "Specialized functions for engineering calculations and number system conversions.",
  },
  {
    name: "financial",
    displayName: "Financial",
    description:
      "Functions for financial calculations including loans, investments, and cash flows.",
  },
  {
    name: "information",
    displayName: "Information",
    description:
      "Functions for testing cell contents and retrieving information about data types.",
  },
  {
    name: "legacy",
    displayName: "Legacy",
    description:
      "Compatibility functions maintained for backward compatibility.",
  },
  {
    name: "logical",
    displayName: "Logical",
    description: "Functions for logical operations and conditional testing.",
  },
  {
    name: "lookup-reference",
    displayName: "Lookup & Reference",
    description:
      "Functions for searching and referencing data within tables and ranges.",
  },
  {
    name: "math-trigonometry",
    displayName: "Math & Trigonometry",
    description:
      "Mathematical and trigonometric functions for calculations and analysis.",
  },
  {
    name: "statistical",
    displayName: "Statistical",
    description:
      "Functions for statistical analysis and probability calculations.",
  },
  {
    name: "text",
    displayName: "Text",
    description:
      "Functions for text manipulation, formatting, and string operations.",
  },
  {
    name: "web",
    displayName: "Web",
    description: "Functions for web-based operations and data retrieval.",
  },
];

// Parse a single function from markdown content
function parseFunction(
  functionBlock: string,
  categoryName: string
): FunctionDoc | null {
  try {
    // Extract function name (header)
    const nameMatch = functionBlock.match(/^##\s+(.+)$/m);
    if (!nameMatch) return null;
    const name = nameMatch[1].trim();

    // Extract description
    const descMatch = functionBlock.match(/\*\*Description:\*\*\s*(.+)$/m);
    if (!descMatch) return null;
    const description = descMatch[1].trim();

    // Extract syntax
    const syntaxMatch = functionBlock.match(/\*\*Syntax:\*\*\s*`([^`]+)`/);
    if (!syntaxMatch) return null;
    const syntax = syntaxMatch[1].trim();

    // Extract category
    const categoryMatch = functionBlock.match(/\*\*Category:\*\*\s*(.+)$/m);
    const category = categoryMatch ? categoryMatch[1].trim() : categoryName;

    // Extract examples
    const examples: string[] = [];
    const examplesSection = functionBlock.match(
      /\*\*Examples:\*\*\s*([\s\S]*?)(?=\n---|$)/
    );
    if (examplesSection) {
      const exampleLines = examplesSection[1].split("\n");
      exampleLines.forEach((line) => {
        const exampleMatch = line.match(/^-\s*`([^`]+)`/);
        if (exampleMatch) {
          examples.push(exampleMatch[1].trim());
        }
      });
    }

    return {
      name,
      description,
      syntax,
      category,
      examples,
      sourceFile: `${categoryName}.md`,
    };
  } catch (error) {
    console.warn(`Failed to parse function from block:`, error);
    return null;
  }
}

// Parse functions from markdown content
function parseFunctionsFromMarkdown(
  content: string,
  categoryName: string
): FunctionDoc[] {
  const functions: FunctionDoc[] = [];

  // Split content by function sections (## headers)
  const sections = content.split(/^## /m);

  // Skip the first section (title and description)
  for (let i = 1; i < sections.length; i++) {
    const functionBlock = "## " + sections[i];
    const func = parseFunction(functionBlock, categoryName);
    if (func) {
      functions.push(func);
    }
  }

  return functions;
}

// Load a single category from markdown file
async function loadCategoryFromMarkdown(
  categoryConfig: (typeof categoryConfigs)[0]
): Promise<CategoryDoc | null> {
  try {
    // Import the markdown file content
    const response = await fetch(`/docs/${categoryConfig.name}.md`);
    if (!response.ok) {
      console.warn(
        `Failed to fetch ${categoryConfig.name}.md:`,
        response.status
      );
      return null;
    }

    const content = await response.text();
    const functions = parseFunctionsFromMarkdown(
      content,
      categoryConfig.displayName
    );

    return {
      name: categoryConfig.name,
      displayName: categoryConfig.displayName,
      description: categoryConfig.description,
      functions,
    };
  } catch (error) {
    console.error(`Error loading category ${categoryConfig.name}:`, error);
    return null;
  }
}

// Main function to load all documentation from markdown files
export async function loadDocsFromMarkdown(): Promise<DocsData> {
  const categories: CategoryDoc[] = [];
  let totalFunctions = 0;

  // Load all categories in parallel
  const categoryPromises = categoryConfigs.map((config) =>
    loadCategoryFromMarkdown(config)
  );
  const categoryResults = await Promise.all(categoryPromises);

  // Filter out failed loads and count functions
  categoryResults.forEach((category) => {
    if (category && category.functions.length > 0) {
      categories.push(category);
      totalFunctions += category.functions.length;
    }
  });

  return {
    categories,
    totalFunctions,
    lastUpdated: new Date().toISOString(),
  };
}

// Alternative: Load from public folder (for development)
export async function loadDocsFromPublicMarkdown(): Promise<DocsData> {
  const categories: CategoryDoc[] = [];
  let totalFunctions = 0;

  try {
    // First, try to load the index to get available files
    let availableFiles = categoryConfigs.map((c) => c.name);

    try {
      const indexResponse = await fetch("/docs/index.json");
      if (indexResponse.ok) {
        const index = await indexResponse.json();
        availableFiles = index.categories.map((c: { name: string }) => c.name);
        console.log(
          `📚 Found ${availableFiles.length} markdown files in index`
        );
      }
    } catch {
      console.log("📚 Using default category list (no index found)");
    }

    // Load categories from available files
    for (const config of categoryConfigs) {
      if (!availableFiles.includes(config.name)) continue;

      try {
        const response = await fetch(`/docs/${config.name}.md`);
        if (response.ok) {
          const content = await response.text();
          const functions = parseFunctionsFromMarkdown(
            content,
            config.displayName
          );

          if (functions.length > 0) {
            categories.push({
              name: config.name,
              displayName: config.displayName,
              description: config.description,
              functions,
            });
            totalFunctions += functions.length;
            console.log(
              `✅ Loaded ${functions.length} functions from ${config.name}.md`
            );
          }
        } else {
          console.warn(
            `❌ Failed to fetch ${config.name}.md: ${response.status}`
          );
        }
      } catch (error) {
        console.warn(`❌ Error loading ${config.name}.md:`, error);
      }
    }

    console.log(
      `🎉 Successfully loaded ${totalFunctions} functions from ${categories.length} categories`
    );
  } catch (error) {
    console.error("❌ Error loading documentation from markdown:", error);
  }

  return {
    categories,
    totalFunctions,
    lastUpdated: new Date().toISOString(),
  };
}
