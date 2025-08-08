// components/SpreadsheetWithUndoRedo.tsx
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "./Grid";
import FormulaBar from "./FormulaBar";
import Toolbar from "./Toolbar";
import ExcelImportDialog from "./ExcelImportDialog";
import { FormulaEngine } from "../formulaEngine/FormulaEngine";
import { useUndoRedo } from "../hooks/useUndoRedo";
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

const ROWS = 50;
const COLS = 26;

const SpreadsheetWithUndoRedo: React.FC = () => {
  const navigate = useNavigate();
  const [initialData] = useState<SpreadsheetData>(() =>
    createEmptyGrid(ROWS, COLS)
  );
  const [spreadsheetData, setSpreadsheetData] =
    useState<SpreadsheetData>(initialData);
  const [selectedCell, setSelectedCell] = useState<string>("A1");
  const [selectedRange, setSelectedRange] = useState<CellRange | null>(null);
  const [isEditingFormula, setIsEditingFormula] = useState<boolean>(false);
  const [formulaBarValue, setFormulaBarValue] = useState<string>("");
  const [isImportDialogOpen, setIsImportDialogOpen] = useState<boolean>(false);
  const formulaEngine = useMemo(() => new FormulaEngine(), []);

  // Initialize undo/redo system
  const undoRedoSystem = useUndoRedo(
    initialData,
    // onDataChange callback
    useCallback((newData: SpreadsheetData) => {
      setSpreadsheetData(newData);
    }, []),
    // onSelectionChange callback
    useCallback((cell: string, range: CellRange | null) => {
      setSelectedCell(cell);
      setSelectedRange(range);
    }, [])
  );

  // Enhanced cell update with formula engine and undo/redo
  const updateCellWithFormulas = useCallback(
    (cellId: string, value: string) => {
      // Get current state for formula calculations
      const currentState = undoRedoSystem.stateManager.getCurrentState();
      const newData = { ...currentState };
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

      // Update the state manager directly and then use undo/redo system
      undoRedoSystem.stateManager.setState(newData);
      undoRedoSystem.updateCell(cellId, value);
    },
    [formulaEngine, undoRedoSystem]
  );

  // Handle cell selection
  const handleCellSelect = useCallback(
    (cellId: string) => {
      if (isEditingFormula) {
        setFormulaBarValue((prev) => prev + cellId);
      } else {
        setSelectedCell(cellId);
        undoRedoSystem.stateManager.setSelectedCell(cellId);
        setFormulaBarValue("");
      }
    },
    [isEditingFormula, undoRedoSystem.stateManager]
  );

  // Enhanced formatting with undo/redo
  const applyFormatting = useCallback(
    (style: Partial<CellStyle>) => {
      const cellsToUpdate = selectedRange
        ? getCellsInRange(selectedRange)
        : [selectedCell];

      undoRedoSystem.applyFormatting(cellsToUpdate, style);
    },
    [selectedCell, selectedRange, undoRedoSystem]
  );

  // Enhanced merge with undo/redo
  const mergeCells = useCallback(() => {
    if (!selectedRange) return;
    undoRedoSystem.mergeCells(selectedRange);
    setSelectedCell(getCellId(selectedRange.start));
    setSelectedRange(null);
  }, [selectedRange, undoRedoSystem]);

  // Enhanced unmerge with undo/redo
  const unmergeCells = useCallback(() => {
    undoRedoSystem.unmergeCells(selectedCell);
  }, [selectedCell, undoRedoSystem]);

  // Handle Excel import with undo/redo
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

      // Prepare bulk update for undo/redo
      const changes: Record<string, { newValue: string; oldValue: string }> =
        {};
      const currentData = undoRedoSystem.stateManager.getCurrentState();

      Object.entries(updatedData).forEach(([cellId, cellData]) => {
        const oldValue = currentData[cellId]?.rawValue || "";
        if (oldValue !== cellData.rawValue) {
          changes[cellId] = {
            newValue: cellData.rawValue,
            oldValue: oldValue,
          };
        }
      });

      // Update state and create undo/redo point
      undoRedoSystem.stateManager.setState(updatedData);
      if (Object.keys(changes).length > 0) {
        undoRedoSystem.bulkUpdate(changes);
      }

      // Reset UI state
      setSelectedCell("A1");
      setSelectedRange(null);
      setFormulaBarValue("");
    },
    [formulaEngine, undoRedoSystem]
  );

  // Handle loading sample data
  const handleLoadSample = useCallback(() => {
    const sampleData = createSampleSpreadsheetData();
    handleImportData(sampleData);
  }, [handleImportData]);

  // Handle navigation to docs
  const handleDocs = useCallback(() => {
    navigate("/docs");
  }, [navigate]);

  // Handle print
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Handle paint format
  const handlePaintFormat = useCallback(() => {
    // Implement paint format functionality
    console.log("Paint format clicked");
  }, []);

  // Handle zoom change
  const handleZoomChange = useCallback((zoom: string) => {
    // Implement zoom functionality
    console.log("Zoom changed to:", zoom);
  }, []);

  // Handle underline
  const handleUnderline = useCallback(() => {
    applyFormatting({ underline: true });
  }, [applyFormatting]);

  // Handle strikethrough
  const handleStrikethrough = useCallback(() => {
    // Add strikethrough to CellStyle type if needed
    console.log("Strikethrough clicked");
  }, []);

  // Handle range selection
  const handleRangeSelect = useCallback(
    (start: CellPosition, end: CellPosition) => {
      const range = getCellRange(start, end);
      setSelectedRange(range);
      setSelectedCell(getCellId(start));
      undoRedoSystem.stateManager.setSelectedCell(getCellId(start));
      undoRedoSystem.stateManager.setSelectedRange(range);
    },
    [undoRedoSystem.stateManager]
  );

  // Sync formulaBarValue with selected cell when not editing formula
  useEffect(() => {
    if (!isEditingFormula) {
      setFormulaBarValue("");
    }
  }, [selectedCell, isEditingFormula]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Toolbar
        onFormatChange={applyFormatting}
        onMerge={mergeCells}
        onUnmerge={unmergeCells}
        onBold={() => applyFormatting({ bold: true })}
        onItalic={() => applyFormatting({ italic: true })}
        onUnderline={handleUnderline}
        onStrikethrough={handleStrikethrough}
        onAlignLeft={() => applyFormatting({ horizontalAlign: "left" })}
        onAlignCenter={() => applyFormatting({ horizontalAlign: "center" })}
        onAlignRight={() => applyFormatting({ horizontalAlign: "right" })}
        onImportExport={() => setIsImportDialogOpen(true)}
        onLoadSample={handleLoadSample}
        onDocs={handleDocs}
        onPrint={handlePrint}
        onPaintFormat={handlePaintFormat}
        onZoomChange={handleZoomChange}
        // Undo/Redo props
        canUndo={undoRedoSystem.canUndo}
        canRedo={undoRedoSystem.canRedo}
        undoDescription={undoRedoSystem.undoDescription}
        redoDescription={undoRedoSystem.redoDescription}
        onUndo={undoRedoSystem.undo}
        onRedo={undoRedoSystem.redo}
        historySize={undoRedoSystem.historySize}
        onClearHistory={undoRedoSystem.clearHistory}
      />

      <FormulaBar
        value={formulaBarValue || spreadsheetData[selectedCell]?.rawValue || ""}
        onChange={(value) => {
          setFormulaBarValue(value);
          updateCellWithFormulas(selectedCell, value);
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
        onCellEdit={updateCellWithFormulas}
        formulaEngine={formulaEngine}
      />

      <ExcelImportDialog
        isOpen={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onImport={handleImportData}
        currentData={spreadsheetData}
      />

      {/* Debug Info - Remove in production */}
      {import.meta.env?.DEV && (
        <div className="p-2 bg-gray-200 text-xs">
          <span>History: {undoRedoSystem.historySize} | </span>
          <span>Can Undo: {undoRedoSystem.canUndo ? "Yes" : "No"} | </span>
          <span>Can Redo: {undoRedoSystem.canRedo ? "Yes" : "No"} | </span>
          <span>Selected: {selectedCell}</span>
        </div>
      )}
    </div>
  );
};

export default SpreadsheetWithUndoRedo;
