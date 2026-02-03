import os
import uuid
import json
import io
from typing import List, Optional
from fastapi import FastAPI, Depends, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from services.ocr import extract_text_from_pdf
from services.ai import evaluate_resume

from pathlib import Path

# --- IN-MEMORY STORAGE ---
# Since Serverless (Vercel/Render) is Read-Only, we cannot write to disk.
# We use a global variable to store the JD temporarily.
# This resets when the server instance recycles, which is acceptable for this use case.
GLOBAL_JOB_DESCRIPTION = ""

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
    return {
        "status": "ok",
        "mode": "privacy-focused",
        "filesystem": "read-only-compatible",
    }


@app.get("/job-description")
def get_job_description():
    return {"content": GLOBAL_JOB_DESCRIPTION}


@app.post("/job-description")
def update_job_description(content: str):
    global GLOBAL_JOB_DESCRIPTION
    GLOBAL_JOB_DESCRIPTION = content
    return {"message": "Job description updated (In-Memory)"}


@app.post("/evaluate")
async def evaluate_resume_endpoint(file: UploadFile = File(...)):
    # Read file into memory immediately
    file_bytes = await file.read()
    file_name = file.filename

    async def event_generator():
        try:
            # 1. Start
            yield json.dumps(
                {"status": "progress", "message": f"Processing {file_name}..."}
            ) + "\n"

            # 2. Extract Text (In-Memory)
            yield json.dumps(
                {"status": "progress", "message": "Extracting text (Memory Mode)..."}
            ) + "\n"

            resume_text = extract_text_from_pdf(file_bytes)

            if not resume_text or len(resume_text.strip()) == 0:
                yield json.dumps(
                    {
                        "status": "error",
                        "message": "Could not extract text. System supports DIGITAL PDFS only (no scans/images).",
                    }
                ) + "\n"
                return

            # 3. Get Job Description
            if not GLOBAL_JOB_DESCRIPTION:
                yield json.dumps(
                    {"status": "error", "message": "Job description not set."}
                ) + "\n"
                return

            jd_text = GLOBAL_JOB_DESCRIPTION

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

    from fastapi.responses import StreamingResponse

    return StreamingResponse(event_generator(), media_type="application/x-ndjson")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
