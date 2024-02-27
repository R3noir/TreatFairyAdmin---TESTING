const express = require('express');
const router = express.Router();
const path = require('path');
const Auth = require('./private/Auth.js');

async function ensureAuthenticated(req, res, next) {
    await Auth.isSessionExpired().then(response => {
        if (response.error) {
            return res.redirect('/');
        }
        else {
            next();
        }
    });
}


router.get('/', async (req, res) => {
    // Get the URL parameters
    const urlParams = new URLSearchParams(req.query);

    // Check if the type parameter is 'email_change'
    if (urlParams.get('type') === 'email_change') {
        // Get the session ID
        const sessionId = urlParams.get('session_id');

        // Get the session information
        const { data: session, error } = await Auth.getUserByCookie(sessionId);

        if (error) {
            console.log('Error getting session information:', error.message);
            res.sendFile(path.join(__dirname, 'public/html/Invalidlink.html'));

        } else if (session) {
            console.log('Email change confirmed');
        }
    } else {
        res.sendFile(path.join(__dirname, 'public/html/Login.html'));
    }
});
router.get('/forbidden', async (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/Forbidden.html'));
});

router.get('/inventory', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/Inventory.html'));
});
router.get('/salesinvoice', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/SalesInvoice.html'));
});

router.get('/accesscontrol', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/AccessControl.html'));
});

router.get('/account', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/Account.html'));
});

router.get('/resetpassword', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/ResetPassword.html'));
});

module.exports = router;