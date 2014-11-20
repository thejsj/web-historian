/*jshint node:true */

var fs = require('fs');
var lockFile = require('lockfile');
var _ = require('underscore');

var JSONArrayHelper = function(filename){
  this._data = [];
  this._filename = filename;
  this._lockFile = filename + '.lock';
  this.readFile();
  this.interval = setInterval(this.readFile.bind(this), 1000);
};

JSONArrayHelper.prototype.readFile = function(callback) {
  fs.exists(this._filename, function(exists){
    if(exists){
      fs.readFile(this._filename, function(err,buffer){
        this._data = JSON.parse(buffer.toString());
        // data.forEach(function(dataValue){
        //   this._data.push(dataValue);
        // }.bind(this));
        if (typeof callback === 'function') {
          callback(this._data);
        }
      }.bind(this));
    } else {
      fs.writeFile(this._filename, JSON.stringify([]),function(){
        if (typeof callback === 'function') {
          callback(this._data);
        }
      }.bind(this));
    }
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
  lockFile.lock(this._lockFile, {wait: 2000}, function (err) {
    if (err) throw new Error(err);
    this.readFile();
    if (typeof callback === 'function') {
      callback();
    }
    fs.writeFile(this._filename, JSON.stringify(this._data), function (err) {
      lockFile.unlock(this._lockFile, function(){});
    }.bind(this));
  }.bind(this));
};

module.exports = JSONArrayHelper;
