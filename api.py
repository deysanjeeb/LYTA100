import camelot
from PyPDF2 import PdfWriter, PdfReader

from flask import Flask, jsonify, request
import os
from flask_cors import CORS

import google.generativeai as palm
import config

palm_api_key = config.API_KEYS['palm']

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
        pdfFile=file.filename
        file.save(file.filename)
        inputpdf = PdfReader(open(pdfFile, "rb"))
        pages=[]
        for i in range(len(inputpdf.pages)):
            output = PdfWriter()
            output.add_page(inputpdf.pages[i])
            pages.append("document-page%s.pdf" % i)
            with open("document-page%s.pdf" % i, "wb") as outputStream:
                output.write(outputStream)


        i=0
        for page in pages:
            tables = camelot.read_pdf(page)
            i=0
            print(tables)
            for table in tables:
                print(tables[i].df)
                tables[i].to_csv(page+str(i)+"_.csv")
                i+=1
        return jsonify({'message': 'csv created successfully'})
    

    return jsonify({'error': 'Invalid file type'})


@app.route('/chat', methods=['POST'])
def chat():

    if 'text' not in request.form:
        return jsonify({'error': 'No text provided'})
    
    text = request.form['text']

   


if __name__ == '__main__':
    app.run(debug=True)