var express = require('express');
var router = express.Router();
var google = require('google')
var dataUri = require('strong-data-uri');
var request = require('request');
var async = require('async');

var encoder = function(link, done) {
	console.log(link.link)
	request(link.link, function (error, response, html) {
	  if (!error && response.statusCode == 200) {
	  	console.log("Request Complete")
	  	return done(null, dataUri.encode(html, 'text/html'))
	  } return done(null)
	});
}

var loopAndRender = function(links, res) {
	async.mapSeries(links, encoder, function(err, results) {
		res.render("query", {results: results})
	})
}


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res) {
	query = req.body.query;
	google(query, function (err, next, links){
    if (err) console.error(err);
    loopAndRender(links, res)
  });
});

module.exports = router;
