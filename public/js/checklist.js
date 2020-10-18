// on submit returns what checkboxes are checked
function getCheckedCheckboxesFor(checkboxName) {
    var checkboxes = document.querySelectorAll('input[type=checkbox]:checked'), values = [];
    Array.prototype.forEach.call(checkboxes, function(el) {
        values.push(el.value);
    });
    // alert(values);
    return values;
}
