const express = require('express');
// const upload = require('express-fileupload');
var bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const dm = require('../dataManager');
var multer = require('multer');
const cors = require('cors');
const uuid = require('uuid-random')
var fs = require('fs');
const  compPrep = require('./controllers/comparisonPrep');
const config = require('../config');
var upload = multer({ dest: 'uploads/' })
var rimraf = require("rimraf");
var mime = require('mime-types');
const logger = config.log();

const session = require('express-session');
var userSession;
const passport = require('passport');
const WebAppStrategy = require("ibmcloud-appid").WebAppStrategy;
const userProfileManager = require("ibmcloud-appid").UserProfileManager;

const S3_BUCKET = process.env.S3_BUCKET;

const app = express();

app.use(session({secret: 'secret', saveUninitialized: true,resave: true}));
app.use(passport.initialize());
app.use(passport.session());

app.use(fileUpload());
app.use(cors());

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const path = require('path');

app.use(express.static("public"));

passport.use(new WebAppStrategy({
  tenantId: process.env.TENANT_ID,
  clientId: process.env.CLIENT_ID,
  secret: process.env.SECRET,
  oauthServerUrl: process.env.OAUTH_SERVER_URL,
  redirectUri: process.env.REDIRECT_URL
}));

passport.serializeUser(function(user, cb) {
 cb(null, user);
 });

passport.deserializeUser(function(obj, cb) {
 cb(null, obj);
 });

app.get('/ibm/cloud/appid/callback', passport.authenticate(WebAppStrategy.STRATEGY_NAME));

app.use(passport.authenticate(WebAppStrategy.STRATEGY_NAME));

// Used for testing purposes to get the user info after login
app.get('/api/user', function(req, res){
  // console.log(req.user)
  if(req.user){
    res.json({
      user:{
        name: req.user.name,
        email: req.user.email
      }
    });
  }
  else{
    res.redirect('/unauthorized');
  }

});


