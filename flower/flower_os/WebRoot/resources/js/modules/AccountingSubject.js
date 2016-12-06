(function() {
"use strict";
function factory(angular, $) {
	var namespace = "/setting/accountingSubject";
	/** 定义的service，会被注册为AccountingSubjectService */
	var service = function($rootScope, $http, $q, $timeout) {
		var app = $rootScope.app;	// config中配置的window.app
		var session = $rootScope.session;
		var dicts = { };	// 按type-code缓存的数据
		var cache = { };	// 按id缓存的参数
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
				
				var dict = dicts[ data.type ];
				if (!dict) dict = dicts[ data.type ] = { };
				dict[ data.code ] = data;
				cache[ data.id ] = data;
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
			 * 编辑时，检验code是否已经存在
			 */
			 testCode: function(params,code) {
					var deferred = $q.defer();
					var args = $.extend({code : code },params || { });
					var $this = this;
					$http.post(this.url("/testCode.do", namespace), args).success(function(list) {
						$this.put(list.content);
						deferred.resolve(list);
					});
					return deferred.promise;
				},
			/**
			 * 保存参数
			 * @param dept 要保存参数，ID为null则表示新增，否则表示修改
			 * @param ns 当前的namespace,主要于controller中传入
			 */
			save: function(accountingSubject, ns) {
				var deferred = $q.defer();
				var $this = this;
				$http.post(this.url("/save.do", ns), { entity: accountingSubject }).success(function(accountingSubject) {
					$this.put(accountingSubject);
					deferred.resolve(accountingSubject);
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
			}
		}
	}
	service.$inject = [ "$rootScope", "$http", "$q", "$timeout" ];
	service.$name = "AccountingSubjectService"; // 可以省略，系统会默认以"模块名+Service"进行注册.如果此模块可能被其他模块依赖,则不能省略

	/** 定义的controller，会被注册为AccountingSubjectController */
	var controller = function($scope, $rootScope, $window, AccountingSubjectService, LocaleService) {
		var current = $rootScope.current;
		var session = $rootScope.session;
		$.extend($scope, {
			
			/**
			 * 查询方法
			 * @param params 查询条件,可以为null,则默认为rootScope.current.params
			 * @param pageRequest 分页参数,至少包含pageNumber和pageSize两个字段,可以省略则默认为rootScope.current.pageRequest
			 */
			query: function(params, pageRequest) {
				params = params || current.params;
				pageRequest = pageRequest || current.pageRequest;
				params = $.extend(params || { }, AccountingSubjectService.getCurrentParams() || { });
				AccountingSubjectService.query(params, pageRequest, session.currentMenu.namespace).then(function(page) {
					current.page = page;
				});
				current.operator = null;
			},
			
			/** 新增 */
			add: function() {
				// 新增的数据loadType=0,loadType=1的数据一般都是通过后台配置的
				current.entity = $.extend({ isNew: true, loadType: '0',status: app.status.valid, }, AccountingSubjectService.getCurrentParams());
				current.operator = "add";
			},
			
			/** 查看 */
			view: function(accountingSubject) {
				current.operator = "view";
				current.entity = accountingSubject;
			},

			/** 编辑 */
			edit: function(accountingSubject) {
				current.operator = "edit";
				if (!accountingSubject) accountingSubject = current.entity;
				current.entity = $.extend({ }, accountingSubject);
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
			save: function(accountingSubject) {
				if (!current.operator) return;
				AccountingSubjectService.save(accountingSubject || current.entity, session.currentMenu.namespace).then(function(entity) {
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
			remove: function(accountingSubject) {
				if (!$window.confirm(LocaleService.getText("app.confirm.delete"))) return;
				if (!accountingSubject) accountingSubject = [ current.entity ];
				if (!angular.isArray(accountingSubject)) accountingSubject = [ accountingSubject ];
				var ids = [ ];
				
				var message = "";
				angular.forEach(accountingSubject, function(accountingSubject) {
					ids.push(accountingSubject.id);
				});
				if (ids.length < 1){
					message = LocaleService.getText('app.delete.failure');
					alert(message);
					return;
				}
				AccountingSubjectService.remove(ids, session.currentMenu.namespace).then(function(accountingSubject) {
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
				params = $.extend(params || { }, AccountingSubjectService.getCurrentParams() || { });
				if(current.entity.code == null || current.entity.code ==""){}
				else{
				AccountingSubjectService.testCode(params,current.entity.code).then(function(list) {
					if(list.length == 0){
					}
						else{
							var message = LocaleService.getText('app.code.exist');
							alert(message);
							current.entity.code = "";
							}
				});}
			},
		});
	};
	controller.$inject = [ "$scope", "$rootScope", "$window", "AccountingSubjectService", "LocaleService"];
	controller.$name = "AccountingSubjectController"; // 可以省略，系统会默认以"模块名+Controller"进行注册

	var module = {
		service : service,
		controller : controller
	};

	return module;
}

define("AccountingSubject", [ "angular", "jquery" ], function(angular, $) {
	return factory(angular, $);
});

})();