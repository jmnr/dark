var mandrill = require("mandrill-api/mandrill");
var mandrill_client = new mandrill.Mandrill(process.env.SECRET);

var emailAlert = {};
emailAlert.sendEmail = function(request) {
  var data = {

       'from_email': 'msmichellegar@gmail.com',
       'to': [
         {
           'email': request.auth.credentials.profile.email,
           'name': request.auth.credentials.profile.name.first,
           'type': 'to'
         }
       ],
         'autotext': 'true',
         'subject': 'Welcome to the Dark side!',
         'html': "Are you going through an existential crisis? We are here to help."
};
  mandrill_client.messages.send({"message": data, "async": false},function(result) {
    console.log(result);
  }, function(e) {
     console.log("Error " + e.message);
  });
};

module.exports = emailAlert;
