var mongoose = require('mongoose');
var Site = mongoose.model('Site');
var request = require('request');
var schedule = require('node-schedule');
var async = require('async');

console.log('[app] [controller] sites');

function SitesController () {

	var _this = this;

	//	app.get('/sites', sites.index);
	this.index = function(req, res) {
		Site.find({}, function(err, sites) {
			if (!err) {
				// console.log('GET /')
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
				console.log('GET /site/show/'+req.params.id);
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
			package: false,
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






	function fetch (address, callback) {
		// This function does the HTTP request
		request(address, function(err, response, body) {
			if ( err ) {
				callback(err);
			} else {
				callback(null, response, body);
			}
		});
	}

	this.siteCheck = function (address, callback) {
		// This function checks the site's 3 urls (domain.com, domain.com/package.json, domain.com/robots.txt)

		console.log('SiteCheck function: ', address);

		// Error checking
		if (!address) return false;

		var siteHealth = {
			package: false,
			robots: false,
			health: "Bad"
		};

		var siteArr = [
			address,
			address + "/package.json",
			address + "/robots.txt"
		];

		console.log('SiteCheck function: ', siteArr);

		async.map(siteArr, fetch, function(err, response, body) {
			// response[0]: domain.com
			// response[1]: domain.com/package.json
			// response[2]: domain.com/robots.txt

			if (err) {
				
				console.log('There was an error',err);
				callback(siteHealth);

			} else {
				
				if (response[0].statusCode === 200) {
					// Site returns a 200
					siteHealth.health = "Excellent";
				}

				if ( response[1].statusCode === 200 ) {
					// Site's package.json returns a 200
					siteHealth.package = true;
				
				} else {
					// Site's package.json returns a 404/503
					siteHealth.health = "Fair";
				}

				if ( response[2].statusCode === 200 ) {
					// Site's robots.txt returns a 200
					siteHealth.robots = true;

				} else {
					// Site's robots.txt returns a 404/503
					siteHealth.health = "Fair";
				}

				callback(siteHealth);
			
			}

		});

	}


	//	app.post('/site/check/:id', sites.checkSite);
	this.checkSite = function(req, res) {
		console.log('CheckSite function: ', req.body.link);
		var link = req.body.link;

		// If the URL ends in /, remove it here
		if ( link[link.length-1] == "/" ) {
			link = link.substring(0, link.length-1);
		}

		_this.siteCheck(link, function(siteHealth) {
			console.log('Site health:',siteHealth.health);
			Site.update({_id: req.params.id}, {
				name: req.body.name,
				link: req.body.link,
				health: siteHealth.health,
				package: siteHealth.package,
				robots: siteHealth.robots,
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
		});
	}

	this.updateSites = function () {
		// Get all sites
		console.log('Running automated site checker function');
		Site.find({}, function(err, data) {
			// Run checkSite() on each of them
			data.forEach((site) => {
				_this.siteCheck(site.link, function(siteHealth) {
					Site.update({_id: site._id}, {
						name: site.name,
						link: site.link,
						health: siteHealth.health,
						package: siteHealth.package,
						robots: siteHealth.robots,
						lastModified: new Date()
					}, function (err) {
						if (err) {
							console.log('There was an error with', site.name)
						} else {
							console.log('There was no error with', site.name);
						}
					}, {
						upsert: true
					});
				});

			});
		});
	}

	var freq = {
		min: "53",
		hour: "*",
		day: "*",
		month: "*",
		weekday: "*"
	}
	var frequencyString = freq.min + " " + freq.hour + " " + freq.day + " " + freq.month + " " + freq.weekday;
	var job = schedule.scheduleJob(frequencyString, function() {
		console.log('This runs every hour at *:',freq.min);
		_this.updateSites();
	});

}




module.exports = new SitesController();