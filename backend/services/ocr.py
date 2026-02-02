import pymupdf as fitz
import io


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Extracts text from a digital PDF file using PyMuPDF from memory bytes.
    Supports Serverless/Read-Only environments.
    """
    doc = None
    try:
        # Open PDF from memory stream
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        full_text = ""

        if len(doc) > 0:
            for page in doc:
                full_text += page.get_text() + "\n"

        clean_text = full_text.strip()

        # Heuristic: If text is extremely short, it's likely a scanned document or empty
        if len(clean_text) < 50:
            print(
                f"  > Warning: Text length is only {len(clean_text)} chars. Likely a scanned/image PDF."
            )
            return ""

        return clean_text

    except Exception as e:
        print(f"Error processing PDF stream: {e}")
        return ""

    finally:
        if doc:
            doc.close()
