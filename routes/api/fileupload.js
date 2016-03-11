var express = require('express');
router = express.Router();

var fileId = 0; // This will have to come from a database eventually

router.post('/start', function(req, res, next) {
  res.send({fileId: fileId++});
});

router.post('/upload', function(req, res, next) {
  console.log(req);
  res.send({success: true});
});

module.exports = router;
