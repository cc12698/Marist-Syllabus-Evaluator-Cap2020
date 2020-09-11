const express = require('express');
// const upload = require('express-fileupload');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const fileUpload = require('express-fileupload');
const dm = require('../dataManager');
var multer = require('multer');
var fs = require('fs');
const  compPrep = require('./controllers/comparisonPrep');

app.use(fileUpload());

// app.use(upload());

app.set('view engine', 'ejs');

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

app.get('/footer', function(req, res){
  res.render('../views/footer.ejs')
});

app.get('/login', function(req, res){
  res.render('../views/signIn.ejs')
});

app.get('/mainmenu', function(req, res){
  res.render('../views/mainmenu.ejs')
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

// app.post('/uploadSyllabus',function(req,res){
//     dm.upload(req,res,function(err) {
//         if(err) {
//             return res.end(err.toString());
//         }
//         console.log(req.file)
//         res.end("File is uploaded");
//     });
// });

app.listen(1337,() => console.log("running on port 1337: http://localhost:1337/"));
//nodemon server/capping.js to run
