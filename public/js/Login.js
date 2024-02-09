const emailinput= document.getElementById('email-in');
const passwordinput = document.getElementById('password-in');

const form = document.getElementById('login-form');
const loginbtn = document.getElementById('login-btn');
const togglePassword = document.getElementById('togglePassword');
const togglePasswordIcon = togglePassword.children[0];


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

//Events
form.addEventListener('submit', async function(event) {
    event.preventDefault();

    DisableButton(loginbtn);

    const LoginDetails = {
        email: emailinput.value,
        password: passwordinput.value
    }
    await fetch('/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(LoginDetails)
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            ShowSnackbar({
                message: data.error,
                color: errorcolor,
                icon: erroricon
            });
        } else {
            ShowSnackbar({
                message: 'Successfully logged in! Redirecting...',
                color: successcolor,
                icon: successfuicon
            });
            window.location.href = '/inventory';
        }
    })
});

togglePassword.addEventListener('click', function () {
    if (passwordinput.type === 'password') {
        passwordinput.type = 'text';
        togglePasswordIcon.innerHTML = 'visibility';
    } else {
        passwordinput.type = 'password';
        togglePasswordIcon.innerHTML = 'visibility_off';
    }

    if(snackbar.className == 'show') {
        return;
    }
});
