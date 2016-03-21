var express = require('express');
router = express.Router();

router.post('/', function (req, res, next) {
    if (req.body.email === '' || req.body.password === '')
        res.send({
            status: "error",
            message: "Email or password was left blank"
        });
    else
        res.send({
            status: "success",
            message: "An email has been sent to your account foo@example.com. Please follow the instructions in that email to complete your registration"
        });
})

module.exports = router;