angular.module('diceApp').config(function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'app/dice/dice.view.html'
    })
    .otherwise({ redirectTo: '/'});
})
