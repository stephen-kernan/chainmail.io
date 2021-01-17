const express = require('express')
const router = express.Router()
const axios = require('axios');
const { response } = require('../app');
const { synchronousChain } = require('../utils/synchronousCalls');
const { asyncChain } = require('../utils/asyncCalls');

router.post('/hello',  (req, res) => {
        let requestNumber = req.body.num;
        let response = `hello ${ requestNumber }`
        console.log(response)
        res.send(response)
});

router.post('/', async (req, res) => {

    if ( req.body.chain && typeof req.body.chain === 'object' ) {
        let responseData = []
        let baseUrl = req.body.baseUrl
        try {
            if (req.body.inSequence) {
                await synchronousChain(req.body.chain, baseUrl)
                    .then(response => {
                        responseData = response
                    })         
            } else {
                await asyncChain(req.body.chain, baseUrl)
                    .then(response => {
                        responseData = response
                    })         
            }
            console.log('response => ', responseData)
            res.send(responseData)
        } catch (e) {
            res.send(e)
        }
    } else {
        res.send(`chain array must exist and must be an array. currently a ${typeof req.body.chain}`)
    }
})

module.exports = router;