const express = require('express')
const router = express.Router()
const { singleCall } = require('../utils/singleCall');

router.post('/hello',  (req, res) => {
        let requestNumber = req.body.num;
        let response = `hello ${ requestNumber }`
        res.send(response)
});

router.post('/goodbye', (req, res) => {
    let requestNumber = req.body.num;
    let response = `goodbye ${ requestNumber }`;
    res.send(response)
})

router.post('/', async (req, res) => {
    let baseUrl = req.body.baseUrl;
    let responseParams = {
        query_speed: req.body.query_speed
    }
    try {
        if ( req.body.calls && req.body.calls instanceof Array ) {
            let calls = req.body.calls;
            let previousMaximum = 0;
            let randomNumber = Math.floor(Math.random() * 100)
            for (let i = 0; i < calls.length; i++) {
                let call = calls[i]
                let weight = call.weight ? call.weight : 100 / calls.length
                if (previousMaximum <= randomNumber && randomNumber < (previousMaximum + weight)) {
                    singleCall(call, baseUrl, responseParams)
                        .then(response => {
                            res.json(response)
                        })
                        .catch(err => {
                            res.json({ 'err': err })
                        })
                }
                previousMaximum += weight;
            }
        }
        else {
            res.json(`chain array must exist and must be an array of objects. currently => ${typeof req.body.chain}`)
        }        
    } catch (err) {
        res.json({'err': err})
    }
})

module.exports = router;