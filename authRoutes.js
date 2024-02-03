const express = require('express');
const router = express.Router();
const Auth = require('./private/Auth.js');
const Validate = require('./private/FormValidation.js');

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if(!Validate.validateEmail(email)) {
        return res.status(200).json({ error: 'Invalid email'});
    }
    Auth.signInWithPassword({ email, password })
        .then(response => {
            if(response.error) {
                return res.status(200).json({ error: response.error.message});
            }
            else{
                return res.status(200).json({ status: response.data });
            }
        });
});
module.exports = router;