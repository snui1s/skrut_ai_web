import pymupdf as fitz


def extract_text_from_pdf(pdf_path: str) -> str:
    """
    Extracts text from a digital PDF file using PyMuPDF.

    NOTE: This strictly supports DIGITAL PDFs (text-based).
    Scanned PDFs or Images converted to PDF without an embedded text layer will fail.
    This decision was made to ensure stability on low-memory environments (Render Free Tier)
    and avoid the high resource usage of OCR models.
    """
    doc = None
    try:
        doc = fitz.open(pdf_path)
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
            # Return empty to trigger the error handling in main.py
            return ""

        return clean_text

    except Exception as e:
        print(f"Error processing PDF {pdf_path}: {e}")
        return ""

    finally:
        if doc:
            doc.close()
