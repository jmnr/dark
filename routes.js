var fs = require('fs');
var Path = require('path');
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
];
