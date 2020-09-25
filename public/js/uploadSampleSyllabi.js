function getFileInfo(){
	var file = document.getElementById('sample_syl').files[0];

	// console.log(file.name);
	$('#fileNameSyl').val(file.name);
  var fileName = file.name;
  var ext = fileName.split('.').pop().toLowerCase();
  if($.inArray(ext, ['doc','docx','pages','pdf']) == -1) {
      alert('Invalid File Type.\nPlease Upload a Word Document, PDF, or Pages File.');
      $('#fileNameSyl').value = "";
      $('#sample_syl').value = "";
  }
  // console.log($('#fileNameSyl').val());
}
