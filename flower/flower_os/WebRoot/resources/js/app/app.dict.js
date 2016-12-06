(function(factory) {
	"use strict";
	var deps = [ "angular", "jquery" ];
	define("app.dict", deps, function(angular, $) {
		return factory(window.app, angular, $);
	});
})(function(app, angular, $, Helper) {
	"use strict";
	var service = function(DictionaryService, LocaleService) {
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
	service.$name = "DictService";
	service.$inject = [ "DictionaryService", "LocaleService" ]

	var getMethods = function($scope, $element, $attrs, $parse, DictionaryService, DictService) {
		return {
			/** 得到单个dict对应的value */
			getValue : function(dict) {
				return DictService.show(dict, $scope.property || [ "code"], $scope.separator);
			},
			/** 得到参数dict的显示 */
			show : function(dict) {
				return DictService.show(dict, $scope.showProperty || [ "name" ], $scope.separator);
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
		};
	};
	/** 定义多个controller */
	var controllers = {
		DictShowController : [ "$scope", '$element', '$attrs', "DictionaryService", "DictService",
			function($scope, $element, $attrs, DictionaryService, DictService) {
				function init() {
					if ($scope.type && $scope.code) {
						DictionaryService.get($scope.type, $scope.code, { status: null }).then(function(dict) {
							$scope.showValue = DictService.show(dict, $scope.property || [ "name" ], $scope.separator);
						});
					} else {
						$scope.showValue = '';
					}
				}
				$scope.$watch('code', function(newValue, oldValue) { 
					if (newValue != oldValue) {
						init();
					}
				});
				init();
			} ],
		DictCheckController : [ "$scope", '$element', '$attrs', "$parse", "DictionaryService", "DictService",
			function($scope, $element, $attrs, $parse, DictionaryService, DictService) {
				$scope.dicts = []; // 参数列表
				
				this.init = function() {
					DictionaryService.get($scope.type).then(function(dicts) {
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
				$.extend($scope, getMethods($scope, $element, $attrs, $parse, DictionaryService, DictService));
			} ],
			
		/** 下拉列表 */
		DictSelectController : [ "$scope", '$element', '$attrs', "$parse", "DictionaryService", "DictService",
			function($scope, $element, $attrs, $parse, DictionaryService, DictService) {
				$scope.dicts = []; // 参数列表
				
				this.init = function() {
					DictionaryService.get($scope.type).then(function(dicts) {
						$scope.dicts = dicts;
						angular.forEach(dicts, function(dict) {
							dict[ "fieldValue" ] = $scope.getValue(dict);
							dict[ "fieldText" ] = $scope.show(dict);
						});
					});
				}
				$scope.multiple = $scope.multiple !== false;
				$scope.showHeader = $scope.showHeader !== true;
				$.extend($scope, getMethods($scope, $element, $attrs, $parse, DictionaryService, DictService));
			} ]
	};

	/* 定义指令 */
	var directives = {
		appDict : function() {
			return {
				restrict : "A",
				scope : {
					code: "=appDict",	// 与上级$scope进行双向绑定的对象
					type : "@dictType", 		// 参数类型,必须,@修饰的字段,如果是绑定上级$scope内的属性,需要使用{{}}
					property: "@dictProperty", // 设定值时使用的字段,默认为code
					separator: "@separator"			// 如果要设置的值为多个字段,字段内容的分隔,默认为-
				},
				template : "{{ showValue }}",
				controller : "DictShowController",
				link : function($scope, element, attrs, ctrl) {
					$(element).addClass('app-dict-show');
				}
			}
		},
		appDictReplace : function() { // 显示节点会被替换
			return {
				restrict : "A",
				scope : {
					code: "=appDictReplace",	// 与上级$scope进行双向绑定的对象
					type : "@dictType", 		// 参数类型,必须,@修饰的字段,如果是绑定上级$scope内的属性,需要使用{{}}
					property: "@dictProperty", // 设定值时使用的字段,默认为code
					separator: "@separator"			// 如果要设置的值为多个字段,字段内容的分隔,默认为-
				},
				template : "{{ showValue }}",
				replace : true,
				controller : "DictShowController"
			}
		},
		appDictRadioX : function() { // 单选
			return {
				restrict : "A",
				scope : {
					fieldValue: "=appDictRadio",	// 与上级$scope进行双向绑定的对象
					linkFieldName: "@fieldName",	// 设置单选框的name,可以省略.如果使用@定义的字段,只要有属性,都无法覆盖其值
					type : "@dictType", 		// 参数类型,必须,@修饰的字段,如果是绑定上级$scope内的属性,需要使用{{}}
					property: "@dictProperty", // 设定值时使用的字段,默认为code
					showProperty : "@dictShowProperty", // 显示值时使用的字段,默认为name
					separator: "@separator",			// 如果要设置的值为多个字段,字段内容的分隔,默认为-
					showInline: '=showInline'					// 是否在一行内显示,默认为true
				},
				templateUrl : app.url('/resources/template/directives/app-dict-radio.html'),
				// require: [ 'appDictRadio' ],
				controller : "DictCheckController",
				link : function($scope, element, attrs, ctrl) {
					$(element).addClass('app-dict-radio');
					$scope.radio = true;
					$scope.fieldName = $scope.linkFieldName;		// 如果linkFieldName有定义,则无法直接覆盖linkFieldName的值
					if (!$scope.fieldName) {
						$scope.fieldName = 'dict_radio_' + Math.round(Math.random() * Math.pow(10, 10));
					}
					ctrl.init();
				}
			}
		},
		appDictCheckbox : function() { // 多选
			return {
				restrict : "A",
				scope : {
					fieldValue: "=appDictCheckbox",	// 与上级$scope进行双向绑定的对象
					linkFieldName: "@fieldName",	// 设置单选框的name,可以省略.如果使用@定义的字段,只要有属性,都无法覆盖其值
					type : "@dictType", 		// 参数类型,必须,@修饰的字段,如果是绑定上级$scope内的属性,需要使用{{}}
					property: "@dictProperty", // 设定值时使用的字段,默认为code
					showProperty : "@dictShowProperty", // 显示值时使用的字段,默认为name
					separator: "@separator",			// 如果要设置的值为多个字段,字段内容的分隔,默认为-
					showInline: '=showInline'					// 是否在一行内显示,默认为true
				},
				templateUrl : app.url('/resources/template/directives/app-dict-checkbox.html'),
				// require: [ 'appDictRadio' ],
				controller : "DictCheckController",
				link : function($scope, element, attrs, ctrl) {
					$(element).addClass('app-dict-radio');
					$scope.radio = false;
					$scope.fieldName = $scope.linkFieldName;		// 如果linkFieldName有定义,则无法直接覆盖linkFieldName的值
					if (!$scope.fieldName) {
						$scope.fieldName = 'dict_checkbox_' + Math.round(Math.random() * Math.pow(10, 10));
					}
					ctrl.init();
				}
			}
		},
		appDictSelect : function() { // 下拉列表
			return {
				restrict : "A",
				scope : {
//					fieldValue: "=appDictSelect",	// 与上级$scope进行双向绑定的对象
//					linkFieldName: "@fieldName",	// 设置单选框的name,可以省略.如果使用@定义的字段,只要有属性,都无法覆盖其值
//					type : "@dictType", 		// 参数类型,必须,@修饰的字段,如果是绑定上级$scope内的属性,需要使用{{}}
//					property: "@dictProperty", // 设定值时使用的字段,默认为code
//					showProperty : "@dictShowProperty", // 显示值时使用的字段,默认为name
//					separator: "@separator",			// 如果要设置的值为多个字段,字段内容的分隔,默认为-
//					multiple: "=multiple",				// 可否多选,暂时未实现此参数
//					showHeader: '=showHeader'			// 是否需要第一个空的option,默认为false
						

					model : '=appDictSelect', // 绑定的外部数据
					defaultValue: '=defaultValue',
					linkFieldName: '@fieldName', // 绑定到select的name
					type : "@dictType",
					// url : '=url', // 加载数据的URL
					dictArgs : '=args', // 请求参数
					required: '=required',	// 是否必须
					options : '=options',	// 设置参数
					isUseProperty: "@useProperty",	// option的值是否使用数据的字段,如果为false,则option绑定的model就是查询到的对象
					className : "@className", // select的样式,多个之间用逗号隔开
					valProperty : "@property", // 设定值时使用的字段,默认为code
					showProperty : "@showProperty", // 显示值时使用的字段,默认为code + name
					separator : "@separator", // 如果要设置的值为多个字段,字段内容的分隔,默认为-
					change : "&change",	// onchange事件
					showHeader : '=header'	// 第一个option显示的数据,可以为boolean或者String/JSON{value: xxx, text: xxx}
				},
				templateUrl : app.url('/resources/template/directives/app-select.html'),
				controller : "AppSelectController",	// "DictSelectController",
				link : function($scope, element, attrs, ctrl) {
					$(element).addClass('app-dict-select');
					$scope.fieldName = $scope.linkFieldName;		// 如果linkFieldName有定义,则无法直接覆盖linkFieldName的值
					if (!$scope.fieldName) {
						$scope.fieldName = 'dict_select_' + Math.round(Math.random() * Math.pow(10, 10));
					}
					$scope.url = "/setting.do";
					var args = $scope.dictArgs || { };
					args.type = $scope.type;
					$scope.args = args;
					$scope.property = $scope.valProperty || 'code';
					// ctrl.init();
					ctrl.load();
				}
			}
		},

		appDictRadio : function() { // 单选
			return {
				restrict : "A",
				scope : {
					model : '=appDictRadio', // 绑定的外部数据
					defaultValue: '=defaultValue',
					linkFieldName: '@fieldName', // 绑定到select的name
					type : "@dictType",
					dictArgs : '=args', // 请求参数
					ngRequired: '@required',	// 是否必须
					options : '=options',	// 设置参数
					isUseProperty: "@useProperty",	// option的值是否使用数据的字段,如果为false,则option绑定的model就是查询到的对象
					className : "@className", // select的样式,多个之间用逗号隔开
					valProperty : "@property", // 设定值时使用的字段,默认为code
					showProperty : "@showProperty", // 显示值时使用的字段,默认为code + name
					separator : "@separator", // 如果要设置的值为多个字段,字段内容的分隔,默认为-
					change : "&change",	// onchange事件
					showInline: '=showInline'					// 是否在一行内显示,默认为true
				},
				templateUrl : app.url('/resources/template/directives/app-radio.html'),
				controller : "AppCheckController",	// "DictSelectController",
				link : function($scope, element, attrs, ctrl) {	// link中的代码在controller后执行
					$(element).addClass('app-dict-radio');
					$scope.fieldName = $scope.linkFieldName;		// 如果linkFieldName有定义,则无法直接覆盖linkFieldName的值
					if (!$scope.fieldName) {
						$scope.fieldName = 'dict_radio_' + Math.round(Math.random() * Math.pow(10, 10));
					}
					$scope.url = "/setting.do";
					var args = $scope.dictArgs || { };
					args.type = $scope.type;
					$scope.args = args;
					$scope.property = $scope.valProperty || 'code';
					ctrl.init(true);
				}
			}
		}
	};

	return {
		service : service,
		controllers : controllers,
		directives : directives
	};
});