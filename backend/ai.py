from google import genai
from config import GEMINI_API_KEY
import json

client = genai.Client(api_key=GEMINI_API_KEY)

def generate_recommendation(skills, experience, goal):

    prompt = f"""
You are an expert freelance career mentor.

Current Skills:
{skills}

Experience:
{experience}

Career Goal:
{goal}

Return ONLY valid JSON.

Do not use markdown.
Do not write explanations.

Use this exact structure:

{{
    "missing_skills":[
        "Skill1",
        "Skill2"
    ],
    "learning_roadmap":[
        "Step1",
        "Step2"
    ],
    "projects":[
        "Project1",
        "Project2"
    ],
    "resources":[
        "Resource1",
        "Resource2"
    ],
    "estimated_time":"3 Months",
    "readiness_score":70
}}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    text = response.text.strip()

    # Remove markdown fences if present
    text = text.replace("```json", "").replace("```", "").strip()

    return json.loads(text)