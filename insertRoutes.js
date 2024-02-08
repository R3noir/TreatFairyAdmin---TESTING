const express = require('express');
const router = express.Router();
const Insert = require('./private/Insert.js');
const Auth = require('./private/Auth.js');
const Query = require('./private/Queries.js');

async function ensureAuthenticated(req, res, next) {
    await Auth.isSessionExpired().then(response => {
        if (response.error) {
            return res.status(400).json({ error : response.error  });
        }
        else {
            next();
        }
    });
}

router.post('/inventory', ensureAuthenticated ,async (req, res) => {
    try {
        const userid = (await(Query.getID())).data[0].userid;
        const item = {
            itemname: req.body.productName,
            earliestexpiry: req.body.expirationDate,
            quantity: req.body.quantity,
            retailprice: req.body.retailPrice,
            wholesaleprice: req.body.retailPrice,
            created_by: userid,
            created_at: new Date().toLocaleString(),
            last_update_by: userid,
            last_update_at: new Date().toLocaleString(),
            archived: false,
            archived_at: null
        };
            const result = await Insert.insertInventory(item);
            if (result.error) {
                res.status(500).json({ message_error: result.error });
            } else {
                res.status(200).json({ message: 'Product added successfully' });
            }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
