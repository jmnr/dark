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
    $("#loggedInContainer").show();
    $("#loggedOutContainer").hide();
    });
});

var opacity = $(".image").css("opacity");
console.log(opacity);

$(".loveButton").on('click', function() {
  var countElement = $(this).siblings()[1];
  var loveCountString = $(countElement).html();
  var loveCount = parseInt(loveCountString);
  loveCount = loveCount + 1;
  $(countElement).html(loveCount);
  opacity = (opacity * 10 + 1)/10;
  // console.log(this);
  $().siblings(".image").css('opacity', opacity);
  console.log(opacity);
});


// function increaseLoves () {
//
// }
//
//
// function increaseOpacity (element) {
//
// }

//when you click this button, the closest image or the sibling with
//the class image changes its css opacity properties


// $('#profileButton').on('click', function(){
//   $.get("/my-account", function(data) {
//     //this endpoint will load the profile page
//     ///retrieve images from redis and add them to the page
//     //in the server, request.auth.session cookie stores the google email address so use
//     // this to retrie images specific to the user
//   });
// });
