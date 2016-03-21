var express = require('express');
router = express.Router();

router.post('/status', function (req, res, next) {
    console.log("hellooooo");
    if (req.body.email === undefined || req.body.password === undefined)
        res.send({success: false});
    else
        res.send({success: true});
})

module.exports = router;