from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

# OpenAI API endpoint and your key
OPENAI_API_ENDPOINT = (
    "https://api.openai.com/v2/engines/chatgpt4-imagerecog/completions"
)


@app.route("/recognize", methods=["POST"])
def recognize_image():
    # Get image data from the JSON body
    data = request.get_json()
    print("data", data)
    if not data or "image" not in data:
        return jsonify({"error": "No image provided in the request body"}), 400

    image_encoded = data["image"]
    print("IE", image_encoded)

    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json",
    }

    # Craft payload
    payload = {"prompt": {"image": image_encoded}, "max_tokens": 100}

    response = requests.post(OPENAI_API_ENDPOINT, headers=headers, json=payload)

    if response.status_code == 200:
        print("Resp", response.json()["choices"][0]["text"].strip())
        return jsonify(response.json()["choices"][0]["text"].strip())
    else:
        return jsonify({"error": "Failed to recognize image"}), 500


if __name__ == "__main__":
    app.run(debug=True)
