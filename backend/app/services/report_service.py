from app.services.gemini_service import generate_text


def summarize_report(raw_text: str) -> str:
    prompt = (
        "Turn the following raw notes, data, or transcript into a structured admin report. "
        "Use concise markdown with sections for Executive Summary, Key Highlights, "
        "Action Items, Owners or Follow-ups if mentioned, and Risks or Open Questions.\n\n"
        f"Raw input:\n{raw_text.strip()}"
    )

    return generate_text(
        prompt=prompt,
        system_instruction=(
            "You create clean, business-ready operational summaries. "
            "Preserve important facts and avoid adding unsupported details."
        ),
        temperature=0.3,
    )
