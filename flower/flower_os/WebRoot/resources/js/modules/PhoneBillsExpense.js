"use strict";
(function(factory) {
	define("PhoneBillsExpense", [ "angular", "jquery", "app.expense.controller", "Dictionary" ], function(ng, $, ctrl, Dictionary) {
		return factory.apply(this, arguments);
	});
})(function factory(ng, $, ctrl, Dictionary) {
	
	var ns = "/expense/phoneBills";
	
	var PhoneBillsExpenseController = function($scope, $injector) {
		// 要继承的外部方法，通过注入$injector可得到所有可注入的service
		ctrl.query($scope, $injector);
	};
	PhoneBillsExpenseController.$inject = [ "$scope", "$injector", "$rootScope" ];

	var PhoneBillsExpenseViewController = function($scope, $injector, ProcessConstants) {
		var STATUS = ProcessConstants.STATUS;
		ctrl.view($scope, $injector, {
			/** 是否可报销 */
			canExpense: function(entity) {
				return entity && STATUS.APPROVED == entity.status && entity.relationAmount > 0;
			},
			/** 报销 */
			addExpense: function(id) {
				
			},
			/** 是否可签订合同 */
			canContract: function(entity) {
				return entity && STATUS.APPROVED == entity.status;
			},
			/** 签订合同 */
			addContract: function(id) {
				
			}
		});
	};
	PhoneBillsExpenseViewController.$inject = [ "$scope", "$injector", "ProcessConstants", "$rootScope" ];

	var saveController = function($q, $scope, $injector, $http, DictionaryService) {
		var current = $scope.current;
		current.maxAmount = 0;
		
		// 用户报销电话费标准需要先审批后报销
		$scope.$watch('current.entity.user.id', function(){
			
			// 先查询用户报销标准代码
			var params = {
					type : 'phoneBillsExpense',
					propertyC00 : current.entity.user.id,
					pageSize : -1
			};
			DictionaryService.query(params).then(function(list){
				if(list.length > 0){
					
					// 查询用户报销标准最高金额
					var params2 = {
							type : 'phoneExpense',
							code : list[0].code,
							pageSize : -1
					};
					DictionaryService.query(params2).then(function(list2){
						if(list2.length > 0){
							current.maxAmount = list2[0].propertyN50;
						} else {
							current.maxAmount = 0;
						}
					});
				}
			});
		});
		
		return {
			newItem: function(item) {
				var entity = $scope.current.entity;
				item = $.extend(true, { }, item, {});
				if (!ng.isUndefined(item.id)) delete item.id;
				return item;
			},
			/**
			 * 编辑数据
			 * 
			 * @param entity 已查询出详细信息的数据
			 */
//			edit : function(entity) {
//				var entity = $.extend(true, {}, entity);
//				ng.forEach(entity.items, function(item) {
//					item.advanceType = {
//						code : item.propertyC04
//					};
//					item.vehicle = {
//						code : item.propertyC01
//					};
//				});
//				current.entity = entity;
//			},
			
			changeMonth : function(item) {
				// 如果同一个归属期已经申请“移动电话费“，则不允许再次申请
				if (item.propertyD01) {
					var args = {
						id : current.entity.id,
						userIds : [current.entity.user.id],
						propertyD01 : item.propertyD01
					};
					$http.post(DictionaryService.url("/existTerm.do", ns), args).success(function(res) {
						if(res) {
							item.propertyD01 = null;
							alert('同一归属期不允许重复报销！');
						}
					});
				}
			}, 
//			changePhoneBillsType : function(target, items) {
//				// 私人车辆与“公司自有、公司租用”不能一起报
//				var vehicleType = {};
//				for(var index in items) {
//					if(items[index].propertyC00){
//						vehicleType[items[index].propertyC00] = items[index].propertyC00;
//					}
//				}
//				var vehicleTypeArray = [];
//				for(var key in vehicleType){
//					vehicleTypeArray.push(key);
//				}
//				
//				if(vehicleTypeArray.indexOf('2') > -1 && vehicleTypeArray.length > 1) {
//					target.item.propertyC00 = undefined;
//					alert('私人车辆与“公司自有、公司租用”不能一起报');
//				}
//			}, 
//			changePhoneBills : function(item){
//				// 车辆类型或车辆费用类型变化后，修改预设科目
//				var deferred = $q.defer();
//				if (item.vehicle) {
//					item.propertyC01 = item.vehicle.code; // 预支类型代码
//					item.propertyC00 = item.vehicle.propertyC00;
//					item.propertyC02 = item.vehicle.propertyT00;
//					item.propertyC03 = item.vehicle.name;
//				}
//				return deferred.promise;
//			},
//			findCode : function(item){
//				if(item.propertyC01) {
//					var params = {
//							type : 'vehicle'
//					};
//					DictionaryService.testCode(params, item.propertyC01).then(function(list){
//						if(list.length > 0){
//							var row = list[0];
//							item.propertyC00 = row.propertyC00;
//							item.propertyC02 = row.propertyT00;
//							item.propertyC03 = row.name;
//						}
//					});
//				}
//			}
		};
	}
	
	var PhoneBillsExpenseAddController = function($q, $scope, $injector, $http, DictionaryService) {
		ctrl.add($scope, $injector, saveController($q, $scope, $injector, $http, DictionaryService));
	};
	PhoneBillsExpenseAddController.$inject = ["$q", "$scope", "$injector", "$http", "DictionaryService" ];

	var PhoneBillsExpenseEditController = function($q, $scope, $injector, $http, DictionaryService) {
		ctrl.edit($scope, $injector, saveController($q, $scope, $injector, $http, DictionaryService));
	};
	PhoneBillsExpenseEditController.$inject = ["$q", "$scope", "$injector", "$http", "DictionaryService" ];

	return {
		controllers : {
			"PhoneBillsExpenseController" : PhoneBillsExpenseController,
			"PhoneBillsExpenseViewController" : PhoneBillsExpenseViewController,
			"PhoneBillsExpenseAddController" : PhoneBillsExpenseAddController,
			"PhoneBillsExpenseEditController" : PhoneBillsExpenseEditController
		}
	}
});