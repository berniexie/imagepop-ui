var express = require('express');
router = express.Router();

router.post('/', function(req, res, next) {
  // TODO(rwillard): Validate Login Credentials
  if (req.body.email === 'admin' && req.body.password === 'password') {
    res.send({
    	token: "MiOiJqb3VybmFsdGVjaCIsImF1ZCI6ImpvdXJuYW"
    });
  } else {
    res.send({
    	status: "error",
    	message: "Bad credentials"

    });
  }
});

module.exports = router;