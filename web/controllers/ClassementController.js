app.controller('ClassementController',['$scope', 'classementService', function($scope, classementService) {
	$scope.ranking = classementService.classement;
	$scope.query = {
        filter: '',
        order: ['-points', '-diff']
    };
	
	$scope.onChange = function (order) {
		$scope.query.order = order
	};
	classementService.getClassement();
	
}]);