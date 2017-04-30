var mongoose = require('mongoose');
var Site = mongoose.model('Site');

console.log('Sites controller');

function SitesController () {

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
}

module.exports = new SitesController();