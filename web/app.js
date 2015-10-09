var app = angular.module('HOFCApp', ['ngMaterial', 'ngRoute', 'md.data.table', 'ngAnimate']);

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
    titre: 'Classement Equipe 1',
    lien: '#/classements/equipe1'
  },{
    titre: 'Classement Equipe 2',
    lien: '#/classements/equipe2'
  },{
    titre: 'Classement Equipe 3',
    lien: '#/classements/equipe3'
  },{
    titre: 'Calendrier Equipe 1',
    lien: '#/calendriers/equipe1'
  },{
    titre: 'Calendrier Equipe 2',
    lien: '#/calendriers/equipe2'
  },{
    titre: 'Calendrier Equipe 3',
    lien: '#/calendriers/equipe3'
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