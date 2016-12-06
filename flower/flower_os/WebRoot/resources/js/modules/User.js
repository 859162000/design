(function() {
"use strict";
function factory(angular, $) {
	var namespace = "/system/user";
	/** 定义的service，会被注册为DeptService */
	var service = function($rootScope, $http, $q, DeptService, RoleService) {
		var app = $rootScope.app;	// config中配置的window.app
		return {
			LOGON_MODE: {
				AD: '0',	// 通过AD登录
				PASSWORD: '1'	// 通过系统密码登录
			},
			/** 构造此模块下的路径 */
			url: function(url) {
				if (url.charAt('0') != '/') return url;	// 相对路径
				return app.url(namespace + url);
			},
			/**
			 * 查询方法
			 * @param params 查询条件,可以为null.不为null时,其中最好不要包含分页信息
			 * @param pageRequest 分页参数,至少包含pageNumber和pageSize两个字段,省略则视为不分页
			 */
			query: function(params, pageRequest) {
				var deferred = $q.defer();
				var args = $.extend({ }, params || { }, pageRequest || { });
				$http.post(this.url("/query.do"), args).success(function(page) {
					if (page.content) {	// 查询出的数据
						var deptIds = [ ];
						angular.forEach(page.content, function(user) {
							if (user.dept) deptIds.push(user.dept.id);
							if (user.company) deptIds.push(user.company.id);
						});
						DeptService.get(deptIds).then(function(depts) {
							angular.forEach(page.content, function(user) {
								user.dept = depts[ user.dept.id ];
								user.company = depts[ user.company.id ];
							});	
							deferred.resolve(page);		
						});
					} else {
						deferred.resolve(page);
					}
				});
				return deferred.promise;
			},
			/**
			 * 读取人员的详细信息,主要是需要读取人员的角色信息
			 * @param id
			 */
			get: function(id) {
				var deferred = $q.defer();
				var $this = this;
				$http.post(this.url("/get.do"), { id: id }).success(function(user) {
					if (!user) {
						deferred.reject(user);
						return;
					}
					$this.init(user).then(function(user) {
						deferred.resolve(user);
					});
				});
				return deferred.promise;
			},
			
			/** 初始化人员信息 */
			init: function(user) {
				var deferred = $q.defer();
				var deptIds = [ ];
				if (user.dept) deptIds.push(user.dept.id);
				if (user.company) deptIds.push(user.company.id);
				if (user.userRoles) {	// 角色的归属部门
					angular.forEach(user.userRoles, function(ur) {
						if (ur.dept) deptIds.push(ur.dept.id);
						if (ur.company) deptIds.push(ur.company.id);
					});
				}
				$q.all([ DeptService.get(deptIds), RoleService.all() ]).then(function(data) {
					var depts = data[0];
					var roles = data[1].map.roles;
					user.dept = depts[ user.dept.id ];
					user.company = depts[ user.company.id ];
					if (user.userRoles) {	// 角色的归属部门
						angular.forEach(user.userRoles, function(ur) {
							ur.dept = depts[ ur.dept.id ];
							ur.company = depts[ ur.company.id ];
							ur.role = roles[ ur.role.id ];
						});
					}
					deferred.resolve(user);
				});
				return deferred.promise;
			},
			/**
			 * 保存部门数据
			 * @param dept 要保存的部门数据，ID为null则表示新增，否则表示修改
			 */
			save: function(user) {
				var deferred = $q.defer();
				user = $.extend({ }, user);
				var userRoles = user.userRoles;
				var $this = this;
				$http.post(this.url("/save.do"), { entity: user, userRoles: userRoles }).success(function(user) {
					$this.init(user).then(function(user) {
						deferred.resolve(user);
					});
				});
				return deferred.promise;
			},
			
			/**
			 * 删除人员
			 * @param ids 要删除的人员id数组
			 */
			remove: function(ids) {
				var deferred = $q.defer();
				$http.post(this.url("/remove.do"), {ids:ids} ).success(function(ids) {						
					deferred.resolve(ids);
				});
				return deferred.promise;
			} 
		}
	}
	service.$inject = [ "$rootScope", "$http", "$q", "DeptService", "RoleService" ];
	service.$name = "UserService"; // 可以省略，系统会默认以"模块名+Service"进行注册.如果此模块可能被其他模块依赖,则不能省略

	/** 定义的controller，会被注册为DeptController */
	var controller = function($scope, $rootScope, $window, UserService, LocaleService, DeptService, RoleService) {
		var current = $rootScope.current;
		$.extend($scope, {
			checkedUsers: [ ],	// 人员列表中被选中的人员信息
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
						angular.forEach(current.params.depts, function(dept) {
							names.push(dept.name);
						});
						current.params.checkedNames = names.join(",");
					}
				})
			},
			/** 更改人员选中情况 */
			changeUserChecked: function() {
				
			},
			
			/**
			 * 查询方法
			 * @param params 查询条件,可以为null,则默认为rootScope.current.params
			 * @param pageRequest 分页参数,至少包含pageNumber和pageSize两个字段,可以省略则默认为rootScope.current.pageRequest
			 */
			query: function(params, pageRequest) {
				if (params) current.params = params;
				if (pageRequest) current.pageRequest = pageRequest;
				UserService.query(current.params, current.pageRequest).then(function(page) {
					current.page = page;
				});
				$scope.viewUser = null;
				current.operator = null;
			},
			
			/** 新增 */
			add: function() {
				current.entity = {
					status: app.status.valid,	// 默认为有效
					syncStatus: app.yes_no.yes,	// 1.是,0.否
					logonMode: UserService.LOGON_MODE.AD,	// 新账号默认通过AD登录
					payeeBank: "建设银行",		// 开户行默认为建设银行
					isNew: true	// 新增数据添加一个isNew的function
				};
				current.operator = "add";
			},
			
			/** 通过UserService.get人员信息后,查看人员 */
			doView: function(user) {
				current.entity = user;
				$scope.viewUser = user;
				current.operator = "view";
			},
			
			/** 查看 */
			view: function(user) {
				UserService.get(user.id).then(function(user) {
					$scope.doView(user);
				});
			},

			/** 通过UserService.get人员信息后,编辑人员 */
			doEdit: function(user) {
				$scope.viewUser = user;
				current.entity = $.extend(true, { }, user);
				current.operator = "edit";
			},
			
			/** 编辑 */
			edit: function(user) {
				if (user) {
					// 直接编辑人员
					UserService.get(user.id).then(function(user) {
						$scope.doEdit(user);
					});
				} else {
					// 通过view编辑人员
					$scope.doEdit(current.entity);
				}
			},
			
			/** 取消新建/编辑操作，查看数据 */
			cancel: function() {
				if (current.operator == "view") {
					current.operator = null;
				} else if ($scope.viewUser) {
					$scope.doView($scope.viewUser);
				} else {
					current.operator = null;
				}
			},
			
			/** 保存数据 */
			save: function(user, roles) {
				if (!current.operator) return;
				UserService.save(user || current.entity).then(function(entity) {
//					$.each(current.page.content, function(idx, user) {
//						if (entity.id !== user.id) return;
//						$.extend(user, entity);	// save后返回的数据应该是将dept/company/userRoles等数据已经初始化
//						return false;
//					});
					
					alert(LocaleService.getText('app.update.success'));
					// $scope.doView(entity);
					$scope.viewUser = entity;
					current.entity = $.extend(true, { }, entity);
				});
			},
			
			/** 删除数据,delete为JavaScript的关键字，所以方法命名为remove
			 * @param depts Array/Object，要删除的数组或对象，可以省略，则表示删除当前entity */
			remove: function(depts) {
				if (!$window.confirm(LocaleService.getText("app.confirm.delete"))) return;
				if (!depts) depts = [ current.entity ];
				if (!angular.isArray(depts)) depts = [ depts ];
				var ids = [ ];
				var message = "";
				angular.forEach(depts, function(dept) {
					ids.push(dept.id);
				});
				if (ids.length < 1){
					message = LocaleService.getText('app.delete.failure');
					alert(message);
					return;
				}
				UserService.remove(ids).then(function(dept) {
					alert(LocaleService.getText('app.delete.success'));
					$scope.query();
				});
			},
			
			/** 为user增加一个角色,默认其部门为user的归属部门 */
			addRole: function(user) {
				var roles = user.userRoles;
				if (!roles) user.userRoles = roles = [ ];
				roles.push({ dept: user.dept, company: user.company });
			},
			
			/** 删除user的一个角色 */
			removeRole: function(user, role) {
				var roles = user.userRoles;
				if (!roles) return;
				roles.remove(role);
			}
		});

		$scope.roles = [ { id: 0, name: 0 }];
		RoleService.all().then(function(data) {
			$scope.roles = data.valid;	// 进加载有效的角色
		});
	};
	controller.$inject = [ "$scope", "$rootScope", "$window", "UserService", "LocaleService", "DeptService", "RoleService" ];
	controller.$name = "UserController"; // 可以省略，系统会默认以"模块名+Controller"进行注册

	var module = {
		service : service,
		controller : controller
	};

	return module;
}

define("User", [ "angular", "jquery" ], function(angular, $) {
	return factory(angular, $);
});

})();