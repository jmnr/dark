
function handlers() {
  return {

    displayHome: function(request, reply) {
      if (request.auth.isAuthenticated) {
        request.log('analytics request is being sent');
        reply.view('home', {
          name: request.auth.credentials.username
        });
      }
      else {
        request.log('analytics request is being sent');
        reply.view('home', {
        name: 'stranger!'
      });
     }
    },

    loginUser: function(request, reply) {
       request.log('analytics request is being sent');
        request.auth.session.set(request.auth.credentials.profile);
        reply.redirect('/');
        //add changed buttons
    },

    logoutUser: function(request,reply) {
      request.log('analytics request is being sent');
      request.auth.session.clear();
      reply.redirect('/');
    },

    awsS3: function(request, reply) {
      console.log("sign s3");
      aws.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});
      var s3 = new aws.S3();
      var s3_params = {
        Bucket: S3_BUCKET,
        Key: 'images/' + request.query.file_name,
        Expires: 60,  
        ContentType: request.query.file_type,
        ACL: 'public-read'
      };
      s3.getSignedUrl('putObject', s3_params, function(err, data){
        if(err){
          console.log(err);
        }
          else{
              // var return_data = {
              //     signed_request: data,
              //     url: 'https://'+S3_BUCKET+'.s3.amazonaws.com/'+request.query.file_name
              // };
              // reply.write(JSON.stringify(return_data));
              // reply.end();
              reply(data);
          }
      });
    }
  };
}

module.exports = handlers;
