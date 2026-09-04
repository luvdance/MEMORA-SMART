# api/project-formatter/render.py
#
# Receives the ORIGINAL uploaded .docx file (re-sent by the client — we
# deliberately don't store it server-side, keeping the whole pipeline
# stateless/serverless-friendly) plus the classification array from
# classify.js, and returns the edited, formatted .docx.
#
# multipart/form-data fields expected:
#   document       - the original .docx file
#   classifications - JSON string: [{index, role}, ...]
#   options        - optional JSON string: {prelimToggles, personalDetails,
#                     formatting, aiDraftedContent, directives}
#   filename       - optional, used to name the download
#
# Response is JSON, not a raw file download: { success, filename,
# docxBase64, previewHtml }. This lets one render pass produce BOTH the
# authoritative .docx (client base64-decodes it into a Blob for download)
# AND an approximate structural HTML preview (via python-mammoth, run once
# server-side on the exact bytes we just built) without a second round
# trip or re-uploading the file. previewHtml is NOT pixel-perfect Word
# rendering — mammoth maps styles/structure, not exact layout — the
# frontend must label it clearly as a structural preview, with the
# downloaded .docx as the authoritative, exactly-formatted version.

from flask import Flask, request, jsonify
import sys
import os
import io
import json
import base64

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "lib_py"))
from renderer_core import render
from validate_output import validate_document
from extractor_core import extract_paragraphs

import mammoth

app = Flask(__name__)


@app.route("/api/project-formatter/render", methods=["POST"])
def render_endpoint():
    if "document" not in request.files:
        return jsonify({"error": "Original document file is required"}), 400
    if "classifications" not in request.form:
        return jsonify({"error": "classifications field is required"}), 400

    try:
        file_bytes = request.files["document"].read()
        classifications = json.loads(request.form["classifications"])
        options = json.loads(request.form.get("options", "{}"))
    except Exception as e:
        return jsonify({"error": f"Invalid request data: {str(e)}"}), 400

    try:
        output_bytes = render(file_bytes, classifications, options)
    except Exception as e:
        return jsonify({"error": f"Failed to build the formatted document: {str(e)}"}), 500

    # --- Validation gate -------------------------------------------------
    # Runs on the assembled document before it goes back to the client,
    # checking project_rulebook.json's global_constraints plus the
    # structural invariants the pipeline depends on (every paragraph
    # classified exactly once, no chapter heading without a real zone
    # transition, no stale contents rows leaking through).
    #
    # Findings are reported, not thrown: a document that trips a warning
    # is still worth downloading, and the checks that can only be
    # approximated without a layout engine say so in the finding itself.
    # What must never happen is a silent pass, so failures always travel
    # back to the caller and are logged server-side.
    validation = None
    try:
        from docx import Document as _Doc
        rendered_doc = _Doc(io.BytesIO(output_bytes))
        source_texts = [p["text"] for p in extract_paragraphs(file_bytes)]
        validation = validate_document(rendered_doc, classifications, source_texts)
        if not validation["ok"] or validation["warnings"]:
            print("[project-formatter] validation: %d error(s), %d warning(s)"
                  % (validation["errors"], validation["warnings"]))
            for finding in validation["findings"]:
                print("  [%s] %s — %s"
                      % (finding["severity"], finding["check"], finding["message"]))
    except Exception as exc:
        # A broken validator must not withhold a document that rendered
        # fine — but it must not look like a clean pass either.
        print("[project-formatter] validation could not run: %s" % exc)
        validation = {
            "ok": None, "errors": 0, "warnings": 0, "findings": [],
            "error": "Validation could not run: %s" % exc,
        }

    try:
        preview_result = mammoth.convert_to_html(io.BytesIO(output_bytes))
        preview_html = preview_result.value
    except Exception:
        # The preview is a nice-to-have, not the deliverable — the actual
        # formatted .docx already succeeded above. Never fail the whole
        # request just because the approximate HTML preview couldn't be
        # built; the frontend treats an empty previewHtml as "no preview
        # available" and still offers the download.
        preview_html = ""

    original_name = request.form.get("filename", "project")
    out_name = original_name.rsplit(".", 1)[0] + "-formatted.docx"

    return jsonify({
        "success": True,
        "filename": out_name,
        "docxBase64": base64.b64encode(output_bytes).decode("ascii"),
        "previewHtml": preview_html,
        "validation": validation,
    })
