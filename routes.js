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
    res.sendFile(path.join(__dirname, 'public/html/Login.html'));
});

router.get('/forbidden', async (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/Forbidden.html'));
});

router.get('/invalid', (req, res) => {
    const error = req.query.error;
    const errorCode = req.query.error_code;
    const errorDescription = req.query.error_description;

    res.render('Invalidlink', { error, errorCode, errorDescription });
});

router.get('/message', (req, res) => {
    const message = req.query.message;
    res.render('message', { message });
});

router.get('/confirmed', ensureAuthenticated, (req, res) => {
    const message = req.query.message;
    res.render('confirmed', { message });
});

router.get('/forgotpassword', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/ForgotPassword.html'));
});

router.get('/changepassword', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/Changepassword.html'));
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