const express = require('express');
const router = express.Router();
const Auth = require('./private/Auth.js');
const Query = require('./private/Queries.js');
const Update = require('./private/Update.js');
const Formvalidation = require('./private/FormValidation.js');

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

router.post('/updateinventory', ensureAuthenticated ,async (req, res) => {
    try {
        for (let field in req.body) {
            const isValid = Formvalidation.validateUpdateInventory(field, req.body[field]);
            if (!isValid) {
                return res.status(400).json({ error: `Invalid ${field}` });
            }
        }
        if(req.body.retail_price){
            if(!(req.body.wholesale_price < req.body.retail_price)){
                return res.status(400).json({ error: 'Wholesale Price less than retail_price' });
            }
        }
        const userid = (await(Query.getID())).data[0].userid;
        req.body.last_update_by = userid;
        req.body.last_update_at = new Date().toLocaleString("en-US", {timeZone: "Asia/Manila"});
        const { data, error } = await Update.updateInventory(req.body, req.body.item_id)
        if (error) {
            console.log(error)
            return res.status(500).json({ error: error.message });
        }
        return res.status(200).json({ message: 'Item successfully updated!' });

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;