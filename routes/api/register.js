var express = require('express');
router = express.Router();

router.post('/', function (req, res, next) {
    if (req.body.email === '' || req.body.password === '')
        res.send({success: false});
    else
        res.send({success: true});
})

module.exports = router;