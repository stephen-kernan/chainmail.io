const express = require('express')
const router = express.Router()
const { synchronousChain } = require('../utils/synchronousChain');
const { asyncChain } = require('../utils/asyncChain');

router.post('/hello',  (req, res) => {
    let requestNumber = req.body.num;
    let response = `hello ${ requestNumber }`
    res.json({message: response})
});

router.post('/goodbye',  (req, res) => {
    let requestNumber = req.body.num;
    let response = `hello ${ requestNumber }`
    res.json({message: response})
});

router.post('/slow_query', (req, res) => {
    let user = req.body.user;
    let uselessArray = []
    for (char in user) {
        for (char in user) {
            uselessArray.push(char)
        }
    }
    for (let i = 0; i < uselessArray.length; i++){
        for (let j = 0; j < uselessArray.length; j++){
            let uselessAddition = 1 + j
        }
    }
    if (user === 'nicolas cage') {
        for (let i = 0; i < uselessArray.length; i++) {
            uselessArray.pop()
        } 
        res.json({movie: 'National Treasure'})
    } else {
        for (let i = 0; i < uselessArray.length; i++) {
            uselessArray.pop()
        } 
        res.json({movie: 'Nothing as iconic as National Treasure'})
    }})

router.post('/fast_query', (req, res) => {
    let user = req.body.user;
    if (user === 'nicolas cage') {
        res.json({movie: 'National Treasure'})
    } else {
        res.json({movie: 'Nothing as iconic as National Treasure'})
    }
})

router.post('/login', (req, res) => {
    let user = req.body.user
    if (user === 'edwardandbella4evr@gmail.com') {
        res.json({
            user: user,
            token: 'securetoken',
            address: 'somewhere cloudy'
        })
    } else {
        res.json({user: user})
    }
})

router.post('/logout', (req, res) => {
    let user = req.body.name
    res.send(`Thanks for stopping by, ${user}!`)
})

router.post('/purchase', (req, res) => {
    let purchase_history = ['blackout curtains']
    if (req.body.token === 'securetoken') {
        purchase_history.push(req.body.new_item)
        res.json({purchase_history: purchase_history})        
    } else {
        res.send('not authorized')
    }
})

router.post('/confirmation', (req, res) => {
    let purchase_history = req.body.purchase_history
    res.send(`Thank you for your purchase of ${purchase_history[1]}! This will promptly be sent somewhere cloudy!`)
})

module.exports = router;