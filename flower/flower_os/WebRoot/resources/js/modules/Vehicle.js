"use strict";
(function(factory) {
	define("Vehicle", [ "angular", "jquery", "app.expense.controller", "Dictionary" ], function(ng, $, ctrl, Dictionary) {
		return factory.apply(this, arguments);
	});
})(function factory(ng, $, ctrl, Dictionary) {
	var VehicleController = function($scope, $injector) {
		// 要继承的外部方法，通过注入$injector可得到所有可注入的service
		ctrl.query($scope, $injector);
	};
	VehicleController.$inject = [ "$scope", "$injector", "$rootScope" ];

	var VehicleViewController = function($scope, $injector, ProcessConstants) {
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
	VehicleViewController.$inject = [ "$scope", "$injector", "ProcessConstants", "$rootScope" ];

	var saveController = function($q, $scope, $injector, DictionaryService) {
		var current = $scope.current;
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
			edit : function(entity) {
				var entity = $.extend(true, {}, entity);
				ng.forEach(entity.items, function(item) {
					item.advanceType = {
						code : item.propertyC04
					};
					item.vehicle = {
						code : item.propertyC01
					};
				});
				current.entity = entity;
			},
			
			changeAdvanceType : function(item) {
				// 车辆类型或车辆费用类型变化后，修改预设科目
				var deferred = $q.defer();
				if (item.advanceType) {
					item.propertyC04 = item.advanceType.code; // 预支类型代码
					item.budgetSubject = {
					};
					if('2' == item.propertyC00){
						// 私人
						item.budgetSubject.id = item.advanceType.propertyC02;
					} else if('1' == item.propertyC00) {
						// 租用
						item.budgetSubject.id = item.advanceType.propertyC01;
					} else if('0' == item.propertyC00) {
						// 公司
						item.budgetSubject.id = item.advanceType.propertyC00;
					}
				}
				return deferred.promise;
			}, 
			changeVehicleType : function(target, items) {
				// 私人车辆与“公司自有、公司租用”不能一起报
				var vehicleType = {};
				for(var index in items) {
					if(items[index].propertyC00){
						vehicleType[items[index].propertyC00] = items[index].propertyC00;
					}
				}
				var vehicleTypeArray = [];
				for(var key in vehicleType){
					vehicleTypeArray.push(key);
				}
				
				if(vehicleTypeArray.indexOf('2') > -1 && vehicleTypeArray.length > 1) {
					target.item.propertyC00 = undefined;
					alert('私人车辆与“公司自有、公司租用”不能一起报');
				}
			}, 
			changeVehicle : function(item){
				// 车辆类型或车辆费用类型变化后，修改预设科目
				var deferred = $q.defer();
				if (item.vehicle) {
					item.propertyC01 = item.vehicle.code; // 预支类型代码
					item.propertyC00 = item.vehicle.propertyC00;
					item.propertyC02 = item.vehicle.propertyT00;
					item.propertyC03 = item.vehicle.name;
				}
				return deferred.promise;
			},
			findCode : function(item){
				if(item.propertyC01) {
					var params = {
							type : 'vehicle'
					};
					DictionaryService.testCode(params, item.propertyC01).then(function(list){
						if(list.length > 0){
							var row = list[0];
							item.propertyC00 = row.propertyC00;
							item.propertyC02 = row.propertyT00;
							item.propertyC03 = row.name;
						}
					});
				}
			}
		};
	}
	
	var VehicleAddController = function($q, $scope, $injector, DictionaryService) {
		ctrl.add($scope, $injector, saveController($q, $scope, $injector, DictionaryService));
	};
	VehicleAddController.$inject = ["$q", "$scope", "$injector", "DictionaryService" ];

	var VehicleEditController = function($q, $scope, $injector, DictionaryService) {
		ctrl.edit($scope, $injector, saveController($q, $scope, $injector, DictionaryService));
	};
	VehicleEditController.$inject = ["$q", "$scope", "$injector", "DictionaryService" ];

	return {
		controllers : {
			"VehicleController" : VehicleController,
			"VehicleViewController" : VehicleViewController,
			"VehicleAddController" : VehicleAddController,
			"VehicleEditController" : VehicleEditController
		}
	}
});