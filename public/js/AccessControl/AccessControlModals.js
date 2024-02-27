$(document).ready(function() {
    $('.add-btn').on('click', function() {
        $('#adminModal').modal('show');
        attachCharCountListener('#firstName', '#firstNameCount');
        attachCharCountListener('#lastName', '#lastNameCount');
        attachCharCountListener('#email', '#emailCount');
        attachCharCountListener('#confirmEmail', '#confirmEmailCount');
        attachCharCountListener('#password', '#passwordCount');
        attachCharCountListener('#retypePassword', '#retypePasswordCount');
    });

    $('#password, #retypePassword').on('keyup', function() {
        let password = $('#password').val();
        let retypePassword = $('#retypePassword').val();

        $('#length').css('background-color', (password.length >= 8 && password.length <= 72) ? 'green' : 'red');
        $('#upper').css('background-color', /[A-Z]/.test(password) ? 'green' : 'red');
        $('#lower').css('background-color', /[a-z]/.test(password) ? 'green' : 'red');
        $('#number').css('background-color', /\d/.test(password) ? 'green' : 'red');
        $('#symbol').css('background-color', /\W/.test(password) ? 'green' : 'red');
        $('#match').css('background-color', password === retypePassword ? 'green' : 'red');
    });

    $('#adminForm').on('submit', async function(e) {
        e.preventDefault();
        let firstName = $('#firstName').val();
        let lastName = $('#lastName').val();
        let email = $('#email').val();
        let confirmEmail = $('#confirmEmail').val();
        let password = $('#password').val();
        let retypePassword = $('#retypePassword').val();

        if (password !== retypePassword) {
            ShowSnackbar({
                message: 'Passwords do not match',
                color: errorcolor,
                icon: erroricon
            });
            return;
        }

        if (email !== confirmEmail) {
            ShowSnackbar({
                message: 'Emails do not match',
                color: errorcolor,
                icon: erroricon
            });
            return;
        }

        await fetch('/insert/newuser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
                options: {
                    data: {
                        fname: firstName,
                        lname: lastName,
                    }
                }
            })
        }).then(response => {
            if(response.status === 401) {
                window.location.href = '/Forbidden';
                return;
            }
            return response.json();
        }).then(data => {
            if (data.message_error) {
                ShowSnackbar({
                    message: data.message_error,
                    color: errorcolor,
                    icon: erroricon
                });
            } else {
                ShowSnackbar({
                    message: 'User added successfully',
                    color: successcolor,
                    icon: successfuicon
                });
                $('#adminModal').modal('hide');
                $('#adminForm')[0].reset();
                $('#AdminTable').DataTable().ajax.reload();
            }
        }).catch(error => {
            ShowSnackbar({
                message: error,
                color: errorcolor,
                icon: erroricon
            });
        });
    });

    $('#adminModal').on('hidden.bs.modal', function() {
        $('#adminForm')[0].reset();
    });
});