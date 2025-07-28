# Challenge 1b - PDF Section Ranking by Persona & Job

This project processes PDFs to:
1. Extract all textual sections from each page.
2. Rank the sections based on relevance to a given **persona** and **job to be done**.
3. Output the top-ranked sections as JSON.

---

## **Folder Structure**

```
Challenge_1b/
├── input/                    # Folder for input PDFs (to be mounted)
├── output/                   # Folder where JSON outputs will be generated (to be mounted)
├── process_pdfs.py           # PDF processing & ranking script
├── Dockerfile                # Docker configuration
└── README.md                 # Project instructions
```

---

## **How It Works**
- Reads PDF files from `/app/input` (container path).
- Extracts text from each page using [PyMuPDF (fitz)](https://pymupdf.readthedocs.io/).
- Uses **TF-IDF + cosine similarity** to compute section importance.
- Handles Japanese text separately (uses character n-grams).
- Saves the top 10 ranked sections as JSON to `/app/output/persona_output.json`.

---

## **Input Parameters (Inside Script)**
The default persona and job are defined in `process_pdfs.py`:
```python
persona = "PhD Researcher in Computational Biology"
job = "Prepare literature review on GNNs"
```


Usage

1. Navigate to Project
```
cd challenge_1b
```

2. Build Docker Image

```
docker build -t challenge_1b-solution:latest .

```

3. Run Container

Mount local folders so inputs & outputs are persistent:

For MACOS

```
docker run --rm \
  -v $(pwd)/input:/app/input \
  -v $(pwd)/output:/app/output \
  challenge_1b-solution:latest
```

For Windows

```
docker run --rm -v "${pwd}\input:/app/input" -v "${pwd}\output:/app/output" challenge_1a-solution:latest     
```

•	Place your PDF files inside the input/ folder before running.
•	Output JSON will be saved as output/persona_output.json.

   # Copy your PDFs into input folder
cp sample.pdf input/

# Run processing
docker run --rm \
  -v $(pwd)/input:/app/input \
  -v $(pwd)/output:/app/output \
  challenge_1b-solution:latest

# View results
cat output/persona_output.json



Dependencies
	•	Python 3.9
	•	PyMuPDF (fitz)
	•	scikit-learn
	•	numpy
