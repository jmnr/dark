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
        handler: handlers.getProfilePage
        }
  },
  {
    method: ['GET', 'POST'],
    path: '/login',
    config: {
        auth: {
          mode: "optional",
          strategy: "google"
        },
        handler: handlers.loginUser
      }
  },
  {
    method: 'GET',
    path: '/isLoggedIn',
    config: {
        auth: {
          mode: "try"
        },
        handler: handlers.isLoggedIn
      }
  },
  {
    method: 'GET',
    path: '/logout',
    config: {
      auth: {
        mode: "optional"
      },
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
    method: "GET",
    path: '/loadImages',
    config: {
      auth: {
        mode: "try"
      },
      handler: handlers.loadImages
    }
  },
  {
    method: 'POST',
    path: '/analytics',
    config: {
      auth: {
        mode: "try"
      }
    },
    handler: handlers.analyticsPost
  },
  {
    method: 'GET',
    path: '/analytics',
    config: {
      auth: {
        mode: "try"
      }
    },
    handler: handlers.analyticsGet
  },
];
