var fs = require('fs');
var Path = require('path');
var level = require('level');
var db = level('./mydb');

module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: {
      view: 'home'
    }
  },
  {
    method: 'GET',
    path: '/{name}',
    handler: function (request, reply) {
        request.log('analytics request is being sent');
        reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
    }
  },
  {
    method: 'POST',
    path: '/analytics',
    handler: function (request, reply) {
        db.put(request.payload.events.request[0].timestamp, request.payload.events.request[0].id, function (err) {
          if (err){
            console.log('Ooops!', err);
          }
        });

    }
  },
  {
    method: 'GET',
    path: '/analytics',
    handler: function (request, reply) {
        var result = [];
        // var today = (results for /timestamp id - 86400000 (24 hours in milliseconds/.length)
        db.createReadStream()
        .on('data', function (data) {
          result.push(data.key + ' = ' + data.value + "<br/>");
        })
        .on('end', function () {
          reply.view("analytics", {
            total: result.length,
            // daily: result,
          });
          // reply('Total number of visits to the site ' + '<strong>' + result.length + '</strong>' + '<br/>' +
          //       'Total number of visits in the last 24 hours ' + '<strong>' + 'today' + '</strong>' + '<br/>');
        });

    }
  },
//
//   ###

// handler: function(request, reply) {
//         var names = request.params.name.split("/");
//         reply({
//             first: names[0],
//             last: names[1],
//             mood: request.query.mood || "neutral"
//         });
//     }
//
//     ###
// {
//       method: 'GET',
//       path: '/analytics',
//       handler: {
//          view: "analytics.html"
//      }
//   }
//
//   server.views({
//        engines: {
//            html: require('handlebars')
//        },
//        path: Path.join(__dirname, 'templates')
//    });
//    ###
  {
      method: 'GET',
      path: '/login/{name}',
      handler: function (request, reply) {
          request.log();
          reply("welcome, " + request.params.name);
      }
  }
];
