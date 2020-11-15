const fs = require('fs');
const path = require('path');
const natural = require('natural');
var Analyzer = natural.SentimentAnalyzer;
var stemmer = natural.PorterStemmer;
var analyzer = new Analyzer("English", stemmer, "afinn");
//var spellChecker = require('spellchecker');
const spawn = require("child_process").spawn;
const config = require('../../config');
const logger = config.log();
const spell = require('spell-checker-js')
spell.load('en');
spell.load('cus');
var numArr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
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
    data.output = ((sent-(-.2))/(.2-(-.2)))*100;
    console.log(data)
    return data;
  }catch(e){
    logger.error(`ERROR: ${e.code} - ${e.message}\n`);
  }
}

function spellCheckFile(arr){
  var misSpell = [];
  for(var i = 0; i < arr.length; i++){
    if(spell.check(arr[i]).length !== 0){
      misSpell.push(spell.check(arr[i])[0]);
    }
  }

  for(var v = 0; v < misSpell.length; v++){
      if(misSpell[v].match("[0-9]") != null){
	       console.log('fired');
        misSpell.splice(v, 1);
      }
    }
  
  return misSpell;
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
    var pythonProcess = spawn('python', [pyPath, paths]);
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
