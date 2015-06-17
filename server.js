var Hapi = require('hapi');
var Good = require('good');
var level = require('level');
var server = new Hapi.Server();
server.connection({ port: 3000 });
var fs = require('fs');
var db = level('./mydb');

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('Hello, world!');
    }
});

server.route({
    method: 'GET',
    path: '/{name}',
    handler: function (request, reply) {
                                                                                // console.log("We got a request!");
        request.log('a giraffe' );
        reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
                                                                                //console.log("frog");
    }
});



server.route({
    // would post to db
    method: 'POST',
    path: '/analytics',
    handler: function (request, reply) {
        console.log("should push to database");
        // console.log(request.payload.events.request[0])
        db.put(request.payload.events.request[0].timestamp, request.payload.events.request[0].id, function (err) {
          if (err){
            console.log('Ooops!', err);
          }
          // do something here, like send it back to the browser
        });

    }
});

server.route({
    // would read from db
    method: 'GET',
    path: '/analytics',
    handler: function (request, reply) {
        var result = [];
        db.createReadStream()
        .on('data', function (data) {
          result.push(data.key + ' = ' + data.value + "<br/>");
        })
        .on('end', function () {
          console.log(result);
          reply(result.length);
          // reply("a chikoo");
        });
        //
        // db.forEach(function(e){
        //                                                                         // console.log(e);
        //     for (var key in e){
        //         result += key + " " + e[key] + "\n";
        //     }
        // });
        // reply(result);
        // console.log("not broken, just doesn't work");
    }
});


server.route({
    method: 'GET',
    path: '/login/{name}',
    handler: function (request, reply) {
                                                                                // console.log("login/{name}");
        request.log();
        reply("welcome, " + request.params.name);
    }
});

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
}, function (err) {
    if (err) {
        throw err; // something bad happened loading the plugin
    }

    server.start(function () {
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});
