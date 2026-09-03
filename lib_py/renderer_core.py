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
from docx.shared import Pt, Inches, Emu
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.style import WD_STYLE_TYPE
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

from paragraph_indexing import iter_indexed_paragraphs

FONT = "Times New Roman"  # module-level defaults, overridden per-call by options.formatting
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
# Table borders ("open"/academic style)
# ---------------------------------------------------------------------------
_TBLPR_TAIL_TAGS = (
    "w:shd", "w:tblLayout", "w:tblCellMar", "w:tblLook",
    "w:tblCaption", "w:tblDescription",
)


def _insert_in_tblPr_order(tblPr, new_el):
    """tblPr's children have a required schema order; w:tblBorders must
    come before w:shd/w:tblLayout/w:tblCellMar/w:tblLook/etc if present.
    Insert before the first such tail element, or append if none exist."""
    for tag in _TBLPR_TAIL_TAGS:
        tail_el = tblPr.find(qn(tag))
        if tail_el is not None:
            tail_el.addprevious(new_el)
            return
    tblPr.append(new_el)


def _border_edge(tag, val, sz=4, color="000000"):
    el = OxmlElement(f"w:{tag}")
    el.set(qn("w:val"), val)
    if val != "nil":
        el.set(qn("w:sz"), str(sz))
        el.set(qn("w:space"), "0")
        el.set(qn("w:color"), color)
    return el


def apply_academic_table_borders(table):
    """Academic 'open' table style: a single line above the header row
    (table top), a single line below the header row, a single line
    closing the bottom of the table, and NO other borders — no outer box
    sides, no vertical lines, no lines between body rows.

    Table-level tblBorders top/bottom only ever affect the outer boundary
    of the whole table (top of the first row, bottom of the last row) —
    NOT every row — so setting top=single/bottom=single there already
    gives two of the three required lines for free. insideH/insideV/left/
    right are all set to "nil" so no other line appears anywhere. The
    third line (below the header row specifically) needs a per-cell
    tcBorders override on row 0 only, since insideH governs ALL inter-row
    lines uniformly and can't target just one row boundary.

    Any pre-existing per-cell tcBorders overrides (e.g. leftover from a
    "Table Grid"-style table, which is exactly the messy starting point
    real student documents have) are stripped first, so they can't
    reintroduce lines the table-wide setting just removed.
    """
    tbl = table._tbl
    tblPr = tbl.find(qn("w:tblPr"))
    if tblPr is None:
        tblPr = OxmlElement("w:tblPr")
        tbl.insert(0, tblPr)

    existing_borders = tblPr.find(qn("w:tblBorders"))
    if existing_borders is not None:
        tblPr.remove(existing_borders)

    borders = OxmlElement("w:tblBorders")
    borders.append(_border_edge("top", "single"))
    borders.append(_border_edge("bottom", "single"))
    borders.append(_border_edge("left", "nil"))
    borders.append(_border_edge("right", "nil"))
    borders.append(_border_edge("insideH", "nil"))
    borders.append(_border_edge("insideV", "nil"))
    _insert_in_tblPr_order(tblPr, borders)

    rows = table.rows
    for r_idx, row in enumerate(rows):
        for cell in row.cells:
            tc = cell._tc
            tcPr = tc.find(qn("w:tcPr"))
            if tcPr is None:
                tcPr = OxmlElement("w:tcPr")
                tc.insert(0, tcPr)
            existing_tc_borders = tcPr.find(qn("w:tcBorders"))
            if existing_tc_borders is not None:
                tcPr.remove(existing_tc_borders)

            if r_idx == 0:
                # Header row: explicit bottom line. Every other edge is
                # left unset so it falls through to the table-wide
                # tblBorders above (which already gives the correct
                # top/nil-everything-else behavior).
                tc_borders = OxmlElement("w:tcBorders")
                tc_borders.append(_border_edge("bottom", "single"))
                # tcPr child order: tcBorders comes early (after tcW,
                # before shd/tcMar/etc) — insert at the front is safe
                # since tcW (if present) is python-docx-managed and this
                # mirrors the tblPr helper's approach at cell scope.
                first_child = tcPr.find(qn("w:tcW"))
                if first_child is not None:
                    first_child.addnext(tc_borders)
                else:
                    tcPr.insert(0, tc_borders)


def apply_academic_borders_to_all_tables(doc):
    """Applies the open academic border style to every table in the
    document, including tables nested inside table cells (doc.tables only
    lists top-level tables)."""
    from docx.table import Table

    for tbl_element in doc.element.body.iter(qn("w:tbl")):
        apply_academic_table_borders(Table(tbl_element, doc))


# ---------------------------------------------------------------------------
# Blank-page cleanup
# ---------------------------------------------------------------------------
def _paragraph_is_empty(paragraph):
    """True if a paragraph has no visible content at all — no text, and no
    image/object either (so an image-only caption-less paragraph, which
    legitimately has empty .text, is never mistaken for blank filler)."""
    if paragraph.text.strip():
        return False
    xml = paragraph._p.xml
    return "<w:drawing" not in xml and "<w:pict" not in xml and "<w:object" not in xml


def remove_manual_page_breaks_and_blank_pages(doc):
    """Real student documents very commonly use manual page breaks
    (Word's Ctrl+Enter, a <w:br w:type="page"/> run character) between
    prelim sections — Declaration, Certification, Table of Contents, List
    of Tables, etc. This renderer inserts its OWN page_break_before flag
    on exactly the headings that need one; a leftover manual break from
    the original file is redundant at best, and produces a genuine BLANK
    PAGE at worst — e.g. a manual break immediately followed by a heading
    that ALSO carries page_break_before doubles up, leaving an empty page
    between them. This is exactly what real-world testing found.

    Two passes:
      1. Strip every manual page-break run in the document. If that break
         was a paragraph's ONLY content, remove the now-empty paragraph
         entirely rather than leaving a stray blank line behind.
      2. Collapse any remaining fully-empty paragraph (no text, no image)
         that sits immediately before a paragraph carrying
         page_break_before=True — that heading's own break already starts
         a fresh page, so the blank spacer before it does nothing but add
         risk of an extra blank page.
    """
    for p in list(doc.paragraphs):
        changed = False
        for run in list(p.runs):
            for br in run._r.findall(qn("w:br")):
                if br.get(qn("w:type")) == "page":
                    run._r.remove(br)
                    changed = True
        if changed and _paragraph_is_empty(p):
            parent = p._p.getparent()
            if parent is not None:
                parent.remove(p._p)

    for p in list(doc.paragraphs):
        if not _paragraph_is_empty(p):
            continue
        p_el = p._p
        if p_el.getparent() is None:
            continue  # already removed above in this same sweep
        next_el = p_el.getnext()
        while next_el is not None and next_el.tag != qn("w:p"):
            next_el = next_el.getnext()
        if next_el is None:
            continue
        from docx.text.paragraph import Paragraph
        next_p = Paragraph(next_el, p._parent)
        if next_p.paragraph_format.page_break_before:
            parent = p_el.getparent()
            if parent is not None:
                parent.remove(p_el)


