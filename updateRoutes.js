const express = require('express');
const router = express.Router();
const Auth = require('./private/Auth.js');
const Query = require('./private/Queries.js');
const Update = require('./private/Update.js');
const Delete = require('./private/Delete.js');
const Formvalidation = require('./private/FormValidation.js');
const Insert = require('./private/Insert.js');

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

router.post('/updateinvoice', ensureAuthenticated ,async (req, res) => {
    let total = 0
    console.log(req.body)
    try {
        if (Object.keys(req.body.updatedData).length === 0 && 
            req.body.Delete.length === 0 && 
            req.body.updatedItems.length === 0 && 
            req.body.newItems.length === 0) {
            return res.status(200).json({ message: 'No changes detected' });
        }
        if(await Query.InvoiceIDExists(req.body.old_invoice_id)){
            return res.status(400).json({ message_error: 'Invoice ID already exists' });
        }
        if(req.body.Delete.length > 0){
            let id = [];
            for(let i = 0; i < req.body.Delete.length; i++){
                id.push(req.body.Delete[i].id);
            }
            const totaldelete = await Query.getInvoiceItemsTotalBeforeDeletion(req.body.old_invoice_id, id);
            if(totaldelete.error){
                return res.status(400).json({ message_error: total.error });
            }
            total += totaldelete.data[0].total
        }
        if(total === 0){
            const totalinvoice = await Query.getInvoiceItemsTotalBeforeDeletion(req.body.old_invoice_id ,[]);
            if(totalinvoice.error){
                return res.status(400).json({ message_error: total.error });
            }
            total = totalinvoice.data[0].total
        }
        if(req.body.updatedItems.length > 0){
            for(let i = 0; i < req.body.updatedItems.length; i++){
                if(parseInt(req.body.updatedItems[i].quantity)){
                    if(parseInt(req.body.updatedItems[i].quantity) < 1)
                    {
                        return res.status(400).json({ message_error: 'Invalid quantity' });
                    }
                    if(parseFloat(req.body.updatedItems[i].price) < 1)
                    {
                        return res.status(400).json({ message_error: 'Invalid price' });
                    }
                    let OldProductTotal = (await Query.getInvoiceItemTotal(req.body.old_invoice_id, req.body.updatedItems[i].id)).data;
                    let NewProductTotal = req.body.updatedItems[i].price * req.body.updatedItems[i].quantity;
                    total = total - OldProductTotal + NewProductTotal;
                }
            }
        }
        if(req.body.newItems.length > 0){ 
            for(let i = 0; i < req.body.newItems.length; i++){
                if(req.body.newItems[i].quantity){
                    if(!Formvalidation.validateProdctName(req.body.newItems[i].item)){
                        return res.status(400).json({ message_error: 'Invalid item name' });
                    }
                    if(req.body.newItems[i].quantity < 1)
                    {
                        return res.status(400).json({ message_error: 'Invalid quantity' });
                    }
                    if(req.body.newItems[i].price < 1)
                    {
                        return res.status(400).json({ message_error: 'Invalid price' });
                    }
                    total += req.body.newItems[i].price * req.body.newItems[i].quantity;
                }
            }
        }
        if(req.body.updatedData.amount_paid > total || req.body.updatedData.amount_paid <= 0){
            return res.status(400).json({ message_error: 'Invalid Amount Paid' });
        }
        
        for (let field in req.body.updatedData) {
            const isValid = Formvalidation.validateUpdateInvoice(field, req.body.updatedData[field]);
            if (!isValid.result) {
                return res.status(400).json({ message_error: `Invalid ${isValid.field}` });
            }
        }
        for (let i = 0; i < req.body.Delete.length; i++) {
            const { data, error } = await Delete.deleteInvoiceItems(req.body.old_invoice_id, req.body.Delete[i].id);
            if (error) {
                return res.status(500).json({ message_error: error });
            }
        }

        if(Object.keys(req.body.updatedData).length > 0){
            let updatedData = {};
            if (req.body.updatedData.name) updatedData.sold_to = req.body.updatedData.name;
            if (req.body.updatedData.sold_date) updatedData.date_sold = req.body.updatedData.sold_date;
            if (req.body.updatedData.business_style) updatedData.business_style = req.body.updatedData.business_style;
            if (req.body.updatedData.amount_paid) updatedData.amount_paid = req.body.updatedData.amount_paid;
            if (req.body.updatedData.tin) updatedData.tin = req.body.updatedData.tin;
            if (req.body.updatedData.issued_by) updatedData.issued_by = req.body.updatedData.issued_by;
            if (req.body.updatedData.address) updatedData.address = req.body.updatedData.address;

            if(req.body.updatedData.old_invoice_id){
                updatedData.invoice_id = req.body.updatedData.invoice_id;
                const {data, error} = await Update.updateSalesInvoice(updatedData, req.body.updatedData.old_invoice_id);
                if (error) {
                    return res.status(500).json({ message_error: error });
                }
            }
            else{
                const {data, error} = await Update.updateSalesInvoice(updatedData, req.body.old_invoice_id);
                if (error) {
                    return res.status(500).json({ message_error: error.message });
                }
            }
        }
        if(req.body.updatedItems.length > 0){
            let updatedItems = {};

            console.log(req.body.updatedItems.length)
            for(let i = 0; i < req.body.updatedItems.length; i++){
                console.log(req.body.updatedItems[i])
                if(req.body.updatedItems[i].item) updatedItems.invoice_item_name = req.body.updatedItems[i].item;
                if(req.body.updatedItems[i].quantity) updatedItems.invoice_item_quantity = req.body.updatedItems[i].quantity;
                if(req.body.updatedItems[i].price) updatedItems.invoice_item_price = req.body.updatedItems[i].price;

                console.log(updatedItems)
                const {data, error} = await Update.updateSalesInvoiceItems(updatedItems, req.body.updatedItems[i].invoice_id, req.body.updatedItems[i].id);
                if (error) {
                    return res.status(500).json({ message_error: error });
                }
            }
        }
        if(req.body.newItems.length > 0){
            let newItems = {};
            for(let i = 0; i < req.body.newItems.length; i++){
                newItems.invoice_id = req.body.updatedData.invoice_id;
                newItems.invoice_item_name = req.body.newItems[i].item;
                newItems.invoice_item_quantity = req.body.newItems[i].quantity;
                newItems.invoice_item_price = req.body.newItems[i].price;
                const {data, error} = await Insert.insertSalesInvoiceItems(newItems);
                if (error) {
                    return res.status(500).json({ message_error: error });
                }
            }
        }
        let updatedData = {};
        updatedData.last_update_by = await Query.getID();
        updatedData.last_update_at = new Date().toLocaleString("en-US", {timeZone: "Asia/Manila"});
        if(req.body.updatedData.old_invoice_id){
            const {data, error} = await Update.updateSalesInvoice(updatedData, req.body.updatedData.invoice_id);
            if (error) {
                return res.status(500).json({ message_error: error });
            }
        }
        else{
            const {data, error} = await Update.updateSalesInvoice(updatedData, req.body.old_invoice_id);
            if (error) {
                return res.status(500).json({ message_error: error });
            }
        }
        return res.status(200).json({ message: 'Invoice successfully updated!' });
        
    } catch (error) {
        console.log(error)
        res.status(500).json({ message_error: error });
    }
});

router.post('/changeemail', ensureAuthenticated ,async (req, res) => {
    try {
        if(!Formvalidation.validateEmail(req.body.newEmail)){
            return res.status(400).json({ error: 'Invalid email' });
        }
        if(req.body.newEmail !== req.body.confirmNewEmail){
            return res.status(400).json({ error: 'Emails do not match' });
        }
        const { data, error } = await Update.updateuseremail(req.body.newEmail);
        console.log(data, error)
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(200).json({ message: 'Email change request has been sent to your email' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error });
    }
});

module.exports = router;