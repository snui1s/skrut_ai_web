import os
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from main import app

client = TestClient(app)


def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "mode": "privacy-focused"}


def test_get_job_description():
    # Ensure a JD file exists or handle empty
    response = client.get("/job-description")
    assert response.status_code == 200
    assert "content" in response.json()


def test_update_job_description():
    new_jd = "Software Engineer, Python, FastAPI"
    response = client.post(f"/job-description?content={new_jd}")
    assert response.status_code == 200

    # Verify update
    get_res = client.get("/job-description")
    assert get_res.json()["content"] == new_jd


@patch("services.ocr.extract_text_from_pdf")
@patch("services.ai.evaluate_resume")
def test_evaluate_endpoint(mock_evaluate, mock_ocr):
    # 1. Setup Mocks
    mock_ocr.return_value = "Candidate Resume Text..."
    mock_evaluate.return_value = {
        "score": "8.5",
        "recommendation": "Hire",
        "analysis": "Great fit.",
        "conversation_log": [{"role": "Reviewer", "content": "Hello", "timestamp": 1}],
    }

    # 2. Create Dummy PDF
    file_content = b"%PDF-1.4 dummy content"
    files = {"file": ("test_resume.pdf", file_content, "application/pdf")}

    # 3. Call Endpoint
    response = client.post("/evaluate", files=files)

    # 4. assertions
    assert response.status_code == 200
    data = response.json()

    assert data["score"] == "8.5"
    assert data["recommendation"] == "Hire"
    assert data["analysis"] == "Great fit."
    assert len(data["conversation_log"]) == 1

    # Verify mocks were called
    mock_ocr.assert_called_once()
    mock_evaluate.assert_called_once()
