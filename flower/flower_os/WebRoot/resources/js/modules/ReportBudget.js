(function(factory) {
	// 定义ReportBudget模块
	define("ReportBudget", [ "angular", "jquery" ], function(angular, $) {
		return factory(angular, $);
	});
})(function factory(angular, $) {	// 定义模块的函数
	"use strict";
	var namespace = "/report/budget";	// 此模块的namespace
	var all = {};	// 所有部门,主键为id
	var allCodes = { };	// 主键为code的部门
	
	/** 定义的service，会被注册为ReportBudgetService */
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
			
			/** ReportBudget */
			query: function(params, pageRequest) {	//  这里后台会返回数据:java格式为object[]或者String[]
				var deferred = $q.defer();
				var args = {
					type:"budget",
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
	service.$name = "ReportBudgetService"; // 可以省略，系统会默认以"模块名+Service"进行注册.如果此模块可能被其他模块依赖,则不能省略

	/** 定义的controller，会被注册为ReportBudgetController */
	var controller = function($scope, $rootScope, $window, ReportBudgetService, LocaleService) {
		var current = $rootScope.current;
		$.extend($scope, {
			
			/** 带参数查询 */
			query: function(params, pageRequest) {
				pageRequest = pageRequest || current.pageRequest;
				ReportBudgetService.query(params, pageRequest).then(function(page) {
					alert("then:" + page);
					current.page = page;
				});
				current.operator = null; 
			}
		});
	};
	controller.$inject = [ "$scope", "$rootScope", "$window", "ReportBudgetService", "LocaleService" ];
	controller.$name = "ReportBudgetController"; // 可以省略，系统会默认以"模块名+Service"进行注册.如果此模块可能被其他模块依赖,则不能省略

	var module = {
		service : service,
		controller : controller
	};
	return module;
});