const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
// const MarkdownIt = require('markdown-it');
// const md = new MarkdownIt();

/* GET change log page. */
// swagger when ignore is equal to true, this api will not generate on the page
router.get('/', function(req, res, next) {
  // #swagger.ignore = true
	const changelogPath = path.join(__dirname, '../changelog.md');
	fs.readFileSync(changelogPath, 'utf-8', (err, result) => {
		res.send(result);
 });
});

module.exports = router;
