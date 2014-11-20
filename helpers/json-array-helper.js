/*jshint node:true */

var fs = require('fs');
var lockFile = require('lockfile');
var _ = require('underscore');

var JSONArrayHelper = function(filename){
  this._data = [];
  this._filename = filename;
  this.readFile();
};

JSONArrayHelper.prototype.readFile = function() {
  fs.readFile(this._filename, function(err,buffer){
    var data = JSON.parse(buffer.toString());
    data.forEach(function(dataValue){
      this._data.push(dataValue);
    }.bind(this));
  }.bind(this));
};

JSONArrayHelper.prototype.push = function(dataValue){
  if (typeof dataValue !== 'object') {
    throw new TypeError('Only Objects can be added to JSONArrayHelper');
  }
  if(!_.contains(_.pluck(this._data,'url'), dataValue.url)){
    this.saveJSON(function () {
      this._data.push(dataValue);
    }.bind(this));
  }
};

JSONArrayHelper.prototype.markAsArchived = function (url) {
  var urls = _.pluck(this._data,'url');
  if(_.contains(urls, url)){
    var index = urls.indexOf(url);
    this.saveJSON(function () {
      this._data[index].archived = true;
    }.bind(this));
  }
};

JSONArrayHelper.prototype.get = function(){
  return this._data;
};

JSONArrayHelper.prototype.saveJSON = function(callback){
  lockFile.lock(this._filename, {wait: 1000}, function () {
    this.readFile();
    if (typeof callback === 'function') {
      callback();
    }
    fs.writeFile(this._filename, JSON.stringify(this._data), function () {
      lockFile.unLock(this._filename);
    }.bind(this));
  }.bind(this));
};

module.exports = JSONArrayHelper;
