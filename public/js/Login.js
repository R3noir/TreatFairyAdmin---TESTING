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


window.onload = async function() {
    // Parse the URL fragment
    const fragment = new URL(window.location.href).hash.substring(1);
    const params = new URLSearchParams(fragment);

    // Check if the error parameters are present
    if (params.get('error')) {
        const error = params.get('error');
        const errorCode = params.get('error_code');
        const errorDescription = params.get('error_description');

        // Handle the error here
        window.location.href = `/invalid?error=${error}&error_code=${errorCode}&error_description=${errorDescription}`;
    }
    if (params.get('message')) {
        const message = params.get('message');
    
        window.location.href = `/message?message=${message}`;
    }
    if (params.get('access_token')) {
        const accessToken = params.get('access_token');
        const expiresIn = params.get('expires_in');
        const refreshToken = params.get('refresh_token');
        const tokenType = params.get('token_type');
        const type = params.get('type');

        switch (type) {
            case 'signup':
                await fetch('/auth/setsession', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        accessToken: accessToken,
                        expiresIn: expiresIn,
                        refreshToken: refreshToken,
                        tokenType: tokenType
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        window.location.href = `/invalid?error=${data.error}`;
                    } else {
                        window.location.href = `/confirmed?message=Email+succesfully+confirmed!`;
                    }
                });
                break;
            case 'recovery':
                await fetch('/auth/setsession', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        accessToken: accessToken,
                        expiresIn: expiresIn,
                        refreshToken: refreshToken,
                        tokenType: tokenType
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        window.location.href = `/invalid?error=${data.error}`;
                    }
                    else {
                        window.location.href = '/changepassword';
                    }
                });
                break;
            case 'email_change':
                await fetch('/auth/setsession', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        accessToken: accessToken,
                        expiresIn: expiresIn,
                        refreshToken: refreshToken,
                        tokenType: tokenType
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        window.location.href = `/invalid?error=${data.error}`;
                    }
                    else {
                        window.location.href = `/confirmed?message=Email+succesfully+changed!`;
                    }
                });
                break;
            default:
                console.log('Unknown type: ' + type);

    }
}};