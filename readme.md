# 🚀 Adobe Hackathon Solution

A complete solution for the Adobe Hackathon, including:

- **Round 1A:** Outline extraction (`extractor.py`, Docker)
- **Round 1B:** Persona-based intelligence (`persona_intelligence.py`, Docker)
- **Round 2 Webapp:** Modern Vite + React + Tailwind frontend and Node.js backend

---

## 🗂 Folder Structure

adobe-solution/
│
├── round1a/
│   ├── extractor.py
│   ├── Dockerfile
│
├── round1b/
│   ├── persona_intelligence.py
│   ├── Dockerfile
│
├── round2-webapp/
│   ├── my-smart-pdf-reader/   # Vite + React + Tailwind frontend
│   ├── backend/               # Node.js backend server
│
└── README.md

---

## ⚡ Quick Start

### 1. **Build Round 1A Docker Image**

```bash
cd round1a
docker build -t round1a-solution:latest .
# To run:
# docker run --rm -v $(pwd)/input:/app/input -v $(pwd)/output:/app/output round1a-solution:latest

2. Build Round 1B Docker Image

cd ../round1b
docker build -t round1b-solution:latest .
# To run:
# docker run --rm -v $(pwd)/input:/app/input -v $(pwd)/output:/app/output round1b-solution:latest

3. Run the Web App (Frontend + Backend)

a. Start Backend

cd ../round2-webapp/backend
npm install
node index.js

	•	Runs on http://localhost:5050
	•	Make sure Docker Desktop is running (backend will call Docker for AI processing)

b. Build and Start Frontend

cd ../my-smart-pdf-reader
npm install
npm run dev

	•	Runs on http://localhost:5173

⸻

4. Configure Adobe PDF Embed API
	•	Get a free key here.
	•	Set Allowed Domain to localhost:5173.
	•	In my-smart-pdf-reader/index.html, add before </body>:

<script src="https://documentcloud.adobe.com/view-sdk/main.js"></script>




	Use your client ID in PDFViewerPage.jsx.

⸻

📝 Usage
	•	Visit the web app at / and go to Viewer.
	•	Upload a PDF. See preview (Adobe API) and backend AI output below.
	•	Backend will use the round1b-solution:latest Docker image to process and extract relevant info.

⸻

🛠️ Troubleshooting
	•	Backend processing failed:
	•	Check backend logs and ensure Docker images are built and Docker is running.
	•	No PDF preview:
	•	Double-check Adobe clientId and Allowed Domain.
	•	Output not generated:
	•	Make sure your AI scripts in Docker always write output, even if empty or on error.

⸻

🤝 Contributing

PRs and issues welcome! Fork, branch, and submit.

⸻

📄 License

MIT

⸻

🙌 Credits
	•	Adobe PDF Embed API
	•	Vite
	•	Tailwind CSS
	•	Express
	•	Docker
	•	Your AI code

⸻

Happy Hacking!