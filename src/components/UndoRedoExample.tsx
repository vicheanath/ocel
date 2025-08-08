// components/UndoRedoExample.tsx
import React, { useState } from "react";
import { useUndoRedo } from "../hooks/useUndoRedo";
import { createEmptyGrid } from "../utils/spreadsheetUtils";
import type { SpreadsheetData, CellStyle } from "../types";

const UndoRedoExample: React.FC = () => {
  const [data, setData] = useState<SpreadsheetData>(() =>
    createEmptyGrid(5, 5)
  );

  const undoRedoSystem = useUndoRedo(data, setData, (cell, range) => {
    console.log("Selection changed:", cell, range);
  });

  const handleCellUpdate = (cellId: string, value: string) => {
    undoRedoSystem.updateCell(cellId, value);
  };

  const handleFormatting = (cellIds: string[], style: Partial<CellStyle>) => {
    undoRedoSystem.applyFormatting(cellIds, style);
  };

  const handleBulkUpdate = () => {
    const changes = {
      A1: { newValue: "Bulk", oldValue: data["A1"]?.rawValue || "" },
      B1: { newValue: "Update", oldValue: data["B1"]?.rawValue || "" },
      C1: { newValue: "Example", oldValue: data["C1"]?.rawValue || "" },
    };
    undoRedoSystem.bulkUpdate(changes);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        🔄 Undo/Redo System Example
      </h2>

      {/* Control Panel */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Controls</h3>

        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={undoRedoSystem.undo}
            disabled={!undoRedoSystem.canUndo}
            className={`px-4 py-2 rounded ${
              undoRedoSystem.canUndo
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            title={undoRedoSystem.undoDescription || "Nothing to undo"}
          >
            ⏪ Undo
          </button>

          <button
            onClick={undoRedoSystem.redo}
            disabled={!undoRedoSystem.canRedo}
            className={`px-4 py-2 rounded ${
              undoRedoSystem.canRedo
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            title={undoRedoSystem.redoDescription || "Nothing to redo"}
          >
            ⏩ Redo
          </button>

          <button
            onClick={undoRedoSystem.clearHistory}
            disabled={undoRedoSystem.historySize === 0}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-300 disabled:text-gray-500"
          >
            🗑️ Clear History
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          <div className="bg-white p-2 rounded">
            <span className="font-medium">History Size:</span>{" "}
            {undoRedoSystem.historySize}
          </div>
          <div className="bg-white p-2 rounded">
            <span className="font-medium">Can Undo:</span>{" "}
            {undoRedoSystem.canUndo ? "✅" : "❌"}
          </div>
          <div className="bg-white p-2 rounded">
            <span className="font-medium">Can Redo:</span>{" "}
            {undoRedoSystem.canRedo ? "✅" : "❌"}
          </div>
          <div className="bg-white p-2 rounded">
            <span className="font-medium">Active Cells:</span>{" "}
            {Object.keys(data).filter((k) => data[k]?.rawValue).length}
          </div>
        </div>

        {(undoRedoSystem.undoDescription || undoRedoSystem.redoDescription) && (
          <div className="mt-3 p-2 bg-blue-50 rounded text-sm">
            {undoRedoSystem.undoDescription && (
              <div>▶️ {undoRedoSystem.undoDescription}</div>
            )}
            {undoRedoSystem.redoDescription && (
              <div>▶️ {undoRedoSystem.redoDescription}</div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Test Actions</h3>

        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => handleCellUpdate("A1", "Hello")}
            className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Set A1 to "Hello"
          </button>

          <button
            onClick={() => handleCellUpdate("B1", "World")}
            className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Set B1 to "World"
          </button>

          <button
            onClick={() => handleCellUpdate("C1", '=A1&" "&B1')}
            className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Set C1 to Formula
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() =>
              handleFormatting(["A1", "B1"], {
                bold: true,
                textColor: "#ff0000",
              })
            }
            className="px-3 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
          >
            Format A1,B1 (Bold+Red)
          </button>

          <button
            onClick={() =>
              handleFormatting(["C1"], {
                italic: true,
                backgroundColor: "#ffff00",
              })
            }
            className="px-3 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
          >
            Format C1 (Italic+Yellow)
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleBulkUpdate}
            className="px-3 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
          >
            🔄 Bulk Update A1:C1
          </button>
        </div>
      </div>

      {/* Simple Grid Display */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Grid Display</h3>
        <div className="grid grid-cols-5 gap-1 max-w-md">
          {["A", "B", "C", "D", "E"].map((col) =>
            Array.from({ length: 5 }, (_, rowIndex) => {
              const cellId = `${col}${rowIndex + 1}`;
              const cell = data[cellId];
              const isEmpty = !cell?.rawValue;

              return (
                <div
                  key={cellId}
                  className={`
                    border p-2 text-xs min-h-[40px] flex items-center justify-center
                    ${isEmpty ? "bg-gray-50" : "bg-white"}
                    ${cell?.style?.bold ? "font-bold" : ""}
                    ${cell?.style?.italic ? "italic" : ""}
                  `}
                  style={{
                    color: cell?.style?.textColor || "#000",
                    backgroundColor:
                      cell?.style?.backgroundColor ||
                      (isEmpty ? "#f9fafb" : "#fff"),
                  }}
                  title={`${cellId}: ${cell?.rawValue || "Empty"}`}
                >
                  <div className="text-center">
                    <div className="font-mono text-gray-500">{cellId}</div>
                    {cell?.displayValue && (
                      <div className="mt-1 break-all">{cell.displayValue}</div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* History Summary */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">History Summary</h3>
        <div className="space-y-2 text-sm">
          <div>
            <strong>Undo Stack:</strong>
            <ul className="ml-4 mt-1">
              {undoRedoSystem.historySummary.undoCommands.map((cmd, index) => (
                <li key={index} className="text-blue-600">
                  • {cmd}
                </li>
              ))}
              {undoRedoSystem.historySummary.undoCommands.length === 0 && (
                <li className="text-gray-500 italic">No undo commands</li>
              )}
            </ul>
          </div>

          <div>
            <strong>Redo Stack:</strong>
            <ul className="ml-4 mt-1">
              {undoRedoSystem.historySummary.redoCommands.map((cmd, index) => (
                <li key={index} className="text-green-600">
                  • {cmd}
                </li>
              ))}
              {undoRedoSystem.historySummary.redoCommands.length === 0 && (
                <li className="text-gray-500 italic">No redo commands</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> Use{" "}
          <kbd className="bg-blue-200 px-2 py-1 rounded">Ctrl+Z</kbd> and{" "}
          <kbd className="bg-blue-200 px-2 py-1 rounded">Ctrl+Y</kbd>
          for keyboard undo/redo shortcuts!
        </p>
      </div>
    </div>
  );
};

export default UndoRedoExample;
