/** 预算导入 */
(function(factory) {
	define("Advance", [ "angular", "jquery", "app.expense.controller" ], function(ng, $, ctrl) {
		return factory.apply(this, arguments);
	});
})(function(ng, $, ctrl) {
	"use strict";
	
	var AdvanceController = function($scope, $injector, LocaleService) {
		// 要继承的外部方法，通过注入$injector可得到所有可注入的service
		ctrl.query($scope, $injector, {
			uiGridOptions: {
				columnDefs : [	// 定义列
					{ field : 'id', displayName : LocaleService.getText("application.id"), enablePinning: true,
						maxWidth: 160,
						cellTemplate : '<div class="ui-grid-cell-contents">'
							+ '<a ng-href="{{ grid.appScope.$state.href(\'.view\', { id: row.entity.id }) }}"'
							+ 'xhref="#{{ grid.appScope.getNamespace(row.entity) }}/{{ row.entity.id }}" ng-bind="row.entity.id"></a></div>' },
					{ field : 'user.name', displayName : LocaleService.getText("application.user") },
					{ field : 'dept.name', displayName : LocaleService.getText("application.dept") },
					{ field : 'submitTime', displayName : LocaleService.getText("application.date"), cellClass: 'text-center', maxWidth: 110,
						cellTemplate: '<div class="ui-grid-cell-contents" ng-bind="row.entity.submitTime | date"></div>' }, // 申请日期
					{ name : "advanceDate", displayName : LocaleService.getText("advance.date"), cellClass: 'text-center', maxWidth: 110,
						cellTemplate: '<div class="ui-grid-cell-contents" ng-bind="row.entity.propertyD00 | date"></div>' }, // 预支日期
					{ name : "advanceReturnDate", displayName : LocaleService.getText("advance.return.date.expect"), 
						cellClass: 'text-center', maxWidth: 110,
						cellTemplate: '<div class="ui-grid-cell-contents" ng-bind="row.entity.propertyD01 | date"></div>' }, // 预计归还日期
					{ field : 'amount', displayName : LocaleService.getText("application.amount"), cellClass: 'text-right',
							cellTemplate: '<div class="ui-grid-cell-contents" ng-bind="row.entity.amount | currency"></div>'  },
					{ field : 'status', width: 110, displayName : LocaleService.getText("application.status"),
						cellTemplate: '<div class="ui-grid-cell-contents" app-dict="row.entity.status" dict-type="application_status"></div>' },	// 申请单状态
					{ name : LocaleService.get('app.edit'), displayName : '', 
						enableColumnMenu: false, enableSorting: false, enableColumnResizing: false,
						maxWidth: 50,
						cellTemplate : '<div class="ui-grid-cell-contents"><a ng-if="grid.appScope.canEdit(row.entity)" '
							+ 'ng-href="{{ grid.appScope.$state.href(\'.edit\', { id: row.entity.id }) }}" title="{{ \'app.edit\' | appLocale }}"><i class="fa fa-edit"></i></a> '
							+ '<a href="javascript:;" ng-if="grid.appScope.canRevoke(row.entity)" '
							+ 'ng-click="grid.appScope.revoke(row.entity.id)" title="{{ \'app.revoke\' | appLocale }}"><i class="fa fa-level-down"></i></a> '
							+ '<a href="javascript:;" ng-if="grid.appScope.canRemove(row.entity)" '
							+ 'ng-click="grid.appScope.remove(row.entity.id)" title="{{ \'app.remove\' | appLocale }}"><i class="fa fa-remove"></i></a></div>'
					}
				]
			}
		});
	};
	AdvanceController.$inject = [ "$scope", "$injector", "LocaleService" ];

	var AdvanceViewController = function($scope, $injector, ProcessConstants) {
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
	AdvanceViewController.$inject = [ "$scope", "$injector", "ProcessConstants", "$rootScope" ];

	/** add/edit */
	var saveController = function($scope, $injector, options) {
		return $.extend({
			/** 改变预支类型则自动更改预算科目 */
			changeAdvanceType : function(item) {
				if (item.advanceType) {
					item.propertyC00 = item.advanceType.code; // 预支类型代码
					item.budgetSubject = {
						id : item.advanceType.propertyN00
					};
				}
			}
		}, options || { });
	}
	
	var AdvanceAddController = function($scope, $injector) {
		ctrl.add($scope, $injector, saveController($scope, $injector));
		
		var add = $scope.add;
		$scope.add = function() {
			add.apply($scope, arguments);
			$scope.current.entity.propertyD00 = new Date();
		}
	};
	AdvanceAddController.$inject = [ "$scope", "$injector", "$rootScope" ];

	var AdvanceEditController = function($scope, $injector) {
		var current = $scope.current;
		ctrl.edit($scope, $injector, saveController($scope, $injector, {
			/**
			 * 编辑数据
			 * 
			 * @param entity 已查询出详细信息的数据
			 */
			edit : function(entity) {
				var entity = $.extend(true, {}, entity);
				ng.forEach(entity.items, function(item) {
					item.advanceType = {
						code : item.propertyC00
					}
				});
				current.entity = entity;
				current.entity.propertyD00 = new Date();
			}
		}));
	};
	AdvanceEditController.$inject = [ "$scope", "$injector", "$rootScope" ];

	return {
		controllers : {
			"AdvanceController" : AdvanceController,
			"AdvanceViewController" : AdvanceViewController,
			"AdvanceAddController" : AdvanceAddController,
			"AdvanceEditController" : AdvanceEditController
		}
	}
});