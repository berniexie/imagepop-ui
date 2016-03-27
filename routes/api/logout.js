var express = require('express');
router = express.Router();

router.post('/', function (req, res, next) {
    //if request to logout was successful
    res.send({
        status: "logged-out",
        message: "Successfully logged out"
    });
    
    //if request to logout failed
    /*
    res.send({
        status: "error",
        message: "Logout failed"
    })*/
})

module.exports = router;