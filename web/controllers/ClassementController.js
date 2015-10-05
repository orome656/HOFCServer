app.controller('ClassementController',['$scope', 'classementService', function($scope, classementService) {
	$scope.ranking = classementService.classement;
	
	classementService.getClassement();
	
}]);