import fitz, json, os, time
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def parse_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    sections = []
    for page_num, page in enumerate(doc, start=1):
        text = page.get_text()
        sections.append({"document": os.path.basename(pdf_path), 
                         "page": page_num, 
                         "section_title": text.split('\n')[0], 
                         "content": text})
    return sections

def rank_sections(sections, query):
    texts = [s["content"] for s in sections]
    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([query] + texts)
    sims = cosine_similarity(vectors[0:1], vectors[1:]).flatten()
    for i, score in enumerate(sims):
        sections[i]["importance_rank"] = float(score)
    return sorted(sections, key=lambda x: x["importance_rank"], reverse=True)

def main(input_dir, persona, job, output_dir):
    query = persona + " " + job
    all_sections = []
    for file in os.listdir(input_dir):
        if file.endswith(".pdf"):
            all_sections.extend(parse_pdf(os.path.join(input_dir, file)))
    ranked = rank_sections(all_sections, query)
    out_data = {
        "metadata": {
            "persona": persona,
            "job_to_be_done": job,
            "timestamp": time.ctime()
        },
        "sections": ranked[:10]  # top 10
    }
    with open(os.path.join(output_dir, "persona_output.json"), "w") as f:
        json.dump(out_data, f, indent=2)

if __name__ == "__main__":
    persona = "PhD Researcher in Computational Biology"
    job = "Prepare literature review on GNNs"
    main("/app/input", persona, job, "/app/output")
