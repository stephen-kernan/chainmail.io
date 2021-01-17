const express = require('express')
const router = express.Router()

router.get('/hello', () => {
    return 'hello'
});

module.exports = router;