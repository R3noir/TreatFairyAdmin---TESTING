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

router.post('/salesinvoice', ensureAuthenticated ,async (req, res) => {
    try {
        const validateform = Formvalidation.validateInvoice(req.body);
        if(validateform.error){
            return res.status(400).json({ message_error: validateform.error });
        }
        const userid = await(Query.getID())
        const invoice = {
            invoice_id: req.body.invoiceID,
            sold_to: req.body.soldTo,
            address: req.body.clientAddress,
            tin: req.body.clientTIN,
            date_sold: req.body.soldDate,
            amount_paid: req.body.amount_paid,
            issued_by: req.body.issuedBy,
            created_by: userid,
            date_created: new Date().toLocaleString("en-US", {timeZone: "Asia/Manila"}),
            last_update_by: userid,
            last_update_at: new Date().toLocaleString("en-US", {timeZone: "Asia/Manila"}),
            business_style: req.body.businessStyle,
        };
        const result = await Insert.insertSalesInvoice(invoice);
        if (result.error) {
            return res.status(500).json({ message_error: result.error });
        } else {
            req.body.items.forEach(item => {
                item.invoice_id = req.body.invoiceID; // Replace invoice_id with the actual value
            });
            const itemResults = await Promise.all(req.body.items.map(item => Insert.insertSalesInvoiceItems(item)));
            for (let itemResult of itemResults) {
                if (itemResult.error) {
                    return res.status(500).json({ message_error: itemResult.error });
                }
            }
            res.status(200).json({ message: 'Invoice added successfully' });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
});

router.post('/newuser', ensureAuthenticated ,async (req, res) => {
    try {
        if(!req.body.email){
            return res.status(400).json({ message_error: 'Invalid email' });
        }
        if(!req.body.password){
            return res.status(400).json({ message_error: 'Invalid password' });
        }
        if(!req.body.options.data.fname){
            return res.status(400).json({ message_error: 'Invalid first name' });
        }
        if(!req.body.options.data.lname){
            return res.status(400).json({ message_error: 'Invalid last name' });
        }
        const validateform = Formvalidation.validateNewUser(req.body);

        if(validateform.error){
            return res.status(400).json({ message_error: validateform.error });
        }

        const checkemail = (await (Query.checkIfAdminExists(req.body.email))).data

        if(checkemail){
            return res.status(400).json({ message_error: 'Email already exists' });
        }

        const result = await Insert.insertUser(req.body);
        if (result.error) {
            return res.status(500).json({ message_error: result.error });
        } else {
            res.status(200).json({ message: 'User added successfully' });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
