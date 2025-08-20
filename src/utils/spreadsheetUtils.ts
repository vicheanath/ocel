// utils/spreadsheetUtils.ts

// utils/spreadsheetUtils.ts - Optimized spreadsheet utilities with graph algorithms
import type {
  SpreadsheetData,
  CellData,
  CellPosition,
  CellRange,
  CellValue,
} from "../types";

// Column ID cache for performance
const COLUMN_ID_CACHE = new Map<number, string>();
const CELL_ID_CACHE = new Map<string, CellPosition>();

// Pre-compute column headers for better performance
export const COLUMN_HEADERS = Array.from({ length: 702 }, (_, i) => {
  // Support columns up to ZZ (702 columns)
  if (i < 26) {
    return String.fromCharCode(65 + i);
  } else {
    const firstChar = Math.floor((i - 26) / 26);
    const secondChar = (i - 26) % 26;
    return (
      String.fromCharCode(65 + firstChar) + String.fromCharCode(65 + secondChar)
    );
  }
});

// Fast column ID generation with caching
export function getColumnId(col: number): string {
  if (COLUMN_ID_CACHE.has(col)) {
    return COLUMN_ID_CACHE.get(col)!;
  }

  let result = "";
  let c = col;

  while (c >= 0) {
    result = String.fromCharCode(65 + (c % 26)) + result;
    c = Math.floor(c / 26) - 1;
  }

  COLUMN_ID_CACHE.set(col, result);
  return result;
}

// Fast cell ID generation
export function getCellId(position: CellPosition): string {
  return getColumnId(position.col) + (position.row + 1);
}

// Fast cell ID parsing with caching
export function parseCellId(cellId: string): CellPosition {
  if (CELL_ID_CACHE.has(cellId)) {
    return CELL_ID_CACHE.get(cellId)!;
  }

  const match = cellId.match(/^([A-Z]+)(\d+)$/);
  if (!match) {
    throw new Error(`Invalid cell ID: ${cellId}`);
  }

  const colLetters = match[1];
  const row = parseInt(match[2]) - 1;

  let col = 0;
  for (let i = 0; i < colLetters.length; i++) {
    col = col * 26 + (colLetters.charCodeAt(i) - 65);
  }

  const position = { row, col };
  CELL_ID_CACHE.set(cellId, position);
  return position;
}

// Optimized cell range utilities
export function getCellRange(
  start: CellPosition,
  end: CellPosition
): CellRange {
  return {
    start: {
      row: Math.min(start.row, end.row),
      col: Math.min(start.col, end.col),
    },
    end: {
      row: Math.max(start.row, end.row),
      col: Math.max(start.col, end.col),
    },
  };
}

// Efficient range cell enumeration using generators
export function* getCellsInRangeGenerator(range: CellRange): Generator<string> {
  for (let row = range.start.row; row <= range.end.row; row++) {
    for (let col = range.start.col; col <= range.end.col; col++) {
      yield getCellId({ row, col });
    }
  }
}

// Get all cells in range as array (for backward compatibility)
export function getCellsInRange(range: CellRange): string[] {
  return Array.from(getCellsInRangeGenerator(range));
}

// Calculate range size efficiently
export function getRangeSize(range: CellRange): {
  rows: number;
  cols: number;
  totalCells: number;
} {
  const rows = range.end.row - range.start.row + 1;
  const cols = range.end.col - range.start.col + 1;
  return { rows, cols, totalCells: rows * cols };
}

// Check if ranges intersect
export function rangesIntersect(range1: CellRange, range2: CellRange): boolean {
  return !(
    range1.end.row < range2.start.row ||
    range1.start.row > range2.end.row ||
    range1.end.col < range2.start.col ||
    range1.start.col > range2.end.col
  );
}

// Get intersection of two ranges
export function getRangeIntersection(
  range1: CellRange,
  range2: CellRange
): CellRange | null {
  if (!rangesIntersect(range1, range2)) {
    return null;
  }

  return {
    start: {
      row: Math.max(range1.start.row, range2.start.row),
      col: Math.max(range1.start.col, range2.start.col),
    },
    end: {
      row: Math.min(range1.end.row, range2.end.row),
      col: Math.min(range1.end.col, range2.end.col),
    },
  };
}