# ---------------------------------------------------------------------------
# Front-matter assembly
# ---------------------------------------------------------------------------
# The canonical order every Nigerian university expects its preliminary
# pages in. Everything before Chapter One is ASSEMBLED into this order —
# it is not left wherever it happened to sit in the student's file, and
# not left wherever the generator happened to insert it.
PRELIM_RANK = {
    "front": 0,          # cover page / title page block (topic, BY, name,
                         # matric, department, supervisor label, date...)
    "declaration": 1,
    "certification": 2,
    "dedication": 3,
    "acknowledgement": 4,
    "abstract": 5,
    "toc": 6,
    "list_of_tables": 7,
    "list_of_figures": 8,
    "list_of_plates": 9,
}


class PrelimAssembler:
    """Collects every piece of front matter — whether PRESERVED from the
    student's original file or freshly GENERATED by this renderer — each
    tagged with its canonical rank, then lays them all out in canonical
    order immediately before Chapter One in a single pass.

    This exists because front matter is the one part of the document that
    genuinely has to be ASSEMBLED rather than edited in place. Everything
    from Chapter One onward is edited where it sits (which is what keeps
    tables and images byte-identical), but the preliminary pages have a
    fixed conventional order that real student files routinely violate,
    and that generated replacement sections have no way of slotting into
    on their own.

    The bug that motivated this: preserved content and generated content
    used two different, mutually unaware placement mechanisms — generated
    blocks anchored at the very start of the document, preserved blocks
    left where they were. A student whose file had no Acknowledgements
    got an AI-drafted one inserted as page i, ahead of their own cover
    page. Routing BOTH kinds through one ranked assembler is what makes
    that structurally impossible rather than merely fixed.
    """

    def __init__(self):
        self._items = []   # (rank, sequence, element)
        self._seq = 0

    def add(self, rank, obj):
        """Registers a paragraph, table, or raw element at `rank`.
        Sequence is preserved within a rank, so a block's internal line
        order survives the sort."""
        if obj is None:
            return
        el = getattr(obj, "_p", None)
        if el is None:
            el = getattr(obj, "_tbl", obj)
        self._items.append((rank, self._seq, el))
        self._seq += 1

    def add_all(self, rank, objs):
        for obj in objs:
            self.add(rank, obj)

    def layout(self, first_chapter_paragraph):
        """Detaches every registered element and re-inserts it in
        canonical order directly before Chapter One.

        Elements deleted earlier in the pipeline (e.g. an original
        Declaration whose toggle asked for a regenerated replacement)
        report a None parent and are dropped here rather than
        resurrected. Chapter One onward is never touched."""
        if first_chapter_paragraph is None:
            return
        live = [item for item in self._items if item[2].getparent() is not None]
        if not live:
            return
        live.sort(key=lambda item: (item[0], item[1]))

        anchor = first_chapter_paragraph._p
        for _, _, el in live:
            el.getparent().remove(el)
        for _, _, el in live:
            anchor.addprevious(el)


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

    # --- Apply formatting overrides for this call ---------------------------
    # Simplification: these helpers read FONT/BODY_PT/etc as module globals
    # rather than taking a config parameter each. Reassigning them here makes
    # a single render() call fully configurable without threading a config
    # object through every helper function. Trade-off: not safe for two
    # concurrent renders in the same warm process — acceptable for now since
    # each Vercel invocation completes before the next starts; would need a
    # proper refactor (pass config explicitly) if that ever changes.
    global FONT, BODY_PT, CHAPTER_HEADING_PT, SECTION_HEADING_PT
    fmt_opts = options.get("formatting", {})
    FONT = fmt_opts.get("fontFamily", "Times New Roman")
    BODY_PT = fmt_opts.get("fontSizePt", 12)
    CHAPTER_HEADING_PT = BODY_PT + 2
    SECTION_HEADING_PT = BODY_PT
    body_line_spacing = fmt_opts.get("lineSpacing", 2.0)

    prelim_toggles = options.get("prelimToggles", {})
    personal = options.get("personalDetails", {})
    ai_content = options.get("aiDraftedContent", {})
    directives = options.get("directives", {})

    def get_role(idx):
        return role_by_index.get(idx, "body_paragraph")

    # --- Configure base styles once, document-wide -------------------------
    normal = get_or_create_style(doc, "Normal", WD_STYLE_TYPE.PARAGRAPH)
    normal.font.name = FONT
    normal.font.size = Pt(BODY_PT)
    normal.paragraph_format.line_spacing = body_line_spacing
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

    # --- Table borders: academic "open" style on every table -----------------
    # Independent of paragraph indices (tables are never part of
    # iter_indexed_paragraphs), so safe to run at any point in render().
    apply_academic_borders_to_all_tables(doc)

    # --- PASS A: compute all renumbering labels + collect list entries -----
    # (read-only pass — we need to know EVERY caption's final label before
    # we can build the List of Tables/Figures/Plates, which physically sits
    # earlier in the document than most of the captions themselves.)
    chapter_ctr = section_ctr = subsection_ctr = subsubsection_ctr = 0
    figure_ctr = table_ctr = plate_ctr = 0

    heading_labels = {}   # index -> new text
    heading_levels = {}   # index -> effective Heading level (2/3/4) — see
    # the orphan-heading promotion in the section/subsection/subsubsection
    # branches below; this can differ from the role's "natural" level.
    caption_labels = {}   # index -> new text

    # --- Front-matter registration -----------------------------------------
    # Every paragraph BEFORE Chapter One is registered with the assembler,
    # tagged with the canonical section it belongs to. Done here in PASS A
    # (read-only, so indices still exactly match the classification array)
    # because doing it later would be unsafe: paragraph deletions in PASS B
    # shift what a fresh index scan would number each remaining paragraph,
    # per this file's index-safety rule. The assembler lays everything out
    # in canonical order after PASS B and generate_prelim_pages have both
    # had their say — see PrelimAssembler for why generated and preserved
    # content must go through the same mechanism.
    PRELIM_HEADING_ROLE_RANK = {
        "declaration_body": PRELIM_RANK["declaration"],
        "certification_body": PRELIM_RANK["certification"],
        "dedication_body": PRELIM_RANK["dedication"],
        "acknowledgement_body": PRELIM_RANK["acknowledgement"],
        "abstract_heading": PRELIM_RANK["abstract"],
        "abstract_body": PRELIM_RANK["abstract"],
        "toc_heading": PRELIM_RANK["toc"],
        "list_of_tables_heading": PRELIM_RANK["list_of_tables"],
        "list_of_figures_heading": PRELIM_RANK["list_of_figures"],
        "list_of_plates_heading": PRELIM_RANK["list_of_plates"],
    }
    prelim = PrelimAssembler()
    current_prelim_rank = PRELIM_RANK["front"]
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

        if first_chapter_index is None and not (role == "chapter_heading" and prev_role != "chapter_heading"):
            # Still in the prelim area (haven't reached the real start of
            # Chapter One yet on this iteration). cover_title/prelim_label
            # are EXPLICIT front-matter signals from the classifier — treat
            # them as always resetting to the front bucket regardless of
            # where they physically sit, since a label like "SUPERVISOR:"
            # or the student's name sitting in the middle of the file
            # (e.g. physically after a misplaced Acknowledgements section)
            # is still unambiguously front matter, not a continuation of
            # whatever heading happens to precede it in the file.
            label_upper = text.upper()
            if role == "cover_title":
                current_prelim_rank = PRELIM_RANK["front"]
            elif role == "prelim_label":
                if "DECLARATION" in label_upper:
                    current_prelim_rank = PRELIM_RANK["declaration"]
                elif "CERTIF" in label_upper:
                    current_prelim_rank = PRELIM_RANK["certification"]
                elif "DEDICAT" in label_upper:
                    current_prelim_rank = PRELIM_RANK["dedication"]
                elif "ACKNOWLEDG" in label_upper:
                    current_prelim_rank = PRELIM_RANK["acknowledgement"]
                else:
                    current_prelim_rank = PRELIM_RANK["front"]
            elif role in PRELIM_HEADING_ROLE_RANK:
                current_prelim_rank = PRELIM_HEADING_ROLE_RANK[role]
            # else (body_paragraph, stale_listing_entry, table_data, a
            # stray caption, etc.): carries forward whatever section rank
            # it's physically sitting under — reasonable default, and this
            # is genuinely ambiguous content to attribute otherwise.
            prelim.add(current_prelim_rank, p)

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
            heading_levels[idx] = 2
        elif role == "subsection_heading":
            if section_ctr == 0:
                # "Alien" heading: a subsection with no section ancestor
                # yet in this chapter — a real pattern found in testing
                # (the classifier tagged "2.5.1 Common Extraction Methods"
                # as a subsection right after "CHAPTER TWO", with no
                # "2.x" section heading between them). Numbering it
                # normally would produce a broken "2.0.1" label. It's
                # structurally the first grouping heading in the chapter,
                # so promote it to behave as a section instead — both the
                # numbering AND the actual Heading-level style/outline
                # level applied in PASS B (see heading_levels) reflect
                # the promotion, so the native TOC field nests it
                # correctly too.
                section_ctr += 1
                subsection_ctr = subsubsection_ctr = 0
                heading_labels[idx] = f"{chapter_ctr}.{section_ctr} {strip_heading_number_prefix(text)}"
                heading_levels[idx] = 2
            else:
                subsection_ctr += 1
                subsubsection_ctr = 0
                heading_labels[idx] = f"{chapter_ctr}.{section_ctr}.{subsection_ctr} {strip_heading_number_prefix(text)}"
                heading_levels[idx] = 3
        elif role == "subsubsection_heading":
            if section_ctr == 0:
                # Same orphan situation, two levels deep — promote all
                # the way to section level.
                section_ctr += 1
                subsection_ctr = subsubsection_ctr = 0
                heading_labels[idx] = f"{chapter_ctr}.{section_ctr} {strip_heading_number_prefix(text)}"
                heading_levels[idx] = 2
            elif subsection_ctr == 0:
                # Has a section ancestor but no subsection ancestor —
                # promote to subsection level.
                subsection_ctr += 1
                subsubsection_ctr = 0
                heading_labels[idx] = f"{chapter_ctr}.{section_ctr}.{subsection_ctr} {strip_heading_number_prefix(text)}"
                heading_levels[idx] = 3
            else:
                subsubsection_ctr += 1
                heading_labels[idx] = (
                    f"{chapter_ctr}.{section_ctr}.{subsection_ctr}.{subsubsection_ctr} "
                    f"{strip_heading_number_prefix(text)}"
                )
                heading_levels[idx] = 4
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

    has_dedication = any(get_role(idx) == "dedication_body" for idx, _ in iter_indexed_paragraphs(doc))
    has_acknowledgement = any(get_role(idx) == "acknowledgement_body" for idx, _ in iter_indexed_paragraphs(doc))

    # --- PASS B: mutate the real document -----------------------------------
    first_chapter_paragraph = None

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
            # heading_levels holds the EFFECTIVE level computed in PASS A,
            # which can differ from the role's natural level when an
            # orphan heading (no section/subsection ancestor yet in this
            # chapter) was promoted — keeps the Heading-style/outline
            # level consistent with the numbering actually printed, so
            # the native TOC field nests it correctly.
            level = heading_levels.get(
                idx, {"section_heading": 2, "subsection_heading": 3, "subsubsection_heading": 4}[role]
            )
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
            # Toggle defaults to True when the caller doesn't specify it,
            # so callers that don't pass prelimToggles at all (existing
            # tests, older callers) keep the original always-on behavior.
            if prelim_toggles.get("tableOfContents", True):
                set_paragraph_text_single_run(p, "TABLE OF CONTENTS", bold=True, size_pt=CHAPTER_HEADING_PT)
                apply_heading_style(doc, p, 1)
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                p.paragraph_format.page_break_before = True
                field_p = insert_paragraph_after(p, doc)
                _insert_toc_field(field_p)
                # The heading itself was registered in PASS A; this field
                # paragraph is brand new, so it has to be registered too or
                # the assembler would relocate the heading and strand the
                # field behind it.
                prelim.add(PRELIM_RANK["toc"], field_p)
            else:
                p._p.getparent().remove(p._p)

        elif role == "list_of_tables_heading":
            if toc_table_entries and prelim_toggles.get("listOfTables", True):
                set_paragraph_text_single_run(p, "LIST OF TABLES", bold=True, size_pt=CHAPTER_HEADING_PT)
                apply_heading_style(doc, p, 1)
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                p.paragraph_format.page_break_before = True
                entry_anchor = p
                for label in toc_table_entries:
                    entry_anchor = insert_paragraph_after(entry_anchor, doc)
                    run = entry_anchor.add_run(label)
                    run.font.name = FONT
                    run.font.size = Pt(BODY_PT)
                    # Newly created, so register it alongside its heading.
                    prelim.add(PRELIM_RANK["list_of_tables"], entry_anchor)
            else:
                # No tables were actually found in this document, or the
                # user unchecked "List of Tables" — remove the stray
                # heading entirely rather than leave an empty/unwanted list.
                p._p.getparent().remove(p._p)

        elif role == "list_of_figures_heading":
            if toc_figure_entries and prelim_toggles.get("listOfFigures", True):
                set_paragraph_text_single_run(p, "LIST OF FIGURES", bold=True, size_pt=CHAPTER_HEADING_PT)
                apply_heading_style(doc, p, 1)
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                p.paragraph_format.page_break_before = True
                entry_anchor = p
                for label in toc_figure_entries:
                    entry_anchor = insert_paragraph_after(entry_anchor, doc)
                    run = entry_anchor.add_run(label)
                    run.font.name = FONT
                    run.font.size = Pt(BODY_PT)
                    # Newly created, so register it alongside its heading.
                    prelim.add(PRELIM_RANK["list_of_figures"], entry_anchor)
            else:
                p._p.getparent().remove(p._p)

        elif role == "list_of_plates_heading":
            if toc_plate_entries and prelim_toggles.get("listOfPlates", True):
                set_paragraph_text_single_run(p, "LIST OF PLATES", bold=True, size_pt=CHAPTER_HEADING_PT)
                apply_heading_style(doc, p, 1)
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                p.paragraph_format.page_break_before = True
                entry_anchor = p
                for label in toc_plate_entries:
                    entry_anchor = insert_paragraph_after(entry_anchor, doc)
                    run = entry_anchor.add_run(label)
                    run.font.name = FONT
                    run.font.size = Pt(BODY_PT)
                    # Newly created, so register it alongside its heading.
                    prelim.add(PRELIM_RANK["list_of_plates"], entry_anchor)
            else:
                p._p.getparent().remove(p._p)

        elif role in ("abstract_heading",):
            # Toggle off preserves the original abstract as ordinary
            # content rather than deleting it — it's substantive student
            # writing, not a derived listing, so "not wanted as its own
            # styled prelim page" must never mean "destroyed".
            if prelim_toggles.get("abstract", True):
                set_paragraph_text_single_run(p, p.text.strip(), bold=True, size_pt=CHAPTER_HEADING_PT)
                apply_heading_style(doc, p, 1)
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                p.paragraph_format.page_break_before = True
            else:
                enforce_run_fonts(p)

        elif role == "cover_title" and (prelim_toggles.get("coverPage") or prelim_toggles.get("titlePage")):
            p._p.getparent().remove(p._p)  # replaced by fresh template below

        elif role == "declaration_body" and prelim_toggles.get("declaration"):
            p._p.getparent().remove(p._p)

        elif role == "certification_body" and prelim_toggles.get("certification"):
            p._p.getparent().remove(p._p)

        elif role == "prelim_label":
            label_upper = p.text.strip().upper()
            should_delete = (
                ("DECLARATION" in label_upper and prelim_toggles.get("declaration"))
                or ("CERTIFICATION" in label_upper and prelim_toggles.get("certification"))
                # Dedication/Acknowledgement labels are NOT deleted here even
                # if toggled on — original personal writing is preserved
                # when present; AI drafting only fills in when it's ABSENT
                # (handled separately in generate_prelim_pages).
            )
            if should_delete:
                p._p.getparent().remove(p._p)
            else:
                set_paragraph_text_single_run(p, p.text.strip().upper(), bold=True, size_pt=CHAPTER_HEADING_PT)
                apply_heading_style(doc, p, 1)
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                p.paragraph_format.page_break_before = True

        elif role == "abstract_body":
            enforce_run_fonts(p)
            p.paragraph_format.line_spacing = 1.0  # ALWAYS single, regardless
            # of whatever body line spacing the user configured — a fixed
            # convention, not user-adjustable.

        elif role in ("body_paragraph", "appendix_body"):
            # Flowing body prose. Force consistent double-spacing (or
            # whatever the user configured) and justification EXPLICITLY at
            # the paragraph level — not just via the Normal style — because
            # direct paragraph-level formatting (whatever line_spacing/
            # alignment the student's original paragraph happened to carry)
            # always wins over style-derived formatting in Word. Relying on
            # the Normal style alone left chapters that had their own
            # conflicting direct formatting (e.g. pasted in from another
            # document) inconsistent with the rest of the document — a real
            # bug found in testing.
            enforce_run_fonts(p)
            p.paragraph_format.line_spacing = body_line_spacing
            p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY

        else:
            # declaration_body, certification_body, dedication_body,
            # acknowledgement_body, cover_title, table_data, etc.
            # Content untouched — just force consistent font/size. This is
            # also what protects tab+underscore signature lines on the
            # Certification page: we never touch paragraph structure/tabs,
            # only the run-level font, so hand-built layouts survive intact.
            # These roles deliberately do NOT get the body_paragraph
            # spacing/justify treatment above — declaration/certification/
            # dedication/acknowledgement pages follow their own prelim-page
            # conventions (see generate_prelim_pages), and cover_title/
            # table_data layouts must not be reflowed.
            enforce_run_fonts(p)


    # A stable element to build brand-new front matter in front of. Its
    # exact position doesn't matter — the assembler repositions everything
    # at the end — it only has to be a real, attached element.
    _prelim_build_anchor = (
        first_chapter_paragraph._p if first_chapter_paragraph is not None
        else (doc.paragraphs[0]._p if doc.paragraphs else None)
    )

    # --- Generate replacement / AI-drafted prelim pages ---------------------
    # Must happen AFTER Pass B (which depends on stable original-document
    # indices). Everything it creates registers with the SAME assembler the
    # preserved originals registered with in PASS A, so generated and
    # preserved front matter get placed by one mechanism rather than two
    # mutually unaware ones.
    generate_prelim_pages(
        doc, prelim_toggles, personal, ai_content,
        has_dedication=has_dedication, has_acknowledgement=has_acknowledgement,
        prelim=prelim, before_element=_prelim_build_anchor,
    )

    # --- Fallback: build a TOC / List-of-X the original never had -----------
    # These are built anywhere convenient and registered at their canonical
    # rank; the assembler below is what actually positions them.
    if (prelim_toggles.get("tableOfContents", True)
            and not any(get_role(i) == "toc_heading" for i, _ in iter_indexed_paragraphs(doc))):
        # The document had NO Table of Contents at all. Unlike the
        # List-of-X fallbacks (gated on entries actually existing), a TOC
        # is always worth building fresh: chapter and section headings
        # always exist in a real project, and the native TOC field
        # populates itself from them the moment the file is opened (see
        # _enable_update_fields_on_open).
        prelim.add_all(PRELIM_RANK["toc"],
                       _build_toc_section(doc, _prelim_build_anchor))
    if (toc_table_entries and prelim_toggles.get("listOfTables", True)
            and not any(get_role(i) == "list_of_tables_heading" for i, _ in iter_indexed_paragraphs(doc))):
        prelim.add_all(PRELIM_RANK["list_of_tables"],
                       _build_list_section(doc, _prelim_build_anchor, "LIST OF TABLES", toc_table_entries))
    if (toc_figure_entries and prelim_toggles.get("listOfFigures", True)
            and not any(get_role(i) == "list_of_figures_heading" for i, _ in iter_indexed_paragraphs(doc))):
        prelim.add_all(PRELIM_RANK["list_of_figures"],
                       _build_list_section(doc, _prelim_build_anchor, "LIST OF FIGURES", toc_figure_entries))
    if (toc_plate_entries and prelim_toggles.get("listOfPlates", True)
            and not any(get_role(i) == "list_of_plates_heading" for i, _ in iter_indexed_paragraphs(doc))):
        prelim.add_all(PRELIM_RANK["list_of_plates"],
                       _build_list_section(doc, _prelim_build_anchor, "LIST OF PLATES", toc_plate_entries))

    # --- Assemble the front matter in canonical order -----------------------
    # Single placement pass over everything registered above — preserved
    # and generated alike. Runs before the blank-page cleanup so that pass
    # sees the final paragraph adjacency, and before Pass C so the section
    # break lands at the true prelim/Chapter-One boundary.
    prelim.layout(first_chapter_paragraph)

    # --- Blank-page cleanup ---------------------------------------------
    # Must run AFTER Pass B and generate_prelim_pages, since those are
    # what determine the final set of page_break_before headings this
    # checks against; must run BEFORE Pass C's section-break normalization
    # so that pass sees the final, cleaned-up paragraph sequence.
    remove_manual_page_breaks_and_blank_pages(doc)

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


    if directives.get("italicizeEtAl"):
        apply_italicize_phrase(doc, "et al")

    # Make Word populate the Table of Contents field (and page-number
    # fields) as soon as the student opens the file — see
    # _enable_update_fields_on_open.
    _enable_update_fields_on_open(doc)

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


