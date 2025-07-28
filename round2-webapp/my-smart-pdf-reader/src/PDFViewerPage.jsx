import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function PDFViewerPage() {
  const [file, setFile] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState("/adobe_problem.pdf");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!window.AdobeDC) return;
    document.getElementById("adobe-dc-view").innerHTML = "";
    const adobeDCView = new window.AdobeDC.View({
      clientId: "34a2f22bb83b44b09939e4a3fd406fbc", // Replace with your real key
      divId: "adobe-dc-view",
    });
    adobeDCView.previewFile(
      {
        content: { location: { url: uploadedUrl } },
        metaData: { fileName: "Document.pdf" },
      },
      { embedMode: "SIZED_CONTAINER" }
    );
  }, [uploadedUrl]);

  const handleUpload = async () => {
    if (!file) return alert("Choose a PDF first!");
    setLoading(true);

    // Preview the file
    const reader = new FileReader();
    reader.onload = () => {
      const blob = new Blob([reader.result], { type: file.type });
      const url = URL.createObjectURL(blob);
      setUploadedUrl(url);
    };
    reader.readAsArrayBuffer(file);

    // Send to backend for AI processing
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:5050/process", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
    } catch (err) {
      setResult(null);
      alert("Backend processing failed!");
    }
    setLoading(false);
  };

  return (
    <div className="px-2 md:px-20 py-6">
      <div className="flex items-center gap-2 mb-6">
        <Link to="/" className="text-blue-600 font-bold hover:underline">&larr; Home</Link>
        <span className="mx-2 text-gray-400">|</span>
        <span className="text-xl font-semibold text-gray-800">PDF AI Viewer</span>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2 flex flex-col gap-3">
          <label className="font-semibold text-gray-700 mb-1">Choose a PDF File:</label>
          <input
            type="file"
            accept=".pdf"
            ref={inputRef}
            className="p-2 border border-blue-200 rounded"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button
            onClick={handleUpload}
            disabled={loading}
            className={`mt-2 flex items-center gap-2 px-5 py-2 rounded-lg font-medium text-white shadow ${
              loading ? "bg-gray-400" : "bg-gradient-to-r from-pink-500 to-blue-500 hover:scale-105 duration-150"
            }`}
          >
            {loading ? "Processing..." : "Upload & Analyze"}
          </button>
          {result && (
            <div className="mt-6 bg-white p-4 rounded-xl shadow border border-blue-50">
              <h3 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
                AI Analysis
              </h3>
              <pre className="whitespace-pre-wrap text-gray-700 text-xs mt-2">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
        <div className="w-full md:w-1/2">
          <div id="adobe-dc-view" className="rounded-xl shadow border border-blue-100" style={{ height: "80vh" }}></div>
        </div>
      </div>
    </div>
  );
}

export default PDFViewerPage;