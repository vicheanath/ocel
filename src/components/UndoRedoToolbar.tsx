// components/UndoRedoToolbar.tsx
import React from "react";

interface UndoRedoToolbarProps {
  canUndo: boolean;
  canRedo: boolean;
  undoDescription: string | null;
  redoDescription: string | null;
  onUndo: () => void;
  onRedo: () => void;
  historySize: number;
  onClearHistory?: () => void;
}

const UndoRedoToolbar: React.FC<UndoRedoToolbarProps> = ({
  canUndo,
  canRedo,
  undoDescription,
  redoDescription,
  onUndo,
  onRedo,
  historySize,
  onClearHistory,
}) => {
  return (
    <div className="flex items-center space-x-2 border-r border-gray-300 pr-4">
      {/* Undo Button */}
      <button
        className={`flex items-center px-3 py-1 rounded-md transition ${
          canUndo
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
        onClick={onUndo}
        disabled={!canUndo}
        title={undoDescription || "Nothing to undo"}
      >
        <svg
          className="w-4 h-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
          />
        </svg>
        <span className="text-sm">Undo</span>
      </button>

      {/* Redo Button */}
      <button
        className={`flex items-center px-3 py-1 rounded-md transition ${
          canRedo
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
        onClick={onRedo}
        disabled={!canRedo}
        title={redoDescription || "Nothing to redo"}
      >
        <svg
          className="w-4 h-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 10H11a8 8 0 00-8 8v2m18-10l-6-6m6 6l-6 6"
          />
        </svg>
        <span className="text-sm">Redo</span>
      </button>

      {/* History Info */}
      <div className="flex items-center text-xs text-gray-600">
        <span>History: {historySize}</span>
      </div>

      {/* Clear History Button (optional, for development) */}
      {onClearHistory && historySize > 0 && (
        <button
          className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
          onClick={onClearHistory}
          title="Clear history"
        >
          Clear
        </button>
      )}
    </div>
  );
};

export default UndoRedoToolbar;
