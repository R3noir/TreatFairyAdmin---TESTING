const express = require('express');
const router = express.Router();
const Insert = require('./private/Insert.js');
const Auth = require('./private/Auth.js');

async function ensureAuthenticated(req, res, next) {
    const { data, error } = await Auth.ensureAuthenticated();
    if (error || data == null) {
        res.redirect('/')
    }
    next();
}


router.post('/inventory', ensureAuthenticated, async (req, res) => {
    const response = await Insert.insertInventory(req.body);
    if(response.error) {
       return res.status(400).json({ error : response.error  });
    }
    else{
        return res.status(200).json({ data: response.data });
    }
});

module.exports = router;
