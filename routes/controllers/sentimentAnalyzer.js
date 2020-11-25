const fs = require('fs');
const path = require('path');
const natural = require('natural');
var Analyzer = natural.SentimentAnalyzer;
var stemmer = natural.PorterStemmer;
var analyzer = new Analyzer("English", stemmer, "afinn");
const spawn = require("child_process").spawn;
const config = require('../../config');
const logger = config.log();
const spell = require('spell-checker-js')
spell.load('en');
spell.load({ input: './newDic.txt' });
var numArr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
//calls several analysis functions to return to the results page
exports.getAnalyzer = async function(paths){
  try{
    var data = new Object;
    var arr = await txtToArray(paths);
    data.py = await callSnek(paths);
    data.sc = await spellCheckFile(arr);
    var sent = await analyzer.getSentiment(arr);
    if(sent > .2){
      sent = .2;
    }else if(sent < -.2){
      sent = -.2
    }
    //normalizes the sentiment analysis data
    data.output = ((sent-(-.2))/(.2-(-.2)))*100;
    console.log(data)
    return data;
  }catch(e){
    logger.error(`ERROR: ${e.code} - ${e.message}\n`);
  }
}

//returns an array of misSpelled words
function spellCheckFile(arr){
  var misSpell = [];
  for(var i = 0; i < arr.length; i++){
    if(spell.check(arr[i]).length !== 0){
      misSpell.push(spell.check(arr[i])[0]);
    }
  }
  console.log(misSpell.length)
  for(var v = 0; v < misSpell.length; v++){
    for(var z = 0; z < numArr.length; z++){
      if(misSpell[v].includes(numArr[z])){
        misSpell[v] = null;
        break;
        }
      }
    }

    var filtered = misSpell.filter(function (el) {
      return el != null;
    });
    console.log(filtered.length);
    console.log(filtered);
  return filtered;
}

//converts the txt file to an array of words to be analyzed
function txtToArray(paths){
  console.log('txt to arr called')
  var fileArray = fs.readFileSync(paths,'utf8').split(" ");
  return fileArray;
}

//calls the python program in order to do the main analysis portion and to return a grade
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
     //console.log(dataToSend);
      resolve(JSON.parse(dataToSend));
    });
  });
}
