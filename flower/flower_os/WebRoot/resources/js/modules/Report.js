(function(factory) {
	// 定义Report模块
	define("Report", [ "angular", "jquery" ], function(angular, $) {
		return factory(angular, $);
	});
})(function factory(angular, $) {	// 定义模块的函数
	"use strict";
	var namespace = "/report/report";	// 此模块的namespace
	var all = {};	// 所有部门,主键为id
	var allCodes = { };	// 主键为code的部门
	
	/** 定义的service，会被注册为ReportService */
	var service = function($rootScope, $http, $q, $timeout) {
		var app = $rootScope.app;	// config中配置的window.app
		return {
			/** 构造此模块下的路径 */
			url: function(url) {
				if (url.charAt('0') != '/') return url;	// 相对路径
				return app.url(namespace + url);
			},
			
			/** 各种Report */
			purchaseReport: function(name) {	//  /purchase.do
				var deferred = $q.defer();
				var $this = this;
				$http.post(this.url(name)).success(function(obj) {
					if (obj) {
						console.log("success...")
						return;
					}
				});
				return deferred.promise; 
			}
			
			expenseReport: function(name) {	//  /expense.do
				var deferred = $q.defer();
				var $this = this;
				$http.post(this.url(name)).success(function(obj) {
					if (obj) {
						console.log("success...")
						return;
					}
				});
				return deferred.promise; 
			}
		}
	}
	service.$inject = [ "$rootScope", "$http", "$q", "$timeout" ];
	service.$name = "ReportService"; // 可以省略，系统会默认以"模块名+Service"进行注册.如果此模块可能被其他模块依赖,则不能省略

	/** 定义的controller，会被注册为ReportController */
	var controller = function($scope, $rootScope, $window, ReportService, LocaleService) {
		var current = $rootScope.current;
		$.extend($scope, {
			
			/** purchase */
			purchase: function() {
				ReportService.purchaseReport("/ad.do");
				current.operator = "purchaseReport"; 
			},
			
			/** expense */
			expense: function() {
				ReportService.expenseReport("/sap.do");
				current.operator = "expenseReport";
			} 
		});
	};
	controller.$inject = [ "$scope", "$rootScope", "$window", "ReportService", "LocaleService" ];
	controller.$name = "ReportController"; // 可以省略，系统会默认以"模块名+Service"进行注册.如果此模块可能被其他模块依赖,则不能省略

	var module = {
		service : service,
		controller : controller
	};
	return module;
});