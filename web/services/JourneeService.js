app.service('journeeService', ['$q', '$http', function($q, $http) {
	var _journee = [];
 
    var _getJournee = function(equipe, idJournee, callback){
        $http.get("/journee/"+equipe+"/"+idJournee)
            .then(function(results){
                //Success
                angular.copy(results.data, _journee); //this is the preferred; instead of $scope.movies = result.data
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
        journee: _journee,
        getJournee: _getJournee
    };
}]);