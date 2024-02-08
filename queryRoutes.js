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
            return res.status(400).json({ error : response.error  });
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

router.post('/getid', ensureAuthenticated , async (req, res) => {
    await Queries.getID()
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