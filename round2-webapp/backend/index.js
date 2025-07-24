const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

// Storage for file uploads
const upload = multer({ dest: "uploads/" });
const app = express();

app.use(cors());
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// File upload + AI process route
app.post("/process", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  // --- Rename uploaded file to have its original filename (including .pdf extension) ---
  const uploadDir = path.resolve("uploads");
  const originalName = req.file.originalname;
  const ext = path.extname(originalName);
  const safeName = originalName.replace(/[^a-zA-Z0-9_\-\.]/g, "_"); // sanitize filename
  const newFilePath = path.join(uploadDir, safeName);

  try {
    fs.renameSync(req.file.path, newFilePath);
    console.log("Uploaded file saved as:", newFilePath);
  } catch (err) {
    console.error("File rename error:", err);
    return res.status(500).send("Server error renaming file.");
  }

  // --- Run Docker for AI PDF processing ---
  const dockerCommand = `docker run --rm -v ${uploadDir}:/app/input -v ${process.cwd()}/output:/app/output round1b-solution:latest`;
  console.log("Running Docker:", dockerCommand);

  exec(dockerCommand, (err, stdout, stderr) => {
    if (err) {
      console.error("Docker error:", err, stderr);
      return res.status(500).send("Error processing file");
    }
    console.log("Docker stdout:", stdout);

    // --- Read AI output (adjust output path if needed) ---
    const outputPath = path.resolve("output/persona_output.json");
    if (fs.existsSync(outputPath)) {
      const outputData = JSON.parse(fs.readFileSync(outputPath, "utf8"));
      res.json(outputData);
    } else {
      console.error("Output not generated at:", outputPath);
      res.status(500).send("AI Output not generated");
    }
  });
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log("Backend running on port", PORT);
});