var redisAdaptor = function (config) {
  "use strict";

  var redis = config.connection;
  var client;

  if (process.env.REDISCLOUD_URL) {
    var url = require('url');
    var redisURL = url.parse(process.env.REDISCLOUD_URL);
    client = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
    client.auth(redisURL.auth.split(":")[1]);
  }
  else {
    client = redis.createClient();
  }

  return {
      create: function(clap, callback) {
        client.hmset(clap.time, clap, function(err){
          callback(clap);
        });
      },

      read: function(callback) {
        var clapsLoad = [];
        var len;

        var cb = function(err, data) {
          clapsLoad.push(data);
          if(clapsLoad.length === len) {
            callback(clapsLoad);
          }
        };

        client.scan(0, function(err, data) {
          var claps = data[1];
          len = claps.length;
          for(var i = 0; i < len; i++) {
            client.hgetall(claps[i], cb);
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
