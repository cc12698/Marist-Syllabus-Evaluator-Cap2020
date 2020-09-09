/*window.addEventListener('click', function(){
  var submit = document.getElementById('subDoc');
  var x = event.srcElement;
  if(x === submit){
    get();
  }
});

function get(){
  fetch('/api/accessLog/result').then(function(response) {
    if (response.status !== 200) {
      console.log('your request is not good.');
    }
    response.text().then(function(data) {
		  console.log("here is the data: " + data);
      //calls method to print the scores
    })
  });
}*/
