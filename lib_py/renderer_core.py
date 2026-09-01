"""
renderer_core.py

Opens the ORIGINAL uploaded .docx and edits it in place based on the
classification array. Tables (<w:tbl>) and images (<w:drawing>) are never
touched — the classifier only ever sees top-level paragraphs (see
extractor_core.py / paragraph_indexing.py), so there is no code path that
could alter them.

Passes implemented, matching what was agreed:
  0. Global font/spacing: Times New Roman 12pt, double-spaced body text;
     References section gets single spacing + 6pt space-before instead.
  2. Section break at the prelim/Chapter-One boundary: roman numerals
     (i, ii, iii...) before, arabic (1, 2, 3...) restarting at Chapter One.
  3. Heading styling + renumbering: chapter/section/subsection/subsubsection
     headings get real Word Heading styles (so the native TOC field can find
     them) and their numbering is REGENERATED from position in the document,
     not trusted from whatever the student typed. Chapters start on a fresh
     page; headings are kept with their following text.
  4. Figure/Table/Plate captions renumbered per chapter (numbering only —
     repositioning a caption relative to its image/table is intentionally
     NOT done yet; flagged as a follow-up, see README).
  5. References: duplicates removed, remaining entries alphabetized, hanging
     indent applied.
  6. Table of Contents inserted as a live native Word field (scans Heading
     1-3). List of Tables / List of Figures / List of Plates generated ONLY
     when that content type was actually found — never an empty list for a
     document that has no plates, etc. Page numbers in these three lists are
     STATIC for now (not live PAGEREF fields) — flagged as a follow-up.

Every structural section this produces is derived from what the classifier
actually found in THIS document — nothing is invented.
"""

import io
import re
from copy import deepcopy

from docx import Document
from docx.shared import Pt, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.style import WD_STYLE_TYPE
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

from paragraph_indexing import iter_indexed_paragraphs

FONT = "Times New Roman"
BODY_PT = 12
CHAPTER_HEADING_PT = 14
SECTION_HEADING_PT = 12

CHAPTER_WORDS = ["ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE", "TEN"]

CAPTION_PREFIX_RE = re.compile(
    r"^(fig(?:ure)?|table|plate)\.?\s*\d+(?:[.\-]\d+)*\s*[:.\-]?\s*", re.IGNORECASE
)
HEADING_NUMBER_PREFIX_RE = re.compile(r"^\d+(\.\d+)*\.?\s*")


# ---------------------------------------------------------------------------
# Small helpers
# ---------------------------------------------------------------------------
def strip_caption_prefix(text):
    return CAPTION_PREFIX_RE.sub("", text).strip()


def get_or_create_style(doc, name, style_type):
    """Returns the named style, creating it from scratch if the document
    doesn't already define it. Real-world documents — especially ones
    exported from Google Docs, stripped-down templates, or heavily "cleaned"
    files — often don't define Heading 1-4 at all, which used to crash the
    renderer outright. This is exactly the kind of poorly-formatted document
    the tool needs to handle, not an edge case to avoid."""
    try:
        return doc.styles[name]
    except KeyError:
        return doc.styles.add_style(name, style_type)


def set_outline_level(paragraph, level):
    """Sets <w:outlineLvl w:val="level"/> directly on the paragraph (0-based:
    0=Heading 1, 1=Heading 2...). python-docx has no high-level API for this.
    Done explicitly on every heading paragraph — not just relied upon via the
    style — so the native Word TOC field (which scans by outline level) works
    correctly even when a freshly-created style doesn't carry the outline
    level Word's own built-in Heading styles normally carry automatically."""
    pPr = paragraph._p.get_or_add_pPr()
    existing = pPr.find(qn("w:outlineLvl"))
    if existing is not None:
        pPr.remove(existing)
    outline_el = OxmlElement("w:outlineLvl")
    outline_el.set(qn("w:val"), str(level))
    pPr.append(outline_el)


def apply_heading_style(doc, paragraph, level):
    """Applies both the named Heading style AND an explicit outline level —
    belt and suspenders, so the TOC field works regardless of whether the
    style itself behaves the way Word's real built-in Heading styles do."""
    style_name = f"Heading {level}"
    style = get_or_create_style(doc, style_name, WD_STYLE_TYPE.PARAGRAPH)
    paragraph.style = style
    set_outline_level(paragraph, level - 1)


