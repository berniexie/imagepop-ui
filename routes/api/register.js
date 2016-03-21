var express = require('express');
router = express.Router();

router.post('/', function (req, res, next) {
    if (req.body.email === undefined || req.body.password === undefined)
        res.send({success: false});
    else
        res.send({success: true});
})

module.exports = router;