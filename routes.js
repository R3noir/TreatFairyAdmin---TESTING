const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/Login.html'));
});

router.get('/inventory', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/Inventory.html'));
});
router.get('/salesinvoice', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/SalesInvoice.html'));
});
router.get('/resetpassword', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/ResetPassword.html'));
});

module.exports = router;