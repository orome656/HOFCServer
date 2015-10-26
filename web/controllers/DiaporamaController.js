app.controller('DiaporamaController',['$scope', '$routeParams', '$mdToast', 'diaporamaService', function($scope, $routeParams, $mdToast, diaporamaService) {
	$scope.diaporama = diaporamaService.diaporama;
	$scope.url = $routeParams.url;
	$scope.isLoading = true;
	
	diaporamaService.getDiaporama($routeParams.url, function() {
		$scope.isLoading = false;
	}, function() {
		$scope.isLoading = false;
		$mdToast.show(
			$mdToast.simple()
				.content('Erreur du téléchargement du contenu')
				.hideDelay(3000)
		);
	});
}]);