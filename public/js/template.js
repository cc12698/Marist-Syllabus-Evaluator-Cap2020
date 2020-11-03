//const docx = require("docx");

const lineLen = 100;
const lineNum = 20;

const pdf = new jsPDF();
const doc = new docx.Document();

var x = 10;
var y = 10;

var font = "times";

parts = [];

function createPDF(){

  InsName = document.getElementById("name").value;
  courseName = document.getElementById("courseName").value;
  courseDes = document.getElementById("courseDes").value;
  insEmail = document.getElementById("insEmail").value;
  insPhone = document.getElementById("insPhone").value;


  pdf.setFont("times" , "light")

  //write(InsName , "bold");
  write(courseName + "  " + InsName , "bold");
  skipLine();
  write("Instructor Contact:" , "bold");
  write(("E-mail: " + insEmail) , "light");
  write("Phone: " + insPhone , "light");
  skipLine();
  write("Course Description:" , "bold");
  write(courseDes , "light");
  skipLine();

  pdf.save(InsName + "_" + courseName + "_syllabus.pdf");

}

function createWord(){

  InsName = document.getElementById("name").value;
  courseName = document.getElementById("courseName").value;
  courseDes = document.getElementById("courseDes").value;
  insEmail = document.getElementById("insEmail").value;
  insPhone = document.getElementById("insPhone").value;
  preReq = document.getElementById("preReq").value;
  attenPol = document.getElementById("attenPol").value;
  acadHonest = document.getElementById("acadHonest").value;
  gradeDet = document.getElementById("gradeDet").value;
  assignments = document.getElementById("assignments").value;
  biblio = document.getElementById("biblio").value;
  teachAct = document.getElementById("teachAct").value;
  accommod = document.getElementById("accommod").value;

  doc.addSection({
    properties: {},
    children: [
      new docx.Paragraph({
        children: [
            new docx.TextRun({
              text: courseName,
              bold: true,
            }),
            new docx.TextRun("  " + InsName),
            new docx.TextRun("").break(),
            new docx.TextRun("").break(),
            new docx.TextRun({
              text: "Instructor Contact",
              bold: true,
            }),
            new docx.TextRun("").break(),
            new docx.TextRun({
              text: "E-mail: ",
              bold: true,
            }),
            new docx.TextRun(insEmail),
            new docx.TextRun("").break(),
            new docx.TextRun({
              text: "Phone: ",
              bold: true,
            }),
            new docx.TextRun(insPhone),
            new docx.TextRun("").break(),
            new docx.TextRun("").break(),
            new docx.TextRun({
              text: "Course Description",
              bold: true,
            }),
            new docx.TextRun("").break(),
            new docx.TextRun(courseDes),
            ],
          }),
        ],
      });

  docx.Packer.toBlob(doc).then(blob => {
    console.log(blob);
    saveAs(blob, (InsName + "_" + courseName + "_syllabus.docx"));
    console.log("Document created successfully");
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

/*
  //for word
  if(style == "light"){
    console.log("light section added");
    doc.addSection({
      properties: {},
      children: [
        new docx.Paragraph({
          text: s
          }),
        ],
      });
    }

  else if(style == "bold"){
    console.log("bold section added");
    doc.addSection({
      properties: {},
      children: [
        new docx.Paragraph({
          children: [
            new docx.TextRun(s),
            ],
          }),
        ],
      });
  }
*/
}

function skipLine(){
  y += 6;
}
