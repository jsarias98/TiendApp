'use strict';

/**
 * @ngdoc function
 * @name tiendAppApp.controller:MarcasCtrl
 * @description
 * # MarcasCtrl
 * Controller of the tiendAppApp
 */
angular.module('tiendAppApp')
  .controller('MarcasCtrl', function ($scope,$state,$timeout,$firebaseArray) {
    $scope.panel_title_form = 'Registro de marcas';
    $scope.button_title_form = 'Registrar';
    $scope.marca={};
    function scroll(){
      $("html, body").animate({
          scrollTop: 0
      }, 1000);
    }
    $timeout(function () {
      $scope.pageAnimate='pageAnimate';
      $scope.panelAnimate='panelAnimate';
    },100);
    var ref = firebase.database().ref().child('marcas');
    $scope.marcas = $firebaseArray(ref);
    $scope.EnviarMarca = function () {
      
      if ($scope.panel_title_form == 'Registro de marcas'){
        $scope.marcas.$add({
          referencia: $scope.marca.referencia,
          nombre: $scope.marca.nombre
        });
        swal("Registrado", " ", "success");
      }else{
        $scope.marcas.$save($scope.marca);
        swal("Actualizado", " ", "success");
      }
      
      $scope.panel_title_form = 'Registro de marcas'
      $scope.button_title_form = 'Registrar';
      $scope.marca={};
      $scope.gridOptions.data = $scope.marcas;
    };
    var casillaDeBotones ='<div> <a type="button" class="waves-effect waves-light btn yellow accent-4" ng-click="grid.appScope.editar(row.entity)">Editar</a><a type="button" class="waves-effect waves-light btn red accent-4" ng-click="grid.appScope.borrar(row.entity)">Borrar</a></div>';
    $scope.gridOptions = {
      columnDefs: [
          {
              field: 'referencia',
              width:'33%',
              type: 'number',
              minWidth: 160
              
          },
          {
              field: 'nombre',
              width:'33%',
              minWidth: 160,
              enableSorting: true
          },
          {
              name: 'Opciones', enableFiltering: false, cellTemplate :casillaDeBotones,
              width:'33%',
              minWidth: 240
          }
      ]
  };
  $scope.gridOptions.data = $scope.marcas;
  $scope.borrar = function (m){
    swal({
      title: "Confirmar Eliminación",
      text: "¿Esta seguro de borrar la marca?",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#b71c1c",
      confirmButtonText: "Si, Borrar!",
      cancelButtonText: "No, Cancelar!",
      closeOnConfirm: true,
      showLoaderOnConfirm: true,
    },
    function(){
      $scope.marcas.$remove(m);
    });    
  }
  $scope.editar = function (m){
    scroll();
    $scope.panel_title_form = 'Actualizar marca';
    $scope.button_title_form = 'Actualizar'
    delete m.$$hashKey;
    $scope.marca = m;
  }
  $scope.cancelar = function (){
    $scope.panel_title_form = 'Registro de marcas';
    $scope.button_title_form = 'Registrar';
    $scope.marca = {};
    $scope.gridOptions.data =  $firebaseArray(ref);
  }
  scroll();
  });
