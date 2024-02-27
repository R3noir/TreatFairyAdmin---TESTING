const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Queries = require('./private/Queries.js');
const Auth = require('./private/Auth.js');

router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

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
router.post('/fetchinventory', ensureAuthenticated , async (req, res) => {
    const start = parseInt(req.body.start);
    const length = parseInt(req.body.length);
    const archived = req.body.archived; 
    const search = req.body.search;
    const columns = ['item_id', 'item_name', 'earliest_expiry', 'quantity', 'wholesale_price', 'retail_price','last_update_at']; 
    const sortColumn = columns[req.body.sortColumn];
    const sortDirection = req.body.sortDirection;
    const Sort = sortColumn + '_' + sortDirection;

    if(search.length  > 75){
        return res.status(400).json({ error : 'Search is too long' });
    }

    await Queries.getInventory(start, length, archived, search, Sort)
    .then(async response => {
        if(response.error) {
            console.log(response.error)
            return res.status(500).json({ error : response.error  });
        }
        else{
            const totalRecordsResponse = await Queries.getTotalInventoryRecords(archived, search);
            if (totalRecordsResponse.error) {
                console.log(totalRecordsResponse.error)
                return res.status(500).json({ error : totalRecordsResponse.error  });
            }
            const totalRecords = totalRecordsResponse.data;
            return res.status(200).json({ 
                draw: req.body.draw,
                recordsTotal: totalRecords,
                recordsFiltered: totalRecords,
                data: response.data 
            });
        }
    });
});

router.post('/fetchinvoices', ensureAuthenticated , async (req, res) => {
    const start = parseInt(req.body.start);
    const length = parseInt(req.body.length);
    const search = req.body.search;
    const columns = ['invoice_id', 'sold_to', 'sold_date' ,'total', 'amount_paid']; 
    const sortColumn = columns[req.body.sortColumn];
    const sortDirection = req.body.sortDirection;
    const Sort = sortColumn + '_' + sortDirection;
    if(search.length  > 75){
        return res.status(400).json({ error : 'Search is too long' });
    }
    await Queries.getInvoice(start, length, search, Sort)
    .then(async response => {
        if(response.error) {
            return res.status(500).json({ error : response.error  });
        }
        else{
            const totalRecordsResponse = await Queries.getTotalInvoiceRecords(search);
            if (totalRecordsResponse.error) {
                return res.status(500).json({ error : totalRecordsResponse.error  });
            }
            const totalRecords = totalRecordsResponse.data;
            return res.status(200).json({ 
                draw: req.body.draw,
                recordsTotal: totalRecords,
                recordsFiltered: totalRecords,
                data: response.data 
            });
        }
    });
});

router.post('/fetchusers', ensureAuthenticated , async (req, res) => {
    const start = parseInt(req.body.start);
    const length = parseInt(req.body.length);
    const search = req.body.search;
    if(search.length  > 75){
        return res.status(400).json({ error : 'Search is too long' });
    }
    await Queries.getlistofAdmins(start, length, search)
    .then(async response => {
        if(response.error) {
            return res.status(500).json({ error : response.error  });
        }
        else{
            const totalRecordsResponse = await Queries.getTotalAdminRecords(search);
            if (totalRecordsResponse.error) {
                return res.status(500).json({ error : totalRecordsResponse.error  });
            }
            const totalRecords = totalRecordsResponse.data;
            return res.status(200).json({ 
                draw: req.body.draw,
                recordsTotal: totalRecords,
                recordsFiltered: totalRecords,
                data: response.data 
            });
        }
    });
})

router.post('/userinfo', ensureAuthenticated , async (req, res) => {
    await Queries.getuserinfo()
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