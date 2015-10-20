app.controller('JourneeController',['$scope', '$routeParams', '$filter', '$location', 'journeeService', 'paramsService', function($scope, $routeParams, $filter, $location, journeeService, paramsService) {
	$scope.idJournee = $routeParams.idJournee;
	$scope.equipe = $routeParams.equipe;
	$scope.journee = journeeService.journee;
	$scope.isLoading = true;
	$scope.selectedIndex = $routeParams.idJournee - 1;
	
	$scope.tabs = []
	
	for (var i = 1; i <= paramsService.params['SEASON_MATCHS_COUNT_' + $scope.equipe.toUpperCase()]; i++) {
		$scope.tabs.push({numero:i});
	}
		
	$scope.onTabSelected = function(tab) {
		$location.url('/journees/'+ $scope.equipe +'/' + tab.numero);
	};
		
	journeeService.getJournee($routeParams.equipe, $routeParams.idJournee, function() {
		$scope.isLoading = false;
	});
}]);