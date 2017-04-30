app.controller('newController', ['$scope','siteFactory', '$routeParams', '$location', function($scope, siteFactory, $routeParams, $location) {
    $scope.sites = [];
    var index = function(){
        siteFactory.index(function(returnedData){
            $scope.sites = returnedData;
        });
    };
    index();
    $scope.addSite = function () {
        siteFactory.addSite($scope.newSite, function (data) {
            $scope.sites = data;
        });
        $scope.newSite = {};
        $location.url('/');
    };
}]);