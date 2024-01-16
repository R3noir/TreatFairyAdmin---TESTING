const togglePassword = document.getElementById('togglePassword');
const togglePasswordIcon = togglePassword.children[0];
const snackbar = document.getElementById('snackbar');
const SnackBarDelayMs = 3000;

//Events
togglePassword.addEventListener('click', function () {
    var passwordInput = document.getElementById('password');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        togglePasswordIcon.innerHTML = 'visibility';
    } else {
        passwordInput.type = 'password';
        togglePasswordIcon.innerHTML = 'visibility_off';
    }

    if(snackbar.className == 'show') {
        return;
    }
snackbar.className = 'show';
// After 3 seconds, remove the show class from DIV
setTimeout(function(){ snackbar.className = snackbar.className.replace('show', 'hide'); }, SnackBarDelayMs);
});

// Show the snackbar
