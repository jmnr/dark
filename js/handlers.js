var aws = require('aws-sdk'),
    redis = require('./redisAdaptor.js'),
    redisConfig = {connection: require('redis')},
    mandrill = require('./mandrill.js');

function addID() {
  var ID = '';
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for(var i = 0; i < 10; i++) {
    ID += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ID;
}

function handlers() {
  return {

    displayHome: function(request, reply) {
      if (request.auth.isAuthenticated) {
        // request.log('analytics request is being sent');
        reply.view('home', {
          name: request.auth.credentials.name.first
        });
        // reply('true');
      } else {
        // request.log('analytics request is being sent');
        reply.view('home', {
          name: 'stranger!'
        });
     }
    },

    displayProfile: function(request, reply) {
      // request.log('analytics request is being sent');
      if(request.auth.isAuthenticated) {
        reply.view('profile', {name: request.auth.credentials.name.first});
      }
      else {
        reply.redirect('/');
      }
    },

    login: function(request, reply) {
      if(request.auth.isAuthenticated) {
        // mandrill.sendEmail(request);
        console.log('credentials have been set');
        request.auth.session.set(request.auth.credentials.profile);
        reply.redirect('/');
      } else {
        console.log('login error');
        reply.redirect('/');
      }
    },

    logoutUser: function(request, reply) {
      // request.log('analytics request is being sent');
      request.auth.session.clear();
      reply.redirect('/');
    },

    loveButton: function(request, reply) {
      if(request.auth.isAuthenticated) {
        redis(redisConfig).loveButton(request.payload.postID, function() {
          reply();
        });
      } else {
        reply();
      }
    },

    getSignedS3Request: function(request, reply) { //is this config necessary every time or is this what daniel was on about
      aws.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      });

      var s3 = new aws.S3();
      var postID = addID();

      var s3_params = {
        Bucket: process.env.S3_BUCKET,
        Key: 'images/' + postID,
        ContentType: request.query.fileType,
        ACL: 'public-read'
      };

      s3.getSignedUrl('putObject', s3_params, function(err, data){
        if(err){
          console.log('err', err);
        } else {
          var time = new Date().getTime();
          var imageData = {
            lastLoved: time,
            time: time,
            id: postID,
            googleid: request.auth.credentials.id,
            imgURL: 'https://s3-eu-west-1.amazonaws.com/dark-image-bucket/' + s3_params.Key
          };
          redis(redisConfig).create(imageData, function(err) {
            if (err)
              {console.log(err);}
            else {
              console.log('redis success!');
          }
          });
          reply(data);
        }
      });
    },

    getHomepageImages: function(request, reply) {
      redis(redisConfig).read(0, function(data){
        reply(JSON.stringify(data));
      });
    },

    getProfileImages: function(request, reply) {
      redis(redisConfig).read(0, function(data){
        reply(JSON.stringify(data));
      });
    },

    analyticsPost: function (request, reply) {
      var analObj = {
        time: request.payload.events.request[0].timestamp,
        id: request.payload.events.request[0].id
      };

      redis(redisConfig).addAnalytics(analObj, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log('added analytics to redis');
        }
      });

      reply();
    },

    analyticsGet: function (request, reply) {
      var result = [];

      redis(redisConfig).read(1, function(data){
        reply.view('analytics', {total: data.length});
      });
    },

    isLoggedIn: function (request, reply) {
      reply(request.auth.credentials);
    }

  };
}

module.exports = handlers;
