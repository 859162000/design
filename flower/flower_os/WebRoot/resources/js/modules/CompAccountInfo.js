(function() {
"use strict";
function factory(angular, $) {
	var namespace = "/setting/compAccountInfo";
	/** 定义的service，会被注册为CompAccountInfoService */
	var service = function($rootScope, $http, $q, $timeout) {
		var app = $rootScope.app;	// config中配置的window.app
		var session = $rootScope.session;
		var subjects = { };	// 按type缓存的数据,每个type是一个数组
		var cache = { };	// 按id缓存的参数
		var cacheCodes = { };	// 按code缓存的参数
		var cachedType = { };	// 以缓存的type的所有配置
		return {
			/** 构造此模块下的路径 */
			url: function(url, ns) {
				if (!ns) ns = namespace;
				if (url.charAt('0') != '/') return url;	// 相对路径
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
				
				var dict = subjects[ data.type ];
				if (!dict) dict = subjects[ data.type ] = [ ];
				dict.push(data);
				cache[ data.id ] = data;
				cacheCodes[ data.code ] = data;
			},
			
			/** 得到当前菜单下的固定参数 */
			getCurrentParams: function() {
				return session.currentMenu ? session.currentMenu.params : null;
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
			 * @param dept 要保存参数，ID为null则表示新增，否则表示修改
			 * @param ns 当前的namespace,主要于controller中传入
			 */
			save: function(budgetSubject, ns) {
				var deferred = $q.defer();
				var $this = this;
				$http.post(this.url("/save.do", ns), { entity: budgetSubject }).success(function(budgetSubject) {
					$this.put(budgetSubject);
					deferred.resolve(budgetSubject);
					
				});
				return deferred.promise;
			},
			/**
			 * 编辑时，检验code是否已经存在
			 */
			 testCode: function(params,id) {
					var deferred = $q.defer();
					var args = $.extend({id : id },params || { });
					var $this = this;
					$http.post(this.url("/testCode.do", namespace), args).success(function(list) {
						$this.put(list.content);
						deferred.resolve(list);
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
			 * 查询具体的参数
			 * @param ids 预算科目代码或id,可以省略,则查询出所有type下的数据
			 * @param type 类型,预算科目/费预算科目,省略则必须传入ids
			 * @param params 附加参数,如果未指定status,则默认会加上status=1的条件,
			 * 	参数useCode表示是否使用code进行查询,如果为时,则表示ids参数为预算科目代码而不是id
			 */
			get: function(ids, type, params) {
				var deferred = $q.defer();
				var args = { status: app.status.valid };	// 只查询有效的数据
				if (type) args.type = type;
				var exists = false;
				var useCode = false;
				if (type && !angular.isString(type)) {
					params = type; 
					type = null;
				}
				useCode = params && !!params.useCode;	// 使用code进行的查询
				var map = useCode ? cacheCodes : cache; 
				if (ids) {	// 读取缓存数据
					exists = true;
					$.each(ids, function(idx, id) {
						if (!map[ id ]) {
							exists = false;
							return false;
						}
						// list.push( subjects[ id ] );
					});

					args[ useCode ? "codes" : "ids" ] = ids;
				} else if (type && cachedType[ type ]) {
					// list = subjects[ type ];
					exists = true;
				}
				if (exists) {
					$timeout(function() { deferred.resolve(map); }, 100);
					return deferred.promise;
				}
				
				if (params) args = $.extend(args, params);
				
				var $this = this;
				$http.post(this.url("/get.do"), args).success(function(data) {
					$this.put(data);
					if (type) {
						var tmp = subjects[ type ];
						if (tmp) cachedType[ type ] = true;	// 表示此类型已经处理,下次不需要重新读取数据库
					}
					deferred.resolve(map);
				});
				return deferred.promise;
			}
		}
	}
	service.$inject = [ "$rootScope", "$http", "$q", "$timeout" ];
	service.$name = "CompAccountInfoService"; // 可以省略，系统会默认以"模块名+Service"进行注册.如果此模块可能被其他模块依赖,则不能省略

	/** 定义的controller，会被注册为CompAccountInfoController */
	var controller = function($scope, $rootScope, $window, CompAccountInfoService,DeptService, LocaleService) {
		var current = $rootScope.current;
		var session = $rootScope.session;
		$.extend($scope, {

			deptSelector: {		// 归属部门下拉菜单
				setting: DeptService.getTreeSeeting({ entity: { status: '1' } })
			},
			queryDeptsSelector: {	// 查询条件中的部门选择对象
				checkedNames: "",
				depts: [],
				setting: DeptService.getTreeSeeting({
					entity: { status: '1' },	// 仅查询有效数据 
					check : { enable : true },	// 允许多选
					onCheck: function($scope, tree, treeNode, event) {	// 选中数据的回调
						var name = "";
						var id = "";
						angular.forEach($scope.queryDeptsSelector.depts, function(dept) {
							id =dept.id;
							name =dept.name;
						});
						$scope.queryDeptsSelector.checkedNames = name;
						current.entity.company= {id:id};
						current.entity.remarks = name;//name暂时只能放在remarks里面了
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
				params = $.extend(params || { }, CompAccountInfoService.getCurrentParams() || { });
				CompAccountInfoService.query(params, pageRequest, session.currentMenu.namespace).then(function(page) {
					current.page = page;
				});
				current.operator = null;
			},
			
			/** 新增 */
			add: function() {
				// 新增的数据loadType=0,loadType=1的数据一般都是通过后台配置的
				current.entity = $.extend({ isNew: true, status: app.status.valid, }, CompAccountInfoService.getCurrentParams());
				current.operator = "add";
			},
			
			/** 查看 */
			view: function(budgetSubject) {
				current.operator = "view";
				current.entity = budgetSubject;
			},

			/** 编辑 */
			edit: function(budgetSubject) {
				current.operator = "edit";
				if (!budgetSubject) budgetSubject = current.entity;
				current.entity = $.extend({ }, budgetSubject);
				$scope.queryDeptsSelector.checkedNames = current.entity.remarks;
			},
			
			/** 取消新建/编辑操作，查看数据 */
			cancel: function() {
				if (current.operator == 'edit') {
					current.operator = 'view';
					$.each(current.page.content, function(idx, user) {
						if (current.entity.id == user.id) {
							$scope.view(user);
						}
					});
				} else if (current.operator == 'add') {
					current.operator = null;
				} else {
					current.operator = null;
				}
			},
			
			/** 保存数据 */
			save: function(budgetSubject) {
				if (!current.operator) return;
				CompAccountInfoService.save(budgetSubject || current.entity, session.currentMenu.namespace).then(function(entity) {
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
			remove: function(budgetSubject) {
				if (!$window.confirm(LocaleService.getText("app.confirm.delete"))) return;
				if (!budgetSubject) budgetSubject = [ current.entity ];
				if (!angular.isArray(budgetSubject)) budgetSubject = [ budgetSubject ];
				var ids = [ ];
				
				var message = "";
				angular.forEach(budgetSubject, function(budgetSubject) {
					ids.push(budgetSubject.id);
				});
				if (ids.length < 1){
					message = LocaleService.getText('app.delete.failure');
					alert(message);
					return;
				}
				CompAccountInfoService.remove(ids, session.currentMenu.namespace).then(function(budgetSubject) {
					message = LocaleService.getText('app.delete.success');
					alert(message);
					$scope.query();
				});
			},
			/**
			 * 编辑时，检验code是否已经存在
			 */
			testCode: function(params) {
				params = params || current.params;
				params = $.extend(params || { }, CompAccountInfoService.getCurrentParams() || { });
				if(current.entity.id == null || current.entity.id ==""){}
				else{
				CompAccountInfoService.testCode(params,current.entity.id).then(function(list) {
					if(list.length == 0){
					}
						else{
							var message = LocaleService.getText('app.code.exist');
							alert(message);
							current.entity.id = "";
							}
				});}
			},
		});
	};
	controller.$inject = [ "$scope", "$rootScope", "$window", "CompAccountInfoService","DeptService", "LocaleService"];
	controller.$name = "CompAccountInfoController"; // 可以省略，系统会默认以"模块名+Controller"进行注册

	var module = {
		service : service,
		controller : controller
	};

	return module;
}

define("CompAccountInfo", [ "angular", "jquery" ], function(angular, $) {
	return factory(angular, $);
});

})();