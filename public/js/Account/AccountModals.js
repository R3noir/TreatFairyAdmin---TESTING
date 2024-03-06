$(document).ready( async function() {
    let namedata;
    await fetch('/query/userinfo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if(response.status === 401) {
            window.location.href = '/Forbidden';
            return;
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            ShowSnackbar({ message: data.error, color: errorcolor, icon: erroricon });
        } else {
            $('#email').val(data.data[0].email);
            $('#firstName').val(data.data[0].fname);
            $('#currentFName').val(data.data[0].fname);
            $('#lastName').val(data.data[0].lname);
            $('#currentLName').val(data.data[0].lname);
            $('#currentEmail').val(data.data[0].email);
            namedata = data.data[0];
        }
    });
    $('#change-email').on('click', function() {
        $('#emailChangeModal').modal('show');
    });
    attachCharCountListener('#currentEmail', '#currentEmailCount');
    attachCharCountListener('#newEmail', '#newEmailCount');
    attachCharCountListener('#confirmNewEmail', '#confirmNewEmailCount');

    $('#emailChangeForm').off('submit').on('submit', async function(e) {
        $('#change-email-btn').prop('disabled', true);
        ShowSnackbar({ message: 'Please wait...', color: waitcolor, icon: waiticon });

        e.preventDefault();
        const currentEmail = $('#currentEmail').val();
        const newEmail = $('#newEmail').val();
        const confirmNewEmail = $('#confirmNewEmail').val();
        if (newEmail !== confirmNewEmail) {
            ShowSnackbar({ message: 'Emails do not match', color: errorcolor, icon: erroricon });
            $('#change-email-btn').prop('disabled', false);
            return;
        }
        if (currentEmail === newEmail) {
            ShowSnackbar({ message: 'New email cannot be the same as the current email', color: errorcolor, icon: erroricon });
            $('#change-email-btn').prop('disabled', false);
            return;
        }
        await fetch('/update/changeemail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({confirmNewEmail: confirmNewEmail , newEmail: newEmail }),
        })
        .then(response => {
            if(response.status === 401) {
                window.location.href = '/Forbidden';
                return;
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                $('#change-email-btn').prop('disabled', false);
                ShowSnackbar({ message: data.error, color: errorcolor, icon: erroricon });
            } else {
                ShowSnackbar({ message: 'Email change request has been sent!', color: successcolor, icon: successfuicon });
                $('#newEmail').val('');
                $('#confirmNewEmail').val('');
                $('#newEmailCount').text('0 / 255');
                $('#confirmNewEmailCount').text('0 / 255');
                $('#emailChangeModal').modal('hide');
                $('#change-email-btn').prop('disabled', false);
            }
        });
    });

    $('#emailChangeModal').on('hidden.bs.modal', function () {
        $('#newEmail').val('');
        $('#confirmNewEmail').val('');
        $('#newEmailCount').text('0 / 255');
        $('#confirmNewEmailCount').text('0 / 255');
    });

    $('#change-password').on('click', function() {
        $('#changePasswordModal').modal('show');
    });

    $('#newPassword, #confirmNewPassword').on('keyup', function() {
        let password = $('#newPassword').val();
        let retypePassword = $('#confirmNewPassword').val();

        $('#length').css('background-color', (password.length >= 8 && password.length <= 72) ? 'green' : 'red');
        $('#upper').css('background-color', /[A-Z]/.test(password) ? 'green' : 'red');
        $('#lower').css('background-color', /[a-z]/.test(password) ? 'green' : 'red');
        $('#number').css('background-color', /\d/.test(password) ? 'green' : 'red');
        $('#symbol').css('background-color', /\W/.test(password) ? 'green' : 'red');
        $('#match').css('background-color', (password.trim() === retypePassword.trim() && password.trim() !== '') ? 'green' : 'red');
    });

    $('#changePasswordForm').off('submit').on('submit', async function(e) {

        $('#change-password-btn').prop('disabled', true);
        ShowSnackbar({ message: 'Please wait...', color: waitcolor, icon: waiticon });

        e.preventDefault();
        const currentPassword = $('#currentPassword').val();
        const newPassword = $('#newPassword').val();
        const confirmNewPassword = $('#confirmNewPassword').val();
        if (newPassword !== confirmNewPassword) {
            ShowSnackbar({ message: 'Passwords do not match', color: errorcolor, icon: erroricon });
            $('#change-password-btn').prop('disabled', false);
            return;
        }
        await fetch('/update/changepassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({currentPassword: currentPassword, newPassword: newPassword, confirmNewPassword: confirmNewPassword}),
        })
        .then(response => {
            if(response.status === 401) {
                window.location.href = '/Forbidden';
                return;
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                $('#change-password-btn').prop('disabled', false);
                ShowSnackbar({ message: data.error, color: errorcolor, icon: erroricon });
            } else {
                ShowSnackbar({ message: 'Password successfully changed', color: successcolor, icon: successfuicon });
                $('#changePasswordForm').trigger('reset');
                $('#changePasswordModal').modal('hide');
                $('#change-password-btn').prop('disabled', false);
            }
        });
    });

    $('#change-name').on('click', function() {
        $('#currentFName').val($('#firstName').val());
        $('#currentLName').val($('#lastName').val());
        attachCharCountListener('#currentFName', '#FNameCount');
        attachCharCountListener('#currentLName', '#LNameCount');
        $('#nameChangeModal').modal('show');
    });

    $('#changePasswordModal').on('hidden.bs.modal', function () {
        $('#length').css('background-color', 'red');
        $('#upper').css('background-color', 'red');
        $('#lower').css('background-color', 'red');
        $('#number').css('background-color', 'red');
        $('#symbol').css('background-color', 'red');
        $('#match').css('background-color', 'red');
        $('#changePasswordForm').trigger('reset');
    });

    $('#nameChangeForm').off('submit').on('submit', async function(e) {
        $('#change-name-btn').prop('disabled', true);
        ShowSnackbar({ message: 'Please wait...', color: waitcolor, icon: waiticon });
        e.preventDefault();
        const updatedFname = $('#currentFName').val();
        const updatedLname = $('#currentLName').val();
        if (currentFName === namedata.fname && currentLName === namedata.lname ) {
            $('#change-name-btn').prop('disabled', false);
            ShowSnackbar({ message: 'No change detected!', color: successcolor, icon: successcolor });
            return;
        }
        let newFName;
        let newLName;
        if(updatedFname != namedata.fname ) {
            newFName = updatedFname;
        }
        if(updatedLname != namedata.lname ) {
            newLName = updatedLname;
        }
        await fetch('/update/changename', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({newFName: newFName, newLName: newLName}),
        })
        .then(response => {
            if(response.status === 401) {
                window.location.href = '/Forbidden';
                return;
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                $('#change-name-btn').prop('disabled', false);
                ShowSnackbar({ message: data.error, color: errorcolor, icon: erroricon });
            } else {
                ShowSnackbar({ message: 'Name has been updated!', color: successcolor, icon: successfuicon });
                $('#nameChangeForm').trigger('reset');
                $('#nameChangeModal').modal('hide');
                $('#change-name-btn').prop('disabled', false);
                window.location.reload();
            }
        });
    });
});

$('.toggle-password').click(function() {
    let input = $(this).prev();
    let type = input.attr('type') === 'password' ? 'text' : 'password';
    input.attr('type', type);
    $(this).text(type === 'password' ? 'SHOW' : 'HIDE');
});