def strip_heading_number_prefix(text):
    return HEADING_NUMBER_PREFIX_RE.sub("", text).strip()


def set_paragraph_text_single_run(paragraph, text, bold=None, size_pt=BODY_PT):
    """Replaces a paragraph's content with one run containing `text`,
    forcing font/size/bold explicitly (direct run formatting always beats
    style-derived formatting in Word, so this is the only reliable way to
    guarantee consistency regardless of whatever the student had)."""
    runs = paragraph.runs
    if runs:
        first = runs[0]
        first.text = text
        for extra in runs[1:]:
            extra.text = ""
        target_run = first
    else:
        target_run = paragraph.add_run(text)

    target_run.font.name = FONT
    target_run.font.size = Pt(size_pt)
    if bold is not None:
        target_run.font.bold = bold
    return target_run


def enforce_run_fonts(paragraph, size_pt=BODY_PT):
    """For body paragraphs we don't rewrite text, but we DO force every run's
    font back to Times New Roman/12pt, since direct run-level formatting
    (whatever font/size the student happened to apply) otherwise overrides
    whatever we set at the style level."""
    for run in paragraph.runs:
        run.font.name = FONT
        run.font.size = Pt(size_pt)


def insert_paragraph_after(anchor_paragraph, doc):
    """Creates a new empty paragraph and moves it to sit immediately after
    anchor_paragraph. Returns the new Paragraph object (from python-docx),
    so it can itself be used as the next anchor for another insertion,
    preserving order across multiple sequential inserts."""
    new_p = doc.add_paragraph()  # appended at end of body...
    anchor_paragraph._p.addnext(new_p._p)  # ...then relocated right here
    return new_p


def set_page_numbering(sectPr_element, fmt, start):
    """Sets/creates <w:pgNumType w:fmt=".." w:start=".."/> on a sectPr,
    respecting OOXML's required child ordering (pgNumType must come after
    pgMar and before cols, if present)."""
    existing = sectPr_element.find(qn("w:pgNumType"))
    if existing is not None:
        sectPr_element.remove(existing)

    pgNumType = OxmlElement("w:pgNumType")
    pgNumType.set(qn("w:fmt"), fmt)
    pgNumType.set(qn("w:start"), str(start))

    # Insert in the correct schema position: after pgMar if present,
    # otherwise after pgSz, otherwise just append (still valid — Word is
    # tolerant of pgNumType appearing later than pgMar in practice, but we
    # do this properly rather than relying on that tolerance).
    pgMar = sectPr_element.find(qn("w:pgMar"))
    if pgMar is not None:
        pgMar.addnext(pgNumType)
    else:
        sectPr_element.append(pgNumType)


# ---------------------------------------------------------------------------
# Reference cleanup
# ---------------------------------------------------------------------------
def _normalize_for_dedupe(text):
    normalized = re.sub(r"[^\w\s]", "", text.lower())
    normalized = re.sub(r"\s+", " ", normalized).strip()
    return normalized[:60]


def clean_and_sort_references(raw_texts):
    seen = {}
    for text in raw_texts:
        key = _normalize_for_dedupe(text)
        if not key:
            continue
        existing = seen.get(key)
        if not existing or len(text) > len(existing):
            seen[key] = text.strip()
    return sorted(seen.values(), key=lambda s: s.lower())


