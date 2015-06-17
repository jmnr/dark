var Hapi = require('hapi'),
    fs = require('fs'),
    Path = require('path'),
    Good = require('good'),
    Bell = require('bell'),
    AuthCookie = require('hapi-auth-cookie'),
    server = new Hapi.Server(),
    goodOptions = require('./goodOptions');

server.connection({ port: 8000 });

// serves up views (html template pages)
server.views({
  engines: {
    html: require('handlebars')
  },
  path: Path.join(__dirname, "views")
});

var authOptions = {
    provider: 'github',
    password: 'github-encryption-password', //Password used for encryption
    clientId: '9fdbf4d83aea78f4aab4',//'YourAppId',
    clientSecret: 'f432895e56c5bac1b4d89fcd3bf59e57ff0e3ae9',//'YourAppSecret',
    isSecure: false //means authentication can occur over http
};


//register plugins with server
server.register([{register: Good, options: goodOptions},
  { register: Bell},
  { register: AuthCookie}],

  function (err) {
    if (err) {
        throw err; // something bad happened loading the plugin
    }

    server.auth.strategy("github", 'bell', authOptions);

		server.auth.strategy('session', 'cookie', {
		    cookie: 'sid',
		    password: '12345678',
		    // redirectTo: '/', //this allows logout to work!
        isSecure: false,
        ttl: 3000  //expiry time of cookie
        // clearInvalid: true
		});

    server.auth.default('session');  //if no auth is specified it defaults to checking the session cookie
    server.route(require('./routes'));

  }

);

server.start(function () {
    server.log('Server running at: ' + server.info.uri);
});


module.exports = server;
