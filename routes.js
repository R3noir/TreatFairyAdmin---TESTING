const express = require('express');
const router = express.Router();
const path = require('path');
const Auth = require('./private/Auth.js');

async function ensureAuthenticated(req, res, next) {
    await Auth.isSessionExpired().then(response => {
        console.log(response)
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