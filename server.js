var Hapi = require('hapi');
var fs = require('fs');
var Path = require('path');
var Good = require('good');
var server = new Hapi.Server();
server.connection({ port: 3000 });

// serves up views (html template pages)
server.views({
  engines: {
    html: require('handlebars')
  },
  path: Path.join(__dirname, "views")
});

server.route(require('./routes'));

server.register({
    register: Good,
    options: {
      reporters: [{
        reporter: require('good-http'),
        events: { request: '*' },
        config: {
          endpoint : 'http://localhost:3000/analytics',
          threshold: 0
          // ,wreck: {
          //     headers: { 'x-api-key' : 12345 }
          //     }
        }
      }]
    }
  },

  function (err) {
      if (err) {
          throw err; // something bad happened loading the plugin
      }
  }
);

server.start(function () {
    server.log('info', 'Server running at: ' + server.info.uri);
});

module.exports = server;
