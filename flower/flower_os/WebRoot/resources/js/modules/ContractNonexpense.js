/**合同审批***/
"use strict";
(function(factory) {
	define("ContractNonexpense", [ "angular", "jquery", "app.process.controller" ], function(ng, $, ctrl) {
		return factory.apply(this, arguments);
	});
})(function factory(ng, $, ctrl) {
	var ContractNonexpenseController = function($scope, $injector,LocaleService) {
		// 要继承的外部方法，通过注入$injector可得到所有可注入的service
		ctrl.query($scope, $injector);
		
		$scope.current.uiGridOptions = {
			data: "current.page.content",	// 表格数据 来源的字段
			enableRowSelection : true, // 是否可选择
			enableSelectAll : true, // 允许全选 
			enableGridMenu: true,
			enableColumnResizing: true,	// 可调整宽度
			isRowSelectable : function(row) {	// row行是否可选中
				return $scope.canRemove(row.entity);
			},
			columnDefs : [	// 定义列
				{ field : 'id', displayName : LocaleService.getText("contract.id"), enablePinning: true,//合同单号
					maxWidth: 160,
					cellTemplate : '<div class="ui-grid-cell-contents">'
						+ '<a href="#{{ grid.appScope.getNamespace(row.entity) }}/{{ row.entity.id }}" ng-bind="row.entity.id"></a></div>' },
				{ field : 'type', displayName : LocaleService.getText("contract.type") ,
							cellTemplate: '<div class="ui-grid-cell-contents" app-dict="row.entity.propertyC07"  dict-type="contractType" show-property="name"></div>'},//合同种类
				{ field : 'propertyC00', displayName : LocaleService.getText("contract.frameContract") ,
							cellTemplate: '<div class="ui-grid-cell-contents" app-dict="row.entity.propertyC00"  dict-type="yes_no" show-property="name"></div>'},//是否框架合同
				{ field : 'submitTime', displayName : LocaleService.getText("contract.period"), //合同期限
					cellClass: 'text-center', maxWidth: 110,
					cellTemplate: '<div class="ui-grid-cell-contents" ng-bind="row.entity.submitTime | date"></div>' }, 
				{ field : 'propertyC03', displayName : LocaleService.getText("contract.importantDegree"),//重要程度
						cellTemplate: '<div class="ui-grid-cell-contents" app-dict="row.entity.propertyC03"  dict-type="importantDegree" show-property="name"></div>'},
				{ field : 'company.id', maxWidth: 110, displayName : LocaleService.getText("contract.unit"),//签订单位
							cellTemplate: '<div class="ui-grid-cell-contents" ng-bind="row.entity.propertyC06"></div>'},	
				{ field : 'propertyC01', maxWidth: 110, displayName : LocaleService.getText("contract.signSituation"),//合同签订情况
					cellTemplate: '<div class="ui-grid-cell-contents" app-dict="row.entity.propertyC01"  dict-type="contract_signSituation"  show-property="name"></div>' },
				{ field : 'propertyC02', maxWidth: 110, displayName : LocaleService.getText("contract.contractSubject"),//合同主题
							cellTemplate: '<div class="ui-grid-cell-contents" ng-bind="row.entity.propertyC02"></div>' },
					{ name : LocaleService.getText('app.edit'), displayName : '', 
					enableColumnMenu: false, enableSorting: false, enableColumnResizing: false,
					maxWidth: 50,
					cellTemplate : '<div class="ui-grid-cell-contents"><a ng-if="grid.appScope.canEdit(row.entity)" '
						+ 'ng-href="{{ grid.appScope.$state.href(\'.edit\', { id: row.entity.id }) }}" title="{{ \'app.edit\' | appLocale }}"><i class="fa fa-edit"></i></a> '
						+ '<a href="javascript:;" ng-if="grid.appScope.canRevoke(row.entity)" '
						+ 'ng-click="grid.appScope.revoke(row.entity.id)" title="{{ \'app.revoke\' | appLocale }}"><i class="fa fa-level-down"></i></a> '
						+ '<a href="javascript:;" ng-if="grid.appScope.canRemove(row.entity)" '
						+ 'ng-click="grid.appScope.remove(row.entity.id)" title="{{ \'app.remove\' | appLocale }}"><i class="fa fa-remove"></i></a></div>'
				}
			],
			
			/** 将uiGrid的api对象注入到$scope.uiGrid中 */
			onRegisterApi: function(uiGrid) {
				$scope.uiGrid = uiGrid;
				var cellTemplate = '<div class="ui-grid-cell-contents" ng-bind="rowRenderIndex+1"></div>';
				uiGrid.core.addRowHeaderColumn( { name: 'rowNum', displayName: '', width: 30, maxWidth: 40, 
					enableColumnResizing: false, cellClass: "text-right", headerCellClass: 'text-clip', 
					cellTemplate: cellTemplate}, 10 );

				/** 得到当前被选中数据的id */
				function onRowSelectionChanged(row) {
					var ids = [ ];
					ng.forEach(uiGrid.selection.getSelectedRows(), function(row) {
						ids.push(row.id);
					});
					current.selected = ids;
					return ids;
				}
				
				if (uiGrid.selection) {
					/** 单列的选择变化事件 */
					uiGrid.selection.on.rowSelectionChanged($scope, function(row, event) {
						if (row.isSelected) {
							current.selected.push(row.entity.id);
						} else {
							current.selected.remove(row.entity.id);
						}
					});
					/** 全选/全不选事件 */
					uiGrid.selection.on.rowSelectionChangedBatch($scope, function(rows, event) {
						var ids = [ ];
						ng.forEach(uiGrid.selection.getSelectedRows(), function(entity) {
							ids.push(row.id);
						});
						current.selected = ids;
						return ids;
					});
				}
			}
		}
	};
	ContractNonexpenseController.$inject = [ "$scope", "$injector", "$rootScope","LocaleService" ];

	var ContractNonexpenseViewController = function($scope, $injector, ProcessConstants) {
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
	ContractNonexpenseViewController.$inject = [ "$scope", "$injector", "ProcessConstants", "$rootScope" ];

	var saveController = function($scope, $injector) {
	};
	
	var ContractNonexpenseAddController = function($scope, $injector) {
		ctrl.add($scope, $injector, saveController($scope, $injector));
		var current = $scope.current;
		var xAdd = $scope.add;
		$scope.add = function(id) {
			xAdd(id);
			current.entity.propertyC07 = "1"; //非费用类合同（业务合同）
			current.entity.propertyC00 = "1" ;//默认为框架合同
			current.entity.propertyC03 = "0";//默认重要程度为普通
			current.entity.propertyC01 = "0";//默认为新签合同
			current.entity.propertyD00 =  new Date();
			current.entity.propertyD01 =  new Date();
			current.entity.payee =  $.extend(true, { }, current.entity.payee,{
					payBackAmount : 0,
					amountTax : 0,	
					type :"0",//合同审批在payee中有些不能为空的字段用不到，所以在此赋默认值。
					payMethod : "0",
					amountCost : "0",
					amount : "0"
					//非费用合同支付字段必须有要赋值的。
					}
					);
		};
	};
	ContractNonexpenseAddController.$inject = [ "$scope", "$injector", "$rootScope" ];

	var ContractNonexpenseEditController = function($scope, $injector) {
		ctrl.edit($scope, $injector, saveController($scope, $injector));
	};
	ContractNonexpenseEditController.$inject = [ "$scope", "$injector", "$rootScope" ];

	return {
		controllers : {
			"ContractNonexpenseController" : ContractNonexpenseController,
			"ContractNonexpenseViewController" : ContractNonexpenseViewController,
			"ContractNonexpenseAddController" : ContractNonexpenseAddController,
			"ContractNonexpenseEditController" : ContractNonexpenseEditController
		}
	};
});