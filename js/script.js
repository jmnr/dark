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

  addDivs: function (data) {
    var lastLoved = Math.floor((new Date().getTime() - Number(data.lastLoved)) / 60000); //86400000
    var opacityValue = 1 / lastLoved;
    return '<div id="' + data.id + '" class="individualImageDiv"><div class="imageHolder"><img class="image" style="opacity:' +
      opacityValue + '" src="' + data.imgURL + '"></div><button class="loveButton">LOVE</button></div>';
  },

  getHomepageImages: function () {
    $.get('/getHomepageImages', function(data) {
      var files = JSON.parse(data).sort(funcs.sortFiles);
      var accessDOM = '';
      var fileLoad = files.length > 50 ? 50 : files.length;
      for(var i = 0 ; i < fileLoad; i++) {
        accessDOM += funcs.addDivs(files[i]);
      }
      $('#imageContainer').html(accessDOM);
    });
  },

  getProfileImages: function () {
    // $.get('/getProfileImages', function(data) {
    // });
  },

  getSignedRequest: function (file){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/signS3?fileType=' + file.type);
    xhr.onreadystatechange = function(){
      if(xhr.readyState === 4){
        if(xhr.status === 200){
          funcs.uploadFile(file, xhr.responseText);
        }
        else{
          alert('Could not get signed URL.');
        }
      }
    };
    xhr.send();
  },

  uploadFile: function (file, data) {
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', data);
    xhr.setRequestHeader('x-amz-acl', 'public-read');
    xhr.onerror = function() {
      alert('Could not upload file.');
    };
    xhr.send(file);
    $('#status').fadeOut('slow', function() {
      $('#status').html('File uploaded successfully!').fadeIn('slow');
      document.getElementById('fileInput').value = null; //clears input to prevent the same image being submitted multiple times
    });
  }

};