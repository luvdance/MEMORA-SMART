"""
paragraph_indexing.py

The classifier assigns roles to paragraphs by INDEX (matching what
extractor_core.py produced). The renderer must walk the same document and
assign IDENTICAL indices to the same paragraphs, or role #47 could end up
pointing at the wrong paragraph. This one function is used by both, so the
two can never drift apart.
"""


def iter_indexed_paragraphs(doc):
    """Yields (index, paragraph) for every non-empty top-level paragraph,
    using the exact same skip-empty rule as extractor_core.extract_paragraphs.
    """
    index = 0
    for p in doc.paragraphs:
        if not p.text.strip():
            continue
        yield index, p
        index += 1
