(function(factory) {
	"use strict";
	var deps = [ "angular", "jquery" ];
	define("app.user", deps, function(angular, $) {
		return factory(window.app, angular, $);
	});
})(function(app, angular, $, Helper) {
	"use strict";
	var service = function(UserService, LocaleService) {
		return {
			/**
			 * 将参数转为显示的字符串
			 * 
			 * @param dict 要显示的参数
			 * @param properties 要显示的字段,可省略,默认为name
			 * @param separator 多个字段间的分隔符,可省略,默认为-
			 */
			show : function(dict, properties, separator) {
				if (!dict) return "";
				properties = properties || [ 'name' ]; // showProperty可以为字符串或数组
				if (angular.isString(properties)) properties = properties.split(/\s*,\s*/);
				separator = separator || '-';
				var value = '';
				angular.forEach(properties, function(property) {
					var v = dict[property];
					if (angular.isUndefined(v) || v === null) v = '';
					if (property == 'name' && dict.i18nKey) {
						// name可能需要国际化
						v = LocaleService.get(dict.i18nKey) || v;
					}
					value += (value ? ' - ' : '') + v;
				});
				return value;
			}
		};
	};
	service.$name = "AppUserService";
	service.$inject = [ "UserService", "LocaleService" ]

	/** 定义多个controller */
	var controllers = {
		UserShowController : [ "$scope", '$element', '$attrs', "UserionaryService", "UserService",
			function($scope, $element, $attrs, UserionaryService, UserService) {
				UserService.get($scope.code).then(function(dict) {
					$scope.showValue = UserService.show(dict, $scope.property || [ "name" ], $scope.separator);
				});
			} ],
		UserCheckController : [ "$scope", '$element', '$attrs', "$parse", "UserionaryService", "UserService",
			function($scope, $element, $attrs, $parse, UserionaryService, UserService) {
				$scope.dicts = []; // 参数列表
				
				this.init = function() {
					UserionaryService.get($scope.type).then(function(dicts) {
						$scope.dicts = dicts;
						if (!$scope.radio && $scope.fieldValue) {
							// 初始化已选中的值,外部修改则不进行监控
							var arr = $scope.fieldValue;
							if (!angular.isArray(arr)) arr = [ arr ];
							angular.forEach(dicts, function(dict) {
								var v = $scope.getValue(dict);
								$.each(arr, function(i, a) {
									if (v == a) {
										dict.checked = true;
										return false;
									}
								});
							});
						}
					});
				}
				$scope.inline = $scope.showInline !== false;	// 如果showInline有定义,则无法直接覆盖showInline的值
				$.extend($scope, {
					/** 得到单个dict对应的value */
					getValue : function(dict) {
						return UserService.show(dict, $scope.property || [ "code"], $scope.separator);
					},
					/** 得到参数dict的显示 */
					show : function(dict) {
						return UserService.show(dict, $scope.showProperty || [ "name" ], $scope.separator);
					},
					/** 得到所有选择的参数的values */
					getValues: function() {
						var values = [];
						angular.forEach($scope.dicts, function(dict) {
							if (dict.checked) {
								values.push($scope.getValue(dict));
							}
						});
						return values;
					},
					/** 设置选中的值为dict */
					setValue : function(dict) {
						if ($scope.radio) {
							$scope.fieldValue = $scope.getValue(dict);
						} else {
							$scope.setValues();
						}
					},
					
					/** 为checkbox绑定的ng-change事件,设置值 */
					setValues : function() {
						var values = $scope.getValues();
						$scope.fieldValue = values;
					}
				});
			} ]
	};

	/* 定义指令 */
	var directives = {
		appUser : function() {
			return {
				restrict : "A",
				scope : {
					code: "=appUser",	// 与上级$scope进行双向绑定的对象
					type : "@dictType", 		// 参数类型,必须,@修饰的字段,如果是绑定上级$scope内的属性,需要使用{{}}
					property: "@dictProperty", // 设定值时使用的字段,默认为code
					separator: "@separator"			// 如果要设置的值为多个字段,字段内容的分隔,默认为-
				},
				template : "{{ showValue }}",
				controller : "UserShowController",
				link : function($scope, element, attrs, ctrl) {
					$(element).addClass('app-dict-show');
				}
			}
		},
		appUserReplace : function() { // 显示节点会被替换
			return {
				restrict : "A",
				scope : {
					code: "=appUserReplace",	// 与上级$scope进行双向绑定的对象
					type : "@dictType", 		// 参数类型,必须,@修饰的字段,如果是绑定上级$scope内的属性,需要使用{{}}
					property: "@dictProperty", // 设定值时使用的字段,默认为code
					separator: "@separator"			// 如果要设置的值为多个字段,字段内容的分隔,默认为-
				},
				template : "{{ showValue }}",
				replace : true,
				controller : "UserShowController"
			}
		}
	}

	return {
		service : service,
		controllers : controllers,
		directives : directives
	};
});