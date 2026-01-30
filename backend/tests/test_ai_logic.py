import pytest
from services.ai import extract_score, extract_recommendation


def test_extract_score_formats():
    # Standard format
    assert extract_score("Score (0-10): 8.5") == "8.5"
    assert extract_score("Score: 7") == "7"

    # Thai format
    assert extract_score("คะแนน (0-10): 9") == "9"
    assert extract_score("คะแนน: 6.5") == "6.5"

    # Loose formats
    assert extract_score("Score - 5") == "5"
    assert extract_score("Overall Score: 8 / 10") == "8"
    assert extract_score("Total Score is 4.5/10") == "4.5"


def test_extract_score_fallback():
    # Fallback to N/A
    assert extract_score("No score provided") == "N/A"
    assert extract_score("Score is unknown") == "N/A"


def test_extract_recommendation_keywords():
    # Explicit keywords (English)
    assert extract_recommendation("Recommendation: Hire this candidate.") == "Hire"
    assert extract_recommendation("Recommendation: Reject immediately.") == "Reject"
    assert (
        extract_recommendation("Recommendation: Strong Potential with some training.")
        == "Strong Potential"
    )

    # Explicit keywords (Thai)
    assert extract_recommendation("ข้อเสนอแนะ: ควรรับเข้าทำงาน (Hire)") == "Hire"
    assert extract_recommendation("ข้อเสนอแนะ: ปฏิเสธ (Reject)") == "Reject"
    assert (
        extract_recommendation("สถานะ: มีแวว (Strong Potential)") == "Strong Potential"
    )
    assert extract_recommendation("ข้อเสนอแนะ: เรียกคุย (Interview)") == "Interview"


def test_extract_recommendation_context():
    # Hidden in text
    assert extract_recommendation("Based on the profile, I would hire him.") == "Hire"
    assert extract_recommendation("Conclusion: We should interview him.") == "Interview"
    assert extract_recommendation("Summary: This is a reject.") == "Reject"

    # Context check (avoid 'not hire')
    assert extract_recommendation("I would not hire him.") != "Hire"
    # Note: Our current logic returns "N/A" or falls back to something else, checking it doesn't return Hire is enough.


def test_extract_recommendation_fallback_by_score():
    # If text is messy but score is high, it should default to Interview
    text_without_rec = "Score: 8\nAnalysis: Good candidate."
    assert extract_recommendation(text_without_rec) == "Interview"

    # Low score shouldn't trigger fallback
    text_low_score = "Score: 4\nAnalysis: Bad candidate."
    assert extract_recommendation(text_low_score) == "N/A"
