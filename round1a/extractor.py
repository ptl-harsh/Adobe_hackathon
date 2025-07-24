import fitz
import json
import os

def extract_outline(pdf_path):
    doc = fitz.open(pdf_path)
    title = ""
    headings = []

    for page_num, page in enumerate(doc, start=1):
        blocks = page.get_text("dict")["blocks"]
        for b in blocks:
            if "lines" in b:
                for l in b["lines"]:
                    for s in l["spans"]:
                        text = s["text"].strip()
                        if not text:
                            continue
                        font_size = s["size"]
                        # Detect title (first big text on page 1)
                        if page_num == 1 and not title:
                            title = text
                        # Determine heading level by font size
                        if font_size >= 16:
                            level = "H1"
                        elif font_size >= 14:
                            level = "H2"
                        elif font_size >= 12:
                            level = "H3"
                        else:
                            continue
                        headings.append({"level": level, "text": text, "page": page_num})

    return {"title": title, "outline": headings}

def process_all_pdfs(input_dir, output_dir):
    for file in os.listdir(input_dir):
        if file.endswith(".pdf"):
            pdf_path = os.path.join(input_dir, file)
            data = extract_outline(pdf_path)
            out_file = os.path.join(output_dir, file.replace(".pdf", ".json"))
            with open(out_file, "w") as f:
                json.dump(data, f, indent=2)

if __name__ == "__main__":
    input_dir = "/app/input"
    output_dir = "/app/output"
    os.makedirs(output_dir, exist_ok=True)
    process_all_pdfs(input_dir, output_dir)
