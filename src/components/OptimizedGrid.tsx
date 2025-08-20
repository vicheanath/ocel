// components/OptimizedGrid.tsx - Highly optimized grid with all performance enhancements
import React, {
  useCallback,
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";
import type { SpreadsheetData, CellPosition, CellRange } from "../types";
import {
  getCellId,
  parseCellId,
  getCellsInRangeGenerator,
  getOrCreateCell,
  globalProfiler,
  calculateViewport,
} from "../utils/spreadsheetUtils";
import FormulaSuggestions from "./FormulaSuggestions";
import ContextMenu, { type ContextMenuItem } from "./ContextMenu";
import { useFormulaSuggestions } from "../hooks/useFormulaSuggestions";
import { FormulaEngine } from "../formulaEngine/FormulaEngine";
import "./Grid.css";

interface OptimizedGridProps {
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

// Virtualized cell component with memoization
const VirtualizedCell = React.memo(
  ({
    cellId,
    data,
    isSelected,
    isActiveCell,
    isInRange,
    isHighlighted,
    isEditing,
    editValue,
    onEditChange,
    onEditKeyDown,
    onEditBlur,
    editInputRef,
    width,
    height,
    x,
    y,
  }: {
    cellId: string;
    data: SpreadsheetData;
    isSelected: boolean;
    isActiveCell: boolean;
    isInRange: boolean;
    isHighlighted: boolean;
    isEditing: boolean;
    editValue: string;
    onEditChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onEditKeyDown: (e: React.KeyboardEvent) => void;
    onEditBlur: () => void;
    editInputRef: React.RefObject<HTMLInputElement | null>;
    width: number;
    height: number;
    x: number;
    y: number;
  }) => {
    const cell = getOrCreateCell(data, cellId);

    const getCellClassName = () => {
      if (isEditing) return "cell-editing";
      if (isActiveCell) return "cell-active";
      if (isHighlighted) return "cell-formula-ref";
      if (isInRange) return "cell-range-selected";
      if (isSelected) return "cell-selected";
      return "cell-normal";
    };

    return (
      <div
        className={getCellClassName()}
        style={{
          position: "absolute",
          left: x,
          top: y,
          width,
          height,
          border: "1px solid #e0e0e0",
          backgroundColor: isSelected
            ? "#4a90e2"
            : isInRange
            ? "#e3f2fd"
            : cell.style?.backgroundColor,
          color: cell.style?.textColor || "#000000",
          fontSize: `${cell.style?.fontSize || 14}px`,
          fontWeight: cell.style?.bold ? "bold" : "normal",
          fontStyle: cell.style?.italic ? "italic" : "normal",
          textDecoration: cell.style?.underline ? "underline" : "none",
          display: "flex",
          alignItems:
            cell.style?.verticalAlign === "middle" ? "center" : "flex-start",
          justifyContent:
            cell.style?.horizontalAlign === "center"
              ? "center"
              : cell.style?.horizontalAlign === "right"
              ? "flex-end"
              : "flex-start",
          padding: "4px 6px",
          overflow: "hidden",
          userSelect: "none",
        }}
      >
        {isEditing ? (
          <input
            ref={editInputRef}
            type="text"
            value={editValue}
            onChange={onEditChange}
            onKeyDown={onEditKeyDown}
            onBlur={onEditBlur}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "inherit",
              fontFamily: "inherit",
              color: "inherit",
              fontWeight: "inherit",
              fontStyle: "inherit",
              textAlign: "inherit",
            }}
            autoFocus
          />
        ) : (
          <span
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {cell.displayValue || ""}
          </span>
        )}
      </div>
    );
  }
);

const COLUMN_HEADERS = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i)
);

const DEFAULT_CELL_WIDTH = 96;
const DEFAULT_CELL_HEIGHT = 40;
const HEADER_WIDTH = 48;
const HEADER_HEIGHT = 40;

