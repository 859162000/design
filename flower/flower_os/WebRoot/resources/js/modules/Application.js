(function(factory) {
	// 通用的申请对象,用于初始化controller,参数依次为$scope,$rootScope
	var deps = [ "angular", "jquery", "Constants" ];
	define("Application", deps, function(ng, $, Constants) {
		return factory(ng, $, Constants);
	});
})(function(ng, $, Constants) {
"use strict";
/** 在个申请模块的controller内部调用,用于控制器内部初始化$scope */
function init($scope, $rootScope, $window, $http, $timeout, ProcessService, DictionaryService, LocaleService, data) {
	var app = $rootScope.app; // config中配置的window.app
	var current = $rootScope.current;
	var session = $rootScope.session;
	var DICT_APPLICATION_TYPE = app.DICT_APPLICATION_TYPE;	// "application_type";
	var STATUS = Constants.STATUS;
	$.extend($scope, Constants, {
		/** 判断数据是否可以进行修改 */
		canEdit : function(entity) {
			return ProcessService.canEdit(entity);
		},
		/** 判断数据是否可以进行撤回,只有提交后未做任何审批的数据可以撤回 */
		canRevoke : function(entity) {
			return ProcessService.canRevoke(entity);
		},
		/** 判断数据是否可以进行删除 */
		canRemove : function(entity) {
			return ProcessService.canRemove(entity);
		},
		/** 是否可进行报销操作 */
		canExpense: function(entity) {
			return STATUS.APPRVOED == current.entity.status && current.entity.expense 
				&& app.status.valid == current.entity.expense.relationStatus;
		},
		/** 是否可进行签订合同操作 */
		canContract: function(entity) {
			return false;
		},
		/** 得到当前菜单下的固定参数,将申请类型在菜单的参数中设置好 */
		getCurrentParams: function() {
			return ProcessService.getCurrentParams();
		},
		
		/** 根据实体对象得到查看对象namespace,如果是新增,则直接去当前菜单的namespace,否则通过参数配置读取 */
		namespace: function(entity) {
			if (entity.isNew) return session.currentMenu.namespace;
			return ProcessService.namespace( entity.type );
		},
		
		/** 得到操作按钮的页面 */
		getActionsUrl: function(entity) {
			// entity = entity || current.entity;
			var url = 'resources/template/application/';
			url += (current.operator == 'view' ? 'view' : 'edit');
			url += '/buttons.html';
			return app.url(url);
		},
		/**
		 * 查询申请单id的详细信息
		 * @param id 申请单号
		 * @param type 申请单类型
		 */
		get: function(id, type) {
			return ProcessService.get(id, type);
		},

		
		/**
		 * 查询方法
		 * @param params 查询条件,可以为null,则默认为rootScope.current.params
		 * @param pageRequest 分页参数,至少包含pageNumber和pageSize两个字段,可以省略则默认为rootScope.current.pageRequest
		 */
		query: function(params, pageRequest) {
			params = params || current.params;
			pageRequest = pageRequest || current.pageRequest;
			params = $.extend(params || { }, $scope.getCurrentParams() || { });
			ProcessService.query(params, pageRequest, session.currentMenu.namespace).then(function(page) {
				current.page = page;
			});
			current.viewEntity = null;
			current.operator = null;
			$timeout(function() { $(window).trigger('resize'); }, 50);
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
			if (current.entity.expense) {
				$.extend(current.entity.expense, amounts);	// 原币金额
			}
			var exchangeRate = current.entity.payee ? (current.entity.payee.exchangeRate || 1) : 1;
			if (current.entity.payee) {
				// 支付金额
				current.entity.payee.amount = amounts.amount - ((current.entity.payee.payBackAmount || 0) / exchangeRate);
			}
			if (exchangeRate != 1) {
				angular.forEach(amounts, function(amt, name) {
					amounts[ name ] = amt * exchangeRate;
				});
			}
			$.extend(current.entity, amounts);	// 本位币金额
		},
		
		/** add方法取得id后的回调 */
		doAdd: function(id) {
			if (!id) return;
			current.entity = null;
			current.entity = $.extend({
				id: id,
				isNew: true,
				status: ProcessService.STATUS_SAVE,	// 暂存数据
				previousStatus: ProcessService.STATUS_SAVE,	// 暂存数据
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
			current.operator = "add";
		},
		/** 新建 */
		add: function(then) {
			var params = $scope.getCurrentParams();
			ProcessService.newId(params.type).then(function(id) {
				$scope.doAdd(id);
			});
		},
		
		
		/**
		 * 查看数据
		 * @param entity 已查询出详细信息的数据
		 */
		doView: function(entity) {
			current.entity = current.viewEntity = entity;
			current.operator = "view";
		},
		
		/**
		 * 通过id查看数据
		 * @param id 申请单号
		 */
		view: function(id, type) {
			$scope.get(id, type).then(function(entity) {
				$scope.doView(entity);
			});
		},


		/** 
		 * 编辑数据
		 * @param entity 已查询出详细信息的数据
		 */
		doEdit: function(entity) {
			if ($scope.canEdit(entity)) {
				current.viewEntity = entity;
				current.entity = $.extend(true, { }, entity);
				current.operator = "edit";
			}
		},
		
		/**
		 * 编辑申请单信息
		 * @param id 申请单号,省略则为在view页面点击的编辑,等于直接编辑current.entity
		 */
		edit: function(id, type) {
			if (id) { // 直接编辑人员
				$scope.get(id, type).then(function(entity) {
					$scope.doEdit(entity);
				});
			} else {
				// 通过view编辑人员
				$scope.doEdit(current.entity);
			}
		},

		/** 取消新建/编辑操作，查看数据 */
		cancel: function() {
//			if (current.operator == "view") {
//				current.operator = null;
//			} else if (current.viewEntity) {
//				$scope.doView(current.viewEntity);
//			} else {
//				current.operator = null;
//			}
			current.operator = null;	// 统一返回到查询页面
			if (!current.operator) {
				current.viewEntity = null;
				$timeout(function() { $(window).trigger('resize'); }, 50);
			}
		},
		
		/** 编辑时重置表单 */
		reset: function() {
			switch (current.operator) {
			case "add":	// 新建时的reset
				$scope.doAdd(current.entity.id);
				break;
			case "edit":	// 编辑时的reset
				$scope.doEdit(current.viewEntity);
				break;
			}
		},
		/** 提交审批 */
		submit: function() {
			current.entity.status = ProcessService.STATUS_SUBMIT;
			$scope.doSave();
		},
		/** 暂存数据 */
		save: function() {
			current.entity.status = ProcessService.STATUS_SAVE;
			$scope.doSave();
		},
		/** 保存数据 */
		doSave: function() {
			var insert = current.entity.isNew;
			ProcessService.save(current.entity, session.currentMenu.namespace).then(function(entity) {
				alert(LocaleService.getText('app.save.success'));
				$scope.doView(entity);
				if (!insert) {
					$.each(current.page.content, function(idx, obj) {
						if (obj.id == entity.id) {
							// 覆盖查询列表中的数据
							$.extend(obj, entity);
							return false;
						}
					});
				}
			});
		},
		
		/**
		 * 费用单据签收  只针对B状态下的修改保存
		 * 
		 * **/
		saveBill: function() {
			var insert = current.entity.isNew;
			ProcessService.saveBill(current.entity, session.currentMenu.namespace).then(function(entity) {
				alert(LocaleService.getText('app.sign.success'));
				$scope.doView(entity);
				if (!insert) {
					$.each(current.page.content, function(idx, obj) {
						if (obj.id == entity.id) {
							// 覆盖查询列表中的数据
							$.extend(obj, entity);
							return false;
						}
					});
				}
			});
		},
		/**
		 * 预支归还  只针对Z状态下的修改保存
		 * 
		 * **/
		saveAdvanceReturn: function() {
			var insert = current.entity.isNew;
			ProcessService.saveAdvanceReturn(current.entity, session.currentMenu.namespace).then(function(entity) {
				alert(LocaleService.getText('app.advanceReturn.success'));
				$scope.doView(entity);
				if (!insert) {
					$.each(current.page.content, function(idx, obj) {
						if (obj.id == entity.id) {
							// 覆盖查询列表中的数据
							$.extend(obj, entity);
							return false;
						}
					});
				}
			});
		},
		/** 
		 * 撤销已提交的申请
		 * @param entity Array/Object，要删除的数组或对象，可以省略，则表示删除current.entity */
		revoke: function(entity) {
			if (!$window.confirm(LocaleService.getText("app.confirm.revoke"))) return;
			var ids = [ ];
			var entites;
			if (!entity) {
				if (current.entity) ids = [ current.entity.id ];
			} else if (ng.isArray(entity)) {
				// 删除选中的列表
				angular.forEach(entity, function(o) {
					if (o && o.id) ids.push(o.id);
				});
			} else if (ng.isString(entity)) {
				ids = [ entity ];
			} else if (entity.id) {
				ids = [ entity.id ];
			}
			
			if (ids.length < 1) { return; }	// 没有要撤销的数据
			ProcessService.revoke(ids).then(function(data) {
				var entity = data[ 0 ];
				alert(LocaleService.getText('app.revoke.success', data.length));
				if (current.operator) {
					// 正在查看,ids==1,返回的数据为entity
					$scope.doView(entity);
				} else {
					// 重新查询
					// $scope.query();
				}
				$.each(current.page.content, function(idx, obj) {
					if (obj.id == entity.id) {
						// 覆盖查询列表中的数据
						$.extend(obj, entity);
						return false;
					}
				});
			});
		},
		
		/** 删除数据,delete为JavaScript的关键字，所以方法命名为remove
		 * @param entity Array/Object，要删除的数组或对象，可以省略，则表示删除current.entity */
		remove: function(entity) {
			if (!$window.confirm(LocaleService.getText("app.confirm.delete"))) return;
			var ids = [ ];
			var entites;
			if (!entity) {
				if (current.entity) ids = [ current.entity.id ];
			} else if (ng.isArray(entity)) {
				// 删除选中的列表
				angular.forEach(entity, function(o) {
					if (o && o.id) ids.push(o.id);
				});
			} else if (ng.isString(entity)) {
				ids = [ entity ];
			} else if (entity.id) {
				ids = [ entity.id ];
			}
			
			if (ids.length < 1) { return; }	// 没有要删除的数据
			ProcessService.remove(ids).then(function(count) {
				alert(LocaleService.getText('app.remove.success', count));
				$scope.query();
			});
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
			if (item) {
				item = $.extend(true, { }, item);
			} else {
				// 成本中心和预算中心均默认为申请部门
				item = { budgetDept: entity.dept, costDept: entity.dept };
			}
			item.ordinal = ordinal;
			var newItem = item;
			newItem.id = null;
			items.push(newItem);
			if (!!newItem.amount) $scope.sum();
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
				current.entity.items = [];
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

				console.log(entity.files.length);
				console.log(files.length);
			}
		}
	}, data || {});
	
	/** 使content默认为一个空数组,使之能被ui-grid监控 */
	current.page = { content: [  ]	};
	/** ui-grid的默认配置 */
	current.uiGridOptions = {
		enableRowSelection : false, // 是否可选择
		enableSelectAll : false, // 允许全选 
		enableGridMenu: true,
		enableColumnResizing: true,	// 可调整宽度
		isRowSelectable : function(row) {	// row行是否可选中
			return ProcessService.canRemove(row.entity);
		},
		columnDefs : [	// 定义列
//			{ name: 'rowNum', displayName : '#', enablePinning: false, width: 30, maxWidth: 40,
//				cellTemplate : '<div class="ui-grid-cell-contents" ng-bind="rowRenderIndex+1"></div>' },
			{ field : 'id', displayName : LocaleService.getText("application.id"), enablePinning: true,
				maxWidth: 160,
				cellTemplate : '<div class="ui-grid-cell-contents"><a href="javascript:;" '
					+ 'ng-click="grid.appScope.view(row.entity.id)" ng-bind="row.entity.id"></a></div>' },
			{ field : 'user.name', displayName : LocaleService.getText("application.user") },
			{ field : 'dept.name', displayName : LocaleService.getText("application.dept") },
			{ field : 'submitTime', displayName : LocaleService.getText("application.date"), 
				cellClass: 'text-center', maxWidth: 110,
				cellTemplate: '<div class="ui-grid-cell-contents" ng-bind="row.entity.submitTime | date"></div>' }, // 申请日期
			{ field : 'amount', displayName : LocaleService.getText("application.amount"),
					cellClass: 'text-right', maxWidth: 110,
					cellTemplate: '<div class="ui-grid-cell-contents" ng-bind="row.entity.amount | currency"></div>'  },
			{ field : 'status', maxWidth: 110, displayName : LocaleService.getText("application.status"),
				cellTemplate: '<div class="ui-grid-cell-contents" app-dict="row.entity.status" dict-type="application_status"></div>' },	// 申请单状态
			{ name : LocaleService.get('app.edit'), displayName : '', 
				enableColumnMenu: false, enableSorting: false, enableColumnResizing: false,
				maxWidth: 50,
				cellTemplate : '<div class="ui-grid-cell-contents"><a href="javascript:;" ng-if="grid.appScope.canEdit(row.entity)" '
					+ 'ng-click="grid.appScope.edit(row.entity.id)" title="{{ \'app.edit\' | appLocale }}"><i class="fa fa-edit"></i></a> '
					+ '<a href="javascript:;" ng-if="grid.appScope.canRevoke(row.entity)" '
					+ 'ng-click="grid.appScope.revoke(row.entity.id)" title="{{ \'app.revoke\' | appLocale }}"><i class="fa fa-undo"></i></a> '
					+ '<a href="javascript:;" ng-if="grid.appScope.canRemove(row.entity)" '
					+ 'ng-click="grid.appScope.remove(row.entity.id)" title="{{ \'app.remove\' | appLocale }}"><i class="fa fa-remove"></i></a></div>'
			}
		],
		
		/** 将uiGrid的api对象注入到$scope.uiGrid中 */
		onRegisterApi: function(uiGrid) {
			$scope.uiGrid = uiGrid;
			var cellTemplate = '<div class="ui-grid-cell-contents" ng-bind="rowRenderIndex+1"></div>';   // you could use your own template here
			uiGrid.core.addRowHeaderColumn( { name: 'rowNum', displayName: '', width: 30, maxWidth: 40, 
				enableColumnResizing: false, cellClass: "text-right", headerCellClass: 'text-clip', 
				cellTemplate: cellTemplate}, 10 );
			
//			/** 单列的选择变化事件 */
//			uiGrid.selection.on.rowSelectionChanged($scope, function(row) {
//				current.selected = uiGrid.selection.getSelectedRows();
//			});
//			/** 全选/全不选事件 */
//			uiGrid.selection.on.rowSelectionChangedBatch($scope, function(row) {
//				current.selected = uiGrid.selection.getSelectedRows();
//			});
		},		
		data: "current.page.content"	// 表格数据,绑定到查询后的分页数据.需要预先定义为空数组,如果current.page.content不存在或为null,会造成无法显示表头
	}
}

return {
	init : init
};
});