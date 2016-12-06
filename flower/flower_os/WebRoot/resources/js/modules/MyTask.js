/** 我的任务 */
(function(factory) {
	define("MyTask", [ "angular", "jquery", "app.process.controller" ], function(ng, $, ctrl) {
		return factory.apply(this, arguments);
	});
})(function(ng, $, ctrl) {
	"use strict";
	var namespace = "/my/task";
	var service = function($rootScope, $http, $q, ProcessConstants) {
		var app = $rootScope.app;
		return {
			STATUS: ProcessConstants.TASK_STATUS,
			/**
			 * 通过任务ID读取申请单详细信息,包括申请单的明细/人员/部门/历史记录等详细信息
			 * 
			 * @param taskId 任务的ID
			 */
			get : function(taskId) {
				var deferred = $q.defer();
				var $this = this;
				$http.post(app.url(namespace + "/get.do"), { taskId : taskId }).success(function(data) {
					// data为读取到的详细信息
					deferred.resolve(data);
				});
				return deferred.promise;
			},
			/** 审批通过 */
			approve: function(task) {
				var deferred = $q.defer();
				var args = { taskId: task.id, message: task.message, rejectType: task.rejectType };
				$http.post(app.url(namespace + "/approve.do"), args).success(function(data) {
					// data为读取到的详细信息
					deferred.resolve(data);
				});
				return deferred.promise;
			},
			/** 审批退回 */
			reject: function(task) {
				var deferred = $q.defer();
				var args = { taskId: task.id, message: task.message, rejectType: task.rejectType };
				$http.post(app.url(namespace + "/reject.do"), args).success(function(data) {
					// data为读取到的详细信息
					deferred.resolve(data);
				});
				return deferred.promise;
			}
		};
	};
	service.$inject = ["$rootScope", "$http", "$q", "ProcessConstants"];
	service.$name = "MyTaskService";
	
	var MyTaskQueryController = function($scope, $injector, ProcessConstants, LocaleService) {
		ctrl.query($scope, $injector, {
			namespace: namespace,
			uiGridOptions: {
				isRowSelectable : function(row) {	// row行是否可选中
					return row.entity.status == ProcessConstants.TASK_STATUS.PENDING;
				},
				columnDefs : [	// 定义列
					{ field : 'application.id', displayName : LocaleService.getText("application.id"), enablePinning: true,
						maxWidth: 160,
						cellTemplate : '<div class="ui-grid-cell-contents"><a ng-bind="row.entity.application.id"'
							+ 'ng-href="{{ grid.appScope.$state.href(\'.view\', { id: row.entity.id }) }}" ></a></div>' },
					{ field : 'application.user.name', displayName : LocaleService.getText("application.user") },
					{ field : 'application.dept.name', displayName : LocaleService.getText("application.dept") },
					{ field : 'application.submitTime', displayName : LocaleService.getText("application.date"), cellClass: 'text-center', maxWidth: 110,
						cellTemplate: '<div class="ui-grid-cell-contents" ng-bind="row.entity.application.submitTime | date"></div>' }, // 申请日期
					{ field : 'application.amount', displayName : LocaleService.getText("application.amount"), cellClass: 'text-right',
						cellTemplate: '<div class="ui-grid-cell-contents" ng-bind="row.entity.application.amount | currency"></div>' },
					{ field : 'application.status', displayName : LocaleService.getText("application.status"), 
						width: 100,
						cellTemplate: '<div class="ui-grid-cell-contents" app-dict="row.entity.application.status" dict-type="application_status"></div>' },	// 申请单状态
					{ field : 'user.name', displayName : LocaleService.getText("application.approver") },	// 真实审批人
					{ field : 'createTime', displayName : LocaleService.getText("my.task.date"), 	// 任务到达日期
						cellClass: 'text-center', maxWidth: 110,
						cellTemplate: '<div class="ui-grid-cell-contents" ng-bind="row.entity.createTime.substring(0, 10)"></div>' }
				]
			}
		});
	}
	MyTaskQueryController.$inject = [ "$scope", "$injector", "ProcessConstants", "LocaleService" ];
	
	var MyTaskController = function($scope, $injector, $window, MyTaskService, LocaleService) {
		var current = $scope.current;
		ctrl.view($scope, $injector, {
			/**
			 * 查询task的详细信息
			 * 
			 * @param id task.id
			 */
			get: function(id) {
				return MyTaskService.get(id);
			},
			
			/** view */
			view : function(task) {
				if (task) {
					current.entity = task.application;
					current.task = task;
				}
			},
			
			/** 审批通过,审批的数据为current.task */
			approve: function() {
				if (!$window.confirm(LocaleService.getText("app.confirm.approve"))) return;
				MyTaskService.approve(current.task).then(function(task) {
					current.task.status = task.status;
					alert(LocaleService.get("app.approve.success"));
					// $scope.query();	// 重新查询
				});
			},
			
			/** 审批退回,退回的数据为current.task */
			reject: function() {
				if (!current.task.message) {
					// 必须输入退回
					alert(LocaleService.getText('app.reject.message.required'));
					return;
				}
				if (!$window.confirm(LocaleService.getText("app.confirm.reject"))) return;
				MyTaskService.reject(current.task).then(function(task) {
					current.task.status = task.status;
					alert(LocaleService.get("app.reject.success"));
					// $scope.query();	// 重新查询
				});
			}

		});
	}
	MyTaskController.$inject = [ "$scope", "$injector", "$window", "MyTaskService", "LocaleService" ];
	
	return {
		service: service,
		controllers : {
			"MyTaskController" : MyTaskController,
			"MyTaskQueryController" : MyTaskQueryController
		}
	};
});