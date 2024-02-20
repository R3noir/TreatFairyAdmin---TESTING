const express = require('express');
const router = express.Router();
const Auth = require('./private/Auth.js');
const Validate = require('./private/FormValidation.js');

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if(!Validate.validateEmail(email)) {
        return res.status(400).json({ error: 'Invalid email'});
    }
    const response = await Auth.signInWithPassword({ email, password });
    if(response.error) {
        return res.status(400).json({ error : response.error });
    }
    else{
        return res.status(200).json({ data: response.data });
    }
});

router.get('/logout', async (req, res) => {
    try {
        await Auth.logOut();
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error logging out');
    }
});

module.exports = router;