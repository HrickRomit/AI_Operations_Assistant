from app.services.gemini_service import generate_text, parse_json_object


def analyze_lead(raw_input: str) -> dict:
    prompt = (
        "Analyze this raw lead inquiry and return only valid JSON with these keys: "
        "name, interest, budget, urgency, priority_score, summary, recommended_action. "
        "urgency must be one of: high, medium, low. "
        "priority_score must be an integer from 1 to 10.\n\n"
        f"Raw lead inquiry:\n{raw_input.strip()}"
    )

    text = generate_text(
        prompt=prompt,
        system_instruction=(
            "You are a lead qualification assistant. Extract facts conservatively. "
            "Use 'Unknown' when a field is not present. Return JSON only."
        ),
        temperature=0.2,
    )
    data = parse_json_object(text)

    urgency = str(data.get("urgency", "medium")).lower()
    if urgency not in {"high", "medium", "low"}:
        urgency = "medium"

    try:
        priority_score = int(data.get("priority_score", 5))
    except (TypeError, ValueError):
        priority_score = 5

    return {
        "name": str(data.get("name") or "Unknown"),
        "interest": str(data.get("interest") or "Unknown"),
        "budget": str(data.get("budget") or "Unknown"),
        "urgency": urgency,
        "priority_score": max(1, min(priority_score, 10)),
        "summary": str(data.get("summary") or ""),
        "recommended_action": str(data.get("recommended_action") or ""),
    }
