/*jshint node:true */
// eventually, you'll have some code here that uses the code in `archive-helpers.js`
// to actually download the urls you want to download.
var archiveHelpers = require('../helpers/archive-helpers');
var request = require('request');
var fs = require('fs');
var path = require('path');

var fetchAllUrls = function (downloadUrls) {
  downloadUrls.forEach(function (url) {
    // Fetch URL
    request('http://' + url, function(error, res, body){
      // Save contents to archives
      var pathname = path.resolve(__dirname + '/../archives/sites/' + url);
      fs.writeFile(pathname, body, function (err) {
        // Mark as archived
        if (err) throw err;
        archiveHelpers.markUrlAsArchived(url);
      });
    });
  });
};

// Get all downlodable URLs
archiveHelpers.getDownloadUrls(fetchAllUrls);
