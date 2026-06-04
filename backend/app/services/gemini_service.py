import json
import re

from google import genai
from google.genai import types

from app.core.config import settings


def get_gemini_client() -> genai.Client:
    if not settings.GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY is required to use Gemini services.")

    return genai.Client(api_key=settings.GEMINI_API_KEY)


def generate_text(prompt: str, system_instruction: str, temperature: float = 0.3) -> str:
    client = get_gemini_client()
    response = client.models.generate_content(
        model=settings.gemini_chat_model,
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=system_instruction,
            temperature=temperature,
        ),
    )

    return response.text or ""


def parse_json_object(text: str) -> dict:
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?", "", cleaned, flags=re.IGNORECASE).strip()
        cleaned = re.sub(r"```$", "", cleaned).strip()

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", cleaned, flags=re.DOTALL)
        if not match:
            raise ValueError("AI response did not contain a JSON object.")
        return json.loads(match.group(0))