app.get('/', function(req, res) {
  userSession = req.session;
  if(!userSession.username && !userSession.role) {
      userSession = req.session;
      // var username = req.body.username.split('@');
      // username = username[0];
      dm.getUserInfo(req.user.email).then( (data) => {
        var username = req.user.email;
        // console.log(data[0].USER_ROLE);
        if(data.length == 0){
          let doc = {
              'USERNAME': req.user.email
          };
          dm.addUser(doc).then( () => {
            dm.getUserInfo(username).then( (data) => {
              var bucketName = 'user-syl-' + data[0].USER_ID;
              console.log(bucketName);
              dm.createBucket(bucketName).then( () => {
                console.log('done');
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
          userSession.username = data[0].USERNAME;
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

  }
  else{
    if(userSession.role == 'admin'){
      res.redirect('/mainmenuAdmin');
    }
    else{
      res.redirect('/mainmenu');
    }
  }

});

app.get('/index', function(req, res){
  userSession = req.session
  if(!userSession.username && !userSession.role) {
      req.session.redirectTo = '/index';
      res.redirect('/');
  }
  else{
    if (fs.existsSync('./uploads/')){ rimraf('./uploads/', function () {logger.info('deleted');})}
    res.render('../views/index.ejs')
  }
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
      req.session.redirectTo = '/sampleSyllabi2';
      res.redirect('/');
  }
  else{
    res.render('../views/sampleSyllabi2.ejs')
  }
});

app.get('/footer', function(req, res){
  res.render('../views/footer.ejs')
});

// Main Menu Page -> redirects according to user role
app.get('/mainmenu', function(req, res){
  userSession = req.session;
  if(!userSession.username && !userSession.role) {
      req.session.redirectTo = '/mainmenu';
      res.redirect('/');
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

// Build Syllabus from template
app.get('/template', function(req, res){
  userSession = req.session;
  if(!userSession.username && !userSession.role) {
      req.session.redirectTo = '/template';
      res.redirect('/');
  }
  else {
      res.render('../views/template.ejs');
  }
});

// The main menu page *admins only*
app.get('/mainmenuAdmin', function(req, res){
  userSession = req.session;
  if(!userSession.username && !userSession.role) {
      req.session.redirectTo = '/mainmenuAdmin';
      res.redirect('/');
  }
  else if(userSession.role == 'admin'){
      res.render('../views/mainmenuAdmin.ejs');
  }
  else if(userSession.role == 'user'){
      res.render('../views/mainmenu.ejs');
  }
  else{
    res.redirect('unauthorized');
  }
});

// Results Page After Submitting Syllabus
app.get('/result', async function(req, res){
  userSession = req.session;
  if(!userSession.username && !userSession.role) {
      req.session.redirectTo = '/result';
      res.redirect('/');
  }
  else {

      res.render('../views/results.ejs')
  }
});

// Unauthorized page
app.get('/unauthorized', function(req, res){
  res.render('../views/unauthorized.ejs')
});

// Help page
app.get('/help', function(req, res){
  userSession = req.session;
  if(!userSession.username && !userSession.role) {
      req.session.redirectTo = '/result';
      res.redirect('/');
  }
  else {
      res.render('../views/help.ejs')
  }
});

// Logout page
app.get('/logout', function(req, res){
  req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.render('../views/logout.ejs');
    });

});

// Modify the selection of sample syllabi *admins only*
app.get('/modifySampleSyllabi', function(req, res){
  userSession = req.session;
  if(!userSession.username && !userSession.role) {
      req.session.redirectTo = '/modifySampleSyllabi';
      res.redirect('/');
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

// Modify the selection of user saved syllabi
app.get('/userSyllabi', function(req, res){
  userSession = req.session;
  if(!userSession.username && !userSession.role) {
      req.session.redirectTo = '/userSyllabi';
      res.redirect('/');
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

// Sample Syllabi Page
app.get('/sampleSyllabi', function(req, res){
  userSession = req.session;
  if(!userSession.username && !userSession.role) {
      req.session.redirectTo = '/sampleSyllabi';
      res.redirect('/');
  }
  else{
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
  }
});

// Testing function to get user info from db upon login
app.get('/user', function(req, res){
  userSession = req.session;
  if(!userSession.username) {
      return res.redirect('/');
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

// Upload a syllabus to be stored in 'uploads' folder
app.post('/uploadSyllabus', async (req, res) => {
    try {
      if(!req.files) {
          res.send({
              status: false,
              message: 'No file uploaded'
          });
      } else {
        var dir = './uploads/';
        let uploadedFile = req.files.myFile;
        var uuidCre = uuid();
        var pathsVal  = './uploads/'+ uuidCre +'.txt';
        switch(0){
          case 0:
            if (!fs.existsSync(dir)){ fs.mkdirSync(dir); logger.info('created')}
          case 1:
            upload.single(req.files.myFile);

            uploadedFile.mv(dir + uploadedFile.name);
            var mimetype = mime.lookup(uploadedFile.name);
            var tempPath = './uploads/' + uploadedFile.name;
            var bucketName = 'user-syl-' + userSession.userid;
            dm.uploadUserSyl(bucketName, tempPath, uploadedFile.name, mimetype)
             .then( () => {

               var test = compPrep.makeTXT(pathsVal);
               test.then(function(val){
                   logger.info(val);
                   let content = {};
                   content['data'] = val;
                   res.render('../views/results.ejs', content)
                 })
                 .catch( (err) => {
                   res.status(503).send(err);
                 });
             })
             .catch( (err) => {
               res.status(503).send(err);
             });

        }
      }
    } catch (err) {
        res.status(500).send(err);
    }
});

// Upload a Sample Syllabi *admins only*
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

// Remove a Sample Syllabi *admins only*
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

// Delete a User Saved Syllabus
app.post('/removeAll', cors(), (req,res,next) => {
  var bucketName = 'user-syl-' + userSession.userid;
  dm.emptyBucket(bucketName)
    .then(() => {
      res.redirect('userSyllabi')
    })
    .catch( (err) => {
      var userErr = { 'code': 503, 'message':'An error has occurred retrieving bucket contents.'};
      res.status(503).send(userErr);
    });
});

// Retrieve the Checklist page *admins only*
app.get('/checklist', function(req, res){
  userSession = req.session;
  if(!userSession.username && !userSession.role) {
      req.session.redirectTo = '/checklist';
      res.redirect('/');
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

// Update Checklist Items *admin only*
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
