# React Sheet Documentation App

This directory contains a complete React application for rendering function documentation with React Router.

## Features

- 📚 **Complete Function Reference**: Browse 298+ functions across 12 categories
- 🔍 **Advanced Search**: Real-time search with highlighting
- 🧭 **Easy Navigation**: Category-based organization with breadcrumbs
- 📱 **Responsive Design**: Works on desktop and mobile
- ⚡ **Fast Performance**: Client-side routing with React Router
- 🎨 **Modern UI**: Built with Tailwind CSS

## Architecture

### Components

- **`DocsApp.tsx`** - Main app with router configuration
- **`DocsLayout.tsx`** - Common layout with navigation and search
- **`HomePage.tsx`** - Overview with stats and featured functions
- **`CategoryPage.tsx`** - Lists all functions in a category
- **`FunctionPage.tsx`** - Detailed function documentation
- **`SearchPage.tsx`** - Advanced search with filtering

### Data Management

- **`context/DocsContext.tsx`** - React Context for state management
- **`types.ts`** - TypeScript interfaces (auto-generated)
- **`functionsData.json`** - Function data (auto-generated)

## Usage

### 1. Generate Documentation Data

```bash
# Generate TypeScript types and JSON data
npm run docs:data

# Or run the TypeScript generator directly
npx tsx scripts/generateDocsData.ts
```

### 2. Start Development Server

```bash
npm run dev
```

Visit http://localhost:5173/docs to view the documentation.

### 3. Build for Production

```bash
npm run docs:build
```

## Routes

- `/docs` - Documentation homepage
- `/docs/category/:categoryName` - Category page (e.g., `/docs/category/math-trigonometry`)
- `/docs/function/:functionName` - Function detail page (e.g., `/docs/function/sum`)
- `/docs/search` - Search page with query parameter support

## Data Structure

The documentation system uses a hierarchical structure:

```typescript
interface DocsData {
  categories: CategoryDoc[];
  totalFunctions: number;
  lastUpdated: string;
}

interface CategoryDoc {
  name: string; // URL-friendly name
  displayName: string; // Human-readable name
  functions: FunctionDoc[];
  description: string;
}

interface FunctionDoc {
  name: string; // Function name (e.g., "SUM")
  description: string; // What the function does
  syntax: string; // Function signature
  category: string; // Category name
  examples: string[]; // Usage examples
  sourceFile: string; // Source TypeScript file
}
```

## Integration with Main App

The docs app is integrated into the main React Sheet app via React Router:

```tsx
// In App.tsx
<Routes>
  <Route path="/docs/*" element={<DocsApp />} />
  <Route path="/" element={<MainApp />} />
</Routes>
```

## Styling

The documentation uses Tailwind CSS for styling with a consistent design system:

- **Colors**: Blue for primary actions, green for examples, yellow for warnings
- **Typography**: System fonts with mono fonts for code
- **Layout**: Responsive grid system
- **Components**: Card-based design with hover effects

## Search Features

The search functionality includes:

- Real-time filtering as you type
- Search across function names, descriptions, syntax, and examples
- Highlighted search terms in results
- URL-based search queries (`/docs/search?q=sum`)
- Popular search suggestions

## Performance

- **Static Data**: Function data is imported at build time
- **Client-Side Routing**: No page reloads when navigating
- **Lazy Loading**: Components are loaded on demand
- **Optimized Rendering**: Context prevents unnecessary re-renders

## Customization

### Adding New Categories

1. Update the `functionFiles` array in `scripts/generateDocsData.ts`
2. Run `npm run docs:data` to regenerate the data
3. The new category will automatically appear in the navigation

### Styling Changes

Modify the Tailwind classes in the component files. The design system uses:

- Primary: Blue (blue-600, blue-50, etc.)
- Success: Green (green-600, green-50, etc.)
- Warning: Yellow (yellow-600, yellow-50, etc.)
- Neutral: Gray (gray-900, gray-100, etc.)

### Adding New Features

1. Create new components in the `components/` directory
2. Add routes to `DocsApp.tsx`
3. Update the context if new state management is needed
4. Export components from `index.ts`

## Development Tips

- Use TypeScript for type safety
- Follow the existing naming conventions
- Test search functionality with various queries
- Ensure responsive design works on mobile
- Check that all links and navigation work correctly
- Validate that function examples display properly

## Deployment

The documentation app is built as part of the main React Sheet application. When you run:

```bash
npm run build
```

The docs are included in the production build and served alongside the main spreadsheet application.
