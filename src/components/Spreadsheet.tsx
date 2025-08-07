// components/Spreadsheet.tsx
import React, { useState, useCallback, useMemo, useEffect } from "react";
import Grid from "./Grid";
import FormulaBar from "./FormulaBar";
import Toolbar from "./Toolbar";
import ExcelImportDialog from "./ExcelImportDialog";
import { FormulaEngine } from "../formulaEngine/FormulaEngine";
import type {
  SpreadsheetData,
  CellPosition,
  CellRange,
  CellStyle,
} from "../types";
import {
  createEmptyGrid,
  formatCellValue,
  getCellId,
  getCellRange,
  getCellsInRange,
} from "../utils/spreadsheetUtils";
import { createSampleSpreadsheetData } from "../utils/sampleData";

const ROWS = 50; // Reduced from 100
const COLS = 26;

const Spreadsheet: React.FC = () => {
  const [spreadsheetData, setSpreadsheetData] = useState<SpreadsheetData>(
    createEmptyGrid(ROWS, COLS)
  );
  const [selectedCell, setSelectedCell] = useState<string>("A1");
  const [selectedRange, setSelectedRange] = useState<CellRange | null>(null);
  const [isEditingFormula, setIsEditingFormula] = useState<boolean>(false);
  const [formulaBarValue, setFormulaBarValue] = useState<string>("");
  const [isImportDialogOpen, setIsImportDialogOpen] = useState<boolean>(false);
  const formulaEngine = useMemo(() => new FormulaEngine(), []);

  // Handle cell selection - supports both normal selection and formula cell picking
  const handleCellSelect = useCallback(
    (cellId: string) => {
      if (isEditingFormula) {
        // When editing a formula, clicking a cell should insert its reference
        setFormulaBarValue((prev) => prev + cellId);
      } else {
        // Normal cell selection
        setSelectedCell(cellId);
        // Reset formula bar value to match the newly selected cell
        setFormulaBarValue("");
      }
    },
    [isEditingFormula]
  );

  // Sync formulaBarValue with selected cell when not editing formula
  useEffect(() => {
    if (!isEditingFormula) {
      setFormulaBarValue("");
    }
  }, [selectedCell, isEditingFormula]);

  // Update cell value
  const updateCell = useCallback(
    (cellId: string, value: string) => {
      setSpreadsheetData((prev) => {
        const newData = { ...prev };
        const cell = { ...newData[cellId] };

        cell.rawValue = value;

        // Detect if it's a formula
        if (value.startsWith("=")) {
          cell.type = "formula";
          cell.formula = value;
          try {
            cell.computedValue = formulaEngine.evaluate(cellId, value, newData);
            cell.displayValue = formatCellValue(cell.computedValue);
          } catch {
            cell.computedValue = `#ERROR!`;
            cell.displayValue = `#ERROR!`;
          }
        } else {
          cell.type = "text";
          cell.computedValue = value;
          cell.displayValue = value;
          delete cell.formula;
        }

        newData[cellId] = cell;

        // Update dependent cells
        const dependents = formulaEngine.getDependents(cellId);
        dependents.forEach((depId) => {
          const depCell = newData[depId];
          if (depCell?.formula) {
            depCell.computedValue = formulaEngine.evaluate(
              depId,
              depCell.formula,
              newData
            );
            depCell.displayValue = formatCellValue(depCell.computedValue);
          }
        });

        return newData;
      });
    },
    [formulaEngine]
  );

  // Apply formatting to selected cells
  const applyFormatting = useCallback(
    (style: Partial<CellStyle>) => {
      setSpreadsheetData((prev) => {
        const newData = { ...prev };
        const cellsToUpdate = selectedRange
          ? getCellsInRange(selectedRange)
          : [selectedCell];

        cellsToUpdate.forEach((cellId) => {
          if (newData[cellId]) {
            newData[cellId] = {
              ...newData[cellId],
              style: {
                ...newData[cellId].style,
                ...style,
              },
            };
          }
        });

        return newData;
      });
    },
    [selectedCell, selectedRange]
  );

  // Merge selected cells
  const mergeCells = useCallback(() => {
    if (!selectedRange) return;

    setSpreadsheetData((prev) => {
      const newData = { ...prev };
      const cells = getCellsInRange(selectedRange);
      const masterCellId = getCellId(selectedRange.start);

      // Set merged range on master cell
      newData[masterCellId] = {
        ...newData[masterCellId],
        merged: selectedRange,
      };

      // Clear other cells in the range
      cells.forEach((cellId) => {
        if (cellId !== masterCellId) {
          newData[cellId] = {
            ...newData[cellId],
            rawValue: "",
            computedValue: "",
            displayValue: "",
            merged: undefined,
          };
        }
      });

      return newData;
    });

    setSelectedCell(getCellId(selectedRange.start));
    setSelectedRange(null);
  }, [selectedRange]);

  // Unmerge cells
  const unmergeCells = useCallback(() => {
    const cell = spreadsheetData[selectedCell];
    if (!cell?.merged) return;

    setSpreadsheetData((prev) => {
      const newData = { ...prev };
      delete newData[selectedCell].merged;
      return newData;
    });
  }, [selectedCell, spreadsheetData]);

  // Handle Excel import
  const handleImportData = useCallback(
    (data: SpreadsheetData) => {
      // Recalculate all formulas after import
      const updatedData = { ...data };
      Object.entries(updatedData).forEach(([cellId, cellData]) => {
        if (cellData.type === "formula" && cellData.formula) {
          try {
            cellData.computedValue = formulaEngine.evaluate(
              cellId,
              cellData.formula,
              updatedData
            );
            cellData.displayValue = formatCellValue(cellData.computedValue);
          } catch {
            cellData.computedValue = "#ERROR!";
            cellData.displayValue = "#ERROR!";
          }
        }
      });

      setSpreadsheetData(updatedData);
      // Reset selected cell and range
      setSelectedCell("A1");
      setSelectedRange(null);
      setFormulaBarValue("");
    },
    [formulaEngine]
  );

  // Handle loading sample data
  const handleLoadSample = useCallback(() => {
    const sampleData = createSampleSpreadsheetData();
    handleImportData(sampleData);
  }, [handleImportData]);

  // Handle range selection
  const handleRangeSelect = (start: CellPosition, end: CellPosition) => {
    const range = getCellRange(start, end);
    setSelectedRange(range);
    setSelectedCell(getCellId(start));
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Toolbar
        onFormatChange={applyFormatting}
        onMerge={mergeCells}
        onUnmerge={unmergeCells}
        onBold={() => applyFormatting({ bold: true })}
        onItalic={() => applyFormatting({ italic: true })}
        onAlignLeft={() => applyFormatting({ horizontalAlign: "left" })}
        onAlignCenter={() => applyFormatting({ horizontalAlign: "center" })}
        onAlignRight={() => applyFormatting({ horizontalAlign: "right" })}
        onImportExport={() => setIsImportDialogOpen(true)}
        onLoadSample={handleLoadSample}
      />

      <FormulaBar
        value={formulaBarValue || spreadsheetData[selectedCell]?.rawValue || ""}
        onChange={(value) => {
          setFormulaBarValue(value);
          updateCell(selectedCell, value);
        }}
        formulaEngine={formulaEngine}
        selectedCell={selectedCell}
        onFormulaEditingChange={setIsEditingFormula}
      />

      <Grid
        data={spreadsheetData}
        rows={ROWS}
        cols={COLS}
        selectedCell={selectedCell}
        selectedRange={selectedRange}
        onSelectCell={handleCellSelect}
        onSelectRange={handleRangeSelect}
        onCellEdit={updateCell}
        formulaEngine={formulaEngine}
      />

      <ExcelImportDialog
        isOpen={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onImport={handleImportData}
        currentData={spreadsheetData}
      />
    </div>
  );
};

export default Spreadsheet;
