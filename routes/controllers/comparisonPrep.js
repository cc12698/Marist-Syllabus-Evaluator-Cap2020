/*const spawn = require("child_process").spawn;
const pythonProcess = spawn('python3',["../python/compare.py"]);
pythonProcess.stdout.on('data', (data) => {
  console.log(data.toString());
});*/
const fs = require('fs');
const path = require('path');

exports.postComparison = function(req, res){
  console.log('fired');
  var directoryPath = path.normalize(__dirname + "/../../uploads");
  fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    //listing all files using forEach
    files.forEach(function (file) {
      var filePath = "./uploads/" + file;
      fs.readFile(filePath, function(err, data){
        if (err) {
          return console.error(err);
       }
       console.log("Asynchronous read: " + data.toString());
      });
      console.log(file);
    });
});


  res.setHeader('Content-Type', 'application/JSON');
  res.send();
}
