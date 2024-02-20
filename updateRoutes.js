const express = require('express');
const router = express.Router();
const Auth = require('./private/Auth.js');
const Query = require('./private/Queries.js');
const Update = require('./private/Update.js');
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

router.post('/updateinventory', ensureAuthenticated ,async (req, res) => {
    try {
        if(!Formvalidation.validateItemID(req.body.item_id)){
            return res.status(400).json({ error: 'Invalid item ID' });
        }
        if(req.body.retail_price | req.body.wholesale_price){
            if(Formvalidation.validatePrice(req.body.wholesale_price, req.body.retail_price)){
                return res.status(400).json({ error: 'Wholesale price cannot be greater than Retail Price' });
            }
        }
        for (let field in req.body) {
            const isValid = Formvalidation.validateUpdateInventory(field, req.body[field]);
            if (!isValid.result) {
                return res.status(400).json({ error: `Invalid ${isValid.field}` });
            }
        }
        const userid = await(Query.getID())
        const item_id = req.body.item_id;
        delete req.body.item_id;
        req.body.last_update_by = userid;
        req.body.last_update_at = new Date().toLocaleString("en-US", {timeZone: "Asia/Manila"});
        const { data, error } = await Update.updateInventory(req.body, item_id)
        if (error) {
            console.log(error)
            return res.status(500).json({ error: error.message });
        }
        return res.status(200).json({ message: 'Item successfully updated!' });

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error });
    }
});

router.post('/archive', ensureAuthenticated ,async (req, res) => {
    try{
        if(!Formvalidation.validateItemID(req.body.item_id)){
            return res.status(400).json({ error: 'Invalid item ID' });
        }

        req.body.archived_by = await(Query.getID())
        req.body.archived_at = new Date().toLocaleString("en-US", {timeZone: "Asia/Manila"});
        req.body.archived = true;
        const item_id = req.body.item_id;
        delete req.body.item_id;

        const { data, error } = await Update.updateInventory(req.body, item_id)
        if (error) {
            console.log(error)
            return res.status(500).json({ error: error.message });
        }
        return res.status(200).json({ message: 'Item successfully archived!' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message_error: error });
    }
});

router.post('/unarchive', ensureAuthenticated ,async (req, res) => {
    try{
        if(!Formvalidation.validateItemID(req.body.item_id)){
            return res.status(400).json({ error: 'Invalid item ID' });
        }
        req.body.archived_by = null
        req.body.archived_at = null
        req.body.archived = false;
        const item_id = req.body.item_id;
        delete req.body.item_id;
        
        const { data, error } = await Update.updateInventory(req.body, item_id)
        if (error) {
            console.log(error)
            return res.status(500).json({ error: error.message });
        }
        return res.status(200).json({ message: 'Item successfully unarchived!' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message_error: error });
    }
});


module.exports = router;