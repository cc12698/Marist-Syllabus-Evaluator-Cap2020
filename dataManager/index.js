const multer = require("multer")

//store the uploaded file in uploads
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  }
});

//get file from index.ejs and send to 'uploads'
module.exports.upload = multer({ storage : storage}).single('myFile');
