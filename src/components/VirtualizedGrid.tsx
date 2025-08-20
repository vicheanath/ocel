// components/VirtualizedGrid.tsx - High-performance virtualized grid with spatial indexing
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
import ContextMenu, { type ContextMenuItem } from "./ContextMenu";
import { useFormulaSuggestions } from "../hooks/useFormulaSuggestions";
import { FormulaEngine } from "../formulaEngine/FormulaEngine";
import "./Grid.css";

interface VirtualizedGridProps {
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

// Spatial indexing for fast cell lookups
class SpatialIndex {
  private cellMap = new Map<
    string,
    { x: number; y: number; width: number; height: number }
  >();

  addCell(cellId: string, x: number, y: number, width: number, height: number) {
    this.cellMap.set(cellId, { x, y, width, height });
  }

  findCellAt(x: number, y: number): string | null {
    for (const [cellId, bounds] of this.cellMap) {
      if (
        x >= bounds.x &&
        x < bounds.x + bounds.width &&
        y >= bounds.y &&
        y < bounds.y + bounds.height
      ) {
        return cellId;
      }
    }
    return null;
  }

  clear() {
    this.cellMap.clear();
  }
}

interface ViewportInfo {
  startRow: number;
  endRow: number;
  startCol: number;
  endCol: number;
  visibleCells: Set<string>;
}

const COLUMN_HEADERS = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i)
);

const DEFAULT_CELL_WIDTH = 96;
const DEFAULT_CELL_HEIGHT = 40;
const HEADER_WIDTH = 48;
const HEADER_HEIGHT = 40;
const OVERSCAN = 5; // Extra cells to render outside viewport

