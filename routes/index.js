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
var mime = require('mime-types');

const session = require('express-session');
var userSession;

const S3_BUCKET = process.env.S3_BUCKET;

const app = express();


app.use(session({secret: 'secret', saveUninitialized: true,resave: true}));

app.use(fileUpload());
app.use(cors());

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const path = require('path');

app.use(express.static("public"));


app.get('/',function(req, res) {
  userSession = req.session;
  if(!userSession.username && !userSession.role) {
      req.session.redirectTo = '/';
      res.redirect('/login');
  }
  else{
    if(userSession.role == 'admin'){
      res.redirect('/mainmenuAdmin');
    }
    else{
      res.redirect('/mainmenu');
    }
  }
  // res.render('../views/selectUserRole');

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

app.get('/sampleSyllabi2', function(req, res){
  userSession = req.session;
  if(!userSession.username && !userSession.role) {
      req.session.redirectTo = '/mainmenu';
      res.redirect('/login');
  }
  else{
    res.render('../views/sampleSyllabi2.ejs')
  }
});

app.get('/footer', function(req, res){
  res.render('../views/footer.ejs')
});

app.get('/login', function(req, res){
  userSession = req.session;
  if(!userSession.username && !userSession.role) {
      res.render('../views/signIn.ejs');
  }
  else{
    res.redirect('/');
  }
});

// get user info from DB
app.post('/login', function(req,res){
  userSession = req.session;
  var username = req.body.username.split('@');
  username = username[0];
  dm.getUserInfo(username).then( (data) => {
    // console.log(data[0].USER_ROLE);
    if(data.length == 0){
      let doc = {
          'USERNAME': username
      };
      dm.addUser(doc).then( () => {
        dm.getUserInfo(username).then( (data) => {
          var bucketName = 'user-syl-' + data[0].USER_ID;
          dm.createBucket(bucketName).then( () => {
            userSession.username = data[0].username;
            userSession.role = data[0].USER_ROLE;
            userSession.userid = data[0].USER_ID;
            var redirectTo = req.session.redirectTo ? req.session.redirectTo : '/';
            delete req.session.redirectTo;
            // is authenticated ?
            res.redirect(redirectTo);
          });
        })
      })
    }
    else{
      userSession.username = data[0].username;
      userSession.role = data[0].USER_ROLE;
      userSession.userid = data[0].USER_ID;

      var redirectTo = req.session.redirectTo ? req.session.redirectTo : '/';
      delete req.session.redirectTo;
      // is authenticated ?
      res.redirect(redirectTo);
    }

  })
  .catch( (err) => {
    var userErr = { 'code': 503, 'message':'An error has occurred retrieving user from database.'};
    res.status(503).send(userErr);
  });
});

app.get('/mainmenu', function(req, res){
  userSession = req.session;
  if(!userSession.username && !userSession.role) {
      req.session.redirectTo = '/mainmenu';
      res.redirect('/login');
  }
  else if(userSession.role == 'user'){
      res.render('../views/mainmenu.ejs');
  }
  else if(userSession.role == 'admin'){
      res.render('../views/mainmenuAdmin.ejs');
  }
  else{
    res.redirect('unauthorized');
  }
  // res.render('../views/mainmenu.ejs')
});

app.get('/template', function(req, res){
  userSession = req.session;
  if(!userSession.username && !userSession.role) {
      req.session.redirectTo = '/template';
      res.redirect('/login');
  }
  else {
      res.render('../views/template.ejs');
  }

  // res.render('../views/mainmenu.ejs')
});

// the main menu page *admins only*
app.get('/mainmenuAdmin', function(req, res){
  userSession = req.session;
  if(!userSession.username && !userSession.role) {
      req.session.redirectTo = '/mainmenuAdmin';
      res.redirect('/login');
  }
  else if(userSession.role == 'admin'){
      res.render('../views/mainmenuAdmin.ejs');
  }
  else{
    res.redirect('unauthorized');
  }
});

// select your user role - testing purposes only
app.get('/selectUserRole', function(req, res){
  userSession = req.session;
  // console.log(req.session.username);
  res.render('../views/selectUserRole.ejs')
});

app.get('/result', function(req, res){
  res.render('../views/results.ejs')
});

// unauthorized page
app.get('/unauthorized', function(req, res){
  res.render('../views/unauthorized.ejs')
});

// help page
app.get('/help', function(req, res){
  res.render('../views/help.ejs')
});

// logout page
app.get('/logout', function(req, res){
  req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.render('../views/logout.ejs');
    });

});

// the page to modify the selection of sample syllabi *admins only*
app.get('/modifySampleSyllabi', function(req, res){
  userSession = req.session;
  if(!userSession.username && !userSession.role) {
      req.session.redirectTo = '/modifySampleSyllabi';
      res.redirect('/login');
  }
  else if(userSession.role == 'admin'){
    dm.getBucketContents(S3_BUCKET)
      .then( (data) => {
        let content = {};
        content['syllabi'] = data;
        // console.log(content);
        res.render('../views/modifySampleSyllabi.ejs', content)
      })
      .catch( (err) => {
        var userErr = { 'code': 503, 'message':'An error has occurred retrieving bucket contents.'};
        res.status(503).send(userErr);
      });
  }
  else{
    res.redirect('unauthorized');
  }

});

