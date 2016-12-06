/** 流程相关申请的controller */
(function(factory) {
	var deps = [ "angular", "jquery" ];
	define("app.process.controller", deps, function(ng, $) {
		return factory.apply(this, arguments);
	});
})(function(ng, $) {
	"use strict";

	/** 每个方法需要的参数前两个都是$scope, $injector,依赖的其他service通过$injector.get(serviceName)得到 */
	/**
	 * 报销申请相关的公共方法
	 * 
	 * @param $scope controller的作用域,必须
	 * @param $injector 用于注入angular的service，必须
	 * @param options 可选，添加的其他方法或参数等
	 */
	var initController = function($scope, $injector, options) {
		var LocaleService = $injector.get("LocaleService");
		var ProcessService = $injector.get("ProcessService");
		var ProcessQueryService = $injector.get("ProcessQueryService");
		var ProcessConstants = $injector.get("ProcessConstants");
		var $window = $injector.get("$window");
		var $state = $injector.get("$state");
		var session = $scope.session;
		var current = $scope.current;
		$.extend($scope, ProcessConstants, {
			/** 判断数据是否可以进行修改 */
			canEdit : function(entity) {
				return entity && ProcessService.canEdit(entity || current.entity);
			},
			/** 判断数据是否可以进行修改 */
			canEditPayee : function(entity) {
				return entity && ProcessService.canEditPayee(entity || current.entity);
			},
			/** 判断数据是否可以进行撤回,只有提交后未做任何审批的数据可以撤回 */
			canRevoke : function(entity) {
				return entity && ProcessService.canRevoke(entity || current.entity);
			},
			/** 判断数据是否可以进行删除 */
			canRemove : function(entity) {
				return entity && ProcessService.canRemove(entity || current.entity);
			},
			/** 得到当前菜单下的固定参数,将申请类型在菜单的参数中设置好 */
			getCurrentParams : function() {
				if ($scope.params) return $scope.params;
				return ProcessService.getCurrentParams() || { };
			},
			
			/** 得到当前作用域下name参数的值 */
			getCurrentParam: function(name) {
				return $scope.getCurrentParams()[ name ];
			},

			/** 根据实体对象得到查看对象namespace,如果是新增,则直接去当前菜单的namespace,否则通过参数配置读取 */
			getNamespace : function(entity) {
				if (!entity && $scope.namespace) return $scope.namespace; // 为$scope指定了namespace属性
				if (!entity || entity.isNew) return session.currentMenu.namespace; // 新增直接返回当前菜单的namespace
				return ProcessService.namespace(entity.type);
			},
			
			/**
			 * 查询申请单id的详细信息
			 * 
			 * @param id 申请单号
			 * @param type 申请单类型,默认通过getCurrentParams查找type参数
			 */
			get: function(id, type) {
				return ProcessService.get(id, type || $scope.getCurrentParam('type'));
			},

			/** 
			 * 撤销已提交的申请
			 * @param ids Array/String,要撤销的id或id数组
			 */
			revoke: function(ids, type) {
				if (!$window.confirm(LocaleService.getText("app.confirm.revoke"))) return;
				var useCurrent = false;
				if (!ids) {
					// view时撤销数据
					ids = [ current.entity.id ];
					type = current.entity.type;
					useCurrent = true;
				}
				if (!ng.isArray(ids)) ids = [ ids ];	// 单行数据
				if (ids.length < 1) { return; }	// 没有要撤销的数据
				ProcessService.revoke(ids, type || $scope.getCurrentParam("type")).then(function(data) {	// 返回的是被删撤销数据的列表
					alert(LocaleService.getText('app.revoke.success', data.length));
					ng.forEach(current.page.content, function(obj) {
						$.each(data, function(dIdx, entity) {
							if (entity.id == obj.id) {
								// 覆盖查询列表中的数据
								$.extend(obj, entity);
								return false;
							}
						});
					});
					
					if (useCurrent) {
						// $.extend(current.entity, data[0]);
						$scope.toParentState();
					}
				});
			},
			
			/** 
			 * 删除暂存或退回的申请
			 * @param ids Array/String,要删除的id或id数组
			 */
			remove: function(ids, type) {
				if (!$window.confirm(LocaleService.getText("app.confirm.delete"))) return;
				if (!ids) {
					// view时删除数据
					ids = [ current.entity.id ];
					type = current.entity.type;
				}
				if (!ng.isArray(ids)) ids = [ ids ];	// 单行数据
				if (ids.length < 1) { return; }	// 没有要撤销的数据
				ProcessService.remove(ids, type || $scope.getCurrentParam("type")).then(function(count) {
					alert(LocaleService.getText('app.remove.success', count));
					if ($scope.query) $scope.query();	// 重新查询
					else {
						// 返回查询页面
						// ProcessQueryService.state = null;
						// $state.go($state.$current.parent.self.name);
						$scope.toParentState();
					}
				});
			},
			
			/** 取消按钮，返回到前一页面 */
			cancel: function() {
				var $window = $injector.get("$window");
				$window.history.back();
			},
			
			/** 跳转到上级路由 */
			toParentState: function() {
				var parentState = $state.$current.parent;
				$state.go(parentState.name);
			}
		}, options);
	};/* initController end */
	
	
	/** 初始化查询列表页面所使用的controller */
	var initQueryController = function($scope, $injector, options) {
		initController($scope, $injector, options);

		var LocaleService = $injector.get("LocaleService");
		var ProcessService = $injector.get("ProcessService");
		var ProcessQueryService = $injector.get("ProcessQueryService");
		var $state = $injector.get("$state");
		
		$.extend($scope, {
			/**
			 * 查询方法
			 * @param params 查询条件,可以为null,则默认为rootScope.current.params
			 * @param pageRequest 分页参数,至少包含pageNumber和pageSize两个字段,可以省略则默认为rootScope.current.pageRequest
			 */
			query: function(params, pageRequest) {
				params = params || current.params;
				pageRequest = pageRequest || current.pageRequest;
				params = $.extend(params || { }, $scope.getCurrentParams() || { });
				ProcessQueryService.query(params, pageRequest, $scope.getNamespace()).then(function(page) {
					current.page = page;
				});
			}
		}, options);

		var current = $scope.current;
		$.extend(current, {
			page : { content: [  ] },
			uiGridOptions: { },
			params: {
				submitTimes: [],
				amounts: []
			}
		});
		$.extend(current.uiGridOptions, {
			data: "current.page.content",	// 表格数据 来源的字段
			enableRowSelection : true, // 是否可选择
			enableSelectAll : true, // 允许全选 
			enableGridMenu: true,
			enableColumnResizing: true,	// 可调整宽度
			isRowSelectable : function(row) {	// row行是否可选中
				return $scope.canRemove(row.entity);
			},
			columnDefs : [	// 定义列
				{ field : 'id', displayName : LocaleService.getText("application.id"), enablePinning: true,
					maxWidth: 160,
					cellTemplate : '<div class="ui-grid-cell-contents">'
						+ '<a ng-href="{{ grid.appScope.$state.href(\'.view\', { id: row.entity.id }) }}"'
						+ 'xhref="#{{ grid.appScope.getNamespace(row.entity) }}/{{ row.entity.id }}" ng-bind="row.entity.id"></a></div>' },
				{ field : 'user.name', displayName : LocaleService.getText("application.user") },
				{ field : 'dept.name', displayName : LocaleService.getText("application.dept") },
				{ field : 'submitTime', displayName : LocaleService.getText("application.date"), 
					cellClass: 'text-center', maxWidth: 110,
					cellTemplate: '<div class="ui-grid-cell-contents" ng-bind="row.entity.submitTime | date"></div>' }, // 申请日期
				{ field : 'amount', displayName : LocaleService.getText("application.amount"), cellClass: 'text-right', 
						cellTemplate: '<div class="ui-grid-cell-contents" ng-bind="row.entity.amount | currency"></div>'  },
				{ field : 'status', width: 110, displayName : LocaleService.getText("application.status"),
					cellTemplate: '<div class="ui-grid-cell-contents" app-dict="row.entity.status" dict-type="application_status"></div>' },	// 申请单状态
				{ name : LocaleService.get('app.edit'), displayName : '', 
					enableColumnMenu: false, enableSorting: false, enableColumnResizing: false,
					maxWidth: 50,
					cellTemplate : '<div class="ui-grid-cell-contents"><a ng-if="grid.appScope.canEdit(row.entity)" '
						+ 'ng-href="{{ grid.appScope.$state.href(\'.edit\', { id: row.entity.id }) }}" title="{{ \'app.edit\' | appLocale }}"><i class="fa fa-edit"></i></a> '
						+ '<a href="javascript:;" ng-if="grid.appScope.canRevoke(row.entity)" '
						+ 'ng-click="grid.appScope.revoke(row.entity.id)" title="{{ \'app.revoke\' | appLocale }}"><i class="fa fa-level-down"></i></a> '
						+ '<a href="javascript:;" ng-if="grid.appScope.canRemove(row.entity)" '
						+ 'ng-click="grid.appScope.remove(row.entity.id)" title="{{ \'app.remove\' | appLocale }}"><i class="fa fa-remove"></i></a></div>'
				}
			],
			
			/** 将uiGrid的api对象注入到$scope.uiGrid中 */
			onRegisterApi: function(uiGrid) {
				$scope.uiGrid = uiGrid;
				var cellTemplate = '<div class="ui-grid-cell-contents" ng-bind="rowRenderIndex+1"></div>';
				uiGrid.core.addRowHeaderColumn( { name: 'rowNum', displayName: '', width: 30, maxWidth: 40, 
					enableColumnResizing: false, cellClass: "text-right", headerCellClass: 'text-clip', 
					cellTemplate: cellTemplate}, 10 );

				/** 得到当前被选中数据的id */
				function onRowSelectionChanged(row) {
					var ids = [ ];
					ng.forEach(uiGrid.selection.getSelectedRows(), function(row) {
						ids.push(row.id);
					});
					current.selected = ids;
					return ids;
				}
				
				if (uiGrid.selection) {
					/** 单列的选择变化事件 */
					uiGrid.selection.on.rowSelectionChanged($scope, function(row, event) {
						if (row.isSelected) {
							current.selected.push(row.entity.id);
						} else {
							current.selected.remove(row.entity.id);
						}
					});
					/** 全选/全不选事件 */
					uiGrid.selection.on.rowSelectionChangedBatch($scope, function(rows, event) {
						var ids = [ ];
						ng.forEach(uiGrid.selection.getSelectedRows(), function(entity) {
							ids.push(row.id);
						});
						current.selected = ids;
						return ids;
					});
				}
			}
		}, options ? options.uiGridOptions : { });
		
		if (!ProcessQueryService.state || ProcessQueryService.state != $state.current) {
			// 首次进入此查询页面则需要直接调用query方法
			ProcessQueryService.state = $state.current;
			$scope.query();
		} else {
			current.page = ProcessQueryService.page;
		}
		
	};/* initListController end */
	


	/** 初始化View页面所使用的controller */
	var initViewController = function($scope, $injector, options) {
		var current = $scope.current;
		// current.entity = { };	// 先给entity赋值一个空的对象，防止出现null异常
		var $stateParams = $injector.get("$stateParams");
		var id = $stateParams[ "id" ];	// 要查看的id
		var type = $stateParams[ "type" ];	// 申请类型，一般在各菜单下为null
		
		initController($scope, $injector, $.extend({
			view : function(entity) {
				if (entity)	current.entity = entity;
			},
			refresh : function() {
				$scope.get(id, type).then(function(entity) {
					$scope.view(entity); 
				});
			}
		}, options));
		$scope.refresh();
	};



	/** Add/Edit页面所使用的controller */
	var initSaveController = function($scope, $injector, options) {
		var current = $scope.current;
		// current.entity = { };
		var ProcessService = $injector.get("ProcessService");
		var ProcessQueryService = $injector.get("ProcessQueryService");
		var ProcessConstants = $injector.get("ProcessConstants");
		var LocaleService = $injector.get("LocaleService");
		var $state = $injector.get("$state");
		initController($scope, $injector, $.extend({
			/** 编辑时重置表单 */
			reset: function() {
				$scope.refresh();
			},
			/** 提交审批 */
			submit: function() {
				current.entity.status = ProcessConstants.STATUS.SUBMIT;
				$scope.doSave(current.entity);
			},
			/** 暂存数据 */
			save: function() {
				current.entity.status = ProcessConstants.STATUS.SAVE;
				$scope.doSave(current.entity);
			},
			/** 保存数据 */
			doSave: function(entity) {
				entity = entity || current.entity;
				var isNew = entity.isNew;
				ProcessService.save(entity).then(function(entity) {
					var submit = entity.status == ProcessConstants.STATUS.SUBMIT;
					alert(LocaleService.getText(submit ? 'app.submit.success' : 'app.save.success'));
					if (isNew) {
						ProcessQueryService.add(entity);
					} else {
						ProcessQueryService.put(entity);
					}
					
					// 跳转到上级路由
					$scope.toParentState();
				});
			},

			/** 改变item.amount字段后的回调函数*/
			changeAmount: function(item) {
				item.amountCost = item.amount - (item.amountTax || 0);
				$scope.sum();
			},
			/** 改变item.amountCost字段后的回调函数*/
			changeAmountCost: function(item) {
				item.amount = item.amountCost + (item.amountTax || 0);
				$scope.sum();
			},
			/** 改变amountTax字段后的回调函数*/
			changeAmountTax: function(item) {
				item.amount = item.amountCost + (item.amountTax || 0);
				$scope.sum();
			},
			/** 汇总申请金额,支付金额 */
			sum: function() {
				var amounts = {
					amount: 0,
					amountTax: 0,
					amountCost: 0
				};
				ng.forEach(current.entity.items || [ ], function(item) {
					angular.forEach(amounts, function(amt, name) {
						amounts[ name ] = amt + (item[ name ] || 0);
					});
				});
				if (amounts.amount != 0) {
					amounts.amountCost = amounts.amount - amounts.amountTax;
				} else {
					amounts.amount = amounts.amountCost + amounts.amountTax;
				}
				
				var exchangeRate = current.entity.payee ? (current.entity.payee.exchangeRate || 1) : 1;
				if (current.entity.payee) {
					$.extend(current.entity.payee, amounts);	// 原币金额
					// 支付金额
					current.entity.payee.payAmount = amounts.amount - current.entity.payee.payBackAmount;
				}
				if (exchangeRate != 1) {
					angular.forEach(amounts, function(amt, name) {
						amounts[ name ] = amt * exchangeRate;
					});
				}
				$.extend(current.entity, amounts);	// 本位币金额
			},

			/** 创建一个新行的数据，子类可以覆盖此方法，满足各模块对不同字段的初始化 */
			newItem: function(item) {
				var entity = current.entity;
				item = $.extend(true, { }, item, {
					budgetDept: entity.dept, 
					costDept: entity.dept 
				});
				if (!ng.isUndefined(item.id)) delete item.id;
				
				return item;
			},
			/**
			 * 添加一行明细
			 * @param item 要复制来的行，可省略，则表示新建行
			 */
			addItem: function(item) {
				var entity = current.entity;
				var items = entity.items;
				var ordinal = 0;
				if (!items) {	// 第一次增加行
					entity.items = items = [ ];
				} else if (items.length > 0) {		// 使用的序号为最后一行的序号加1
					ordinal = items[ items.length - 1 ].ordinal + 1;
				}
				item = $scope.newItem(item);
				item.ordinal = ordinal;
				items.push(item);
				if (!!item.amount) $scope.sum();
			},
			
			/** 
			 * 删除一行明细
			 * @param item 要删除的行，必须
			 */
			removeItem: function(item) {
				var entity = current.entity;
				var items = entity.items;
				if (!items) return;
				items.remove(item);
				if (item.amount != 0) $scope.sum();
			},
			/** 删除所有明细 */
			clearItems: function() {
				if (current.entity.items && current.entity.items.length > 0) {
					current.entity.items = null;
					$scope.sum();
				}
			},
			
			uploader: {	// 用于上传附件
				/** 影像上传成功的回调 */
				onSuccessItem: function(fileItem, response) {
					var entity = current.entity;
					var fileData = response;	// 上传到eFiling后返回的文件数据
					var files = entity.files;
					if (!files) files = entity.files = [ ];	
					ng.forEach(fileData, function(file, idx) {
						files.push({	// 附件
							name: fileItem.file.name,
							status: app.status.valid,
							fileData: file,
							fileId: file.id,
							dept: { id: entity.dept.id },
							company: { id: entity.company.id },
							application: { id: entity.id }
						});
					});
				}
			}
		}, options));
	};/* initSaveController end */
	

	/** 初始化Add页面所使用的controller */
	var initAddController = function($scope, $injector, options) {

		var current = $scope.current;
		var session = $scope.session;
		
		var ProcessService = $injector.get("ProcessService");
		var ProcessConstants = $injector.get("ProcessConstants");
		var $stateParams = $injector.get("$stateParams");
		var type = $stateParams[ "type" ];
		
		initSaveController($scope, $injector, $.extend({
			newId : function() {
				return ProcessService.newId(type || $scope.getCurrentParam("type"));
			},
			add : function(id) {
				if (!id) return;
				current.entity = $.extend({
					id: id,
					isNew: true,
					status: ProcessConstants.STATUS.SAVE,	// 暂存数据
					previousStatus: ProcessConstants.STATUS.SAVE,	// 暂存数据
					amount: 0,
					amountTax: 0,
					amountCost: 0,
					user: session.user,
					creator: session.user,
					dept: session.user.dept,
					company: session.user.dept,
					submitTime: new Date(),
					createTime: new Date()
				}, $scope.getCurrentParams() || { });
			},
			refresh : function() {
				$scope.newId().then(function(id) {
					$scope.add(id);
				});
			}
		}, options));
		
		$scope.refresh();
	};/* initAddController end */
	

	/** 初始化Edit页面所使用的controller */
	var initEditController = function($scope, $injector, options) {
		var current = $scope.current;
		var session = $scope.session;

		var LocaleService = $injector.get("LocaleService");
		var ProcessService = $injector.get("ProcessService");
		var ProcessConstants = $injector.get("ProcessConstants");

		var $state = $injector.get("$state");
		var $stateParams = $injector.get("$stateParams");
		var id = $stateParams[ "id" ];	// 要查看的id
		var type = $stateParams[ "type" ];	// 申请类型，一般在各菜单下为null
		
		initSaveController($scope, $injector, $.extend({
			edit : function(entity) {
				if (!entity || !$scope.canEdit(entity)) {
					alert(LocaleService.getText('application.validator.status', entity.id, entity.status));
					// 跳转到上级路由
					$scope.toParentState();
				} else {
					current.entity = entity;
				}
			},
			refresh : function() {
				$scope.get(id, type).then(function(entity) {
					$scope.edit(entity) 
				});
			}
		}, options));
		
		$scope.refresh();
	};/* initEditController */
	
	return {
		init: initController,
		query: initQueryController,
		view: initViewController,
		add: initAddController,
		edit: initEditController
	}
});