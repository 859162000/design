"use strict";
(function(factory) {
	define("OtherExpense", [ "angular", "jquery", "app.expense.controller", "Dictionary" ], function(ng, $, ctrl, Dictionary) {
		return factory.apply(this, arguments);
	});
})(function factory(ng, $, ctrl, Dictionary) {
	var OtherExpenseController = function($scope, $injector) {
		// 要继承的外部方法，通过注入$injector可得到所有可注入的service
		ctrl.query($scope, $injector);
	};
	OtherExpenseController.$inject = [ "$scope", "$injector", "$rootScope" ];

	var OtherExpenseViewController = function($scope, $injector, ProcessConstants) {
		var STATUS = ProcessConstants.STATUS;
		ctrl.view($scope, $injector, {
			/** 是否可报销 */
			canExpense: function(entity) {
				return entity && STATUS.APPROVED == entity.status && entity.relationAmount > 0;
			},
			/** 报销 */
			addExpense: function(id) {
				
			},
			/** 是否可签订合同 */
			canContract: function(entity) {
				return entity && STATUS.APPROVED == entity.status;
			},
			/** 签订合同 */
			addContract: function(id) {
				
			}
		});
	};
	OtherExpenseViewController.$inject = [ "$scope", "$injector", "ProcessConstants", "$rootScope" ];

	var saveController = function($q, $scope, $injector, DictionaryService) {
		var current = $scope.current;
		return {
			newItem: function(item) {
				var entity = $scope.current.entity;
				item = $.extend(true, { }, item, {});
				if (!ng.isUndefined(item.id)) delete item.id;
				return item;
			},
		};
	}
	
	var OtherExpenseAddController = function($q, $scope, $injector, DictionaryService) {
		ctrl.add($scope, $injector, saveController($q, $scope, $injector, DictionaryService));
	};
	OtherExpenseAddController.$inject = ["$q", "$scope", "$injector", "DictionaryService" ];

	var OtherExpenseEditController = function($q, $scope, $injector, DictionaryService) {
		ctrl.edit($scope, $injector, saveController($q, $scope, $injector, DictionaryService));
	};
	OtherExpenseEditController.$inject = ["$q", "$scope", "$injector", "DictionaryService" ];

	return {
		controllers : {
			"OtherExpenseController" : OtherExpenseController,
			"OtherExpenseViewController" : OtherExpenseViewController,
			"OtherExpenseAddController" : OtherExpenseAddController,
			"OtherExpenseEditController" : OtherExpenseEditController
		}
	}
});