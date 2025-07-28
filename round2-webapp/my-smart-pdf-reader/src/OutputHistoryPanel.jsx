// src/OutputHistoryPanel.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

function OutputHistoryPanel() {
  const [outputFiles, setOutputFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [outputData, setOutputData] = useState("");

  // Function to fetch list of JSON output files
  const refreshFiles = () => {
  // Add a random query so browser/axios will NOT cache the result
  axios.get(`http://localhost:5050/outputs?nocache=${Date.now()}`)
    .then(res => setOutputFiles(res.data))
    .catch(() => setOutputFiles([]));
};

  // On mount, fetch files
  useEffect(() => {
    refreshFiles();
  }, []);

  // Fetch content of selected output file
  useEffect(() => {
    if (!selectedFile) return;
    axios.get(`http://localhost:5050/output/${selectedFile}`)
      .then(res => setOutputData(JSON.stringify(res.data, null, 2)))
      .catch(() => setOutputData("Error loading file"));
  }, [selectedFile]);

  // Download selected file
  const handleDownload = (fname) => {
    axios.get(`http://localhost:5050/output/${fname}`, { responseType: "blob" })
      .then(res => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const a = document.createElement("a");
        a.href = url;
        a.download = fname;
        a.click();
        window.URL.revokeObjectURL(url);
      });
  };

  return (
    <div className="mt-12">
      <div className="flex items-center mb-2 gap-3">
        <h3 className="text-lg font-bold text-blue-700">History: All AI Output JSONs</h3>
        <button
          className="px-3 py-1 rounded bg-blue-500 hover:bg-blue-700 text-white text-xs font-bold"
          onClick={refreshFiles}
          title="Refresh output files"
        >⟳ Refresh</button>
      </div>
      <div className="flex flex-wrap gap-2 mb-2">
        {outputFiles.map(fname => (
          <div key={fname} className="flex items-center gap-1">
            <button
              className={`px-3 py-1 rounded border font-mono text-xs ${
                selectedFile === fname
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-700 border-blue-400 hover:bg-blue-50"
              }`}
              onClick={() => setSelectedFile(fname)}
              title={fname === "persona_output.json" ? "Persona Output" : fname}
            >
              {fname === "persona_output.json" ? "persona_output.json ⭐" : fname}
            </button>
            <button
              onClick={() => handleDownload(fname)}
              className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1 rounded"
              title={`Download ${fname}`}
            >
              ⬇
            </button>
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="bg-gray-900 text-green-200 rounded-xl shadow p-4 font-mono text-xs mt-4 overflow-x-auto">
          <div className="mb-2 text-blue-200 font-bold">{selectedFile}</div>
          <pre className="whitespace-pre-wrap">{outputData}</pre>
        </div>
      )}
    </div>
  );
}

export default OutputHistoryPanel;