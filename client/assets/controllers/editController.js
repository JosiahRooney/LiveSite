app.controller('editController', ['$scope','siteFactory', '$routeParams', '$location', function($scope, siteFactory, $routeParams, $location) {
    $scope.site = {};
    siteFactory.show($routeParams.id, function(returnedData){
        $scope.site = returnedData;
    });
    $scope.updateSite = function () {
        siteFactory.updateSite($scope.site, function () {
            $location.url('/');
        });
    };
    $scope.deleteSite = function () {
        if (confirm("Are you sure you want to delete " + $scope.site.site[0].name + '?')) {
            siteFactory.deleteSite($scope.site.site[0]._id, function () {
                $location.url('/');
            });
        }
    };
}]);