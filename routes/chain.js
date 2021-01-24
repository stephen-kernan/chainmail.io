const express = require('express')
const router = express.Router()
const { synchronousChain } = require('../utils/synchronousChain');
const { asyncChain } = require('../utils/asyncChain');

router.post('/hello',  (req, res) => {
        let requestNumber = req.body.num;
        let response = `hello ${ requestNumber }`
        res.json({message: response})
});

router.post('/', async (req, res) => {
    if ( req.body.chain && req.body.chain instanceof Array ) {
        let responseData;
        let base_url = req.body.base_url;
        let responseParams = {
            query_body: req.body.query_body,
            query_speed: req.body.query_speed
        };
        try {
            if (!req.body.async) {
                await synchronousChain(req.body.chain, base_url, responseParams)
                    .then(response => {
                        responseData = response
                    })         
            } else {
                await asyncChain(req.body.chain, base_url, responseParams)
                    .then(response => {
                        responseData = response
                    })         
            }
            res.json(responseData)
        } catch (e) {
            res.json(e)
        }
    } else {
        res.json(`chain array must exist and must be an array of objects. currently => ${typeof req.body.chain}`)
    }
})

module.exports = router;