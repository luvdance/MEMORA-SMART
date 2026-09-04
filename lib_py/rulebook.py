"""
rulebook.py

Loads lib/project_rulebook.json and exposes it as the SINGLE SOURCE OF
TRUTH for every formatting decision the renderer makes.

The rule this enforces: no formatting value may be invented here or
hardcoded in renderer_core.py. If the renderer needs a font size, a
spacing value, a margin, a section's position in the document, or a
caption's placement, it asks this module, and this module reads the JSON.
Anything the rulebook does not specify is reported by
unspecified_settings() rather than silently defaulted, so the gaps are
visible instead of buried in code.

Student content is data and never comes from here — the rulebook
describes structure only.
"""

import json
import os

_RULEBOOK_PATH = os.path.join(
    os.path.dirname(__file__), "..", "lib", "project_rulebook.json"
)

_cache = None


def load_rulebook(path=None):
    """Reads and caches the rulebook. Raises rather than falling back to
    built-in defaults — a missing or malformed rulebook means every
    downstream formatting decision would be invented, which is exactly
    what this module exists to prevent."""
    global _cache
    if _cache is not None and path is None:
        return _cache
    target = path or _RULEBOOK_PATH
    try:
        with open(target, "r", encoding="utf-8") as fh:
            data = json.load(fh)
    except FileNotFoundError:
        raise RuntimeError(
            "project_rulebook.json not found at %s — formatting cannot "
            "proceed without it, since it is the only source of "
            "formatting rules." % os.path.abspath(target)
        )
    except json.JSONDecodeError as exc:
        raise RuntimeError("project_rulebook.json is not valid JSON: %s" % exc)
    if path is None:
        _cache = data
    return data


# ---------------------------------------------------------------------------
# Document-wide defaults
# ---------------------------------------------------------------------------
_LINE_SPACING_WORDS = {"single": 1.0, "one_and_half": 1.5, "1.5": 1.5, "double": 2.0}


def line_spacing_value(spec, default=2.0):
    """Rulebook line spacing is written in words ("double", "single").
    Converts to the multiplier python-docx expects."""
    if spec is None:
        return default
    if isinstance(spec, (int, float)):
        return float(spec)
    return _LINE_SPACING_WORDS.get(str(spec).strip().lower(), default)


def document_defaults(rb=None):
    rb = rb or load_rulebook()
    return rb.get("document_defaults", {})


def page_numbering(rb=None):
    rb = rb or load_rulebook()
    return rb.get("page_numbering", {})


def table_rules(rb=None):
    rb = rb or load_rulebook()
    return rb.get("table_rules", {})


def figure_rules(rb=None):
    rb = rb or load_rulebook()
    return rb.get("figure_rules", {})


def global_constraints(rb=None):
    rb = rb or load_rulebook()
    return rb.get("global_constraints", [])


def section_by_id(section_id, rb=None):
    rb = rb or load_rulebook()
    for section in rb.get("sections", []):
        if section.get("id") == section_id:
            return section
    return None


def abstract_constraints(rb=None):
    section = section_by_id("abstract", rb) or {}
    return section.get("constraints", {})


def heading_size_pt(role_key, body_pt, rb=None):
    """Point size for one heading role.

    `body_pt` is the fallback and is itself rulebook-derived (or the
    user's own override), so a rulebook without a size for this role
    still produces a size the document already uses rather than an
    invented one.
    """
    sizes = document_defaults(rb).get("heading_sizes_pt") or {}
    value = sizes.get(role_key)
    try:
        return int(value)
    except (TypeError, ValueError):
        return body_pt


def section_heading_rules(rb=None):
    return (section_by_id("chapters", rb) or {}).get("section_heading", {})


def chapter_heading_rules(rb=None):
    return (section_by_id("chapters", rb) or {}).get("chapter_heading", {})


def reference_rules(rb=None):
    return (section_by_id("references", rb) or {}).get("rules", {})


def section_heading_spec(section_id, rb=None):
    """The `heading` block for a front-matter section: alignment, bold,
    case and spacing for its title line."""
    return (section_by_id(section_id, rb) or {}).get("heading", {})


def section_body_spec(section_id, rb=None):
    return (section_by_id(section_id, rb) or {}).get("body", {})


def signature_block_spec(section_id, rb=None):
    return (section_by_id(section_id, rb) or {}).get("signature_block", {})


def listing_spec(section_id, rb=None):
    """Column header + entry geometry for a List of Tables/Figures/Plates
    or the Table of Contents."""
    section = section_by_id(section_id, rb) or {}
    return {
        "column_header": section.get("column_header", {}),
        "entries": section.get("entries", {}),
    }


