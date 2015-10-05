
app.service('classementService', ['$q', '$http', function($q, $http) {
	var _classement = [];
 
    var _getClassement = function(){
        $http.get("/classement")
            .then(function(results){
                //Success
                angular.copy(results.data, _classement); //this is the preferred; instead of $scope.movies = result.data
            }, function(results){
                //Error
            })
    }
	
	return{
        classement: _classement,
        getClassement: _getClassement
    };
}]);