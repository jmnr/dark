var Hapi = require('hapi'),
    fs = require('fs'),
    Path = require('path'),
    Good = require('good'),
    Bell = require('bell'),
    AuthCookie = require('hapi-auth-cookie'),
    server = new Hapi.Server({debug: {request: ['error']}});

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
    clientId: process.env.GOOGLE_CLIENTID,//'YourAppId',
    clientSecret: process.env.GOOGLE_CLIENTSECRET,//'YourAppSecret',
    isSecure: false //means authentication can occur over http
};

//register plugins with server
server.register(
  [{
    register: Good,
    options: {
      reporters: [{
        reporter: require('good-http'),
        events: { request: '*' },
        config: {
          endpoint : 'http://localhost:8000/analytics',
          threshold: 0
        }
      }]
    }
  },
  { register: Bell},
  { register: AuthCookie}
  ],

  function (err) {
    if (err) {
      throw err; // something bad happened loading the plugin
    }

    server.auth.strategy("google", 'bell', authOptions);

		server.auth.strategy('session', 'cookie', {
		    cookie: 'sid',
		    password: '12345678',
		    // redirectTo: '/', //this allows logout to work!
        isSecure: false
        // ttl: 3000  //expiry time of cookie
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
