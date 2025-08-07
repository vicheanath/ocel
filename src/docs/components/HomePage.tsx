import React from "react";
import { Link } from "react-router-dom";
import { useDocsContext } from "../context/DocsContext";

export const HomePage: React.FC = () => {
  const { docsData } = useDocsContext();

  if (!docsData) return null;

  const topCategories = [...docsData.categories]
    .sort((a, b) => b.functions.length - a.functions.length)
    .slice(0, 6);

  const recentlyUpdated = new Date(docsData.lastUpdated).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return (
    <div className="p-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          📊 React Sheet Function Reference
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Complete documentation for all {docsData.totalFunctions} spreadsheet
          functions
        </p>
        <div className="flex justify-center items-center gap-6 text-sm text-gray-500">
          <span>Last updated: {recentlyUpdated}</span>
          <span>•</span>
          <span>{docsData.categories.length} categories</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-blue-50 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {docsData.totalFunctions}
          </div>
          <div className="text-blue-800 font-medium">Total Functions</div>
        </div>
        <div className="bg-green-50 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {docsData.categories.length}
          </div>
          <div className="text-green-800 font-medium">Categories</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {Math.max(...docsData.categories.map((c) => c.functions.length))}
          </div>
          <div className="text-purple-800 font-medium">Largest Category</div>
        </div>
      </div>

      {/* Popular Categories */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Popular Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topCategories.map((category) => (
            <Link
              key={category.name}
              to={`/docs/category/${category.name}`}
              className="block bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-medium text-gray-900">
                  {category.displayName}
                </h3>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                  {category.functions.length}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                {category.description}
              </p>
              <div className="text-blue-600 text-sm font-medium">
                View functions →
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Popular Functions */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Featured Functions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {docsData.categories
            .flatMap((cat) => cat.functions)
            .filter((func) =>
              ["SUM", "AVERAGE", "IF", "VLOOKUP", "COUNT", "MAX"].includes(
                func.name
              )
            )
            .slice(0, 6)
            .map((func) => (
              <Link
                key={func.name}
                to={`/docs/function/${func.name.toLowerCase()}`}
                className="block border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-mono font-bold text-gray-900">
                    {func.name}
                  </h3>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {func.category}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">{func.description}</p>
                <code className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {func.syntax}
                </code>
              </Link>
            ))}
        </div>
      </div>

      {/* Getting Started */}
      <div className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Getting Started
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Browse by Category
            </h3>
            <p className="text-gray-600 mb-4">
              Explore functions organized by their purpose and functionality.
              Each category contains detailed documentation with syntax and
              examples.
            </p>
            <Link
              to="/docs/category/math-trigonometry"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              Start with Math Functions →
            </Link>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Search Functions
            </h3>
            <p className="text-gray-600 mb-4">
              Use the search bar at the top to quickly find specific functions
              by name, description, or even by keywords in examples.
            </p>
            <div className="text-gray-500 font-medium">
              Try searching for "SUM" or "date"
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
