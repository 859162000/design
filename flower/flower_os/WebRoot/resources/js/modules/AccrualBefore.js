/** 事前审批申请 */
(function(factory) {
	define("AccrualBefore", [ "angular", "jquery", "Expense", "appRouter" ], function(ng, $, Expense, appRouter) {
		return factory(window.app, ng, $, Expense, appRouter);
	});
})(function(app, ng, $, Expense, appRouter) {
	"use strict";
	var expenseNamespace = "/accrual/expense/";
	// 注册事前审批报销的URL路径
	appRouter.$stateProvider.state('accrual_expense', {
		url: expenseNamespace + ':id',
		templateUrl: app.url('/accrual/expense/add.html'),
		controller: 'AccrualExpenseController'
    });

	var controller = function($state, $scope, $rootScope, $window, $http, $q, $timeout, ProcessService, DeptService, DictionaryService, BudgetSubjectService, LocaleService) {
		var app = $rootScope.app;
		var current = $rootScope.current;
		Expense.init($scope, $rootScope, $window, $http, $timeout, ProcessService, DictionaryService, LocaleService, {
			/** 
			 * 编辑数据
			 * @param entity 已查询出详细信息的数据
			 */
			doEdit: function(entity) {
				if ($scope.canEdit(entity)) {
					current.viewEntity = entity;
					var entity = $.extend(true, { }, entity);
					ng.forEach(entity.items, function(item) {
						item.advanceType = { code: item.propertyC00 }
					});
					current.entity = entity;
					current.operator = "edit";
				}
			},
			
			/** 事前申请报销 */
			addExpense: function(before) {
				before = before || current.entity;
				$window.location = '#' + (expenseNamespace + before.id);
			},
			
			doSave: function() {
				
			}
		});
		current.title = "accrual.before";	// 事前审批申请
	}
	controller.$inject = [ "$state", "$scope", "$rootScope", "$window", "$http", "$q", "$timeout", "ProcessService", "DeptService", "DictionaryService", "BudgetSubjectService", "LocaleService" ];
	controller.$name = "AccrualBeforeController"; // 可以省略，系统会默认以"模块名+Service"进行注册.

	return {
		controller : controller
	};
});