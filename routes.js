var fs = require('fs');
var Path = require('path');
var handlers = require('./handlers.js')();

module.exports = [
  { //home page
    method: 'GET',
    path: '/',
    config: {
      auth: {
        mode: "try",
      }
    },
    handler: handlers.displayHome
  },
  { //route for all css, images and js files
    method: 'GET',
    path: '/static/{path*}',
    config: {
      auth: {
        mode: "optional"
      }
    },
    handler:  {
      directory: {
        path: './'
      }
    }
  },
  {
    method: 'GET',
    path: '/my-account',
    config: {
        auth: {
          strategy: 'session',
          mode: 'optional',
        },
        handler: handlers.getProfilepage
        }
  },
  {
    method: ['GET', 'POST'],
    path: '/login',
    config: {
        auth: {
          mode: "optional",
          strategy: "github"
        },
        handler: handlers.loginUser
      }
  },
  {
    method: 'GET',
    path: '/logout',
    config: {
      handler: handlers.logoutUser
    }
  },
  {
    method: "POST",
    path: '/sign_s3',
    config: {
      auth: {
        mode: "try"
      },
      handler: handlers.awsS3
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
    config: {
      auth: {
        mode: "try"
      }
    },
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
];
