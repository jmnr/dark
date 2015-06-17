var Routes = require('../routes.js');
var Lab = require("lab"),    // the Lab
    server = require("../server.js"), // require server.js
    fs = require('fs');
var lab = exports.lab = Lab.script();
var Code = require('code');

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
    lab.test("GET request to /static/{path*} serves the correct image", function(done) {
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
    lab.test("GET request to /login sends a 401 error if the user authentication with github fails", function(done) {
        var options = {
            method: "GET",
            url: "/login"
        };
        server.inject(options, function(response) {
          Code.expect(response.statusCode).to.equal(401);
            done();
        });
    });
    lab.test("GET request to /my-account sends back a 401 error if the user is not logged in", function(done) {
        var options = {
            method: "GET",
            url: "/my-account"
        };
        server.inject(options, function(response) {
          Code.expect(response.statusCode).to.equal(401);
            done();
        });
    });
});
