import React, { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDocsContext } from "../context/DocsContext";

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchTerm, setSearchTerm, searchResults, docsData } =
    useDocsContext();

  const query = searchParams.get("q") || "";

  useEffect(() => {
    if (query && query !== searchTerm) {
      setSearchTerm(query);
    }
  }, [query, searchTerm, setSearchTerm]);

  const handleSearch = (newTerm: string) => {
    setSearchTerm(newTerm);
    if (newTerm.trim()) {
      setSearchParams({ q: newTerm });
    } else {
      setSearchParams({});
    }
  };

  const highlightMatch = (text: string, term: string) => {
    if (!term.trim()) return text;

    const regex = new RegExp(
      `(${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark
          key={index}
          className="bg-yellow-200 text-yellow-900 px-1 rounded"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="p-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Search Functions
        </h1>

        <div className="max-w-2xl">
          <div className="relative">
            <input
              type="text"
              placeholder="Search functions by name, description, or examples..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
              <svg
                className="h-6 w-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Search Stats */}
        {searchTerm && (
          <div className="mt-4 text-sm text-gray-600">
            {searchResults.length === 0 ? (
              <span>No results found for "{searchTerm}"</span>
            ) : (
              <span>
                Found {searchResults.length} function
                {searchResults.length !== 1 ? "s" : ""} matching "{searchTerm}"
              </span>
            )}
          </div>
        )}
      </div>

      {/* Search Results */}
      {searchTerm && searchResults.length > 0 && (
        <div className="space-y-6">
          {searchResults.map((func) => (
            <div
              key={`${func.name}-${func.sourceFile}`}
              className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <Link
                  to={`/docs/function/${func.name.toLowerCase()}`}
                  className="text-xl font-mono font-bold text-gray-900 hover:text-blue-600"
                >
                  {highlightMatch(func.name, searchTerm)}
                </Link>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {func.category}
                </span>
              </div>

              <p className="text-gray-600 mb-4">
                {highlightMatch(func.description, searchTerm)}
              </p>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Syntax:
                </h4>
                <code className="bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm block">
                  {highlightMatch(func.syntax, searchTerm)}
                </code>
              </div>

              {func.examples.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Examples:
                  </h4>
                  <div className="space-y-1">
                    {func.examples
                      .filter((example) =>
                        example.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .slice(0, 2)
                      .map((example, index) => (
                        <code
                          key={index}
                          className="bg-green-50 text-green-700 px-3 py-1 rounded text-sm block"
                        >
                          {highlightMatch(example, searchTerm)}
                        </code>
                      ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center">
                <Link
                  to={`/docs/function/${func.name.toLowerCase()}`}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View detailed documentation →
                </Link>
                <span className="text-xs text-gray-400">{func.sourceFile}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {searchTerm && searchResults.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No functions found for "{searchTerm}"
          </h3>
          <p className="text-gray-600 mb-6">
            Try searching for function names, categories, or keywords like
            "sum", "date", or "text".
          </p>

          <div className="max-w-md mx-auto">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Popular searches:
            </h4>
            <div className="flex flex-wrap gap-2 justify-center">
              {["SUM", "AVERAGE", "IF", "DATE", "TEXT", "COUNT"].map((term) => (
                <button
                  key={term}
                  onClick={() => handleSearch(term)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!searchTerm && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Search {docsData?.totalFunctions} Functions
          </h3>
          <p className="text-gray-600 mb-8">
            Find any function by name, description, syntax, or examples. Start
            typing above to see results.
          </p>

          {/* Quick Categories */}
          <div className="max-w-2xl mx-auto">
            <h4 className="text-sm font-medium text-gray-900 mb-4">
              Or browse by category:
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {docsData?.categories.slice(0, 6).map((category) => (
                <Link
                  key={category.name}
                  to={`/docs/category/${category.name}`}
                  className="p-3 border border-gray-200 rounded-lg text-center hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="font-medium text-gray-900 text-sm">
                    {category.displayName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {category.functions.length} functions
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
