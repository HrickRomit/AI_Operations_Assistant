from app.services.gemini_service import generate_text


ALLOWED_TONES = {"formal", "friendly", "concise"}


def generate_email_draft(email_text: str, tone: str) -> str:
    normalized_tone = tone.lower().strip()
    if normalized_tone not in ALLOWED_TONES:
        normalized_tone = "friendly"

    prompt = (
        "Customer email or inquiry:\n"
        f"{email_text.strip()}\n\n"
        f"Draft a professional business reply in a {normalized_tone} tone. "
        "Include a useful subject line. Do not invent policy details. "
        "If key information is missing, ask for it politely."
    )

    return generate_text(
        prompt=prompt,
        system_instruction=(
            "You draft clear, professional customer support emails for an SMB. "
            "Keep the reply practical, trustworthy, and ready for a human to edit."
        ),
        temperature=0.4,
    )
