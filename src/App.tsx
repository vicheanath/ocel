import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SpreadsheetWithUndoRedo from "./components/SpreadsheetWithUndoRedo";
import UndoRedoExample from "./components/UndoRedoExample";
import DocsApp from "./docs/DocsApp";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/docs/*" element={<DocsApp />} />
        <Route path="/undo-demo" element={<UndoRedoExample />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SpreadsheetWithUndoRedo />
    </div>
  );
}

export default App;
