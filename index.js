
var Hapi = require("hapi");
var Bell = require('bell');
var hapicookie = require('hapi-auth-cookie');

var authOptions = {
    provider: 'github',
    password: 'github-encryption-password', //Password used for encryption
    clientId: '9fdbf4d83aea78f4aab4',//'YourAppId',
    clientSecret: 'f432895e56c5bac1b4d89fcd3bf59e57ff0e3ae9',//'YourAppSecret',
    isSecure: false //means authentication can occur over http
};

var server = new Hapi.Server({
  debug: {
    request: ['error'],
  }
});
server.connection({ port: 8000});

//handlers for the endpoints
var logout = function (request, reply) {
    request.auth.session.clear();  //clears the cookie but doesn't log the user our of the provider e.g. google
    // request.auth.isAuthenticated = false;
    return reply.redirect('/');
};

var myaccount = function(request, reply) {
  reply("HI:" + request.auth.isAuthenticated);
};

var home = function(request, reply) {
  reply("<h1>HELLO! this is the home page<h1>");
};

var loggedin = function(request, reply) {
  console.log(request);
  request.auth.session.set(request.auth.credentials.profile);
  console.log("logged in");
  // reply('<pre>'+ JSON.stringify(request.auth.credentials.profile, null, 4) + '</pre>');
  return reply.redirect('/my-account');
};

server.register([require('bell'), require('hapi-auth-cookie')],
  // },{
  //   register: require('hapi-auth-cookie')
  // }
   function (err) {
	if (err) {
    console.error("failed to load a plugin", err);
  }
//authentication strategies
//if a server router has the auth property set to one of these, the authentication occurs and if
//successful the handler function is executed
		// server.auth.strategy("google", 'bell', {
	  //       provider: 'google',
	  //       password: "12345678",
		// 			 clientId: "282689600260-gijoipgqtv2lu6o4e6a58u5j787vgffe.apps.googleusercontent.com",
    //       clientSecret: "374sXVZ2fNolQ-xZb1vI9FTN",
	  //       isSecure: false
	  //   });

    server.auth.strategy("github", 'bell', authOptions);

		server.auth.strategy('session', 'cookie', {
		    cookie: 'sid',
		    password: '12345678',
		    redirectTo: '/login',
        isSecure: false,
        clearInvalid: true
		});
});

server.route({
  method: 'GET',
  path: '/',
  config: {
      handler: home
  }
});

server.route({
  method: 'GET',
  path: '/my-account',
  config: {
      auth: {
        strategy: 'session',
        mode: 'required',
      },
      handler: myaccount,
  }
});

server.route({
    method: ['GET', 'POST'],
    path: '/login',
    config: {
        auth: 'github',
        handler: loggedin
        }
});

server.route({
  method: 'GET',
  path: '/logout',
  config: {
      handler: logout
      }
});
// register Bell with the server


// Start server
server.start(function() {
  console.log("Hapi server started @", server.info.uri);
});
