'use strict';

/**
 * @ngdoc overview
 * @name tiendAppApp
 * @description
 * # tiendAppApp
 *
 * Main module of the application.
 */
angular
  .module('tiendAppApp', [
    'ui.router',
    'ui.materialize',
    'firebase',
    'ui.grid',
    'ui.grid.autoResize',
    'ui.grid.resizeColumns',
    'ui.grid.moveColumns',
    'ui.grid.pagination', 
    'ui.grid.cellNav',
  ])
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/Dashboard/Marcas');
    $stateProvider
    .state('Dashboard', {
      url: '/Dashboard',
      templateUrl: 'views/layout/dashboard.html',
      controller: 'DashboardCtrl'
  })
    .state('Marcas', {
      url:'/Marcas',
      parent: 'Dashboard',
      templateUrl: 'views/marcas.html',
      controller: 'MarcasCtrl',
    })
    .state('Productos', {
      url:'/Productos',
      parent: 'Dashboard',
      templateUrl: 'views/productos.html',
      controller: 'ProductosCtrl',
    })
  });
