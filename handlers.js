
function handlers() {
  return {

    displayHome: function(request, reply) {
      if (request.auth.isAuthenticated) {
        reply.view('home', {
          name: request.auth.credentials.username
        });
      }
      else {
        reply.view('home', {
        name: 'stranger!'
      });
     }
    },

    loginUser: function(request, reply) {
        request.auth.session.set(request.auth.credentials.profile);
        reply.redirect('/');
        //add changed buttons
    },

    logoutUser: function(request,reply) {
      request.auth.session.clear();
      reply.redirect('/');
    }
  };
}

module.exports = handlers;
