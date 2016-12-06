"use strict";
(function(factory) {
	define("Accrual", [ "angular", "jquery", "app.expense.controller" ], function(ng, $, ctrl) {
		return factory.apply(this, arguments);
	});
})(function factory(ng, $, ctrl) {
	var AccrualController = function($scope, $injector) {
		// 要继承的外部方法，通过注入$injector可得到所有可注入的service
		ctrl.query($scope, $injector);
	};
	AccrualController.$inject = [ "$scope", "$injector", "$rootScope" ];

	var AccrualViewController = function($scope, $injector, ProcessConstants) {
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
	AccrualViewController.$inject = [ "$scope", "$injector", "ProcessConstants", "$rootScope" ];

	var saveController = function($scope, $injector, options) {
		return $.extend({
			newItem: function(item) {
				var entity = $scope.current.entity;
				item = $.extend(true, { }, item, {
					budgetDept: entity.dept, 
					costDept: entity.dept,
					propertyN60: 0	// 已报销金额为0
				});
				if (!ng.isUndefined(item.id)) delete item.id;
				return item;
			}
		}, options || { });
	}
	
	var AccrualAddController = function($scope, $injector) {
		var current = $scope.current;
		var ProcessConstants = $injector.get("ProcessConstants");
		ctrl.add($scope, $injector, saveController($scope, $injector));
		
		var add = $scope.add;
		$scope.add = function() {
			add.apply($scope, arguments);
			// 事前申请均视为价税分离
			current.entity.expense = $.extend(current.entity.expense || { }, { vatStatus : $scope.app.yes_no.yes });
		}
	};
	AccrualAddController.$inject = [ "$scope", "$injector", "$rootScope" ];

	var AccrualEditController = function($scope, $injector) {
		ctrl.edit($scope, $injector, saveController($scope, $injector));
	};
	AccrualEditController.$inject = [ "$scope", "$injector", "$rootScope" ];

	return {
		controllers : {
			"AccrualController" : AccrualController,
			"AccrualViewController" : AccrualViewController,
			"AccrualAddController" : AccrualAddController,
			"AccrualEditController" : AccrualEditController
		}
	}
});