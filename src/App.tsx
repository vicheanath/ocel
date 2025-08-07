import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Spreadsheet from "./components/Spreadsheet";
import DocsApp from "./docs/DocsApp";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/docs/*" element={<DocsApp />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900">📊 React Sheet</h1>
            <Link
              to="/docs"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              📚 View Documentation
            </Link>
          </div>
        </div>
      </nav>
      <div className="p-8">
        <Spreadsheet />
      </div>
    </div>
  );
}

export default App;
