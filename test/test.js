var Routes = require('../routes.js');
var Lab = require("lab"),    // the Lab
    server = require("../server.js"), // require server.js
    fs = require('fs');
var lab = exports.lab = Lab.script();
var Code = require('code');

var home;
fs.readFile('views/home.html', function(err,data){
  home = data.toString().substring(0,16);
});

var testImage;
fs.readFile('images/dark.png', function(err,data){
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
            Code.expect(response.payload.substring(0, 16)).to.equal(home);
            done();
        });
    });
    lab.test("GET request to /static/{path*} serves the correct image", function(done) {
        var options = {
            method: "GET",
            url: "/static/images/dark.png"
        };
        server.inject(options, function(response) {
            Code.expect(response.statusCode).to.equal(200);  //  Expect http response status code to be 200 ("Ok")
            Code.expect(response.payload.toString()).to.equal(testImage);
            done();
        });
    });
    lab.test("GET request to /login has a status code of 302 to indicate url is being redirected", function(done) {
        var options = {
            method: "GET",
            url: "/login"
        };
        server.inject(options, function(response) {
          Code.expect(response.headers.location).to.contain('https://accounts.google.com/o/oauth2'); //user is redirected to their google account for authentication
          Code.expect(response.statusCode).to.equal(302);
            done();
        });
    });
    lab.test("GET request to /my-account sends back a 401 status code if the user is not logged in (unauthorised)", function(done) {
        var options = {
            method: "GET",
            url: "/my-account"
        };
        server.inject(options, function(response) {
          Code.expect(response.headers.location).to.equal('/');  //redirect user to home page if not logged in
          Code.expect(response.statusCode).to.equal(401);
            done();
        });
    });
    lab.test("GET request to /logout sends back a 200 status code", function(done) {
        var options = {
            method: "GET",
            url: "/logout"
        };
        server.inject(options, function(response) {
          Code.expect(response.headers.location).to.equal('/'); // redirect user to home page
          Code.expect(response.statusCode).to.equal(302);
            done();
        });
    });
    // lab.test("GET request to /my-account", function(done) {
    //     var options = {
    //         method: "GET",
    //         url: "/my-account",
    //         auth: {
    //           isAuthenticated: true,
    //           credentials: {
    //             name: {
    //               first: "nikki"
    //             }
    //           }
    //         }
    //     };
    //     server.inject(options, function(response) {
    //       // Code.expect(response.headers.location).to.equal('/'); // redirect user to home page
    //       Code.expect(response.statusCode).to.equal(200);
    //         done();
    //     });
    // });
});
