/** 预算归还 */
(function(factory) {
	define("AdvanceReturn", [ "angular", "jquery", "Application" ], function(ng, $, Application) {
		return factory(window.app, ng, $, Application);
	});
})



(function(app, ng, $, Application) {
	"use strict";
	
	var controller = function($scope, $rootScope, $window, $http, $q, $timeout, ProcessService, DeptService, DictionaryService, BudgetSubjectService, LocaleService) {
		Application.init($scope, $rootScope, $window, $http, $timeout, ProcessService, DictionaryService, LocaleService,  {
		});
		var current = $rootScope.current;
		var query = $scope.query;
		var doView =  $scope.doView;
		var advanceReturn = $scope.advanceReturn;
		var editBill = $scope.editBill;
		var saveAdvanceReturn = $scope.saveAdvanceReturn;
		$scope.editBill = function(entity) {
			current.entity = $.extend({ }, entity);
			current.operator = "edit";
		};
		$scope.query = function(id) {
			query(id);
		};
		$scope.doView = function(entity) {
			doView(entity);
		};
		$scope.advanceReturn  = function(entity) {
			var message = LocaleService.getText('app.return.yesOrNo');
			if(window.confirm(message)){
				current.entity = entity;
				current.entity.status = "E";
				saveAdvanceReturn(entity);
				}else{
				return false;
				};
		};
	};
	controller.$inject = [ "$scope", "$rootScope", "$window", "$http", "$q", "$timeout", "ProcessService", "DeptService", "DictionaryService", "BudgetSubjectService", "LocaleService"];
	controller.$name = "AdvanceReturnController"; // 可以省略，系统会默认以"模块名+Service"进行注册.

	return {
		controller : controller
	};
});