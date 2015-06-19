$("#submitUpload").click(function() {
  var file = document.getElementById("file_input").files[0];
  if (file === null) {
    alert("Please select a file.");
  } else if (file.type === "image/jpeg" || file.type === "image/bmp" || file.type === "image/png") {
    get_signed_request(file);
  } else {
    alert("Invalid file type selected.");
  }
});

function sortFiles(a, b) {
  var aTime = Number(a.time);
  var bTime = Number(b.time);
  if (aTime < bTime) {
    return 1;
  }
  if (aTime > bTime) {
    return -1;
  }
  return 0;
}

function opacitySet(time) {
  return new Date(new Date().getTime() - Number(time)).getHours() * 10;
}

function addID() {
  var ID = "";
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for(var i = 0; i < 10; i++) {
    ID += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ID;
}

var addDivs = function (data) {
  return '<div class="individualImageDiv"><div class="imageHolder"><img src="' + data.imgURL + '"class="image"></div><button class="loveButton">LOVE</button><div class="loveCount">0</div></div>';
};

var serverGrab = function() {
  $.get('/loadImages', function(data) {
    var files = JSON.parse(data).sort(sortFiles);
    var accessDOM = '';
    var fileLoad = files.length > 50 ? 50 : files.length;
    for(var i = 0 ; i < fileLoad; i++) {
      accessDOM += addDivs(files[i]);
    }
    $("#imageContainer").html(accessDOM);
    loveClick();
  });

};

function loveClick () {
  $(".loveButton").on('click', function() {
    var countElement = $(this).siblings()[1];
    var loveCountString = $(countElement).html();
    var loveCount = parseInt(loveCountString);
    loveCount = loveCount + 1;
    $(countElement).html(loveCount);
    var imageHolder = $(this).siblings()[0];
    var image = $(imageHolder).children()[0];
    var currentOpacity = $(image).css('opacity');
    var opacity = (currentOpacity * 10 + 1)/10;
    $(image).css('opacity', opacity);
  });
}

window.onload = function () {
  serverGrab();

  $.get('/isLoggedIn', function(data) {
    if(data) {
      $("#userContainer").append(
        '<div id="loggedInContainer">' +
          '<div id="buttonsContainer">' +
            '<button class="button" id="logoutButton"><a href="/logout">LOGOUT</a></button>' +
            '<button class="button" id="profileButton"><a href="/my-account">PROFILE</a></button>' +
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
          '<button><a href="/login">Login with Google</a></button>' +
        '</div>'
      );  
    }
  });

  // if(loggedIn) {
  //   $("#headerContainer").append(
  //     '<div id="postDiv"><input type="file" id="file_input"/><p id="status">Please select a file</p><button id="submitUpload" class="button">POST A PHOTO</button></div>'
  //   );
  // }

};

function get_signed_request(file){
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/sign_s3?file_name=" + addID() + "&file_type=" + file.type);
  xhr.onreadystatechange = function(){
    if(xhr.readyState === 4){
      if(xhr.status === 200){
        upload_file(file, xhr.responseText);
      }
      else{
        alert("Could not get signed URL.");
      }
    }
  };
  xhr.send();
}

function upload_file(file, data){
  var xhr = new XMLHttpRequest();
  xhr.open("PUT", data);
  xhr.setRequestHeader('x-amz-acl', 'public-read');
  xhr.onerror = function() {
    alert("Could not upload file.");
  };
  xhr.send(file);
  $("#status").fadeOut("slow", function() {
    $("#status").html("File uploaded successfully!").fadeIn("slow");
  });
}
