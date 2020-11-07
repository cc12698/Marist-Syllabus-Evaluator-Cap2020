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
    logger.info(data);
    return data;
  }catch(e){
    logger.error(`ERROR: ${e.code} - ${e.message}\n`);
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
  return new Promise((resolve, reject) => {
    var dataToSend;
    var pyPath = path.normalize(path.join(__dirname, '/../python/search.py'));
    paths = path.normalize(path.join(__dirname, '/../../'+paths));
    var pythonProcess = spawn('python', [pyPath, paths]);
    pythonProcess.stdout.on('data', (data) => {
      resolve(JSON.parse(data));
    });
  });
}