def _enable_update_fields_on_open(doc):
    """Asks Word to refresh all fields when the document is opened.

    A native TOC field is empty until something refreshes it — without
    this the student opens the file and sees a placeholder line instead
    of their table of contents, which is indistinguishable from "the tool
    didn't generate one". Setting <w:updateFields w:val="true"/> makes
    Word populate the TOC (with real page numbers, which only a layout
    engine can know) the moment the file opens, so the generated table of
    contents is actually there for someone who just wants to print."""
    settings = doc.settings.element
    existing = settings.find(qn("w:updateFields"))
    if existing is not None:
        settings.remove(existing)
    el = OxmlElement("w:updateFields")
    el.set(qn("w:val"), "true")
    settings.append(el)


def _build_prelim_section_heading(doc, before_element, title):
    """Creates a standalone front-matter heading paragraph (DECLARATION,
    LIST OF TABLES, etc.) immediately before `before_element`. Position is
    provisional — PrelimAssembler repositions it — so this only needs a
    valid attachment point."""
    heading = doc.add_paragraph()
    before_element.addprevious(heading._p)
    set_paragraph_text_single_run(heading, title, bold=True, size_pt=CHAPTER_HEADING_PT)
    apply_heading_style(doc, heading, 1)
    heading.alignment = WD_ALIGN_PARAGRAPH.CENTER
    heading.paragraph_format.page_break_before = True
    return heading


