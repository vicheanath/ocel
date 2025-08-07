import React from "react";
import { useParams, Link } from "react-router-dom";
import { useDocsContext } from "../context/DocsContext";

export const CategoryPage: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const { getCategoryByName } = useDocsContext();

  const category = categoryName ? getCategoryByName(categoryName) : null;

  if (!category) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Category Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          The category "{categoryName}" could not be found.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  const sortedFunctions = [...category.functions].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <nav className="flex items-center text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:text-gray-700">
            Home
          </Link>
          <span className="mx-2">→</span>
          <span className="text-gray-900">{category.displayName}</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {category.displayName} Functions
        </h1>

        <p className="text-lg text-gray-600 mb-4">{category.description}</p>

        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>{category.functions.length} functions in this category</span>
        </div>
      </div>

      {/* Function List */}
      <div className="space-y-4">
        {sortedFunctions.map((func) => (
          <div
            key={func.name}
            className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="flex justify-between items-start mb-3">
              <Link
                to={`/function/${func.name.toLowerCase()}`}
                className="text-xl font-mono font-bold text-gray-900 hover:text-blue-600"
              >
                {func.name}
              </Link>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {func.category}
              </span>
            </div>

            <p className="text-gray-600 mb-4">{func.description}</p>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Syntax:
              </h4>
              <code className="bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm block">
                {func.syntax}
              </code>
            </div>

            {func.examples.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Examples:
                </h4>
                <div className="space-y-1">
                  {func.examples.slice(0, 2).map((example, index) => (
                    <code
                      key={index}
                      className="bg-green-50 text-green-700 px-3 py-1 rounded text-sm block"
                    >
                      {example}
                    </code>
                  ))}
                  {func.examples.length > 2 && (
                    <Link
                      to={`/docs/function/${func.name.toLowerCase()}`}
                      className="text-blue-600 text-sm hover:text-blue-700"
                    >
                      +{func.examples.length - 2} more examples →
                    </Link>
                  )}
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
              <span className="text-xs text-gray-400">
                Source: {func.sourceFile}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Category Stats */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Category Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {category.functions.length}
            </div>
            <div className="text-sm text-gray-600">Total Functions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {category.functions.reduce(
                (sum, func) => sum + func.examples.length,
                0
              )}
            </div>
            <div className="text-sm text-gray-600">Total Examples</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(
                category.functions.reduce(
                  (sum, func) => sum + func.examples.length,
                  0
                ) / category.functions.length
              )}
            </div>
            <div className="text-sm text-gray-600">
              Avg Examples per Function
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
