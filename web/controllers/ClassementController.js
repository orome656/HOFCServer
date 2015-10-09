app.controller('ClassementController',['$scope', '$routeParams', 'classementService', function($scope, $routeParams, classementService) {
	$scope.ranking = classementService.classement;
	$scope.categorie = $routeParams.categorie;
	
	$scope.query = {
        filter: '',
        order: ['-points', '-diff']
    };
	
	$scope.onChange = function (order) {
		$scope.query.order = order
	};
	classementService.getClassement($scope.categorie);
	
}]);