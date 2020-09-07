/*const spawn = require("child_process").spawn;
const pythonProcess = spawn('python3',["../python/compare.py"]);
pythonProcess.stdout.on('data', (data) => {
  console.log(data.toString());
});*/
const fs = require('fs');

exports.postComparison = function(req, res){
  fs.readFile(,function(err, data){

  });
  res.setHeader('Content-Type', 'application/JSON');
  res.send();
}
