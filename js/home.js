$('body').on('click','#submitUpload', function() {
  var file = document.getElementById('fileInput').files[0];
  if (file === null) {
    alert('Please select a file.');
  } else if (file.size > 2000000) {
    alert('File is too large! Choose a picture less than 2MB!');
    document.getElementById('fileInput').value = null;
  } else if (file.type === 'image/jpeg' || file.type === 'image/bmp' || file.type === 'image/png') {
    funcs.getSignedRequest(file);
  } else {
    alert('Invalid file type selected.');
  }
});

$('body').on('click','#profileButton', function() {
  window.location = '/profile';
});

$('body').on('click','#loginButton', function() {
  window.location = '/login';
});

$('body').on('click','.loveButton', function() {
  var postID = $(this).parent().attr('id');
  $.ajax({
    type: "POST",
    url: '/loveButton',
    data: {postID: postID}
  }).done(function() {
    $('#' + postID + ' img').animate({opacity: 1}, 500);
  });
});

window.onload = function () {
  funcs.getHomepageImages();

  $.get('/isLoggedIn', function(data) {
    if(data) {
      $('#userContainer').append(
        '<div id="loggedInContainer">' +
          '<div id="buttonsContainer">' +
            '<button class="button" id="profileButton">PROFILE</button>' +
            '<button class="button" id="logoutButton"><a href="/logout">LOGOUT</a></button>' +
            '<div id="postDiv">' +
              '<input type="file" id="fileInput"/>' +
              '<p id="status">Please select a file</p>' +
              '<button id="submitUpload" class="button">SUBMIT</button>' +
            '</div>' +
          '</div>' +
        '</div>'
      );
    } else {
      $('#userContainer').append(
        '<div id="loggedOutContainer">' +
          '<button class="button" id="loginButton">SIGN IN</button>' +
        '</div>'
      );
    }
  });

};