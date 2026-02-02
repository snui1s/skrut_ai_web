import os
import re
import json
from typing import TypedDict, List, Dict, Any
from dotenv import load_dotenv

from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage
from langgraph.graph import StateGraph, END

load_dotenv()


# --- 1. State Definition ---
class GraphState(TypedDict):
    resume_text: str
    job_description: str
    reviewer_output: str
    feedback_history: List[str]
    conversation_history: List[
        Dict[str, Any]
    ]  # [{"role": "Reviewer", "content": "..."}]
    retry_count: int
    # Removed "status" field
    temp_status: str  # Internal use only


# --- 2. Node Logic ---
class ResumeJudgeGraph:
    def __init__(self, model_name="gpt-4o-mini"):
        # Look for either key name
        api_key = os.getenv("OPENAI_API_KEY") or os.getenv("OPENAPI_KEY")
        if not api_key:
            raise ValueError(
                "OPENAI_API_KEY (or OPENAPI_KEY) not found in environment variables."
            )

        self.llm_reviewer = ChatOpenAI(
            model=model_name, temperature=0.5, api_key=api_key
        )
        self.llm_auditor = ChatOpenAI(
            model=model_name, temperature=0.0, api_key=api_key
        )

    def node_1_reviewer(self, state: GraphState):
        """
        Node 1: The Reviewer
        Analyzes resume vs JD. Adjusts based on feedback.
        """
        print(
            f"\n... Node 1 (Reviewer) is thinking (Attempt {state['retry_count'] + 1})..."
        )

        history_text = ""
        if state["feedback_history"]:
            history_text = (
                "\\n\\n--- ADVICE FROM SENIOR MENTOR (Please adjust analysis) ---\\n"
            )
            for i, feedback in enumerate(state["feedback_history"]):
                history_text += f"Tip {i+1}: {feedback}\\n"

        system_msg = """
        Role: You are a Professional Talent Acquisition Partner specializing in "Potential-Based Hiring."
        Task: Evaluate the candidate's Resume against the JD by identifying real, relevant connections between their past experience and the role's requirements.

        Evaluation Guidelines:
        1. **Evidence-Based Transferable Skills**: You may give partial credit ONLY for skills within the same family (e.g., Vue for React, Chemical Engineering Data Analysis for General Data Analysis). DO NOT give credit for completely unrelated fields (e.g., Chemical Lab work does not translate to Backend Coding).
        2. **Growth Mindset with Proof**: "Potential" must be backed by evidence of fast learning in the resume (e.g., certifications, rapid career progression, or self-taught projects). If there is no evidence of learning in a related field, do not assume they have it.
        3. **Realistic Constructive Feedback**: Identify gaps clearly. Frame them as areas for improvement, but be honest about the distance between the candidate's current state and the 10/10 requirements.
        4. **If a candidate is a 90% mismatch, do not try to find 'Transferable Skills' from unrelated fields. Be blunt and state: 'No relevant skills found for this role'.**
        5. **Do not translate or change headers 0, 1, and 2. Use them exactly as specified.**
        Output Requirements (ALWAYS RESPOND IN THAI):
        0. **Candidate Metadata**:
           - Name: [EXACT name from resume - NO TRANSLATION]
           - Email: [Email Address]
        1. Score (0-10): Be realistic. If the candidate is from a completely different industry with no relevant technical skills, the score should naturally be low (below 3).
        2. Analysis (MUST BE IN THAI): 
           - **จุดแข็ง (Strengths):** ขีดความสามารถที่โดดเด่นและมีหลักฐานชัดเจนใน Resume
           - **ทักษะที่นำมาปรับใช้ได้ (Transferable Skills):** ทักษะที่เกี่ยวข้องทางตรรกะหรือสายงานใกล้เคียงกันเท่านั้น (ห้ามแถ)
           - **สิ่งที่ต้องพัฒนา (Gaps & Growth Areas):** ทักษะทางเทคนิคหรือประสบการณ์ที่ขาดหายไปอย่างชัดเจนเมื่อเทียบกับ JD
        """

        user_msg = f"""
        [JOB DESCRIPTION]
        {state['job_description']}

        [RESUME TEXT]
        {state['resume_text']}
        
        {history_text}
        
        Generate your constructive evaluation now.
        """

        response = self.llm_reviewer.invoke(
            [SystemMessage(content=system_msg), HumanMessage(content=user_msg)]
        )

        # LOGGING
        new_entry = {
            "role": "Reviewer",
            "content": response.content,
            "timestamp": state["retry_count"],
        }
        updated_history = state.get("conversation_history", []) + [new_entry]

        return {
            "reviewer_output": response.content,
            "retry_count": state["retry_count"] + 1,
            "conversation_history": updated_history,
        }

    def node_2_auditor(self, state: GraphState):
        """
        Node 2: The Auditor (Mentor)
        Checks Reviewer output against Resume and JD.
        """
        print("\n... Node 2 (Auditor) is verifying...")

        system_msg = """
        Role: You are a Senior HR Auditor & Quality Controller.
        Task: Audit the Recruiter's evaluation to ensure it is logically sound, evidence-based, and accurately reflects the candidate's fit for the JD.

        Verification Checklist:
        1. **Logical Transferable Skills**: Check if the Recruiter missed a skill in the SAME FAMILY. If the JD asks for "Jira" but the candidate has "Asana/Trello", the Recruiter should give credit. HOWEVER, if the JD asks for "Python" and the candidate has "Chemical Engineering Research," do NOT intervene; these are NOT transferable skills.
        2. **Anti-Hallucination Check**: Did the Recruiter "invent" potential or skills not found in the Resume? If the Recruiter says "the candidate can learn Python" without any proof of coding history, you MUST FAIL the evaluation.
        3. **No-Nonsense Bias Check**: Ensure the Recruiter is not being "too nice." If a candidate lacks 90% of the core requirements, a score above 3 is illogical. FAIL the evaluation if the score is too high for a weak candidate.
        4. **If the Reviewer gives a low score (1-3) and correctly identifies that the candidate lacks almost all core requirements, you MUST return 'PASS'. Even if you think the candidate is terrible, as long as the Reviewer agrees they are terrible, the evaluation is ACCURATE.**
        Response Format:
        - If the evaluation is accurate, logical, and evidence-based: Return exactly "PASS".
        - If the evaluation is illogical, misses legitimate skill connections, or is UNREALISTICALLY POSITIVE: Return "FAIL: [ระบุจุดบกพร่องตามหลักการและตรรกะเป็นภาษาไทยเท่านั้น]".

        CRITICAL: All feedback must be strictly in Thai. Do not encourage "Potential" without evidence.
        """

        user_msg = f"""
        [JOB DESCRIPTION]
        {state['job_description']}

        [ORIGINAL RESUME TEXT]
        {state['resume_text']}
        
        [REVIEWER'S EVALUATION]
        {state['reviewer_output']}
        
        Verify this evaluation as a Mentor.
        """

        response = self.llm_auditor.invoke(
            [SystemMessage(content=system_msg), HumanMessage(content=user_msg)]
        )
        result = response.content.strip()

        is_pass = result.upper() == "PASS"

        # LOGGING
        new_entry = {
            "role": "Auditor",
            "content": result,
            "timestamp": state["retry_count"],
        }
        updated_conv_history = state.get("conversation_history", []) + [new_entry]

        # If fail, append to feedback history
        new_feedback_history = state["feedback_history"]

        graph_status_signal = "PASS" if is_pass else "FAIL"

        if not is_pass:
            print(f"!!! AUDITOR REJECTED: {result}")
            new_feedback_history = state["feedback_history"] + [result]
        else:
            print(f"\n>>> AUDITOR APPROVED <<<")

        return {
            "feedback_history": new_feedback_history,
            "conversation_history": updated_conv_history,
            "temp_status": graph_status_signal,  # Internal use only
        }

    def build_graph(self):
        workflow = StateGraph(GraphState)

        # Add Nodes
        workflow.add_node("reviewer", self.node_1_reviewer)
        workflow.add_node("auditor", self.node_2_auditor)

        # Set Entry Point
        workflow.set_entry_point("reviewer")

        # Add Edges
        workflow.add_edge("reviewer", "auditor")

        # Conditional Edge Logic
        def check_auditor_verdict(state: GraphState):
            if state.get("temp_status") == "PASS":
                return "end"
            if state["retry_count"] >= 3:
                print(
                    "\n*** Max retries reached. Returning last Reviewer output with warning. ***"
                )
                return "end"
            return "retry"

        workflow.add_conditional_edges(
            "auditor", check_auditor_verdict, {"end": END, "retry": "reviewer"}
        )

        return workflow.compile()


