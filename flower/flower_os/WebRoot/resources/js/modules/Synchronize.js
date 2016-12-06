(function(factory) {
	// 定义Synchronize模块
	define("Synchronize", [ "angular", "jquery" ], function(angular, $) {
		return factory(angular, $);
	});
})(function factory(angular, $) {	// 定义模块的函数
	"use strict";
	var namespace = "/system/synchronize";	// 此模块的namespace
	var all = {};	// 所有部门,主键为id
	var allCodes = { };	// 主键为code的部门
	
	/** 定义的service，会被注册为SynchronizeService */
	var service = function($rootScope, $http, $q, $timeout) {
		var app = $rootScope.app;	// config中配置的window.app
		return {
			/** 构造此模块下的路径 */
			url: function(url) {
				if (url.charAt('0') != '/') return url;	// 相对路径
				return app.url(namespace + url);
			},
			
			/** synchronize */
			synchronize: function(name) {	//  /sap.do
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
	service.$name = "SynchronizeService"; // 可以省略，系统会默认以"模块名+Service"进行注册.如果此模块可能被其他模块依赖,则不能省略

	/** 定义的controller，会被注册为SynchronizeController */
	var controller = function($scope, $rootScope, $window, SynchronizeService, LocaleService) {
		var current = $rootScope.current;
		$.extend($scope, {
			
			/** ad */
			ad: function() {
				SynchronizeService.synchronize("/ad.do");
				current.operator = null; 
			},
			
			/** ad */
			sap: function() {
				SynchronizeService.synchronize("/sap.do");
				current.operator = null;
			},
			
			/** 银企接口:payFrom */
			payFrom: function() {
				SynchronizeService.synchronize("/payFrom.do");
				current.operator = null;
			} 
		});
	};
	controller.$inject = [ "$scope", "$rootScope", "$window", "SynchronizeService", "LocaleService" ];
	controller.$name = "SynchronizeController"; // 可以省略，系统会默认以"模块名+Service"进行注册.如果此模块可能被其他模块依赖,则不能省略

	var module = {
		service : service,
		controller : controller
	};
	return module;
});