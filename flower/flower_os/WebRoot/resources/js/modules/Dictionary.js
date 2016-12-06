(function(factory) {
	define("Dictionary", [ "angular", "jquery" ], function(angular, $) {
		return factory(window.app, angular, $);
	});
})(function factory(app, angular, $) {
	"use strict";
	var namespace = "/setting/dictionary";
	var LOAD_STATIC = "1";	// 静态加载
	var LOAD_DEFAULT = "0";	// 不会静态加载
	/** 定义的service，会被注册为DictionaryService */
	var service = function($rootScope, $http, $q, $timeout) {
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
			save: function(dictionary, ns) {
				var deferred = $q.defer();
				var $this = this;
				$http.post(this.url("/save.do", ns), { entity: dictionary }).success(function(dictionary) {
					$this.put(dictionary);
					deferred.resolve(dictionary);
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
			},
			
			/**获取当前时间  yyyymmddhhmmss**/
			getNowFormatDate : function() {
			    var date = new Date();
			    var month = date.getMonth() + 1;
			    var strDate = date.getDate();
			    if (month >= 1 && month <= 9) {
			        month = "0" + month;
			    }
			    if (strDate >= 0 && strDate <= 9) {
			        strDate = "0" + strDate;
			    }
			    var currentdate = date.getFullYear()  + month + strDate
			            + date.getHours() +  date.getMinutes()
			            + date.getSeconds();
			    return currentdate;
			} 
		}
	}
	service.$inject = [ "$rootScope", "$http", "$q", "$timeout" ];
	service.$name = "DictionaryService"; // 可以省略，系统会默认以"模块名+Service"进行注册.如果此模块可能被其他模块依赖,则不能省略

	/** 定义的controller，会被注册为DictionaryController */
	var controller = function($scope, $rootScope, $window, DictionaryService,DeptService,LocaleService) {
		var current = $rootScope.current;
		var session = $rootScope.session;
		$scope.propertyC00_0 = false;
		$scope.propertyC00_1 = false;
		$.extend($scope, {
			/** 用于车辆信息配置   */
			changeSpan : function(selectNo){
				if(selectNo == "0"){
					$scope.propertyC00_0 = true;
					$scope.propertyC00_1 = false;
				}
				else if(selectNo == "1"){
					$scope.propertyC00_0 = false;
					$scope.propertyC00_1 = true;
				}
				else {
					$scope.propertyC00_0 = false;
					$scope.propertyC00_1 = false;
				}
			},
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
						var names = [];
						var ids = [];
						angular.forEach($scope.queryDeptsSelector.depts, function(dept) {
							names.push(dept.name);
							ids.push(dept.id);
						});
						$scope.queryDeptsSelector.checkedNames = names.join(",");
						current.entity.depts = ids.join(",");//部门选择的都放在这个字段里面
						current.entity.propertyT00 = names.join(",");//部门选择的都放在这个字段里面
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
				params = $.extend(params || { }, DictionaryService.getCurrentParams() || { });
				DictionaryService.query(params, pageRequest, session.currentMenu.namespace).then(function(page) {
					current.page = page;
				});
				current.operator = null;
			},
			
			/** 新增 */
			add: function() {
				var guestType = DictionaryService.getCurrentParams();
				var  nowTimeFormat = "";
				if(guestType != null ){
			    if (guestType.type == "guestType"  ||guestType.type == "vehicleExpenseType"){
			    	var nowTime = DictionaryService.getNowFormatDate();
			    	nowTimeFormat  = "B"+nowTime;
			     }
				}
			    // 在招待对象中，要求code自生成，且唯一，格式为 ：B+当前时间（YYYYMMDDHHMMSS）
				current.entity = $.extend({ 
					isNew: true, 
					loadType: LOAD_DEFAULT, // 新增的数据loadType=0,loadType=1的数据一般都是通过后台配置的
					status: app.status.valid, 
					ordinal : "1",
					code : nowTimeFormat,
				}, DictionaryService.getCurrentParams());
				current.operator = "add";
			},
			
			/** 查看 */
			view: function(dictionary) {
				current.operator = "view";
				current.entity = dictionary;
			},

			/** 编辑 */
			edit: function(dictionary) {
				current.operator = "edit";
				if (!dictionary) dictionary = current.entity;
				current.entity = $.extend({ }, dictionary);
				$scope.queryDeptsSelector.checkedNames = current.entity.propertyT00;
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
			save: function(dictionary) {
				if (!current.operator) return;
				DictionaryService.save(dictionary || current.entity, session.currentMenu.namespace).then(function(entity) {
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
			remove: function(dictionary) {
				if (!$window.confirm(LocaleService.getText("app.confirm.delete"))) return;
				if (!dictionary) dictionary = [ current.entity ];
				if (!angular.isArray(dictionary)) dictionary = [ dictionary ];
				var ids = [ ];
				
				var message = "";
				angular.forEach(dictionary, function(dictionary) {
					ids.push(dictionary.id);
				});
				if (ids.length < 1){
					message = LocaleService.getText('app.delete.failure');
					alert(message);
					return;
				}
				DictionaryService.remove(ids, session.currentMenu.namespace).then(function(dictionary) {
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
				params = $.extend(params || { }, DictionaryService.getCurrentParams() || { });
			if(current.entity.code == null || current.entity.code ==""){}
			else{
				DictionaryService.testCode(params,current.entity.code).then(function(list) {
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
	controller.$inject = [ "$scope", "$rootScope", "$window","DictionaryService","DeptService","LocaleService"];
	controller.$name = "DictionaryController"; // 可以省略，系统会默认以"模块名+Controller"进行注册

	var module = {
		service : service,
		controller : controller
	};

	return module;
});