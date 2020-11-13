//const docx = require("docx");

const lineLen = 100;
const lineNum = 20;

const pdf = new jsPDF();
const doc = new docx.Document();

var x = 10;
var y = 20;

var font = "times";

parts = [];

function createPDF(){

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
  write("Pre Requisites:" , "bold");
  write(preReq , "light");
  skipLine();
  write("Attendance Policy:" , "bold");
  write(attenPol , "light");
  skipLine();
  write("Statement on Academic Honesty:" , "bold");
  write(acadHonest , "light");
  skipLine();
  write("Basis of Grade Determination:" , "bold");
  write(gradeDet , "light");
  skipLine();
  write("Assignments:" , "bold");
  write(assignments , "light");
  skipLine();
  write("Sources / Other Resources:" , "bold");
  write(biblio , "light");
  skipLine();
  write("TEACH Act Disclosure:" , "bold");
  write(teachAct , "light");
  skipLine();
  write("Accommodations & Assesibilty Statement:" , "bold");
  write(accommod , "light");
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
            new docx.TextRun("").break(),
            new docx.TextRun({
              text: "Pre Requisites",
              bold: true,
            }),
            new docx.TextRun("").break(),
            new docx.TextRun(preReq),
            new docx.TextRun("").break(),
            new docx.TextRun("").break(),
            new docx.TextRun({
              text: "Attendence Policy",
              bold: true,
            }),
            new docx.TextRun("").break(),
            new docx.TextRun(attenPol),
            new docx.TextRun("").break(),
            new docx.TextRun("").break(),
            new docx.TextRun({
              text: "Statement on Academic Honesty",
              bold: true,
            }),
            new docx.TextRun("").break(),
            new docx.TextRun(acadHonest),
            new docx.TextRun("").break(),
            new docx.TextRun("").break(),
            new docx.TextRun({
              text: "Basis of Grade Determination",
              bold: true,
            }),
            new docx.TextRun("").break(),
            new docx.TextRun(gradeDet),
            new docx.TextRun("").break(),
            new docx.TextRun("").break(),
            new docx.TextRun({
              text: "Assignments",
              bold: true,
            }),
            new docx.TextRun("").break(),
            new docx.TextRun(assignments),
            new docx.TextRun("").break(),
            new docx.TextRun("").break(),
            new docx.TextRun({
              text: "Sources",
              bold: true,
            }),
            new docx.TextRun("").break(),
            new docx.TextRun(biblio),
            new docx.TextRun("").break(),
            new docx.TextRun("").break(),
            new docx.TextRun({
              text: "TEACH Act Disclosure",
              bold: true,
            }),
            new docx.TextRun("").break(),
            new docx.TextRun(teachAct),
            new docx.TextRun("").break(),
            new docx.TextRun("").break(),
            new docx.TextRun({
              text: "Accommadations & Accesibility Statement",
              bold: true,
            }),
            new docx.TextRun("").break(),
            new docx.TextRun(accommod),
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

function write(s){
  write(s , "light" , 12);
}

function write(s , style){
  write(s , style , 12);
}

function write(s , style , fSize){
  //for pdf
  pdf.setFont(font , style);
  pdf.setFontSize(fSize);

  var lines = pdf.splitTextToSize(s , 180);
  pdf.text(lines , x , y);

  y += 6 * lines.lengthb + fontBuff(fsize);

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

function fontBuff(f){
  if (f <= 12){
    return 0;
  }
  else{
    return (f - 12);
  }
}

function skipLine(){
  y += 6;
}
