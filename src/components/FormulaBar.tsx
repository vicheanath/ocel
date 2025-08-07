// components/FormulaBar.tsx
import React, { useState, useEffect, useRef } from "react";
import { FormulaEngine } from "../formulaEngine/FormulaEngine";
import FormulaSuggestions from "./FormulaSuggestions";
import { useFormulaSuggestions } from "../hooks/useFormulaSuggestions";

interface FormulaBarProps {
  value: string;
  onChange: (value: string) => void;
  formulaEngine: FormulaEngine;
  selectedCell: string;
  onFormulaEditingChange?: (isEditing: boolean) => void;
}

const FormulaBar: React.FC<FormulaBarProps> = ({
  value,
  onChange,
  formulaEngine,
  selectedCell,
  onFormulaEditingChange,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    suggestions,
    selectedIndex,
    showSuggestions,
    updateSuggestions,
    navigateUp,
    navigateDown,
    applySuggestion,
    hideSuggestions,
  } = useFormulaSuggestions(formulaEngine);

  // Sync with parent value
  useEffect(() => {
    setInputValue(value);
  }, [value, selectedCell]);

  // Handle formula typing
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    // Notify parent if we're entering/leaving formula editing mode
    const isFormula = val.startsWith("=");
    onFormulaEditingChange?.(isFormula);

    // Update suggestions
    updateSuggestions(val);
  };

  // Apply formula when Enter is pressed
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Navigate suggestions
    if (showSuggestions && suggestions.length > 0) {
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
        const newValue = applySuggestion(
          suggestions[selectedIndex].name,
          inputValue
        );
        setInputValue(newValue);
        hideSuggestions();
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.setSelectionRange(
              newValue.length,
              newValue.length
            );
            inputRef.current.focus();
          }
        }, 0);
        return;
      }

      if (e.key === "Escape") {
        e.preventDefault();
        hideSuggestions();
        return;
      }
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (showSuggestions && suggestions.length > 0) {
        const newValue = applySuggestion(
          suggestions[selectedIndex].name,
          inputValue
        );
        setInputValue(newValue);
        hideSuggestions();
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.setSelectionRange(
              newValue.length,
              newValue.length
            );
            inputRef.current.focus();
          }
        }, 0);
      } else {
        onChange(inputValue);
        hideSuggestions();
        onFormulaEditingChange?.(false); // Stop formula editing mode
        inputRef.current?.blur();
      }
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    const newValue = applySuggestion(suggestion, inputValue);
    setInputValue(newValue);
    hideSuggestions();
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.setSelectionRange(newValue.length, newValue.length);
        inputRef.current.focus();
      }
    }, 0);
  };

  const handleApply = () => {
    onChange(inputValue);
    hideSuggestions();
  };

  return (
    <div className="border-b border-gray-300 p-2 relative">
      <div className="flex items-center">
        <div className="mr-2 text-gray-600 font-medium">{selectedCell}:</div>
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              onFormulaEditingChange?.(false); // Stop formula editing mode when losing focus
              hideSuggestions();
            }}
            onFocus={() => {
              if (inputValue.startsWith("=")) {
                updateSuggestions(inputValue);
              }
            }}
          />

          {showSuggestions && (
            <FormulaSuggestions
              suggestions={suggestions}
              selectedIndex={selectedIndex}
              onSelect={handleSuggestionSelect}
            />
          )}
        </div>
        <button
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          onClick={handleApply}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default FormulaBar;
