app.controller('DiaporamaController',['$scope', '$routeParams', 'diaporamaService', function($scope, $routeParams, diaporamaService) {
	$scope.diaporama = diaporamaService.diaporama;
	$scope.url = $routeParams.url;
	
	diaporamaService.getDiaporama($routeParams.url);
}]);