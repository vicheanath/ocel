import React, { createContext, useContext, useState, useEffect } from "react";
import type { DocsData, CategoryDoc, FunctionDoc } from "../types";
import { loadDocsFromPublicMarkdown } from "../utils/markdownLoader";

interface DocsContextType {
  docsData: DocsData | null;
  loading: boolean;
  error: string | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchResults: FunctionDoc[];
  getFunctionByName: (name: string) => FunctionDoc | undefined;
  getCategoryByName: (name: string) => CategoryDoc | undefined;
}

const DocsContext = createContext<DocsContextType | undefined>(undefined);

export const useDocsContext = () => {
  const context = useContext(DocsContext);
  if (!context) {
    throw new Error("useDocsContext must be used within a DocsProvider");
  }
  return context;
};

export const DocsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [docsData, setDocsData] = useState<DocsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<FunctionDoc[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await loadDocsFromPublicMarkdown();
        setDocsData(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load documentation from markdown:", error);
        setError("Failed to load documentation data");
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!docsData || !searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const term = searchTerm.toLowerCase();
    const results: FunctionDoc[] = [];

    docsData.categories.forEach((category) => {
      category.functions.forEach((func) => {
        if (
          func.name.toLowerCase().includes(term) ||
          func.description.toLowerCase().includes(term) ||
          func.syntax.toLowerCase().includes(term) ||
          func.examples.some((example) => example.toLowerCase().includes(term))
        ) {
          results.push(func);
        }
      });
    });

    setSearchResults(results.sort((a, b) => a.name.localeCompare(b.name)));
  }, [searchTerm, docsData]);

  const getFunctionByName = (name: string): FunctionDoc | undefined => {
    if (!docsData) return undefined;

    for (const category of docsData.categories) {
      const func = category.functions.find(
        (f) => f.name.toLowerCase() === name.toLowerCase()
      );
      if (func) return func;
    }
    return undefined;
  };

  const getCategoryByName = (name: string): CategoryDoc | undefined => {
    if (!docsData) return undefined;
    return docsData.categories.find((cat) => cat.name === name);
  };

  return (
    <DocsContext.Provider
      value={{
        docsData,
        loading,
        error,
        searchTerm,
        setSearchTerm,
        searchResults,
        getFunctionByName,
        getCategoryByName,
      }}
    >
      {children}
    </DocsContext.Provider>
  );
};
