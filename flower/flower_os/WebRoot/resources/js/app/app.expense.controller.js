/** 费用审批流程相关申请的controller */
(function(factory) {
	var deps = [ "angular", "jquery", "app.process.controller" ];
	define("app.expense.controller", deps, function(ng, $, ctrl) {
		return factory.apply(this, arguments);
	});
})(function(ng, $, ctrl) {
	"use strict";
	/** 编辑时需要的方法 */
	var initSaveController = function($scope, $injector, options) {
		var LocaleService = $injector.get("LocaleService");
		var ProcessService = $injector.get("ProcessService");
		var ProcessConstants = $injector.get("ProcessConstants");
		var PAY_METHOD = ProcessConstants.PAY_METHOD;
		var PAYEE_TYPE = ProcessConstants.PAYEE_TYPE;
		var current = $scope.current;
		var session = $scope.session;
		return $.extend({
			/** 修改支付方式 */
			changePayMethod: function() {
				var payee = current.entity.payee;
				var payMethod = payee.payMethod;
				if (PAY_METHOD.SELF == payMethod) {
					// 个人账户
					payee.type = PAYEE_TYPE.SELF;
					payee.user = session.user;
					payee.name = session.user.payeeName;
					payee.bank = session.user.payeeBank;
					payee.account = session.user.payeeAccount;
				} else if (PAY_METHOD.CASH == payMethod) {
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
				if (currency && currency.exchangeRate) {
					current.entity.payee.exchangeRate = currency.exchangeRate;
					$scope.sum();
				}
			},
			/** 修改汇率 */
			changeExchangeRate: function() {
				var exchangeRate = current.entity.payee.exchangeRate || 1;
				current.entity.payee.exchangeRate = exchangeRate;
				$scope.sum();
			},

			/** 提交审批 */
			submit: function() {
				if (!current.entity.items || current.entity.items.length < 1) {
					alert(LocaleService.get('app.validator.required', LocaleService.get('application.items')));
					return;
				}
				current.entity.status = ProcessConstants.STATUS.SUBMIT;
				$scope.doSave();
			}
		}, options);
	};/* initSaveController end */
	
	
	var initAddController = function($scope, $injector, options) {
		var ProcessService = $injector.get("ProcessService");
		var ProcessConstants = $injector.get("ProcessConstants");
		var current = $scope.current;
		var session = $scope.session;
		ctrl.add($scope, $injector, initSaveController($scope, $injector, $.extend({
			/** add方法取得id后的回调 */
			add: function(id) {
				if (!id) return;
				current.entity = $.extend({
					id: id,
					isNew: true,
					status: ProcessConstants.STATUS.SAVE,	// 暂存数据
					previousStatus: ProcessConstants.STATUS.SAVE,	// 暂存数据
					amount: 0,
					amountTax: 0,
					amountCost: 0,
					expense: { company: session.user.company },
					payee: {
						type: ProcessConstants.PAYEE_TYPE.SELF,	// 收款方式默认为个人账户
						payMethod: ProcessConstants.PAY_METHOD.SELF,
						payBackAmount: 0,		// 还款金额,需要转换为currency的金额
						payAmount: 0,
						amount: 0,
						amountCost: 0,
						amountTax: 0,
						currency: $scope.app.currency,	// 默认币种为本位币
						exchangeRate: 1			// 汇率为1
					},
					user: session.user,
					creator: session.user,
					dept: session.user.dept,
					company: session.user.dept,
					submitTime: new Date(),
					createTime: new Date()
				}, $scope.getCurrentParams() || { });
				$scope.changePayMethod();
			}
		}, options)));
		// initSaveController($scope, $injector, options);
	};
	
	var initEditController = function($scope, $injector, options) {
		ctrl.edit($scope, $injector, initSaveController($scope, $injector, options));
	}
	return {
		init: ctrl.init,
		query: ctrl.query,
		view: ctrl.view,
		add: initAddController,
		edit: initEditController
	}
});