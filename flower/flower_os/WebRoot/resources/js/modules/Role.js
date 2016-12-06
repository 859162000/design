(function(factory) {

	define("Role", [ "angular", "jquery", "PermissionLv" ], function(angular, $, PermissionLv) {
		return factory(angular, $, PermissionLv);
	});

})(function factory(angular, $, PermissionLv) {
	"use strict";
	var namespace = "/system/role"; // 此模块的namespace

	var ROLES = {}; // 所有角色JSON,id为角色代码的小写
	var MENUS = {}; // 所有菜单JSON
	
	/** 定义的service，会被注册为RoleService */
	var service = function($rootScope, $http, $q, $timeout, LocaleService) {
		var app = $rootScope.app; // config中配置的window.app

		/** 初始化menu节点数据 */
		function initMenuNode(menu) {
			menu.treeNodeId = "menuTreeNode" + menu.id;	// 为树节点建立唯一id,不直接使用id是防止和action的id重复
			menu.options = menu.options || {};
			menu.isMenu = true;
			menu.open = true; // 默认打开
			menu.children = null;
			// menu.menuActions = null;
			menu.actions = null;
			menu.i18nKey = menu.i18nKey || menu.name;
			menu.html = LocaleService.get(menu.i18nKey) || menu.name;
		}

		/** 初始化action节点数据 */
		function initActionNode(action) {
			action.treeNodeId = "actionTreeNode" + action.id;	// 为树节点建立唯一id,不直接使用id是防止和menu的id重复
			action.options = action.options || {};
			action.isAction = true; // 表示此为菜单下的action
			action.open = true; // 默认打开
			action.i18nKey = action.i18nKey || action.name;
			var permissionScope = action.permissionScope;
			var html = "";
			for (var lvName in PermissionLv) {
				// if (lv == PermissionLv.MIN) continue; // 不需要操作的权限
				var lv = PermissionLv[lvName];
				// console.log('permissionScope=' + permissionScope);
				// console.log('lv.lv=' + lv.lv);
				// console.log('&=' + (permissionScope & lv.lv));
				var ps = permissionScope;
				ps &= lv.lv;
				if (ps == PermissionLv.MIN.lv) continue; // 没有权限
				html += '<label><input type="checkbox" value="' + lv.lv 
					+ '" lv="' + lvName + '" />' 
					+ LocaleService.getText(lv.text) + '</label>';
				// permissionCount++;
			}
			// if (permissionCount > 1) {
			html = "<span>" + (LocaleService.get(action.i18nKey) || action.name) + "</span></a>" + html + "<a>";
			// } else {
			// html = "<span>" + LocaleService.getText(action.options.textKey || action.name) + "</span></a>" +
			// html.replace('<input type="checkbox" ', '<input type="checkbox" checked disabled ') + "<a>";
			// }
			action.html = html;
		}
		return {
			/** 构造此模块下的路径 */
			url : function(url) {
				if (url.charAt('0') != '/') return url; // 相对路径
				return app.url(namespace + url);
			},
			/** 全部角色数组 */
			roles : null,
			/** 有效的角色数组 */
			valid : null,
			/** 全部根菜单数组,子菜单在每个菜单的children中 */
			menus : null,
			/** 增加/修改一个角色数据,并返回增加的角色对象 */
			put : function(role) {
				var id = role.id.toLowerCase();
				var old = ROLES[ id ];
				if (!old) {
					// 新节点
					this.roles.push(role);
					ROLES[ id ] = role;
					ROLES[ role.id ] = role;
					old = role;
				} else {
					// 修改原来节点的数据
					$.extend(old, role);
				}
				old.html = old.name + '(' + old.id + ')';
				return old;
			},
			/** 加载所有角色,菜单信息 */
			all : function(refresh) {
				var deferred = $q.defer();
				var $this = this;
				var resolve = function() {
					deferred.resolve({
						roles : $this.roles,
						valid: $this.valid,
						menus : $this.menus,
						map : {
							roles : ROLES,
							menus : MENUS
						}
					});
				};
				if (this.roles && !refresh) {
					$timeout(resolve, 100);
				} else {
					$http.post(this.url('/load.do')).success(function(data) {
						if (!data) {
							deferred.reject(data);
							return;
						}
						var valid = [ ];	// 有效的角色
						angular.forEach(data.roles, function(role) {
							role.html = role.name + '(' + role.id + ')';
							ROLES[ role.id.toLowerCase() ] = role;
							ROLES[ role.id ] = role;
							if (app.status.valid == role.status) {
								valid.push(role);
							}
						});
						$this.roles = data.roles;
						$this.valid = valid;
						$this.menus = [];						
						angular.forEach(data.menus, function(menu) {
							initMenuNode(menu);
							MENUS[menu.id] = menu;
						});

						angular.forEach(data.menus, function(menu) {
							if (!menu.parent) { // 根菜单节点
								$this.menus.push(menu);
								return;
							}
							var parent = MENUS[menu.parent.id];
							if (parent) {
								if (!parent.children) parent.children = [];
								parent.children.push(menu);
							}
						});

						angular.forEach(data.actions, function(action) {
							var menu = MENUS[action.menu.id]
							if (!menu) return;
							initActionNode(action);
							if (!menu.actions) menu.actions = [];
							menu.actions.push(action);
							if (!menu.children) menu.children = [];
							menu.children.push(action);

						});
						resolve();
					});
				}
				return deferred.promise;
			},
			
			/** 判断缓存中是否存在id,没有则返回false,否则返回存在的角色信息 */
			exists: function(id) {
				id = id.toLowerCase();
				return ROLES[ id ] || false;
			},
			
			/** 得到角色的详细信息,主要包括权限的详细信息 */
			get: function(id, refresh) {
				var deferred = $q.defer();
				var $this = this;
				var role = this.exists( id );
				var initialized = role && role.initialized;
				if (initialized) {
					deferred.resolve($.extend({ }, role));
				} else {
					$http.post(this.url('/get.do'), { id: id }).success(function(data) {
						if (data && !data.error) {
							role = $this.put(data);
							role.initialized = true;
							deferred.resolve(data);
						} else {
							deferred.reject(data);
						}
					});
				}
				return deferred.promise;
			},
			
			/** 
			 * 保存角色信息
			 * @param role 角色基本信息
			 * @param permissions 角色的权限信息
			 */
			save: function(role, permissions) {
				var deferred = $q.defer();
				var $this = this;
				$http.post(this.url('/save.do'), { entity: role, permissions: permissions }).success(function(data) {
					if (data && !data.error) {
						var role = $this.put(data);
						role.initialized = true;
						deferred.resolve(role);
					} else {
						deferred.reject(data);
					}
				});
				return deferred.promise;
			},
			
			/**
			 * 删除
			 * @param ids 要删除的id数组
			 */
			remove: function(ids) {
				var deferred = $q.defer();
				$http.post(this.url("/remove.do"), { ids: ids } ).success(function(count) {						
					deferred.resolve(count);
				});
				return deferred.promise;
			} 
		}
	}
	service.$inject = [ "$rootScope", "$http", "$q", "$timeout", "LocaleService" ];
	service.$name = "RoleService"; // 可以省略，系统会默认以"模块名+Service"进行注册.如果此模块可能被其他模块依赖,则不能省略

	var controller = function($scope, $rootScope, $window, RoleService, LocaleService) {
		var app = $rootScope.app; // config中配置的window.app
		var current = $rootScope.current;
		var permissionSelector = ">label :checkbox"; 
		$.extend($scope, {
			roles : [], // 角色
			menus : [], // 菜单,根菜单
			menusTree : { // 菜单树选择对象
				setting : {
					check : {
						enable : true,
						autoCheckTrigger: true,
						chkboxType : {
							Y : "ps",
							N : "ps"
						}
					},
					view : {
						nameIsHTML : true, // name显示为html
						showTitle : false
					},
					data : {
						key : {
							name : "html"
						}
					},
					callback : {
						onNodeCreated : function(event, treeId, treeNode) {
							// 节点创建后为权限选择框绑定事件
							var checkbox = $(permissionSelector, "li#" + treeNode.tId);
							if (checkbox.length > 0) {
								var tree = $.fn.zTree.getZTreeObj(treeId);
								checkbox.click((function(node, tree, checkbox) {
									return function() {
										if (this.checked && !node.checked) {	// 未选中,则需要选中
											tree.checkNode(node, true, true, true);
										} else if (!this.checked && node.checked) {	// 已选中,则需要取消
											if (checkbox.filter(':checked').length < 1) {
												tree.checkNode(node, false, true, true);
											}
										}
									}
								})(treeNode, tree, checkbox));
							}
						}
					},
					/** click节点后的回调函数 */
					onClick : function($scope, tree, treeNode, event, clickFlag) {
						tree.checkNode(treeNode, null, true, true);
					},
					/** 选中节点后的回调函数 */
					onCheck : function($scope, tree, treeNode, event) {
						// 选中节点如果没有勾选任何权限,则默认勾选第一个权限
						var checked = treeNode.checked;
						if (checked) {
							// var li = "li#" + treeNode.tId;
							var checkbox = $(permissionSelector, "li#" + treeNode.tId);
							if (checkbox.length > 0 && checkbox.filter(':checked').length < 1) {
								// 选中第一个
								$(checkbox[0]).prop('checked', true);
							}
						}
					}
				},
				
				/** 设置权限数据 */
				setPermissions: function(permissions) {
					var tree = $scope.menusTree.tree;
					tree.clearChecked();
					var checkbox = $(permissionSelector, "ul#" + tree.setting.treeId + " li");
					checkbox.prop("checked", false);	// 清空选中的数据
					if (!permissions || !permissions.length) return;
					// 根据权限选中节点
					angular.forEach(permissions, function(permission) {
						if (permission.lv <= PermissionLv.MIN.lv) return;
						var node = tree.getNodeByParam("treeNodeId", "menuTreeNode" + permission.menu.id);
						if (!node) return;		// 没有此菜单
						if (!node.checked) {	// 选中此菜单节点
							tree.checkNode(node, true);
						}
						var action = permission.menuAction;
						if (!action) return;	// 不是action的权限
						
						// 对action节点的操作
						var node = tree.getNodeByParam("treeNodeId", "actionTreeNode" + action.id);
						if (!node) return;		// 没有此菜单
						if (!node.checked) {	// 选中此菜单节点
							tree.checkNode(node, true);
						}

						var checkbox = $(permissionSelector, "li#" + node.tId);
						var permissionLv = permission.lv;
						if (permissionLv > PermissionLv.MAX.lv) {
							permissionLv = PermissionLv.MAX.lv;
						}
						for (var lvName in PermissionLv) {
							var lv = PermissionLv[lvName];
							var ps = permissionLv;
							ps &= lv.lv;
							if (ps == PermissionLv.MIN.lv) continue; // 没有权限
							checkbox.filter('[lv="' + lvName + '"]').prop("checked", true);
						}
					});
				},
				/** 得到选择的权限数据 */
				getPermissions : function() {
					var permissions = [];
					var tree = $scope.menusTree.tree;
					var nodes = tree.getCheckedNodes();
					angular.forEach(nodes, function(node) {
						if (node.isMenu) { // 此节点仅为菜单项
							var permission = {
								lv : PermissionLv.SELF.lv,
								menu : {
									id : node.id
								}
							};
							permissions.push(permission);
							return;
						}
						// 以下为menuAction的处理
						var permission = {
							menu : {
								id : node.menu.id
							},
							menuAction : {
								id : node.id
							}
						};
						var lv = PermissionLv.MIN.lv;
						// 查找选中的权限lv
						var checkbox = $(permissionSelector, "li#" + node.tId);
						checkbox.each(function() {
							lv |= parseInt(this.value);
						});
						if (lv <= PermissionLv.MIN.lv) return;
						if (lv > PermissionLv.MAX.lv) {
							lv = PermissionLv.MAX.lv;
						}
						permission.lv = lv;
						permissions.push(permission);
					});
					return permissions;
				}
			},
			rolesTree : {
				/** 重新加载数据 */
				refresh : function() {
					RoleService.all(true).then(function(data) {
						$scope.roles = data.roles;
						$scope.menus = data.menus;
					});
				},

				setting : {
					check : {
						enable : true
					},
					data : {
						key : {
							name : "html"
						}
					},
					view : {
						showIcon : false,
						showLine : false
					},
					/** click节点后的回调函数 */
					onClick : function($scope, tree, treeNode, event, clickFlag) {
						$scope.edit(treeNode);
					},
				}
			},

			/** 新建 */
			add : function() {
				current.entity = {
					isNew: true,
					status: app.status.valid	// 新增数据默认为有效
				};
				$scope.menusTree.setPermissions(null);
			},

			/** 编辑 */
			edit : function(role) {
				RoleService.get(role.id).then(function(role) {
					current.entity = role;
					$scope.menusTree.setPermissions(role.permissions);
				});
			},

			/** entity是否可以新增 */
			validateSave: function(entity) {
				var flag = !!(entity && entity.id && !(entity.isNew && RoleService.exists(entity.id)));
				return flag;
			},
			/** 保存数据 */
			save : function() {
				var add = current.entity.isNew; // 判断是否新增数据
//				if (add && ROLES[ current.entity.id ]) {
//					// id已存在,不允许新增
//					alert(LocaleService.getText('app.exists', 'system.role.id', current.entity.id));
//					return false;
//				}
				var permissions = $scope.menusTree.getPermissions();
				RoleService.save(current.entity, permissions).then(function(role) {
					// RoleService.put(role);
					alert(LocaleService.getText('app.save.success'));
					if (add) { // 新增节点
						$scope.roles.push(role);
						$scope.rolesTree.tree.addNodes(null, role);
					} else { // 修改数据
						var tId = current.entity.tId; // 修改时,原来节点的tId;
						var node = $scope.rolesTree.tree.getNodeByTId(tId);
						$.extend(node, role);
						$scope.rolesTree.tree.updateNode(node);
					}
				});
			},

			/** 删除角色 */
			remove : function(roles) {
				if (!$window.confirm(LocaleService.getText("app.confirm.delete"))) return;
				if (!roles) roles = [ current.entity ];
				if (!angular.isArray(roles)) roles = [ roles ];
				var ids = [];
				var message = "";
				angular.forEach(roles, function(role) {
					ids.push(role.id);
				});
				if (ids.length < 1) {
					message = LocaleService.getText('app.delete.failure');
					alert(message);
					return;
				}
				RoleService.remove(ids).then(function(count) {
					if (count) {
						$scope.rolesTree.refresh(); // 删除后重新加载数据
						message = LocaleService.getText('app.delete.success');
						alert(message);
					}
				});
			}
		});
		$scope.rolesTree.refresh();
	}
	controller.$inject = [ "$scope", "$rootScope", "$window", "RoleService", "LocaleService" ];
	controller.$name = "RoleController"; // 可以省略，系统会默认以"模块名+Service"进行注册.如果此模块可能被其他模块依赖,则不能省略

	var module = {
		service : service,
		controller : controller
	};

	return module;
});
