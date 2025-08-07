// components/Grid.tsx
import React, {
  useCallback,
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";
import type { SpreadsheetData, CellPosition, CellRange } from "../types";
import { getCellId, parseCellId } from "../utils/spreadsheetUtils";
import FormulaSuggestions from "./FormulaSuggestions";
import { useFormulaSuggestions } from "../hooks/useFormulaSuggestions";
import { FormulaEngine } from "../formulaEngine/FormulaEngine";

interface GridProps {
  data: SpreadsheetData;
  rows: number;
  cols: number;
  selectedCell: string;
  selectedRange: CellRange | null;
  onSelectCell: (cellId: string) => void;
  onSelectRange: (start: CellPosition, end: CellPosition) => void;
  onCellEdit: (cellId: string, value: string) => void;
  formulaEngine?: FormulaEngine;
}

const COLUMN_HEADERS = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i)
);

const Grid: React.FC<GridProps> = React.memo(
  ({
    data,
    rows,
    cols,
    selectedCell,
    selectedRange,
    onSelectCell,
    onSelectRange,
    onCellEdit,
    formulaEngine,
  }) => {
    const [dragStart, setDragStart] = useState<CellPosition | null>(null);
    const [isDraggingCorner, setIsDraggingCorner] = useState<boolean>(false);
    const [editingCell, setEditingCell] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<string>("");
    const [columnWidths, setColumnWidths] = useState<{ [key: number]: number }>(
      {}
    );
    const [rowHeights, setRowHeights] = useState<{ [key: number]: number }>({});
    const [isResizing, setIsResizing] = useState<{
      type: "column" | "row";
      index: number;
    } | null>(null);
    const [isApplyingSuggestion, setIsApplyingSuggestion] = useState(false);
    const gridRef = useRef<HTMLDivElement>(null);
    const editInputRef = useRef<HTMLInputElement>(null);

    // Formula suggestions for cell editing
    const {
      suggestions,
      selectedIndex,
      showSuggestions,
      updateSuggestions,
      navigateUp,
      navigateDown,
      applySuggestion,
      hideSuggestions,
    } = useFormulaSuggestions(formulaEngine || new FormulaEngine());

    // Performance optimization: limit visible rows/cols
    const VISIBLE_ROWS = Math.min(rows, 50); // Show max 50 rows at a time
    const VISIBLE_COLS = Math.min(cols, 26); // Show max 26 columns at a time

    // Focus on grid for keyboard navigation
    useEffect(() => {
      if (gridRef.current) {
        gridRef.current.focus();
      }
    }, [selectedCell]);

    // Focus edit input when editing starts
    useEffect(() => {
      if (editingCell && editInputRef.current) {
        editInputRef.current.focus();
        editInputRef.current.select();
      }
    }, [editingCell]);

    const isCellSelected = useCallback(
      (row: number, col: number) => {
        const cellId = getCellId({ row, col });

        // Check if single cell is selected
        if (selectedCell === cellId) return true;

        // Check if in range
        if (selectedRange) {
          const { start, end } = selectedRange;
          return (
            row >= start.row &&
            row <= end.row &&
            col >= start.col &&
            col <= end.col
          );
        }

        return false;
      },
      [selectedCell, selectedRange]
    );

    const isMasterMergedCell = useCallback(
      (row: number, col: number) => {
        const cellId = getCellId({ row, col });
        const cell = data[cellId];
        return (
          cell?.merged &&
          cell.merged.start.row === row &&
          cell.merged.start.col === col
        );
      },
      [data]
    );

    // Lazy cell creation function - create cells on demand
    const getOrCreateCell = useCallback(
      (row: number, col: number) => {
        const cellId = getCellId({ row, col });

        if (!data[cellId]) {
          // Create cell lazily when accessed
          const newCell = {
            id: cellId,
            rawValue: "",
            computedValue: "",
            displayValue: "",
            type: "text" as const,
            style: {
              fontSize: 14,
              textColor: "#000000",
              backgroundColor: "#ffffff",
              horizontalAlign: "left" as const,
              verticalAlign: "top" as const,
            },
          };
          // Note: This mutates the data prop, which isn't ideal but necessary for lazy loading
          const mutableData = data as SpreadsheetData;
          mutableData[cellId] = newCell;
        }

        return data[cellId];
      },
      [data]
    );

    // Check if a cell is part of any merged range (looking through all cells to find merged ranges)
    const mergedRangeMap = useMemo(() => {
      const map = new Map<string, boolean>();

      // Build a map of all cells that are part of merged ranges
      Object.values(data).forEach((cellData) => {
        if (cellData.merged) {
          const { start, end } = cellData.merged;
          for (let row = start.row; row <= end.row; row++) {
            for (let col = start.col; col <= end.col; col++) {
              const cellId = getCellId({ row, col });
              map.set(cellId, true);
            }
          }
        }
      });

      return map;
    }, [data]);

    const isPartOfAnyMergedRange = useCallback(
      (row: number, col: number) => {
        const cellId = getCellId({ row, col });
        return mergedRangeMap.has(cellId);
      },
      [mergedRangeMap]
    );

    // Start editing cell
    const startEditing = useCallback(
      (initialValue?: string) => {
        setEditingCell(selectedCell);
        const currentCell = data[selectedCell];
        const newValue =
          initialValue !== undefined
            ? initialValue
            : currentCell?.rawValue || "";
        setEditValue(newValue);

        // Update suggestions if it's a formula
        if (formulaEngine && newValue.startsWith("=")) {
          updateSuggestions(newValue);
        }
      },
      [selectedCell, data, formulaEngine, updateSuggestions]
    );

    // Cancel editing
    const cancelEditing = useCallback(() => {
      setEditingCell(null);
      setEditValue("");
      hideSuggestions();
    }, [hideSuggestions]);

    // Commit edit
    const commitEdit = useCallback(() => {
      if (editingCell) {
        onCellEdit(editingCell, editValue);
        setEditingCell(null);
        setEditValue("");
        hideSuggestions();
      }
    }, [editingCell, editValue, onCellEdit, hideSuggestions]);

    // Navigate cells with keyboard
    const navigateCell = useCallback(
      (direction: "up" | "down" | "left" | "right") => {
        const currentPos = parseCellId(selectedCell);
        const newPos = { ...currentPos };

        switch (direction) {
          case "up":
            newPos.row = Math.max(0, currentPos.row - 1);
            break;
          case "down":
            newPos.row = Math.min(VISIBLE_ROWS - 1, currentPos.row + 1);
            break;
          case "left":
            newPos.col = Math.max(0, currentPos.col - 1);
            break;
          case "right":
            newPos.col = Math.min(VISIBLE_COLS - 1, currentPos.col + 1);
            break;
        }

        const newCellId = getCellId(newPos);
        onSelectCell(newCellId);
      },
      [selectedCell, VISIBLE_ROWS, VISIBLE_COLS, onSelectCell]
    );

    // Handle keyboard events
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (editingCell) return; // Don't navigate while editing

        switch (e.key) {
          case "ArrowUp":
            e.preventDefault();
            navigateCell("up");
            break;
          case "ArrowDown":
          case "Enter":
            e.preventDefault();
            navigateCell("down");
            break;
          case "ArrowLeft":
            e.preventDefault();
            navigateCell("left");
            break;
          case "ArrowRight":
          case "Tab":
            e.preventDefault();
            navigateCell("right");
            break;
          case "F2":
            e.preventDefault();
            startEditing();
            break;
          case "Escape":
            e.preventDefault();
            cancelEditing();
            break;
          case "Delete":
          case "Backspace":
            e.preventDefault();
            onCellEdit(selectedCell, "");
            break;
          default:
            // Start editing if user types a printable character
            if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
              startEditing(e.key);
            }
            break;
        }
      },
      [
        editingCell,
        navigateCell,
        selectedCell,
        onCellEdit,
        startEditing,
        cancelEditing,
      ]
    );

    // Handle edit input change
    const handleEditChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEditValue(value);

        // Update suggestions if formula engine is available
        if (formulaEngine) {
          updateSuggestions(value);
        }
      },
      [formulaEngine, updateSuggestions]
    );

    // Handle edit input events
    const handleEditKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        // Handle formula suggestions first
        if (formulaEngine && showSuggestions && suggestions.length > 0) {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            navigateDown();
            return;
          }

          if (e.key === "ArrowUp") {
            e.preventDefault();
            navigateUp();
            return;
          }

          if (e.key === "Tab") {
            e.preventDefault();
            setIsApplyingSuggestion(true);
            const newValue = applySuggestion(
              suggestions[selectedIndex].name,
              editValue
            );
            setEditValue(newValue);
            hideSuggestions();
            setTimeout(() => {
              if (editInputRef.current) {
                editInputRef.current.setSelectionRange(
                  newValue.length,
                  newValue.length
                );
                editInputRef.current.focus();
              }
              setIsApplyingSuggestion(false);
            }, 0);
            return;
          }
        }

        switch (e.key) {
          case "Enter":
            e.preventDefault();
            if (formulaEngine && showSuggestions && suggestions.length > 0) {
              setIsApplyingSuggestion(true);
              const newValue = applySuggestion(
                suggestions[selectedIndex].name,
                editValue
              );
              setEditValue(newValue);
              hideSuggestions();
              setTimeout(() => {
                if (editInputRef.current) {
                  editInputRef.current.setSelectionRange(
                    newValue.length,
                    newValue.length
                  );
                  editInputRef.current.focus();
                }
                setIsApplyingSuggestion(false);
              }, 0);
            } else {
              commitEdit();
              navigateCell("down");
            }
            break;
          case "Tab":
            e.preventDefault();
            if (formulaEngine && showSuggestions && suggestions.length > 0) {
              // Already handled above, but just in case
              return;
            }
            commitEdit();
            navigateCell("right");
            break;
          case "Escape":
            e.preventDefault();
            if (formulaEngine && showSuggestions) {
              hideSuggestions();
            } else {
              cancelEditing();
            }
            break;
        }
      },
      [
        formulaEngine,
        showSuggestions,
        suggestions,
        selectedIndex,
        navigateDown,
        navigateUp,
        applySuggestion,
        editValue,
        hideSuggestions,
        commitEdit,
        cancelEditing,
        navigateCell,
      ]
    );

    const handleMouseDown = useCallback(
      (row: number, col: number) => {
        setDragStart({ row, col });
        onSelectCell(getCellId({ row, col }));
        cancelEditing(); // Cancel any ongoing edit
      },
      [onSelectCell, cancelEditing]
    );

    // Handle corner drag for extending selection (Excel-style)
    const handleCornerMouseDown = useCallback(
      (e: React.MouseEvent, startRow: number, startCol: number) => {
        e.stopPropagation();
        setIsDraggingCorner(true);
        setDragStart({ row: startRow, col: startCol });

        const handleMouseMove = (moveEvent: MouseEvent) => {
          const target = document.elementFromPoint(
            moveEvent.clientX,
            moveEvent.clientY
          );
          if (target && target.closest("td")) {
            const cellElement = target.closest("td") as HTMLTableCellElement;
            const row = cellElement.parentElement as HTMLTableRowElement;
            const rowIndex = row?.rowIndex;
            const cellIndex = cellElement.cellIndex;

            if (rowIndex !== undefined && cellIndex !== undefined) {
              // Adjust for header row (rowIndex - 1) and header column (cellIndex - 1)
              const endRow = Math.max(
                0,
                Math.min(VISIBLE_ROWS - 1, rowIndex - 1)
              );
              const endCol = Math.max(
                0,
                Math.min(VISIBLE_COLS - 1, cellIndex - 1)
              );

              // Create selection range from original cell to current position
              const rangeStart = { row: startRow, col: startCol };
              const rangeEnd = { row: endRow, col: endCol };
              onSelectRange(rangeStart, rangeEnd);
            }
          }
        };

        const handleMouseUp = () => {
          setIsDraggingCorner(false);
          setDragStart(null);
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      },
      [onSelectRange, VISIBLE_ROWS, VISIBLE_COLS]
    );

    // Column resize handlers
    const handleColumnResize = useCallback(
      (columnIndex: number, startX: number) => {
        setIsResizing({ type: "column", index: columnIndex });
        const startWidth = columnWidths[columnIndex] || 96; // Default 24 * 4 = 96px

        const handleMouseMove = (e: MouseEvent) => {
          const deltaX = e.clientX - startX;
          const newWidth = Math.max(50, startWidth + deltaX); // Minimum 50px width
          setColumnWidths((prev) => ({ ...prev, [columnIndex]: newWidth }));
        };

        const handleMouseUp = () => {
          setIsResizing(null);
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      },
      [columnWidths]
    );

    // Row resize handlers
    const handleRowResize = useCallback(
      (rowIndex: number, startY: number) => {
        setIsResizing({ type: "row", index: rowIndex });
        const startHeight = rowHeights[rowIndex] || 40; // Default 40px height

        const handleMouseMove = (e: MouseEvent) => {
          const deltaY = e.clientY - startY;
          const newHeight = Math.max(20, startHeight + deltaY); // Minimum 20px height
          setRowHeights((prev) => ({ ...prev, [rowIndex]: newHeight }));
        };

        const handleMouseUp = () => {
          setIsResizing(null);
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      },
      [rowHeights]
    );

    // Auto-fit column width based on content
    const autoFitColumn = useCallback(
      (columnIndex: number) => {
        let maxWidth = 96; // Default minimum width

        // Check content of all visible cells in this column
        for (let rowIndex = 0; rowIndex < VISIBLE_ROWS; rowIndex++) {
          const cell = getOrCreateCell(rowIndex, columnIndex);
          const content = cell?.displayValue || "";

          // Rough estimate: 8px per character + 16px padding
          const estimatedWidth = content.toString().length * 8 + 32;
          maxWidth = Math.max(maxWidth, Math.min(estimatedWidth, 300)); // Max 300px
        }

        // Also check header width
        const headerWidth = COLUMN_HEADERS[columnIndex].length * 12 + 32;
        maxWidth = Math.max(maxWidth, headerWidth);

        setColumnWidths((prev) => ({ ...prev, [columnIndex]: maxWidth }));
      },
      [getOrCreateCell, VISIBLE_ROWS]
    );

    // Auto-fit row height based on content
    const autoFitRow = useCallback(
      (rowIndex: number) => {
        let maxHeight = 40; // Default minimum height

        // Check content of all visible cells in this row
        for (let colIndex = 0; colIndex < VISIBLE_COLS; colIndex++) {
          const cell = getOrCreateCell(rowIndex, colIndex);
          const content = cell?.displayValue || "";

          // Estimate height based on content length and wrapping
          const lines = Math.ceil(content.toString().length / 20); // Rough estimate
          const estimatedHeight = Math.max(40, lines * 20 + 8);
          maxHeight = Math.max(maxHeight, Math.min(estimatedHeight, 200)); // Max 200px
        }

        setRowHeights((prev) => ({ ...prev, [rowIndex]: maxHeight }));
      },
      [getOrCreateCell, VISIBLE_COLS]
    );

    const handleMouseEnter = useCallback(
      (row: number, col: number) => {
        if (dragStart) {
          onSelectRange(dragStart, { row, col });
        }
      },
      [dragStart, onSelectRange]
    );

    const handleMouseUp = useCallback(() => {
      setDragStart(null);
    }, []);

    const handleDoubleClick = useCallback(
      (row: number, col: number) => {
        const cellId = getCellId({ row, col });
        onSelectCell(cellId);
        startEditing();
      },
      [onSelectCell, startEditing]
    );

    const handleSuggestionSelect = useCallback(
      (suggestion: string) => {
        setIsApplyingSuggestion(true);
        const newValue = applySuggestion(suggestion, editValue);
        setEditValue(newValue);
        hideSuggestions();
        setTimeout(() => {
          if (editInputRef.current) {
            editInputRef.current.setSelectionRange(
              newValue.length,
              newValue.length
            );
            editInputRef.current.focus();
          }
          setIsApplyingSuggestion(false);
        }, 0);
      },
      [applySuggestion, editValue, hideSuggestions]
    );

    // Memoize cell rendering to prevent unnecessary re-renders
    const renderCell = useCallback(
      (rowIndex: number, colIndex: number) => {
        const cellId = getCellId({ row: rowIndex, col: colIndex });
        const cell = getOrCreateCell(rowIndex, colIndex);
        const isSelected = isCellSelected(rowIndex, colIndex);
        const isActiveCell = selectedCell === cellId;
        const isMaster = isMasterMergedCell(rowIndex, colIndex);
        const mergedRange = cell?.merged;
        const isEditing = editingCell === cellId;

        // Check if this cell is part of any merged range (not necessarily as master)
        const isPartOfMergedRange =
          mergedRange || isPartOfAnyMergedRange(rowIndex, colIndex);

        // Skip rendering if part of merged range but not master
        if (isPartOfMergedRange && !isMaster) return null;

        // Calculate colSpan/rowSpan if merged
        const colSpan = mergedRange
          ? mergedRange.end.col - mergedRange.start.col + 1
          : 1;
        const rowSpan = mergedRange
          ? mergedRange.end.row - mergedRange.start.row + 1
          : 1;

        return (
          <td
            key={`${rowIndex}-${colIndex}`}
            className={`
          border border-gray-300 p-0 relative
          ${
            isSelected && !isActiveCell
              ? "bg-blue-100 ring-1 ring-blue-300 z-10"
              : ""
          }
        `}
            colSpan={colSpan}
            rowSpan={rowSpan}
            onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
            onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
            onDoubleClick={() => handleDoubleClick(rowIndex, colIndex)}
            style={{
              ...cell?.style,
              backgroundColor: isActiveCell
                ? "#ffffff"
                : isSelected
                ? "#e0e7ff"
                : cell?.style?.backgroundColor,
              color: cell?.style?.textColor,
              textAlign: cell?.style?.horizontalAlign,
              verticalAlign: cell?.style?.verticalAlign,
              fontWeight: cell?.style?.bold ? "bold" : "normal",
              fontStyle: cell?.style?.italic ? "italic" : "normal",
              textDecoration: cell?.style?.underline ? "underline" : "none",
              fontSize: cell?.style?.fontSize
                ? `${cell.style.fontSize}px`
                : "inherit",
              border: isActiveCell
                ? "2px solid #1d4ed8"
                : cell?.style?.border || "1px solid #d1d5db",
              position: "relative",
              width: `${columnWidths[colIndex]}px`,
              height: `${rowHeights[rowIndex]}px`,
            }}
          >
            {/* Excel-style active cell corner handle */}
            {isActiveCell && !isEditing && (
              <div
                className={`absolute -bottom-1 -right-1 w-2 h-2 bg-blue-600 border border-white z-40 ${
                  isDraggingCorner ? "cursor-grabbing" : "cursor-se-resize"
                }`}
                style={{
                  borderRadius: "1px",
                }}
                onMouseDown={(e) =>
                  handleCornerMouseDown(e, rowIndex, colIndex)
                }
              />
            )}

            {isEditing ? (
              <div className="relative w-full h-full">
                <input
                  ref={editInputRef}
                  type="text"
                  value={editValue}
                  onChange={handleEditChange}
                  onKeyDown={handleEditKeyDown}
                  onBlur={() => {
                    // Don't blur if applying suggestion
                    if (!isApplyingSuggestion) {
                      commitEdit();
                    }
                  }}
                  className="absolute inset-0 w-full h-full px-2 py-1 border-none outline-none bg-white z-30"
                  style={{
                    fontSize: cell?.style?.fontSize
                      ? `${cell.style.fontSize}px`
                      : "inherit",
                    fontFamily: cell?.style?.fontFamily,
                    textAlign: cell?.style?.horizontalAlign,
                  }}
                />
                {formulaEngine && showSuggestions && (
                  <FormulaSuggestions
                    suggestions={suggestions}
                    selectedIndex={selectedIndex}
                    onSelect={handleSuggestionSelect}
                    className="absolute left-0 top-full mt-1 min-w-64"
                    style={{
                      zIndex: 60,
                      minWidth: "250px",
                    }}
                  />
                )}
              </div>
            ) : (
              <div className="px-2 py-1 h-full w-full overflow-hidden whitespace-nowrap overflow-ellipsis">
                {cell?.displayValue || ""}
              </div>
            )}
          </td>
        );
      },
      [
        selectedCell,
        editingCell,
        editValue,
        getOrCreateCell,
        isCellSelected,
        isMasterMergedCell,
        isPartOfAnyMergedRange,
        handleMouseDown,
        handleMouseEnter,
        handleDoubleClick,
        handleEditChange,
        handleEditKeyDown,
        handleCornerMouseDown,
        isDraggingCorner,
        commitEdit,
        editInputRef,
        columnWidths,
        rowHeights,
        formulaEngine,
        showSuggestions,
        suggestions,
        selectedIndex,
        handleSuggestionSelect,
        isApplyingSuggestion,
      ]
    );

    return (
      <div
        ref={gridRef}
        className="flex-1 overflow-auto focus:outline-none"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          cursor:
            isResizing?.type === "column"
              ? "col-resize"
              : isResizing?.type === "row"
              ? "row-resize"
              : "default",
        }}
      >
        <table className="border-collapse">
          <thead className="sticky top-0 bg-gray-200 z-10">
            <tr>
              <th className="w-12 h-10 border border-gray-400"></th>
              {COLUMN_HEADERS.slice(0, VISIBLE_COLS).map((header, colIndex) => (
                <th
                  key={colIndex}
                  className="h-10 border border-gray-400 font-medium relative"
                  style={{
                    width: `${columnWidths[colIndex] || 96}px`,
                    minWidth: "50px",
                  }}
                >
                  {header}

                  {/* Column resize handle */}
                  <div
                    className="absolute right-0 top-0 w-1 h-full cursor-col-resize bg-transparent hover:bg-blue-500 hover:w-2 z-20 transition-all duration-150"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleColumnResize(colIndex, e.clientX);
                    }}
                    onDoubleClick={(e) => {
                      e.preventDefault();
                      autoFitColumn(colIndex);
                    }}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: VISIBLE_ROWS }).map((_, rowIndex) => (
              <tr
                key={rowIndex}
                style={{ height: `${rowHeights[rowIndex] || 40}px` }}
              >
                <td
                  className="w-12 border border-gray-400 bg-gray-100 text-center sticky left-0"
                  style={{
                    height: `${rowHeights[rowIndex] || 40}px`,
                    position: "relative",
                  }}
                >
                  {rowIndex + 1}

                  {/* Row resize handle */}
                  <div
                    className="absolute bottom-0 left-0 w-full h-1 cursor-row-resize bg-transparent hover:bg-blue-500 hover:h-2 z-20 transition-all duration-150"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleRowResize(rowIndex, e.clientY);
                    }}
                    onDoubleClick={(e) => {
                      e.preventDefault();
                      autoFitRow(rowIndex);
                    }}
                  />
                </td>
                {Array.from({ length: VISIBLE_COLS }).map((_, colIndex) =>
                  renderCell(rowIndex, colIndex)
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
);

export default Grid;
