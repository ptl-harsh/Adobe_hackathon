import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import PDFViewerPage from "./PDFViewerPage";

export default function App() {
  return (
    <Router>
      <nav className="flex items-center gap-6 px-8 py-5 bg-white shadow-sm">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-blue-600">
          Smart PDF Reader
        </Link>
        <Link to="/viewer" className="ml-auto font-semibold text-blue-700 hover:underline">Viewer</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/viewer" element={<PDFViewerPage />} />
      </Routes>
    </Router>
  );
}