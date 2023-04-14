const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

/* GET change log page. */
// swagger when ignore is equal to true, this api will not generate on the page
router.get('/', function(req, res, next) {
  // #swagger.ignore = true
  const changelogPath = path.join(__dirname, '../changelog.md');
  const mdContent = fs.readFileSync(changelogPath, 'utf8');
  const htmlContent = marked(mdContent);
  
  res.render('index', { content: htmlContent });
});

module.exports = router;
