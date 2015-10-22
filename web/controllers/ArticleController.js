app.controller('ArticleController',['$scope', '$routeParams', 'articleService', function($scope, $routeParams, articleService) {
	$scope.article = articleService.article;
	$scope.url = $routeParams.url;
	
	articleService.getArticle($routeParams.url);
}]);