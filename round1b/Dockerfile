FROM --platform=linux/amd64 python:3.9-slim
WORKDIR /app
COPY . .
RUN pip install --no-cache-dir pymupdf scikit-learn
CMD ["python", "persona_intelligence.py"]