def _build_list_section(doc, before_element, title, entries):
    """Builds a List of Tables/Figures/Plates section. Returns every
    paragraph it created, in reading order, for the caller to register
    with the assembler — returning them all is what keeps the heading and
    its entries together when the assembler later relocates the block."""
    if before_element is None:
        return []
    heading = _build_prelim_section_heading(doc, before_element, title)
    created = [heading]
    current = heading
    for label in entries:
        current = insert_paragraph_after(current, doc)
        run = current.add_run(label)
        run.font.name = FONT
        run.font.size = Pt(BODY_PT)
        created.append(current)
    return created


def _build_toc_section(doc, before_element):
    """Builds a Table of Contents heading plus a native Word TOC field.
    Returns both paragraphs for the caller to register."""
    if before_element is None:
        return []
    heading = _build_prelim_section_heading(doc, before_element, "TABLE OF CONTENTS")
    field_p = insert_paragraph_after(heading, doc)
    _insert_toc_field(field_p)
    return [heading, field_p]


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


# ---------------------------------------------------------------------------
# Prelim page template generation (Cover/Title/Declaration/Certification)
# and AI-drafted content insertion (Dedication/Acknowledgement)
# ---------------------------------------------------------------------------
def _full_name(personal):
    parts = [personal.get("firstName", ""), personal.get("middleName", ""), personal.get("surname", "")]
    return " ".join(p.strip() for p in parts if p and p.strip()).upper()


