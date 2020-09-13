/*const spawn = require("child_process").spawn;
const pythonProcess = spawn('python3',["../python/compare.py"]);
pythonProcess.stdout.on('data', (data) => {
  console.log(data.toString());
});*/
const fs = require('fs');
const path = require('path');
const mammoth = require("mammoth");
const PDFParser = require("pdf2json");
const uuid = require('uuid-random')
const yauzl = require("yauzl");

exports.postComparison = function(req, res){
  console.log('fired');
  var directoryPath = path.normalize(__dirname + "/../../uploads");
  fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    //listing all files using forEach
    files.forEach(function (file) {
      var allowDoc =  /(\.doc|\.docx)$/i;
      var allowPDF =  /(\.pdf)$/i;
      var allowPages =  /(\.pages)$/i;
      var filePath = "./uploads/" + file;
      if(allowDoc.exec(filePath)){
        doc(filePath);
      }
      else if(allowPDF.exec(filePath)){
        pdf(filePath);
      }
      else if(allowPages.exec(filePath)){
        pages(filePath)
      }
    });
  });
}

async function doc(file){
  mammoth.extractRawText({path: file})
    .then(function(result){
        var text = result.value; // The raw text
        fs.writeFile('./uploads/'+ uuid() +'.txt', text, (err) => {
          if (err) throw err;
          console.log('The file has been saved!');
        });
    })
}

async function pdf(file){
  var pdfParser = new PDFParser(this,1);

  pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
  pdfParser.on("pdfParser_dataReady", pdfData => {
    console.log(pdfParser.getRawTextContent());
    fs.writeFile('./uploads/'+ uuid() +'.txt', pdfParser.getRawTextContent(), (err) => {
      if (err) throw err;
      console.log('The file has been saved!');
    });
  });

  pdfParser.loadPDF(file);
}

async function pages(file){
  file = file.substr(0, file.lastIndexOf(".")) + ".zip";
  fs.writeFile(file, file, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
  var test = await unzip(file);
}

function unzip(file){
  console.log(file);
  yauzl.open(file, {lazyEntries: true}, function(err, zipfile) {
    if (err) throw err;
    zipfile.readEntry();
    zipfile.on("entry", function(entry) {
      if (/\/$/.test(entry.fileName)) {
        // Directory file names end with '/'.
        // Note that entires for directories themselves are optional.
        // An entry's fileName implicitly requires its parent directories to exist.
        zipfile.readEntry();
      } else {
        // file entry
        zipfile.openReadStream(entry, function(err, readStream) {
          if (err) throw err;
          readStream.on("end", function() {
            zipfile.readEntry();
          });
          readStream.pipe(somewhere);
        });
      }
    });
  });
}