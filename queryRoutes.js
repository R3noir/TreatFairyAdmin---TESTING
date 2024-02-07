const express = require('express');
const router = express.Router();
const Queries = require('./private/Queries.js');
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

router.post('/fetchinventory', ensureAuthenticated , async (req, res) => {
    await Queries.getInventory()
    .then(response => {
        if(response.error) {
            return res.status(500).json({ error : response.error  });
        }
        else{
            return res.status(200).json({ data: response.data });
        }
    });

});

router.post('/getid', ensureAuthenticated , async (req, res) => {
    await Queries.getID()
    .then(response => {
        if(response.error) {
            return res.status(500).json({ error : response.error  });
        }
        else{
            return res.status(200).json({ data: response.data });
        }
    });

});


module.exports = router;