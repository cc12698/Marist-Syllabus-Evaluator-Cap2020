const multer = require("multer")
var fs = require('fs');

//store the uploaded file in uploads
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    console.log("TEST");
    var dir = './uploads';
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  }
});

module.exports.upload = multer({ storage: storage}).single('myFile');

// get file from index.ejs and send to 'uploads'
module.exports.uploadAsync = new Promise(function(resolve, reject) {
    try{
      multer({ storage: storage}).single('myFile');
      resolve();
    }
    catch(err){
      reject(err);
    }

});
