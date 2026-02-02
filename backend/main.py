import os
import shutil
import uuid
import json
import tempfile
from typing import List, Optional
from fastapi import FastAPI, Depends, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from services.ocr import extract_text_from_pdf
from services.ai import evaluate_resume

from pathlib import Path

BASE_DIR = Path(__file__).parent
# No more persistent data storage (resumes folder or DB)
JD_FILE = BASE_DIR / "data" / "job_description.txt"

# Ensure data dir exists for JD file (optional config)
data_dir = BASE_DIR / "data"
if not data_dir.exists():
    data_dir.mkdir(parents=True)


app = FastAPI(title="Skrut AI")

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Models (Pydantic / Non-DB) ---
class EvaluationResult(BaseModel):
    score: str
    candidate_name: str
    email: str
    analysis: str
    conversation_log: List[dict]


@app.head("/")
def health_check():
    return {"status": "ok"}


@app.get("/")
def read_root():
    return {"status": "ok", "mode": "privacy-focused"}


@app.get("/job-description")
def get_job_description():
    if not os.path.exists(JD_FILE):
        return {"content": ""}
    with open(JD_FILE, "r", encoding="utf-8") as f:
        return {"content": f.read()}


@app.post("/job-description")
def update_job_description(content: str):
    with open(JD_FILE, "w", encoding="utf-8") as f:
        f.write(content)
    return {"message": "Job description updated"}


# --- Core Endpoint: Upload -> Process -> Return (Stateless) ---


@app.post("/evaluate")
async def evaluate_resume_endpoint(file: UploadFile = File(...)):
    async def event_generator():
        # 1. Save to Temp File
        yield json.dumps(
            {"status": "progress", "message": f"Saving {file.filename}..."}
        ) + "\n"
        file_ext = os.path.splitext(file.filename)[1]
        tmp_path = ""

        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as tmp_file:
                shutil.copyfileobj(file.file, tmp_file)
                tmp_path = tmp_file.name

            # 2. Extract Text (OCR)
            yield json.dumps(
                {"status": "progress", "message": "Extracting text (OCR)..."}
            ) + "\n"
            resume_text = extract_text_from_pdf(tmp_path)

            if not resume_text or len(resume_text.strip()) == 0:
                yield json.dumps(
                    {
                        "status": "error",
                        "message": "Could not extract text. System supports DIGITAL PDFS only (no scans/images).",
                    }
                ) + "\n"
                return

            # 3. Get Job Description
            if not os.path.exists(JD_FILE):
                yield json.dumps(
                    {"status": "error", "message": "Job description not found."}
                ) + "\n"
                return

            with open(JD_FILE, "r", encoding="utf-8") as f:
                jd_text = f.read()

            # 4. AI Agent Analysis (Streaming Graph)
            yield json.dumps(
                {"status": "progress", "message": "AI Agents are thinking..."}
            ) + "\n"

            from services.ai import ResumeJudgeGraph

            judge_graph = ResumeJudgeGraph()
            graph_app = judge_graph.build_graph()

            initial_state = {
                "resume_text": resume_text,
                "job_description": jd_text,
                "reviewer_output": "",
                "feedback_history": [],
                "conversation_history": [],
                "retry_count": 0,
                "temp_status": "START",
                "status_message": "Starting Multi-Agent Analysis...",
            }

            # Run the graph and stream node updates
            final_state_data = {}
            async for output in graph_app.astream(initial_state):
                # output is a dict where keys are node names
                for node_name, state_update in output.items():
                    msg = state_update.get(
                        "status_message", f"{node_name.capitalize()} working..."
                    )
                    yield json.dumps({"status": "progress", "message": msg}) + "\n"
                    # Accumulate state updates to get the final version
                    final_state_data.update(state_update)

            # 5. Final Extraction & Result
            from services.ai import extract_score, extract_name, extract_email

            evaluation_text = final_state_data.get("reviewer_output", "")

            if not evaluation_text:
                yield json.dumps(
                    {
                        "status": "error",
                        "message": "Agents failed to produce evaluation.",
                    }
                ) + "\n"
                return

            result = {
                "status": "completed",
                "score": str(extract_score(evaluation_text)),
                "candidate_name": extract_name(evaluation_text),
                "email": extract_email(evaluation_text),
                "analysis": evaluation_text,
                "conversation_log": final_state_data.get("conversation_history", []),
            }
            yield json.dumps(result) + "\n"

        except Exception as e:
            print(f"Error: {e}")
            yield json.dumps({"status": "error", "message": str(e)}) + "\n"
        finally:
            if tmp_path and os.path.exists(tmp_path):
                os.remove(tmp_path)

    from fastapi.responses import StreamingResponse

    return StreamingResponse(event_generator(), media_type="application/x-ndjson")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
