$('body').on('click','#submitUpload', function() {
  var file = document.getElementById("file_input").files[0];
  if (file === null) {
    alert("Please select a file.");
  } else if (file.size > 2500000) {
    alert("File is too large! Choose a picture less than 2.5MB!");
    document.getElementById("file_input").value = null;
  } else if (file.type === "image/jpeg" || file.type === "image/bmp" || file.type === "image/png") {
    funcs.get_signed_request(file);
  } else {
    alert("Invalid file type selected.");
  }
});

$('body').on('click','#profileButton', function() {
  window.location = "/getProfilePage";
});

$('body').on('click','#loginButton', function() {
  window.location = "/login";
});

window.onload = function () {
  funcs.getHomepageImages();

  $.get('/isLoggedIn', function(data) {
    if(data) {
      $("#userContainer").append(
        '<div id="loggedInContainer">' +
          '<div id="buttonsContainer">' +
            '<button class="button" id="profileButton">PROFILE</button>' +
            '<button class="button" id="logoutButton"><a href="/logout">LOGOUT</a></button>' +
            '<div id="postDiv">' +
              '<input type="file" id="file_input"/>' +
              '<p id="status">Please select a file</p>' +
              '<button id="submitUpload" class="button">POST A PHOTO</button>' +
            '</div>' +
          '</div>' +
        '</div>'
      );
    } else {
      $("#userContainer").append(
        '<div id="loggedOutContainer">' +
          '<button class="button" id="loginButton">SIGN IN</button>' +
        '</div>'
      );
    }
  });

};