const multer = require("multer")
var fs = require('fs');
const config = require('../config');
const AWS = require('aws-sdk');
var cos = config.cos;
var bodyParser = require('body-parser');

//store the uploaded file in uploads
module.exports.storage = multer.diskStorage({
  filename: (req, file, cb)=>{
    cb(null, Date.now() + file.originalname)
  }
});

// get file from index.ejs and send to 'uploads'
module.exports.upload = multer({ storage: module.exports.storage}).single('sample_syl');

module.exports.getBucketContents = (bucketName) => {
    // logger.info(`Retrieving bucket contents from: ${bucketName}`);
    return cos.listObjects(
        {Bucket: bucketName},
    ).promise()
    .then((data) => {
        return data.Contents;
    })
    .catch((e) => {
        logger.error(`ERROR: ${e.code} - ${e.message}\n`);
    });
}

module.exports.uploadSampleSyl = (filePath, fileName, mimetype, callback) => {
  var fileName = fileName;
  var filePath = filePath;
  const uploadFile = () => {
  fs.readFile(filePath, (err, data) => {
  if (err) callback(err);
  const params = {
           Bucket: 'sample-syl', // pass your bucket name
           Key: fileName, // file will be saved
           Body: data,
           ContentType: mimetype,
  };
  cos.upload(params, function(s3Err, data) {
  if (s3Err) throw s3Err
  console.log(`File uploaded successfully at ${data.Location}`)
  var location = data.Location;
  return callback();

       });
    });
  };
  uploadFile();
}

module.exports.deleteSyllabi = (fileName) => {
    var params = {  Bucket: 'sample-syl', Key: fileName };
    return cos.deleteObject(params)
      .promise()
    .then((data) => {
        return data.Contents;
    })
    .catch((e) => {
        console.log(e);
    });
}
