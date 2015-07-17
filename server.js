var Hapi = require('hapi'),
    fs = require('fs'),
    Path = require('path'),
    Good = require('good'),
    Bell = require('bell'),
    AuthCookie = require('hapi-auth-cookie'),
    server = new Hapi.Server({debug: {request: ['error']}});

server.connection({ port: process.env.PORT });

// serves up views (html template pages)
server.views({
  engines: {
    html: require('handlebars')
  },
  path: Path.join(__dirname, 'views')
});

var googleAuthOptions = {
  provider: 'google',
  password: process.env.ENC_PW, //Password used for encryption
  clientId: process.env.CLIENTID,//'YourAppId',
  clientSecret: process.env.CLIENTSECRET,//'YourAppSecret',
  isSecure: false //means authentication can occur over http
};

var sessionAuthOptions = {
  cookie: 'darkCookie',
  password: process.env.ENC_PW,
  isSecure: false
};

//register plugins with server
server.register(
  [
  {register: Bell},
  {register: AuthCookie}
  ],

  function (err) {
    if (err) {
      throw err; // something bad happened loading the plugin
    }

    server.auth.strategy('google', 'bell', googleAuthOptions);

  	server.auth.strategy('session', 'cookie', sessionAuthOptions);

    server.auth.default('session');  //if no auth is specified it defaults to checking the session cookie

    server.route(require('./routes'));

    server.start(function () {
      console.log('Server running at: ' + server.info.uri);
    });
});

module.exports = server;
