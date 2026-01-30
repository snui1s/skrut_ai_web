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


@app.post("/evaluate", response_model=EvaluationResult)
async def evaluate_resume_endpoint(file: UploadFile = File(...)):
    # 1. Save to Temp File (so we can read it, then delete immediately)
    file_ext = os.path.splitext(file.filename)[1]
    tmp_path = ""

    with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as tmp_file:
        shutil.copyfileobj(file.file, tmp_file)
        tmp_path = tmp_file.name

    try:
        # 2. Extract Text (OCR)
        print(f"Processing OCR for: {file.filename}")
        resume_text = extract_text_from_pdf(tmp_path)

        if not resume_text or len(resume_text.strip()) == 0:
            raise HTTPException(
                status_code=400, detail="Could not extract text from resume."
            )

        # 3. Get Job Description
        if not os.path.exists(JD_FILE):
            raise HTTPException(status_code=400, detail="Job description not found.")

        with open(JD_FILE, "r", encoding="utf-8") as f:
            jd_text = f.read()

        # 4. AI Agent Analysis
        print(f"Running Agentic Analysis...")
        result = evaluate_resume(
            resume_text, jd_text
        )  # This is synchronous in our service

        # 5. Return Result Immediately
        return EvaluationResult(
            score=str(result["score"]),
            candidate_name=result.get("name", "Unknown Candidate"),
            email=result.get("email", "N/A"),
            analysis=result["analysis"],
            conversation_log=result.get("conversation_log", []),
        )

    except Exception as e:
        print(f"Error processing resume: {e}")
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        # 6. CLEANUP: Delete the temp file immediately
        if tmp_path and os.path.exists(tmp_path):
            try:
                os.remove(tmp_path)
                print(f"Deleted temp file: {tmp_path}")
            except Exception as e:
                print(f"Warning: Failed to delete temp file {tmp_path}: {e}")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
