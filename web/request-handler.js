/*jshint node:true */

var archive = require('../helpers/archive-helpers');
var path = require('path');

exports.handleGetRequest = function (req, res) {
  var url = req.baseUrl.slice(1);
  console.log('URL: ', url);
  console.log('URL: ', req.url);
  console.log(archive.isUrlInList(url));
  console.log(archive.isURLArchived(url));
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
  console.log('url: ' + req.param('url'));
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

