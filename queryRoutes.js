const express = require('express');
const router = express.Router();
const Queries = require('./private/Queries.js');

router.post('/fetchinventory', async (req, res) => {
    Queries.getInventory()
    .then(response => {
        if(response.error) {
            return res.status(200).json({ error: response.error.message});
        }
        else{
            return res.status(200).json({ data: response.data });
        }
    });

});


module.exports = router;