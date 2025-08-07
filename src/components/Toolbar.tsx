// components/Toolbar.tsx
import React from "react";
import type { CellStyle } from "../types";

interface ToolbarProps {
  onFormatChange: (style: Partial<CellStyle>) => void;
  onMerge: () => void;
  onUnmerge: () => void;
  onBold: () => void;
  onItalic: () => void;
  onAlignLeft: () => void;
  onAlignCenter: () => void;
  onAlignRight: () => void;
  onImportExport?: () => void;
  onLoadSample?: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onFormatChange,
  onMerge,
  onUnmerge,
  onBold,
  onItalic,
  onAlignLeft,
  onAlignCenter,
  onAlignRight,
  onImportExport,
  onLoadSample,
}) => {
  const [fontSize, setFontSize] = React.useState(14);
  const [textColor, setTextColor] = React.useState("#000000");
  const [bgColor, setBgColor] = React.useState("#ffffff");

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const size = parseInt(e.target.value);
    setFontSize(size);
    onFormatChange({ fontSize: size });
  };

  const handleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setTextColor(color);
    onFormatChange({ textColor: color });
  };

  const handleBgColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setBgColor(color);
    onFormatChange({ backgroundColor: color });
  };

  return (
    <div className="flex items-center p-2 bg-white border-b border-gray-300 space-x-4">
      {/* Import/Export Controls */}
      {(onImportExport || onLoadSample) && (
        <div className="flex space-x-2 border-r border-gray-300 pr-4">
          {onImportExport && (
            <button
              className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center space-x-1"
              onClick={onImportExport}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                />
              </svg>
              <span>Import/Export</span>
            </button>
          )}
          {onLoadSample && (
            <button
              className="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition flex items-center space-x-1"
              onClick={onLoadSample}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>Load Sample</span>
            </button>
          )}
        </div>
      )}

      {/* Merge Controls */}
      <div className="flex space-x-2">
        <button
          className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          onClick={onMerge}
        >
          Merge Cells
        </button>
        <button
          className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
          onClick={onUnmerge}
        >
          Unmerge
        </button>
      </div>

      {/* Font Controls */}
      <div className="flex items-center space-x-2">
        <button
          className="px-2 py-1 border border-gray-300 rounded-md hover:bg-gray-100"
          onClick={onBold}
          title="Bold"
        >
          <span className="font-bold">B</span>
        </button>
        <button
          className="px-2 py-1 border border-gray-300 rounded-md hover:bg-gray-100"
          onClick={onItalic}
          title="Italic"
        >
          <span className="italic">I</span>
        </button>

        <select
          className="border border-gray-300 rounded-md px-2 py-1"
          value={fontSize}
          onChange={handleFontSizeChange}
        >
          {[8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72].map(
            (size) => (
              <option key={size} value={size}>
                {size}px
              </option>
            )
          )}
        </select>

        <div className="flex items-center">
          <label className="mr-1 text-sm">Text:</label>
          <input
            type="color"
            value={textColor}
            onChange={handleTextColorChange}
            className="w-8 h-8"
          />
        </div>

        <div className="flex items-center">
          <label className="mr-1 text-sm">Fill:</label>
          <input
            type="color"
            value={bgColor}
            onChange={handleBgColorChange}
            className="w-8 h-8"
          />
        </div>
      </div>

      {/* Alignment Controls */}
      <div className="flex items-center space-x-1">
        <button
          className="px-2 py-1 border border-gray-300 rounded-md hover:bg-gray-100"
          onClick={onAlignLeft}
          title="Align Left"
        >
          <i className="fas fa-align-left"></i>
        </button>
        <button
          className="px-2 py-1 border border-gray-300 rounded-md hover:bg-gray-100"
          onClick={onAlignCenter}
          title="Align Center"
        >
          <i className="fas fa-align-center"></i>
        </button>
        <button
          className="px-2 py-1 border border-gray-300 rounded-md hover:bg-gray-100"
          onClick={onAlignRight}
          title="Align Right"
        >
          <i className="fas fa-align-right"></i>
        </button>
      </div>

      {/* More controls can be added here: borders, number formatting, etc. */}
    </div>
  );
};

export default Toolbar;
