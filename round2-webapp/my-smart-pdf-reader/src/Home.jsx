import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center mt-32 gap-6">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-xl text-center border border-blue-100">
        <h2 className="text-3xl font-bold text-blue-700 mb-3">Welcome to Smart PDF Reader</h2>
        <p className="mb-4 text-gray-600">
          Upload your PDF files and let AI extract outlines, headings, and the most relevant content based on your needs.
        </p>
        <button
          className="bg-gradient-to-r from-blue-500 to-pink-500 text-white px-6 py-3 rounded-xl text-lg font-semibold shadow hover:scale-105 duration-150 flex items-center gap-2 mx-auto"
          onClick={() => navigate("/viewer")}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}