'use strict';

/**
 * @ngdoc function
 * @name tiendAppApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the tiendAppApp
 */
angular.module('tiendAppApp')
  .controller('DashboardCtrl', function ($scope,$state) {
    $scope.$state=$state;
    $(document).ready(function(){
      $(".button-collapse").sideNav({
        closeOnClick: true
      });
    })
  });
