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

        self.llm = ChatOpenAI(model=model_name, temperature=0.4, api_key=api_key)

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
        Role: You are an Empathetic and Insightful Talent Acquisition Partner.
        Task: Evaluate the candidate's Resume against the JD with a "Growth Mindset."
        
        Evaluation Guidelines:
        1. **Transferable Skills (Partial Credit)**: If the JD asks for "React" but the candidate has "Vue" or "Angular", DO NOT give 0. Give partial credit (e.g., 6-7/10) because they understand component-based architecture.
        2. **Potential over Pedigree**: Look for evidence of fast learning or adaptability. If they lack a specific tool but have strong fundamentals, note this as a positive.
        3. **Constructive Feedback**: Instead of just listing "Missing A, B, C", frame it as "Candidate would be a stronger match if they highlighted experience with [A] or completed a workshop on [B]."
        
        Output Requirements (ALWAYS RESPOND IN THAI):
        0. **Candidate Metadata**:
           - Name: [Full Name in English or Thai]
           - Email: [Email Address]
        1. Score (0-10): Fair score including partial credits for related skills.
        2. Analysis (MUST BE IN THAI): 
           - **จุดแข็ง (Strengths):** execution, leadership, or technical capability.
           - **ทักษะที่นำมาปรับใช้ได้ (Transferable Skills):** What skills can they adapt to this role?
           - **สิ่งที่ต้องพัฒนา (Gaps & Growth Areas):** What specfic skills should they learn to become a 10/10?
        
        CRITICAL: All explanations in 'Analysis' MUST be in Thai language only.
        """

        user_msg = f"""
        [JOB DESCRIPTION]
        {state['job_description']}

        [RESUME TEXT]
        {state['resume_text']}
        
        {history_text}
        
        Generate your constructive evaluation now.
        """

        response = self.llm.invoke(
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
        Role: You are a Senior HR Mentor & Quality Coach.
        Task: Review the Recruiter's evaluation to ensure it is fair, constructive, and recognizes potential.

        Verification Checklist:
        1. **Did they miss Transferable Skills?** If the Recruiter rejected a candidate for missing a tool (e.g., Jira) but they have used similar tools (e.g., Trello/Asana), intervene! Tell them to give partial credit.
        2. **Is the Tone Constructive?** Ensure the critique is helpful, not just negative. 
        3. **Accuracy Check:** Ensure they haven't HALLUCINATED skills the candidate doesn't have.
        
        Response Format:
        - If the evaluation is fair and identifies potential well: Return exactly "PASS".
        - If the evaluation is too narrow-minded, harsh, or misses transferable connections: Return "FAIL: [Give specific advice in THAI language only on what skills to reconsider]".
        
        CRITICAL: Your feedback MUST be in Thai language.
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

        response = self.llm.invoke(
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
