import camelot
from PyPDF2 import PdfWriter, PdfReader
from flask import Flask, jsonify, request
import os
from flask_cors import CORS
import google.generativeai as palm
from supabase import create_client, Client
import config
import json


palm_api_key = config.API_KEYS['palm']
palm.configure(api_key=palm_api_key)

supabase_url = 'https://nsmgorwiselturjwrosc.supabase.co'
supabase_key = config.API_KEYS['supa_pwd']
supabase: Client = create_client(supabase_url, supabase_key)

defaults = {
    "model": "models/chat-bison-001",
    "temperature": 0.25,
    "candidate_count": 1,
    "top_k": 40,
    "top_p": 0.95,
}
context = ""

#need to modify examples based on our use case
examples = [
    [
        "Hey. I am going to describe a scene or place I'm imagining. And I want you to help describe what it might feel like to be in that scene.",
        "Great! I will help you imagine your scene. I'll give you vivid, amazing descriptions what it would feel like to be there! I'll also provide follow-up suggestion so you can ask for more details.",
    ],
    [
        "Imagine I'm at an underwater jazz performance. Describe what it looks, feels, and sounds like!",
        'This underwater jazz performance is so epic! There are thousands of sea creatures all around jamming. A sting ray is carrying the melody on a trombone. And whoaa, that sea turtle is really rocking out on the drums! You feel the rhythm of jazz is your bones! // Follow-up: You can ask me "what\'s the name of their band?" or "is that a whale playing upright bass?" or "what song are they playing?"',
    ],
    [
        "Imagine I'm at a moon of Jupiter. Describe what it looks, feels, and sounds like!",
        'You\'re on Ganymede, a moon of Jupiter! You\'re being bombarded by some kind of plasma rain! It feels tingly and weird. Ooh, there seems to be a liquid ocean sloshing beneath your feet! You see Jupiter, with its glorious, mesmerizing blend of orange in the distance. // Follow-up: You can ask me "what does it smell like?" or "Can I see other moons or planets?" or "what is the strange light effect all around me?"',
    ],
]

messages = []


app = Flask(__name__)


@app.route("/", methods=["GET"])
def hello_world():
    return jsonify({"message": "Hello, World!"})


@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"})

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"})

    if file:
        pdfFile = file.filename
        file_path = '/path/to/your/file.jpg'
        file_name = 'file.jpg'
        bucket_name = 'files'

        

        print(pdfFile)
        file.save(file.filename)
        
        with open(pdfFile, 'rb') as f:
            supabase.storage.from_("files").upload(file=f,path='./',file_options={"content-type": "application/pdf"})
        
        inputpdf = PdfReader(open(pdfFile, "rb"))
        pages = []
        for i in range(len(inputpdf.pages)):
            output = PdfWriter()
            output.add_page(inputpdf.pages[i])
            pages.append("document-page%s.pdf" % i)
            with open("document-page%s.pdf" % i, "wb") as outputStream:
                output.write(outputStream)

        i = 0
        for page in pages:
            tables = camelot.read_pdf(page)
            i = 0
            print(tables)
            for table in tables:
                print(tables[i].df)
                tables[i].to_csv(page + str(i) + "_.csv")
                i += 1
        return jsonify({"message": "csv created successfully"})

    return jsonify({"error": "Invalid file type"})


@app.route("/chat", methods=["POST"])
def chat():
    print(request.form)
    if "text" not in request.form:
        return jsonify({"error": "No text provided"})
    chatMessage = request.form["text"]
    messages.append(chatMessage)
    with open("applehealthdata.json", "r") as file:
        applehealthdata = json.load(file)
    example = {
        "keyInsight": ["specific insights on the question asked by the user"],
        "exercise": [
            "specific exercises names and regimes and timing to help mitigate the issue"
        ],
        "foodRecipe": ["recipes that will help mitigate the issue"],
        "doctorNeededForFurtherDetails": "yes or no depending on the issue stated by the user",
    }
    prompt = "You will be given patient history as follows-> {}. Based on the user question asked as stated here -> {}, give a response in a dictionary format which gives specific key insights that answer the specific question asked by the user and provides exercises, food and tips on how to mitigate the situation. Respond in JSON. An example of your expected response is as follows - {}. Do not add any more information to it".format(
        applehealthdata, chatMessage, example
    )
    response = palm.chat(**defaults, prompt=prompt)
    # print(response.last)

    resp = response.last
    print("resp",resp )
    data_dict = resp.split("```json")[1]
    print(data_dict)
    return data_dict
    # return jsonify({"response": response.last})


if __name__ == "__main__":
    app.run(debug=True)