# ---------------------------------------------------------------------------
# Template filling
# ---------------------------------------------------------------------------
def fill_template(template, values):
    """Substitutes {placeholders} in a rulebook template.

    Only placeholders the caller supplied are replaced; an unknown one is
    left intact rather than raising, so a rulebook edit that adds a field
    the renderer does not yet supply shows up visibly in the output
    instead of crashing the render or silently vanishing.
    """
    if not template:
        return ""
    text = str(template)
    for key, value in (values or {}).items():
        text = text.replace("{%s}" % key, "" if value is None else str(value))
    return text


def template_placeholders(template):
    """The {names} a template expects — used to report which fields a
    section still needs."""
    import re as _re
    return _re.findall(r"\{([a-zA-Z0-9_]+)\}", str(template or ""))


# ---------------------------------------------------------------------------
# Section ordering
# ---------------------------------------------------------------------------
# The renderer's front-matter assembler needs a rank per section. Deriving
# it from the rulebook's own `sections` array means reordering the
# document is a JSON edit, not a code change — and means the shipped order
# can't silently drift from the spec.
#
# Maps the rulebook's section ids onto the role-group keys the renderer
# already uses internally.
_SECTION_ID_TO_RANK_KEY = {
    "cover_page": "front",
    "title_page": "front",
    "declaration": "declaration",
    "certification": "certification",
    "dedication": "dedication",
    "acknowledgement": "acknowledgement",
    "table_of_contents": "toc",
    "list_of_tables": "list_of_tables",
    "list_of_figures": "list_of_figures",
    "list_of_plates": "list_of_plates",
    "abstract": "abstract",
}


def prelim_rank(rb=None):
    """{rank_key: int} in the rulebook's declared section order.

    Only front-matter sections get a rank; `chapters`, `references` and
    `appendix` are body content the renderer never reorders. Sections
    sharing a rank key (cover_page and title_page both map to "front")
    collapse to the position of whichever appears first.
    """
    rb = rb or load_rulebook()
    ranks = {}
    next_rank = 0
    for section in rb.get("sections", []):
        key = _SECTION_ID_TO_RANK_KEY.get(section.get("id"))
        if key is None or key in ranks:
            continue
        ranks[key] = next_rank
        next_rank += 1
    return ranks


def section_order_ids(rb=None):
    """Front-matter section ids in rulebook order — for reporting."""
    rb = rb or load_rulebook()
    return [
        s.get("id") for s in rb.get("sections", [])
        if s.get("id") in _SECTION_ID_TO_RANK_KEY
    ]


# ---------------------------------------------------------------------------
# Gap reporting
# ---------------------------------------------------------------------------
def unspecified_settings(rb=None):
    """Formatting inputs the renderer needs that the rulebook does NOT
    pin down. Surfaced rather than silently defaulted so it stays obvious
    which values still live in code and need moving into the JSON."""
    rb = rb or load_rulebook()
    gaps = []
    defaults = rb.get("document_defaults", {})
    for key in ("font", "font_size_pt", "line_spacing", "margins_inches",
                "body_alignment", "heading_sizes_pt"):
        if key not in defaults:
            gaps.append("document_defaults.%s" % key)

    if "hanging_indent_inches" not in reference_rules(rb):
        gaps.append("sections[references].rules.hanging_indent_inches")

    sec = section_heading_rules(rb)
    for key in ("hanging_indent_inches", "tab_stop_inches"):
        if key not in sec:
            gaps.append("sections[chapters].section_heading.%s" % key)

    # Rules the rulebook states only in prose. They are real requirements,
    # but nothing here can enforce them, so they are reported every run
    # rather than quietly assumed to be handled.
    figures = figure_rules(rb)
    if figures.get("multiple_figures_note"):
        gaps.append("figure_rules.multiple_figures (grid arrangement of "
                    "several figures under one caption — stated in prose, "
                    "not implemented)")

    toc = section_by_id("table_of_contents", rb) or {}
    if toc.get("auto_generated"):
        gaps.append("sections[table_of_contents].entries (page_number_style, "
                    "page_number_alignment, tab_leader, show_page_number and "
                    "the per-level indents are produced by Word's own TOC "
                    "field when the student opens the file, so this renderer "
                    "cannot apply that geometry itself)")

    cover = section_by_id("cover_page", rb) or {}
    if cover.get("excluded_elements"):
        gaps.append("sections[cover_page].excluded_elements is descriptive: "
                    "the cover page carries only the elements listed in its "
                    "`elements` array, so exclusion is enforced by omission "
                    "rather than by reading this key")

    return gaps