# ---------------------------------------------------------------------------
# Full-page-height layout table (Cover Page / Title Page)
# ---------------------------------------------------------------------------
# A real Nigerian project cover/title page reads: title/BY/name/matric
# (and, on a Title Page, the submission sentence + supervisor) starting
# near the TOP of the page, then the submission month/year sitting near
# the BOTTOM margin — with nothing in between. A naive "just add
# paragraphs in order" approach leaves everything bunched at the top,
# since Word only pushes content down as far as the content itself
# requires; a "prepend N blank paragraphs" hack (the previous approach
# here) is fragile — too few and the date isn't pushed down enough, too
# many (combined with a long topic) and it overflows onto a second page.
#
# The reliable fix real templates use: a borderless, two-row, one-column
# table sized to span the section's full usable page height. The top row
# (vertically top-aligned, height "atLeast" so it grows for an unusually
# long title without clipping) holds the title/BY/name/matric block; the
# bottom row (vertically bottom-aligned, fixed height) holds the
# month/year line, landing right at the bottom margin regardless of how
# much text is above it, without overflowing for any normal-length title.
def _insert_in_tblPr_order(tblPr, new_el):
    for tag in _TBLPR_TAIL_TAGS:
        tail_el = tblPr.find(qn(tag))
        if tail_el is not None:
            tail_el.addprevious(new_el)
            return
    tblPr.append(new_el)


