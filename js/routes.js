var fs = require('fs');
var Path = require('path');
var handlers = require('./handlers.js')();

module.exports = [

  { //home page
    method: 'GET',
    path: '/',
    config: {
      auth: {
        mode: 'optional',
        strategy: 'session'
      },
      handler: handlers.displayHome
    }
  },

  {
    method: 'GET',
    path: '/getProfilePage',
    handler: handlers.displayProfile
  },

  {
    method: 'GET',
    path: '/login',
    config: {
      auth: {
        mode: 'required',
        strategy: 'google'
      },
      handler: handlers.login
    }
  },

  {
    method: 'GET',
    path: '/isLoggedIn',
    config: {
      auth: {
        mode: 'optional',
        strategy: 'session'
      },
      handler: handlers.isLoggedIn
    }
  },

  {
    method: 'GET',
    path: '/logout',
    handler: handlers.logoutUser
  },

  {
    method: 'POST',
    path: '/sign_s3',
    handler: handlers.awsS3
  },

  {
    method: 'GET',
    path: '/getHomepageImages',
    config: {
      auth: {
        mode: 'optional',
        strategy: 'session'
      },
      handler: handlers.getHomepageImages
    }
  },

  {
    method: 'GET',
    path: '/getProfileImages',
    handler: handlers.getProfileImages
  },

  {
    method: 'POST',
    path: '/analytics',
    handler: handlers.analyticsPost
  },

  {
    method: 'GET',
    path: '/analytics',
    handler: handlers.analyticsGet
  },

  { //route for all css, images and js files
    method: 'GET',
    path: '/static/{path*}',
    config: {
      auth: {
        mode: 'optional'
      },
      handler:  {
        directory: {
          path: './'
        }
      }
    },
  }

];
