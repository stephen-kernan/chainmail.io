const express = require('express')
const router = express.Router()
const axios = require('axios');
const { response } = require('../app');
const { synchronousChain } = require('../utils/synchronousCalls');
const { asyncChain } = require('../utils/asyncCalls');
const { responseInterceptor, requestInterceptor } = require('../utils/returnCallSpeed')

requestInterceptor();
responseInterceptor();

router.post('/hello',  (req, res) => {
        let requestNumber = req.body.num;
        let response = `hello ${ requestNumber }`
        res.send(response)
});

router.post('/', async (req, res) => {
    if ( req.body.chain && typeof req.body.chain === 'object' ) {
        let numberOfCalls = req.body.numberOfCalls || 1;
        let responseData;
        let baseUrl = req.body.baseUrl;
        let responseParams = {
            query_body: req.body.query_body,
            query_speed: req.body.query_speed
        };
        try {
            if (!req.body.async) {
                await synchronousChain(req.body.chain, baseUrl, responseParams)
                    .then(response => {
                        responseData = response
                    })         
            } else {
                await asyncChain(req.body.chain, baseUrl, responseParams)
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