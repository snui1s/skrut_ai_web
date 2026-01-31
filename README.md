# Skrut AI

**An intelligent resume evaluation assistant for human resources.**

Skrut AI is a tool designed to help recruiters evaluate resumes more effectively. It goes beyond simple keyword matching by using a two-agent AI system that looks for transferable skills and candidate potential.

## Key Features

- **Two-Agent System:** The application uses two different AI personas. A "Reviewer" performs the initial analysis, and an "Auditor" checks that analysis for fairness and accuracy. This ensures a balanced evaluation.
- **Fair Evaluation Approach:** The system is designed to identify related skills. For example, if a job requires one specific tool but a candidate has experience with a similar one, the AI recognizes that experience rather than giving a zero score.
- **Data Privacy:** To protect candidate privacy, the application is stateless. Resumes are processed in temporary memory and are deleted immediately after the analysis is complete. No candidate data is stored in a database.
- **Automated Document Reading:** The tool can read standard PDF files as well as scanned images using Optical Character Recognition (OCR).
- **Transparent Process:** Users can view the discussion log between the AI agents to understand how a specific score or recommendation was reached.

## Tech Stack

### Backend

- **Framework:** FastAPI
- **AI Logic:** LangChain and LangGraph
- **Models:** OpenAI
- **Document Processing:** PyMuPDF and EasyOCR

### Frontend

- **Framework:** Next.js
- **Styling:** Tailwind CSS
- **Language:** TypeScript

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.0 or higher)
- [uv](https://docs.astral.sh/uv/) (Python package manager)
- Python (v3.12 or higher)
- OpenAI API Key

### 1. Backend Setup

Go to the `backend` directory:

```bash
cd backend
```

Install the required Python packages:

```bash
uv sync
```

Create a `.env` file in the `backend` folder and add your OpenAI API key:

```env
OPENAI_API_KEY=your_api_key_here
```

Start the backend server:

```bash
uv run main.py
```

### 2. Frontend Setup

Go to the `frontend` directory:

```bash
cd frontend
```

Install the dependencies:

```bash
bun install
```

Start the web application:

```bash
bun run dev
```

## How the Analysis Works

1.  **Text Extraction:** The system reads the uploaded resume. If the file is an image or a scan, it uses OCR to find the text.
2.  **Initial Review:** An AI agent compares the resume to the job description and provides a score and a summary.
3.  **Quality Check:** A second AI agent reviews the first agent's work. It looks for missed opportunities or unfair judgments.
4.  **Refinement:** If the second agent finds issues, the first agent updates the analysis. This happens up to three times to ensure the best result.
5.  **Final Report:** The final evaluation is shown to the user in a clear table.

## License

This project is licensed under the [Apache License 2.0](LICENSE).