def _strip_table_borders(table):
    tbl = table._tbl
    tblPr = tbl.find(qn("w:tblPr"))
    if tblPr is None:
        tblPr = OxmlElement("w:tblPr")
        tbl.insert(0, tblPr)
    existing = tblPr.find(qn("w:tblBorders"))
    if existing is not None:
        tblPr.remove(existing)
    borders = OxmlElement("w:tblBorders")
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        borders.append(_border_edge(edge, "nil"))
    _insert_in_tblPr_order(tblPr, borders)


def _set_row_height(row, height, rule):
    tr = row._tr
    trPr = tr.find(qn("w:trPr"))
    if trPr is None:
        trPr = OxmlElement("w:trPr")
        tr.insert(0, trPr)
    existing = trPr.find(qn("w:trHeight"))
    if existing is not None:
        trPr.remove(existing)
    trHeight = OxmlElement("w:trHeight")
    trHeight.set(qn("w:val"), str(Emu(height).twips))
    trHeight.set(qn("w:hRule"), rule)
    trPr.append(trHeight)


def _set_cell_vertical_alignment(cell, align):
    tcPr = cell._tc.get_or_add_tcPr()
    existing = tcPr.find(qn("w:vAlign"))
    if existing is not None:
        tcPr.remove(existing)
    vAlign = OxmlElement("w:vAlign")
    vAlign.set(qn("w:val"), align)
    tcPr.append(vAlign)


def _fill_cell_lines(cell, lines):
    """lines: list of (text, bold, size_pt) tuples. Reuses the cell's own
    default empty paragraph for the first line instead of leaving a
    stray blank line above the content."""
    first = True
    for text, bold, size_pt in lines:
        p = cell.paragraphs[0] if first else cell.add_paragraph()
        first = False
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.line_spacing = 1.5
        p.paragraph_format.space_after = Pt(10)
        run = p.add_run(text)
        run.font.name = FONT
        run.font.size = Pt(size_pt or BODY_PT)
        run.font.bold = bold


def build_full_height_layout_table(doc, anchor_element, top_lines, bottom_lines,
                                     bottom_row_height_in=1.3, page_break_before=False):
    """Inserts a borderless 2-row layout table immediately before
    anchor_element: top_lines top-aligned in the first row (grows if the
    content is unusually long), bottom_lines bottom-aligned in the second
    (fixed height, landing at the page's bottom margin). Together the two
    rows span the section's full usable page height."""
    section = doc.sections[0]
    usable_height = Emu(section.page_height - section.top_margin - section.bottom_margin)
    bottom_height = Inches(bottom_row_height_in)
    top_height = Emu(usable_height - bottom_height)
    if top_height < Inches(1):
        top_height = Emu(usable_height - Inches(0.8))
        bottom_height = Inches(0.8)

    table = doc.add_table(rows=2, cols=1)
    anchor_element.addprevious(table._tbl)
    table.autofit = False
    usable_width = section.page_width - section.left_margin - section.right_margin
    table.columns[0].width = usable_width
    for row in table.rows:
        row.cells[0].width = usable_width

    _strip_table_borders(table)

    top_cell, bottom_cell = table.cell(0, 0), table.cell(1, 0)
    _set_row_height(table.rows[0], top_height, "atLeast")
    _set_row_height(table.rows[1], bottom_height, "exact")
    _set_cell_vertical_alignment(top_cell, "top")
    _set_cell_vertical_alignment(bottom_cell, "bottom")

    _fill_cell_lines(top_cell, top_lines)
    _fill_cell_lines(bottom_cell, bottom_lines)

    if page_break_before:
        # A table can't carry page_break_before itself (that's a
        # paragraph-level property) — Word honors a break placed on the
        # FIRST paragraph inside the table's first cell instead.
        top_cell.paragraphs[0].paragraph_format.page_break_before = True

    return table


def _new_prepended_paragraph(doc, anchor_element):
    """Creates a new paragraph and places it immediately before
    anchor_element, which stays FIXED across repeated calls — each new
    paragraph lands right before the anchor, so calling this in the desired
    reading order naturally builds the block in correct order."""
    new_p = doc.add_paragraph()
    anchor_element.addprevious(new_p._p)
    return new_p


