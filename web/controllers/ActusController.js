app.controller('ActusController',['$scope', 'actusService', function($scope, actusService) {
	$scope.actus = actusService.actus;
	
	actusService.getActus();
}]);