var express = require('express');
router = express.Router();

router.post('/', function (req, res, next) {
    //if request to logout was successful
    //using dummy condition for now until backend is connected
    if (true){
        res.status(202);
        res.send({
            status: "logged-out",
            message: "Successfully logged out"
        });
    }
    else {
        //if request to logout failed
        res.status(400);
        res.send({
            status: "error",
            message: "Logout failed"
        })
    }
})

module.exports = router;