def _add_centered_line(doc, anchor, text, bold=False, size_pt=None, space_after_pt=10):
    p = _new_prepended_paragraph(doc, anchor)
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.line_spacing = 1.5
    p.paragraph_format.space_after = Pt(space_after_pt)
    run = p.add_run(text)
    run.font.name = FONT
    run.font.size = Pt(size_pt or BODY_PT)
    run.font.bold = bold
    return p


def _add_signature_block(doc, anchor, name_line, role_label):
    """Standard Nigerian project signature block, matching the layout
    confirmed in real sample documents:
        {Name}                    ________________    ________________
        ({Role})                  Signature            Date
    """
    line1 = _new_prepended_paragraph(doc, anchor)
    line1.paragraph_format.tab_stops.add_tab_stop(Inches(3.5))
    line1.paragraph_format.tab_stops.add_tab_stop(Inches(5.5))
    r1 = line1.add_run(f"{name_line}\t________________\t________________")
    r1.font.name = FONT
    r1.font.size = Pt(BODY_PT)

    line2 = _new_prepended_paragraph(doc, anchor)
    line2.paragraph_format.tab_stops.add_tab_stop(Inches(3.5))
    line2.paragraph_format.tab_stops.add_tab_stop(Inches(5.5))
    r2 = line2.add_run(f"({role_label})\tSignature\tDate")
    r2.font.name = FONT
    r2.font.size = Pt(max(BODY_PT - 1, 8))
    line2.paragraph_format.space_after = Pt(10)
    return [line1, line2]


def _add_blank_examiner_line(doc, anchor):
    """Fallback when no External Examiner name is supplied: a blank
    underscore line with just the role label beneath — per explicit
    requirement, no invented name or signature/date columns."""
    line1 = _new_prepended_paragraph(doc, anchor)
    r1 = line1.add_run("________________")
    r1.font.name = FONT
    r1.font.size = Pt(BODY_PT)

    line2 = _new_prepended_paragraph(doc, anchor)
    r2 = line2.add_run("External Examiner")
    r2.font.name = FONT
    r2.font.size = Pt(max(BODY_PT - 1, 8))
    line2.paragraph_format.space_after = Pt(10)
    return [line1, line2]


def generate_prelim_pages(doc, prelim_toggles, personal, ai_content,
                          has_dedication, has_acknowledgement,
                          prelim=None, before_element=None):
    """Builds the front-matter sections the user asked to have generated —
    a replacement Cover/Title page, a template Declaration/Certification,
    or AI-drafted Dedication/Acknowledgement text for sections the original
    document genuinely lacked.

    Every block it creates is registered with `prelim` (the
    PrelimAssembler) at its canonical rank. Placement is NOT this
    function's job: it builds blocks in front of `before_element` purely
    to have somewhere valid to attach them, and the assembler moves them
    into canonical position afterwards. That separation is deliberate —
    when this function owned placement too, it anchored everything at the
    very top of the document, which is how an AI-drafted Acknowledgements
    page ended up printed ahead of a student's own cover page.
    """
    if before_element is None:
        if not doc.paragraphs:
            return
        before_element = doc.paragraphs[0]._p
    anchor = before_element

    def emit(rank, *objs):
        """Registers created blocks at their canonical rank. A no-op when
        called without an assembler, so this stays usable standalone."""
        if prelim is None:
            return
        for obj in objs:
            if isinstance(obj, (list, tuple)):
                prelim.add_all(rank, obj)
            else:
                prelim.add(rank, obj)

    full_name = _full_name(personal)
    topic = (personal.get("projectTopic") or "").strip().upper()
    matric = personal.get("matricNumber", "")
    month = personal.get("submissionMonth", "")
    year = personal.get("submissionYear", "")
    department = personal.get("department", "")
    faculty = personal.get("faculty", "")
    university = personal.get("university", "")
    degree = personal.get("degreeAwarded", "")
    supervisor = personal.get("supervisorName", "")
    hod = personal.get("hodName", "")
    dean = personal.get("deanName", "")
    examiner = (personal.get("externalExaminerName") or "").strip()
    date_line = (month.upper() + ", " + str(year)).strip(", ")

    # --- Cover Page ----------------------------------------------------
    # Full-page-height layout table (see build_full_height_layout_table):
    # title/BY/name/matric top-anchored, month/year bottom-anchored at the
    # page's bottom margin — spread across the whole page without
    # overflowing, instead of bunching at the top like a plain sequence
    # of paragraphs does.
    if prelim_toggles.get("coverPage"):
        cover = build_full_height_layout_table(
            doc, anchor,
            top_lines=[
                (topic, True, CHAPTER_HEADING_PT),
                ("BY", False, None),
                (full_name, True, None),
                (matric, False, None),
            ],
            bottom_lines=[(date_line, True, None)],
        )
        emit(PRELIM_RANK["front"], cover)

    # --- Title Page ------------------------------------------------------
    if prelim_toggles.get("titlePage"):
        top_lines = [
            (topic, True, CHAPTER_HEADING_PT),
            ("BY", False, None),
            (full_name, True, None),
            (matric, False, None),
        ]
        submission_line = (
            "A PROJECT SUBMITTED TO THE DEPARTMENT OF " + department.upper() + ", "
            "FACULTY OF " + faculty.upper() + ", " + university.upper() + ", IN PARTIAL "
            "FULFILLMENT OF THE REQUIREMENTS FOR THE AWARD OF " + degree.upper()
        ).strip()
        top_lines.append((submission_line, False, None))
        if supervisor:
            top_lines.append((supervisor.upper(), True, None))
        title_page = build_full_height_layout_table(
            doc, anchor,
            top_lines=top_lines,
            bottom_lines=[(date_line, True, None)],
            page_break_before=bool(prelim_toggles.get("coverPage")),
        )
        emit(PRELIM_RANK["front"], title_page)

    # --- Declaration -------------------------------------------------------
    if prelim_toggles.get("declaration"):
        heading = _add_centered_line(doc, anchor, "DECLARATION", bold=True, size_pt=CHAPTER_HEADING_PT, space_after_pt=20)
        heading.paragraph_format.page_break_before = True
        apply_heading_style(doc, heading, 1)
        body = _new_prepended_paragraph(doc, anchor)
        body.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        body.paragraph_format.line_spacing = 1.5
        body.paragraph_format.space_after = Pt(20)
        decl_text = (
            "I, " + full_name + " (" + matric + ") hereby declare that this project titled "
            "\u201c" + topic.title() + "\u201d represents my original work and has not "
            "been previously submitted wholly or in part elsewhere nor in this "
            "University for the award of any degree."
        )
        run = body.add_run(decl_text)
        run.font.name = FONT
        run.font.size = Pt(BODY_PT)
        sig = _add_signature_block(doc, anchor, "", "Signature of Student / Date")
        emit(PRELIM_RANK["declaration"], heading, body, sig)

    # --- Certification -------------------------------------------------
    if prelim_toggles.get("certification"):
        heading = _add_centered_line(doc, anchor, "CERTIFICATION", bold=True, size_pt=CHAPTER_HEADING_PT, space_after_pt=20)
        heading.paragraph_format.page_break_before = True
        apply_heading_style(doc, heading, 1)
        body = _new_prepended_paragraph(doc, anchor)
        body.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        body.paragraph_format.line_spacing = 1.5
        body.paragraph_format.space_after = Pt(20)
        cert_text = (
            "This is to certify that this project titled \u201c" + topic.title() + "\u201d "
            "presented by " + full_name + " with matriculation number " + matric + " in the "
            "Department of " + department + ", Faculty of " + faculty + ", " + university + ", has "
            "met the requirements for the award of " + degree + "."
        )
        run = body.add_run(cert_text)
        run.font.name = FONT
        run.font.size = Pt(BODY_PT)
        emit(PRELIM_RANK["certification"], heading, body)

        if supervisor:
            emit(PRELIM_RANK["certification"], _add_signature_block(doc, anchor, supervisor, "Supervisor"))
        if hod:
            emit(PRELIM_RANK["certification"], _add_signature_block(doc, anchor, hod, "Head of Department"))
        if dean:
            emit(PRELIM_RANK["certification"], _add_signature_block(doc, anchor, dean, "Dean of Faculty"))
        if examiner:
            emit(PRELIM_RANK["certification"], _add_signature_block(doc, anchor, examiner, "External Examiner"))
        else:
            emit(PRELIM_RANK["certification"], _add_blank_examiner_line(doc, anchor))

    # --- Dedication (AI-drafted, only when genuinely missing) ---------------
    if prelim_toggles.get("dedication") and not has_dedication and ai_content.get("dedicationText"):
        heading = _add_centered_line(doc, anchor, "DEDICATION", bold=True, size_pt=CHAPTER_HEADING_PT, space_after_pt=15)
        heading.paragraph_format.page_break_before = True
        apply_heading_style(doc, heading, 1)
        body = _new_prepended_paragraph(doc, anchor)
        body.alignment = WD_ALIGN_PARAGRAPH.CENTER
        body.paragraph_format.line_spacing = 1.5
        run = body.add_run(ai_content["dedicationText"].strip())
        run.font.name = FONT
        run.font.size = Pt(BODY_PT)
        run.italic = True  # visually flags AI-drafted prose for the student
        # to review/edit before submitting — the UI also tells them this
        # explicitly, this is just a visual reinforcement in the file itself.
        emit(PRELIM_RANK["dedication"], heading, body)

    # --- Acknowledgement (AI-drafted, only when genuinely missing) ---------
    if prelim_toggles.get("acknowledgement") and not has_acknowledgement and ai_content.get("acknowledgementText"):
        heading = _add_centered_line(doc, anchor, "ACKNOWLEDGEMENTS", bold=True, size_pt=CHAPTER_HEADING_PT, space_after_pt=15)
        heading.paragraph_format.page_break_before = True
        apply_heading_style(doc, heading, 1)
        emit(PRELIM_RANK["acknowledgement"], heading)
        for para_text in ai_content["acknowledgementText"].strip().split("\n\n"):
            if not para_text.strip():
                continue
            body = _new_prepended_paragraph(doc, anchor)
            body.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
            body.paragraph_format.line_spacing = 1.5
            run = body.add_run(para_text.strip())
            run.font.name = FONT
            run.font.size = Pt(BODY_PT)
            run.italic = True
            emit(PRELIM_RANK["acknowledgement"], body)


