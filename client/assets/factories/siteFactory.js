app.factory("siteFactory", ['$http', function($http) {
	var sites = [];
    var site = [];
	
    function SitesFactory() {
        var _this = this;

        // app.get('/', sites.index);
        this.index = function(callback) {
            $http.get('/sites').then(function(data) {
                sites = data.data;
                callback(sites);
            });
        }

        // app.post('/site/new', sites.create);
        this.addSite = function(newSite, callback) {
            $http.post('/site/new', newSite).then(function(data) {
                callback(data.data);
            });
        }

        // app.get('/site/show/:id', sites.show);
        this.showSite = function(id, callback) {
            $http.get('/site/show/'+id).then(function(data) {
                callback(data.data);
            });
        }

        // app.post('/site/:id/update', sites.update);
        this.updateSite = function(site, callback){
            $http.post('/site/'+site._id+'/update/', site).then(function (returned_data) {
                sites = returned_data.data;
                callback(returned_data.data);
            });
        };

        // app.get('/site/delete/:id', sites.delete);
        this.deleteSite = function(id, callback) {
            $http.post('/site/delete/'+id).then(function(returned_data) {
                callback(returned_data);
            });
        }

        this.getSites = function(callback){
            callback(sites);
        };

        this.getSite = function(callback){
            callback(site);
        };

    }
    return new SitesFactory();
}]);