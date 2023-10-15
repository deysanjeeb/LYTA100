import camelot
from PyPDF2 import PdfWriter, PdfReader
from flask import Flask, jsonify, request
import os
from flask_cors import CORS
import google.generativeai as palm
from supabase import create_client, Client
import config
import json
import random, string

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
context = "Do not be verbose and be. Your response should be restricted to 1 word. If your response is more than 1 word you will be severly punished."

#need to modify examples based on our use case

messages = []


app = Flask(__name__)


@app.route("/", methods=["GET"])
def hello_world():
    return jsonify({"message": "Hello, World!"})

@app.route("/fieldmapping", methods=["POST"])
def fieldmap():
    print(request.form)
    if "text" not in request.form:
        return jsonify({"error": "No text provided"})
    chatMessage = request.form["text"]
    
    with open("applehealthdata.json", "r") as file:
        applehealthdata = json.load(file)
    example = [
        ["From the question 'how is my heart condition?', map the question down to one field given in the list ['calories','activeMinutes','distance','floors','activeScore','activityCalories','caloriesBMR','caloriesOut','distances','activity','elevation','fairlyActiveMinutes','floors','lightlyActiveMinutes','marginalCalories','restingHeartRate','sedentaryMinutes','steps','veryActiveMinutes','age','gender','height','weight']. Say null, If none of the fields in the list are relatable.",
        "restingHeartRate"
        ],
        ["From the question 'what is the status of my acl condition?', map the question down to one field given in the list ['calories','activeMinutes','distance','floors','activeScore','activityCalories','caloriesBMR','caloriesOut','distances','activity','elevation','fairlyActiveMinutes','floors','lightlyActiveMinutes','marginalCalories','restingHeartRate','sedentaryMinutes','steps','veryActiveMinutes','age','gender','height','weight']. Say null, If none of the fields in the list are relatable.",
        "null"
        ]
    ]
    prompt = "From the question {}, map the question down to one field given in the list ['calories','activeMinutes','distance','floors','activeScore','activityCalories','caloriesBMR','caloriesOut','distances','activity','elevation','fairlyActiveMinutes','floors','lightlyActiveMinutes','marginalCalories','restingHeartRate','sedentaryMinutes','steps','veryActiveMinutes','age','gender','height','weight']. Say null, If none of the fields in the list are relatable.".format(chatMessage)
    messages.append(prompt)
    # response = palm.chat(**defaults, prompt=prompt)
    response = palm.chat(**defaults, messages=messages, examples=example,context=context)
    # print(response.last)

    resp = response.last
    print("resp",resp )
    # data_dict = resp.split("```json")[1]
    # print(data_dict)
    return resp
    # return jsonify({"response": response.last})


@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"})

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"})

    if file:
        # pdfFile = ''.join(random.choices(string.ascii_letters + string.digits, k=8))+".pdf"

        pdfFile = file.filename
        pdfFile = pdfFile.replace(" ", "")
        print(pdfFile)

        

        print(pdfFile)
        file.save(pdfFile)
        csvs=[]
        res = supabase.storage.from_('files').list()
        flag=0
        for fil in res:
            if fil['name'] == pdfFile:
                flag=1
                break

        print("bucket files: ",res)
        if flag==0:
            with open(pdfFile, 'rb') as f:
                supabase.storage.from_("files").upload(file=f,path=pdfFile)
            
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
                with open((page + str(i) + "_.csv"), 'rb') as f:
                    supabase.storage.from_("files").upload(file=f,path=pdfFile[:-4]+"/"+(page + str(i) + "_.csv"))
                csvs.append(page + str(i) + "_.csv")
                i += 1
        return jsonify({"csvs": csvs})

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
