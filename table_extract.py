import camelot
import os

# PDF file to extract tables from
file = ""

from PyPDF2 import PdfWriter, PdfReader

inputpdf = PdfReader(open(file, "rb"))
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

