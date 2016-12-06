/** 报销相关申请导入 */
(function(factory) {
	define("Expense", [ "angular", "jquery", "Application", "ExpenseSupplier" ], function(ng, $, Application, ExpenseSupplier) {
		return factory(window.app, ng, $, Application, ExpenseSupplier);
	});
})(function(app, ng, $, Application, ExpenseSupplier) {
	"use strict";
	
	var PAY_METHODS = {	// 所有支付方式dict_type="payment_method",注意,应该与Payment.js中保持一致
		SELF: "A",	// 个人账户(银企直连)
		BANK: "B0",	// 银行转账(银企直连)
		BANK_OFFLINE: "B1", // 银行转账,非银企
		CASH: "C",	// 现金
		CHEQUE: "D",	// 现金支票
		SETTLE: "S"	// 账务结算
	};
	
	var PAYEE_TYPE = {
		INPUT: '0',	// 手工录入
		SELF: 'S',	// 员工个人账户
		SUPPLIER:'V'	// 供应商
	};
	
	var init = function($scope, $rootScope, $window, $http, $timeout, ProcessService, DictionaryService, LocaleService, data) {
		var app = $rootScope.app; // config中配置的window.app
		var current = $rootScope.current;
		var session = $rootScope.session;
		var DICT_APPLICATION_TYPE = app.DICT_APPLICATION_TYPE;	// "application_type";
		var STATUS = ProcessService.STATUS;
		
		Application.init($scope, $rootScope, $window, $http, $timeout, ProcessService, DictionaryService, LocaleService, $.extend({
			PAY_METHODS: PAY_METHODS,
			PAYEE_TYPE: PAYEE_TYPE,
			/** 修改支付方式 */
			changePayMethod: function() {
				var payee = current.entity.payee;
				if (PAY_METHODS.SELF == current.entity.payee.payMethod) {
					// 个人账户
					payee.type = PAYEE_TYPE.SELF;
					payee.user = session.user;
					payee.name = session.user.payeeName;
					payee.bank = session.user.payeeBank;
					payee.account = session.user.payeeAccount;
				} else if (PAY_METHODS.CASH == current.entity.payee.payMethod) {
					// 现金
					payee.type = PAYEE_TYPE.SELF;
					payee.user = session.user;
					payee.name = null;
					payee.bank = null;
					payee.account = null;
				} else {
					// 如果有供应商则为供应商，否则为手工输入
					payee.type = payee.supplier ? PAYEE_TYPE.SUPPLIER : PAYEE_TYPE.INPUT;
					payee.user = null;
				}
			},
			/** 修改支付币种 */
			changeCurrency: function() {
				var currency = current.entity.payee.currency;
				if (currency.exchangeRate) {
					current.entity.payee.exchangeRate = currency.exchangeRate;
					$scope.sum();
				}
			},
			/** add方法取得id后的回调 */
			doAdd: function(id) {
				if (!id) return;
				current.operator = "add";
				current.entity = $.extend({
					id: id,
					isNew: true,
					status: ProcessService.STATUS_SAVE,	// 暂存数据
					previousStatus: ProcessService.STATUS_SAVE,	// 暂存数据
					amount: 0,
					amountTax: 0,
					amountCost: 0,
					payee: {
						type: PAYEE_TYPE.SELF,	// 收款方式默认为个人账户
						payMethod: PAY_METHODS.SELF,
						payBackAmount: 0,		// 还款金额，人民币
						amount: 0,
						amountCost: 0,
						amountTax: 0,
						currency: app.currency,	// 默认币种为本位币
						exchangeRate: 1			// 汇率为1
					},
					expense: {
						amount: 0,
						payBackAmount: 0	// 还款金额
					},
					user: session.user,
					creator: session.user,
					dept: session.user.dept,
					company: session.user.dept,
					submitTime: new Date(),
					createTime: new Date()
				}, $scope.getCurrentParams() || { });
				
				$scope.changePayMethod();
			},

			/** 提交审批 */
			submit: function() {
				if (current.entity.items.length < 1) {
					alert(LocaleService.get('app.validator.required', LocaleService.get('application.items')));
					return;
				}
				current.entity.status = ProcessService.STATUS_SUBMIT;
				$scope.doSave();
			}
		}, data || { }));
		
		ExpenseSupplier.init($scope, $rootScope, $window, $http, $timeout, ProcessService, DictionaryService, LocaleService);
	};
	return {
		init : init,
		PAY_METHODS: PAY_METHODS
	};
});