// Optimized cell value formatting
const FORMATTER_CACHE = new Map<string, (value: CellValue) => string>();

export function formatCellValue(value: CellValue): string {
  if (typeof value === "number") {
    // Cache number formatters for common patterns
    const cacheKey = typeof value === "number" ? "number" : typeof value;

    if (FORMATTER_CACHE.has(cacheKey)) {
      return FORMATTER_CACHE.get(cacheKey)!(value);
    }

    const formatter = (val: CellValue) => {
      if (typeof val === "number") {
        if (Number.isInteger(val)) {
          return val.toString();
        } else {
          // Format decimal numbers with reasonable precision
          return parseFloat(val.toFixed(10)).toString();
        }
      }
      return String(val);
    };

    FORMATTER_CACHE.set(cacheKey, formatter);
    return formatter(value);
  }

  return String(value);
}

// Create empty grid with lazy initialization
export function createEmptyGrid(_rows: number, _cols: number): SpreadsheetData {
  // Instead of pre-creating all cells, create an empty object
  // Cells will be created on-demand when accessed
  return {};
}

// Create a default cell data structure
export function createDefaultCell(cellId: string): CellData {
  return {
    id: cellId,
    rawValue: "",
    computedValue: "",
    displayValue: "",
    type: "text",
    style: {
      fontSize: 14,
      textColor: "#000000",
      backgroundColor: "#ffffff",
      horizontalAlign: "left",
      verticalAlign: "top",
    },
  };
}

// Optimized cell access with lazy creation
export function getOrCreateCell(
  data: SpreadsheetData,
  cellId: string
): CellData {
  if (!data[cellId]) {
    data[cellId] = createDefaultCell(cellId);
  }
  return data[cellId];
}

// Batch cell operations for better performance
export interface CellUpdate {
  cellId: string;
  updates: Partial<CellData>;
}

export function applyBatchCellUpdates(
  data: SpreadsheetData,
  updates: CellUpdate[]
): SpreadsheetData {
  const newData = { ...data };

  for (const { cellId, updates: cellUpdates } of updates) {
    const existingCell = getOrCreateCell(newData, cellId);
    newData[cellId] = { ...existingCell, ...cellUpdates };
  }

  return newData;
}

// Range-based operations
export interface RangeOperation {
  type: "fill" | "format" | "clear" | "copy" | "move";
  range: CellRange;
  data?: { value?: CellValue; style?: Record<string, unknown> };
}

export function applyRangeOperation(
  data: SpreadsheetData,
  operation: RangeOperation
): SpreadsheetData {
  const newData = { ...data };

  switch (operation.type) {
    case "clear":
      for (const cellId of getCellsInRangeGenerator(operation.range)) {
        if (newData[cellId]) {
          newData[cellId] = {
            ...newData[cellId],
            rawValue: "",
            computedValue: "",
            displayValue: "",
          };
        }
      }
      break;

    case "format":
      if (operation.data && operation.data.style) {
        for (const cellId of getCellsInRangeGenerator(operation.range)) {
          const cell = getOrCreateCell(newData, cellId);
          newData[cellId] = {
            ...cell,
            style: { ...cell.style, ...operation.data.style },
          };
        }
      }
      break;

    case "fill":
      if (operation.data && operation.data.value) {
        for (const cellId of getCellsInRangeGenerator(operation.range)) {
          const cell = getOrCreateCell(newData, cellId);
          newData[cellId] = {
            ...cell,
            rawValue: String(operation.data.value),
            computedValue: operation.data.value,
            displayValue: formatCellValue(operation.data.value),
          };
        }
      }
      break;
  }

  return newData;
}

