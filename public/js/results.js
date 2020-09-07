window.addEventListener('load', function(){
  screen();
});

 function screen(){
   fetch('/api/accessLog/result').then(function(response){
     if(response.status !== 200){
       console.log('problem with ajax call!' + response.status + "msg: " + response.value);
       return;
     }
     response.text().then(function(data){
       console.log("received back: " + data);
       logAdd(data);
     });
   });
 }
