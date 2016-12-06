(function(factory) {
	// 定义Dept模块
	define("Dept", [ "angular", "jquery" ], function(angular, $) {
		return factory(angular, $);
	});
})(function factory(angular, $) {	// 定义模块的函数
	"use strict";
	var namespace = "/system/dept";	// 此模块的namespace
	var all = {};	// 所有部门,主键为id
	var allCodes = { };	// 主键为code的部门
	/* ztree的默认设置,其他模块需要使用部门树的时候,需要通过DeptService.getTreeSetting得到树的设置 */
	function ztreeDefaultSetting(DeptService, params) {
		return {
			async: {
				url : '/system/dept/load.do' + (params ? params : ''),	// 加载部门的URL
				enable: true
			},
			callback: {
				onAsyncSuccess: function(event, treeId, treeNode, children) {
					// 用于将加载的dept数据注入到all中
					if (angular.isString(children)) {
						children = angular.fromJson(children);
					}
					// 注入数据到all中
					DeptService.put(children);
				}
			}
		}
	};
	
	/** 定义的service，会被注册为DeptService */
	var service = function($rootScope, $http, $q, $timeout) {
		var app = $rootScope.app;	// config中配置的window.app
		return {
			/** 构造此模块下的路径 */
			url: function(url) {
				if (url.charAt('0') != '/') return url;	// 相对路径
				return app.url(namespace + url);
			},
			/**
			 * 保存部门数据
			 * @param dept 要保存的部门数据，ID为null则表示新增，否则表示修改
			 */
			save: function(dept) {
				var deferred = $q.defer();
				var $this = this;
			   $http.post(this.url("/save.do"), { entity: dept }).success(function(dept) {
					$this.init(dept).then(function(dept) {
						deferred.resolve(dept);
					});
				});
				return deferred.promise;
			},
			
			/**
			 * 删除部门
			 * @param ids要删除的部门id数组
			 */
			remove: function(ids) {
				var deferred = $q.defer();
				$http.post(this.url("/remove.do"), {ids:ids} ).success(function(ids) {						
					deferred.resolve(ids);
				});
				return deferred.promise;
			},
			
			/**
			 * 读取id部门的数据,注意此方法返回一个promiss.then方法回调的参数是所有部门all
			 * @param id 要读取的id,可以为数组
			 * @param refresh 是否强制刷新数据
			 * @params useCode 表示是否使用code进行查询,如果为时,则表示ids参数为预算科目代码而不是id
			 */
			get: function(id, refresh, useCode) {
				var exists = true;
				var ids;
				var depts = useCode ? allCodes : all;
				if (angular.isArray(id)) {
					ids = [ ];
					angular.forEach(id, function(id) {
						if (!depts[ id ]) {	// 此部门尚未读取详细信息
							exists = false;
							ids.push(id);
						}
					});
				} else if (id) {
					ids = [ id ];
					exists = !!depts[ id ];
				}
				var deferred = $q.defer();
				if (!ids || !ids.length || (exists && !refresh)) {
					$timeout(function() { deferred.resolve(depts); }, 100);
				} else {
					var $this = this;
					var args = { };
					args[ useCode ? "codes" : "ids" ] = ids;
					$http.post($this.url('/get.do'), args).success(function(data) {
						$this.put(data);
						deferred.resolve(depts);
					});
				}
				return deferred.promise;
			},
			/** 所有缓存的部门数据 */
			all : all,
			/** 
			 * 添加一个部门数据
			 * @param dept 要添加的部门信息,可以为数组,忽略key参数
			 * @param key 主键,此参数应该省略,直接从dept.id中取得
			 */
			put: function(dept, key) {
				if (!dept) return;
				if (angular.isArray(dept)) {
					var $this = this;
					var depts = dept;
					angular.forEach(depts, function(dept) {
						// $this.put(dept);
						all[ dept.id ] = dept;	// 注入部门数据
						allCodes[ dept.code ] = dept;
					});
					return;
				}
				if (angular.isUndefined(key)) {
					key = dept.id;
				}
				all[ key ] = dept;	// 注入部门数据
				allCodes[ dept.code ] = dept;
			},
			
			/** 初始化dept,主要是初始化其parant和company */
			init: function(dept) {
				var deferred = $q.defer();
				var ids = [ ];
				if (dept.parent) ids.push(dept.parent.id);
				if (dept.company) ids.push(dept.company.id);
				if (dept.superior) ids.push(dept.superior.id);
				this.get(ids).then(function(all) {
					if (dept.parent) dept.parent = all[ dept.parent.id ];
					if (dept.company) dept.company = all[ dept.company.id ];
					if (dept.superior) dept.superior = all[ dept.superior.id ];
					deferred.resolve(dept);
				});
				return deferred.promise;
			},
			
			/** 
			 * 得到ztre的默认设置
			 * @param setting 需要合并的其他设置
			 */
			getTreeSeeting: function(setting) {
				var params = setting ? setting.params : null;
				if (params) {
					// URL查询参数,主要用于人员分配部门时只能选中有效的部门
					params = '?' + app.param(params);
				}
				return $.extend({ }, ztreeDefaultSetting(this, params), setting);
			}
		}
	}
	service.$inject = [ "$rootScope", "$http", "$q", "$timeout" ];
	service.$name = "DeptService"; // 可以省略，系统会默认以"模块名+Service"进行注册.如果此模块可能被其他模块依赖,则不能省略

	/** 定义的controller，会被注册为DeptController */
	var controller = function($scope, $rootScope, $window, DeptService, LocaleService) {
		var current = $rootScope.current;
		$.extend($scope, {
			deptsTree: {
				setting: DeptService.getTreeSeeting({
					check : { enable : true }
				})
			},
			parentSelector: {	// 上级机构选择对象
				// isOpen: true
				setting: DeptService.getTreeSeeting()
			},
			/** 新增 */
			add: function() {
				current.operator = "edit";
				current.entity = { 
					isNew: true,
					status: app.status.valid	// 新增数据默认为有效
				 };
			},
			
			view : function(dept) {
				current.operator = null;
				if (dept) current.entity = dept;
			},

			/** 查看后点编辑 */
			edit: function(dept) {
				current.operator = "edit";
				if (dept) current.entity = dept;
			},
			
			/** 取消新建/编辑操作，查看数据 */
			cancel: function() {
				current.operator = null;
				var node = $scope.deptsTree.tree.getSelectedNodes()[0];
				if (node) current.entity = node;
			},
			
			/** 保存数据 */
			save: function(dept) {
				// var message = "";
				if (!current.operator) return;
				var dept = dept || current.entity;
				var add = !dept.id;	// 是否新增
				DeptService.save(dept).then(function(dept) {
					alert(LocaleService.getText('app.save.success'));
					$scope.view(dept);
					var tree = $scope.deptsTree.tree;
					if (!dept.parent) {
						// 直接刷新根节点
						// message = LocaleService.getText('app.save.success');
						tree.reAsyncChildNodes(null, 'refresh');
					} else {
						// message = LocaleService.getText('app.update.success');
						// alert(message);
						var parentId = dept.parent.id;
						if (!add && dept.parent) {
							var id = dept.id;
							var node = tree.getNodeByParam("id", id);
							var parentNode = node.getParentNode();
							if (parentNode.id && parentNode.id != parentId) {
								// 刷新原来的父节点
								tree.reAsyncChildNodes(parentNode, 'refresh', true);
							}
						}
						parentNode = tree.getNodeByParam("id", parentId);
						// 刷新新的父节点
						tree.reAsyncChildNodes(parentNode, 'refresh');
					}
				});
			},
			
			/** 删除数据,delete为JavaScript的关键字，所以方法命名为remove
			 * @param depts Array/Object，要删除的部门数组或部门对象，可以省略，则表示删除当前dept 
			 */
			remove: function(depts) {
				if (!$window.confirm(LocaleService.getText("app.confirm.delete"))) return;
				if (!depts) depts = [ current.entity ];
				if (!angular.isArray(depts)) depts = [ depts ];
				var ids = [ ];
				var message = "";
				angular.forEach(depts, function(dept) {
					ids.push(dept.id);
				});
				if (ids.length < 1) {
					message = LocaleService.getText('app.delete.failure');
					alert(message);
					return;
				}
				DeptService.remove(ids).then(function(dept) {
					$scope.deptsTree.tree.reAsyncChildNodes(null, 'refresh');
					message = LocaleService.getText('app.delete.success');
					alert(message);
				});
			}
		});
	};
	controller.$inject = [ "$scope", "$rootScope", "$window", "DeptService", "LocaleService" ];
	controller.$name = "DeptController"; // 可以省略，系统会默认以"模块名+Service"进行注册.如果此模块可能被其他模块依赖,则不能省略

	var module = {
		// services: {	// 按照这种可以定义多个不同名称的service和controller
		//	DeptService: service
		// },
		service : service,
		controller : controller
	};
	return module;
});