// the page to modify the selection of user saved syllabi
app.get('/userSyllabi', function(req, res){
  userSession = req.session;
  if(!userSession.username && !userSession.role) {
      req.session.redirectTo = '/userSyllabi';
      res.redirect('/login');
  }
  else {
    var bucketName = 'user-syl-' + userSession.userid;
    dm.getBucketContents(bucketName)
      .then( (data) => {
        let content = {};
        content['syllabi'] = data;
        content['user'] = userSession;
        content['user']['bucketName'] = bucketName;
        // console.log(content['user']);
        // console.log(content);
        res.render('../views/userSyllabi.ejs', content)
      })
      .catch( (err) => {
        var userErr = { 'code': 503, 'message':'An error has occurred retrieving bucket contents.'};
        res.status(503).send(userErr);
      });
  }

});

// revised sample syllabi page
app.get('/sampleSyllabi', function(req, res){
  dm.getBucketContents(S3_BUCKET)
    .then( (data) => {
      let content = {};
      content['syllabi'] = data;
      // console.log(content);
      res.render('../views/sampleSyllabi.ejs', content)
    })
    .catch( (err) => {
      var userErr = { 'code': 503, 'message':'An error has occurred retrieving bucket contents.'};
      res.status(503).send(userErr);
    });
});

// testing function to get user info from db upon login
app.get('/user', function(req, res){
  userSession = req.session;
  if(!userSession.username) {
      return res.redirect('login');
  }

  dm.getUserInfo(userSession.username).then( (data) => {
    userSession.role = data[0].userrole;
    res.status(200).json(data);
  })
  .catch( (err) => {
    var userErr = { 'code': 503, 'message':'An error has occurred retrieving user from database.'};
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

          var mimetype = mime.lookup(uploadedFile.name);

          var tempPath = './uploads/' + uploadedFile.name;
          var bucketName = 'user-syl-' + userSession.userid;
          dm.uploadUserSyl(bucketName, tempPath, uploadedFile.name, mimetype, function(error){
            if(error){
              res.status(500).send(error);
            }

          });
          const test = await compPrep.postComparison();
          const getRes = await compPrep.getResults();
          res.redirect('/result');


          //send response
          /*res.send({
              status: true,
              message: 'File is uploaded',
              data: {
                  name: uploadedFile.name,
                  mimetype: uploadedFile.mimetype,
                  size: uploadedFile.size
              }
          });*/

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

    dm.uploadSampleSyl(tempPath, req.body.fileNameSyl, mimetype, function(error){
      if(error){
        res.status(500).send(error);
      }
      rimraf(dir, function () { console.log("done"); })
      dm.getBucketContents(S3_BUCKET)
        .then( (data) => {
          let content = {};
          content['syllabi'] = data;
          // console.log(content);
          res.redirect('modifySampleSyllabi');
        })
        .catch( (err) => {
          var userErr = { 'code': 503, 'message':'An error has occurred retrieving bucket contents.'};
          res.status(503).send(userErr);
        });
    });

});

app.post('/deleteSampleSyl', cors(), (req,res,next) => {
  dm.deleteSyllabi(req.body.filename)
    .then(() => {
      dm.getBucketContents(S3_BUCKET)
        .then( (data) => {
          // console.log(data);
          let content = {};
          content['syllabi'] = data;

          res.render('../views/sampleSyllabi.ejs', content)
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

// Delete a User Saved Syllabus
app.post('/deleteUserSyl', cors(), (req,res,next) => {
  var bucketName = 'user-syl-' + userSession.userid;
  dm.deleteUserSyllabi(bucketName, req.body.filename)
    .then(() => {
      dm.getBucketContents(bucketName)
        .then( (data) => {
          let content = {};
          content['syllabi'] = data;
          content['user'] = userSession;
          content['user']['bucketName'] = bucketName;
          // console.log(content['user']);
          // console.log(content);
          res.render('../views/userSyllabi.ejs', content)
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

app.get('/getUsers', function (req,res,next){

    dm.getUsers()
        .then( (data) => {
            res.status(200).json(data);
        })
        .catch( err => {
            var userErr = { 'code': 503, 'message':'An error has occurred accessing the database.'};
            res.status(503).send(userErr);
        });

});

// get all of the checklist items for testing
app.get('/getChecklist', function (req,res,next){

    dm.getChecklist()
        .then( (data) => {
            res.status(200).json(data);
        })
        .catch( err => {
            var userErr = { 'code': 503, 'message':'An error has occurred accessing the database.'};
            res.status(503).send(userErr);
        });

});

// get all of the checklist items for testing
app.get('/checklist', function(req, res){
  userSession = req.session;
  if(!userSession.username && !userSession.role) {
      req.session.redirectTo = '/checklist';
      res.redirect('/login');
  }
  else if(userSession.role == 'admin'){
    dm.getChecklist()
      .then( (data) => {
        let content = {};
        content['checklist'] = data;
        // console.log(content);
        res.render('../views/checklist.ejs', content)
      })
      .catch( (err) => {
        var userErr = { 'code': 503, 'message':'An error has occurred retrieving bucket contents.'};
        res.status(503).send(userErr);
      });
    }
    else{
      res.redirect('unauthorized');
    }
});

// update DB checklist
app.post('/updateChecklist', function(req,res){
  let keys = Object.keys(req.body);
  let doc = {
      'ITEMS': keys
  };
  dm.updateChecklist(doc)
      .then(() => {
        res.redirect('checklist');
      })
      .catch( err => {
        var userErr = { 'code': 503, 'message':'An error has occurred accessing the database.'};
      });

});

app.listen(8080,() => console.log("running on port 8080: http://localhost:8080/"));
//nodemon server/capping.js to run
