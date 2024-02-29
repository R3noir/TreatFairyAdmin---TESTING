
const snackbar = document.getElementById('snackbar');
const snackbarmessage = document.getElementById('snackbar-message');
const snackbaricon = document.getElementById('snackbar-icon');
const snackBarDelayMs = 3000;
const buttonDelayMs = 1000;

const successcolor = '#4CAF50';
const errorcolor = '#F44336';
const successfuicon = 'check_circle';
const erroricon = 'error';

const redirectDelayMs = 2000;
//Functions
function ShowSnackbar(Parameters){
    snackbar.className = 'show';
    snackbar.style.color = Parameters.color;
    snackbaricon.innerHTML = Parameters.icon;
    snackbarmessage.innerHTML = Parameters.message;
    setTimeout(function()
        { snackbar.className = snackbar.className.replace('show', 'hide'); 

        }, snackBarDelayMs);
}

function DisableButton(button){
    button.disabled = true;
    setTimeout(function()
        { button.disabled = false; 
        }, buttonDelayMs);
}

$('#newPassword, #confirmNewPassword').on('keyup', function() {
    let password = $('#newPassword').val();
    let retypePassword = $('#confirmNewPassword').val();

    $('#length').css('background-color', (password.length >= 8 && password.length <= 72) ? 'green' : 'red');
    $('#upper').css('background-color', /[A-Z]/.test(password) ? 'green' : 'red');
    $('#lower').css('background-color', /[a-z]/.test(password) ? 'green' : 'red');
    $('#number').css('background-color', /\d/.test(password) ? 'green' : 'red');
    $('#symbol').css('background-color', /\W/.test(password) ? 'green' : 'red');
    $('#match').css('background-color', password === retypePassword ? 'green' : 'red');
});

$('.toggle-password').click(function() {
    let input = $(this).prev();
    let type = input.attr('type') === 'password' ? 'text' : 'password';
    input.attr('type', type);
    $(this).text(type === 'password' ? 'SHOW' : 'HIDE');
});

$('#Changepassword-form').submit(async function(e) {
    e.preventDefault();
    let newPassword = $('#newPassword').val();
    let confirmNewPassword = $('#confirmNewPassword').val();

    if (newPassword !== confirmNewPassword) {
        ShowSnackbar({
            message: "Passwords do not match",
            color: errorcolor,
            icon: erroricon
        });
    }
    else {
        await fetch('/update/resetpassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                newPassword: newPassword,
                confirmNewPassword: confirmNewPassword
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.error) {
                ShowSnackbar({
                    message: data.error,
                    color: errorcolor,
                    icon: erroricon
                });
            } else {
                ShowSnackbar({
                    message: 'Password successfully changed! Redirecting...',
                    color: successcolor,
                    icon: successfuicon
                });
                setTimeout(function() {
                    window.location.href = '/inventory';
                }, 2000);
            }
        });
    }
});