# ---------------------------------------------------------------------------
# Main entry point
# ---------------------------------------------------------------------------
def render(file_bytes: bytes, classifications: list, options: dict = None):
    options = options or {}
    doc = Document(io.BytesIO(file_bytes))
    role_by_index = {c["index"]: c["role"] for c in classifications}

    def get_role(idx):
        return role_by_index.get(idx, "body_paragraph")

    # --- Configure base styles once, document-wide -------------------------
    normal = get_or_create_style(doc, "Normal", WD_STYLE_TYPE.PARAGRAPH)
    normal.font.name = FONT
    normal.font.size = Pt(BODY_PT)
    normal.paragraph_format.line_spacing = 2.0  # double
    normal.paragraph_format.space_after = Pt(0)

    for level, pt_size in [(1, CHAPTER_HEADING_PT), (2, SECTION_HEADING_PT),
                            (3, SECTION_HEADING_PT), (4, SECTION_HEADING_PT)]:
        style = get_or_create_style(doc, f"Heading {level}", WD_STYLE_TYPE.PARAGRAPH)
        style.font.name = FONT
        style.font.size = Pt(pt_size)
        style.font.bold = True
        style.paragraph_format.keep_with_next = True
        if level == 1:
            style.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER

    # --- PASS A: compute all renumbering labels + collect list entries -----
    # (read-only pass — we need to know EVERY caption's final label before
    # we can build the List of Tables/Figures/Plates, which physically sits
    # earlier in the document than most of the captions themselves.)
    chapter_ctr = section_ctr = subsection_ctr = subsubsection_ctr = 0
    figure_ctr = table_ctr = plate_ctr = 0

    heading_labels = {}   # index -> new text
    caption_labels = {}   # index -> new text
    toc_figure_entries = []
    toc_table_entries = []
    toc_plate_entries = []
    reference_indices = []
    reference_texts = []
    first_chapter_index = None
    chapter_continuation_indices = set()  # paragraphs merged into the
    # previous chapter_heading rather than treated as a new chapter — see
    # prev_role handling below.
    prev_role = None
    current_chapter_anchor_idx = None

    for idx, p in iter_indexed_paragraphs(doc):
        role = get_role(idx)
        text = p.text.strip()

        if role == "chapter_heading":
            if prev_role == "chapter_heading":
                # Continuation of the SAME chapter heading, not a new
                # chapter — very common real-world pattern: student put the
                # chapter number ("CHAPTER ONE") and the chapter title
                # ("INTRODUCTION") on two separate paragraphs. Merge into
                # the anchor paragraph's label instead of incrementing.
                extra = strip_heading_number_prefix(text)
                extra = re.sub(r"^CHAPTER\s+(\w+|\d+)\s*[:.\-]?\s*", "", extra, flags=re.IGNORECASE)
                if extra:
                    separator = "" if heading_labels[current_chapter_anchor_idx].endswith(":") else ": "
                    if ":" in heading_labels[current_chapter_anchor_idx]:
                        separator = " "
                    heading_labels[current_chapter_anchor_idx] += f"{separator}{extra.upper()}"
                chapter_continuation_indices.add(idx)
                prev_role = role
                continue

            chapter_ctr += 1
            section_ctr = subsection_ctr = subsubsection_ctr = 0
            figure_ctr = table_ctr = plate_ctr = 0
            if first_chapter_index is None:
                first_chapter_index = idx
            current_chapter_anchor_idx = idx
            word = CHAPTER_WORDS[chapter_ctr - 1] if chapter_ctr <= len(CHAPTER_WORDS) else str(chapter_ctr)
            title_part = strip_heading_number_prefix(text)
            title_part = re.sub(r"^CHAPTER\s+(\w+|\d+)\s*[:.\-]?\s*", "", title_part, flags=re.IGNORECASE)
            heading_labels[idx] = f"CHAPTER {word}" + (f": {title_part.upper()}" if title_part else "")
        elif role == "section_heading":
            section_ctr += 1
            subsection_ctr = subsubsection_ctr = 0
            heading_labels[idx] = f"{chapter_ctr}.{section_ctr} {strip_heading_number_prefix(text)}"
        elif role == "subsection_heading":
            subsection_ctr += 1
            subsubsection_ctr = 0
            heading_labels[idx] = f"{chapter_ctr}.{section_ctr}.{subsection_ctr} {strip_heading_number_prefix(text)}"
        elif role == "subsubsection_heading":
            subsubsection_ctr += 1
            heading_labels[idx] = (
                f"{chapter_ctr}.{section_ctr}.{subsection_ctr}.{subsubsection_ctr} "
                f"{strip_heading_number_prefix(text)}"
            )
        elif role == "figure_caption":
            figure_ctr += 1
            label = f"Figure {chapter_ctr}.{figure_ctr}: {strip_caption_prefix(text)}"
            caption_labels[idx] = label
            toc_figure_entries.append(label)
        elif role == "table_caption":
            table_ctr += 1
            label = f"Table {chapter_ctr}.{table_ctr}: {strip_caption_prefix(text)}"
            caption_labels[idx] = label
            toc_table_entries.append(label)
        elif role == "plate_caption":
            plate_ctr += 1
            label = f"Plate {chapter_ctr}.{plate_ctr}: {strip_caption_prefix(text)}"
            caption_labels[idx] = label
            toc_plate_entries.append(label)
        elif role == "reference_entry":
            reference_indices.append(idx)
            reference_texts.append(text)

        prev_role = role

    cleaned_references = clean_and_sort_references(reference_texts)

    # --- PASS B: mutate the real document -----------------------------------
    first_chapter_paragraph = None
    prelim_list_anchor = None  # tracks insertion point for TOC/List-of-X

    HEADING_ROLES = {
        "chapter_heading", "section_heading", "subsection_heading", "subsubsection_heading",
        "references_heading", "appendix_heading", "toc_heading",
        "list_of_tables_heading", "list_of_figures_heading", "list_of_plates_heading",
        "abstract_heading", "prelim_label",
    }

    for idx, p in list(iter_indexed_paragraphs(doc)):
        role = get_role(idx)

        # Safety net: if this paragraph isn't one we're explicitly assigning
        # a Heading style to, but it already carries a stray Heading style
        # from the original (unreliable) student formatting, normalize it
        # back to Normal. Left alone, junk like a title-page name line
        # accidentally styled "Heading 2" would show up as a bogus entry in
        # the native Word TOC field, which scans by style, not content.
        if role not in HEADING_ROLES and p.style is not None and p.style.name.startswith("Heading"):
            p.style = get_or_create_style(doc, "Normal", WD_STYLE_TYPE.PARAGRAPH)

        if role == "chapter_heading" and idx in chapter_continuation_indices:
            # Merged into the previous chapter_heading's label already —
            # this physical paragraph is no longer needed.
            p._p.getparent().remove(p._p)

        elif role == "chapter_heading":
            set_paragraph_text_single_run(p, heading_labels[idx], bold=True, size_pt=CHAPTER_HEADING_PT)
            apply_heading_style(doc, p, 1)
            p.paragraph_format.page_break_before = True
            p.paragraph_format.keep_with_next = True
            p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
            if first_chapter_paragraph is None:
                first_chapter_paragraph = p

        elif role in ("section_heading", "subsection_heading", "subsubsection_heading"):
            level = {"section_heading": 2, "subsection_heading": 3, "subsubsection_heading": 4}[role]
            set_paragraph_text_single_run(p, heading_labels[idx], bold=True, size_pt=SECTION_HEADING_PT)
            p.style = get_or_create_style(doc, f"Heading {level}", WD_STYLE_TYPE.PARAGRAPH)
            set_outline_level(p, level - 1)
            p.paragraph_format.keep_with_next = True

        elif role in ("figure_caption", "table_caption", "plate_caption"):
            set_paragraph_text_single_run(p, caption_labels[idx], bold=True)
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.keep_with_next = True

        elif role == "reference_entry":
            p._p.getparent().remove(p._p)  # deleted here; cleaned list re-inserted below

        elif role == "stale_listing_entry":
            p._p.getparent().remove(p._p)  # old TOC/List-of-X entry, regenerated below instead

        elif role == "references_heading":
            set_paragraph_text_single_run(p, "REFERENCES", bold=True, size_pt=CHAPTER_HEADING_PT)
            apply_heading_style(doc, p, 1)
            p.paragraph_format.page_break_before = True
            anchor = p
            for ref_text in cleaned_references:
                anchor = insert_paragraph_after(anchor, doc)
                run = anchor.add_run(ref_text)
                run.font.name = FONT
                run.font.size = Pt(BODY_PT)
                anchor.paragraph_format.left_indent = Inches(0.5)
                anchor.paragraph_format.first_line_indent = Inches(-0.5)
                anchor.paragraph_format.line_spacing = 1.0
                anchor.paragraph_format.space_after = Pt(6)
                anchor.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY

        elif role == "appendix_heading":
            set_paragraph_text_single_run(p, p.text.strip().upper(), bold=True, size_pt=CHAPTER_HEADING_PT)
            apply_heading_style(doc, p, 1)
            p.paragraph_format.page_break_before = True

        elif role == "toc_heading":
            set_paragraph_text_single_run(p, "TABLE OF CONTENTS", bold=True, size_pt=CHAPTER_HEADING_PT)
            apply_heading_style(doc, p, 1)
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.page_break_before = True
            anchor = insert_paragraph_after(p, doc)
            _insert_toc_field(anchor)
            prelim_list_anchor = anchor

        elif role == "list_of_tables_heading":
            if toc_table_entries:
                set_paragraph_text_single_run(p, "LIST OF TABLES", bold=True, size_pt=CHAPTER_HEADING_PT)
                apply_heading_style(doc, p, 1)
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                p.paragraph_format.page_break_before = True
                anchor = p
                for label in toc_table_entries:
                    anchor = insert_paragraph_after(anchor, doc)
                    run = anchor.add_run(label)
                    run.font.name = FONT
                    run.font.size = Pt(BODY_PT)
                prelim_list_anchor = anchor
            else:
                # No tables were actually found in this document — remove
                # the stray heading entirely rather than leave an empty list.
                p._p.getparent().remove(p._p)

        elif role == "list_of_figures_heading":
            if toc_figure_entries:
                set_paragraph_text_single_run(p, "LIST OF FIGURES", bold=True, size_pt=CHAPTER_HEADING_PT)
                apply_heading_style(doc, p, 1)
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                p.paragraph_format.page_break_before = True
                anchor = p
                for label in toc_figure_entries:
                    anchor = insert_paragraph_after(anchor, doc)
                    run = anchor.add_run(label)
                    run.font.name = FONT
                    run.font.size = Pt(BODY_PT)
                prelim_list_anchor = anchor
            else:
                p._p.getparent().remove(p._p)

        elif role == "list_of_plates_heading":
            if toc_plate_entries:
                set_paragraph_text_single_run(p, "LIST OF PLATES", bold=True, size_pt=CHAPTER_HEADING_PT)
                apply_heading_style(doc, p, 1)
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                p.paragraph_format.page_break_before = True
                anchor = p
                for label in toc_plate_entries:
                    anchor = insert_paragraph_after(anchor, doc)
                    run = anchor.add_run(label)
                    run.font.name = FONT
                    run.font.size = Pt(BODY_PT)
                prelim_list_anchor = anchor
            else:
                p._p.getparent().remove(p._p)

        elif role in ("abstract_heading",):
            set_paragraph_text_single_run(p, p.text.strip(), bold=True, size_pt=CHAPTER_HEADING_PT)
            apply_heading_style(doc, p, 1)
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.page_break_before = True

        elif role == "prelim_label":
            set_paragraph_text_single_run(p, p.text.strip().upper(), bold=True, size_pt=CHAPTER_HEADING_PT)
            apply_heading_style(doc, p, 1)
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.page_break_before = True

        else:
            # body_paragraph, abstract_body, declaration_body,
            # certification_body, dedication_body, acknowledgement_body,
            # appendix_body, prelim_label, cover_title, table_data, etc.
            # Content untouched — just force consistent font/size. This is
            # also what protects tab+underscore signature lines on the
            # Certification page: we never touch paragraph structure/tabs,
            # only the run-level font, so hand-built layouts survive intact.
            enforce_run_fonts(p)

    # --- Fallback: create missing List-of-X headings if entries exist but
    # no heading paragraph was found in the original document at all. -------
    if toc_table_entries and not any(get_role(i) == "list_of_tables_heading" for i, _ in iter_indexed_paragraphs(doc)):
        prelim_list_anchor = _insert_new_list_section(doc, prelim_list_anchor, "LIST OF TABLES", toc_table_entries)
    if toc_figure_entries and not any(get_role(i) == "list_of_figures_heading" for i, _ in iter_indexed_paragraphs(doc)):
        prelim_list_anchor = _insert_new_list_section(doc, prelim_list_anchor, "LIST OF FIGURES", toc_figure_entries)
    if toc_plate_entries and not any(get_role(i) == "list_of_plates_heading" for i, _ in iter_indexed_paragraphs(doc)):
        prelim_list_anchor = _insert_new_list_section(doc, prelim_list_anchor, "LIST OF PLATES", toc_plate_entries)

    # --- PASS C: section break at the prelim / Chapter One boundary --------
    # First, normalize away any section breaks the ORIGINAL document already
    # had (common — e.g. many students already split off an unnumbered cover
    # page). Left alone, our new break would stack on top of theirs and
    # reset roman-numeral counting partway through the prelim pages
    # (i, ii, i, ii, iii...). Removing all pre-existing inline section
    # breaks merges the whole document back into one section first, so our
    # own single clean break produces continuous numbering regardless of
    # whatever structure the original file happened to have.
    # (Known trade-off: this also discards any page-specific settings from
    # those original breaks, e.g. a landscape orientation page for a wide
    # table — flagged as a follow-up if this turns out to matter in practice.)
    for p_element in list(doc.element.body.iterchildren()):
        if p_element.tag == qn("w:p"):
            pPr = p_element.find(qn("w:pPr"))
            if pPr is not None:
                inline_sectPr = pPr.find(qn("w:sectPr"))
                if inline_sectPr is not None:
                    pPr.remove(inline_sectPr)

    if first_chapter_paragraph is not None:
        prev_p_element = first_chapter_paragraph._p.getprevious()
        # Walk back to the nearest actual <w:p> sibling (skip over anything
        # else, e.g. a table, that might sit immediately before — rare but
        # safer to handle).
        while prev_p_element is not None and prev_p_element.tag != qn("w:p"):
            prev_p_element = prev_p_element.getprevious()

        final_sectPr = doc.sections[-1]._sectPr

        if prev_p_element is not None:
            # There IS preliminary content before Chapter One — split it
            # into its own roman-numbered section.
            prelim_sectPr = deepcopy(final_sectPr)
            pPr = prev_p_element.find(qn("w:pPr"))
            if pPr is None:
                pPr = OxmlElement("w:pPr")
                prev_p_element.insert(0, pPr)
            pPr.append(prelim_sectPr)
            set_page_numbering(prelim_sectPr, "lowerRoman", 1)
            _ensure_page_number_footer(doc.sections[0])

        # The body section (Chapter One onward) ALWAYS gets decimal numbering
        # restarting at 1 — this must happen even when there's no preliminary
        # content at all (e.g. a document that starts directly at Chapter
        # One with nothing before it), which previously left the whole
        # document with no page numbering configured at all.
        set_page_numbering(final_sectPr, "decimal", 1)
        _ensure_page_number_footer(doc.sections[-1])

    out_stream = io.BytesIO()
    doc.save(out_stream)
    return out_stream.getvalue()


