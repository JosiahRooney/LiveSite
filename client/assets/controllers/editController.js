app.controller('editController', ['$scope','siteFactory', '$routeParams', '$location', function($scope, siteFactory, $routeParams, $location) {
    $scope.site = {};
    siteFactory.showSite($routeParams.id, function(returnedData){
        console.log(returnedData.site[0]);
        $scope.site = returnedData.site[0];
    });
    $scope.updateSite = function () {
        siteFactory.updateSite($scope.site, function () {
            $location.url('/');
        });
    };
    $scope.deleteSite = function () {
        siteFactory.deleteSite($scope.site._id, function () {
            $location.url('/');
        });
    };
}]);