// Memory optimization utilities
export function compactSpreadsheetData(data: SpreadsheetData): SpreadsheetData {
  const compacted: SpreadsheetData = {};

  for (const [cellId, cellData] of Object.entries(data)) {
    // Only keep cells that have content or custom formatting
    if (
      cellData.rawValue ||
      cellData.style?.backgroundColor !== "#ffffff" ||
      cellData.style?.textColor !== "#000000" ||
      cellData.style?.bold ||
      cellData.style?.italic ||
      cellData.style?.underline ||
      cellData.merged
    ) {
      compacted[cellId] = cellData;
    }
  }

  return compacted;
}

// Get spreadsheet statistics for optimization insights
export function getSpreadsheetStats(data: SpreadsheetData): {
  totalCells: number;
  populatedCells: number;
  formulaCells: number;
  styledCells: number;
  mergedCells: number;
  memoryUsage: number;
} {
  const totalCells = Object.keys(data).length;
  let populatedCells = 0;
  let formulaCells = 0;
  let styledCells = 0;
  let mergedCells = 0;

  for (const cellData of Object.values(data)) {
    if (cellData.rawValue) populatedCells++;
    if (cellData.type === "formula") formulaCells++;
    if (cellData.merged) mergedCells++;

    // Check if cell has non-default styling
    if (
      cellData.style?.backgroundColor !== "#ffffff" ||
      cellData.style?.textColor !== "#000000" ||
      cellData.style?.bold ||
      cellData.style?.italic ||
      cellData.style?.underline
    ) {
      styledCells++;
    }
  }

  // Rough memory usage estimation (in bytes)
  const memoryUsage = JSON.stringify(data).length * 2; // UTF-16 encoding

  return {
    totalCells,
    populatedCells,
    formulaCells,
    styledCells,
    mergedCells,
    memoryUsage,
  };
}

// Efficient viewport calculation for virtual scrolling
export interface Viewport {
  startRow: number;
  endRow: number;
  startCol: number;
  endCol: number;
}

export function calculateViewport(
  scrollTop: number,
  scrollLeft: number,
  containerHeight: number,
  containerWidth: number,
  rowHeight: number = 40,
  columnWidth: number = 96,
  headerHeight: number = 40,
  headerWidth: number = 48,
  overscan: number = 5
): Viewport {
  const visibleStartRow = Math.max(
    0,
    Math.floor((scrollTop - headerHeight) / rowHeight)
  );
  const visibleEndRow = Math.ceil(
    (scrollTop - headerHeight + containerHeight) / rowHeight
  );
  const visibleStartCol = Math.max(
    0,
    Math.floor((scrollLeft - headerWidth) / columnWidth)
  );
  const visibleEndCol = Math.ceil(
    (scrollLeft - headerWidth + containerWidth) / columnWidth
  );

  return {
    startRow: Math.max(0, visibleStartRow - overscan),
    endRow: visibleEndRow + overscan,
    startCol: Math.max(0, visibleStartCol - overscan),
    endCol: visibleEndCol + overscan,
  };
}

// Performance measurement utilities
export class PerformanceProfiler {
  private measurements = new Map<string, number[]>();

  start(label: string): () => void {
    const startTime = performance.now();

    return () => {
      const duration = performance.now() - startTime;
      if (!this.measurements.has(label)) {
        this.measurements.set(label, []);
      }
      this.measurements.get(label)!.push(duration);
    };
  }

  getStats(
    label: string
  ): { avg: number; min: number; max: number; count: number } | null {
    const measures = this.measurements.get(label);
    if (!measures || measures.length === 0) {
      return null;
    }

    const avg = measures.reduce((sum, val) => sum + val, 0) / measures.length;
    const min = Math.min(...measures);
    const max = Math.max(...measures);

    return { avg, min, max, count: measures.length };
  }

  getAllStats(): Record<
    string,
    { avg: number; min: number; max: number; count: number } | null
  > {
    const stats: Record<
      string,
      { avg: number; min: number; max: number; count: number } | null
    > = {};
    for (const [label] of this.measurements) {
      stats[label] = this.getStats(label);
    }
    return stats;
  }

  clear() {
    this.measurements.clear();
  }
}

// Global profiler instance
export const globalProfiler = new PerformanceProfiler();
