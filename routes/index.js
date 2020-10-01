const express = require('express');
// const upload = require('express-fileupload');
var bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const dm = require('../dataManager');
var multer = require('multer');
const cors = require('cors');

var fs = require('fs');
const  compPrep = require('./controllers/comparisonPrep');
const config = require('../config');
var upload = multer({ dest: 'uploads/' })
var rimraf = require("rimraf");
var mime = require('mime-types')

const S3_BUCKET = process.env.S3_BUCKET;

const app = express();

app.use(fileUpload());
app.use(cors());

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const path = require('path');

app.use(express.static("public"));


app.get('/',function(req, res) {
  res.render('../views/signIn.ejs');
});

app.get('/index', function(req, res){
  res.render('../views/index')
});

app.get('/header', function(req, res){
  res.render('../views/header.ejs')
});

app.get('/headerLogin', function(req, res){
  res.render('../views/headerLogin.ejs')
});

app.get('/sampleSyllabi', function(req, res){
  res.render('../views/sampleSyllabi.ejs')
});

app.get('/footer', function(req, res){
  res.render('../views/footer.ejs')
});

app.get('/login', function(req, res){
  res.render('../views/signIn.ejs')
});

app.get('/mainmenu', function(req, res){
  res.render('../views/mainmenu.ejs')
});

app.get('/mainmenuAdmin', function(req, res){
  res.render('../views/mainmenuAdmin.ejs')
});

app.get('/selectUserRole', function(req, res){
  res.render('../views/selectUserRole.ejs')
});

app.get('/result', function(req, res){
  res.render('../views/results.ejs')
});

app.get('/uploadSampleSyllabi', function(req, res){
  res.render('../views/uploadSampleSyllabi.ejs')
});

app.get('/sampleSyllabiAdmin', function(req, res){
  dm.getBucketContents(S3_BUCKET)
    .then( (data) => {
      let content = {};
      content['syllabi'] = data;
      // console.log(content);
      res.render('../views/sampleSyllabiAdmin.ejs', content)
    })
    .catch( (err) => {
      var userErr = { 'code': 503, 'message':'An error has occurred retrieving bucket contents.'};
      res.status(503).send(userErr);
    });
});



app.get('/sampleSyllabi2', function(req, res){
  dm.getBucketContents(S3_BUCKET)
    .then( (data) => {
      let content = {};
      content['syllabi'] = data;
      // console.log(content);
      res.render('../views/sampleSyllabi2.ejs', content)
    })
    .catch( (err) => {
      var userErr = { 'code': 503, 'message':'An error has occurred retrieving bucket contents.'};
      res.status(503).send(userErr);
    });
});

app.get('/getSampleSyl', function (req,res,next) {
  dm.getBucketContents(S3_BUCKET)
    .then( (data) => {
      res.status(200).json(data);
    })
    .catch( (err) => {
      var userErr = { 'code': 503, 'message':'An error has occurred retrieving bucket contents.'};
      res.status(503).send(userErr);
    });
});


//upload a syllabus to be stored in 'uploads' folder
app.post('/uploadSyllabus', async (req, res) => {
    try {
      if(!req.files) {
          res.send({
              status: false,
              message: 'No file uploaded'
          });
      } else {
          let uploadedFile = req.files.myFile;

          var dir = './uploads/';
          if (!fs.existsSync(dir)){
              fs.mkdirSync(dir);
          }
          uploadedFile.mv(dir + uploadedFile.name);
          //send response
          res.send({
              status: true,
              message: 'File is uploaded',
              data: {
                  name: uploadedFile.name,
                  mimetype: uploadedFile.mimetype,
                  size: uploadedFile.size
              }
          });
          const test = await compPrep.postComparison();
      }
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post('/uploadSampleSyl', cors(), (req,res,next) => {
    // console.log(req.body);
    var dir;
    // console.log(req.files.sample_syl);
    var mimetype = mime.lookup(req.files.sample_syl.name);

    upload.single(req.files.sample_syl);
    try {
      if(!req.files) {
          res.send({
              status: false,
              message: 'No file uploaded'
          });
      } else {
          let uploadedFile = req.files.sample_syl;

          dir = './temp/';
          if (!fs.existsSync(dir)){
              fs.mkdirSync(dir);
          }
          uploadedFile.mv(dir + uploadedFile.name);
          //send response
      }
    } catch (err) {
        res.status(500).send(err);
    }

    var tempPath = './temp/' + req.body.fileNameSyl;

    // console.log(tempPath);

    try {
      dm.uploadSampleSyl(tempPath, req.body.fileNameSyl, mimetype);
      rimraf(dir, function () { console.log("done"); });
      res.send('Uploaded Successfully');

    } catch (err) {
        res.status(500).send(err);
    }

});

app.post('/deleteSampleSyl', cors(), (req,res,next) => {
  dm.deleteSyllabi(req.body.filename)
    .then(() => {
      dm.getBucketContents(S3_BUCKET)
        .then( (data) => {
          // console.log(data);
          let content = {};
          content['syllabi'] = data;

          res.render('../views/sampleSyllabi2.ejs', content)
        })
        .catch( (err) => {
          var userErr = { 'code': 503, 'message':'An error has occurred retrieving bucket contents.'};
          res.status(503).send(userErr);
        });
    })
    .catch( (err) => {
      var userErr = { 'code': 503, 'message':'An error has occurred retrieving bucket contents.'};
      res.status(503).send(userErr);
    });
});


app.listen(8080,() => console.log("running on port 8080: http://localhost:8080/"));
//nodemon server/capping.js to run