const OptimizedGrid: React.FC<OptimizedGridProps> = React.memo(
  ({
    data,
    rows,
    cols,
    selectedCell,
    selectedRange,
    onSelectCell,
    onSelectRange: _onSelectRange,
    onCellEdit,
    formulaEngine,
  }) => {
    // State management
    const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });
    const [containerSize, setContainerSize] = useState({
      width: 800,
      height: 600,
    });
    const [editingCell, setEditingCell] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<string>("");
    const [highlightedRefs, setHighlightedRefs] = useState<string[]>([]);
    const [isApplyingSuggestion, setIsApplyingSuggestion] = useState(false);
    const [contextMenu, setContextMenu] = useState<{
      visible: boolean;
      position: { x: number; y: number };
      cellId: string;
    } | null>(null);

    // Column and row dimensions (can be customized later)
    const [columnWidths] = useState<Map<number, number>>(new Map());
    const [rowHeights] = useState<Map<number, number>>(new Map());

    // Refs
    const containerRef = useRef<HTMLDivElement>(null);
    const editInputRef = useRef<HTMLInputElement>(null);

    // Formula suggestions
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

    // Get cell dimensions
    const getColumnWidth = useCallback(
      (col: number) => {
        return columnWidths.get(col) || DEFAULT_CELL_WIDTH;
      },
      [columnWidths]
    );

    const getRowHeight = useCallback(
      (row: number) => {
        return rowHeights.get(row) || DEFAULT_CELL_HEIGHT;
      },
      [rowHeights]
    );

    // Calculate viewport with performance profiling
    const viewport = useMemo(() => {
      const endProfiler = globalProfiler.start("calculateViewport");
      const result = calculateViewport(
        scrollPosition.y,
        scrollPosition.x,
        containerSize.height,
        containerSize.width,
        DEFAULT_CELL_HEIGHT,
        DEFAULT_CELL_WIDTH,
        HEADER_HEIGHT,
        HEADER_WIDTH,
        3 // overscan
      );
      endProfiler();
      return result;
    }, [scrollPosition, containerSize]);

    // Calculate cumulative positions for fast positioning
    const columnPositions = useMemo(() => {
      const positions: number[] = [HEADER_WIDTH];
      for (let i = 0; i < cols; i++) {
        positions[i + 1] = positions[i] + getColumnWidth(i);
      }
      return positions;
    }, [cols, getColumnWidth]);

    const rowPositions = useMemo(() => {
      const positions: number[] = [HEADER_HEIGHT];
      for (let i = 0; i < rows; i++) {
        positions[i + 1] = positions[i] + getRowHeight(i);
      }
      return positions;
    }, [rows, getRowHeight]);

    // Extract formula references
    const extractFormulaReferences = useCallback(
      (formula: string): string[] => {
        if (!formula.startsWith("=")) return [];

        const referencePattern = /[A-Z]+\d+(?::[A-Z]+\d+)?/g;
        const matches = formula.match(referencePattern);
        if (!matches) return [];

        const cellIds: string[] = [];
        matches.forEach((match) => {
          if (match.includes(":")) {
            const [start, end] = match.split(":");
            const startPos = parseCellId(start);
            const endPos = parseCellId(end);

            for (const cellId of getCellsInRangeGenerator({
              start: {
                row: Math.min(startPos.row, endPos.row),
                col: Math.min(startPos.col, endPos.col),
              },
              end: {
                row: Math.max(startPos.row, endPos.row),
                col: Math.max(startPos.col, endPos.col),
              },
            })) {
              cellIds.push(cellId);
            }
          } else {
            cellIds.push(match);
          }
        });

        return cellIds;
      },
      []
    );

    // Handle container resize
    useEffect(() => {
      if (!containerRef.current) return;

      const resizeObserver = new ResizeObserver((entries) => {
        const { width, height } = entries[0].contentRect;
        setContainerSize({ width, height });
      });

      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }, []);

    // Handle scroll events with throttling
    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      setScrollPosition({
        x: target.scrollLeft,
        y: target.scrollTop,
      });
    }, []);

    // Cell interaction handlers
    const startEditing = useCallback(() => {
      setEditingCell(selectedCell);
      const currentCell = getOrCreateCell(data, selectedCell);
      const value = currentCell.rawValue || "";
      setEditValue(value);

      // Extract and highlight formula references
      if (value.startsWith("=")) {
        const references = extractFormulaReferences(value);
        setHighlightedRefs(references);
        if (formulaEngine) {
          updateSuggestions(value);
        }
      } else {
        setHighlightedRefs([]);
      }
    }, [
      selectedCell,
      data,
      extractFormulaReferences,
      formulaEngine,
      updateSuggestions,
    ]);

    const commitEdit = useCallback(() => {
      if (editingCell) {
        onCellEdit(editingCell, editValue);
        setEditingCell(null);
        setEditValue("");
        setHighlightedRefs([]);
        hideSuggestions();
      }
    }, [editingCell, editValue, onCellEdit, hideSuggestions]);

    const cancelEditing = useCallback(() => {
      setEditingCell(null);
      setEditValue("");
      setHighlightedRefs([]);
      hideSuggestions();
    }, [hideSuggestions]);

    // Edit handlers
    const handleEditChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEditValue(value);

        if (value.startsWith("=")) {
          const references = extractFormulaReferences(value);
          setHighlightedRefs(references);
          if (formulaEngine) {
            updateSuggestions(value);
          }
        } else {
          setHighlightedRefs([]);
          hideSuggestions();
        }
      },
      [
        extractFormulaReferences,
        formulaEngine,
        updateSuggestions,
        hideSuggestions,
      ]
    );

    const handleEditKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        // Handle formula suggestions
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
          if (e.key === "Tab" || e.key === "Enter") {
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
            commitEdit();
            break;
          case "Escape":
            e.preventDefault();
            if (showSuggestions) {
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
      ]
    );

    const handleEditBlur = useCallback(() => {
      if (!isApplyingSuggestion) {
        commitEdit();
      }
    }, [isApplyingSuggestion, commitEdit]);

    // Mouse event handlers
    const handleCellClick = useCallback(
      (cellId: string, e: React.MouseEvent) => {
        e.stopPropagation();

        if (e.button === 2) {
          // Right click
          e.preventDefault();
          onSelectCell(cellId);
          setContextMenu({
            visible: true,
            position: { x: e.clientX, y: e.clientY },
            cellId,
          });
          return;
        }

        onSelectCell(cellId);
        setContextMenu(null);
      },
      [onSelectCell]
    );

    const handleCellDoubleClick = useCallback(
      (cellId: string) => {
        onSelectCell(cellId);
        startEditing();
      },
      [onSelectCell, startEditing]
    );

    // Context menu
    const getContextMenuItems = useCallback(
      (): ContextMenuItem[] => [
        {
          id: "copy",
          label: "Copy",
          icon: "📋",
          onClick: () => console.log("Copy"),
        },
        {
          id: "paste",
          label: "Paste",
          icon: "📄",
          onClick: () => console.log("Paste"),
        },
      ],
      []
    );

    // Render visible cells with virtualization
    const renderVisibleCells = useCallback(() => {
      const endProfiler = globalProfiler.start("renderVisibleCells");
      const cells: React.ReactNode[] = [];

      for (let row = viewport.startRow; row <= viewport.endRow; row++) {
        for (let col = viewport.startCol; col <= viewport.endCol; col++) {
          const cellId = getCellId({ row, col });
          const x = columnPositions[col] - scrollPosition.x;
          const y = rowPositions[row] - scrollPosition.y;
          const width = getColumnWidth(col);
          const height = getRowHeight(row);

          // Skip if completely outside container
          if (
            x + width < 0 ||
            x > containerSize.width ||
            y + height < 0 ||
            y > containerSize.height
          ) {
            continue;
          }

          const isActiveCell = selectedCell === cellId;
          const isInRange =
            selectedRange &&
            row >= selectedRange.start.row &&
            row <= selectedRange.end.row &&
            col >= selectedRange.start.col &&
            col <= selectedRange.end.col;
          const isHighlighted = highlightedRefs.includes(cellId);
          const isEditing = editingCell === cellId;

          cells.push(
            <div
              key={cellId}
              onClick={(e) => handleCellClick(cellId, e)}
              onDoubleClick={() => handleCellDoubleClick(cellId)}
              onContextMenu={(e) => {
                e.preventDefault();
                const mouseEvent = e as unknown as React.MouseEvent;
                mouseEvent.button = 2;
                handleCellClick(cellId, mouseEvent);
              }}
              style={{ position: "absolute", left: x, top: y }}
            >
              <VirtualizedCell
                cellId={cellId}
                data={data}
                isSelected={isActiveCell}
                isActiveCell={isActiveCell}
                isInRange={isInRange || false}
                isHighlighted={isHighlighted}
                isEditing={isEditing}
                editValue={editValue}
                onEditChange={handleEditChange}
                onEditKeyDown={handleEditKeyDown}
                onEditBlur={handleEditBlur}
                editInputRef={editInputRef}
                width={width}
                height={height}
                x={0}
                y={0}
              />
            </div>
          );
        }
      }

      endProfiler();
      return cells;
    }, [
      viewport,
      columnPositions,
      rowPositions,
      scrollPosition,
      getColumnWidth,
      getRowHeight,
      containerSize,
      selectedCell,
      selectedRange,
      highlightedRefs,
      editingCell,
      editValue,
      data,
      handleCellClick,
      handleCellDoubleClick,
      handleEditChange,
      handleEditKeyDown,
      handleEditBlur,
    ]);

    // Render headers
    const renderHeaders = useCallback(() => {
      const headers: React.ReactNode[] = [];

      // Column headers
      for (let col = viewport.startCol; col <= viewport.endCol; col++) {
        const x = columnPositions[col] - scrollPosition.x;
        const width = getColumnWidth(col);

        if (x + width < HEADER_WIDTH || x > containerSize.width) continue;

        headers.push(
          <div
            key={`col-${col}`}
            style={{
              position: "absolute",
              left: x,
              top: 0,
              width,
              height: HEADER_HEIGHT,
              backgroundColor: "#f5f5f5",
              border: "1px solid #d0d0d0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "12px",
              color: "#333",
            }}
          >
            {COLUMN_HEADERS[col] || ""}
          </div>
        );
      }

      // Row headers
      for (let row = viewport.startRow; row <= viewport.endRow; row++) {
        const y = rowPositions[row] - scrollPosition.y;
        const height = getRowHeight(row);

        if (y + height < HEADER_HEIGHT || y > containerSize.height) continue;

        headers.push(
          <div
            key={`row-${row}`}
            style={{
              position: "absolute",
              left: 0,
              top: y,
              width: HEADER_WIDTH,
              height,
              backgroundColor: "#f5f5f5",
              border: "1px solid #d0d0d0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "12px",
              color: "#333",
            }}
          >
            {row + 1}
          </div>
        );
      }

      return headers;
    }, [
      viewport,
      columnPositions,
      rowPositions,
      scrollPosition,
      getColumnWidth,
      getRowHeight,
      containerSize,
    ]);

    return (
      <div
        ref={containerRef}
        className="optimized-grid-container"
        style={{
          width: "100%",
          height: "100%",
          overflow: "auto",
          position: "relative",
        }}
        onScroll={handleScroll}
        tabIndex={0}
      >
        {/* Spacer for scrollable area */}
        <div
          style={{
            width:
              columnPositions[columnPositions.length - 1] ||
              DEFAULT_CELL_WIDTH * cols,
            height:
              rowPositions[rowPositions.length - 1] ||
              DEFAULT_CELL_HEIGHT * rows,
            position: "relative",
          }}
        >
          {/* Headers */}
          {renderHeaders()}

          {/* Grid cells */}
          {renderVisibleCells()}

          {/* Formula suggestions */}
          {formulaEngine && showSuggestions && editingCell && (
            <div
              style={{
                position: "absolute",
                left:
                  columnPositions[parseCellId(editingCell).col] -
                  scrollPosition.x,
                top:
                  rowPositions[parseCellId(editingCell).row] -
                  scrollPosition.y +
                  getRowHeight(parseCellId(editingCell).row),
                zIndex: 1001,
              }}
            >
              <FormulaSuggestions
                suggestions={suggestions}
                selectedIndex={selectedIndex}
                onSelect={(suggestion) => {
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
                }}
                className="formula-suggestions"
              />
            </div>
          )}

          {/* Context Menu */}
          {contextMenu?.visible && (
            <ContextMenu
              items={getContextMenuItems()}
              position={contextMenu.position}
              onClose={() => setContextMenu(null)}
            />
          )}
        </div>
      </div>
    );
  }
);

export default OptimizedGrid;
