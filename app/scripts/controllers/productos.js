'use strict';

/**
 * @ngdoc function
 * @name tiendAppApp.controller:ProductosCtrl
 * @description
 * # ProductosCtrl
 * Controller of the tiendAppApp
 */
angular.module('tiendAppApp')
  .controller('ProductosCtrl', function ($scope,$state,$timeout,$firebaseArray) {
    $scope.panel_title_form ="Registro de Productos";
    $scope.button_title_form = "Registrar";
    function scroll(){
      $("html, body").animate({
          scrollTop: 0
      }, 1000);
    }
    $scope.producto={};
    var refmarcas = firebase.database().ref().child('marcas');
    $scope.marcas = $firebaseArray(refmarcas);
    var ref = firebase.database().ref().child('productos');
    $scope.productos = $firebaseArray(ref);
    $timeout(function () {
      $scope.pageAnimate='pageAnimate';
      $scope.panelAnimate='panelAnimate';
    },100);
    $scope.producto= {};
    $scope.tallas =[{id: 's',nombre: 's'},{id: 'm',nombre: 'm'},{id: 'l',nombre:'l'}];
    var casillaDeBotones ='<div> <a type="button" class="waves-effect waves-light btn yellow accent-4" ng-click="grid.appScope.editar(row.entity)">Editar</a><a type="button" class="waves-effect waves-light btn red accent-4" ng-click="grid.appScope.borrar(row.entity)">Borrar</a></div>';
    $scope.gridOptions = {
      columnDefs: [
          {
              field: 'nombre',
              width:'15%',
              minWidth: 160
              
          },
          {
              field: 'talla',
              width:'4%',
              minWidth: 60,
              enableSorting: true
          },
          {
            field: 'marca',
            width:'14%',
            cellTemplate: '<div>{{grid.appScope.obtenerMarca(row.entity.marca)}}</div>',
            minWidth: 80
          },
          {
            field: 'cantidad',
            width:'10%',
            type: 'number',
            minWidth: 160
          },
          {
            field: 'fechaEmbarque',
            displayName:'Fecha de embarque',
            width:'17%',
            minWidth: 150
          },
          {
            field: 'observaciones',
            width:'20%',
            minWidth: 160
          },

          {
              name: 'Opciones', enableFiltering: false, cellTemplate :casillaDeBotones,
              width:'29%',
              minWidth: 240
          }
      ]
    };
    var marca;
    $scope.obtenerMarca = function (mar){
    $scope.marcas.forEach(function(element) {
       if (element.$id == mar){
         marca = element.nombre;
       }
     });
     return marca;
    }
    $scope.gridOptions.data = $scope.productos;
    $scope.EnviarProducto = function () {
      if ($scope.panel_title_form == 'Registro de Productos'){
        $scope.productos.$add({
          nombre: $scope.producto.nombre,
          talla: $scope.producto.talla,
          marca: $scope.producto.marca,
          cantidad: $scope.producto.cantidad,
          fechaEmbarque: fecha($scope.producto.fechaEmbarque),
          observaciones: $scope.producto.observaciones
        });
        swal("Registrado", " ", "success");
      }else{
        $scope.producto.fechaEmbarque = fecha($scope.producto.fechaEmbarque);
        $scope.productos.$save($scope.producto);
        swal("Actualizado", " ", "success");
      }
      $scope.button_title_form = 'Registrar';
      $scope.producto={};
      $scope.gridOptions.data = $scope.productos;
    };
    function fecha(fecha){
      var date = new Date(fecha).getMonth()+1;
      date += '-'+new Date(fecha).getDate();
      date += '-'+new Date(fecha).getFullYear();
      return date;
    }
    $scope.editar = function (m){
      scroll();
      $scope.panel_title_form = 'Actualizar producto';
      $scope.button_title_form = 'Actualizar'
      delete m.$$hashKey;
      $scope.producto =m
      $scope.producto.fechaEmbarque = new Date (Date.parse($scope.producto.fechaEmbarque));
    }
    $scope.borrar = function (p){
      swal({
        title: "Confirmar Eliminación",
        text: "¿Esta seguro de borrar el producto?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#b71c1c",
        confirmButtonText: "Si, Borrar!",
        cancelButtonText: "No, Cancelar!",
        closeOnConfirm: true,
        showLoaderOnConfirm: true,
      },
      function(){
        $scope.productos.$remove(p);
      });
      
    }
    $scope.cancelar = function (){
      $scope.panel_title_form = 'Registro de marcas';
      $scope.button_title_form = 'Registrar';
      $scope.producto = {};
      $scope.gridOptions.data = $firebaseArray(ref);
    }
    scroll();
  });
