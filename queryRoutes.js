const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Queries = require('./private/Queries.js');
const Auth = require('./private/Auth.js');

router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

async function ensureAuthenticated(req, res, next) {
    const response = await Auth.checkAndRefreshSession(req, res);
    if (response.status != 200) {
        return res.redirect('/');
    }
    else {
        next();
    }
}

router.post('/fetchinventory', ensureAuthenticated , async (req, res) => {
    const start = parseInt(req.body.start);
    const length = parseInt(req.body.length);
    const archived = req.body.archived; 
    const search = req.body.search;
    await Queries.getInventory(start, length, archived, search)
    .then(async response => {
        if(response.error) {
            return res.status(500).json({ error : response.error  });
        }
        else{
            const totalRecordsResponse = await Queries.getTotalInventoryRecords(archived, search);
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
module.exports = router;