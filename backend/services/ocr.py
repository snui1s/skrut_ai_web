import easyocr
import pymupdf as fitz
import os
import tempfile
import uuid

# Initialize reader globally but lazily
# NOTE: This might consume memory. If memory is tight, initialize inside function.
_reader = None


def get_reader():
    global _reader
    if _reader is None:
        print("Initializing EasyOCR (Lazy Load)...")
        _reader = easyocr.Reader(["th", "en"])
    return _reader


def extract_text_from_pdf(pdf_path: str) -> str:
    """
    Extracts text from a PDF file.
    Tries direct text extraction first.
    If text is too short, falls back to OCR using EasyOCR.
    """
    doc = None
    try:
        doc = fitz.open(pdf_path)
        full_text = ""

        if len(doc) > 0:
            # Method 1: Try Direct Text Extraction
            for page in doc:
                full_text += page.get_text() + "\n"

            # Method 2: Fallback to OCR if text is too short (likely scanned)
            if len(full_text.strip()) < 50:
                print(
                    f"  > Text too short/empty. Falling back to OCR for {pdf_path}..."
                )
                full_text = ""  # Reset
                reader = get_reader()

                # Limit OCR to max 2 pages for performance on CPU
                max_pages = 2
                processed_pages = 0

                for i, page in enumerate(doc):
                    if processed_pages >= max_pages:
                        print(
                            f"  > Reached max OCR page limit ({max_pages}). Skipping remaining pages."
                        )
                        break

                    # Zoom = 1.5 (1.5x resolution) is faster than 2x and usually sufficient
                    mat = fitz.Matrix(1.5, 1.5)
                    pix = page.get_pixmap(matrix=mat)

                    processed_pages += 1

                    # Generate a unique temp filename manually to avoid Windows file lock issues with NamedTemporaryFile
                    temp_filename = f"temp_ocr_{uuid.uuid4().hex}.png"
                    temp_img_path = os.path.join(tempfile.gettempdir(), temp_filename)

                    try:
                        # Save the image
                        pix.save(temp_img_path)

                        # Read with EasyOCR
                        result = reader.readtext(temp_img_path, detail=0)
                        full_text += " ".join(result) + "\n"

                    except Exception as ocr_err:
                        print(f"OCR Error on page: {ocr_err}")
                        # Continue to next page even if one fails
                        continue

                    finally:
                        # Clean up the image file immediately
                        # In Windows, sometimes slight delay or retries might be needed, but usually closing handle first helps
                        if os.path.exists(temp_img_path):
                            try:
                                os.remove(temp_img_path)
                            except OSError:
                                print(
                                    f"Warning: Could not delete temp OCR image: {temp_img_path}"
                                )
                                pass

        return full_text.strip()

    except Exception as e:
        print(f"Error processing PDF {pdf_path}: {e}")
        # Return empty string instead of crashing, so the process can continue (or handle upstream)
        return ""

    finally:
        # CRITICAL: Always close the document to release the file handle
        if doc:
            doc.close()
