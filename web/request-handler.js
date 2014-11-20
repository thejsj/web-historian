/*jshint node:true */

var archive = require('../helpers/archive-helpers');
var path = require('path');

exports.handleGetRequest = function (req, res) {
  var url = req.url.slice(1);
  if (archive.isUrlInList(url) && archive.isURLArchived(url)) {
    // Find File
    var pathname = path.resolve(__dirname + '/../archives/sites/' + url);
    res
      .status(200)
      .type('html')
      .sendFile(pathname);
  } else {
    res.status(404).send('404 Page Not Found');
  }
};

exports.handlePostRequest = function (req, res) {

  var body = '';
  var url = req.param('url');
  if (archive.isUrlInList(url) && archive.isURLArchived(url)) {
    // Find File
    var pathname = path.resolve(__dirname + '/../archives/sites/' + url);
    res
      .status(200)
      .type('html')
      .sendFile(pathname);
  } else {
    // Not in the list
    if (!archive.isUrlInList(url) ) {
      archive.addUrlToList(url);
    }
    res.writeHead(302, {
      'Location': '/loading.html'
    });
    res.end();
  }

};

