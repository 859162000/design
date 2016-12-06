(function(factory) {
	define("BudgetQuery", [ "angular", "jquery" ], function(angular, $) {
		return factory(window.app, angular, $);
	});
})(function factory(app, angular, $) {
	"use strict";
	var namespace = "/budget/query";
	var LOAD_STATIC = "1";	// 静态加载
	var LOAD_DEFAULT = "0";	// 不会静态加载
	/** 定义的service，会被注册为BudgetQueryService */
	var service = function($rootScope, $http, $q, $timeout,DeptService) {
		var dicts = app.setting || { };	// 按type-code缓存的数据
		// var dictsMap = { };	// 按id缓存的参数
		var cachedType = { };	// 以缓存的type的所有配置
		return {
			cache: dicts,	// 缓存的数据
			/** 构造此模块下的路径 */
			url: function(url, ns) {
				if (url.charAt('0') != '/') return url;	// 相对路径
				if (!ns) ns = namespace;
				return app.url(ns + url);
			},
			/**
			 * 添加数据到缓存中
			 */
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
				// dictsMap[ data.id ] = data;
			},
			
			/** 得到当前菜单下的固定参数 */
			getCurrentParams: function() {
				return $rootScope.session.currentMenu ? $rootScope.session.currentMenu.params : null;
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
			 * 查询具体的参数
			 * @param type 参数类型,必须.如果想省略此参数,则应当使用query方法进行查询
			 * @param code 参数值,可以省略,则查询出所有type下的数据
			 * @param params 附加参数,如果未指定status,则默认会加上status=1的条件
			 */
			get: function(type, code, params) {
				var deferred = $q.defer();
				var args = { type: type, status: app.status.valid };	// 只查询有效的数据
				var typeDicts = dicts[ type ];
				if (code) {	// 读取缓存数据
					if (typeDicts) {
						var dict = typeDicts[ code ];
						if (dict) { // 数据已经存在
							$timeout(function() { deferred.resolve(dict); }, 100);
							return deferred.promise;
						}
					}
					args.code = code;
				} else if (cachedType[ type ]){
					$timeout(function() { deferred.resolve(typeDicts); }, 100);
					return deferred.promise;
				}
				// 如果未指定code则不读取缓存数据
				if (params) args = $.extend(args, params);
				var $this = this;
				$http.post(this.url("/get.do"), args).success(function(data) {
					$this.put(data);
					if (!code) {
						typeDicts = dicts[ type ];
						if (typeDicts) cachedType[ type ] = true;	// 表示此类型已经处理,下次不需要重新读取数据库
					}
					deferred.resolve(data);
				});
				return deferred.promise;
			},
			
			/** 加载静态数据 */
			loadStatic: function() {
				var deferred = $q.defer();
				var $this = this;
				$http.post(this.url("/loadStatic.do"), { loadType: "1" }).success(function(data) {
					$this.put(data);
					deferred.resolve(dicts);
				});
				return deferred.promise;
			}
		}
	}
	service.$inject = [ "$rootScope", "$http", "$q", "$timeout" ,"DeptService"];
	service.$name = "BudgetQueryService"; // 可以省略，系统会默认以"模块名+Service"进行注册.如果此模块可能被其他模块依赖,则不能省略

	/** 定义的controller，会被注册为BudgetQueryController */
	var controller = function($scope, $rootScope, $window, BudgetQueryService, LocaleService,DeptService) {
		var current = $rootScope.current;
		var session = $rootScope.session;
		$.extend($scope, {
			deptSelector: {		// 归属部门下拉菜单
				setting: DeptService.getTreeSeeting({ params: { status: '1' } })
			},
			queryDeptsSelector: {	// 查询条件中的部门选择对象
				checkedNames: "",
				setting: DeptService.getTreeSeeting({
					params: { status: '1' },	// 仅查询有效数据 
					check : { enable : true },	// 允许多选
					onCheck: function($scope, tree, treeNode, event) {	// 选中数据的回调
						var names = [];
						var ids = [];
						angular.forEach(current.params.depts, function(dept) {
							names.push(dept.name);
							ids.push(dept.id);
						});
						current.params.checkedNames = names.join(",");
						current.params.ids=ids.join(",");
					}
				})
			},
			/**
			 * 查询方法
			 * @param params 查询条件,可以为null,则默认为rootScope.current.params
			 * @param pageRequest 分页参数,至少包含pageNumber和pageSize两个字段,可以省略则默认为rootScope.current.pageRequest
			 */
			query: function(params, pageRequest) {
				params = params || current.params;
				pageRequest = pageRequest || current.pageRequest;
				params = $.extend(params || { }, BudgetQueryService.getCurrentParams() || { });
				BudgetQueryService.query(params, pageRequest, session.currentMenu.namespace).then(function(page) {
					current.page = page;
				});
				current.operator = null;
			},
			
			
			/** 查看 */
			view: function(budget) {
				current.operator = "view";
				current.entity = budget;
			},

			
			
			/** 取消新建/编辑操作，查看数据 */
			cancel: function() {
				if (current.operator == 'edit') {
					current.operator = 'view';
					$.each(current.page.content, function(idx, budget) {
						if (current.entity.id == user.id) {
							$scope.view(budget);
						}
					});
				} else if (current.operator == 'add') {
					current.operator = null;
				} else {
					current.operator = null;
				}
			},
		});
	};
	controller.$inject = [ "$scope", "$rootScope", "$window", "BudgetQueryService", "LocaleService","DeptService"];
	controller.$name = "BudgetQueryController"; // 可以省略，系统会默认以"模块名+Controller"进行注册

	var module = {
		service : service,
		controller : controller
	};

	return module;
});