var express = require('express');
var db = require('../models/db.js');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/data/:id', function(req, res, next) {
  db.queryUserByNickname(req.params.id, function(data) {
    res.send(data)
  })
});

router.get('/articles/:id', function(req, res, next) {
  db.queryArticlesByRid(req.params.id, function(data) {
    res.send(data)
  })
});

module.exports = router;
