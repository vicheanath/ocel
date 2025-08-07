// components/FormulaSuggestions.tsx
import React from "react";
import type { FormulaSuggestion } from "../hooks/useFormulaSuggestions";

interface FormulaSuggestionsProps {
  suggestions: FormulaSuggestion[];
  selectedIndex: number;
  onSelect: (suggestion: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

const FormulaSuggestions: React.FC<FormulaSuggestionsProps> = ({
  suggestions,
  selectedIndex,
  onSelect,
  className = "absolute left-0 right-0 top-full mt-1",
  style,
}) => {
  if (suggestions.length === 0) return null;

  return (
    <div
      className={`${className} bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto`}
      style={style}
      onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
    >
      {suggestions.map((suggestion, index) => (
        <div
          key={suggestion.name}
          className={`p-2 cursor-pointer hover:bg-blue-50 ${
            index === selectedIndex ? "bg-blue-100" : ""
          }`}
          onClick={() => onSelect(suggestion.name)}
          onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
        >
          <div className="flex justify-between">
            <span className="font-mono text-blue-600">{suggestion.name}</span>
            {suggestion.syntax && (
              <span className="text-sm text-gray-500">{suggestion.syntax}</span>
            )}
          </div>
          {suggestion.description && (
            <div className="text-sm text-gray-600 mt-1">
              {suggestion.description}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FormulaSuggestions;
