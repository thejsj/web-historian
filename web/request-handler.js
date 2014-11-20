/*jshint node:true */

var archive = require('../helpers/archive-helpers');

exports.handleRequest = function (req, res) {
  if (archive.isUrlInList(req.url) && archive.isURLArchived(req.url)) {
    // Find File
    res.status(200).sendFile(__dirname + '/../archives/sites/' + req.url);
  } else {
    // Not in the list
    if (archive.isUrlInList(req.url)) {
      archive.addUrlToList(req.url);
    }
    res.writeHead(302, {
      'Location': '/loading.html'
    });
    res.end();
  }
};
