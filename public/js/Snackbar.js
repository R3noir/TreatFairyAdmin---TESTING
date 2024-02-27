const snackBarDelayMs = 3500;
const buttonDelayMs = 1000;

const successcolor = '#4CAF50';
const errorcolor = '#F44336';
const successfuicon = 'check_circle';
const erroricon = 'error';

let snackbarQueue = [];

function ShowSnackbar(Parameters) {
    snackbarQueue.push(Parameters);
    if (snackbarQueue.length === 1) {
        processQueue();
    }
}

function processQueue() {
    if (snackbarQueue.length > 0) {
        let Parameters = snackbarQueue[0];
        $('#snackbar').css('color', Parameters.color);
        $('#snackbar-message').text(Parameters.message);
        $('#snackbar-icon').text(Parameters.icon);
        $('#snackbar').removeClass('hide').addClass('show');
        setTimeout(function() {
            $('#snackbar').removeClass('show').addClass('hide');
            snackbarQueue.shift();
            if (snackbarQueue.length > 0) {
                setTimeout(processQueue, buttonDelayMs);
            }
        }, snackBarDelayMs);
    }
}