from flask import Flask, jsonify, request
import os

app = Flask(__name__)

@app.route('/', methods=['GET'])
def hello_world():
    return jsonify({'message': 'Hello, World!'})



@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'})

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'})

    if file :
        
        file.save(file.filename)
        return jsonify({'message': 'File uploaded successfully'})

    return jsonify({'error': 'Invalid file type'})


if __name__ == '__main__':
    app.run(debug=True)