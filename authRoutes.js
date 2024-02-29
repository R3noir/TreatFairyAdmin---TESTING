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

router.post('/forgotpassword', async (req, res) => {
    const  email = req.body.email;
    if(!Validate.validateEmail(email)) {
        return res.status(400).json({ error: 'Invalid email'});
    }
    const response = await Auth.resetPassword(email);
    if(response.error) {
        return res.status(400).json({ error : response.error });
    }
    else{
        return res.status(200).json({ data: 'Successfully Sent' });
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

router.post('/setsession' , async (req, res) => {
    if(!req.body.accessToken) {
        return res.status(400).json({ error: 'insufficient data'});
    }
    if(!req.body.expiresIn){
        return res.status(400).json({ error: 'Insufficient data'});
    }
    if(!req.body.refreshToken){
        return res.status(400).json({ error: 'Insufficient data'});
    }
    if(!req.body.tokenType){
        return res.status(400).json({ error: 'Insufficient data'});
    }
    const response = await Auth.setsession(req.body.accessToken, req.body.expiresIn, req.body.refreshToken, req.body.tokenType);
    if(response.error) {
        return res.status(400).json({ error : response.error });
    }
    else{
        return res.status(200).json({ data: 'Session set' });
    }
});

module.exports = router;