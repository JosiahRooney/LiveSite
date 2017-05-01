var app = angular.module('sitesApp', ['ngRoute']);

app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
    // app.get('/');
    .when('/', {
        templateUrl: 'partials/view_sites.html',
        controller: 'sitesController'
    })
    // app.get('/sites/new', sites.create);
    .when('/site/new', {
        templateUrl: 'partials/add_site.html',
        controller: 'newController'
    })
    // app.get('/site/:id/edit', sites.update);
    .when('/site/:id/edit', {
        templateUrl: 'partials/edit_site.html',
        controller: 'editController'
    })
    // app.get('/site/delete/:id', sites.delete);
    .when('/site/delete/:id', {
        templateUrl: 'partials/delete_site.html',
        controller: 'editController'
    })
    // app.get('/site/check/:id', sites.checkSite);
    .when('/site/check/:id', {
        templateUrl: 'partials/check_site.html',
        controller: 'editController'
    })
    .otherwise({
        redirectTo: '/'
    });

    $locationProvider.html5Mode(true);

});