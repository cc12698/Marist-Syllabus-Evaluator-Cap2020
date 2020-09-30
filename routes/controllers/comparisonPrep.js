const spawn = require("child_process").spawn;
const fs = require('fs');
const path = require('path');
const mammoth = require("mammoth");
const PDFParser = require("pdf2json");
const uuid = require('uuid-random')
const yauzl = require("yauzl");
const sentimentAnalyze = require("./sentimentAnalyzer");
exports.postComparison = function(req, res){
  try{
    var directoryPath = path.normalize(__dirname + "/../../uploads");
    fs.readdir(directoryPath, function (err, files) {
      //handling error
      if (err) {
          return console.log('Unable to scan directory: ' + err);
      }
      var uuidCre = uuid();
      //listing all files using forEach
      files.forEach(function (file) {
        var allowDoc =  /(\.doc|\.docx)$/i;
        var allowPDF =  /(\.pdf)$/i;
        var allowPages =  /(\.pages)$/i;
        var filePath = "./uploads/" + file;

        if(allowDoc.exec(filePath)){
          doc(filePath, uuidCre);
        }
        else if(allowPDF.exec(filePath)){
          pdf(filePath, uuidCre);
        }
        else if(allowPages.exec(filePath)){
          pages(filePath)
        }
      });
    });
  }catch(err){
    console.log('err: ' + err);
  }
}

function callSnek(uuid){
  var dataToSend;
  var pyPath = path.normalize(path.join(__dirname, '/../python/search.py'));
  var file = path.normalize(path.join(__dirname, '/../../uploads/'+ uuid +'.txt'));
  var pythonProcess = spawn('python', [pyPath, file]);
  pythonProcess.stdout.on('data', (data) => {
    console.log('pipe data');
    dataToSend = data.toString();
  });

  pythonProcess.stdout.on('end', function(){
    console.log("test: " + dataToSend);
  });

  pythonProcess.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
  });

  return dataToSend;
}

async function doc(file, uuid){
  mammoth.extractRawText({path: file})
    .then(function(result){
        var text = result.value; // The raw text
        fs.writeFile('./uploads/'+ uuid +'.txt', text, (err) => {
          if (err) throw err;
          console.log('The file has been saved!');
          callSnek(uuid);
          sentimentAnalyze.getAnalyzer(uuid);
        });
    })
}

async function pdf(file, uuid){
  var pdfParser = new PDFParser(this,1);

  pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
  pdfParser.on("pdfParser_dataReady", pdfData => {
    fs.writeFile('./uploads/'+ uuid +'.txt', pdfParser.getRawTextContent(), (err) => {
      if (err) throw err;
      console.log('The file has been saved!');
      callSnek(uuid);
      sentimentAnalyze.getAnalyzer(uuid);
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
