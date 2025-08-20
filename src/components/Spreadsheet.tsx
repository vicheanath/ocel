// components/Spreadsheet.tsx
import React, { useCallback } from "react";
import OptimizedGrid from "./OptimizedGrid";
import FormulaBar from "./FormulaBar";
import Toolbar from "./Toolbar";
import TabBar from "./TabBar";
import TabDemo from "./TabDemo";
import ExcelImportDialog from "./ExcelImportDialog";
import {
  useSpreadsheetStore,
  useActiveTab,
  useTabData,
  useSelectedCell,
  useSelectedRange,
  useFormulaBarValue,
  useIsEditingFormula,
} from "../store/spreadsheetStore";
import type { CellPosition } from "../types";
import {
  getCellId,
  getCellRange,
  getOrCreateCell,
} from "../utils/spreadsheetUtils";
import { createSampleSpreadsheetData } from "../utils/sampleData";

const ROWS = 50; // Reduced from 100
const COLS = 26;

const Spreadsheet: React.FC = () => {
  // Zustand store hooks
  const {
    formulaEngine,
    isImportDialogOpen,
    updateCell,
    setSelectedCell,
    setSelectedRange,
    setFormulaBarValue,
    setIsEditingFormula,
    applyFormatting,
    mergeCells,
    unmergeCells,
    importData,
    loadSampleData,
    setImportDialogOpen,
  } = useSpreadsheetStore();

  // Derived state from store
  const activeTab = useActiveTab();
  const spreadsheetData = useTabData();
  const selectedCell = useSelectedCell();
  const selectedRange = useSelectedRange();
  const formulaBarValue = useFormulaBarValue();
  const isEditingFormula = useIsEditingFormula();

  // Handle cell selection - supports both normal selection and formula cell picking
  const handleCellSelect = useCallback(
    (cellId: string) => {
      if (isEditingFormula) {
        // When editing a formula, clicking a cell should insert its reference
        setFormulaBarValue(formulaBarValue + cellId);
      } else {
        // Normal cell selection
        setSelectedCell(cellId);
      }
    },
    [isEditingFormula, formulaBarValue, setFormulaBarValue, setSelectedCell]
  );

  // Handle loading sample data
  const handleLoadSample = useCallback(() => {
    const sampleData = createSampleSpreadsheetData();
    loadSampleData(sampleData);
  }, [loadSampleData]);

  // Handle range selection
  const handleRangeSelect = useCallback(
    (start: CellPosition, end: CellPosition) => {
      const range = getCellRange(start, end);
      setSelectedRange(range);
      setSelectedCell(getCellId(start));
    },
    [setSelectedRange, setSelectedCell]
  );

  // Formatting handlers
  const handleBold = useCallback(
    () => applyFormatting({ bold: true }),
    [applyFormatting]
  );
  const handleItalic = useCallback(
    () => applyFormatting({ italic: true }),
    [applyFormatting]
  );
  const handleAlignLeft = useCallback(
    () => applyFormatting({ horizontalAlign: "left" }),
    [applyFormatting]
  );
  const handleAlignCenter = useCallback(
    () => applyFormatting({ horizontalAlign: "center" }),
    [applyFormatting]
  );
  const handleAlignRight = useCallback(
    () => applyFormatting({ horizontalAlign: "right" }),
    [applyFormatting]
  );

  if (!activeTab) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 relative">
      <TabDemo />

      <Toolbar
        onFormatChange={applyFormatting}
        onMerge={mergeCells}
        onUnmerge={unmergeCells}
        onBold={handleBold}
        onItalic={handleItalic}
        onAlignLeft={handleAlignLeft}
        onAlignCenter={handleAlignCenter}
        onAlignRight={handleAlignRight}
        onImportExport={() => setImportDialogOpen(true)}
        onLoadSample={handleLoadSample}
      />

      <FormulaBar
        value={
          formulaBarValue ||
          getOrCreateCell(spreadsheetData, selectedCell)?.rawValue ||
          ""
        }
        onChange={(value) => {
          setFormulaBarValue(value);
          updateCell(selectedCell, value);
        }}
        formulaEngine={formulaEngine}
        selectedCell={selectedCell}
        onFormulaEditingChange={setIsEditingFormula}
      />

      <div className="flex-1 flex flex-col">
        <OptimizedGrid
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
      </div>

      {/* Excel-like Tab Bar */}
      <TabBar className="h-10" />

      <ExcelImportDialog
        isOpen={isImportDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        onImport={importData}
        currentData={spreadsheetData}
      />
    </div>
  );
};

export default Spreadsheet;
