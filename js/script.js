var funcs = {

  sortFiles: function (a, b) {
    var aTime = Number(a.time);
    var bTime = Number(b.time);
    if (aTime < bTime) {
      return 1;
    }
    if (aTime > bTime) {
      return -1;
    }
    return 0;
  },

  opacitySet: function (time) {
    return new Date(new Date().getTime() - Number(time)).getHours() * 10;
  },

  addID: function () {
    var ID = "";
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for(var i = 0; i < 10; i++) {
      ID += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return ID;
  },

  addDivs: function (data) {
    var lastLoved = Math.floor((new Date().getTime() - Number(data.lastLoved)) / 86400000);
    var opacityValue = 1 / lastLoved;
    return '<div class="individualImageDiv"><div class="imageHolder"><img class="image" style="opacity:' + opacityValue + '" src="' + data.imgURL + '"></div></div>';
  },

  getHomepageImages: function () {
    $.get('/getHomepageImages', function(data) {
      var files = JSON.parse(data).sort(funcs.sortFiles);
      var accessDOM = '';
      var fileLoad = files.length > 50 ? 50 : files.length;
      for(var i = 0 ; i < fileLoad; i++) {
        accessDOM += funcs.addDivs(files[i]);
      }
      $("#imageContainer").html(accessDOM);
    });
  },

  getProfileImages: function () {
    // $.get('/getProfileImages', function(data) {
    // });
  },

  loveClick: function () {
    $(".loveButton").on('click', function() {
      var countElement = $(this).siblings()[1];
      var loveCountString = $(countElement).html();
      var loveCount = parseInt(loveCountString);
      loveCount = loveCount + 1;
      $(countElement).html(loveCount + " loves");
      var imageHolder = $(this).siblings()[0];
      var image = $(imageHolder).children()[0];
      var currentOpacity = $(image).css('opacity');
      var opacity = (currentOpacity * 10 + 1)/10;
      $(image).css('opacity', opacity);
    });
  },

  get_signed_request: function (file){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/sign_s3?file_name=" + funcs.addID() + "&file_type=" + file.type);
    xhr.onreadystatechange = function(){
      if(xhr.readyState === 4){
        if(xhr.status === 200){
          funcs.upload_file(file, xhr.responseText);
        }
        else{
          alert("Could not get signed URL.");
        }
      }
    };
    xhr.send();
  },

  upload_file: function (file, data) {
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", data);
    xhr.setRequestHeader('x-amz-acl', 'public-read');
    xhr.onerror = function() {
      alert("Could not upload file.");
    };
    xhr.send(file);
    $("#status").fadeOut("slow", function() {
      $("#status").html("File uploaded successfully!").fadeIn("slow");
      document.getElementById("file_input").value = null; //clears input to prevent the same image being submitted multiple times
    });
  }

};