from pathlib import Path
from pypdf import PdfReader

SUPPORTED_EXTENSIONS = ['.pdf', '.docx', '.txt']

def parse_document(file_path):
    path = Path(file_path)
    extension = path.suffix.lower()

    if extension not in SUPPORTED_EXTENSIONS:
        raise ValueError(f"Unsupported file type: {extension}")
    
    if extension == '.pdf':
        return parse_pdf(path)
    
    if extension == '.docx':
        return parse_docx(path)
    
    if extension == '.txt':
        return parse_txt(path)
    
    raise ValueError(f"could not parse file: {extension}")

def parse_txt(path:Path)->str:
    return path.read_text(encoding="utf-8",errors="ignore")

def parse_pdf(path:Path)->str:
    reader = PdfReader(str(path))
    pages = []

    for page in reader.pages:
        text  = page.extract_text()
        if text : 
            pages.append(text)
    return "\n\n".join(pages)

def parse_docx(path: Path) -> str:
    try:
        from docx import Document as DocxDocument
    except ImportError as exc:
        raise RuntimeError(
            "DOCX parsing requires python-docx. Install it with: pip install python-docx"
        ) from exc

    document = DocxDocument(str(path))
    paragraphs = [paragraph.text for paragraph in document.paragraphs if paragraph.text.strip()]

    return "\n\n".join(paragraphs)