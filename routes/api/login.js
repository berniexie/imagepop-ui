var express = require('express');
router = express.Router();

router.post('/', function(req, res, next) {
  // TODO(rwillard): Validate Login Credentials
  if (req.body.email === 'admin' && req.body.password === 'password') {
    res.send({success: true});
  } else {
    res.send({success: false});
  }
});

module.exports = router;