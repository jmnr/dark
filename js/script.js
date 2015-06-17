$("#submitUpload").click(function() {
  var file = document.getElementById("file_input").files[0];
  if(file === null){
      alert("No file selected.");
  }
  else{
      get_signed_request(file);
  }
});

function addID() {
  var ID = "";
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for(var i = 0; i < 10; i++) {
      ID += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ID;
}

function get_signed_request(file){
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/sign_s3?file_name="+file.name+"&file_type="+file.type);
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
}