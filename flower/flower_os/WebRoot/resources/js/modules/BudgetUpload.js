/** 预算导入 */
(function(factory) {
	define("BudgetUpload", [ "angular", "jquery", "Application" ], function(ng, $, Application) {
		return factory(window.app, ng, $, Application);
	});
})(function(app, ng, $, Application) {
	"use strict";
	
	var controller = function($scope, $rootScope, $window, $http, $q, $timeout, ProcessService, DeptService, DictionaryService, BudgetSubjectService, LocaleService) {
		var app = $rootScope.app;
		var current = $rootScope.current;
		Application.init($scope, $rootScope, $window, $http, $timeout, ProcessService, DictionaryService, LocaleService, {
			uploader: {
				/** 成功的回调 */
				onSuccessItem: function(fileItem, response) {
					var fileData = response.fileData;	// 上传到eFiling后返回的文件数据,因为是单选
					var data = response.data;	// Excel解析后的数据

					var deptCodes = [ ];
					var budgetCodes = [ ];
					var msg;
					$.each(data, function(idx, values) {
						if (!values || idx == 0) return;	// 第一行为表头,删除
						if (!values[0])  {
							msg = "第" + (idx + 1) + "行的部门代码不能为空!";
						} else if (!values[1])  {
							msg = "第" + (idx + 1) + "行的预算科目不能为空!";
						}
						if (msg) {
							alert(msg);
							return false;
						}
						deptCodes.push(values[0]);
						budgetCodes.push(values[1]);
					});
					
					if (msg) {
						return false;
					}

					var entity = current.entity;
					var items = entity.items;
					if (!items) items = entity.items = [ ];
					var files = entity.files;
					if (!files) files = entity.files = [ ];
					
					var amount = entity.amount || 0;
					$q.all([ DeptService.get(deptCodes, false, true),
							BudgetSubjectService.get(budgetCodes, { useCode: true }) ])
						.then(function(results) {
							var msg;
							var depts = results[0];
							var subjects = results[1];
							$.each(data, function(idx, values) {
								if (!values || idx == 0) return;	// 第一行为表头,删除
								var dept = depts[ values[0] ];
								var subject = subjects[ values[1] ];
								if (!dept) {
									msg = "第" + (idx + 1) + "行的部门\"" + values[0] + "\"不存在!";
								} else if (!subject) {
									msg = "第" + (idx + 1) + "行的预算科目\"" + values[1] + "\"不存在!";
								}
								if (msg) {
									alert(msg);
									return false;
								}
								var item = {
									budgetDept: dept,		// 成本中心
									budgetSubject: subject	// 预算科目
								};
								var index = 2;
								var itemAmount = 0;
								for (var m = 0; m < 12; m++) {	// 1~12月每月的金额
									var a = values[ index++ ] || 0;
									item[ "propertyN" + (50 + m) ] = a;
									itemAmount += a;
								}
								amount += itemAmount;
								item.amount = itemAmount;
								item.remarks = values[ index ] || '';
								items.push(item);
							});
							
							if (msg) {
								return false;
							}

							angular.forEach(fileData, function(fileDat, idx) {
								files.push({	// 附件
									name: fileItem.file.name,
									status: app.status.valid,
									fileData: fileDat,
									fileId: fileDat.id,
									dept: { id: entity.dept.id },
									company: { id: entity.company.id },
									application: { id: entity.id }
								});
							});

							entity.amount = amount;
						});
				}
			}
		});
		current.title = "budget.upload";
		var doAdd = $scope.doAdd;
		$scope.doAdd = function(id) {
			doAdd(id);
			current.entity.propertyN00 = app.currentMonth.year || '';	// 预算年份默认为当前年份
		}
	}
	controller.$inject = [ "$scope", "$rootScope", "$window", "$http", "$q", "$timeout", "ProcessService", "DeptService", "DictionaryService", "BudgetSubjectService", "LocaleService" ];
	controller.$name = "BudgetUploadController"; // 可以省略，系统会默认以"模块名+Service"进行注册.

	return {
		controller : controller
	};
});