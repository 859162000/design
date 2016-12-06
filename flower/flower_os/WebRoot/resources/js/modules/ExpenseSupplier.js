(function(factory) {
	define("ExpenseSupplier", [ "angular", "jquery" ], function(ng, $) {
		return factory(ng, $);
	});
})(function(ng, $) {
	"use strict";
	/** 报销供应商的处理 */
	var init = function($scope, $rootScope, $window, $http, $timeout, ProcessService, DictionaryService, LocaleService) {
		var app = $rootScope.app; // config中配置的window.app
		var current = $rootScope.current;
		var session = $rootScope.session;
		$.extend($scope, {
			/** 
			 * 是否必须供应商.
			 * 报销时，根据预算科目判断是否需要录入采购方式,
			 * 最后根据采购方式判断是否需要选择系统中的供应商.
			 * 如果必须选择一个已存在的供应商或供应商必须入库关联，则此方法返回true
			 */
			mustSupplier: function() {
				return false;
			},
			/** 判断是否可手工添加供应商,当mustSupplier时才有效.如果为false，则只能选择系统内的合作供应商 */
			canAddSupplier: function() {
				return true;
			},
			/**
			 * 更改供应商
			 * @param supplier 选中的供应商，或者是空，表示删除选中的供应商
			 */
			changeSupplier: function(supplier) {
				current.entity.payee.supplier = supplier;
				if (!supplier) supplier = { };
				$.extend(current.entity.payee, {
					name: supplier.payeeName || supplier.name,
					account: supplier.payeeAccount,
					bank: supplier.payeeBank
				});
			}
		});
	};
	return {
		init : init
	};
});