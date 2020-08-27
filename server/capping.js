const express = require('express');
const app = express();

app.use(express.static('client/public'));

app.get('/', function(request, response){
  response.sendFile('index.html', {root: './client/views'})
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

app.listen(1337,() => console.log("running on port 1337: http://localhost:1337/"));
//nodemon server/capping.js to run
