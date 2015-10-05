app.service('actusService', ['$q', '$http', function($q, $http) {
	var _actus = [];
 
    var _getActus = function(){
        $http.get("/actus")
            .then(function(results){
                //Success
                angular.copy(results.data, _actus); //this is the preferred; instead of $scope.movies = result.data
            }, function(results){
                //Error
            })
    }
	
	return{
        actus: _actus,
        getActus: _getActus
    };
}]);