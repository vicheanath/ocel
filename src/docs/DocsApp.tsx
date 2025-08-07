import React from "react";
import { Routes, Route } from "react-router-dom";
import {
  DocsLayout,
  CategoryPage,
  FunctionPage,
  HomePage,
  SearchPage,
} from "./components";
import { DocsProvider } from "./context";

const DocsApp: React.FC = () => {
  return (
    <DocsProvider>
      <DocsLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/function/:functionName" element={<FunctionPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </DocsLayout>
    </DocsProvider>
  );
};

export default DocsApp;