def extract_score(text):
    # Try multiple patterns from strict to loose
    patterns = [
        r"(?:Score|คะแนน)\s*(?:\(0-10\))?:\s*(\d+(\.\d+)?)",  # Score: 8.5
        r"(?:Score|คะแนน)\s*[-]*\s*(\d+(\.\d+)?)",  # Score - 8.5
        r"(\d+(\.\d+)?)\s*\/\s*10",  # 8.5 / 10
    ]
    for p in patterns:
        match = re.search(p, text, re.IGNORECASE)
        if match:
            return match.group(1)

    # Fallback: Look for the first standalone number between 0-10 on a line starting with Score/คะแนน
    fallback = re.search(r"(?:Score|คะแนน).*?(\d+(\.\d+)?)", text, re.IGNORECASE)
    if fallback:
        val = float(fallback.group(1))
        if 0 <= val <= 10:
            return str(val)

    return "N/A"


def extract_name(text):
    match = re.search(r"(?:Name|ชื่อ)\s*[:\-]?\s*(.*)", text, re.IGNORECASE)
    if match:
        return match.group(1).strip().strip("*")
    return "Candidate"


def extract_email(text):
    # Standard email regex
    match = re.search(r"[\w\.-]+@[\w\.-]+\.\w+", text)
    if match:
        return match.group(0)
    return "N/A"


def evaluate_resume(resume_text: str, job_description: str):
    judge_graph = ResumeJudgeGraph()
    app = judge_graph.build_graph()

    initial_state = {
        "resume_text": resume_text,
        "job_description": job_description,
        "reviewer_output": "",
        "feedback_history": [],
        "conversation_history": [],
        "retry_count": 0,
        "temp_status": "START",
    }

    final_state = app.invoke(initial_state)

    evaluation_text = final_state["reviewer_output"]
    score = extract_score(evaluation_text)
    name = extract_name(evaluation_text)
    email = extract_email(evaluation_text)
    conversation_log = final_state["conversation_history"]

    return {
        "score": score,
        "name": name,
        "email": email,
        "analysis": evaluation_text,
        "conversation_log": conversation_log,
    }
