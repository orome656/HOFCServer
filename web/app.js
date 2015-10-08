var app = angular.module('HOFCApp', ['ngMaterial', 'ngRoute', 'md.data.table', 'ngAnimate']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/actualites.html',
        controller: 'ActusController'
      })
      .when('/classements', {
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

app.controller('AppCtrl', ['$scope', '$mdSidenav', '$timeout','$log', function($scope, $mdSidenav, $timeout, $log) {
  
  $scope.menu = [{
    titre: 'Actualites',
    lien: '#/'
  },{
    titre: 'Classement',
    lien: '#/classements'
  },{
    titre: 'Calendrier Equipe1',
    lien: '#/calendriers/equipe1'
  },{
    titre: 'Calendrier Equipe2',
    lien: '#/calendriers/equipe2'
  },{
    titre: 'Calendrier Equipe3',
    lien: '#/calendriers/equipe3'
  },{
    titre: 'Agenda',
    lien: '#/agendas'
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