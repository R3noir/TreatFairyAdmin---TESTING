const express = require('express');
const router = express.Router();
const path = require('path');
const Auth = require('./private/Auth.js'); // Make sure to adjust the path to your Auth.js file

async function ensureAuthenticated(req, res, next) {
    const user = await Auth.getUser();
    if(user == null) {
        res.redirect('/');
    } else {
        next();
    }
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
router.get('/resetpassword', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/ResetPassword.html'));
});

module.exports = router;