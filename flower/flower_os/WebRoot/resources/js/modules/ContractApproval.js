/**合同审批***/
"use strict";
(function(factory) {
	define("ContractApproval", [ "angular", "jquery", "app.process.controller" ], function(ng, $, ctrl) {
		return factory.apply(this, arguments);
	});
})(function factory(ng, $, ctrl) {
	var ContractApprovalController = function($scope, $injector,LocaleService) {
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
				{ field : 'payee.currency', maxWidth: 110, displayName : LocaleService.getText("contract.currency"),//支付币种
					cellTemplate: '<div class="ui-grid-cell-contents" app-show="row.entity.payee.currency.id" url="/currency.do"></div>' },
				{ field : 'payee.exchangeRate', maxWidth: 110, displayName : LocaleService.getText("contract.rate"),//汇率
					cellTemplate: '<div class="ui-grid-cell-contents" ng-bind="row.entity.payee.exchangeRate"></div>' },
				{ field : 'payee.amount', maxWidth: 110, displayName : LocaleService.getText("contract.money"),//金额
					cellTemplate: '<div class="ui-grid-cell-contents" ng-bind="row.entity.payee.amount"></div>' },
				{ field : 'payee.payMethod', maxWidth: 110, displayName : LocaleService.getText("contract.payStyle"),//支付方式
					cellTemplate: '<div class="ui-grid-cell-contents" app-dict="row.entity.payee.payMethod" dict-type="payment_method"></div>' },
				{ field : 'payee.name', maxWidth: 110, displayName : LocaleService.getText("contract.payee"),//收款人
					cellTemplate: '<div class="ui-grid-cell-contents" ng-bind="row.entity.payee.name"></div>' },
				{ field : 'payee.bank', maxWidth: 110, displayName : LocaleService.getText("contract.bank"),//开户行
						cellTemplate: '<div class="ui-grid-cell-contents" ng-bind="row.entity.payee.bank"></div>' },
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
	ContractApprovalController.$inject = [ "$scope", "$injector", "$rootScope","LocaleService" ];

	var ContractApprovalViewController = function($scope, $injector, ProcessConstants) {
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
	ContractApprovalViewController.$inject = [ "$scope", "$injector", "ProcessConstants", "$rootScope" ];

	var saveController = function($scope, $injector) {
		return {
			newItem: function(item) {
				var entity = $scope.current.entity; 
				item = $.extend(true, { }, item, {
						propertyN00 : 1, //初始化 数量为1 
				});
				if (!ng.isUndefined(item.id)) delete item.id;
				return item;
			},
			dox: function() {
				var entity = $scope.current.entity; 
				var sum = 0;
				var sumEstimate = 0;//预估金额
				angular.forEach(entity.items, function(item) {
					    item.propertyN00 = parseInt(item.propertyN00);//数量取整
						item.amount = item.amountCost * item.propertyN00 ;
						sum = sum + item.amount ;
						sumEstimate = sumEstimate + item.propertyN50;
					});
				entity.payee.amountCost = sum;
				entity.payee.amount = sum;
				entity.propertyN51 = sumEstimate;
			},//单价*数量 = 合同总额；合计= 合同总额 相加
		};
	};
	
	var ContractApprovalAddController = function($scope, $injector) {
		ctrl.add($scope, $injector, saveController($scope, $injector));
		var current = $scope.current;
		var xAdd = $scope.add;
		$scope.add = function(id) {
			xAdd(id);
			current.entity.propertyC07 = "0"; //费用类合同
			current.entity.propertyC00 = "1" ;//默认为框架合同
			current.entity.propertyC03 = "0";//默认重要程度为普通
			current.entity.propertyC01 = "0";//默认为新签合同
			current.entity.propertyD00 =  new Date();
			current.entity.propertyD01 =  new Date();
			current.entity.payee =  $.extend(true, { }, current.entity.payee,{
					payBackAmount : 0,
					amountTax : 0,
					type :"0"}//合同审批在payee中有些不能为空的字段用不到，所以在此赋默认值。
					);
		};
	};
	ContractApprovalAddController.$inject = [ "$scope", "$injector", "$rootScope" ];

	var ContractApprovalEditController = function($scope, $injector) {
		ctrl.edit($scope, $injector, saveController($scope, $injector));
	};
	ContractApprovalEditController.$inject = [ "$scope", "$injector", "$rootScope" ];

	return {
		controllers : {
			"ContractApprovalController" : ContractApprovalController,
			"ContractApprovalViewController" : ContractApprovalViewController,
			"ContractApprovalAddController" : ContractApprovalAddController,
			"ContractApprovalEditController" : ContractApprovalEditController
		}
	};
});