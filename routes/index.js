const express = require('express');
const upload = require('express-fileupload');
const app = express();
const bodyParser = require('body-parser');
// app.use(bodyParser.json({type:'application/json'}));

app.use(upload());

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

app.get('/result' function(req, res){
  var spawn = require("child_process").spawn;
  var process = spawn('python', ["./"])
});

app.listen(1337,() => console.log("running on port 1337: http://localhost:1337/"));
//nodemon server/capping.js to run
