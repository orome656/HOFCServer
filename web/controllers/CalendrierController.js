app.controller('CalendrierController',['$scope', '$routeParams', 'calendrierService', function($scope, $routeParams, calendrierService) {
	$scope.categorie = $routeParams.categorie;
	$scope.calendrier = calendrierService.calendrier;
	
	calendrierService.getCalendrier($scope.categorie);
}]);