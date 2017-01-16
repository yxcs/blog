var express = require('express');
var db = require('../models/db.js');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/lists', function(req, res, next) {
  db.queryArticlesLists(function(data) {
  	res.send(data)
  })
});

module.exports = router;
