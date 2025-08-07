import React from "react";
import { useParams, Link } from "react-router-dom";
import { useDocsContext } from "../context/DocsContext";

export const FunctionPage: React.FC = () => {
  const { functionName } = useParams<{ functionName: string }>();
  const { getFunctionByName, getCategoryByName } = useDocsContext();

  const func = functionName ? getFunctionByName(functionName) : null;
  const category = func
    ? getCategoryByName(func.category.toLowerCase().replace(/[^a-z0-9]+/g, "-"))
    : null;

  if (!func) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Function Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          The function "{functionName?.toUpperCase()}" could not be found.
        </p>
        <Link
          to="/docs"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-gray-500 mb-6">
        <Link to="/docs" className="hover:text-gray-700">
          Home
        </Link>
        <span className="mx-2">→</span>
        {category && (
          <>
            <Link
              to={`/docs/category/${category.name}`}
              className="hover:text-gray-700"
            >
              {category.displayName}
            </Link>
            <span className="mx-2">→</span>
          </>
        )}
        <span className="text-gray-900 font-mono">{func.name}</span>
      </nav>

      {/* Function Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-4xl font-mono font-bold text-gray-900">
            {func.name}
          </h1>
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded">
            {func.category}
          </span>
        </div>

        <p className="text-xl text-gray-600 mb-6">{func.description}</p>
      </div>

      {/* Syntax Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Syntax</h2>
        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
          <code className="text-lg font-mono">{func.syntax}</code>
        </div>
      </div>

      {/* Examples Section */}
      {func.examples.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Examples</h2>
          <div className="space-y-3">
            {func.examples.map((example, index) => (
              <div
                key={index}
                className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg"
              >
                <code className="text-green-800 font-mono text-lg">
                  {example}
                </code>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Usage Notes Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Usage Notes</h2>
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-blue-900 mb-2">Category</h3>
              <p className="text-blue-800">{func.category}</p>
            </div>
            <div>
              <h3 className="font-medium text-blue-900 mb-2">Source File</h3>
              <p className="text-blue-800 font-mono text-sm">
                {func.sourceFile}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Parameters Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Parameters</h2>
        <div className="bg-yellow-50 p-6 rounded-lg">
          <p className="text-yellow-800 mb-4">
            Parameter details are extracted from the function syntax. Refer to
            the examples above for usage patterns.
          </p>
          <div className="bg-yellow-100 p-4 rounded border-l-4 border-yellow-400">
            <p className="text-yellow-900 text-sm">
              <strong>Tip:</strong> Most functions follow Excel conventions.
              Check the examples for the exact parameter order and types
              expected.
            </p>
          </div>
        </div>
      </div>

      {/* Related Functions */}
      {category && category.functions.length > 1 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Related Functions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.functions
              .filter((f) => f.name !== func.name)
              .slice(0, 6)
              .map((relatedFunc) => (
                <Link
                  key={relatedFunc.name}
                  to={`/docs/function/${relatedFunc.name.toLowerCase()}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <h3 className="font-mono font-bold text-gray-900 mb-2">
                    {relatedFunc.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {relatedFunc.description.length > 80
                      ? `${relatedFunc.description.substring(0, 80)}...`
                      : relatedFunc.description}
                  </p>
                </Link>
              ))}
          </div>

          {category.functions.length > 7 && (
            <div className="mt-4 text-center">
              <Link
                to={`/docs/category/${category.name}`}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                View all {category.functions.length} functions in{" "}
                {category.displayName} →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex justify-between items-center pt-8 border-t border-gray-200">
        <Link
          to={category ? `/docs/category/${category.name}` : "/docs"}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          ← Back to {category ? category.displayName : "Home"}
        </Link>

        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};
