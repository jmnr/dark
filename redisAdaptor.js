var redisAdaptor = function (config) {
  "use strict";

  // if (process.env.REDIS_URL) {
  //   var url = require('url');
  //   var redisURL = url.parse(process.env.REDIS_URL);
  //   client = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
  //   client.auth(redisURL.auth.split(":")[1]);
  // }
  // else {
  //   client = redis.createClient();
  // }

  var redis = config.connection;
  var url = require('url');
  var redisURL = url.parse(process.env.REDIS_URL);
  var client = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
  client.auth(redisURL.auth.split(":")[1]);

  return {
    create: function(imageData, callback) {
      client.select(0, function() {
          client.hmset(imageData.id, imageData, function(err){
            callback(err);
          });
        }
      );
    }, //database 0 is for our metadata

    addAnalytics: function(data, callback) {
      client.select(1, function() {
          client.hmset(data.time, data, function(err){
            callback(err);
          });
        }
      );
    }, //database 1 is for analytics

    read: function(callback) {
      var fileLoad = [];
      var len;

      var cb = function(err, data) {
        fileLoad.push(data);
        if(fileLoad.length === len) {
          callback(fileLoad);
        }
      };

      client.select(0, function() {
        client.scan(0, function(err, data) {
          if(err) {
            console.log(err);
          } else {
            var files = data[1];
            len = files.length;
            for(var i = 0; i < len; i++) {
              client.hgetall(files[i], cb);
            }
          }
        });
      });
    },

    readAnalytics: function(callback) {
      var fileLoad = [];
      var len;

      var cb = function(err, data) {
        fileLoad.push(data);
        if(fileLoad.length === len) {
          callback(fileLoad);
        }
      };

      client.select(1, function() {
        client.scan(0, function(err, data) {
          if(err) {
            console.log(err);
          } else {
            var files = data[1];
            len = files.length;
            for(var i = 0; i < len; i++) {
              client.hgetall(files[i], cb);
            }
          }
        });
      });
    },

    delete: function(time, callback) {
      client.del(time, function(err, reply) {
        callback(reply);
      });
    }
    
  };

};

module.exports = redisAdaptor;
