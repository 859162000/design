(function(factory) {
	// 定义个人信息修改模块
	define("MeInfo", [ "angular", "jquery" ], function(angular, $) {
		return factory(angular, $);
	});
})(function factory(angular, $) {	// 定义模块的函数
	"use strict";
	var namespace = "/me";	// 此模块的namespace:/my/me
	var all = {};	// 所有部门,主键为id
	var allCodes = { };	// 主键为code的部门
	
	/** 定义的service，会被注册为MeInfoService */
	var service = function($rootScope, $http, $q, $timeout) {
		var app = $rootScope.app;	// config中配置的window.app
		return {
			/** 构造此模块下的路径 */
			url: function(url) {
				if (url.charAt('0') != '/') return url;	// 相对路径
				return app.url(namespace + url);
			},
			
			/** save */
			save: function(name, param) {	//  /sap.do
				var deferred = $q.defer();
				var $this = this; 
				var args = { 
						user:param
					};
				$http.post(this.url(name), args).success(function(entity) {
					if (entity) {
						console.log("success..." + entity);
						return;
					}
				});
				return deferred.promise; 
			},
			
			get: function(name, current) {	//  /sap.do
				var deferred = $q.defer();
				var $this = this;
				$http.post(this.url(name), {resultType: 'json'}).success(function(entity) {
					if (entity) {
						console.log("success..." + entity)
						current.entity = entity;
						return;
					}
				});
				return deferred.promise; 
			}
		}
	}
	service.$inject = [ "$rootScope", "$http", "$q", "$timeout" ];
	service.$name = "MeInfoService"; // 可以省略，系统会默认以"模块名+Service"进行注册.如果此模块可能被其他模块依赖,则不能省略

	/** 定义的controller，会被注册为MeInfoController */
	var controller = function($scope, $rootScope, $window, MeInfoService, LocaleService) {
		var current = $rootScope.current;
		MeInfoService.get("/me.do", current);// 异步调用先传递引用
		console.log("entity:" + current.entity);
		$.extend($scope, {
			
			/** save */
			saveEntity: function() {
				MeInfoService.save("/save.do", current.entity);
				current.operator = null; 
			}
		});
	};
	controller.$inject = [ "$scope", "$rootScope", "$window", "MeInfoService", "LocaleService" ];
	controller.$name = "MeInfoController"; // 可以省略，系统会默认以"模块名+Service"进行注册.如果此模块可能被其他模块依赖,则不能省略

	var module = {
		service : service,
		controller : controller
	};
	return module;
});