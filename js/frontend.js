
  //hide these options if the user is not authenticated
  // $("#loggedInContainer").hide();
  // $("#postDiv").hide();
//

// $("#loginButton").on('click', function() {
//   $.ajax({
//     url: "/login",
//     dataType: 'jsonp',
//     xhrFields: {
//       withCredentials: true
//     }
//   }).done (function(){
//     $("#loggedInContainer").show();
//     $("#loggedOutContainer").hide();
//     });
// });
// $(document).ready(function () {
//   console.log("heyy");
//   console.log($("#imageContainer").children());
//   $(".loveButton").on('click', function() {
//     console.log("hey");
//     var countElement = $(this).siblings()[1];
//     console.log(countElement);
//     var loveCountString = $(countElement).html();
//     var loveCount = parseInt(loveCountString);
//     loveCount = loveCount + 1;
//     $(countElement).html(loveCount);
//     var imageHolder = $(this).siblings()[0];
//     var image = $(imageHolder).children()[0];
//     var currentOpacity = $(image).css('opacity');
//     var opacity = (currentOpacity * 10 + 1)/10;
//     $(image).css('opacity', opacity);
//   });
// });

// function darkenImages () {
//   // $(".class").each(increaseOpacity());
//   console.log(this);
//   // function increaseOpacity () {
//   //   var currentOpacity = $(this).css('opacity');
//   //   var opacity = (currentOpacity * 10 + 1)/10;
//   //   $(image).css('opacity', opacity);
//   // }
// }
//
// function makeInterval(){
//     var date = new Date();
//     var min = date.getMinutes();
//     var sec = date.getSeconds();
//     var nextHour =
//     console.log(sec);
//     if(min === '00' && sec === '00') {
//       console.log("hello");
//       darkenImages();
//     } else {
//       setTimeout(darkenImages(),(60*(60-min)+(60-sec))*1000);
//     }
// }
//
// makeInterval();

// $('#profileButton').on('click', function(){
//   $.get("/my-account", function(data) {
//     //this endpoint will load the profile page
//     ///retrieve images from redis and add them to the page
//     //in the server, request.auth.session cookie stores the google email address so use
//     // this to retrie images specific to the user
//   });
// });