# ---------------------------------------------------------------------------
# Field-code / footer helpers (raw OOXML — python-docx has no high-level API
# for these)
# ---------------------------------------------------------------------------
def _insert_toc_field(paragraph):
    run = paragraph.add_run()
    run.font.name = FONT
    run.font.size = Pt(BODY_PT)

    fld_begin = OxmlElement("w:fldChar")
    fld_begin.set(qn("w:fldCharType"), "begin")

    instr = OxmlElement("w:instrText")
    instr.set(qn("xml:space"), "preserve")
    instr.text = 'TOC \\o "1-3" \\h \\z \\u'

    fld_separate = OxmlElement("w:fldChar")
    fld_separate.set(qn("w:fldCharType"), "separate")

    placeholder = OxmlElement("w:t")
    placeholder.text = "Right-click here and choose Update Field to generate the Table of Contents."

    fld_end = OxmlElement("w:fldChar")
    fld_end.set(qn("w:fldCharType"), "end")

    r_element = run._r
    r_element.append(fld_begin)
    r_element.append(instr)
    r_element.append(fld_separate)
    r_element.append(placeholder)
    r_element.append(fld_end)


def _insert_new_list_section(doc, anchor, title, entries):
    if anchor is None:
        return anchor
    heading_p = insert_paragraph_after(anchor, doc)
    set_paragraph_text_single_run(heading_p, title, bold=True, size_pt=CHAPTER_HEADING_PT)
    apply_heading_style(doc, heading_p, 1)
    heading_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    heading_p.paragraph_format.page_break_before = True
    current = heading_p
    for label in entries:
        current = insert_paragraph_after(current, doc)
        run = current.add_run(label)
        run.font.name = FONT
        run.font.size = Pt(BODY_PT)
    return current


def _ensure_page_number_footer(section):
    footer = section.footer
    footer.is_linked_to_previous = False
    if footer.paragraphs and footer.paragraphs[0].runs:
        return  # already has content, don't duplicate
    p = footer.paragraphs[0] if footer.paragraphs else footer.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run()
    fld_begin = OxmlElement("w:fldChar")
    fld_begin.set(qn("w:fldCharType"), "begin")
    instr = OxmlElement("w:instrText")
    instr.set(qn("xml:space"), "preserve")
    instr.text = "PAGE"
    fld_end = OxmlElement("w:fldChar")
    fld_end.set(qn("w:fldCharType"), "end")
    run._r.append(fld_begin)
    run._r.append(instr)
    run._r.append(fld_end)
    run.font.name = FONT
    run.font.size = Pt(BODY_PT)
