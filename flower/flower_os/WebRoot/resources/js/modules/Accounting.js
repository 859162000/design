"use strict";
(function(factory) {
	define("Accounting", [ "angular", "jquery", "app.expense.controller" ], function(ng, $, ctrl) {
		return factory.apply(this, arguments);
	});
})(function factory(ng, $, ctrl) {
	// 凭证处理，即费用单据审核
	var namespace = "/finance/accounting"
	var AccountingService = function($rootScope, $http, $q, $timeout, ProcessConstants) {
		var app = $rootScope.app;	// config中配置的window.app
		return {
			/** 构造此模块下的路径 */
			url: function(url) {
				if (url.charAt('0') != '/') return url;	// 相对路径
				return app.url(namespace + url);
			},

			/** 生成新的凭证数据，id为申请单号 */
			newAccounting : function(id) {
				var deferred = $q.defer();
				$http.post(this.url("/newAccounting.do"), {	id: id }).success(function(data) {
					deferred.resolve(data);
				});
				return deferred.promise;
			},
			
			/**
			 * 保存凭证
			 * @param entity 申请单信息
			 * @param accounting 凭证信息
			 */
			save: function(entity, accounting) {
				var deferred = $q.defer();
				var $this = this;
				var acc = $.extend({ }, accounting);
				delete acc.items;
				$http.post(this.url("/save.do"), { 
					id: entity.id, 
					message: entity.message, 
					accounting: acc,		// 凭证主信息
					items: accounting.items	// 凭证分录明细
				}).success(function(accounting) {
					deferred.resolve(accounting);
				});
				return deferred.promise;
			},
			

			/**
			 * 费用单据审核退回
			 * @param entity 申请单信息
			 */
			reject: function(entity) {
				var deferred = $q.defer();
				var $this = this;
				$http.post(this.url("/reject.do"), {
					id: entity.id,
					rejectType: entity.rejectType, 
					message: entity.message
				}).success(function(payment) {
					deferred.resolve(payment);
				});
				return deferred.promise;
			}
		};			
	}
	AccountingService.$inject = [ "$rootScope", "$http", "$q", "$timeout", "ProcessConstants" ];
	AccountingService.$name = "AccountingService"; // 可以省略，系统会默认以"模块名+Service"进行注册.如果此模块可能被其他模块依赖,则不能省略
	
	// 查询待审核申请
	var MyAccountingController = function($scope, $injector, ProcessQueryService, LocaleService) {
		ProcessQueryService.state = null;	// 进入此页面就会重新查询
		ctrl.query($scope, $injector);
		
		var current = $scope.current;
		$.extend(current, {
			uiGridOptions : {
				data: "current.page.content",	// 表格数据 来源的字段
				enableRowSelection : true, // 是否可选择
				enableSelectAll : true, // 允许全选 
				enableGridMenu: true,
				enableColumnResizing: true,	// 可调整宽度
				isRowSelectable : function(row) {	// row行是否可选中
					return true;
				},
				columnDefs : [	// 定义列
					{ field : 'id', displayName : LocaleService.getText("application.id"), enablePinning: true,
						maxWidth: 160,
						cellTemplate : '<div class="ui-grid-cell-contents">'
							+ '<a ng-href="{{ grid.appScope.$state.href(\'.accounting\', { id: row.entity.id }) }}" ng-bind="row.entity.id"></a></div>' },
					{ field : 'user.name', displayName : LocaleService.getText("application.user") },
					{ field : 'dept.name', displayName : LocaleService.getText("application.dept") },
					{ field : 'submitTime', displayName : LocaleService.getText("application.date"), 
						cellClass: 'text-center', maxWidth: 110,
						cellTemplate: '<div class="ui-grid-cell-contents" ng-bind="row.entity.submitTime | date"></div>' }, // 申请日期
					{ field : 'amount', displayName : LocaleService.getText("application.amount"),
							cellClass: 'text-right', maxWidth: 110,
							cellTemplate: '<div class="ui-grid-cell-contents" ng-bind="row.entity.amount | currency"></div>'  },
					{ name : 'action', displayName : '', 
						enableColumnMenu: false, enableSorting: false, enableColumnResizing: false,
						maxWidth: 50,
						cellTemplate : '<div class="ui-grid-cell-contents"><a '
							+ 'ng-href="{{ grid.appScope.$state.href(\'.accounting\', { id: row.entity.id }) }}" title="{{ \'accounting\' | appLocale }}"><i class="fa fa-edit"></i></a> '
							+ '<a target="_blank" ng-href="#{{ grid.appScope.getNamespace(row.entity) }}/{{ row.entity.id }}" title="{{ \'app.view\' | appLocale }}"><i class="fa fa-eye"></i></a>'
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
		});
	};
	MyAccountingController.$inject = [ "$scope", "$injector", "ProcessQueryService", "LocaleService", "$rootScope" ];
	
	// 审核退回
	var AccountingRejectController = function($scope, $injector, $rootScope, $state, $window, AccountingService, LocaleService, ProcessService, ProcessConstants) {
		var STATUS = ProcessConstants.STATUS;
		var current = $scope.current;
		ctrl.view($scope, $injector, {
			/** 取得报销单的详细数据 */
			view : function(entity) {
				if (STATUS.ACCOUNTING != entity.status) {
					alert(LocaleService.getText('accounting.validator.status', entity.id, entity.status));
					$state.go("finance.accounting");
					return;	
				}
				entity.message = null;	// 清除前面审批人录入的信息，重新录入支付信息
				current.entity = entity;
			},
			
			/** 审核退回 */
			reject: function() {
				if (!current.entity.message) {
					alert(LocaleService.getText('app.reject.message.required'));
					return;	
				}
				if (!$window.confirm(LocaleService.getText('accounting.reject.confirm'))) return;
				AccountingService.reject(current.entity).then(function(entity) {
					alert(LocaleService.getText('accounting.reject.successs', entity.id));
					$state.go("finance.accounting");
				});
			}
		});
	};
	AccountingRejectController.$inject = [ "$scope", "$injector", "$rootScope", "$state", "$window", "AccountingService", "LocaleService", "ProcessService", "ProcessConstants" ];

	
	// 凭证处理
	var AccountingController = function($scope, $injector, $rootScope, $state, $stateParams, $window, AccountingService, LocaleService, ProcessConstants) {
		var STATUS = ProcessConstants.STATUS;
		var current = $scope.current;
		var id = $stateParams[ "id" ];	// 事前申请单对应的id
		ctrl.add($scope, $injector, {
			newId : function() {
				return AccountingService.newAccounting(id);
			},
			
			/** 处理凭证信息 */
			add : function(data) {
				var application = data.application;	// 申请单详细信息
				var accounting = data.accounting;			// 生成的凭证号
				
				if (STATUS.ACCOUNTING != application.status) {
					alert(LocaleService.getText('accounting.validator.status', application.id, application.status));
					$state.go("finance.accounting");
					return;	
				}
				application.message = null;	// 清除前面审批人录入的信息，重新录入支付信息
				current.entity = accounting;
				current.application = application;
			},

			/** 提交，保存凭证 */
			save : function() {
				if (!$window.confirm(LocaleService.getText('app.save.confirm'))) return;
				AccountingService.save(current.entity, current.application).then(function(accounting) {
					alert(LocaleService.getText('app.save.successs', accounting.id));
					$state.go("finance.accounting");
				});
			}
		});
	};
	AccountingController.$inject = [ "$scope", "$injector", "$rootScope", "$state", "$stateParams", "$window", "AccountingService", "LocaleService", "ProcessConstants" ];

	return {
		service: AccountingService,
		controllers : {
			"MyAccountingController" : MyAccountingController,
			"AccountingRejectController" : AccountingRejectController,
			"AccountingController" : AccountingController
		}
	}
});