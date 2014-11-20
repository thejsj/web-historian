/*jshint node:true */

var fs = require('fs');

var JSONArrayHelper = function(filename){
  this._data = [];
  this._filename = filename;
  fs.readFile(filename, function(err,buffer){
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
  this._data.push(dataValue);
  this.saveJSON();
};

JSONArrayHelper.prototype.get = function(){
  return this._data;
};

JSONArrayHelper.prototype.saveJSON = function(){
  fs.writeFile(this._filename, JSON.stringify(this._data).bind(this)).bind(this);
};

module.exports = JSONArrayHelper;
