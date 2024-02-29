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
        $('#submit-form').prop('disabled', true);
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
            $('#submit-form').prop('disabled', false);
            return;
        }

        if (email !== confirmEmail) {
            ShowSnackbar({
                message: 'Emails do not match',
                color: errorcolor,
                icon: erroricon
            });
            $('#submit-form').prop('disabled', false);
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
                console.log(data)
                ShowSnackbar({
                    message: data.message_error,
                    color: errorcolor,
                    icon: erroricon
                });
                $('#submit-form').prop('disabled', false);
            } else {
                ShowSnackbar({
                    message: 'User added successfully',
                    color: successcolor,
                    icon: successfuicon
                });
                $('#submit-form').prop('disabled', false);
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
            $('#submit-form').prop('disabled', false);
        });
    });

    $('#adminModal').on('hidden.bs.modal', function() {
        $('#adminForm')[0].reset();
    });
});

$('.toggle-password').click(function() {
    let input = $(this).prev();
    let type = input.attr('type') === 'password' ? 'text' : 'password';
    input.attr('type', type);
    $(this).text(type === 'password' ? 'SHOW' : 'HIDE');
});
