// components/TabDemo.tsx - Demonstration of tab features
import React, { useEffect } from "react";
import { useSpreadsheetStore } from "../store/spreadsheetStore";

const TabDemo: React.FC = () => {
  const { addTab, updateCell, setActiveTab, tabs } = useSpreadsheetStore();

  useEffect(() => {
    // Create demo tabs with sample data
    const demoData = [
      {
        name: "Sales Data",
        data: {
          A1: {
            id: "A1",
            rawValue: "Product",
            computedValue: "Product",
            displayValue: "Product",
            type: "text" as const,
            style: { bold: true },
          },
          B1: {
            id: "B1",
            rawValue: "Q1 Sales",
            computedValue: "Q1 Sales",
            displayValue: "Q1 Sales",
            type: "text" as const,
            style: { bold: true },
          },
          C1: {
            id: "C1",
            rawValue: "Q2 Sales",
            computedValue: "Q2 Sales",
            displayValue: "Q2 Sales",
            type: "text" as const,
            style: { bold: true },
          },
          A2: {
            id: "A2",
            rawValue: "Widget A",
            computedValue: "Widget A",
            displayValue: "Widget A",
            type: "text" as const,
          },
          B2: {
            id: "B2",
            rawValue: "1000",
            computedValue: 1000,
            displayValue: "1000",
            type: "number" as const,
          },
          C2: {
            id: "C2",
            rawValue: "1200",
            computedValue: 1200,
            displayValue: "1200",
            type: "number" as const,
          },
        },
      },
      {
        name: "Budget 2024",
        data: {
          A1: {
            id: "A1",
            rawValue: "Category",
            computedValue: "Category",
            displayValue: "Category",
            type: "text" as const,
            style: { bold: true },
          },
          B1: {
            id: "B1",
            rawValue: "Budget",
            computedValue: "Budget",
            displayValue: "Budget",
            type: "text" as const,
            style: { bold: true },
          },
          A2: {
            id: "A2",
            rawValue: "Marketing",
            computedValue: "Marketing",
            displayValue: "Marketing",
            type: "text" as const,
          },
          B2: {
            id: "B2",
            rawValue: "50000",
            computedValue: 50000,
            displayValue: "50000",
            type: "number" as const,
          },
        },
      },
      {
        name: "Calculations",
        data: {
          A1: {
            id: "A1",
            rawValue: "Value A",
            computedValue: "Value A",
            displayValue: "Value A",
            type: "text" as const,
          },
          A2: {
            id: "A2",
            rawValue: "10",
            computedValue: 10,
            displayValue: "10",
            type: "number" as const,
          },
          B1: {
            id: "B1",
            rawValue: "Value B",
            computedValue: "Value B",
            displayValue: "Value B",
            type: "text" as const,
          },
          B2: {
            id: "B2",
            rawValue: "20",
            computedValue: 20,
            displayValue: "20",
            type: "number" as const,
          },
          C1: {
            id: "C1",
            rawValue: "Sum",
            computedValue: "Sum",
            displayValue: "Sum",
            type: "text" as const,
          },
          C2: {
            id: "C2",
            rawValue: "=A2+B2",
            computedValue: 30,
            displayValue: "30",
            type: "formula" as const,
            formula: "=A2+B2",
          },
        },
      },
    ];

    // Only create demo tabs if we just have the default tab
    if (tabs.length === 1 && tabs[0].name === "Sheet1") {
      // Add demo tabs
      demoData.forEach((demo, index) => {
        const tabId = addTab(demo.name);

        // Add sample data to each tab
        setTimeout(() => {
          setActiveTab(tabId);
          Object.entries(demo.data).forEach(([cellId, cellData]) => {
            updateCell(cellId, cellData.rawValue);
          });
        }, index * 100);
      });

      // Switch back to first demo tab
      setTimeout(() => {
        const firstDemoTab = tabs.find((t) => t.name === "Sales Data");
        if (firstDemoTab) {
          setActiveTab(firstDemoTab.id);
        }
      }, 400);
    }
  }, [addTab, updateCell, setActiveTab, tabs]);

  return (
    <div className="fixed top-4 right-4 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-sm z-40">
      <h3 className="font-semibold text-blue-800 mb-2">Tab Features Demo</h3>
      <div className="text-sm text-blue-700 space-y-1">
        <p>
          ✅ <strong>Multiple tabs</strong> with separate data
        </p>
        <p>
          ✅ <strong>Add tabs</strong> with + button
        </p>
        <p>
          ✅ <strong>Rename tabs</strong> by double-clicking
        </p>
        <p>
          ✅ <strong>Right-click</strong> for context menu
        </p>
        <p>
          ✅ <strong>Zustand store</strong> for state management
        </p>
        <p>
          ✅ <strong>Auto-save indicators</strong> (orange dots)
        </p>
      </div>
      <div className="mt-3 text-xs text-blue-600">
        <p>Try: Switch tabs, edit cells, add formulas!</p>
      </div>
    </div>
  );
};

export default TabDemo;
