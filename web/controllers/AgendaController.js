app.controller('AgendaController',['$scope', '$routeParams', 'agendaService', function($scope, $routeParams, agendaService) {
	$scope.semaine = $routeParams.semaine;
	$scope.agenda = agendaService.agenda;
	
	agendaService.getAgenda($routeParams.semaine);
}]);