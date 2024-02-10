const express = require('express');
const router = express.Router();
const Insert = require('./private/Insert.js');
const Auth = require('./private/Auth.js');
const Query = require('./private/Queries.js');
const Formvalidation = require('./private/FormValidation.js');

async function ensureAuthenticated(req, res, next) {
    await Auth.isSessionExpired().then(response => {
        if (response.error) {
            return res.status(401).json({ error : response.error  });
        }
        else {
            next();
        }
    });
}

router.post('/inventory', ensureAuthenticated ,async (req, res) => {
    try {
        const validateform = Formvalidation.validateNewProduct(req.body);
        if(validateform.error){
            return res.status(400).json({ message_error: validateform.error });
        }
        
        const userid = await(Query.getID())
        const item = {
            item_name: req.body.productName,
            earliest_expiry: req.body.expirationDate,
            quantity: req.body.quantity,
            retail_price: req.body.retailPrice,
            wholesale_price: req.body.wholesalePrice,
            created_by: userid,
            created_at: new Date().toLocaleString("en-US", {timeZone: "Asia/Manila"}),
            last_update_by: userid,
            last_update_at: new Date().toLocaleString("en-US", {timeZone: "Asia/Manila"}),
            archived: false,
            archived_at: null,
            archived_by: null
        };
            const result = await Insert.insertInventory(item);
            if (result.error) {
                res.status(500).json({ message_error: result.error });
            } else {
                res.status(200).json({ message: 'Product added successfully' });
            }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
