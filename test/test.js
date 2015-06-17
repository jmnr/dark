var Routes = require('../routes.js');
var Lab = require("lab"),    // the Lab
    server = require("../server.js"), // require server.js
    fs = require('fs');
var lab = exports.lab = Lab.script();
var Code = require('code');
// Authentication test

var home;
fs.readFile('views/home.html', function(err,data){
  home = data.toString();
});

var testImage;
fs.readFile('images/square.png', function(err,data){
  testImage = data.toString();
});

lab.experiment("Basic HTTP requests", function() {
    lab.test("GET request to / serves up the home.html page", function(done) {
        var options = {
            method: "GET",
            url: "/"
        };
        server.inject(options, function(response) {
            Code.expect(response.statusCode).to.equal(200);  //  Expect http response status code to be 200 ("Ok")
            Code.expect(response.payload).to.equal(home);
            done();
        });
    });
    lab.test("GET request to / serves up the home.html page", function(done) {
        var options = {
            method: "GET",
            url: "/static/images/square.png"
        };
        server.inject(options, function(response) {
            Code.expect(response.statusCode).to.equal(200);  //  Expect http response status code to be 200 ("Ok")
            Code.expect(response.payload.toString()).to.equal(testImage);
            done();
        });
    });
});
