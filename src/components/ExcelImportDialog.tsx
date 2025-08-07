// components/ExcelImportDialog.tsx
import React, { useState, useRef } from "react";
import {
  importExcelFile,
  exportToExcel,
  previewExcelFile,
} from "../utils/excelImport";
import type { SpreadsheetData } from "../types";

interface ExcelImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: SpreadsheetData) => void;
  currentData: SpreadsheetData;
}

const ExcelImportDialog: React.FC<ExcelImportDialogProps> = ({
  isOpen,
  onClose,
  onImport,
  currentData,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [availableSheets, setAvailableSheets] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>("");
  const [previewData, setPreviewData] = useState<{
    [sheetName: string]: (string | number | boolean)[][];
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [importMode, setImportMode] = useState<"replace" | "merge">("replace");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetDialog = () => {
    setFile(null);
    setAvailableSheets([]);
    setSelectedSheet("");
    setPreviewData({});
    setError("");
    setImportMode("replace");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    resetDialog();
    onClose();
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError("");
    setIsLoading(true);

    try {
      const preview = await previewExcelFile(selectedFile);
      setAvailableSheets(preview.sheetNames);
      setPreviewData(preview.sampleData);
      setSelectedSheet(preview.sheetNames[0] || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to preview file");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async () => {
    if (!file || !selectedSheet) return;

    setIsLoading(true);
    setError("");

    try {
      const result = await importExcelFile(file, selectedSheet);

      if (result.success && result.data) {
        let finalData = result.data;

        if (importMode === "merge") {
          // Merge with existing data
          finalData = { ...currentData, ...result.data };
        }

        onImport(finalData);
        handleClose();
      } else {
        setError(result.error || "Import failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    setIsLoading(true);
    try {
      const filename = `spreadsheet_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      await exportToExcel(currentData, filename);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Excel Import/Export
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Export Section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Export Current Spreadsheet
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Export your current spreadsheet data to an Excel file (.xlsx
              format).
            </p>
            <button
              onClick={handleExport}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Exporting..." : "Export to Excel"}
            </button>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Import from Excel
            </h3>

            {/* File Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Excel File
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {/* Import Mode */}
            {file && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Import Mode
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="importMode"
                      value="replace"
                      checked={importMode === "replace"}
                      onChange={(e) =>
                        setImportMode(e.target.value as "replace" | "merge")
                      }
                      className="mr-2"
                    />
                    <span className="text-sm">
                      Replace all data (clears current spreadsheet)
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="importMode"
                      value="merge"
                      checked={importMode === "merge"}
                      onChange={(e) =>
                        setImportMode(e.target.value as "replace" | "merge")
                      }
                      className="mr-2"
                    />
                    <span className="text-sm">
                      Merge with current data (keep existing cells)
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Sheet Selection */}
            {availableSheets.length > 1 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Sheet
                </label>
                <select
                  value={selectedSheet}
                  onChange={(e) => setSelectedSheet(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {availableSheets.map((sheetName) => (
                    <option key={sheetName} value={sheetName}>
                      {sheetName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Preview */}
            {selectedSheet && previewData[selectedSheet] && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Preview (First 5 rows)
                </h4>
                <div className="overflow-x-auto border rounded-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <tbody className="bg-white divide-y divide-gray-200">
                      {previewData[selectedSheet].map((row, rowIndex) => (
                        <tr
                          key={rowIndex}
                          className={rowIndex === 0 ? "bg-gray-50" : ""}
                        >
                          {row.map((cell, cellIndex) => (
                            <td
                              key={cellIndex}
                              className="px-4 py-2 text-sm text-gray-900 border-r border-gray-200 max-w-xs truncate"
                            >
                              {String(cell || "")}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          {file && (
            <button
              onClick={handleImport}
              disabled={isLoading || !selectedSheet}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Importing..." : "Import Data"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExcelImportDialog;
