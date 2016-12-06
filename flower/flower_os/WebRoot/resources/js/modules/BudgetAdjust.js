/** 预算调整 */
(function(factory) {
	define("BudgetAdjust", [ "angular", "jquery", "app.process.controller" ], function(ng, $, ctrl) {
		return factory.apply(this, arguments);
	});
})(function(ng, $, ctrl) {
	"use strict";

	var BudgetAdjustController = function($scope, $injector) {
		// 要继承的外部方法，通过注入$injector可得到所有可注入的service
		
		ctrl.query($scope, $injector);
	};
	BudgetAdjustController.$inject = [ "$scope", "$injector" ];

	var BudgetAdjustViewController = function($scope, $injector) {
		ctrl.view($scope, $injector, saveController($scope, $injector));
	};
	BudgetAdjustViewController.$inject = [ "$scope", "$injector" ];

	/** add/edit */
	var saveController = function($scope, $injector, options) {
		return $.extend({
			adjustType : {
				/** 部门内调整 */
				inside : "inside",
				/** 本部门调出 */
				callout : "callout",
				/** 其它部门调入 */
				callin : "callin",
				// 预算追加
				additional : "additional"
			}
		}, options || { });
	};
	
	var initController = function($scope, $injector) {
		var LocaleService = $injector.get("LocaleService");
		var current = $scope.current;
		var xAddItem = $scope.addItem;
		$scope.addItem = function(item) {
			var adjustType = current.entity.propertyC00;
			if((adjustType == $scope.adjustType.callout || adjustType == $scope.adjustType.callin) 
					&& !current.entity.propertyN02){
				alert(LocaleService.getText("budget.adjust.add.control"));
				return;
			}
			xAddItem(item);
		};
		
		var xDoSave = $scope.doSave;
		$scope.doSave = function(entity) {
			var session = $scope.session;
			var tempDept = session.user.dept;
			var adjustType = current.entity.propertyC00;
			angular.forEach(entity.items, function(item) {
				if(adjustType == $scope.adjustType.inside || adjustType == $scope.adjustType.additional){
					item.budgetDept = tempDept;
					item.costDept = tempDept;
				} else if(adjustType == $scope.adjustType.callout){
					item.budgetDept = tempDept;
				} else if(adjustType == $scope.adjustType.callin){
					item.costDept = tempDept;
				}
			});
			xDoSave(entity);
		};
	};
	
	var BudgetAdjustAddController = function($scope, $injector) {
		ctrl.add($scope, $injector, saveController($scope, $injector));
		var current = $scope.current;
		var xAdd = $scope.add;
		$scope.add = function(id) {
			xAdd(id);
			current.entity.propertyC00 = $scope.adjustType.inside;
			current.entity.propertyN00 = app.currentMonth.year || '';	// 预算年份默认为当前年份
			current.entity.propertyN01 = app.currentMonth.month || '';	// 预算年份默认为当前月份
		};
		initController($scope, $injector);
	};
	BudgetAdjustAddController.$inject = [ "$scope", "$injector", "$rootScope" ];

	var BudgetAdjustEditController = function($scope, $injector) {
		ctrl.edit($scope, $injector, saveController($scope, $injector));
		initController($scope, $injector);
	};
	BudgetAdjustEditController.$inject = [ "$scope", "$injector", "$rootScope" ];

	return {
		controllers : {
			"BudgetAdjustController" : BudgetAdjustController,
			"BudgetAdjustViewController" : BudgetAdjustViewController,
			"BudgetAdjustAddController" : BudgetAdjustAddController,
			"BudgetAdjustEditController" : BudgetAdjustEditController
		}
	}
});