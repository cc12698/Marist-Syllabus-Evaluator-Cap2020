

function convFile(file){
  ext = "";

  fileName = file.value;
  ext = fileName.substring(fileName.lastIndexOf('.') + 1);

  if(ext == "pdf"){
    convPDF(file);
  }
  else if(ext == "docx"){
    convWord(file);
  }
  else if(ext == "pages"){ //no sylibus should be in a format only macs can read smh
    convPages(file);
  }
}

function convPDF(file){

}

function convWord(file){

}

function convPages(file){

}
