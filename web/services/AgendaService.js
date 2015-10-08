app.service('agendaService', ['$q', '$http', function($q, $http) {
	var _agenda = [];
 
    var _getAgenda = function(semaine){
        $http.get("/agenda/"+semaine)
            .then(function(results){
                //Success
                angular.copy(results.data, _agenda); //this is the preferred; instead of $scope.movies = result.data
            }, function(results){
                //Error
            })
    }
	
	return{
        agenda: _agenda,
        getAgenda: _getAgenda
    };
}]);