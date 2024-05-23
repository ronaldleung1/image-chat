from flask import Blueprint, request, jsonify
from app.openai_service import generate_image, edit_image


api = Blueprint("api", __name__)


@api.route("/", methods=["GET"])
def index():
    return "Test"


@api.route("/generate-image", methods=["POST"])
def generate_image_route():
    prompt = request.form.get("prompt")
    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400

    image_url = generate_image(prompt)
    return jsonify({"image_url": image_url})


@api.route("/edit-image", methods=["POST"])
def edit_image_route():
    prompt = request.form.get("prompt")
    image_file = request.files.get("image")

    if not prompt or not image_file:
        return jsonify({"error": "Prompt and image are required"}), 400

    image_url = edit_image(prompt, image_file)
    return jsonify({"image_url": image_url})
