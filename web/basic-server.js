/*jshint node:true */

var handler = require('./request-handler');
var express = require('express');
var app = express();

app
  .use(express.static(__dirname+'/public'))
  .use('*', handler.handleRequest);
  // .use('*',function(req,res){
  //   res.status(404).send('404 Not Found');
  // });

app.listen(8080);
