var sites = require('../controllers/sites.js');

console.log("Routes loaded.");

module.exports = function(app){
    app.get('/sites', sites.index);
    app.get('/site/show/:id', sites.show);
    app.post('/site/new', sites.create);
    app.post('/site/:id/update', sites.update);
    app.post('/site/delete/:id', sites.delete);
    app.post('/site/check/:id', sites.checkSite);
};
