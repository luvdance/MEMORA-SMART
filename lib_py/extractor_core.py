"""
extractor_core.py

Reads a real .docx file and produces the paragraph array used for AI
classification — same JSON schema as the earlier JS extractor
(index, text, style, bold, fontSizePt, align, isAllCaps, isListItem), so
classify.js and classifySchema.js on the Node side need ZERO changes.

Deliberately only walks top-level body paragraphs (document.paragraphs),
same as before — paragraphs living inside table cells are intentionally
excluded from classification, because table content is never touched by
the renderer (see renderer_core.py). This is what makes tables/images safe
by construction: the classifier never even sees them, so nothing downstream
can accidentally "fix" them.
"""

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from paragraph_indexing import iter_indexed_paragraphs
import io


def _get_alignment_str(paragraph):
    align = paragraph.alignment
    if align is None:
        return None
    mapping = {
        WD_ALIGN_PARAGRAPH.CENTER: "center",
        WD_ALIGN_PARAGRAPH.RIGHT: "right",
        WD_ALIGN_PARAGRAPH.JUSTIFY: "both",
        WD_ALIGN_PARAGRAPH.LEFT: "left",
    }
    return mapping.get(align, None)


def _paragraph_bold(paragraph):
    return any(run.bold for run in paragraph.runs if run.bold)


def _paragraph_font_size_pt(paragraph):
    sizes = [run.font.size.pt for run in paragraph.runs if run.font.size]
    return max(sizes) if sizes else None


def extract_paragraphs(file_bytes: bytes):
    doc = Document(io.BytesIO(file_bytes))
    paragraphs = []

    for index, p in iter_indexed_paragraphs(doc):
        text = p.text.strip()
        style_name = p.style.name if p.style else None
        is_list_item = style_name is not None and "List" in style_name
        is_all_caps = len(text) > 2 and text == text.upper() and any(c.isalpha() for c in text)

        paragraphs.append(
            {
                "index": index,
                "text": text,
                "style": style_name,
                "bold": _paragraph_bold(p),
                "fontSizePt": _paragraph_font_size_pt(p),
                "align": _get_alignment_str(p),
                "isAllCaps": is_all_caps,
                "isListItem": is_list_item,
            }
        )

    return paragraphs
