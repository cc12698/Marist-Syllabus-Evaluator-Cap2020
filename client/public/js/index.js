document.addEventListener('click', function(event){
  var submitDoc = document.getElementById('sub Doc');//change to sub
  var x = event.srcElement;
    if(x === submitDoc){
      var doc = document.getElementById('myFile').value;
      console.log(doc);
      sendDoc(doc);
    }
  });


function sendDoc(data){
  fetch('/api/sendDoc/doc',
    {
      method: "POST",
      headers:{
        "Content-type":"application/json; charset=UTF-8"
      },
      body: data,
    }).then(function(response){
      if(response.status !== 200){
      console.log('problem with ajax call! ' + response.status + "msg: " + response.value);
      return;
    }
  });
  console.log("Data: " + JSON.stringify(data) + " saved!");
}
