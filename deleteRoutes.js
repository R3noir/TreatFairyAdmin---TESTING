const express = require('express');
const router = express.Router();
const Delete = require('./private/Delete.js');
const Auth = require('./private/Auth.js');
const Formvalidation = require('./private/FormValidation.js');


async function ensureAuthenticated(req, res, next) {
    await Auth.isSessionExpired(req).then(response => {
        if (response.error) {
            return res.status(401).json({ error : response.error  });
        }
        else {
            next();
        }
    });
}

router.post('/deleteinvoice', ensureAuthenticated ,async (req, res) => {
    try {
        const validateform = Formvalidation.validateInvoiceID(req.body.invoice_id);
        if(validateform.error){
            return res.status(400).json({ message_error: validateform.error });
        }
        const result = await Delete.deleteInvoice(req.body.invoice_id);
        if (result.error) {
            res.status(500).json({ message_error: result.error });
        } else {
            res.status(200).json({ message: 'Invoice deleted successfully' });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
});

router.post('/deleteinvoiceitem', ensureAuthenticated ,async (req, res) => {
    try {
        console.log(req.body)
        const validateform = Formvalidation.validateInvoiceItemID(req.body.invoice_id, req.body.item_id);
        if(validateform.error){
            return res.status(400).json({ message_error: validateform.error });
        }
        const result = await Delete.deleteInvoiceItems(req.body.invoice_id, req.body.item_id);
        if (result.error) {
            res.status(500).json({ message_error: result.error });
        } else {
            res.status(200).json({ message: 'Invoice item deleted successfully' });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
