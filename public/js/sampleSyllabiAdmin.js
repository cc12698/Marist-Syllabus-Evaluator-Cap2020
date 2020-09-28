$(document).on("click", '.remove',function(){
  var filename = $(this).attr("name");
  fetch('/deleteSampleSyl',
  {
    method:'post',
    headers: {
      "Content-type": "application/json"
    },
    body: '{"filename": "' + filename +'"}'

  }).then(function(response) {
      if (response.status !== 200) {
        console.log('your request is not good');
        return;
      }
      else{
        location.reload();
        location.reload();
      }
  });
});
