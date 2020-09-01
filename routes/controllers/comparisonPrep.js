const spawn = require("child_process").spawn;

exports.postComparison = async function(req, res){
    try{
      const pythonProcess = spawn('python',["../python/compare.py"]);
      pythonProcess.stdout.on('data', (data) => {
        console.log(data);
      });
    }catch(error){
      console.log("error: " + error);
  }
}
