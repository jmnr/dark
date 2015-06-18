var redisAdaptor = function (config) {
  "use strict";

  var redis = config.connection;
  var client;

  if (process.env.REDIS_URL) {
    var url = require('url');
    var redisURL = url.parse(process.env.REDIS_URL);
    client = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
    client.auth(redisURL.auth.split(":")[1]);
  }
  else {
    client = redis.createClient();
  }

  return {
      create: function(imageData, callback) {
        client.select(0, //database 0 is for our metadata
          client.hmset(imageData.id, imageData, function(err){
            callback(err);
          })
        );
      },

      addAnalytics: function(imageData, callback) {
        client.select(1, //database 1 is for analytics
          client.hmset(data.ID, data, function(err){
            callback(err);
          })
        );
      },

      read: function(callback) {
        var fileLoad = [];
        var len;

        var cb = function(err, data) {
          fileLoad.push(data);
          if(fileLoad.length === len) {
            callback(fileLoad);
          }
        };

        client.scan(0, function(err, data) {
          var files = data[1];
          len = files.length;
          for(var i = 0; i < len; i++) {
            client.hgetall(files[i], cb);
          }
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
