var fs = require('fs');
var Path = require('path');
var level = require('level');
var db = level('./mydb');
var handlers = require('./handlers.js')();
var aws = require('aws-sdk');

var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID;
var AWS_SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;
var S3_BUCKET = process.env.S3_BUCKET;

// app.get('/sign_s3', function(req, res){
//     aws.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});
//     var s3 = new aws.S3();
//     var s3_params = {
//         Bucket: S3_BUCKET,
//         Key: 'images/' + req.query.file_name,
//         Expires: 60,  
//         ContentType: req.query.file_type,
//         ACL: 'public-read'
//     };
//     s3.getSignedUrl('putObject', s3_params, function(err, data){
//         if(err){
//             console.log(err);
//         }
//         else{
//             var return_data = {
//                 signed_request: data,
//                 url: 'https://'+S3_BUCKET+'.s3.amazonaws.com/'+req.query.file_name
//             };
//             res.write(JSON.stringify(return_data));
//             res.end();
//         }
//     });
// });

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
  { //handler for all css, images and js files
    method: 'GET',
    path: '/static/{path*}',
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
          mode: 'required',
        },
        handler: {
          view: 'profile'
        }
      }
  },
  {
    method: ['GET', 'POST'],
    path: '/login',
    config: {
        auth: 'github',
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
      handler: handlers.awsS3
    }
  },
  // {
  //   // would post to db
  //   method: "GET",
  //   path: '/{name}',
  //   handler: function (request, reply) {
  //       request.log('analytics request is being sent');
  //       // reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
  //   }
  // },
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
