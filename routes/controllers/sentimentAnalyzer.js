const fs = require('fs');
const path = require('path');
const natural = require('natural');
var Analyzer = natural.SentimentAnalyzer;
var stemmer = natural.PorterStemmer;
var analyzer = new Analyzer("English", stemmer, "afinn");

exports.getAnalyzer = async function(uuid){
  try{
    var arr = await txtToArray(uuid);
    //if the number returned comes back negative it is a negative Statement
    //if it is a positiver number it is positive
    //greater the number the more positive it is and vice versa
    var output = analyzer.getSentiment(arr)
    console.log(output);
    return output;
  }catch(error){
    console.log(error);
  }
}

function txtToArray(uuid){
  var file = path.normalize(path.join(__dirname, '/../../uploads/'+ uuid +'.txt'));
  var fileArray = fs.readFileSync(file,'utf8').split(" ");
  return fileArray;
}
