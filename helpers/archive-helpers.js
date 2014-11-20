/*jshint node:true */

var path = require('path');
var _ = require('underscore');
var JSONArrayHelper = require('./json-array-helper');
/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.json')
};

var sitesData = new JSONArrayHelper(exports.paths.list);

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(){
  return _.pluck(sitesData.get(), 'url');
};

exports.isUrlInList = function(url){
  return _.contains(exports.readListOfUrls(), url);
};

exports.addUrlToList = function(url){
  sitesData.push({
    url: url,
    archived: false
  });
};

exports.isURLArchived = function(url){
  var archivedUrls = _.pluck(sitesData.get().filter(function (site) {
    return site.archived === true;
  }), 'url');
  return archivedUrls.indexOf(url) > -1;
};

exports.getDownloadUrls = function(callback){
  sitesData.readFile(function (data) {
    var urls = _.pluck(data.filter(function (site) {
      return site.archived === false;
    }), 'url');
    if (typeof callback === 'function') {
      callback(urls);
    }
  });
};

exports.markUrlAsArchived = function (url) {
  sitesData.markAsArchived(url);
};
