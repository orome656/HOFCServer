
app.service('calendrierService', ['$q', '$http', function($q, $http) {
	var _calendrier = [];
 
    var _getCalendrier = function(categorie){
        $http.get("/calendrier/" + categorie)
            .then(function(results){
                //Success
                angular.copy(results.data, _calendrier); //this is the preferred; instead of $scope.movies = result.data
            }, function(results){
                //Error
            })
    }
	
	return{
        calendrier: _calendrier,
        getCalendrier: _getCalendrier
    };
}]);