from flask import Blueprint, request, jsonify
import openai

api = Blueprint("api", __name__)


@api.route("/", methods=["GET"])
def index():
    return "Test"


@api.route("/get-response", methods=["POST"])
def get_response():
    data = request.json
    prompt = data.get("prompt")

    response = openai.Completion.create(
        engine="davinci-codex", prompt=prompt, max_tokens=50
    )
    return jsonify(response.choices[0].text)
