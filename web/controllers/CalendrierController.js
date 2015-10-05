app.controller('CalendrierController',['$scope', 'calendrierService', function($scope, calendrierService) {
	$scope.calendrier = calendrierService.calendrier;
	
	calendrierService.getCalendrier();
}]);