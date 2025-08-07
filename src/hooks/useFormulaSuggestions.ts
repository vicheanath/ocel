// hooks/useFormulaSuggestions.ts
import { useState, useCallback } from "react";
import { FormulaEngine } from "../formulaEngine/FormulaEngine";

export interface FormulaSuggestion {
  name: string;
  syntax: string;
  description: string;
}

export interface UseFormulaSuggestionsReturn {
  suggestions: FormulaSuggestion[];
  selectedIndex: number;
  showSuggestions: boolean;
  updateSuggestions: (value: string) => void;
  navigateUp: () => void;
  navigateDown: () => void;
  applySuggestion: (suggestion: string, currentValue: string) => string;
  hideSuggestions: () => void;
  setSelectedIndex: (index: number) => void;
}

export const useFormulaSuggestions = (
  formulaEngine: FormulaEngine
): UseFormulaSuggestionsReturn => {
  const [suggestions, setSuggestions] = useState<FormulaSuggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const updateSuggestions = useCallback(
    (value: string) => {
      // Only show suggestions for formulas
      if (!value.startsWith("=")) {
        setShowSuggestions(false);
        return;
      }

      const formula = value.substring(1);
      // Find the last word being typed (function name)
      const lastToken = formula.match(/([A-Z][A-Z0-9]*)$/i)?.[0] || "";

      if (lastToken.length > 0) {
        const allFunctions = Array.from(formulaEngine.getAllFunctions().keys());
        const filtered = allFunctions
          .filter((fn) => fn.toLowerCase().startsWith(lastToken.toLowerCase()))
          .map((fn) => {
            const metadata = formulaEngine.getFunctionMetadata(fn);
            return {
              name: fn,
              syntax: metadata?.syntax || `${fn}()`,
              description: metadata?.description || `${fn} function`,
            };
          });

        setSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
        setSelectedIndex(0);
      } else {
        setShowSuggestions(false);
      }
    },
    [formulaEngine]
  );

  const navigateUp = useCallback(() => {
    setSelectedIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const navigateDown = useCallback(() => {
    setSelectedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
  }, [suggestions.length]);

  const applySuggestion = useCallback(
    (suggestion: string, currentValue: string): string => {
      const formula = currentValue.substring(1); // Remove =
      // Find the last word being typed and replace it
      const lastTokenMatch = formula.match(/([A-Z][A-Z0-9]*)$/i);

      if (lastTokenMatch) {
        const lastToken = lastTokenMatch[0];
        const beforeLastToken = formula.substring(
          0,
          formula.length - lastToken.length
        );
        return `=${beforeLastToken}${suggestion}(`;
      } else {
        // If no match, just append the suggestion
        return `=${formula}${suggestion}(`;
      }
    },
    []
  );

  const hideSuggestions = useCallback(() => {
    setShowSuggestions(false);
  }, []);

  return {
    suggestions,
    selectedIndex,
    showSuggestions,
    updateSuggestions,
    navigateUp,
    navigateDown,
    applySuggestion,
    hideSuggestions,
    setSelectedIndex,
  };
};
