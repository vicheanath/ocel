#!/usr/bin/env node

/**
 * Script to generate an HTML documentation viewer
 * Usage: node scripts/generateHtmlDocs.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateHtmlDocumentation() {
  const docsPath = path.join(__dirname, "../docs");
  const files = fs.readdirSync(docsPath).filter((file) => file.endsWith(".md"));

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React Sheet - Function Documentation</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8f9fa;
        }
        
        .container {
            display: flex;
            min-height: 100vh;
        }
        
        .sidebar {
            width: 250px;
            background: #2c3e50;
            color: white;
            padding: 20px;
            overflow-y: auto;
        }
        
        .sidebar h2 {
            margin-bottom: 20px;
            color: #ecf0f1;
        }
        
        .nav-link {
            display: block;
            padding: 8px 12px;
            color: #bdc3c7;
            text-decoration: none;
            border-radius: 4px;
            margin-bottom: 5px;
            transition: all 0.3s ease;
        }
        
        .nav-link:hover,
        .nav-link.active {
            background-color: #34495e;
            color: #ecf0f1;
        }
        
        .content {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
        }
        
        .doc-content {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            max-width: 1000px;
        }
        
        .function-card {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 6px;
            padding: 20px;
            margin-bottom: 20px;
        }
        
        .function-name {
            color: #2c3e50;
            font-size: 24px;
            margin-bottom: 10px;
        }
        
        .syntax {
            background: #2c3e50;
            color: #ecf0f1;
            padding: 8px 12px;
            border-radius: 4px;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 14px;
        }
        
        .examples {
            background: #e8f5e8;
            border-left: 4px solid #27ae60;
            padding: 15px;
            margin-top: 15px;
        }
        
        .examples code {
            background: #d4edda;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Monaco', 'Menlo', monospace;
        }
        
        .search-box {
            width: 100%;
            padding: 10px;
            margin-bottom: 20px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
        }
        
        .hidden {
            display: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <nav class="sidebar">
            <h2>📊 Function Docs</h2>
            <input type="text" class="search-box" placeholder="Search functions..." id="searchBox">
            <div id="navLinks">
`;

  // Generate navigation
  files.forEach((file) => {
    const fileName = file.replace(".md", "");
    const displayName = fileName
      .replace(/FUNCTIONS?/gi, "")
      .replace(/([A-Z])/g, " $1")
      .trim()
      .replace(/^./, (str) => str.toUpperCase());

    html += `                <a href="#${fileName}" class="nav-link" data-file="${fileName}">${displayName}</a>\n`;
  });

  html += `            </div>
        </nav>
        
        <main class="content">
            <div class="doc-content" id="docContent">
                <h1>📊 React Sheet Function Documentation</h1>
                <p>Select a function category from the sidebar to view detailed documentation.</p>
                <div id="searchResults" class="hidden"></div>
            </div>
        </main>
    </div>
    
    <script>
        const docContent = {
`;

  // Read and convert markdown files to JavaScript objects
  files.forEach((file, index) => {
    const content = fs.readFileSync(path.join(docsPath, file), "utf8");
    const fileName = file.replace(".md", "");

    // Convert markdown to HTML-like structure
    const htmlContent = content
      .replace(/^# (.+)$/gm, "<h1>$1</h1>")
      .replace(/^## (.+)$/gm, "<h2>$1</h2>")
      .replace(/^### (.+)$/gm, '<h3 class="function-name">$1</h3>')
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/^- (.+)$/gm, "<li>$1</li>")
      .replace(/(\n<li>.*\n)+/g, "<ul>$&</ul>")
      .replace(/\n/g, "<br>");

    html += `            '${fileName}': \`${htmlContent.replace(
      /`/g,
      "\\`"
    )}\`${index < files.length - 1 ? "," : ""}\n`;
  });

  html += `        };
        
        // Navigation handling
        document.addEventListener('DOMContentLoaded', function() {
            const navLinks = document.querySelectorAll('.nav-link');
            const docContentDiv = document.getElementById('docContent');
            const searchBox = document.getElementById('searchBox');
            const searchResults = document.getElementById('searchResults');
            
            navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const fileName = this.dataset.file;
                    
                    // Update active state
                    navLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Update content
                    if (docContent[fileName]) {
                        docContentDiv.innerHTML = '<div class="function-card">' + docContent[fileName] + '</div>';
                        searchResults.classList.add('hidden');
                    }
                });
            });
            
            // Search functionality
            searchBox.addEventListener('input', function() {
                const query = this.value.toLowerCase();
                
                if (query.length < 2) {
                    searchResults.classList.add('hidden');
                    return;
                }
                
                const results = [];
                Object.keys(docContent).forEach(fileName => {
                    const content = docContent[fileName];
                    if (content.toLowerCase().includes(query)) {
                        results.push({fileName, content});
                    }
                });
                
                if (results.length > 0) {
                    let html = '<h2>Search Results</h2>';
                    results.forEach(result => {
                        const preview = result.content.substring(0, 200) + '...';
                        html += \`<div class="function-card">
                            <h3>\${result.fileName}</h3>
                            <p>\${preview}</p>
                        </div>\`;
                    });
                    searchResults.innerHTML = html;
                    searchResults.classList.remove('hidden');
                }
            });
        });
    </script>
</body>
</html>`;

  return html;
}

// Generate and save HTML documentation
try {
  console.log("🌐 Generating HTML documentation viewer...");
  const html = generateHtmlDocumentation();

  const outputPath = path.join(__dirname, "../docs/index.html");
  fs.writeFileSync(outputPath, html, "utf8");

  console.log("✅ HTML documentation generated successfully!");
  console.log(
    `📄 Open ${outputPath} in your browser to view the documentation`
  );
} catch (error) {
  console.error("❌ Error generating HTML documentation:", error.message);
  process.exit(1);
}
