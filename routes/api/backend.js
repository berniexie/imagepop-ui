var express = require('express');
router = express.Router();

router.get('/admin/status', function (req, res, next) {
    res.send([
        {
            "name": "apiVersion",
            "value": "1.0.0"
        },
        {
            "name": "uptime",
            "value": "13 hours"
        },
        {
            "name": "processId",
            "value": "4612"
        },
        {
            "name": "serverHostName",
            "value": "localhost"
        }
    ]);
})

module.exports = router;
