app.controller('sitesController', ['$scope','siteFactory', '$routeParams', function($scope, siteFactory, $routeParams) {
    $scope.sites = [];
    siteFactory.index(function(returnedData){
        $scope.sites = returnedData;
    });
}]);