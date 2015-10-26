app.service('articleService', ['$q', '$http', function($q, $http) {
	var _article = [];
 
    var _getArticle = function(url, callback, errCallback){
        $http.post("/parsePage", {url:url}, {timeout: 30000})
            .then(function(results){
                //Success
                if(callback) {
                    callback();
                }
                angular.copy(results.data, _article); //this is the preferred; instead of $scope.movies = result.data
            }, function(results){
                //Error
                if(errCallback) {
                    errCallback();
                }
            })
    }
	
	return{
        article: _article,
        getArticle: _getArticle
    };
}]);