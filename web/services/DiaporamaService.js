app.service('diaporamaService', ['$q', '$http', function($q, $http) {
	var _diaporama = [];
 
    var _getDiaporama = function(url){
        $http.post("/parsePage", {url:url})
            .then(function(results){
                //Success
                angular.copy(results.data, _diaporama); //this is the preferred; instead of $scope.movies = result.data
            }, function(results){
                //Error
            })
    }
	
	return{
        diaporama: _diaporama,
        getDiaporama: _getDiaporama
    };
}]);