"use strict";
(function(factory) {
	define("AccrualExpense", [ "angular", "jquery", "app.expense.controller" ], function(ng, $, ctrl) {
		return factory.apply(this, arguments);
	});
})(function factory(ng, $, ctrl) {
	var namespace = "/expense/accrual/expense";
	var params = { type: "accrual_expense" };
	var scope = { namespace: namespace, params: params };
	var AccrualExpenseController = function($scope, $injector) {
		// 要继承的外部方法，通过注入$injector可得到所有可注入的service
		ctrl.query($scope, $injector, scope);
	};
	AccrualExpenseController.$inject = [ "$scope", "$injector", "$rootScope" ];

	var AccrualExpenseViewController = function($scope, $injector, ProcessConstants) {
		var STATUS = ProcessConstants.STATUS;
		ctrl.view($scope, $injector, $.extend({
			
		}, scope));
	};
	AccrualExpenseViewController.$inject = [ "$scope", "$injector", "ProcessConstants", "$rootScope" ];

	var saveController = function($scope, $injector, options) {
		var current = $scope.current;
		var $state = $injector.get("$state");
		var LocaleService = $injector.get("LocaleService");
		var ProcessService = $injector.get("ProcessService");
		var ProcessConstants = $injector.get("ProcessConstants");
		
		var numberFilter = $injector.get("$filter")("amount");
		return $.extend(scope, {
			/** 汇总申请金额,支付金额 */
			sum: function() {
				var amounts = {
					amount: 0,
					amountTax: 0,
					amountCost: 0
				};
				var exchangeRate = current.entity.payee.exchangeRate;
				var maxAmount;
				ng.forEach(current.entity.items || [ ], function(item, idx) {
					if (item.propertyC10 != $scope.app.yes_no.yes) return;	// 未选中的行
					maxAmount = item.propertyN60 / exchangeRate;
					if (Number.greater(item.amount, maxAmount, 2)) {
						// 超出最大可报销金额
						alert(LocaleService.get("accrual.expense.validator.before.closed.item", idx + 1, numberFilter(maxAmount)));
						return;
					}
					angular.forEach(amounts, function(amt, name) {
						amounts[ name ] = amt + (item[ name ] || 0);
					});
				});
				if (amounts.amount != 0) {
					amounts.amountCost = amounts.amount - amounts.amountTax;
				} else {
					amounts.amount = amounts.amountCost + amounts.amountTax;
				}
				
				if (current.entity.payee) {
					$.extend(current.entity.payee, amounts);	// 原币金额
					// 支付金额
					current.entity.payee.payAmount = amounts.amount - current.entity.payee.payBackAmount;
				}
				if (exchangeRate != 1) {
					angular.forEach(amounts, function(amt, name) {
						amounts[ name ] = amt * exchangeRate;
					});
				}
				$.extend(current.entity, amounts);	// 本位币金额
			},

			/** 提交审批 */
			submit: function() {
				var items = [ ];
				ng.forEach(current.entity.items || [ ], function(item) {
					if (item.propertyC10 == $scope.app.yes_no.yes) {
						items.push(item);
					}
				});
				if (!items || items.length < 1) {
					alert(LocaleService.get('app.validator.required', LocaleService.get('application.items')));
					return;
				}
				var entity = $.extend({ }, current.entity);
				entity.status = ProcessConstants.STATUS.SUBMIT;
				entity.items = items;
				$scope.doSave(entity);
			},
			
			/** 保存数据 */
			doSave: function(entity) {
				entity = entity || current.entity;
				var isNew = entity.isNew;
				ProcessService.save(entity).then(function(entity) {
					var submit = entity.status == ProcessConstants.STATUS.SUBMIT;
					alert(LocaleService.getText(submit ? 'app.submit.success' : 'app.save.success'));
					// 跳转到view
					$state.go("expense.accrual.expense.view", { id: entity.id});
				});
			}
		}, options);
	}
	var AccrualExpenseAddController = function($scope, $injector) {
		var ProcessService = $injector.get("ProcessService");
		var ProcessConstants = $injector.get("ProcessConstants");
		var $stateParams = $injector.get("$stateParams");
		var beforeId = $stateParams[ "id" ];	// 事前申请单对应的id

		var current = $scope.current;
		var session = $scope.session;
		ctrl.add($scope, $injector, saveController($scope, $injector, {
			newId : function() {
				return ProcessService.newId(params.type, { beforeId: beforeId });
			},
			
			/** add方法取得id后的回调 */
			add: function(entity) {
				if (!entity) return;
				entity = current.entity = $.extend(entity, {
					isNew: true,
					status: ProcessConstants.STATUS.SAVE,	// 暂存数据
					previousStatus: ProcessConstants.STATUS.SAVE,	// 暂存数据
					amount: 0,
					amountTax: 0,
					amountCost: 0,
					payee: {
						type: ProcessConstants.PAYEE_TYPE.SELF,	// 收款方式默认为个人账户
						payMethod: ProcessConstants.PAY_METHOD.SELF,
						payBackAmount: 0,		// 还款金额,需要转换为currency的金额
						payAmount: 0,
						amount: 0,
						amountCost: 0,
						amountTax: 0
						//currency: $scope.app.currency,	// 默认币种为本位币
						//exchangeRate: 1			// 汇率为1
					},
					user: session.user,
					creator: session.user,
					dept: session.user.dept,
					company: session.user.dept,
					submitTime: new Date(),
					createTime: new Date()
				}, $scope.getCurrentParams() || { });
				
				if (!entity.expense.before) entity.expense.before = { id: beforeId };
				
				$scope.changePayMethod();
				$scope.sum();
			},
			
			/** 跳转到上级路由 */
			toParentState: function() {
				var parentState = $state.$current.parent;
				$state.go("expense.accrual.view", { id: beforeId });
			}
		}));
	};
	AccrualExpenseAddController.$inject = [ "$scope", "$injector", "$rootScope" ];

	var AccrualExpenseEditController = function($scope, $injector) {
		ctrl.edit($scope, $injector, saveController($scope, $injector));
	};
	AccrualExpenseEditController.$inject = [ "$scope", "$injector", "$rootScope" ];

	return {
		controllers : {
			"AccrualExpenseController" : AccrualExpenseController,
			"AccrualExpenseViewController" : AccrualExpenseViewController,
			"AccrualExpenseAddController" : AccrualExpenseAddController,
			"AccrualExpenseEditController" : AccrualExpenseEditController
		}
	}
});