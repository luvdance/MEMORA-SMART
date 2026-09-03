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
    })
