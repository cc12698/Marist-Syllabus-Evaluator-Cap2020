document.querySelectorAll(".drop-zone__input").forEach((inputElement) => {
  const dropZoneElement = inputElement.closest(".drop-zone");

  dropZoneElement.addEventListener("click", (e) => {
    inputElement.click();
  });

  inputElement.addEventListener("change", (e) => {
    if (inputElement.files.length) {
      var file = (inputElement.files[0].name).toString();
      var ext = file.split('.').pop().toLowerCase();
      if($.inArray(ext, ['doc','docx','pages','pdf']) == -1) {
          alert('Invalid File Type.\nPlease Upload a Word Document, PDF, or Pages File.');
          $('#upload').value = "";
      }
      else{
        updateThumbnail(dropZoneElement, inputElement.files[0]);
      }
    }
  });

  dropZoneElement.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZoneElement.classList.add("drop-zone--over");
  });

  ["dragleave", "dragend"].forEach((type) => {
    dropZoneElement.addEventListener(type, (e) => {
      dropZoneElement.classList.remove("drop-zone--over");
    });
  });

  dropZoneElement.addEventListener("drop", (e) => {
    e.preventDefault();

    if (e.dataTransfer.files.length) {
      var file = (e.dataTransfer.files[0].name).toString();
      var ext = file.split('.').pop().toLowerCase();
      if($.inArray(ext, ['doc','docx','pages','pdf']) == -1) {
          alert('Invalid File Type.\nPlease Upload a Word Document, PDF, or Pages File.');
          $('#upload').value = "";
      }
      else{
        inputElement.files = e.dataTransfer.files;
        updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
      }

    }

    dropZoneElement.classList.remove("drop-zone--over");
  });
});

/**
 * Updates the thumbnail on a drop zone element.
 *
 * @param {HTMLElement} dropZoneElement
 * @param {File} file
 */
function updateThumbnail(dropZoneElement, file) {
  let thumbnailElement = dropZoneElement.querySelector(".drop-zone__thumb");

  // First time - remove the prompt
  if (dropZoneElement.querySelector(".drop-zone__prompt")) {
    dropZoneElement.querySelector(".drop-zone__prompt").remove();
  }

  // First time - there is no thumbnail element, so lets create it
  if (!thumbnailElement) {
    $(".drop-zone").css('background-image', 'none');
    $("#dragdrop").hide();
    thumbnailElement = document.createElement("div");
    thumbnailElement.classList.add("drop-zone__thumb");
    dropZoneElement.appendChild(thumbnailElement);
  }

  thumbnailElement.dataset.label = file.name;

}
