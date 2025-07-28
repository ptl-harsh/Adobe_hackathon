# Challenge 1a - PDF Outline Extraction

This project extracts the **title** and **headings** from PDF files based on font size and outputs the result as structured JSON files.

---

## **Folder Structure**

Challenge_1a/
├── input/               # Folder for input PDF files (to be mounted)
├── output/              # Folder where JSON outputs will be generated (to be mounted)
├── process_pdfs.py      # PDF processing script
├── Dockerfile           # Docker configuration
└── README.md            # Project instructions


---

## **How It Works**
- Reads all PDFs from the `/app/input` folder inside the container.
- Extracts:
  - **Document Title** → first text block from page 1 with the largest font size
  - **Headings** → based on font size thresholds:
    - `>= 16` → `H1`
    - `>= 14` → `H2`
    - `>= 12` → `H3`
- Writes extracted data into `/app/output` as JSON.

---

## **Usage**

### **1. Navigate to project**
```bash
cd challenge_1a

2. Build Docker image

docker build -t challenge_1a-solution:latest .

3. Run container

Mount your local folders so data persists:

docker run --rm \
  -v $(pwd)/input:/app/input \
  -v $(pwd)/output:/app/output \
  challenge_1a-solution:latest


  	•	Place your PDF files inside the input/ folder before running.
	•	JSON output files will be available in the output/ folder after processing.


# Add PDFs to input folder
cp myfile.pdf input/

# Run processing
docker run --rm \
  -v $(pwd)/input:/app/input \
  -v $(pwd)/output:/app/output \
  challenge_1a-solution:latest

# Check results
cat output/myfile.json



Dependencies
	•	Python 3.9
	•	PyMuPDF (fitz)
