(function(factory) {
	define("AccountingPeriod", [ "angular", "jquery" ], function(angular, $) {
		return factory(window.app, angular, $);
	});
})(function factory(app, angular, $) {
	"use strict";
	var namespace = "/setting/accountingPeriod";
	/** 定义的service，会被注册为AccountingPeriod */
	var service = function($rootScope, $http, $q, $timeout) {
		var dicts = { };	// 按type-code缓存的数据
		var cache = { };	// 按id缓存的参数
		var cachedType = { };	// 以缓存的type的所有配置
		return {
			cache: dicts,	// 缓存的数据
			/** 构造此模块下的路径 */
			url: function(url, ns) {
				if (url.charAt('0') != '/') return url;	// 相对路径
				if (!ns) ns = namespace;
				return app.url(ns + url);
			},
			/** 添加数据到缓存中 */
			put: function(data) {
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
				cache[ data.id ] = data;
			},
			
			/**
			 * 查询方法
			 * @param params 查询条件,可以为null.不为null时,其中最好不要包含分页信息
			 * @param pageRequest 分页参数,至少包含pageNumber和pageSize两个字段,省略则视为不分页
			 * @param ns 当前的namespace,主要用于controller中传入
			 */
			query: function(params, pageRequest, ns) {
				var deferred = $q.defer();
				var args = $.extend({ }, params || { }, pageRequest || { });
				var $this = this;
				$http.post(this.url("/query.do", ns), args).success(function(page) {
					$this.put(page.content);
					deferred.resolve(page);
				});
				return deferred.promise;
			},
			
			/**
			 * 保存参数
			 */
			save: function(entity) {
				var deferred = $q.defer();
				var months = entity.months;
				entity = $.extend({ }, entity);
				entity.months = null;
				$http.post(this.url("/save.do"),{ entity: entity, months: months }).success(function(entity) {
					deferred.resolve(entity);
				});
				return deferred.promise;
			},
			
			/**
			 * 删除参数
			 * @param ids 要删除的id数组
			 * @param ns 当前的namespace,主要用于controller中传入
			 */
			remove: function(ids, ns) {
				var deferred = $q.defer();
				$http.post(this.url("/remove.do", ns), { ids: ids } ).success(function(ids) {
					deferred.resolve(ids);
				});
				return deferred.promise;
			},
			
			/** 
			 * 查询具体的年份信息
			 * id: 年份
			 */
			get: function(id) {
				var deferred = $q.defer();
				var $this = this;
				$http.post(this.url("/get.do"), { id: id }).success(function(ap) {
					deferred.resolve(ap);
				});
				return deferred.promise;
			}
		}
	}
	service.$inject = [ "$rootScope", "$http", "$q", "$timeout" ];
	service.$name = "AccountingPeriodService"; // 可以省略，系统会默认以"模块名+Service"进行注册.如果此模块可能被其他模块依赖,则不能省略

	/** 定义的controller，会被注册为AccountingPeriodController */
	var controller = function($scope, $rootScope, $window, AccountingPeriodService, LocaleService,$filter) {
		var current = $rootScope.current;
		var session = $rootScope.session;
		current.pageRequest.pageSize = 12;	// 默认为12行
		$.extend($scope, {
			
			/**
			 * 查询方法
			 * @param params 查询条件,可以为null,则默认为rootScope.current.params
			 * @param pageRequest 分页参数,至少包含pageNumber和pageSize两个字段,可以省略则默认为rootScope.current.pageRequest
			 */
			query: function(params, pageRequest) {
				params = params || current.params;
				pageRequest = pageRequest || current.pageRequest;
				params = $.extend(params || { });
				AccountingPeriodService.query(params, pageRequest).then(function(page) {
					current.page = page;
				});
				current.operator = null;
			},
			
			/** 新增 */
			add: function() {
				var months = [ ];
				for (var m = 1; m <= 12; m++) {
					months.push({
						month: m
					});
				}
				current.entity = $.extend({
					isNew: true, 
					id: "",
					status: app.status.valid,
					months: months
				});
				current.operator = "add";
			},
			
			/** 查看 */
			view: function(year) {
				AccountingPeriodService.get(year).then(function(entity) {
					current.entity = entity;
					current.operator = "view";
				});
			},

		
			/** 编辑 */
			edit: function(id) {
				if (id) {
					AccountingPeriodService.get(id).then(function(entity) {
						current.entity = entity;
						current.operator = "edit";
					});
				} else {
					current.operator = "edit";
				}
			},
			
			
			/** 取消新建/编辑操作，查看数据 */
			cancel: function() {
				if (current.operator == 'edit') {
					current.operator = null;
				} else if (current.operator == 'add') {
					current.operator = null;
				} else {
					current.operator = null;
				}
			},

			/** 保存数据 */
			save: function() {
				if (!current.operator) return;
				AccountingPeriodService.save(current.entity).then(function(entity) {
					if(entity.id != null){
						var message =  LocaleService.getText('app.save.success');
						alert(message);}
						else{
							var message =  LocaleService.getText('app.save.failure');
							alert(message);
							}
						//view(entity);
						current.operator = "view";
						$scope.query();
				});
			},
			
			/** 
			 * 删除数据,delete为JavaScript的关键字，所以方法命名为remove
			 * @param depts Array/Object，要删除的数组或对象，可以省略，则表示删除当前dept 
			 */
			remove: function(accountingPeriod) {
				if (!$window.confirm(LocaleService.getText("app.confirm.delete"))) return;
				if (!accountingPeriod) accountingPeriod = [ current.entity ];
				if (!angular.isArray(accountingPeriod)) accountingPeriod = [ accountingPeriod ];
				var ids = [ ];
				
				var message = "";
				angular.forEach(accountingPeriod, function(accountingPeriod) {
					ids.push(accountingPeriod.id);
				});
				if (ids.length < 1){
					message = LocaleService.getText('app.delete.failure');
					alert(message);
					return;
				}
				AccountingPeriodService.remove(ids, session.currentMenu.namespace).then(function(accountingPeriod) {
					message = LocaleService.getText('app.delete.success');
					alert(message);
					$scope.query();
				});
			},
			
			/** 自动设置每月的月结日 */
			auotSetMonth: function() {
				var endDate = 25;	// 默认25日为月结日
				var year = current.entity.id;
				if (!year) return;
				angular.forEach(current.entity.months, function(m, month) {
					var date = new Date(year, month, endDate);
					var day = date.getDay();
					switch(day) {
					case 0: // 25为周日,延后一天
						date.setDate(endDate + 1);
						break;
					case 6:	// 25为周六,提前1天
						date.setDate(endDate - 1);
						break;
					}
					m.endDate = date;
				});
			}
		});
	};
	controller.$inject = [ "$scope", "$rootScope", "$window", "AccountingPeriodService", "LocaleService"];
	controller.$name = "AccountingPeriodController"; // 可以省略，系统会默认以"模块名+Controller"进行注册

	var module = {
		service : service,
		controller : controller
	};

	return module;
});