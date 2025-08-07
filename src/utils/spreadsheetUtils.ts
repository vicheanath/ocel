// utils/spreadsheetUtils.ts

import type { CellPosition, CellRange, SpreadsheetData } from "../types";

export const getCellId = (position: CellPosition): string => {
  return `${String.fromCharCode(65 + position.col)}${position.row + 1}`;
};

export const parseCellId = (id: string): CellPosition => {
  const col = id.match(/[A-Z]+/)?.[0] || "";
  const row = id.match(/\d+/)?.[0] || "";
  return {
    col: col.charCodeAt(0) - 65,
    row: parseInt(row) - 1,
  };
};

export const getCellRange = (
  start: CellPosition,
  end: CellPosition
): CellRange => {
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
};

export const getCellsInRange = (range: CellRange): string[] => {
  const cells: string[] = [];
  for (let row = range.start.row; row <= range.end.row; row++) {
    for (let col = range.start.col; col <= range.end.col; col++) {
      cells.push(getCellId({ row, col }));
    }
  }
  return cells;
};

export const createEmptyGrid = (
  rows: number,
  cols: number
): SpreadsheetData => {
  const data: SpreadsheetData = {};

  // Only create cells for the visible area initially (performance optimization)
  const visibleRows = Math.min(rows, 50);
  const visibleCols = Math.min(cols, 26);

  for (let row = 0; row < visibleRows; row++) {
    for (let col = 0; col < visibleCols; col++) {
      const cellId = getCellId({ row, col });
      data[cellId] = {
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
  }
  return data;
};

export const formatCellValue = (value: string | number | boolean): string => {
  if (value === null || value === undefined) return "";
  if (typeof value === "number") {
    // Format numbers with commas and fixed decimals
    return new Intl.NumberFormat(undefined, {
      maximumFractionDigits: 2,
    }).format(value);
  }
  return String(value);
};
