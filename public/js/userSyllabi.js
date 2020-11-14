$(document).on("click", '.remove',function(){
  var filename = $(this).attr("name");
  fetch('/deleteUserSyl',
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

$(document).on("click", '.removeAll',function(){
  confirmRemoveAll();
});

function confirmRemoveAll() {
  var r = confirm("Are you sure you want to remove all saved syllabi?\nThis action cannot be undone.");
  if (r == true) {
    fetch('/removeAll',
    {
      method:'post',
      headers: {
        "Content-type": "application/json"
      }
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
  }
}
