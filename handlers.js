var aws = require('aws-sdk');
var level = require('level');
var db = level('./mydb');
var redis = require('./redisAdaptor.js')({connection: require('redis')});

function handlers() {
  return {

    displayHome: function(request, reply) {
      if (request.auth.isAuthenticated) {
        request.log('analytics request is being sent');
        reply.view('home', {
          name: request.auth.credentials.username
        });
      }
      else {
        request.log('analytics request is being sent');
        reply.view('home', {
        name: 'stranger!'
      });
     }
    },

    getProfilepage: function(request, reply) {
      request.log('analytics request is being sent');
      if(request.auth.isAuthenticated) {
        reply.view('profile');
      }
      else {
        reply.redirect("/").code(401);
      }
    },

    loginUser: function(request, reply) {
      request.log('analytics request is being sent');
      if(request.auth.isAuthenticated) {
        request.auth.session.set(request.auth.credentials.profile);
        reply.redirect('/');
      } else
      {
        reply.redirect("/").code(401);
      }

    },

    logoutUser: function(request,reply) {
      request.log('analytics request is being sent');
      request.auth.session.clear();
      reply.redirect('/');
    },

    awsS3: function(request, reply) {
      request.log('analytics request is being sent');
      console.log("sign s3");
      aws.config.update({accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY});
      var s3 = new aws.S3();
      var s3_params = {
        Bucket: process.env.S3_BUCKET,
        Key: 'images/' + request.query.file_name,
        Expires: 60,
        ContentType: request.query.file_type,
        ACL: 'public-read'
      };
      s3.getSignedUrl('putObject', s3_params, function(err, data){
        if(err){
          console.log("err",err);
        } else {
          var imgData = {
            time: new Date().getTime(),
            id: "nikki",
          };
          redis.create(imgData, function(err) {
            if (err)
            {console.log(err);}
            else {
            console.log("added to redis");
          }
          });
          reply(data);
        }
      });
    }
  };
}

module.exports = handlers;
