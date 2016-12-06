/** 使用smart-table的自定义组件 */
(function() {
	'use strict';

var deps = [ "angular", "jquery", "DriectiveHelper", "smart-table" ];
define("ui.table", deps, function(angular, $, Helper) {

	var module = angular.module("ui.table", [ "smart-table" ]);

	/** 添加多选框 */
	module.directive('uiTableSelect', [ "stConfig", '$parse', function(stConfig, $parse) {
		return {
			require : '^stTable',
			template : '<input type="checkbox" ng-model="row.isSelected" />',
			scope : {
				row : '=uiTableSelect',
				selected : '=selectedRows'	// 以选择的数据,应该是在$scope中预先定义的数组
			},
			link : function($scope, element, attr, ctrl) {
				$(element).addClass('text-center');
				element.bind('change', function(evt) {
					$scope.$apply(function() {
						ctrl.select($scope.row, 'multiple');
					});
				});
				$scope.$watch('row.isSelected', function(newValue, oldValue) {
					if (newValue === true) {
						element.parent().addClass(stConfig.select.selectedClass);
						if ($scope.selected) $scope.selected.push($scope.row);
					} else {
						element.parent().removeClass(stConfig.select.selectedClass);
						if ($scope.selected) $scope.selected.remove($scope.row);
					}
				});
			}
		};
	} ]);
	
	/** 添加全选框 */
	module.directive('uiTableSelectAll', [ "stConfig", '$parse', function(stConfig, $parse) {
		return {
			require : '^stTable',
			template : '<input type="checkbox"/>',
			scope : {
				rows : '=uiTableSelectAll'
			},
			link : function($scope, element, attr, ctrl) {
				$(element).addClass('text-center');
				element.bind('change', function(evt) {
					var selected = $(':checkbox', element)[0].checked;
					$scope.$apply(function() {
						angular.forEach($scope.rows, function(row) {
							ctrl.select(row, 'multiple', selected);
						});
					});
				});
			}
		};
	} ]);
});
})();