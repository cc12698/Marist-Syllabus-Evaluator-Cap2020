// check that the file is a pdf, pages, doc, docx
function checkFile () {
  var ext = $('#upload').val().split('.').pop().toLowerCase();
  if($.inArray(ext, ['doc','docx','pages','pdf']) == -1) {
      alert('invalid extension!');
      $('#upload').value = "";
  }

}
