app.service('articleService', ['$q', '$http', function($q, $http) {
	var _article = [];
 
    var _getArticle = function(url){
        $http.post("/parsePage", {url:url})
            .then(function(results){
                //Success
                angular.copy(results.data, _article); //this is the preferred; instead of $scope.movies = result.data
            }, function(results){
                //Error
            })
    }
	
	return{
        article: _article,
        getArticle: _getArticle
    };
}]);