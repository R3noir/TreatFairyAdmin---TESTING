$(document).ready( async function() {
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
            console.log(data);
            $('#email').val(data.data[0].email);
            $('#firstName').val(data.data[0].fname);
            $('#lastName').val(data.data[0].lname);
            $('#currentEmail').val(data.data[0].email);
        }
    });
    $('#change-email').on('click', function() {
        $('#emailChangeModal').modal('show');
    });
    attachCharCountListener('#currentEmail', '#currentEmailCount');
    attachCharCountListener('#newEmail', '#newEmailCount');
    attachCharCountListener('#confirmNewEmail', '#confirmNewEmailCount');

    $('#emailChangeForm').on('submit', async function(e) {
        e.preventDefault();
        const currentEmail = $('#currentEmail').val();
        const newEmail = $('#newEmail').val();
        const confirmNewEmail = $('#confirmNewEmail').val();
        if (newEmail !== confirmNewEmail) {
            ShowSnackbar({ message: 'Emails do not match', color: errorcolor, icon: erroricon });
            return;
        }
        if (currentEmail === newEmail) {
            ShowSnackbar({ message: 'New email cannot be the same as the current email', color: errorcolor, icon: erroricon });
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
                ShowSnackbar({ message: data.error, color: errorcolor, icon: erroricon });
            } else {
                ShowSnackbar({ message: 'Email updated successfully', color: successcolor, icon: successicon });
                $('#emailChangeModal').modal('hide');
            }
        });
    });
});

