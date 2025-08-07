// utils/excelImport.ts
import * as XLSX from "xlsx";
import type { SpreadsheetData, CellData } from "../types";

export interface ImportResult {
  success: boolean;
  data?: SpreadsheetData;
  error?: string;
  sheetNames?: string[];
  selectedSheet?: string;
}

/**
 * Convert Excel cell value to appropriate JavaScript type
 */
const convertExcelValue = (value: unknown): string => {
  if (value === null || value === undefined) return "";
  if (typeof value === "boolean") return value.toString();
  if (typeof value === "number") {
    // Check if it's a date (Excel stores dates as numbers)
    if (value > 25569) {
      // Excel epoch starts from 1900-01-01
      try {
        const date = XLSX.SSF.parse_date_code(value);
        if (date) {
          return new Date(
            date.y,
            date.m - 1,
            date.d,
            date.H || 0,
            date.M || 0,
            date.S || 0
          ).toLocaleDateString();
        }
      } catch {
        // If date parsing fails, treat as number
      }
    }
    return value.toString();
  }
  return String(value);
};

/**
 * Detect if a value is a formula
 */
const isFormula = (value: unknown): boolean => {
  return typeof value === "string" && value.startsWith("=");
};

/**
 * Convert Excel cell address to our cell ID format
 */
const convertExcelAddress = (address: string): string => {
  // Excel uses addresses like 'A1', 'B2', etc. which matches our format
  return address;
};

/**
 * Import Excel file and convert to SpreadsheetData
 */
export const importExcelFile = async (
  file: File,
  sheetName?: string
): Promise<ImportResult> => {
  try {
    // Read the file
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, {
      type: "array",
      cellFormula: true, // Include formulas
      cellStyles: true, // Include styling info
      cellDates: true, // Parse dates
    });

    // Get available sheet names
    const sheetNames = workbook.SheetNames;

    if (sheetNames.length === 0) {
      return {
        success: false,
        error: "No sheets found in the Excel file",
      };
    }

    // Use specified sheet or first sheet
    const targetSheetName = sheetName || sheetNames[0];
    const worksheet = workbook.Sheets[targetSheetName];

    if (!worksheet) {
      return {
        success: false,
        error: `Sheet "${targetSheetName}" not found`,
        sheetNames,
      };
    }

    // Convert worksheet to SpreadsheetData
    const spreadsheetData: SpreadsheetData = {};

    // Get the range of the worksheet
    const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1:A1");

    // Iterate through all cells in the range
    for (let row = range.s.r; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        const excelCell = worksheet[cellAddress];

        if (excelCell) {
          const cellId = convertExcelAddress(cellAddress);
          const rawValue = excelCell.f
            ? `=${excelCell.f}`
            : convertExcelValue(excelCell.v);
          const isFormulaCell = isFormula(rawValue);

          // Create cell data
          const cellData: CellData = {
            id: cellId,
            rawValue: rawValue,
            computedValue: isFormulaCell ? "" : rawValue, // Formulas will be computed later
            displayValue: isFormulaCell ? rawValue : rawValue,
            type: isFormulaCell ? "formula" : "text",
            style: {
              fontSize: 14,
              textColor: "#000000",
              backgroundColor: "#ffffff",
              horizontalAlign: "left",
              verticalAlign: "top",
              // TODO: Extract actual Excel formatting if available
            },
          };

          // Add formula if it's a formula cell
          if (isFormulaCell) {
            cellData.formula = rawValue;
          }

          spreadsheetData[cellId] = cellData;
        }
      }
    }

    return {
      success: true,
      data: spreadsheetData,
      sheetNames,
      selectedSheet: targetSheetName,
    };
  } catch (error) {
    console.error("Excel import error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error occurred during import",
    };
  }
};

/**
 * Export SpreadsheetData to Excel file
 */
export const exportToExcel = async (
  data: SpreadsheetData,
  filename: string = "spreadsheet.xlsx"
): Promise<void> => {
  try {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Find the maximum row and column with data
    let maxRow = 0;
    let maxCol = 0;

    Object.keys(data).forEach((cellId) => {
      const match = cellId.match(/^([A-Z]+)(\d+)$/);
      if (match) {
        const colLetters = match[1];
        const row = parseInt(match[2]);

        let col = 0;
        for (let i = 0; i < colLetters.length; i++) {
          col = col * 26 + (colLetters.charCodeAt(i) - 65);
        }

        maxRow = Math.max(maxRow, row - 1);
        maxCol = Math.max(maxCol, col);
      }
    });

    // Create worksheet data array
    const wsData: (string | number | boolean)[][] = [];

    // Initialize the array with empty cells
    for (let r = 0; r <= maxRow; r++) {
      wsData[r] = new Array(maxCol + 1).fill("");
    }

    // Fill the array with our data
    Object.entries(data).forEach(([cellId, cellData]) => {
      const match = cellId.match(/^([A-Z]+)(\d+)$/);
      if (match && cellData.rawValue) {
        const colLetters = match[1];
        const row = parseInt(match[2]) - 1;

        let col = 0;
        for (let i = 0; i < colLetters.length; i++) {
          col = col * 26 + (colLetters.charCodeAt(i) - 65);
        }

        // Use raw value for export
        let exportValue = cellData.rawValue;

        // For formulas, ensure they start with =
        if (cellData.type === "formula" && !exportValue.startsWith("=")) {
          exportValue = `=${exportValue}`;
        }

        wsData[row][col] = exportValue;
      }
    });

    // Create worksheet from the array
    const worksheet = XLSX.utils.aoa_to_sheet(wsData);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Write the file
    XLSX.writeFile(workbook, filename);
  } catch (error) {
    console.error("Excel export error:", error);
    throw new Error("Failed to export to Excel");
  }
};

/**
 * Get preview of Excel file without full import
 */
export const previewExcelFile = async (
  file: File
): Promise<{
  sheetNames: string[];
  sampleData: { [sheetName: string]: (string | number | boolean)[][] };
}> => {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });

  const result: {
    sheetNames: string[];
    sampleData: { [sheetName: string]: (string | number | boolean)[][] };
  } = {
    sheetNames: workbook.SheetNames,
    sampleData: {},
  };

  // Get sample data (first 5 rows) from each sheet
  workbook.SheetNames.forEach((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      range: 0, // Start from first row
      blankrows: false,
    }) as (string | number | boolean)[][];

    // Take only first 5 rows for preview
    result.sampleData[sheetName] = jsonData.slice(0, 5);
  });

  return result;
};
