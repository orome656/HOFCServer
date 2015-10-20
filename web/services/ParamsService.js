app.service('paramsService', ['$q', '$http', function($q, $http) {
	var _params = [];
 
    var _getParams = function(callback){
        $http.get("/params")
            .then(function(results){
                //Success
                angular.copy(results.data, _params); //this is the preferred; instead of $scope.movies = result.data
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
        params: _params,
        getParams: _getParams
    };
}]);