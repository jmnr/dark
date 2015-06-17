var Hapi = require('hapi'),
    fs = require('fs'),
    Path = require('path'),
    Good = require('good'),
    Bell = require('bell'),
    AuthCookie = require('hapi-auth-cookie'),
    server = new Hapi.Server({debug: {request: ['error']}}),
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
    provider: 'google',
    password: 'google-encryption-password', //Password used for encryption
    clientId: '604932332741-irdehp8c2fq79d8netd6jbetkh05rt68.apps.googleusercontent.com',//'YourAppId',
    clientSecret: 'sNWs4seCac0jzjK5vGlQjOpV',//'YourAppSecret',
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

    server.auth.strategy("google", 'bell', authOptions);

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
