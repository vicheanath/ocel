# React Spreadsheet with Excel Import/Export

A fully-featured, Excel-like spreadsheet application built with React, TypeScript, and Vite. This project provides a comprehensive spreadsheet solution with advanced features including Excel file import/export, formula evaluation, and professional styling.

## 🚀 Features

### ✨ Core Spreadsheet Functionality

- **Excel-like Grid Interface**: 50 rows × 26 columns with smooth scrolling and navigation
- **Cell Editing**: Click to edit cells with inline editing and keyboard shortcuts
- **Keyboard Navigation**: Arrow keys, Enter, Tab navigation with Excel-like behavior
- **Cell Selection**: Single cell and range selection with visual feedback
- **Formula Engine**: Support for complex formulas with cell references and functions
- **Cell Formatting**: Bold, italic, font size, colors, alignment, and more
- **Merge/Unmerge Cells**: Excel-style cell merging functionality
- **Dynamic Resizing**: Drag column/row borders or double-click to auto-fit content

### 📊 Excel Import/Export

- **Import Excel Files** (.xlsx, .xls): Full support for Excel file parsing
- **Export to Excel**: Save your spreadsheet as Excel files with formulas preserved
- **Multi-sheet Support**: Handle workbooks with multiple sheets
- **Formula Preservation**: Import and export formulas with proper syntax
- **Data Type Detection**: Automatic detection of text, numbers, dates, and formulas
- **Merge Options**: Choose to replace or merge with existing data during import
- **Preview Mode**: Preview Excel content before importing

### 🧮 Advanced Formula System

- **Built-in Functions**: SUM, AVERAGE, COUNT, MIN, MAX, INDEX, INDIRECT, OFFSET
- **Cell References**: Support for A1-style cell references (A1, B2, etc.)
- **Range References**: Support for cell ranges (A1:C3)
- **Formula Autocomplete**: Intelligent formula suggestions
- **Error Handling**: Proper error display for invalid formulas
- **Dependency Tracking**: Automatic recalculation when referenced cells change
- **Dynamic Functions**: INDEX, INDIRECT, OFFSET for advanced cell referencing

### 💎 Performance & UX

- **Optimized Rendering**: React.memo, useMemo, useCallback for performance
- **Lazy Loading**: Cells created on-demand for better memory usage
- **Excel-style UI**: Professional look with hover effects and transitions
- **Responsive Design**: Works on different screen sizes
- **Visual Feedback**: Hover states, selection indicators, resize handles

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- pnpm (or npm/yarn)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd react-sheet

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The application will be available at `http://localhost:5173`

## 📖 Usage Guide

### Basic Operations

1. **Cell Navigation**: Use arrow keys or click cells to navigate
2. **Edit Cells**: Double-click a cell or press F2 to start editing
3. **Formulas**: Start with `=` to create formulas (e.g., `=A1+B1`, `=SUM(A1:A5)`)
4. **Keyboard Shortcuts**:
   - `Enter`: Confirm edit and move down
   - `Tab`: Confirm edit and move right
   - `Escape`: Cancel editing
   - `Delete/Backspace`: Clear cell content
   - `F2`: Start editing selected cell

### Excel Import/Export

1. **Import Excel Files**:

   - Click "Import/Export" button in toolbar
   - Select an Excel file (.xlsx or .xls)
   - Choose sheet if multiple sheets exist
   - Select import mode (Replace or Merge)
   - Preview data and click "Import Data"

2. **Export to Excel**:

   - Click "Import/Export" button in toolbar
   - Click "Export to Excel" to download your spreadsheet
   - File includes all data, formulas, and basic formatting

3. **Load Sample Data**:
   - Click "Load Sample" to see a demonstration spreadsheet
   - Includes products, quantities, prices with calculated totals

### Advanced Features

- **Column Resizing**: Drag column borders or double-click to auto-fit
- **Row Resizing**: Drag row borders or double-click to auto-fit
- **Cell Merging**: Select range and click "Merge Cells"
- **Formatting**: Use toolbar to apply bold, italic, colors, alignment
- **Formula Cell Picking**: When editing formulas, click cells to insert references

## 🏗️ Technical Architecture

### Project Structure

```
src/
├── components/          # React components
│   ├── Grid.tsx            # Main spreadsheet grid
│   ├── FormulaBar.tsx      # Formula input bar
│   ├── Toolbar.tsx         # Formatting toolbar
│   ├── Spreadsheet.tsx     # Main container
│   └── ExcelImportDialog.tsx # Import/export dialog
├── formulaEngine/       # Formula calculation system
│   ├── FormulaEngine.ts    # Main engine
│   ├── FormulaParser.ts    # Formula parsing
│   ├── FormulaEvaluator.ts # Formula evaluation
│   ├── FunctionRegistry.ts # Built-in functions
│   └── DependencyGraph.ts  # Dependency tracking
├── utils/               # Utility functions
│   ├── spreadsheetUtils.ts # Core utilities
│   ├── excelImport.ts      # Excel import/export
│   └── sampleData.ts       # Sample data generator
└── types.ts            # TypeScript type definitions
```

### Key Technologies

- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Full type safety throughout the application
- **Vite**: Fast build tool and development server
- **TailwindCSS**: Utility-first styling
- **XLSX**: Excel file parsing and generation library
- **File-saver**: Client-side file downloads

### Performance Optimizations

- **React.memo**: Prevent unnecessary component re-renders
- **useMemo/useCallback**: Memoize expensive calculations
- **Lazy Cell Creation**: Create cells only when accessed
- **Visible Area Limiting**: Render only visible rows/columns
- **Efficient Formula Engine**: Smart dependency tracking and recalculation

## 🧪 Development

### Available Scripts

```bash
pnpm dev       # Start development server
pnpm build     # Build for production
pnpm preview   # Preview production build
pnpm lint      # Run ESLint
```

### Adding New Features

1. **New Functions**: Add to `FunctionRegistry.ts`
2. **UI Components**: Create in `components/` directory
3. **Utilities**: Add to `utils/` directory
4. **Types**: Define in `types.ts`

### Testing the Excel Features

1. Use "Load Sample" to populate with test data
2. Export to Excel and verify the downloaded file
3. Import the exported file to test round-trip compatibility
4. Test with your own Excel files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🎯 Future Roadmap

- [ ] Chart integration
- [ ] Conditional formatting
- [ ] Data validation
- [ ] Pivot tables
- [ ] More Excel functions (DATE, TEXT, LOOKUP functions)
- [ ] Collaboration features
- [ ] Undo/Redo functionality
- [ ] Custom number formats
- [ ] Print support

---

Built with ❤️ using React, TypeScript, and modern web technologies.
