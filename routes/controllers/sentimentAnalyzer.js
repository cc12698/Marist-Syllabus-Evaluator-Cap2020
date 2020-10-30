const fs = require('fs');
const path = require('path');
const natural = require('natural');
var Analyzer = natural.SentimentAnalyzer;
var stemmer = natural.PorterStemmer;
var analyzer = new Analyzer("English", stemmer, "afinn");
var spellChecker = require('spellchecker');
const spawn = require("child_process").spawn;

exports.getAnalyzer = async function(uuid){
  try{
    console.log(uuid)
    var data = new Object;
    var arr = await txtToArray(uuid);
    data.py = await callSnek(uuid);
    data.sc = await spellCheckFile(arr);
    //if the number returned comes back negative it is a negative Statement
    //if it is a positiver number it is positive
    //greater the number the more positive it is and vice versa
    data.output = await analyzer.getSentiment(arr)
    return data;
  }catch(error){
    console.log(error);
  }
}

function spellCheckFile(arr){
  var mispelled = [], spellCheckArr = [];
  var mispelledObj = new Object();
  for(var i = 0; i < arr.length; i++){
    var spellCheckerTest = spellChecker.isMisspelled(arr[i]);
    if(spellCheckerTest){
      mispelled.push(arr[i]);
      spellCheckArr.push(spellChecker.getCorrectionsForMisspelling(arr[i]));
    }
  }
  mispelledObj.mispelled = mispelled;
  mispelledObj.spellCheckArr = spellCheckArr;
  return mispelledObj;
}

function txtToArray(uuid){
  var file = path.normalize(path.join(__dirname, '/../.'+ uuid));
  var fileArray = fs.readFileSync(file,'utf8').split(" ");
  return fileArray;
}

function callSnek(uuid){
  var dataToSend;
  var pyPath = path.normalize(path.join(__dirname, '/../python/search.py'));
  var file = path.normalize(path.join(__dirname, '/../.'+ uuid));
  var pythonProcess = spawn('python', [pyPath, file]);
  pythonProcess.stdout.on('data', (data) => {
    dataToSend = data.toString();
  });

  pythonProcess.stdout.on('end', function(){
    console.log("test: " + dataToSend);
  });

  pythonProcess.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
  });

}