# ---------------------------------------------------------------------------
# Custom-prompt directive: italicize "et al." (or any other targeted phrase)
# ---------------------------------------------------------------------------
def apply_italicize_phrase(doc, phrase="et al"):
    """Splits any run containing the target phrase into up to three runs
    (before / phrase / after), italicizing only the middle one — a run's
    formatting applies to its entire text, so partial italics require
    splitting the run first."""
    pattern = re.compile(re.escape(phrase) + r"\.?", re.IGNORECASE)

    for p in doc.paragraphs:
        processed_run_ids = set()
        while True:
            match_found = False
            for run in list(p.runs):
                if id(run._r) in processed_run_ids:
                    continue
                text = run.text
                match = pattern.search(text)
                if not match:
                    continue
                match_found = True
                before, matched, after = text[: match.start()], text[match.start() : match.end()], text[match.end() :]

                # Capture ORIGINAL formatting before mutating — copying it
                # after setting italic=True would leak italic onto the
                # before/after split runs (a real bug caught in testing:
                # entire paragraphs were turning italic instead of just
                # "et al.").
                original_rPr = run._r.find(qn("w:rPr"))
                rpr_for_before = deepcopy(original_rPr) if original_rPr is not None else None
                rpr_for_after = deepcopy(original_rPr) if original_rPr is not None else None

                run.text = matched
                run.italic = True
                processed_run_ids.add(id(run._r))

                if before:
                    before_run = OxmlElement("w:r")
                    if rpr_for_before is not None:
                        before_run.append(rpr_for_before)
                    t_el = OxmlElement("w:t")
                    t_el.set(qn("xml:space"), "preserve")
                    t_el.text = before
                    before_run.append(t_el)
                    run._r.addprevious(before_run)

                if after:
                    after_run = OxmlElement("w:r")
                    if rpr_for_after is not None:
                        after_run.append(rpr_for_after)
                    t_el = OxmlElement("w:t")
                    t_el.set(qn("xml:space"), "preserve")
                    t_el.text = after
                    after_run.append(t_el)
                    run._r.addnext(after_run)

                break  # restart the scan from a fresh p.runs — the "after"
                # run just created might itself contain another match.

            if not match_found:
                break