const VirtualizedGrid: React.FC<VirtualizedGridProps> = React.memo(
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
    const [viewport, setViewport] = useState<ViewportInfo>({
      startRow: 0,
      endRow: 20,
      startCol: 0,
      endCol: 10,
      visibleCells: new Set(),
    });

    const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });
    const [containerSize, setContainerSize] = useState({
      width: 800,
      height: 600,
    });
    const [columnWidths] = useState<Map<number, number>>(new Map());
    const [rowHeights] = useState<Map<number, number>>(new Map());

    // State for editing and interactions
    const [editingCell, setEditingCell] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<string>("");
    const [isApplyingSuggestion, setIsApplyingSuggestion] = useState(false);
    const [contextMenu, setContextMenu] = useState<{
      visible: boolean;
      position: { x: number; y: number };
      cellId: string;
    } | null>(null);

    // Refs
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const editInputRef = useRef<HTMLInputElement>(null);
    const spatialIndex = useRef(new SpatialIndex());

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

    // Get column width
    const getColumnWidth = useCallback(
      (col: number) => {
        return columnWidths.get(col) || DEFAULT_CELL_WIDTH;
      },
      [columnWidths]
    );

    // Get row height
    const getRowHeight = useCallback(
      (row: number) => {
        return rowHeights.get(row) || DEFAULT_CELL_HEIGHT;
      },
      [rowHeights]
    );

    // Calculate cumulative positions for fast lookup
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

    // Binary search to find row/column at position
    const findRowAtY = useCallback(
      (y: number) => {
        let left = 0,
          right = rowPositions.length - 1;
        while (left <= right) {
          const mid = Math.floor((left + right) / 2);
          if (rowPositions[mid] <= y && y < rowPositions[mid + 1]) {
            return mid;
          }
          if (rowPositions[mid] > y) {
            right = mid - 1;
          } else {
            left = mid + 1;
          }
        }
        return Math.max(
          0,
          Math.min(rows - 1, Math.floor(y / DEFAULT_CELL_HEIGHT))
        );
      },
      [rowPositions, rows]
    );

    const findColumnAtX = useCallback(
      (x: number) => {
        let left = 0,
          right = columnPositions.length - 1;
        while (left <= right) {
          const mid = Math.floor((left + right) / 2);
          if (columnPositions[mid] <= x && x < columnPositions[mid + 1]) {
            return mid;
          }
          if (columnPositions[mid] > x) {
            right = mid - 1;
          } else {
            left = mid + 1;
          }
        }
        return Math.max(
          0,
          Math.min(cols - 1, Math.floor(x / DEFAULT_CELL_WIDTH))
        );
      },
      [columnPositions, cols]
    );

    // Calculate viewport based on scroll position
    const calculateViewport = useCallback(() => {
      const { x, y } = scrollPosition;
      const { width, height } = containerSize;

      const startRow = Math.max(0, findRowAtY(y) - OVERSCAN);
      const endRow = Math.min(rows - 1, findRowAtY(y + height) + OVERSCAN);
      const startCol = Math.max(0, findColumnAtX(x) - OVERSCAN);
      const endCol = Math.min(cols - 1, findColumnAtX(x + width) + OVERSCAN);

      const visibleCells = new Set<string>();
      for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
          visibleCells.add(getCellId({ row, col }));
        }
      }

      return { startRow, endRow, startCol, endCol, visibleCells };
    }, [scrollPosition, containerSize, findRowAtY, findColumnAtX, rows, cols]);

    // Update viewport when scroll position changes
    useEffect(() => {
      const newViewport = calculateViewport();
      setViewport(newViewport);
    }, [calculateViewport]);

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

    // Handle scroll events
    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      setScrollPosition({
        x: target.scrollLeft,
        y: target.scrollTop,
      });
    }, []);

    // Canvas rendering for high performance
    const renderCanvas = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const devicePixelRatio = window.devicePixelRatio || 1;
      const { width, height } = containerSize;

      // Set canvas size accounting for device pixel ratio
      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(devicePixelRatio, devicePixelRatio);
      ctx.clearRect(0, 0, width, height);

      // Clear spatial index
      spatialIndex.current.clear();

      // Render grid lines and cells
      ctx.strokeStyle = "#e0e0e0";
      ctx.lineWidth = 1;
      ctx.font = "14px Arial";

      const { startRow, endRow, startCol, endCol } = viewport;

      // Render visible cells
      for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
          const cellId = getCellId({ row, col });
          const cell = data[cellId];

          const x = columnPositions[col] - scrollPosition.x;
          const y = rowPositions[row] - scrollPosition.y;
          const cellWidth = getColumnWidth(col);
          const cellHeight = getRowHeight(row);

          // Skip if completely outside viewport
          if (
            x + cellWidth < 0 ||
            x > width ||
            y + cellHeight < 0 ||
            y > height
          ) {
            continue;
          }

          // Add to spatial index
          spatialIndex.current.addCell(cellId, x, y, cellWidth, cellHeight);

          // Determine cell appearance
          const isSelected = selectedCell === cellId;
          const isInRange =
            selectedRange &&
            row >= selectedRange.start.row &&
            row <= selectedRange.end.row &&
            col >= selectedRange.start.col &&
            col <= selectedRange.end.col;

          // Background
          if (isSelected) {
            ctx.fillStyle = "#4a90e2";
          } else if (isInRange) {
            ctx.fillStyle = "#e3f2fd";
          } else {
            ctx.fillStyle = cell?.style?.backgroundColor || "#ffffff";
          }

          ctx.fillRect(x, y, cellWidth, cellHeight);

          // Border
          ctx.strokeStyle = "#e0e0e0";
          ctx.strokeRect(x, y, cellWidth, cellHeight);

          // Text
          if (cell?.displayValue) {
            ctx.fillStyle = cell?.style?.textColor || "#000000";
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";

            // Clip text to cell bounds
            ctx.save();
            ctx.beginPath();
            ctx.rect(x + 4, y, cellWidth - 8, cellHeight);
            ctx.clip();

            ctx.fillText(String(cell.displayValue), x + 6, y + cellHeight / 2);

            ctx.restore();
          }
        }
      }

      // Render column headers
      ctx.fillStyle = "#f5f5f5";
      ctx.fillRect(0, -scrollPosition.y, width, HEADER_HEIGHT);

      for (let col = startCol; col <= endCol; col++) {
        const x = columnPositions[col] - scrollPosition.x;
        const cellWidth = getColumnWidth(col);

        if (x + cellWidth < HEADER_WIDTH || x > width) continue;

        ctx.fillStyle = "#f5f5f5";
        ctx.fillRect(x, -scrollPosition.y, cellWidth, HEADER_HEIGHT);

        ctx.strokeStyle = "#d0d0d0";
        ctx.strokeRect(x, -scrollPosition.y, cellWidth, HEADER_HEIGHT);

        ctx.fillStyle = "#333";
        ctx.textAlign = "center";
        ctx.fillText(
          COLUMN_HEADERS[col] || "",
          x + cellWidth / 2,
          -scrollPosition.y + HEADER_HEIGHT / 2
        );
      }

      // Render row headers
      ctx.fillStyle = "#f5f5f5";
      ctx.fillRect(-scrollPosition.x, 0, HEADER_WIDTH, height);

      for (let row = startRow; row <= endRow; row++) {
        const y = rowPositions[row] - scrollPosition.y;
        const cellHeight = getRowHeight(row);

        if (y + cellHeight < HEADER_HEIGHT || y > height) continue;

        ctx.fillStyle = "#f5f5f5";
        ctx.fillRect(-scrollPosition.x, y, HEADER_WIDTH, cellHeight);

        ctx.strokeStyle = "#d0d0d0";
        ctx.strokeRect(-scrollPosition.x, y, HEADER_WIDTH, cellHeight);

        ctx.fillStyle = "#333";
        ctx.textAlign = "center";
        ctx.fillText(
          String(row + 1),
          -scrollPosition.x + HEADER_WIDTH / 2,
          y + cellHeight / 2
        );
      }
    }, [
      viewport,
      data,
      scrollPosition,
      containerSize,
      columnPositions,
      rowPositions,
      getColumnWidth,
      getRowHeight,
      selectedCell,
      selectedRange,
    ]);

    // Re-render canvas when data changes
    useEffect(() => {
      renderCanvas();
    }, [renderCanvas]);

    // Start editing cell
    const startEditing = useCallback(() => {
      setEditingCell(selectedCell);
      const currentCell = data[selectedCell];
      const value = currentCell?.rawValue || "";
      setEditValue(value);

      // Update suggestions if it's a formula
      if (formulaEngine && value.startsWith("=")) {
        updateSuggestions(value);
      }
    }, [selectedCell, data, formulaEngine, updateSuggestions]);

    // Handle mouse events
    const handleMouseDown = useCallback(
      (e: React.MouseEvent) => {
        if (editingCell) return;

        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = e.clientX - rect.left + scrollPosition.x;
        const y = e.clientY - rect.top + scrollPosition.y;

        // Find cell at position using spatial index
        const cellId = spatialIndex.current.findCellAt(
          x - scrollPosition.x,
          y - scrollPosition.y
        );

        if (cellId) {
          // Handle right-click for context menu
          if (e.button === 2) {
            e.preventDefault();
            onSelectCell(cellId);
            setContextMenu({
              visible: true,
              position: { x: e.clientX, y: e.clientY },
              cellId,
            });
            return;
          }

          // Normal left-click
          onSelectCell(cellId);
          setContextMenu(null);
        }
      },
      [editingCell, scrollPosition, onSelectCell]
    );

    const handleDoubleClick = useCallback(
      (e: React.MouseEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const cellId = spatialIndex.current.findCellAt(x, y);
        if (cellId) {
          onSelectCell(cellId);
          startEditing();
        }
      },
      [onSelectCell, startEditing]
    );

    // Commit edit
    const commitEdit = useCallback(() => {
      if (editingCell) {
        onCellEdit(editingCell, editValue);
        setEditingCell(null);
        setEditValue("");
        hideSuggestions();
      }
    }, [editingCell, editValue, onCellEdit, hideSuggestions]);

    // Cancel editing
    const cancelEditing = useCallback(() => {
      setEditingCell(null);
      setEditValue("");
      hideSuggestions();
    }, [hideSuggestions]);

    // Handle edit input changes
    const handleEditChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEditValue(value);

        if (formulaEngine) {
          updateSuggestions(value);
        }
      },
      [formulaEngine, updateSuggestions]
    );

    // Handle edit keyboard events
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
            commitEdit();
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
      ]
    );

    // Context menu items
    const getContextMenuItems = useCallback((): ContextMenuItem[] => {
      return [
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
      ];
    }, []);

    // Calculate editing input position
    const editingInputStyle = useMemo(() => {
      if (!editingCell) return {};

      const cellPos = parseCellId(editingCell);
      const x = columnPositions[cellPos.col] - scrollPosition.x;
      const y = rowPositions[cellPos.row] - scrollPosition.y;

      return {
        position: "absolute" as const,
        left: `${x}px`,
        top: `${y}px`,
        width: `${getColumnWidth(cellPos.col)}px`,
        height: `${getRowHeight(cellPos.row)}px`,
        border: "2px solid #4a90e2",
        fontSize: "14px",
        padding: "4px",
        zIndex: 1000,
      };
    }, [
      editingCell,
      columnPositions,
      rowPositions,
      scrollPosition,
      getColumnWidth,
      getRowHeight,
    ]);

    return (
      <div
        ref={containerRef}
        className="virtualized-grid-container"
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          overflow: "auto",
        }}
        onScroll={handleScroll}
        tabIndex={0}
      >
        {/* Spacer to create scrollable area */}
        <div
          style={{
            width: columnPositions[columnPositions.length - 1],
            height: rowPositions[rowPositions.length - 1],
            position: "relative",
          }}
        >
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              pointerEvents: "auto",
            }}
            onMouseDown={handleMouseDown}
            onDoubleClick={handleDoubleClick}
            onContextMenu={(e) => e.preventDefault()}
          />

          {/* Editing input overlay */}
          {editingCell && (
            <input
              ref={editInputRef}
              type="text"
              value={editValue}
              onChange={handleEditChange}
              onKeyDown={handleEditKeyDown}
              onBlur={() => {
                if (!isApplyingSuggestion) {
                  commitEdit();
                }
              }}
              style={editingInputStyle}
              autoFocus
            />
          )}

          {/* Formula suggestions */}
          {formulaEngine && showSuggestions && editingCell && (
            <div
              style={{
                position: "absolute",
                left: editingInputStyle.left,
                top: `calc(${editingInputStyle.top} + ${editingInputStyle.height} + 4px)`,
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

export default VirtualizedGrid;
