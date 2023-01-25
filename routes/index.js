var express = require('express');
var router = express.Router();

/* GET home page. */
// swagger when ignore is equal to true, this api will not generate on the page
router.get('/', function(req, res, next) {
  // #swagger.ignore = true
  res.render('index', { title: 'Express' });
});

module.exports = router;
