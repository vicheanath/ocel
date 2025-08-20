// components/TabBar.tsx - Excel-like tab interface
import React, { useState, useRef, useCallback } from "react";
import {
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import { useSpreadsheetStore } from "../store/spreadsheetStore";
import type { SpreadsheetTab } from "../store/spreadsheetStore";
import "./TabBar.css";

interface TabBarProps {
  className?: string;
}

const TabBar: React.FC<TabBarProps> = ({ className = "" }) => {
  const {
    tabs,
    activeTabId,
    addTab,
    removeTab,
    setActiveTab,
    renameTab,
    duplicateTab,
  } = useSpreadsheetStore();

  const [editingTab, setEditingTab] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>("");
  const [contextMenu, setContextMenu] = useState<{
    tabId: string;
    x: number;
    y: number;
  } | null>(null);

  const tabsRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll state
  const checkScroll = useCallback(() => {
    const container = tabsRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth
    );
  }, []);

  // Scroll tabs
  const scrollTabs = (direction: "left" | "right") => {
    const container = tabsRef.current;
    if (!container) return;

    const scrollAmount = 120;
    const newScrollLeft =
      container.scrollLeft +
      (direction === "left" ? -scrollAmount : scrollAmount);

    container.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });

    setTimeout(checkScroll, 150);
  };

  // Handle tab click
  const handleTabClick = (tab: SpreadsheetTab, event: React.MouseEvent) => {
    if (event.button === 0) {
      // Left click
      setActiveTab(tab.id);
    }
  };

  // Handle tab double-click to rename
  const handleTabDoubleClick = (tab: SpreadsheetTab) => {
    setEditingTab(tab.id);
    setEditingName(tab.name);
  };

  // Handle tab right-click for context menu
  const handleTabRightClick = (
    tab: SpreadsheetTab,
    event: React.MouseEvent
  ) => {
    event.preventDefault();
    setContextMenu({
      tabId: tab.id,
      x: event.clientX,
      y: event.clientY,
    });
  };

  // Handle rename submit
  const handleRenameSubmit = () => {
    if (editingTab && editingName.trim()) {
      renameTab(editingTab, editingName.trim());
    }
    setEditingTab(null);
    setEditingName("");
  };

  // Handle rename cancel
  const handleRenameCancel = () => {
    setEditingTab(null);
    setEditingName("");
  };

  // Handle context menu actions
  const handleContextMenuAction = (action: string, tabId: string) => {
    switch (action) {
      case "rename": {
        const tab = tabs.find((t) => t.id === tabId);
        if (tab) {
          setEditingTab(tabId);
          setEditingName(tab.name);
        }
        break;
      }
      case "duplicate":
        duplicateTab(tabId);
        break;
      case "delete":
        if (tabs.length > 1) {
          removeTab(tabId);
        }
        break;
    }
    setContextMenu(null);
  };

  // Close context menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    if (contextMenu) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [contextMenu]);

  return (
    <div className={`flex items-center tab-container ${className}`}>
      {/* Scroll Left Button */}
      <button
        onClick={() => scrollTabs("left")}
        disabled={!canScrollLeft}
        className="scroll-button flex items-center justify-center w-8 h-8 text-gray-700"
        title="Scroll left"
      >
        <ChevronLeft size={16} />
      </button>

      {/* Tabs Container */}
      <div
        ref={tabsRef}
        className="flex-1 flex overflow-x-auto tab-scrollable"
        onScroll={checkScroll}
      >
        <div className="flex min-w-max">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`group tab-item relative flex items-center px-3 py-2 min-w-0 max-w-40 cursor-pointer select-none border-r border-gray-200 ${
                tab.id === activeTabId
                  ? "active bg-white text-gray-900"
                  : "bg-gray-50 hover:bg-gray-100 text-gray-700"
              }`}
              onClick={(e) => handleTabClick(tab, e)}
              onDoubleClick={() => handleTabDoubleClick(tab)}
              onContextMenu={(e) => handleTabRightClick(tab, e)}
              title={tab.name}
            >
              {/* Tab Name or Edit Input */}
              {editingTab === tab.id ? (
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onBlur={handleRenameSubmit}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleRenameSubmit();
                    } else if (e.key === "Escape") {
                      handleRenameCancel();
                    }
                  }}
                  className="tab-input bg-white border border-blue-500 rounded px-1 py-0 text-sm w-full min-w-16 focus:outline-none"
                  autoFocus
                  onFocus={(e) => e.target.select()}
                />
              ) : (
                <>
                  <span className="truncate text-sm font-medium flex-1">
                    {tab.name}
                  </span>

                  {/* Dirty Indicator */}
                  {tab.isDirty && (
                    <div className="dirty-indicator w-1.5 h-1.5 bg-orange-400 rounded-full ml-2 flex-shrink-0" />
                  )}

                  {/* Close Button */}
                  {tabs.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTab(tab.id);
                      }}
                      className="tab-close-button ml-1 p-1 rounded hover:bg-gray-200 transition-colors flex-shrink-0"
                      title="Close tab"
                    >
                      <X size={12} />
                    </button>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Right Button */}
      <button
        onClick={() => scrollTabs("right")}
        disabled={!canScrollRight}
        className="scroll-button flex items-center justify-center w-8 h-8 text-gray-700"
        title="Scroll right"
      >
        <ChevronRight size={16} />
      </button>

      {/* Add Tab Button */}
      <button
        onClick={() => addTab()}
        className="scroll-button flex items-center justify-center w-8 h-8 text-gray-700 hover:text-blue-600 border-l border-gray-200"
        title="Add sheet"
      >
        <Plus size={16} />
      </button>

      {/* Tab Menu Button */}
      <button
        className="scroll-button flex items-center justify-center w-8 h-8 text-gray-700 hover:text-blue-600 border-l border-gray-200"
        title="Sheet options"
      >
        <MoreHorizontal size={16} />
      </button>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="context-menu fixed bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 min-w-32"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
          }}
        >
          <button
            onClick={() => handleContextMenuAction("rename", contextMenu.tabId)}
            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
          >
            Rename
          </button>
          <button
            onClick={() =>
              handleContextMenuAction("duplicate", contextMenu.tabId)
            }
            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
          >
            Duplicate
          </button>
          {tabs.length > 1 && (
            <>
              <hr className="my-1 border-gray-200" />
              <button
                onClick={() =>
                  handleContextMenuAction("delete", contextMenu.tabId)
                }
                className="w-full px-3 py-2 text-left text-sm hover:bg-red-50 text-red-600 transition-colors"
              >
                Delete
              </button>
            </>
          )}
        </div>
      )}

      {/* Tab count info */}
      <div className="px-3 py-2 text-xs text-gray-500 bg-gray-100 border-l border-gray-200 font-medium">
        {tabs.length} sheet{tabs.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
};

export default TabBar;
