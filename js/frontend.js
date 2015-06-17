$(document).ready(function () {
  //hide these options if the user is not authenticated
  $("#loggedInContainer").hide();
  $("#postDiv").hide();
});
//


$("#loginButton").on('click', function() {
  $.ajax({
    url: "/login",
    dataType: 'jsonp',
    xhrFields: {
      withCredentials: true
    }
  }).done (function(){
    $("loggedInContainer").show();
    $("#loggedOutContainer").hide();
    });
});


// $('#profileButton').on('click', function(){
//   $.get("/my-account", function(data) {
//     //this endpoint will load the profile page
//     ///retrieve images from redis and add them to the page
//     //in the server, request.auth.session cookie stores the google email address so use
//     // this to retrie images specific to the user
//   });
// });
