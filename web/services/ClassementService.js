
app.service('classementService', ['$q', '$http', function($q, $http) {
	var _classement = [];
    
    var _getClassement = function(categorie){
        $http.get("/classement/" + categorie)
            .then(function(results){
                //Success
                var datas = [];
                for(var i in results.data) {
                    for(var j in results.data[i]) {
                        if(!isNaN(results.data[i][j])) {
                            results.data[i][j] = parseInt(results.data[i][j]);
                        }
                    }
                }
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