/** 审批流程相关的模块 */
(function(factory) {
	var deps = [ "angular", "jquery", "ui.grid", "app.locale" ]
	define("app.process", deps, function(ng, $) {
		return factory(ng, $);
	});
})(function(ng, $) {
	"use strict";

	var STATUS = {
		/** 0.暂存 */
		SAVE : "0",
		/** 1.提交,待审批.如果有任意审批人审批后,变为A.审批中 */
		SUBMIT : "1",
		/** 2.审批中 */
		APPROVING : "2",
		/** A. 审批完成 */
		APPROVED: "A",
		/** B.审批完成,待费用单据签收 */
		RECEIPT : "B",
		/** C.已签收,待费用单据审核(会计制单) */
		ACCOUNTING : "C",
		/** P.待支付 */
		PAYING : "P",
		/** Z.完成/已报销/已支付 */
		CLOSED : "Z",
		/** E.预支后已完成归还 */
		RETURNED : "E",
		/** R.审批退回 */
		REJECTION : "R",
		/** RA.费用单据签收的退回 */
		REJECTION_RECEIPT: "RA",
		/** RA.费用单据审核的退回 */
		REJECTION_ACCOUNTING: "RB",
		/** RP.支付退回,退回后仅可修改收款人信息 */
		REJECTION_PAY: "RP"
	}
	
	/** 定义模块 */
	var module = ng.module("app.process", [ "ui.grid", "ui.grid.selection", "app.locale" ]);
	
	module.constant("ProcessConstants", { // 定义所有流程相关的常量
		DICT_APPLICATION_TYPE: 'application_type',	// 申请类型对应的参数表type
		STATUS: STATUS,
		TASK_STATUS: {
			PENDING: '2',	// 有效任务,待处理
			CLOSED: '1',	// 已完成的任务
			INVALID: '0'	// 无效任务
		},
		PAY_METHOD : {	// 所有支付方式dict_type="payment_method"
			SELF: "A",	// 个人账户(银企直连)
			BANK: "B0",	// 银行转账(银企直连)
			BANK_OFFLINE: "B1", // 银行转账,非银企
			CASH: "C",	// 现金
			CHEQUE: "D",	// 现金支票
			SETTLE: "S"	// 账务结算
		},
		PAY_STATUS: {
			SUCCESS: "1",	// 支付成功
			FAILURE: "0",	// 支付失败
			PAYING: "4",	// 支付处理中，非建行的收款人，银行会需要人工处理
			DELAY: "8"		// 延迟支付
		},
		PAYEE_TYPE : {
			INPUT: '0',	// 手工录入
			SELF: 'U',	// 员工个人账户
			SUPPLIER: 'V'	// 供应商
		}
	});
	
	var ProcessService = function($rootScope, ProcessConstants, $q, $http, BudgetSubjectService, LocaleService) {
		var namespace = "/query"; // 综合查询
		var namespaceBill = "/finance/bill"; // 签收专用
		var namespaceAdvanceReturn = "/advance/return";
		var ID = { };
		var service = {			
			STATUS: ProcessConstants.STATUS,	// 所有状态
			
			/** 取ns下的相对路径,省略则读取namespace */
			url : function(url, ns) {
				if (url.charAt('0') != '/') return url; // 相对路径
				if (!ns) ns = namespace;
				return $rootScope.app.url(ns + url);
			},

			/** 根据实体对象得到查看对象namespace,如果是新增,则直接去当前菜单的namespace,否则通过参数的配置读取 */
			namespace: function(type) {
				// property00字段存放的是读取此类型的的申请的namespace
				return type ? $rootScope.app.setting[ ProcessConstants.DICT_APPLICATION_TYPE ][ type ].propertyC00 : '';
			},
			namespaceBill : function(){
				// 签收专用
				return namespaceBill;
			},
			namespaceAdvanceReturn:function(){
				return namespaceAdvanceReturn;
			},
			
			/** 得到当前菜单下的固定参数,将申请类型在菜单的参数中设置好 */
			getCurrentParams: function() {
				return ($rootScope.session.currentMenu && $rootScope.session.currentMenu.params) || { };
			},
			
			/**
			 * 判断申请单是否可进行修改
			 * @param entity 申请单application详细信息
			 */
			canEdit: function(entity) {
				var status = entity.status;
				return [ STATUS.SAVE, STATUS.REJECTION ].include(status);
			},

			/**
			 * 判断申请单是否可进行修改支付信息操作,只有支付退回状态的数据可进行支付信息修改操作
			 * @param entity 申请单application详细信息
			 */
			canEditPayee: function(entity) {
				var status = entity.status;
				return STATUS.REJECTION_PAY == status;
			},

			
			/**
			 * 判断申请单是否可撤回
			 * @param entity 申请单application详细信息
			 */
			canRevoke: function(entity) {
				var status = entity.status;
				var prevStatus = entity.previousStatus;
				// 第一次提交后尚未审批的数据才能撤回
				return [ STATUS.SUBMIT ].include(status); // && [ STATUS_SAVE ].include(prevStatus);
			},
			
			/**
			 * 判断申请单是否可进行删除,只有暂存状态的数据可以删除
			 * @param entity 申请单application详细信息
			 */
			canRemove: function(entity) {
				var status = entity.status;
				return [ STATUS.SAVE ].include(status);
			},
			
			/**
			 * 通过申请单ID读取申请单详细信息,包括申请单的明细/人员/部门/历史记录等详细信息
			 * 
			 * @param id 申请单ID
			 * @param type id的申请类型
			 */
			get : function(id, type) {
				var deferred = $q.defer();
				var $this = this;
				type = type || this.getCurrentParams().type;
				var url = this.url("/get.do", this.namespace(type));
				$http.post(url, { id : id }).success(function(entity) {
					deferred.resolve(entity);
				});
				return deferred.promise;
			},
			
			/** 
			 * 新建一个ID 
			 * @param type 申请类型
			 * @param args 其他参数
			 */
			newId: function(type, args) {
				if (type && !ng.isString(type)) {
					var tmp = args;
					args = type;
					type = tmp;
				}
				if (!type) type = (args ? args.type : null) || this.getCurrentParams().type;
				
				var url = this.url('/newId.do', this.namespace(type));
				var deferred = $q.defer();
				args = $.extend({ type: type }, args || {});
				$http.post(url, args).success(function(id) {
					deferred.resolve(id);
				});
				return deferred.promise;
			},
			
			/**
			 * 查询
			 * @param params 查询参数
			 * @param pageRequest 分页参数
			 * @param ns 查询后台调用地址
			 */
			query: function(params, pageRequest, ns) {
				var deferred = $q.defer();
				var args = $.extend({ }, params || { }, pageRequest || { });
				var url = this.url("/query.do", ns);
				$http.post(url, args).success(function(page) {
					deferred.resolve(page);
				});
				return deferred.promise;
			},
			
			/** 保存数据 */
			save: function(entity) {
				var old = entity;
				entity = $.extend({ }, entity);	// clone对象,防止对外部对象的修改
				var items = entity.items;
				var files = entity.files;
				var relations = entity.relations;
				entity.items = null;
				entity.files = null;
				entity.relations = null;
				
				var deferred = $q.defer();
				var args = { entity: entity, items: items, files: files, relations: relations };
				var isNew = entity.isNew;
				var url = this.url(isNew ? "/save.do" : "/update.do", this.namespace(entity.type));
				$http.post(url, args).success(function(entity) {
					if (isNew) {
						// old.isNew = null;
						delete old.isNew;
					}
					deferred.resolve(entity);
				});
				return deferred.promise;
			},

			/**
			 * 删除申请
			 * @param ids 要撤销的申请单号
			 * @param type 申请类型
			 */
			remove: function(ids, type) {
				var deferred = $q.defer();
				type = type || this.getCurrentParams().type;
				var url = this.url("/remove.do", this.namespace(type));
				$http.post(url, { ids: ids }).success(function(count) {
					deferred.resolve(count);
				});
				return deferred.promise;
			},
			
			/**
			 * 撤销申请
			 * @param ids 要撤销的申请单号
			 * @param type 申请类型
			 */
			revoke: function(ids, type) {
				var deferred = $q.defer();
				type = type || this.getCurrentParams().type;
				var url = this.url("/revoke.do", this.namespace(type));
				$http.post(url, { ids: ids }).success(function(data) {
					deferred.resolve(data);
				});
				return deferred.promise;
			},
			
			saveBill: function(entity) {
				entity = $.extend({ }, entity);	// clone对象,防止对外部对象的修改
				var items = entity.items;
				var files = entity.files;
				var relations = entity.relations;
				entity.items = null;
				entity.files = null;
				entity.relations = null;
				var args = { entity: entity, items: items, files: files, relations: relations };

				var deferred = $q.defer();
				$http.post(this.url("/save.do", this.namespaceBill()), args).success(function(entity) {
					if (!entity || entity.error) {
						// 有错误信息
						deferred.reject(entity);
					} else {
						deferred.resolve(entity);
					}
				});
				return deferred.promise;
			},
			saveAdvanceReturn: function(entity) {
				entity = $.extend({ }, entity);	// clone对象,防止对外部对象的修改
				var items = entity.items;
				var files = entity.files;
				var relations = entity.relations;
				entity.items = null;
				entity.files = null;
				entity.relations = null;
				var args = { entity: entity, items: items, files: files, relations: relations };

				var deferred = $q.defer();
				$http.post(this.url("/save.do", this.namespaceAdvanceReturn()), args).success(function(entity) {
					if (!entity || entity.error) {
						// 有错误信息
						deferred.reject(entity);
					} else {
						// 成功
						if (ID[ entity.type ] == entity.id) {
							ID[ entity.type ] = null;
						}
						deferred.resolve(entity);
					}
				});
				return deferred.promise;
			}
		};
		ng.forEach(STATUS, function(status, name) {
			service[ "STATUS_" + name ] = status;
		});
		return service;
	};
	ProcessService.$inject = [ "$rootScope", "ProcessConstants", "$q", "$http", "BudgetSubjectService", "LocaleService" ];
	module.service("ProcessService", ProcessService);
	
	/** 专用于查询列表的Service */
	var ProcessQueryService = function($rootScope, ProcessService, ProcessConstants, $q, $http, $state, BudgetSubjectService, LocaleService) {
		return {
			state: null,	// 当前的ui-router的state
			page: null,		// 最后一次查询的数据
			/**
			 * 查询
			 * @param params 查询参数
			 * @param pageRequest 分页参数
			 * @param ns 查询后台调用地址
			 */
			query: function(params, pageRequest, ns) {
				if (!this.state) this.state = $state.current;
				var $this = this;
				var p = ProcessService.query.apply(ProcessService, arguments);
				p.then(function(page) {
					$this.page = page;
				});
				return p;
			},
			
			/** 添加一个新增的对象到第一行 */
			add: function(entity) {
				if (!this.page) return;
				this.page.content.unshift(entity);
			},
			
			/** 修改或添加entity */
			put: function(entity) {
				if (!this.page) return;
				var found = false;
				$.each(this.page.content, function(idx, obj) {
					found = obj.id == entity.id;
					if (found) {
						$.extend(obj, entity);
						return false;
					}
				});
				if (!found) {
					// 查询结果中不存在，则条件到第一条记录
					this.add(entity);
				}
			}
		}
	};
	ProcessQueryService.$inject = [ "$rootScope", "ProcessService", "ProcessConstants", "$q", "$http", "$state", "BudgetSubjectService", "LocaleService" ];
	module.service("ProcessQueryService", ProcessQueryService);
	
	return "app.process";
});