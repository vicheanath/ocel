// components/Toolbar.tsx
import React from "react";
import {
  Undo2,
  Redo2,
  Printer,
  PaintBucket,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Type,
  Palette,
  Grid3X3,
  Combine,
  AlignLeft,
  AlignCenter,
  AlignRight,
  MoreHorizontal,
  FileUp,
  FileText,
  ChevronUp,
  ChevronDown,
  BookOpen,
  Square,
  Minus,
} from "lucide-react";
import type { CellStyle } from "../types";

interface ToolbarProps {
  onFormatChange: (style: Partial<CellStyle>) => void;
  onMerge: () => void;
  onUnmerge: () => void;
  onBold: () => void;
  onItalic: () => void;
  onUnderline?: () => void;
  onStrikethrough?: () => void;
  onAlignLeft: () => void;
  onAlignCenter: () => void;
  onAlignRight: () => void;
  onImportExport?: () => void;
  onLoadSample?: () => void;
  onDocs?: () => void;
  onPrint?: () => void;
  onPaintFormat?: () => void;
  onZoomChange?: (zoom: string) => void;

  // Undo/Redo props
  canUndo?: boolean;
  canRedo?: boolean;
  undoDescription?: string | null;
  redoDescription?: string | null;
  onUndo?: () => void;
  onRedo?: () => void;
  historySize?: number;
  onClearHistory?: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onFormatChange,
  onMerge,
  onUnmerge,
  onBold,
  onItalic,
  onUnderline,
  onStrikethrough,
  onAlignLeft,
  onAlignCenter,
  onAlignRight,
  onImportExport,
  onLoadSample,
  onDocs,
  onPrint,
  onPaintFormat,
  onZoomChange,
  canUndo = false,
  canRedo = false,
  undoDescription,
  redoDescription,
  onUndo,
  onRedo,
}) => {
  const [fontSize, setFontSize] = React.useState(10);
  const [fontFamily, setFontFamily] = React.useState("Arial");
  const [textColor, setTextColor] = React.useState("#000000");
  const [bgColor, setBgColor] = React.useState("#ffffff");
  const [formatType, setFormatType] = React.useState("Automatic");
  const [showColorDropdown, setShowColorDropdown] = React.useState(false);
  const [showFillDropdown, setShowFillDropdown] = React.useState(false);
  const [zoom, setZoom] = React.useState("100%");
  const [paintFormatMode, setPaintFormatMode] = React.useState(false);
  const [showBorderDropdown, setShowBorderDropdown] = React.useState(false);

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = parseInt(e.target.value) || 10;
    setFontSize(size);
    onFormatChange({ fontSize: size });
  };

  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const family = e.target.value;
    setFontFamily(family);
    onFormatChange({ fontFamily: family });
  };

  const handleTextColorChange = (color: string) => {
    setTextColor(color);
    onFormatChange({ textColor: color });
  };

  const handleBgColorChange = (color: string) => {
    setBgColor(color);
    onFormatChange({ backgroundColor: color });
  };

  const handleFormatTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const format = e.target.value;
    setFormatType(format);
    // Implement number formatting logic here
  };

  const handleZoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newZoom = e.target.value;
    setZoom(newZoom);
    if (onZoomChange) {
      onZoomChange(newZoom);
    }
  };

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  const handlePaintFormat = () => {
    setPaintFormatMode(!paintFormatMode);
    if (onPaintFormat) {
      onPaintFormat();
    }
  };

  const handleBorderApply = (borderStyle: string) => {
    onFormatChange({ border: borderStyle });
    setShowBorderDropdown(false);
  };

  // Google Sheets style color palette
  const colorPalette = [
    "#000000",
    "#ffffff",
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00",
    "#ff00ff",
    "#00ffff",
    "#800000",
    "#808080",
    "#008000",
    "#800080",
    "#008080",
    "#000080",
    "#c0c0c0",
    "#808080",
    "#9999ff",
    "#993366",
    "#ffffcc",
    "#ccffff",
    "#660066",
    "#ff8080",
    "#0066cc",
    "#ccccff",
    "#000080",
    "#ff00ff",
    "#ffff00",
    "#00ffff",
    "#800080",
    "#800000",
    "#008080",
    "#0000ff",
  ];

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      {/* Top toolbar row */}
      <div className="flex items-center px-3 py-2 space-x-1 min-h-[40px]">
        {/* Undo/Redo */}
        {onUndo && onRedo && (
          <div className="flex items-center space-x-1 mr-2">
            <button
              className={`p-1 rounded hover:bg-gray-100 ${
                !canUndo ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={onUndo}
              disabled={!canUndo}
              title={`Undo ${undoDescription || ""}`}
            >
              <Undo2 className="w-5 h-5" />
            </button>
            <button
              className={`p-1 rounded hover:bg-gray-100 ${
                !canRedo ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={onRedo}
              disabled={!canRedo}
              title={`Redo ${redoDescription || ""}`}
            >
              <Redo2 className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-gray-300 mx-2"></div>
          </div>
        )}

        {/* Print */}
        <button
          className="p-1 rounded hover:bg-gray-100"
          onClick={handlePrint}
          title="Print (Ctrl+P)"
        >
          <Printer className="w-5 h-5" />
        </button>

        {/* Paint Format */}
        <button
          className={`p-1 rounded hover:bg-gray-100 ${
            paintFormatMode ? "bg-blue-100 border border-blue-300" : ""
          }`}
          onClick={handlePaintFormat}
          title="Paint format"
        >
          <PaintBucket className="w-5 h-5" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-2"></div>

        {/* Zoom */}
        <select
          className="text-sm border border-gray-300 rounded px-2 py-1 bg-white min-w-[70px]"
          value={zoom}
          onChange={handleZoomChange}
        >
          <option>50%</option>
          <option>75%</option>
          <option>100%</option>
          <option>125%</option>
          <option>150%</option>
          <option>200%</option>
        </select>

        <div className="w-px h-6 bg-gray-300 mx-2"></div>

        {/* Font family */}
        <select
          className="text-sm border border-gray-300 rounded px-2 py-1 bg-white min-w-[120px]"
          value={fontFamily}
          onChange={handleFontFamilyChange}
        >
          <option>Arial</option>
          <option>Georgia</option>
          <option>Times New Roman</option>
          <option>Verdana</option>
          <option>Courier New</option>
          <option>Helvetica</option>
          <option>Roboto</option>
        </select>

        {/* Font size */}
        <div className="flex items-center border border-gray-300 rounded overflow-hidden">
          <input
            type="text"
            className="w-10 px-2 py-1 text-sm border-0 outline-none text-center"
            value={fontSize}
            onChange={handleFontSizeChange}
          />
          <div className="flex flex-col border-l border-gray-300">
            <button
              className="px-1 py-0.5 hover:bg-gray-100 text-xs"
              onClick={() => {
                const newSize = fontSize + 1;
                setFontSize(newSize);
                onFormatChange({ fontSize: newSize });
              }}
            >
              <ChevronUp className="w-3 h-3" />
            </button>
            <button
              className="px-1 py-0.5 hover:bg-gray-100 text-xs"
              onClick={() => {
                const newSize = Math.max(1, fontSize - 1);
                setFontSize(newSize);
                onFormatChange({ fontSize: newSize });
              }}
            >
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Text formatting */}
        <button
          className="p-1 rounded hover:bg-gray-100"
          onClick={onBold}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          className="p-1 rounded hover:bg-gray-100"
          onClick={onItalic}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>
        {onUnderline && (
          <button
            className="p-1 rounded hover:bg-gray-100"
            onClick={onUnderline}
            title="Underline (Ctrl+U)"
          >
            <Underline className="w-4 h-4" />
          </button>
        )}
        {onStrikethrough && (
          <button
            className="p-1 rounded hover:bg-gray-100"
            onClick={onStrikethrough}
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>
        )}

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Text color */}
        <div className="relative">
          <button
            className="p-1 rounded hover:bg-gray-100 flex flex-col items-center"
            onClick={() => setShowColorDropdown(!showColorDropdown)}
            title="Text color"
          >
            <Type className="w-4 h-4" />
            <div
              className="w-4 h-1 mt-0.5"
              style={{ backgroundColor: textColor }}
            ></div>
          </button>
          {showColorDropdown && (
            <div className="absolute top-full left-0 z-50 bg-white border border-gray-300 rounded-md shadow-lg p-2 grid grid-cols-8 gap-1 w-48">
              {colorPalette.map((color) => (
                <button
                  key={color}
                  className="w-5 h-5 rounded border border-gray-200 hover:border-gray-400"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    handleTextColorChange(color);
                    setShowColorDropdown(false);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Fill color */}
        <div className="relative">
          <button
            className="p-1 rounded hover:bg-gray-100 flex flex-col items-center"
            onClick={() => setShowFillDropdown(!showFillDropdown)}
            title="Fill color"
          >
            <Palette className="w-4 h-4" />
            <div
              className="w-4 h-1 mt-0.5"
              style={{ backgroundColor: bgColor }}
            ></div>
          </button>
          {showFillDropdown && (
            <div className="absolute top-full left-0 z-50 bg-white border border-gray-300 rounded-md shadow-lg p-2 grid grid-cols-8 gap-1 w-48">
              {colorPalette.map((color) => (
                <button
                  key={color}
                  className="w-5 h-5 rounded border border-gray-200 hover:border-gray-400"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    handleBgColorChange(color);
                    setShowFillDropdown(false);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Borders */}
        <div className="relative">
          <button
            className="p-1 rounded hover:bg-gray-100"
            onClick={() => setShowBorderDropdown(!showBorderDropdown)}
            title="Borders"
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          {showBorderDropdown && (
            <div className="absolute top-full left-0 z-50 bg-white border border-gray-300 rounded-md shadow-lg p-2 min-w-[120px]">
              <button
                className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                onClick={() => handleBorderApply("1px solid #000")}
              >
                All borders
              </button>
              <button
                className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                onClick={() =>
                  handleBorderApply("1px solid #000 1px solid #000 0 0")
                }
              >
                Top border
              </button>
              <button
                className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                onClick={() => handleBorderApply("0 0 1px solid #000 0")}
              >
                Bottom border
              </button>
              <button
                className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                onClick={() => handleBorderApply("0 0 0 1px solid #000")}
              >
                Left border
              </button>
              <button
                className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                onClick={() => handleBorderApply("0 1px solid #000 0 0")}
              >
                Right border
              </button>
              <button
                className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                onClick={() => handleBorderApply("none")}
              >
                No border
              </button>
            </div>
          )}
        </div>

        {/* Merge/Unmerge cells */}
        <button
          className="p-1 rounded hover:bg-gray-100"
          onClick={onMerge}
          title="Merge cells"
        >
          <Combine className="w-4 h-4" />
        </button>
        <button
          className="p-1 rounded hover:bg-gray-100"
          onClick={onUnmerge}
          title="Unmerge cells"
        >
          <div className="w-4 h-4 flex items-center justify-center">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <rect x="3" y="3" width="8" height="8" />
              <rect x="13" y="13" width="8" height="8" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m16 8-8 8"
              />
            </svg>
          </div>
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Alignment */}
        <button
          className="p-1 rounded hover:bg-gray-100"
          onClick={onAlignLeft}
          title="Align left"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          className="p-1 rounded hover:bg-gray-100"
          onClick={onAlignCenter}
          title="Align center"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          className="p-1 rounded hover:bg-gray-100"
          onClick={onAlignRight}
          title="Align right"
        >
          <AlignRight className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Number format */}
        <select
          className="text-sm border border-gray-300 rounded px-2 py-1 bg-white min-w-[100px]"
          value={formatType}
          onChange={handleFormatTypeChange}
        >
          <option>Automatic</option>
          <option>Plain text</option>
          <option>Number</option>
          <option>Percent</option>
          <option>Scientific</option>
          <option>Accounting</option>
          <option>Financial</option>
          <option>Currency</option>
          <option>Currency (rounded)</option>
          <option>Date</option>
          <option>Time</option>
          <option>Date time</option>
          <option>Duration</option>
        </select>

        {/* More options */}
        <button className="p-1 rounded hover:bg-gray-100" title="More options">
          <MoreHorizontal className="w-4 h-4" />
        </button>

        {/* Import/Export/Docs - moved to end */}
        {(onImportExport || onLoadSample || onDocs) && (
          <>
            <div className="w-px h-6 bg-gray-300 mx-2"></div>
            <div className="flex space-x-1">
              {onImportExport && (
                <button
                  className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center space-x-1"
                  onClick={onImportExport}
                >
                  <FileUp className="w-3 h-3" />
                  <span>Import</span>
                </button>
              )}
              {onLoadSample && (
                <button
                  className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition flex items-center space-x-1"
                  onClick={onLoadSample}
                >
                  <FileText className="w-3 h-3" />
                  <span>Sample</span>
                </button>
              )}
              {onDocs && (
                <button
                  className="px-2 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 transition flex items-center space-x-1"
                  onClick={onDocs}
                >
                  <BookOpen className="w-3 h-3" />
                  <span>Docs</span>
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Click outside to close dropdowns */}
      {(showColorDropdown || showFillDropdown || showBorderDropdown) && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => {
            setShowColorDropdown(false);
            setShowFillDropdown(false);
            setShowBorderDropdown(false);
          }}
        />
      )}
    </div>
  );
};

export default Toolbar;
