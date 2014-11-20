var expect = require('chai').expect;
var handler = require("../web/request-handler");
var stubs = require("./stubs/stubs");
var fs = require('fs');
var archive = require("../helpers/archive-helpers");
var path = require('path');
var res;
var request = require('request');

archive.initialize({
  list : path.join(__dirname, "/testdata/sites.json")
});

// Conditional async testing, akin to Jasmine's waitsFor()
var waitForThen = function(test, cb) {
  setTimeout(function() {
    test() ? cb.apply(this) : waitForThen(test, cb);
  }, 5);
};

beforeEach(function(){
  res = new stubs.Response();
});

describe("Node Server Request Listener Function", function() {

  it("Should answer GET requests for /", function(done) {
    request('http://127.0.0.1:8080/', function(error, res, body){
      expect(res.statusCode).to.equal(200);
      expect(body.match(/<input/)).to.be.ok; // the resulting html should have an input tag
      done();
    });
  });

  it("Should answer GET requests for archived websites", function(done) {
    var fixtureName = "www.google.com";
    request('http://127.0.0.1:8080/' + fixtureName, function(error, res, body){
      expect(res.statusCode).to.equal(200);
      expect(body.match(/google/)).to.be.ok; // the resulting html should have an input tag
      done();
    });

  });

  it("Should append submitted sites to 'sites.json'", function(done) {
    var requestObject = {
      url: 'http://127.0.0.1:8080/',
      body: 'url=www.example.com'
    };
    request.post(requestObject, function(error, res, body){
        var fileContents = fs.readFileSync(archive.paths.list, 'utf8');
        expect(res._responseCode).to.equal(302);
        expect(JSON.parse(fileContents)[0]).to.equal(url);
        done();
    });
  });

  it("Should 404 when asked for a nonexistent file", function(done) {
    var req = new stubs.Request("/arglebargle", "GET");

    handler.handleRequest(req, res);

    waitForThen(
      function() { return res._ended; },
      function(){
        expect(res._responseCode).to.equal(404);
        done();
    });
  });

});

describe("html fetcher helpers", function(){

  it("should have a 'readListOfUrls' function", function(done){
    var urlArray = ["example1.com", "example2.com"];
    var resultArray;

    fs.writeFileSync(archive.paths.list, urlArray.join("\n"));
    archive.readListOfUrls(function(urls){
      resultArray = urls;
    });

    waitForThen(
      function() { return resultArray; },
      function(){
        expect(resultArray).to.deep.equal(urlArray);
        done();
    });
  });

  it("should have a 'downloadUrls' function", function(){
    expect(typeof archive.downloadUrls).to.equal('function');
  });

});
