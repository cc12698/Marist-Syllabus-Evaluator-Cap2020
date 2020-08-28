const express = require('express');
const upload = require('express-fileupload');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json({type:'application/json'}));
app.use(express.static('client/public'));
app.use(upload());

app.get('/', function(req, res){
  res.sendFile('index.html', {root: './client/views'})
});

app.get('/index.html', function(req, res){
  res.sendFile('index.html', {root: './client/views'})
});

app.get('/header', function(req, res){
  res.sendFile('header.html', {root: './client/views'})
});

app.get('/footer', function(req, res){
  res.sendFile('footer.html', {root: './client/views'})
});

var docAdd = require('./controllers/doc');
app.route('/api/sendDoc/doc')
  .post(docAdd.saveDoc);

app.listen(1337,() => console.log("running on port 1337: http://localhost:1337/"));
//nodemon server/capping.js to run
