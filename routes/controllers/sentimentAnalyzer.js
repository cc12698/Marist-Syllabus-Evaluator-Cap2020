const fs = require('fs');
const path = require('path');
const natural = require('natural');
var Analyzer = natural.SentimentAnalyzer;
var stemmer = natural.PorterStemmer;
var analyzer = new Analyzer("English", stemmer, "afinn");
var spellChecker = require('spellchecker');

exports.getAnalyzer = async function(uuid){
  try{
    var data = new Object;
    var arr = await txtToArray(uuid);
    data.sc = await spellCheckFile(arr);

    //if the number returned comes back negative it is a negative Statement
    //if it is a positiver number it is positive
    //greater the number the more positive it is and vice versa
    data.output = analyzer.getSentiment(arr)
    console.log(data);
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
  var file = path.normalize(path.join(__dirname, '/../../uploads/'+ uuid +'.txt'));
  var fileArray = fs.readFileSync(file,'utf8').split(" ");
  return fileArray;
}
