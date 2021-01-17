const express = require('express')
const router = express.Router()
const axios = require('axios');
const { response } = require('../app');

router.post('/hello',  (req, res) => {
        let requestNumber = req.body.num;
        let response = `hello ${ requestNumber }`
        console.log(response)
        res.send(response)
});

router.post('/chain', async (req, res) => {
    const responseData = []

    try {
        if (req.body.chain && typeof req.body.chain === 'object') {
            req.body.chain.map( call => {
                axios({
                    method: call.method,
                    data: call.data,
                    url: call.url
                }).then(response => {
                    responseData.push(response.data)
                })
            })
            res.send(responseData)
         } else {
            res.send(`chain array must exist and must be an array. currently a ${typeof req.body.chain}`)
         }
    } catch (e) {
        res.send(e)
    }
})

module.exports = router;