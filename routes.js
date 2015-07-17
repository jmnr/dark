var fs = require('fs');
var Path = require('path');
var handlers = require('./handlers.js')();

module.exports = [

  { //home page
    method: 'GET',
    path: '/',
    handler: handlers.displayHome
  },

  {
    method: 'GET',
    path: '/getProfilePage',
    handler: handlers.getProfilePage
  },

  {
    method: 'GET',
    path: '/login',
    config: {
      auth: {
        mode: 'try',
        strategy: 'google'
      },
      handler: handlers.loginUser
    }
  },

  {
    method: 'GET',
    path: '/isLoggedIn',
    handler: handlers.isLoggedIn
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
    handler: handlers.getHomepageImages
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
        mode: 'optional',
        strategy: 'google'
      },
      handler:  {
        directory: {
          path: './'
        }
      }
    },
  }

];
