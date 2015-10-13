var app = angular.module('HOFCApp', ['ngMaterial', 'ngRoute', 'ngResource', 'md.data.table', 'ngAnimate']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/actualites.html',
        controller: 'ActusController'
      })
      .when('/classements/:categorie', {
        templateUrl: 'views/classement.html',
        controller: 'ClassementController'
      })
      .when('/calendriers/:categorie', {
        templateUrl: 'views/calendrier.html',
        controller: 'CalendrierController'
      })
      .when('/agendas/:semaine', {
        templateUrl: 'views/agenda.html',
        controller: 'AgendaController'
      })
}]);

app.controller('AppCtrl', ['$scope', '$mdSidenav', '$timeout','$log', '$filter', function($scope, $mdSidenav, $timeout, $log, $filter) {
  
  $scope.menu = [{
    titre: 'Actualites',
    lien: '#/'
  },{
    titre: 'Classements',
    lien: '#/classements/equipe1'
  },{
    titre: 'Calendriers',
    lien: '#/calendriers/equipe1'
  },{
    titre: 'Agenda',
    lien: '#/agendas/'+$filter('date')(new Date(), 'yyyy-MM-dd')
  }]
  $scope.selected = null;
  $scope.selectMenu = selectMenu;
  $scope.toggleSidenav = toggleSidenav;
  
  //*******************
  // Internal Methods
  //*******************
  
  function toggleSidenav(name) {
    $mdSidenav(name).toggle();
  }
  
  function selectMenu(muppet) {
    $scope.selected = angular.isNumber(muppet) ? $scope.muppets[muppet] : muppet;
    $scope.toggleSidenav('left');
  }
}])