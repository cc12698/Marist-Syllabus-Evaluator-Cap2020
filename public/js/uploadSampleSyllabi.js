function getFileInfo(){
	var file = document.getElementById('upload').files[0];

	// console.log(file.name);
	$('#fileNameSyl').val(file.name);

}
