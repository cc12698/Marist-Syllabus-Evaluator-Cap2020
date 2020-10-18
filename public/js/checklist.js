function getCheckedUnchecked(){
  $('#checked').val() = getCheckedCheckboxesFor();
  $('#unchecked').val() = getUncheckedCheckboxesFor();
  alert($('#checked').val());
}
// on submit returns what checkboxes are checked
function getCheckedCheckboxesFor() {
    var checkboxes = document.querySelectorAll('input[type=checkbox]:checked'), values = [];
    Array.prototype.forEach.call(checkboxes, function(el) {
        values.push(el.value);
    });
    // console.log(values);
    return values;
}

// on submit returns what checkboxes are unchecked
function getUncheckedCheckboxesFor() {
    var checkboxes = document.querySelectorAll('input[type=checkbox]:not(:checked)'), values = [];
    Array.prototype.forEach.call(checkboxes, function(el) {
        values.push(el.value);
    });
    // console.log(values);
    return values;
}
