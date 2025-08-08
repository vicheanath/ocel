# React Sheet Documentation System

A complete TypeScript-based documentation generation system with React Router rendering for the React Sheet project.

## 🎯 What We Built

### 1. **TypeScript Documentation Generator** (`scripts/generateDocsData.ts`)

- **Language**: Pure TypeScript with ES modules
- **Input**: Function definition files in `src/formulaEngine/functions/`
- **Output**:
  - `src/docs/functionsData.json` - Structured data for React app
  - `src/docs/types.ts` - Auto-generated TypeScript interfaces
  - `docs/*.md` - Individual category markdown files

### 2. **React Documentation App** (`src/docs/`)

- **Framework**: React 19 + React Router DOM 7
- **Styling**: Tailwind CSS
- **Features**:
  - 🏠 **Homepage** - Overview with stats and featured functions
  - 📂 **Category Pages** - Browse functions by category
  - 📄 **Function Pages** - Detailed documentation for each function
  - 🔍 **Search** - Real-time search with highlighting
  - 📱 **Responsive** - Works on all devices

### 3. **Integration** (`src/App.tsx`)

- Main app routes to spreadsheet at `/`
- Documentation accessible at `/docs/*`
- Seamless navigation between app and docs

## 📊 Coverage Statistics

- **Total Functions**: 298
- **Categories**: 12
- **Examples**: 1,000+
- **Auto-generated Files**: 15+

### Function Breakdown by Category:

- **Math & Trigonometry**: 49 functions
- **Statistical**: 49 functions
- **Text**: 49 functions
- **Engineering**: 26 functions
- **Financial**: 26 functions
- **Date & Time**: 23 functions
- **Information**: 22 functions
- **Logical**: 19 functions
- **Legacy**: 13 functions
- **Database**: 10 functions
- **Lookup & Reference**: 9 functions
- **Web**: 3 functions

## 🚀 Usage Commands

### Generate Documentation Data

```bash
# TypeScript-based generator (recommended)
npm run docs:data
# OR
npx tsx scripts/generateDocsData.ts
```

### Development

```bash
npm run dev                    # Start dev server
# Visit http://localhost:5173/docs
```

### Production Build

```bash
npm run docs:build            # Generate data + build app
npm run build                 # Build entire app with docs
```

## 🏗️ Architecture

```
src/docs/
├── DocsApp.tsx              # Main router app
├── components/              # React components
│   ├── DocsLayout.tsx      # Common layout + navigation
│   ├── HomePage.tsx        # Overview page
│   ├── CategoryPage.tsx    # Category listing
│   ├── FunctionPage.tsx    # Function details
│   ├── SearchPage.tsx      # Search interface
│   └── index.ts            # Component exports
├── context/                # State management
│   ├── DocsContext.tsx     # React Context
│   └── index.ts            # Context exports
├── functionsData.json      # Generated data (298 functions)
├── types.ts               # Generated TypeScript types
└── README.md              # Detailed docs

scripts/
├── generateDocsData.ts     # TypeScript generator (recommended)
├── generateDatabaseFunctionsDocs.js  # DB-specific generator
├── copyMarkdownFiles.js    # Copy docs to public folder
└── README.md              # Script documentation

docs/                      # Generated markdown files
├── complete-reference.md   # Comprehensive reference
├── database.md            # Category-specific files
├── math-trigonometry.md
├── text.md
└── ... (12 category files)
```

## ✨ Key Features

### TypeScript Generator

- **Type Safety**: Full TypeScript with proper interfaces
- **Error Handling**: Graceful parsing with warnings
- **Extensible**: Easy to add new function categories
- **Modern**: ES modules, async/await, proper imports

### React Documentation App

- **React Router Integration**: Client-side routing
- **Real-time Search**: Instant filtering with highlighting
- **Responsive Design**: Mobile-first with Tailwind CSS
- **Context State Management**: Efficient data sharing
- **URL-based Navigation**: Bookmarkable links

### Advanced Search

- Search function names, descriptions, syntax, examples
- Real-time filtering with highlighting
- URL query parameter support (`/docs/search?q=sum`)
- Popular search suggestions
- Category-based browsing

## 🔧 Customization

### Adding New Function Categories

1. Add TypeScript file to `src/formulaEngine/functions/`
2. Update `functionFiles` array in `generateDocsData.ts`
3. Run `npm run docs:data`
4. New category appears automatically in navigation

### Styling Changes

- Modify Tailwind classes in component files
- Consistent design system with blue/green/yellow color scheme
- Card-based layout with hover effects

### New Features

1. Create components in `src/docs/components/`
2. Add routes to `DocsApp.tsx`
3. Update context for new state management
4. Export from index files

## 🎨 Design System

### Colors

- **Primary**: Blue (`blue-600`, `blue-50`)
- **Success**: Green (`green-600`, `green-50`)
- **Warning**: Yellow (`yellow-600`, `yellow-50`)
- **Neutral**: Gray (`gray-900`, `gray-100`)

### Typography

- **Headers**: System fonts, bold weights
- **Code**: Monaco/Menlo monospace
- **Body**: System fonts, readable line height

### Layout

- **Responsive**: Grid system with breakpoints
- **Cards**: Rounded borders with shadows
- **Navigation**: Sidebar + breadcrumbs
- **Search**: Prominent search bar with suggestions

## 🌐 Deployment

The documentation is built as part of the main React Sheet application:

1. **Development**: `npm run dev` → http://localhost:5173/docs
2. **Production**: `npm run build` → Static files in `dist/`
3. **Data Generation**: Automatically included in build process

## 📈 Performance

- **Static Data**: Function data imported at build time
- **Client Routing**: No page reloads
- **Optimized Rendering**: React Context prevents unnecessary re-renders
- **Lazy Loading**: Route-based code splitting
- **Fast Search**: In-memory filtering with efficient algorithms

## 🔍 Example Usage

### Search Examples

- Search "SUM" → Shows all SUM-related functions
- Search "date" → Shows date/time functions
- Search "IF(" → Shows conditional functions

### Navigation Examples

- `/docs` → Homepage with overview
- `/docs/category/math-trigonometry` → Math functions
- `/docs/function/sum` → SUM function details
- `/docs/search?q=average` → Search results for "average"

## 🛠️ Maintenance

### Regular Updates

1. When new functions are added to the codebase
2. Run `npm run docs:data` to regenerate
3. Test the documentation app
4. Commit both code and generated files

### Function Format Requirements

Functions must follow this registration pattern:

```typescript
registry.register(
  "FUNCTION_NAME",
  (args) => {
    /* implementation */
  },
  {
    description: "What the function does",
    syntax: "FUNCTION_NAME(param1, param2)",
    category: "Category Name",
    examples: ["FUNCTION_NAME(1, 2)", "FUNCTION_NAME(A1, B1)"],
  }
);
```

---

**Result**: A complete, production-ready documentation system with TypeScript generation and React Router rendering! 🎉

Visit `/docs` in your React Sheet app to explore the full interactive documentation.
