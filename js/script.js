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

function addID() {
  var ID = "";
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for(var i = 0; i < 10; i++) {
    ID += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ID;
}

var addDivs = function (data) {
  return '<div class="individualImageDiv"><img src="' + data.imgURL + '"class="image"></div>';
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
  });
};

window.onload = function () {
  serverGrab();
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
  $("#status").hide(function() {
    $("#status").html("File uploaded successfully!").fadeIn("slow");
  });
}