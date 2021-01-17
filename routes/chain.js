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

router.post('/', async (req, res) => {

    if ( req.body.chain && typeof req.body.chain === 'object' ) {
        let responseData = []
        try {
            if (req.body.inSequence) {
                console.log('sequence engaged')
                let data = req.body.chain
                for (let i = 0; i < data.length; i++) {
                    let call = data[i]
                    await axios({
                        method: call.method,
                        data: call.data,
                        url: call.url
                    }).then(response => {
                        console.log(call)
                        let body = {
                            name: call.as ? call.as : i,
                            num: call.data.num,
                        }
                        responseData.push(body)
                    })
                }                
            } else {
                console.log('no sequence engaged')
                await Promise.all(req.body.chain.map( async (call) => {
                    await axios({
                        method: call.method,
                        data: call.data,
                        url: call.url
                    }).then(response => {
                        console.log(call)
                        let body = {
                            name: call.as ? call.as : call.method,
                            num: call.data.num,
                        }
                        responseData.push(body)
                    })
                }))                
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