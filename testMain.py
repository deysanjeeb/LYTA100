import requests
import base64
import json

# API endpoint
API_ENDPOINT = "http://localhost:5000/recognize"


def encode_image_to_base64(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


def send_image_to_api(image_path):
    image_encoded = encode_image_to_base64(image_path)
    payload = {"image": image_encoded}
    headers = {"Content-Type": "application/json"}

    response = requests.post(API_ENDPOINT, data=json.dumps(payload), headers=headers)

    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error {response.status_code}: {response.text}")
        return None


if __name__ == "__main__":
    image_path = "/Users/noelpereira/Desktop/LYTA100/Noel Pereira Pic.jpeg"
    result = send_image_to_api(image_path)
    if result:
        print("API Response:", result)
