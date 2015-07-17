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
      },
      handler: handlers.displayHome
    },
  },
  { //route for all css, images and js files
    method: 'GET',
    path: '/static/{path*}',
    config: {
      auth: {
        mode: "optional"
      },
      handler:  {
        directory: {
          path: './'
        }
      }
    },
  },
  {
    method: 'GET',
    path: '/getProfilePage',
    config: {
      auth: {
        strategy: 'session',
        mode: 'optional',
      },
      handler: handlers.getProfilePage
    }
  },
  {
    method: 'GET',
    path: '/login',
    config: {
      auth: {
        mode: "try",
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
    path: '/getHomepageImages',
    config: {
      auth: {
        mode: "try"
      },
      handler: handlers.getHomepageImages
    }
  },
  {
    method: "GET",
    path: '/getProfileImages',
    config: {
      auth: {
        mode: "try"
      },
      handler: handlers.getProfileImages
    }
  },
  {
    method: 'POST',
    path: '/analytics',
    config: {
      auth: {
        mode: "try"
      },
      handler: handlers.analyticsPost
    },
  },
  {
    method: 'GET',
    path: '/analytics',
    config: {
      auth: {
        mode: "try"
      },
      handler: handlers.analyticsGet
    },
  },
];
