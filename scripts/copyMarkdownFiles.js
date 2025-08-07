#!/usr/bin/env node

/**
 * Create an index of available markdown files for the React app
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const docsDir = path.join(__dirname, "../docs");
const publicDocsDir = path.join(__dirname, "../public/docs");

// Ensure public/docs directory exists
if (!fs.existsSync(publicDocsDir)) {
  fs.mkdirSync(publicDocsDir, { recursive: true });
}

// Copy all markdown files to public directory
const markdownFiles = fs
  .readdirSync(docsDir)
  .filter((file) => file.endsWith(".md"))
  .filter((file) => file !== "complete-reference.md"); // Skip the comprehensive file

const index = {
  categories: markdownFiles.map((file) => ({
    filename: file,
    name: file.replace(".md", ""),
    lastModified: fs.statSync(path.join(docsDir, file)).mtime.toISOString(),
  })),
  totalFiles: markdownFiles.length,
  lastGenerated: new Date().toISOString(),
};

// Copy files and create index
markdownFiles.forEach((file) => {
  const source = path.join(docsDir, file);
  const dest = path.join(publicDocsDir, file);
  fs.copyFileSync(source, dest);
});

// Write index file
const indexPath = path.join(publicDocsDir, "index.json");
fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));

console.log(`✅ Copied ${markdownFiles.length} markdown files to public/docs`);
console.log(`📄 Created index.json with file list`);
console.log(`📁 Files: ${markdownFiles.join(", ")}`);

// Also update the package.json script
const packageJsonPath = path.join(__dirname, "../package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

if (!packageJson.scripts["docs:copy-md"]) {
  packageJson.scripts["docs:copy-md"] = "node scripts/copyMarkdownFiles.js";
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log("📦 Added docs:copy-md script to package.json");
}
