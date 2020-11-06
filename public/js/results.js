var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
}
/*
function getResults(){
    fetch('/api/getResults/').then(function(response){
      if(response.status != 200){
        console.log('problem with ajax call!' + response.status + "msg: " + response.value);
        return;
    }
    response.text().then(function(data){
      console.log("received back: " + data);
    });
  });
}*/
