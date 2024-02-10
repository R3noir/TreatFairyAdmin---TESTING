const express = require('express');
const router = express.Router();
const Auth = require('./private/Auth.js');
const Validate = require('./private/FormValidation.js');

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if(!Validate.validateEmail(email)) {
        return res.status(400).json({ error: 'Invalid email'});
    }
    const response = await Auth.signInWithPassword(req.body, res);
    console.log(response)
    if(response.status != 200) {
        return res.status(response.status).json({ error : response.error });
    }
        return res.status(200).json({ message: 'Login successful' });
});

router.get('/logout', async (req, res) => {
    try {
        await Auth.logOut();
        // Redirect to the login page after logout
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error logging out');
    }
});

module.exports = router;