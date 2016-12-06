/** 初始化菜单，并为菜单添加动态加载JS功能 */
(function() {
	"use strict";
	/** 所有菜单的JSON格式,通过菜单id注册 */
	var MENUS = {};
	/** 通过state注册的菜单 */
	var STATES = {};
	/** 通过url注册的菜单 */
	var URLS = {};
	/** 通过module注册的菜单 */
	var MODULES = {};
	/** 所有已注册到angular的模块 */
	var REGISTERS = {};

	/* 依赖的angularjs和jquery */
	var angular, $;

	/* 此WEB应用的根目录 */
	// var CONTEXT_PATH = window.app.root;
	var app = window.app;

	/**
	 * 将菜单数据格式化为所需的对象.格式化后的menu对象包含一下属性
	 * 
	 * <pre>
	 * {	 
	 * module: String,此菜单使用requirejs要加载的模块，默认为JS文件名，不需要后缀.此JS一般会返回如下格式的JSON对象，{ service: Service, controller: 控制器 } 
	 * deps: [],此菜单依赖的其他requirejs模块
	 * templateUrl：此菜单加载的页面.可以省略，默认使用namespace.如果以/开头,则系统会自动加上应用的根目录。
	 * controller: 此菜单使用的angularjs控制器,此参数必须	 * 
	 * namespace: 此菜单的路径。不能以/结尾.如果未配置此参数，则以上的所有参数均无效,表示此菜单不需要加载页面,仅用于显示菜单路径
	 * id: 此菜单的数字主键，不会重复
	 * icon: 使用的图标，如果有iconClass，则忽略icon
	 * iconClass: 在菜单前的i标签使用的样式
	 * children: 子菜单
	 * active: 此菜单是否打开,此属性有系统自动初始化,不需要后台带出,
	 * routed: 此菜单是否通过route设置了路由。
	 * state: ui.router的state
	 * url: ui.router的url
	 * resolved: 数字，表示此菜单是否已进行过处理，防止重复处理.&gt;0表示此菜单的加载次数
	 * parent: 上级菜单对象,此属性由系统初始化，不需要后台带出
	 * }
	 * </pre>
	 */
	function format(menu) {
		MENUS[menu.id] = menu;
		
		var options = menu.options || { };
		if (options && angular.isString(options)) {
			options = angular.fromJson(options);
		}
		
		var module = $.trim(menu.module);
		var isAbstract = options[ "abstract" ];
		if (module) {
			angular.extend(menu, {
				module : module,	// 所有JS文件统一在modules目录中
				controller : module + "Controller",
				service : module + "Service",	// 默认service的注册名称
			});
			MODULES[ module ] = menu;		
		} else { // 菜单路径，不需要设置具体的controller等信息
			if (angular.isUndefined(isAbstract)) isAbstract = true;
		}
		var templateUrl = menu.templateUrl || options.templateUrl;
		var router = menu.router = {
			"abstract" : !!isAbstract,
			controller : options.controller || menu.controller
		};
		
		var namespace = $.trim(menu.namespace);
		if (namespace) { // 首先将namespace处理为/a/b的形式
			if (namespace.charAt(0) != '/') {
				namespace = '/' + namespace;
			}
			if (namespace.charAt(namespace.length - 1) == '/') {
				namespace = namespace.substring(0, namespace.length - 1);
			}
	
			var url = namespace;
			var state = namespace.substring(1).replace(/\//g, '.');
			if (!templateUrl && !isAbstract) { // 如果未指定templateUrl，则默认加载menu.namespace下的地址
				templateUrl = namespace;
			}
			var pos = state.lastIndexOf('.');
			if (pos > -1) {				
				var parentState = state.substring(0, pos);				
				// if (!(menu.parent && menu.parent.state)) {
				if (!STATES[ parentState ]) {
					// 系统总是先处理的父菜单再处理子菜单，所以不考虑后面可能出现parentState的情况
					// 没有父级的路由，则将state的点(.)替换为下划线(_).以防止路由嵌套.
					state = state.replace(/\./g, '_');
				} else {
					// 有上级路由,则配置默认的views为上级的view，直接覆盖到上级的view视图
//					router.views = {
//						'@' : {	// 有@表示绝对视图,默认所有视图都在根ui-view节点上
//							templateUrl : templateUrl
//						}
//					}
					pos = url.lastIndexOf('/');
					// url = url.substring(pos);	// url为父菜单下的相对路径
					router.url = url.substring(pos);
				}
			}
			angular.extend(menu, {
				namespace : namespace,
				url : url,
				state : state
			});
			if (!router.url) router.url = url;
		}


		if (templateUrl) {
			router.templateUrl = app.url(templateUrl);
		} else {
			router.template = "<div ui-view></div>";
		}

		var routers = menu.routers;
		if (!routers) routers = menu.routers = { };
		// 将菜单的actions以permissionAction为key存为JSON数据
		if (menu.menuActions) {
			var actionsMap = { };
			angular.forEach(menu.menuActions, function(action) {
				actionsMap[ action.permissionAction ] = action;
				if (action.options && action.options.router) {
					var router = action.options.router;
					routers[ router.state ] = router;
				}
			});
			menu.actionsMap = actionsMap;
		}
		if (options) {
			// options可以覆盖menu的参数
			menu = $.extend(true, menu, options);
		}
		menu.i18nKey = menu.i18nKey || menu.name;	// i18nKey可以省略,则直接使用name
		
		menu.resolved = 0;
		if (menu.state)	STATES[menu.state] = menu;
		if (menu.url) {
			URLS[menu.url] = menu;
		}

		if (menu.routers) { // 此菜单下有注册子路径,处理其templateUrl
			angular.forEach(menu.routers, function(router, state) {
				if (router.templateUrl) {
					router.templateUrl = app.url(router.templateUrl);
				}
				if (router.views) {
					angular.forEach(router.views, function(view) {
						if (view.templateUrl) {
							view.templateUrl = app.url(view.templateUrl);
						}
					})
				}
			});
		}
	}
	
	var ROUTED = { };	// 已注册过路由的state，防止重复注册
	/** 使用ui-router为菜单menu配置对应的路由 */
	function route(menu) {
		if (!menu.state || ROUTED[ menu.state ]) return;
		ROUTED[	menu.state ] = true;
		var router = menu.router;
		router.resolve = {
			requirejs : resolve(menu)
		}
			
		appRouter.$stateProvider.state(menu.state, router);
		
		if (menu.routers) {	// 此菜单下有子路径
			angular.forEach(menu.routers, function(router, state) {
				router.resolve = {	// 防止直接访问路径时未加载此菜单的JS文件
					requirejs : resolve(menu)
				}
				appRouter.$stateProvider.state(state, router);
			});
		}
	}

	/** 加载菜单对应的JS文件 */
	function resolve(menu) {
		return function($q, $rootScope) {
			// alert(menu.id);
			var deps = menu.deps || []; // 需要加载的JS模块
			if (deps && angular.isString(deps)) {
				// deps可以是逗号分隔的数组
				deps = deps.split(/\s*,\s*/);
			}
			// 还需要加载本身的JS
			if (menu.module) deps.push(menu.module);

			// var nav = $rootScope.session.nav;
			// nav.length = 0;
			var callback = function() {
				if (!menu.resolved) {
					menu.resolved = 1; // 此菜单已处理
				} else { // 处理次数+1
					menu.resolved = menu.resolved + 1;
				}
				
				$rootScope.session.currentMenu = menu;
				$rootScope.current = {	// 进入菜单前重置$rootScope的current属性
					// 当前模块变量的存放,主要有以下几个变量
					error: null,	// 清空异常信息
					page: null,		// 查询后的分页数据,参见org.springframework.data.domain.Page.
					entity: null,	// 当前模块处理的实体类，比如正在查看/编辑的对象
					selected: [ ],	// 当前已被选中的数据
					params: null,	// 查询条件参数,从系统中录入的参数,进入模块前应该将查询参数清空
					pageRequest: { 	// 查询分页参数,每进入一个模块，应当把pageNumber重置为1
						pageNumber: 0, // 页数，从0开始
						pageSize: $rootScope.current.pageRequest.pageSize // pageSize不重置
					},
					uiGridOptions: { },	// 用于使用ui-grid的列表,其中主要包含columnDefs字段,为null在第一次加载需要此字段的菜单时可能会报错
					operator: null			// 当前进行的操作，默认为null,个模块自己判断默认值的处理方式
				};
			}
			if (deps.length < 1) {
				callback();
				return;
			}

			var deferred = $q.defer();
			require(deps, function() {
				var args = arguments;
				angular.forEach(deps, function(module, index) {
					register(module, args[index]);
				});

				callback();
				
				deferred.resolve();
			});

			return deferred.promise;
		}
	}

	/**
	 * 注册加载的模块,每个模块的data数据格式为
	 * 
	 * <pre>
	 * {
	 *  services: 要注册的service，使用name：value形式的JSON数据 
	 * 	controllers: 要注册的控制器，使用name：value形式的JSON数据
	 * }
	 * </pre>
	 * 
	 * @param module
	 * @param data
	 */
	function register(module, data) {
		if (!!REGISTERS[module] || !data) return;

		REGISTERS[module] = data;
		
		// 取得菜单数据
		module  = MODULES[ module ] || {
			module : module,	// 所有JS文件统一在modules目录中
			controller : module + "Controller",
			service : module + "Service",	// 默认service的注册名称
		};
		
		// services为name:value的JSON对象
		var services = data.services || { };
		if (data.service) {
			var serviceName = data.service.$name || module.service;
			if (serviceName && !services[ serviceName ]) {
				services[ serviceName ] = data.service;
			}
		}
		angular.forEach(services, function(service, name) {
			appRouter.$provide.service(name, service);
		});

		// controllers为name:value的JSON对象
		var controllers = data.controllers || { };
		if (data.controller) {
			var controllerName = data.controller.$name || module.controller;
			if (controllerName && !controllers[ controllerName ]) {
				controllers[ controllerName ] = data.controller;
			}
		}
		angular.forEach(controllers, function(controller, name) {
			appRouter.$controllerProvider.register(name, controller);
		});
		
		// 指令
		var directives = data.directives;
		if (directives) {
			angular.forEach(directives, function(directive, name) {
				appRouter.$compileProvider.directive(name, directive);
			});
		}
	}

	/** 处理菜单 */
	function handle(menu) {
		format(menu);
		route(menu);

		// 处理menu的子菜单
		angular.forEach(menu.children, function(child, childId) {
			child.parent = menu;

			handle(child);
		});
	}

	/** requirejs加载的对象 */
	var appRouter = {
		/** 处理所有菜单数据,然后返回menus */
		init : function(menus) {
			this.menus = MENUS = { };
			this.states = STATES = { };
			this.urls = URLS = { };
			this.modules = MODULES = { };
			
			angular.forEach(menus, function(menu) {
				handle(menu);
			});
			return menus;
		},
		
		/** 注册一个模块的JS */
		register: register
	};

	define("appRouter", [ "angular", "jquery" ], function(_angular, jquery) {
		angular = _angular;
		$ = jquery;
		return appRouter;
	});
})();