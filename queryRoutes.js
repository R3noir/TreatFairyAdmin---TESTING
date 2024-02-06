const express = require('express');
const router = express.Router();
const Queries = require('./private/Queries.js');
const Auth = require('./private/Auth.js');

async function ensureAuthenticated(req, res, next) {
    const token = req.headers.authorization;
    const { user, error } = await Auth.ensureAuthenticated(token);
    if (error) {
        return res.status(401).json({ error });
    }
    req.user = user;
    next();
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