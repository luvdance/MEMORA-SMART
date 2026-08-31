# api/project-formatter/upload.py
#
# Replaces the old Node/mammoth-based upload.js. Uses python-docx via
# extractor_core.py so the SAME real document structure (including which
# paragraphs sit inside tables, which we deliberately never classify) is
# available to both this step and render.py later.
#
# Response shape is UNCHANGED from before: { success, filename, paragraphs }
# — so classify.js on the Node side needs zero changes.

from flask import Flask, request, jsonify
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "lib_py"))
from extractor_core import extract_paragraphs

app = Flask(__name__)


@app.route("/api/project-formatter/upload", methods=["POST"])
def upload():
    if "document" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["document"]
    filename = file.filename or ""

    if not filename.lower().endswith(".docx"):
        return jsonify({
            "error": "Please upload a .docx file. (Legacy .doc and PDF aren't supported yet — save as .docx in Word first.)"
        }), 400

    try:
        file_bytes = file.read()
        paragraphs = extract_paragraphs(file_bytes)
    except Exception as e:
        return jsonify({"error": f"Failed to read this document: {str(e)}"}), 500

    if len(paragraphs) < 5:
        return jsonify({
            "error": "Could not find enough content in this document. Please check the file and try again."
        }), 400

    return jsonify({"success": True, "filename": filename, "paragraphs": paragraphs})
