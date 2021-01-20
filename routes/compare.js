const express = require('express')
const router = express.Router()
const { synchronousChain } = require('../utils/synchronousCalls');

router.post('/hello',  (req, res) => {
        let requestNumber = req.body.num;
        let response = {
            message: `hello ${ requestNumber }`
        }
        res.send(response)
});

router.post('/', async (req, res) => {
    if ( req.body.chain && typeof req.body.chain === 'object' ) {
        let numberOfCalls = req.body.number_of_calls || 1;
        let responseData = {};
        let baseUrl = req.body.baseUrl;
        let responseParams = {
            query_body: req.body.query_body,
            query_speed: true
        };
        try {
            for (let i = 0; i < numberOfCalls; i++) {
                await synchronousChain(req.body.chain, baseUrl, responseParams)
                    .then(response => {
                        for (call in response) {
                            if (!responseData[call]) {
                                responseData[call] = {
                                    responseTimes: []
                                }
                            }
                            responseData[call].responseTimes.push(response[call].speed)
                        }
                    })
                    .catch( err => {
                        res.status(401).send(err.message)
                    })                 
            }

            for (query in responseData) {
                let average = 0;
                responseData[query].responseTimes.map( time => {
                    average += time
                })
                average = average / responseData[query].responseTimes.length
                responseData[query].average = average;
            }

            res.json(responseData)
        } catch (e) {
            res.status(401).send(err.message)
        }
    } else {
        res.json(`chain array must exist and must be an array of objects. currently => ${typeof req.body.chain}`)
    }
})

module.exports = router;