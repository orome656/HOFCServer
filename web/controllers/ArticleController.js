app.controller('ArticleController',['$scope', '$routeParams', '$mdToast', 'articleService', function($scope, $routeParams, $mdToast, articleService) {
	$scope.article = articleService.article;
	$scope.url = $routeParams.url;
	$scope.isLoading = true;
	
	articleService.getArticle($routeParams.url, function() {
		$scope.isLoading = false;
	}, function() {
		$scope.isLoading = false;
		$mdToast.show(
			$mdToast.simple()
				.content('Erreur du téléchargement du contenu')
				.hideDelay(3000)
		);
	});
}]);