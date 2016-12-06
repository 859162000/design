"use strict";
(function(factory) {
	define("Payment", [ "angular", "jquery", "app.expense.controller" ], function(ng, $, ctrl) {
		return factory.apply(this, arguments);
	});
})(function factory(ng, $, ctrl) {
	var PaymentService = function($rootScope, $http, $q, $timeout, ProcessConstants) {
		var app = $rootScope.app;	// config中配置的window.app
		var namespace = "/finance/payment"
		return {
			/** 构造此模块下的路径 */
			url: function(url) {
				if (url.charAt('0') != '/') return url;	// 相对路径
				return app.url(namespace + url);
			},
			
			/**
			 * 支付
			 * @param entity 申请单信息
			 * @param payment 支付信息
			 */
			pay: function(entity, payment) {
				var deferred = $q.defer();
				var $this = this;
				$http.post(this.url("/pay.do"), { 
					id: entity.id, 
					message: entity.message, 
					payment: payment
				}).success(function(payment) {
					deferred.resolve(payment);
				});
				return deferred.promise;
			},
			

			/**
			 * 支付退回
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
	PaymentService.$inject = [ "$rootScope", "$http", "$q", "$timeout", "ProcessConstants" ];
	PaymentService.$name = "PaymentService"; // 可以省略，系统会默认以"模块名+Service"进行注册.如果此模块可能被其他模块依赖,则不能省略
	
	// 待支付列表查询
	var MyPaymentController = function($scope, $injector, ProcessQueryService, LocaleService) {
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
							+ '<a ng-href="{{ grid.appScope.$state.href(\'.pay\', { id: row.entity.id }) }}" ng-bind="row.entity.id"></a></div>' },
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
							+ 'ng-href="{{ grid.appScope.$state.href(\'.pay\', { id: row.entity.id }) }}" title="{{ \'payment.pay\' | appLocale }}"><i class="fa fa-money"></i></a> '
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
	MyPaymentController.$inject = [ "$scope", "$injector", "ProcessQueryService", "LocaleService", "$rootScope" ];

	var PayController = function($scope, $injector, $rootScope, $state, $window, PaymentService, LocaleService, ProcessService, ProcessConstants) {
		var STATUS = ProcessConstants.STATUS;
		var current = $scope.current;
		ctrl.view($scope, $injector, {
			/** 取得报销单的详细数据 */
			view : function(entity) {
				if (STATUS.PAYING != entity.status) {
					alert(LocaleService.getText('payment.validator.status', entity.id, entity.status));
					$state.go("finance.payment");
					return;	
				}
				entity.message = null;	// 清除前面审批人录入的信息，重新录入支付信息
				current.entity = entity;
				current.payment = $.extend({ },entity.payee, { // 支付
					id : null,
					payeeName: entity.payee.name,
					payeeBank: entity.payee.bank,
					payeeAccount: entity.payee.account,
					payeeType: entity.payee.type,
					method : entity.payee.payMethod,
					amount : entity.payee.payAmount,
					creator: $rootScope.session.user,
					dept: $rootScope.session.user.dept,
					company: $rootScope.session.user.company,
					createTime: new Date(),
					payDate: new Date(),
					status: ProcessConstants.PAY_STATUS.SUCCESS
				});
			},

			/** 确认支付 */
			pay : function() {
				if (!$window.confirm(LocaleService.getText('payment.pay.confirm'))) return;
				PaymentService.pay(current.entity, current.payment).then(function(payment) {
					alert(LocaleService.getText('payment.pay.successs', payment.id));
					$state.go("finance.payment");
				});
			},
			
			/** 支付退回 */
			reject: function() {
				if (!current.entity.message) {
					alert(LocaleService.getText('app.validator.required', LocaleService.get('payment.message')));
					return;	
				}
				if (!$window.confirm(LocaleService.getText('payment.reject.confirm'))) return;
				PaymentService.reject(current.entity).then(function(entity) {
					alert(LocaleService.getText('payment.reject.successs', entity.id));
					$state.go("finance.payment");
				});
			},

			/** 修改支付币种 */
			changeCurrency: function() {
				var currency = current.payment.currency;
				if (currency && currency.exchangeRate) {
					current.payment.exchangeRate = currency.exchangeRate;
					$scope.sum();
				}
			},
			/** 修改汇率 */
			changeExchangeRate: function() {
				var exchangeRate = current.payment.exchangeRate || 1;
				current.payment.exchangeRate = exchangeRate;
				$scope.sum();
			},
			
			/** 重新计算支付金额 */
			sum: function() {
				var amount = current.entity.payee.payAmount * current.entity.payee.exchangeRate;
				var payAmount = (amount / current.payment.exchangeRate).toFixed(2).doubleValue();
				current.payment.amount = payAmount;
			}
		});
	};
	PayController.$inject = [ "$scope", "$injector", "$rootScope", "$state", "$window", "PaymentService", "LocaleService", "ProcessService", "ProcessConstants" ];

	return {
		service: PaymentService,
		controllers : {
			"MyPaymentController" : MyPaymentController,
			"PayController" : PayController
		}
	}
});