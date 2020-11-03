const spawn = require("child_process").spawn;
const fs = require('fs');
const paths = require('path');
const mammoth = require("mammoth");
const PDFParser = require("pdf2json");
const uuid = require('uuid-random')
const yauzl = require("yauzl");
const sentimentAnalyze = require("./sentimentAnalyzer");
const CloudConvert = require('cloudconvert');
const https = require('https');
const WordExtractor = require("word-extractor");


exports.makeTXT = function(path){
  try{
    var directoryPath = paths.normalize(__dirname + "/../../uploads");
    return new Promise((resolve, reject) => {
      fs.readdir(directoryPath, async function (err, files) {
        //listing all files using forEach
        for(const file of files){
          var allowDocx =  /(\.docx)$/i;
          var allowDoc =  /(\.doc)$/i;
          var allowPDF =  /(\.pdf)$/i;
          var allowPages =  /(\.pages)$/i;
          var filePath = "./uploads/" + file;

          if(allowDocx.exec(filePath)){
            resolve(docx(filePath, path));
          }
          else if(allowDoc.exec(filePath)){
            resolve(doc(filePath, path));
          }
          else if(allowPDF.exec(filePath)){
            resolve(pdf(filePath, path));
          }
          else if(allowPages.exec(filePath)){
            resolve(pages(filePath, path));
          }
        }
      });
    })
  }catch(err){
    console.log('err: ' + err);
  }
}



async function docx(file, path){
  return new Promise((resolve, reject) => {
    mammoth.extractRawText({path: file})
      .then(function(result){
        var text = result.value; // The raw text
        fs.writeFile(path, text, (err) => {
          if (err) throw err;
          console.log('The file has been saved!');
          resolve(sentimentAnalyze.getAnalyzer(path));
        });
      });
    });
}

async function doc(file, path){
  return new Promise((resolve, reject) => {
    var extractor = new WordExtractor();
    var extracted = extractor.extract(file);
    extracted.then(function(result) {
      var text = result.getBody();
      fs.writeFile(path, text, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
        resolve(sentimentAnalyze.getAnalyzer(path));
      });
    });
  });
}

async function pdf(file, path){
  return new Promise((resolve, reject) => {
    var pdfParser = new PDFParser(this,1);
    pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
    pdfParser.on("pdfParser_dataReady", pdfData => {
      fs.writeFile(path, pdfParser.getRawTextContent(), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
        resolve(sentimentAnalyze.getAnalyzer(path));
      });
    });
    pdfParser.loadPDF(file);
  });
}

async function pages(file, path){
    const cloudConvert = new CloudConvert('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiY2NiZDkxMTcxYjdiY2M1MGUwMDhkNTg2YmI1ZWVkOGNjZjRkYzg5ZjkyYjc0YTlkZjdkNGY0ODExMTI5Yzk5OWM3NjU4NjlkYjk3OWVkZTYiLCJpYXQiOjE2MDI3MjE3ODEsIm5iZiI6MTYwMjcyMTc4MSwiZXhwIjo0NzU4Mzk1MzgxLCJzdWIiOiI0NTg0NTczMyIsInNjb3BlcyI6WyJ1c2VyLnJlYWQiLCJ1c2VyLndyaXRlIiwidGFzay5yZWFkIiwidGFzay53cml0ZSIsIndlYmhvb2sucmVhZCIsIndlYmhvb2sud3JpdGUiLCJwcmVzZXQucmVhZCIsInByZXNldC53cml0ZSJdfQ.Sa_mCj4F6P7n1TmfSREGOX_fiT2wUXBg8k93_ZmxU_CSPzDhU7s_4yW-UGZ1LfaB-PmZBgSM-6Ayh4ozOTGSeUjcrmyVfoobypCSZkMRhrFL2AOPamC93_q1YIS0QVSKMrQ6cjhp9f8K_LjC_kLdhS9hW8Bn0etYsJ4lqstvfbUeU6Ipr9H3ld4-p9kFbGH2R-8cpv0Lfx37_bBRjp__AUxDb3Lg18tfdiWGpJhIZFI2sCdHvhx7gjebQ8JgZ1sWDV9QKj8j1oWwPXv-VpOUx7UQ8k_xfNaYuOx_Uc-YQkdOhQe0t-t5bPcsh1Pf0s_uFIzN53QD_1zyJsxbzt_w0YqkwsUSqLjRzzAKQgHX27dUjJfgALrwbRrIHMhLCBLUt4fRoJPEKcC1ZD87PH_4li6QqaNdD48ky9vngI39j66W2ua-OQusWwrRm0Gn_DbSZKBYktu_SerkANAijp4YQV7Mped_AMRiFeB-6fLQtK81Tun-d9YDNsLnZtJWsl0J9NQ4URTM__LmmdtNwqkjT5sUH91qo_xrdRYsyjUHh3bflZRAgDIR-DcinWBtkL9jPDnJrZl_ItwLjDEuoANkGei98eENkeSaPGza-m6OcnKnmf7q1VbT-S-9CKqxQ7i1esq9XhIwdqD_xTtgF7JymFLGSvCntvvcXgaMh_XrEw4');

    let job = await cloudConvert.jobs.create({
        tasks: {
          'upload-my-file': {
               operation: 'import/upload'
           },
         'convert-my-file': {
             operation: 'convert',
             input: 'upload-my-file',
             output_format: 'txt',
             some_other_option: 'value'
         },
         'export-my-file': {
             operation: 'export/url',
             input: 'convert-my-file'
         }
     }
    });

    const uploadTask = job.tasks.filter(task => task.name === 'upload-my-file')[0];
    const inputFile = fs.createReadStream(file);

    await cloudConvert.tasks.upload(uploadTask, inputFile, file);
    job = await cloudConvert.jobs.wait(job.id); // Wait for job completion

    const exportTask = job.tasks.filter(task => task.operation === 'export/url' && task.status === 'finished')[0];
    const outFile = exportTask.result.files[0];

    const writeStream = fs.createWriteStream(path);
    https.get(outFile.url, function (response) {
        response.pipe(writeStream);
    });

    await new Promise((resolve, reject) => {
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
        //resolve(sentimentAnalyze.getAnalyzer(path));
    });
}

function getPath(path){
  new Promise((resolve, reject) => {
    return fs.readdir(path, (err, filenames) => err != null ? reject(err) : resolve(filenames))
  });
}
