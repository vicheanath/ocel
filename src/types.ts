// types.ts
export type CellValue = string | number | boolean;
export type CellType = 'text' | 'number' | 'formula' | 'boolean';

export interface CellPosition {
  row: number;
  col: number;
}

export interface CellRange {
  start: CellPosition;
  end: CellPosition;
}

export interface CellStyle {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  fontSize?: number; // in px
  fontFamily?: string;
  textColor?: string; // hex color
  backgroundColor?: string; // hex color
  horizontalAlign?: 'left' | 'center' | 'right' | 'justify';
  verticalAlign?: 'top' | 'middle' | 'bottom';
  border?: string; // e.g., "1px solid #000"
}

export interface CellData {
  id: string; // e.g., "A1"
  rawValue: string;
  computedValue: CellValue;
  displayValue: string;
  formula?: string;
  style: CellStyle;
  type: CellType;
  merged?: CellRange; // If this cell is merged
}

export interface SpreadsheetData {
  [cellId: string]: CellData;
}

export interface FunctionMetadata {
  description: string;
  syntax: string;
  category: string;
  examples: string[];
}