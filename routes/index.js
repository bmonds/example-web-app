var express = require('express');
var order = require('../services/burrito-order');
var router = express.Router();

var titlePrefix = 'Burrito Time';
var tax = 0.08375;
var costPer = 6.04;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: titlePrefix });
});

router.get('/time', function(req, res, next) {
  res.render('isittime', { title: titlePrefix + ': Is it time?' });
});

router.get('/order', function(req, res, next) {
  res.render('order', { title: titlePrefix + ': Order' });
});

router.get('/total', function(req, res, next) {
  var qty = req.query.qty;
  var total = order.getCost(costPer, tax, qty);
  res.render('total', { title: titlePrefix + ': Total Cost', total: total });
});

module.exports = router;
