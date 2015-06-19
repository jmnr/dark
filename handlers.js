var aws = require('aws-sdk');
var redis = require('./redisAdaptor.js')({connection: require('redis')});
var mandrill = require('./mandrill.js');

function handlers() {
  return {

    displayHome: function(request, reply) {
      if (request.auth.isAuthenticated) {
        request.log('analytics request is being sent');
        // console.log(request.auth.credentials);
        reply.view('home', {
          name: request.auth.credentials.name.first
        });
      }
      else {
        request.log('analytics request is being sent');
        reply.view('home', {
        name: 'stranger!'
      });
     }
    },

    getProfilePage: function(request, reply) {
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
        console.log(request.auth.credentials.profile.email);
        console.log(request.auth.credentials.profile.name.first);
        mandrill.sendEmail(request);
        request.auth.session.set(request.auth.credentials.profile);
        reply.redirect('/my-account');
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
      aws.config.update({accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY});
      var s3 = new aws.S3();
      var s3_params = {
        Bucket: process.env.S3_BUCKET,
        Key: 'images/' + request.query.file_name,
        ContentType: request.query.file_type,
        ACL: 'public-read'
      };
      s3.getSignedUrl('putObject', s3_params, function(err, data){
        if(err){
          console.log("err",err);
        } else {
          var imageData = {
            time: new Date().getTime(),
            id: request.query.file_name,
            username: request.auth.credentials,
            imgURL: "https://s3-eu-west-1.amazonaws.com/dark-image-bucket/" + s3_params.Key
          };
          redis.create(imageData, function(err) {
            if (err)
              {console.log(err);}
            else {
              console.log("added to redis");
          }
          });
          reply(data);
        }
      });
    },

    loadImages: function(request, reply) {
      redis.read(function(data){
        console.log("replying with files");
        reply(JSON.stringify(data));
      });
    },

    //Analytics Handlers

    analyticsPost: function (request, reply) {
      var analObj = {
        time: request.payload.events.request[0].timestamp,
        id: request.payload.events.request[0].id
      };

      redis.addAnalytics(analObj, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("added analytics to redis");
        }
      });

      reply(true);
    },

    analyticsGet: function (request, reply) {
      var result = [];

      redis.readAnalytics(function(data){
        reply.view("analytics", {total: data.length});
      });
    },

    isLoggedIn: function (request, reply) {
      console.log("is this working", request.auth.credentials);
       reply(request.auth.credentials);
    }

  };
}

module.exports = handlers;
