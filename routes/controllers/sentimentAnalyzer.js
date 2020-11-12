const fs = require('fs');
const path = require('path');
const natural = require('natural');
var Analyzer = natural.SentimentAnalyzer;
var stemmer = natural.PorterStemmer;
var analyzer = new Analyzer("English", stemmer, "afinn");
var spellChecker = require('spellchecker');
const spawn = require("child_process").spawn;
const config = require('../../config');
const logger = config.log();

exports.getAnalyzer = async function(paths){
  try{
    var data = new Object;
    var arr = await txtToArray(paths);
    var py = await callSnek(paths);
    console.log(py);
    if(py == undefined){
      data.py = 'err'
    }else{
      data.py = py
    }
    data.sc = await spellCheckFile(arr);
    var sent = await analyzer.getSentiment(arr);
    if(sent > .2){
      sent = .2;
    }else if(sent < -.2){
      sent = -.2
    }
    data.output = ((sent-(-.2))/(.2-(-.2)))*100;
    console.log(data)
    return data;
  }catch(e){
    logger.error(`ERROR: ${e.code} - ${e.message}\n`);
  }
}

function spellCheckFile(arr){
console.log('spell check called')
  var mispelled = [], spellCheckArr = [];
  var mispelledObj = new Object();
  for(var i = 0; i < arr.length; i++){
    var spellCheckerTest = spellChecker.isMisspelled(arr[i]);
    if(spellCheckerTest){
      mispelled.push(arr[i]);
      //spellCheckArr.push(spellChecker.getCorrectionsForMisspelling(arr[i]));
    }
  }
  mispelledObj.mispelled = mispelled;
  mispelledObj.spellCheckArr = spellCheckArr;
  return mispelledObj;
}

function txtToArray(paths){
  console.log('txt to arr called')
  var fileArray = fs.readFileSync(paths,'utf8').split(" ");
  return fileArray;
}

function callSnek(paths){
  console.log('spython called')
  return new Promise((resolve, reject) => {
    var dataToSend = '';
    var pyPath = path.normalize(path.join(__dirname, '/../python/search.py'));
    var pythonProcess = spawn('python3', [pyPath, paths]);
    pythonProcess.stdout.on('data', (data) => {
      dataToSend += data;
    });
    pythonProcess.stderr.on('data', (data) => {
       console.log(data.toString());
       reject(data.toString());
   });
   pythonProcess.on('close', function (code) {
     console.log(dataToSend);
      resolve(JSON.parse(dataToSend));
  });

  });
}
