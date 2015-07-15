var mandrill = require("mandrill-api/mandrill");
var mandrillClient = new mandrill.Mandrill(process.env.MANDRILL_API);

var emailAlert = {
  sendEmail: function(request) {
    var data = {
     'from_email': 'ronan_mccabe@hotmail.com',
     'to': [{
       'email': request.auth.credentials.profile.email,
       'name': request.auth.credentials.profile.name.first,
       'type': 'to'
      }],
     'autotext': 'true',
     'subject': 'Welcome to the Dark side!',
     'html': "Are you going through an existential crisis? We are here to help."
    };

    mandrillClient.messages.send({"message": data, "async": false}, function(result) {
    }, function(e) {
      console.log("Error " + e.message);
    });
  }

};

module.exports = emailAlert;