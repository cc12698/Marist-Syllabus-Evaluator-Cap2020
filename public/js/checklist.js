function check(checked = true) {
    const cbs = document.querySelectorAll('input[type=checkbox]');
    cbs.forEach((cb) => {
        cb.checked = checked;
    });
}

const btn = document.querySelector('#btn');
btn.onclick = checkAll;

function checkAll() {
    check();
    // reassign click event handler
    btn.innerHTML = 'Uncheck All';
    this.onclick = uncheckAll;
}

function uncheckAll() {
    check(false);
    // reassign click event handler
    btn.innerHTML = 'Check All';
    this.onclick = checkAll;
}
