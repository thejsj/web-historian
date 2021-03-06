/*jshint node:true */

var handler = require('./request-handler');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app
  .use(express.static(__dirname+'/public'))
  .get('*', handler.handleGetRequest)
  .post('*', handler.handlePostRequest);

app.listen(8080);
