(function(factory) {
	// 定义ReportPurchase模块
	define("ReportPurchase", [ "angular", "jquery" ], function(angular, $) {
		return factory(angular, $);
	});
})(function factory(angular, $) {	// 定义模块的函数
	"use strict";
	var namespace = "/report/purchase";	// 此模块的namespace
	var all = {};	// 所有部门,主键为id
	var allCodes = { };	// 主键为code的部门
	
	/** 定义的service，会被注册为ReportPurchaseService */
	var service = function($rootScope, $http, $q, $timeout) {
		var dicts = { };	// 按type-code缓存的数据
		var app = $rootScope.app;	// config中配置的window.app
		return {
			cache: dicts,	// 缓存的数据
			/** 构造此模块下的路径 */ 
			url: function(url, ns) {
				if (url.charAt('0') != '/') return url;	// 相对路径
				if (!ns) ns = namespace;
				return app.url(ns + url);
			},
			
			put: function(data) {
				console.log("putz.data:" + data);
				if (!data) return;
				if (angular.isArray(data)) {
					var $this = this;
					angular.forEach(data, function(dict) {
						$this.put(dict);
					});
					return;
				}
				
				var dict = dicts[ data.type ];
				if (!dict) dict = dicts[ data.type ] = { };
				dict[ data.code ] = data;
				// dictsMap[ data.id ] = data;
			},
			
			/** ReportPurchase */
			query: function(params, pageRequest) {	//  这里后台会返回数据:java格式为object[]或者String[]
				var deferred = $q.defer();
				var args = {
					type:"purchase",
					params:"",
					pageNumber: pageRequest.pageNumber,
					pageSize: pageRequest.pageSize
				};
				var $this = this; 
				console.log("pageRequest:" + pageRequest.pageSize);
				$http.post(this.url("/query.do"), args).success(function(list) {
						$this.put(list);
						deferred.resolve(list);
					});
				return deferred.promise; 
			}
		}
	}
	service.$inject = [ "$rootScope", "$http", "$q", "$timeout" ];
	service.$name = "ReportPurchaseService"; // 可以省略，系统会默认以"模块名+Service"进行注册.如果此模块可能被其他模块依赖,则不能省略

	/** 定义的controller，会被注册为ReportPurchaseController */
	var controller = function($scope, $rootScope, $window, ReportPurchaseService, LocaleService) {
		var current = $rootScope.current;
		$.extend($scope, {
			
			/** 带参数查询 */
			query: function(params, pageRequest) {
				pageRequest = pageRequest || current.pageRequest;
				ReportPurchaseService.query(params, pageRequest).then(function(page) {
					alert("then:" + page);
					current.page = page;
				});
				current.operator = null; 
			}
		});
	};
	controller.$inject = [ "$scope", "$rootScope", "$window", "ReportPurchaseService", "LocaleService" ];
	controller.$name = "ReportPurchaseController"; // 可以省略，系统会默认以"模块名+Service"进行注册.如果此模块可能被其他模块依赖,则不能省略

	var module = {
		service : service,
		controller : controller
	};
	return module;
});