var fs = require('fs');
var Path = require('path');
var level = require('level');
var db = level('./mydb');
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
  {
    method: 'GET',
    path: '/',
    handler: {
      view: 'home'
    }
  },
  {
    method: 'GET',
    path: '/static/{path*}',
    handler:  {
      directory: {
        path: './'
      }
    }
  },
  {
    method: "GET",
    path: '/{name}',
    handler: function (request, reply) {
        request.log('a giraffe' );
        reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
    }
  },
  {
    method: "POST",
    path: '/sign_s3',
    handler: function (request, reply) {
      console.log("sign s3");
      aws.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});
      var s3 = new aws.S3();
      var s3_params = {
        Bucket: S3_BUCKET,
        Key: 'images/' + request.query.file_name,
        Expires: 60,  
        ContentType: request.query.file_type,
        ACL: 'public-read'
      };
      s3.getSignedUrl('putObject', s3_params, function(err, data){
        if(err){
          console.log(err);
        }
          else{
              // var return_data = {
              //     signed_request: data,
              //     url: 'https://'+S3_BUCKET+'.s3.amazonaws.com/'+request.query.file_name
              // };
              // reply.write(JSON.stringify(return_data));
              // reply.end();
              reply(data);
          }
      });
    }
  },
  {
      method: 'POST',
      path: '/upload',
      handler: function (request, reply){
          var type = filetype((request.payload.upload));
          s3.putObject({
              Bucket : 'polagraph',
              Key : request.payload.title + '.' + type.ext,
              Body : request.payload.upload,
              ContentType : type.mime,
          }, function(err, data){
              console.log(data);
          });
      }
  },
  {
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
  },
  {
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
  },
  {
      method: 'GET',
      path: '/login/{name}',
      handler: function (request, reply) {
                                                                                  // console.log("login/{name}");
          request.log();
          reply("welcome, " + request.params.name);
      }
  }
];
