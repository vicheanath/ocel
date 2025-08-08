# Documentation Generation Scripts

This directory contains scripts to generate comprehensive documentation for all functions in the React Sheet application.

## Scripts

### 🗃️ `generateDatabaseFunctionsDocs.js`

Generates markdown documentation specifically for database functions.

**Usage:**

```bash
npm run docs:db
# or
node scripts/generateDatabaseFunctionsDocs.js
```

**Output:** `docs/DATABASE_FUNCTIONS.md`

### � `generateDocsData.ts` (Recommended)

TypeScript-based documentation generator that creates structured data for the React documentation app.

**Usage:**

```bash
npm run docs:data
# or
npx tsx scripts/generateDocsData.ts
```

**Outputs:**

- `src/docs/functionsData.json` - Structured data for React app
- `src/docs/types.ts` - Auto-generated TypeScript interfaces
- `docs/*.md` - Individual category markdown files

## Generated Documentation

After running the scripts, you'll find:

```
public/docs/
├── complete-reference.md         # Complete function reference
├── database.md                   # Database functions category
├── math-trigonometry.md          # Math functions category
├── text.md                      # Text functions category
└── ... (other category files)

src/docs/
├── functionsData.json           # Structured data for React app
└── types.ts                     # Auto-generated TypeScript types
```

## Features

### Markdown Documentation

- ✅ Function descriptions and syntax
- ✅ Usage examples
- ✅ Parameter explanations
- ✅ Category organization
- ✅ Best practices and usage notes

### TypeScript Data Generation

- ✅ Structured JSON data for React apps
- ✅ Auto-generated TypeScript interfaces
- ✅ Type-safe function metadata
- ✅ Category-based organization

## Function Categories Covered

The scripts automatically detect and document functions from these categories:

1. **Database Functions** (10 functions)

   - DSUM, DCOUNT, DAVERAGE, etc.

2. **Date & Time Functions** (23 functions)

   - DATE, TIME, NOW, etc.

3. **Math & Trigonometry Functions** (49 functions)

   - SUM, AVERAGE, SIN, COS, etc.

4. **Text Functions** (49 functions)

   - CONCATENATE, LEFT, RIGHT, etc.

5. **Statistical Functions** (62 functions)

   - STDEV, VAR, CORREL, etc.

6. **Logical Functions** (19 functions)

   - IF, AND, OR, NOT, etc.

7. **Financial Functions** (26 functions)

   - NPV, IRR, PMT, etc.

8. **Engineering Functions** (26 functions)

   - BIN2DEC, HEX2DEC, etc.

9. **Information Functions** (22 functions)

   - ISNA, ISERROR, TYPE, etc.

10. **Lookup & Reference Functions** (9 functions)

    - VLOOKUP, HLOOKUP, INDEX, etc.

11. **Web Functions** (3 functions)

    - WEBSERVICE, FILTERXML, etc.

12. **Legacy Functions** (13 functions)
    - Compatibility functions

**Total: 298+ functions documented**

## How It Works

1. **Parsing**: Scripts read TypeScript function files and extract `registry.register()` calls
2. **Processing**: Metadata (description, syntax, examples) is parsed and structured
3. **Generation**: Markdown and HTML are generated with proper formatting and navigation

## Customization

To modify the documentation format:

1. Edit the `generateDocsData.ts` script for TypeScript/JSON generation
2. Edit the `generateDatabaseFunctionsDocs.js` script for database-specific docs
3. Add new function categories to the `functionFiles` array in `generateDocsData.ts`
4. Update parsing regex patterns if function registration format changes

## Development Notes

- Scripts use ES modules (requires Node.js 14+)
- Parsing handles multi-line function registrations
- Examples are extracted from various quote formats
- Error handling for missing files and malformed functions
- Automatic docs directory creation

## Contributing

When adding new functions:

1. Follow the existing `registry.register()` format
2. Include proper metadata (description, syntax, examples)
3. Re-run `npm run docs:data` to update documentation
4. Commit both code and generated docs

---

_Happy documenting! 📝_
