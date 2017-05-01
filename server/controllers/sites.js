var mongoose = require('mongoose');
var Site = mongoose.model('Site');
var request = require('request');
var schedule = require('node-schedule');

console.log('Sites controller');

function SitesController () {

	var _this = this;

	//	app.get('/sites', sites.index);
	this.index = function(req, res) {
		Site.find({}, function(err, sites) {
			if (!err) {
				console.log('GET /')
				res.json(sites);
			} else {
				console.log('GET / error', err);
				res.json({
					status: false,
					message: 'Error getting sites'
				})
			}
		});
	};

	//	app.get('/site/show/:id', sites.show);
	this.show = function (req, res) {
		Site.find({'_id': req.params.id}, function(err, site) {
			if (!err) {
				res.json({
					status: true,
					site: site
				});
			} else {
				console.log('GET /site/show/', req.params.id, 'error', err);
			}
		});
	};

	//	app.post('/site/new', sites.create);
	this.create = function (req, res) {
		var site = new Site();
		site.name = req.body.name;
		site.link = req.body.link;
		site.health = "New";
		site.lastModified = new Date();

		site.save(function(err) {
			if (!err) {
				console.log('New site in DB. Name:',site.name,'Link:',site.link,'Health:',site.health);
				res.json({
					status: true
				});
			} else {
				console.log('Error saving site in DB', err);
				res.json({
					status: false,
					message: 'Error saving site in DB'
				});
			}
		});
	}

	//	app.post('/site/:id/update', sites.update);
	this.update = function (req, res) {
		console.log(req.body);
		console.log('Attempting to update site', req.body);
		Site.update({_id: req.body._id}, {
			name: req.body.name,
			link: req.body.link,
			health: req.body.health,
			lastModified: new Date()
		}, function(err) {
			if (!err) {
				res.json({
					status: true,
					message: "Updated site"
				});
			} else {
				res.json({
					status: false,
					message: "Error updating site"
				})
			}
		});
	}

	//	app.get('/site/delete/:id', sites.delete);
	this.delete = function (req, res) {
		console.log('Attempting to delete site', req.params.id);
		Site.remove({'_id': req.params.id}, function (err) {
			if (!err) {
				res.json({
					status: true
				})
			} else {
				res.json({
					status: false,
					message: "Error deleting site"
				})
			}
		});
	}

	this.siteCheck = function (address, callback) {

		// Error checking
		if (!address) return false;
		address += "/package.json";

		var siteHealth = "Bad";

		// We need to read the package.json
		// do a HTTP request on the url
		request(address, function(err, res, data) {

			console.log("Address:",address);
			
			if (err) {
				console.log("There was an error", err);
				return false;
			}

			// Look at response code (response.statusCode)
			if (res.statusCode != 200) {
				// If not 200 (404, 500, etc), bad
				// The site returned an error of some kind 
				// TODO: handle each error code separately
				siteHealth = "Bad";
			} else {
				// If 200, good
				siteHealth = "Good";
			}

			// Update site health
			callback(siteHealth);
		});
	}

	this.updateSites = function () {
		var sites = [];
		Site.find({}, function(err, data) {
			sites = data;
			for (var i = 0; i < sites.length; i++) {
				siteCheck(sites[i].url, function(data) {
					console.log(sites[0], ":", data);
				});
			}
		});
	}

	//	app.post('/site/check/:id', sites.checkSite);
	this.checkSite = function(req, res) {
		console.log('Checking site.', req.body);

		// 
		//      THOUGHT PROCESS: 
		// 			CALL THE SITECHECK() FUNCTION HERE FROM A GET REQUEST ON THE FRONT END, PER SITE.
		// 			LATER, AUTOMATE AND SCHEDULE THIS
		// 

		_this.siteCheck(req.body.link, function(health) {
			console.log('Site health:',health);
			Site.update({_id: req.params.id}, {
				name: req.body.name,
				link: req.body.link,
				health: health,
				lastModified: new Date()
			}, function (err) {
				if (!err) {
					res.json({
						status: true
					});
				} else {
					res.json({
						status: false
					});
				}
			}, {
				upsert: true
			});
		})
	}



}

module.exports = new SitesController();