app.service('agendaService', ['$q', '$http', function($q, $http) {
	var _agenda = [];
 
    var _getAgenda = function(semaine, callback){
        $http.get("/agenda/"+semaine)
            .then(function(results){
                //Success
                angular.copy(results.data, _agenda); //this is the preferred; instead of $scope.movies = result.data
                if(callback) {
                    callback();
                }
            }, function(results){
                //Error
                if(callback) {
                    callback();
                }
            })
    }
	
	return{
        agenda: _agenda,
        getAgenda: _getAgenda
    };
}]);