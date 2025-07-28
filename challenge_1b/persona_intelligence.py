import fitz
import json
import os
import time
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def parse_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    sections = []
    for page_num, page in enumerate(doc, start=1):
        text = page.get_text().strip()
        if not text:
            continue  # skip blank pages
        sections.append({
            "document": os.path.basename(pdf_path),
            "page": page_num,
            "section_title": text.split('\n')[0],
            "content": text
        })
    return sections

def is_japanese(text):
    # Checks if the text contains any Japanese Hiragana/Katakana/Kanji
    for ch in text:
        if ('\u3040' <= ch <= '\u30ff') or ('\u4e00' <= ch <= '\u9faf'):
            return True
    return False

def choose_vectorizer(texts):
    # If any text is Japanese, use character-based analyzer
    if any(is_japanese(t) for t in texts):
        return TfidfVectorizer(analyzer='char', ngram_range=(2, 4))
    else:
        return TfidfVectorizer()

def rank_sections(sections, query):
    if not sections:
        print("No sections to rank!")
        return []
    texts = [s["content"] for s in sections]
    vectorizer = choose_vectorizer([query] + texts)
    try:
        vectors = vectorizer.fit_transform([query] + texts)
    except ValueError as ve:
        print("Vectorizer error:", ve)
        return []
    if vectors.shape[0] < 2:
        print("No valid sections to compare to the query!")
        return []
    sims = cosine_similarity(vectors[0:1], vectors[1:]).flatten()
    for i, score in enumerate(sims):
        sections[i]["importance_rank"] = float(score)
    return sorted(sections, key=lambda x: x["importance_rank"], reverse=True)

def main(input_dir, persona, job, output_dir):
    query = persona + " " + job
    all_sections = []
    for file in os.listdir(input_dir):
        if file.lower().endswith(".pdf"):
            file_sections = parse_pdf(os.path.join(input_dir, file))
            print(f"Parsed {len(file_sections)} sections from {file}")
            all_sections.extend(file_sections)
    if not all_sections:
        print("No sections found in any input PDFs. Exiting gracefully.")
        out_data = {
            "metadata": {
                "persona": persona,
                "job_to_be_done": job,
                "timestamp": time.ctime(),
                "error": "No sections found in input PDFs."
            },
            "sections": []
        }
        with open(os.path.join(output_dir, "persona_output.json"), "w", encoding="utf-8") as f:
            json.dump(out_data, f, indent=2, ensure_ascii=False)
        return

    ranked = rank_sections(all_sections, query)
    out_data = {
        "metadata": {
            "persona": persona,
            "job_to_be_done": job,
            "timestamp": time.ctime()
        },
        "sections": ranked[:10]  # top 10
    }
    with open(os.path.join(output_dir, "persona_output.json"), "w", encoding="utf-8") as f:
        json.dump(out_data, f, indent=2, ensure_ascii=False)
    print("Done! Output saved at:", os.path.join(output_dir, "persona_output.json"))

if __name__ == "__main__":
    persona = "PhD Researcher in Computational Biology"
    job = "Prepare literature review on GNNs"
    main("/app/input", persona, job, "/app/output")