# api/project-formatter/render.py
#
# Receives the ORIGINAL uploaded .docx file (re-sent by the client — we
# deliberately don't store it server-side, keeping the whole pipeline
# stateless/serverless-friendly) plus the classification array from
# classify.js, and returns the edited, formatted .docx as a download.
#
# multipart/form-data fields expected:
#   document       - the original .docx file
#   classifications - JSON string: [{index, role}, ...]
#   options        - optional JSON string: {includeListOfTables, ...}
#   filename       - optional, used to name the download

from flask import Flask, request, send_file, jsonify
import sys
import os
import io
import json

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "lib_py"))
from renderer_core import render

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

    original_name = request.form.get("filename", "project")
    out_name = original_name.rsplit(".", 1)[0] + "-formatted.docx"

    return send_file(
        io.BytesIO(output_bytes),
        mimetype="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        as_attachment=True,
        download_name=out_name,
    )
