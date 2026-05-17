def chunk_text(text:str,chunk_size:int = 900,overlap: int = 150) -> list[str]:
    cleaned_text = " ".join(text.split())

    if not cleaned_text:
        return []
    
    chunks = []
    start = 0
    text_length = len(cleaned_text)

    while start < text_length:
        end = start + chunk_size
        chunk = cleaned_text[start:end].strip()

        if chunk:
            chunks.append(chunk)

        start = end - overlap

        if start <0 :
            start = 0
        
        if start >= text_length:
            break
    return chunks