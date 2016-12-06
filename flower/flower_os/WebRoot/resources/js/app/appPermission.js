(function(factory) {
	// 系统权限控制相关的模块
	
	"use strict";
	var deps = [ "angular", "jquery", "appRouter" ];
	
	define("appPermission", deps, function(angular, $, appRouter) {
		return factory(angular, $, appRouter);
	});
	
})(function(angular, $) {
	"use strict";
	/** 定义模块 */
	var module = angular.module("appPermission", [ ]);

	/** 定义service */
	var PermissionService = function($rootScope) {
		return {
			/** 
			 * 得到当前菜单menuId下action的权限
			 * @param action 菜单操作，对应menuAction.permissionAction,在一个菜单下不能重复
			 * @param menuId 菜单ID，可以省略，则在当前菜单中查找
			 */
			get : function(action, menuId) {
				var menu = angular.isUndefined(menuId) ? $rootScope.session.currentMenu : appRouter.menus[ menuId ];
				if (!menu) return null;
				var action = menu.actionsMap[ action ];
				if (!action) return null;
				return this.getPermission(action);
			},
			
			/** 通过操作的id得到权限对象 */
			getPermission: function(action) {
				var permission = action.permission;
				if (!angular.isUndefined(permission)) return permission;				
				var permissions = $rootScope.session.permissions;
				$.each(permissions, function(index, permi) {
					if (permi.menuAction && permi.menuAction.id == action.id) {
						permission = permi;
						return false;
					}
				});
				action.permission = permission;	// 缓存菜单的权限数据
				return permission;
			}
		}
	};
	PermissionService.$inject = [ "$rootScope" ];
	module.service("PermissionService", PermissionService);

//	/** 定义Controller */
//	var PermissionController = function(PermissionService, $scope, $rootScope, $window) {
//		// TODO
//	};
//	PermissionController.$inject = [ "PermissionService", "$scope", "$rootScope", "$window" ];
//	module.controller("PermissionController", PermissionController);
	
	/** 定义指令 app-permission */
	module.directive("appPermission", [ "PermissionService", function(PermissionService) {
		return {
			restrict : "A",
			link : function ($scope, ele, attr) {
				var action = attr.appPermission; //  $scope.$eval(attr.appPermission) ||
				var permission = PermissionService.get(action);
				$(ele).data("permission", permission);	// 存放到元素的permission数据中
				if (!permission) {
					// 没有权限则隐藏元素
					$(ele).hide();
				} else {
					$(ele).show();
				}
			}
		}
	} ]);
	
	return "appPermission";
});