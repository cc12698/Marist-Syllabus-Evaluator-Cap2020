const fs = require('fs');
const path = require('path');
const natural = require('natural');
var Analyzer = natural.SentimentAnalyzer;
var stemmer = natural.PorterStemmer;
var analyzer = new Analyzer("English", stemmer, "afinn");
var spellChecker = require('spellchecker');
const spawn = require("child_process").spawn;

exports.getAnalyzer = async function(paths){
  try{
    console.log('get analyzer called')
    console.log(paths)
    var data = new Object;
    switch(0){
      case 0:
        var arr = await txtToArray(paths);
      case 1:
        data.py = await callSnek(paths);
      case 2:
        data.sc = await spellCheckFile(arr);
      case 3:
        //if the number returned comes back negative it is a negative Statement
        //if it is a positiver number it is positive
        //greater the number the more positive it is and vice versa
        data.output = await analyzer.getSentiment(arr)
    }
    console.log(data)
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

function txtToArray(paths){
  var fileArray = fs.readFileSync(paths,'utf8').split(" ");
  return fileArray;
}

function callSnek(paths){
  var dataToSend;
  var pyPath = path.normalize(path.join(__dirname, '/../python/search.py'));
  var pythonProcess = spawn('python', [pyPath, paths]);
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
