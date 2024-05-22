from flask import Blueprint, request, jsonify
from app.openai_service import generate_image


api = Blueprint("api", __name__)


@api.route("/", methods=["GET"])
def index():
    return "Test"


@api.route("/generate-image", methods=["POST"])
def get_response():
    data = request.json
    prompt = data.get("prompt")
    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400

    image_url = generate_image(prompt)
    return jsonify({"image_url": image_url})
