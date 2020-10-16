import * as fs from "fs";
import { Document, Packer, Paragraph, TextRun } from "docx";

const lineLen = 100;
const lineNum = 20;

var pdf = new jsPDF();
const docx = new Document();

x = 10;
y = 10;

font = "times"

function createPDF(){

  InsName = document.getElementById("name").value;
  courseName = document.getElementById("courseName").value;
  courseDes = document.getElementById("courseDes").value;

  pdf.setFont("times" , "light")

  write(InsName , "bold");
  write(courseName , "light");
  skipLine();
  write("Instructor Contact:" , "bold");
  skipLine();
  write("Course Description:" , "bold");
  write(courseDes , "light");
  skipLine();

  pdf.save("courseSyl.pdf");

  Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync("My Document.docx", buffer);
  });
}

function write(s , style){
  //for pdf
  if(style == "light"){
    pdf.setFont(font , "light")
  }
  else if(style == "bold"){
    pdf.setFont(font , "bold")
  }

  var lines = pdf.splitTextToSize(s , 180);
  pdf.text(lines , x , y);

  y += 6 * lines.length;

  //for word
  if(style == "light"){
    doc.addSection({
      properties: {},
      children: [
        new Paragraph({
          children: [
            new TextRun("s"),
            ],
          }),
        ],
      });
  }
  else if(style == "bold"){
    x = 2;
  }
}

function skipLine(){
  y += 6;
}
