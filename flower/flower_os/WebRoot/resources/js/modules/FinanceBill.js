/** 费用单据签收 */
(function(factory) {
	define("FinanceBill", [ "angular", "jquery", "Application" ], function(ng, $, Application) {
		return factory(window.app, ng, $, Application);
	});
})
(function(app, ng, $, Application) {
	"use strict";

	var controller = function($scope, $rootScope, $window, $http, $q, $timeout, ProcessService, DeptService,
			DictionaryService, BudgetSubjectService, LocaleService) {
		var session = $rootScope.session;
		var current = $rootScope.current;

		Application.init($scope, $rootScope, $window, $http, $timeout, ProcessService, DictionaryService, LocaleService, {});
		
		$.extend($scope, {
			back : function() {
				var message = LocaleService.getText('app.back.yesOrNo');
				if (window.confirm(message)) {
					current.entity = $.extend({}, current.entity);
					current.entity.status = "RA";
					
					ProcessService.saveBill(current.entity, session.currentMenu.namespace).then(function(entity) {
						alert(LocaleService.getText('app.reject.success'));
						$scope.query();
					});
				} else {
					return false;
				}
			},
			sign : function(entity) {
				var message = LocaleService.getText('app.sign.yesOrNo');
				if (window.confirm(message)) {
					current.entity = entity;
					current.entity.status = "C";

					ProcessService.saveBill(current.entity, session.currentMenu.namespace).then(function(entity) {
						alert(LocaleService.getText('app.sign.success'));
						$scope.query();
					});
				} else {
					return false;
				}
			},
			editBill : function(entity) {
				current.entity = $.extend({}, entity);
				current.operator = "edit";
			}
		});
		
		$scope.query();
		current.title = "finance.bill.list";
	};
	controller.$inject = [ "$scope", "$rootScope", "$window", "$http", "$q", "$timeout", "ProcessService",
			"DeptService", "DictionaryService", "BudgetSubjectService", "LocaleService" ];
	controller.$name = "FinanceBillController"; // 可以省略，系统会默认以"模块名+Service"进行注册.

	return {
		controller : controller
	};
});