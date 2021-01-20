const express = require('express')
const router = express.Router()
const axios = require('axios');
const { response } = require('../app');
const { synchronousChain } = require('../utils/synchronousCalls');
const { asyncChain } = require('../utils/asyncCalls');

router.post('/hello',  (req, res) => {
    let requestNumber = req.body.num;
    let response = `hello ${ requestNumber }`
    res.send(response)
});

router.post('/', async (req, res) => {
    
})

module.exports = router;