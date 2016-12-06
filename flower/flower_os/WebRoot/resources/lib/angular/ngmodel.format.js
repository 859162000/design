/***********************************************************************************************************************
 * * Auth: green gerong * Date: 2012 * blog: http://greengerong.github.io/ * github: https://github.com/greengerong * *
 **********************************************************************************************************************/

'use strict';

(function(gobal, angular) {

	/** 将value转换为double小数 */
	var doubleValue = function(value) {
		if (Mortal.isString(value)) value = value.replaceAll(",", "");
		if (Number.isNumber(value)) {
			return Number.doubleValue(value);
		}
		return 0;
	}
	/** 将value转换为int小数 */
	var intValue = function(value) {
		if (Mortal.isString(value)) value = value.replaceAll(",", "");
		if (Number.isNumber(value)) {
			return Number.intValue(value);
		}
		return 0;
	}

	var config = {
		"currency" : {
			"formatter" : function(args) {
				var modelValue = args.$modelValue, filter = args.$filter, attrs = args.$attrs, $eval = args.$eval;
				var val = filter("currency")(modelValue, attrs.symbol);
				return val;
			},
			"parser" : function(args) {
				return doubleValue(args.$viewValue);
			},
			"isEmpty" : function(value) {
				return !value.$modelValue;
			},
			"keyDown" : function(args) {
				var event = args.$event, viewValue = args.$viewValue, modelValue = args.$modelValue;

				if (!(smallKeyBoard(event) || numberKeyBoard(event) || functionKeyBoard(event)
						|| currencyKeyBoard(event, viewValue) || floatKeyBoard(event, viewValue))) {
					event.stopPropagation();
					event.preventDefault();
				}
			},
			
			"focus": function(args) {
				var modelValue = args.$modelValue;
				var $element = args.$element;
				$element.val(isNaN(modelValue) ? '' : modelValue);
			}
		},
		"int" : {
			"formatter" : function(args) {
				var modelValue = args.$modelValue, filter = args.$filter;
				if (Mortal.isString(modelValue)) modelValue = intValue(modelValue);
				return filter("number")(modelValue, 0);
			},
			"parser" : function(args) {
				return intValue(args.$viewValue);
			},
			"isEmpty" : function(value) {
				return !value.$modelValue;
			},
			"keyDown" : function(args) {
				var event = args.$event, viewValue = args.$viewValue;
				if (!(smallKeyBoard(event) || minus(event) || numberKeyBoard(event) || functionKeyBoard(event))) {
					event.stopPropagation();
					event.preventDefault();
				}
			},
			
			"focus": function(args) {
				var modelValue = args.$modelValue;
				var $element = args.$element;
				$element.val(isNaN(modelValue) ? '' : modelValue);
			}
		},
		"number" : {
			"formatter" : function(args) {
				var modelValue = args.$modelValue, filter = args.$filter, attrs = args.$attrs, precision = attrs.precision;
				if (Mortal.isString(modelValue)) modelValue = doubleValue(modelValue);
				if (!precision) {
					return filter("number")(modelValue);
				} else {
					return filter("number")(modelValue, intValue(precision));
				}
			},
			"parser" : function(args) {
				var attrs = args.$attrs;
				var precision = attrs.precision;
				if (precision) {
					if (precision == 0) {
						return intValue(args.$viewValue);
					}
					return parseFloat(doubleValue(args.$viewValue).toFixed(precision));
				}
				return doubleValue(args.$viewValue);
			},
			"isEmpty" : function(value) {
				return !value.$modelValue;
			},
			"keyDown" : function(args) {
				var event = args.$event, viewValue = args.$viewValue;

				var which = event.which;
				if (!(keyHelper.smallKeyBoard(event) || keyHelper.numberKeyBoard(event) || minus(event)
						|| functionKeyBoard(event) || (which == 45 || which == 189) || floatKeyBoard(event, viewValue))) {
					event.stopPropagation();
					event.preventDefault();
				}
			},
			
			"focus": function(args) {
				var modelValue = args.$modelValue;
				var $element = args.$element;
				$element.val(isNaN(modelValue) ? '' : modelValue);
			}
		},
		"amount" : {
			"formatter" : function(args) {
				var modelValue = args.$modelValue, filter = args.$filter;
				if (Mortal.isString(modelValue)) modelValue = doubleValue(modelValue);
				return modelValue === 0 ? "" : filter("number")(modelValue, 2);
			},
			"parser" : function(args) {
				return parseFloat(doubleValue(args.$viewValue).toFixed(2));
			},
			"isEmpty" : function(value) {
				return !value.$modelValue;
			},
			"keyDown" : function(args) {
				var event = args.$event;

				var which = event.which, viewValue = args.$viewValue;
				if (!(smallKeyBoard(event) || numberKeyBoard(event) || minus(event)
						|| functionKeyBoard(event) || (which == 45 || which == 189) || floatKeyBoard(event))) {
					event.stopPropagation();
					event.preventDefault();
				}
			},
			
			"focus": function(args) {
				var modelValue = args.$modelValue;
				var $element = args.$element;
				$element.val(isNaN(modelValue) ? '' : modelValue);
			}
		},
		"boolean" : {
			"formatter" : function(args) {
				var modelValue = args.$modelValue;
				if (!angular.isUndefined(modelValue)) {
					return modelValue.toString();
				}
			},
			"parser" : function(args) {
				var viewValue = args.$viewValue;
				if (!angular.isUndefined(viewValue)) {
					return viewValue.trim() === "true";
				}
			},
			"isEmpty" : function(value) {
				return angular.isUndefined(value);
			}
		}
	};
	config.double = config.number;

	angular.module('ngmodel.format', []).constant("modelFormatConfig", config).directive("modelFormat",
			[ "modelFormatConfig", "$filter", "$parse", function(modelFormatConfig, $filter, $parse) {
				return {
					require : 'ngModel',
					link : function(scope, element, attrs, ctrl) {
						var config = modelFormatConfig[attrs.modelFormat] || {};

						var parseFuction = function(funKey) {
							if (attrs[funKey]) {
								var func = $parse(attrs[funKey]);
								return (function(args) {
									return func(scope, args);
								});
							}
							return config[funKey];
						};

						var formatter = parseFuction("formatter");
						var parser = parseFuction("parser");
						var isEmpty = parseFuction("isEmpty");
						var keyDown = parseFuction("keyDown");
						var getModelValue = function() {
							return $parse(attrs.ngModel)(scope);
						};

						if (keyDown) {
							element.bind("keydown", function(event) {
								keyDown({
									"$event" : event,
									"$viewValue" : element.val(),
									"$modelValue" : getModelValue(),
									"$attrs" : attrs,
									"$eval" : scope.$eval,
									"$ngModelCtrl" : ctrl
								});
							});
							
						}

						var focus = parseFuction("focus");
						if (focus) {
							element.bind("focus", function(event) {
								focus({
									"$element": element,
									"$event" : event,
									"$viewValue" : element.val(),
									"$modelValue" : getModelValue(),
									"$attrs" : attrs,
									"$eval" : scope.$eval,
									"$ngModelCtrl" : ctrl
								});
							});
						}

						element.bind("blur", function() {
							element.val(formatter({
								"$modelValue" : element.val(),
								"$filter" : $filter,
								"$attrs" : attrs,
								"$eval" : scope.$eval
							}));
						});
						ctrl.$parsers.unshift(function(viewValue) {
							return parser({	// 第一个将字符串转为数字
								"$viewValue" : viewValue,
								"$attrs" : attrs,
								"$eval" : scope.$eval
							});
						});

						ctrl.$formatters.unshift(function(value) {	// 最后个格式化为字符串
							return formatter({
								"$modelValue" : value,
								"$filter" : $filter,
								"$attrs" : attrs,
								"$eval" : scope.$eval
							});
						});

						ctrl.$isEmpty = function(value) {
							return isEmpty({
								"$modelValue" : value,
								"$attrs" : attrs,
								"$eval" : scope.$eval
							});
						};
					}
				};
			} ]).directive("checkBoxToArray", [

	function() {
		return {
			restrict : "A",
			require : "ngModel",
			link : function(scope, element, attrs, ctrl) {
				var value = scope.$eval(attrs.checkBoxToArray);
				ctrl.$parsers.push(function(viewValue) {
					var modelValue = ctrl.$modelValue ? angular.copy(ctrl.$modelValue) : [];
					if (viewValue === true && modelValue.indexOf(value) === -1) {
						modelValue.push(value);
					}

					if (viewValue !== true && modelValue.indexOf(value) != -1) {
						modelValue.splice(modelValue.indexOf(value), 1);
					}

					return modelValue.sort();
				});

				ctrl.$formatters.push(function(modelValue) {
					return modelValue && modelValue.indexOf(value) != -1;
				});

				ctrl.$isEmpty = function($modelValue) {
					return !$modelValue || $modelValue.length === 0;
				};
			}
		}
	} ]);

	var smallKeyBoard = function(event) {
		var which = event.which;
		return (which >= 96 && which <= 105);
	};

	var numberKeyBoard = function(event) {
		var which = event.which;
		return (which >= 48 && which <= 57) && !event.shiftKey;
	};

	var functionKeyBoard = function(event) {
		var which = event.which;
		return (which <= 40) || (which == 46) || (navigator.platform.indexOf("Mac") > -1 && event.metaKey)
				|| (navigator.platform.indexOf("Win") > -1 && event.ctrlKey);
	};

	var currencyKeyBoard = function(event, viewValue) {
		var which = event.which;
		return (viewValue.toString().indexOf('$') === -1 && which === 52 && event.shiftKey);
	};

	var floatKeyBoard = function(event, viewValue) {
		var which = event.which;
		return [ 188 ].indexOf(which) != -1 || (which === 190 || which === 110)
				&& (!viewValue || viewValue.toString().indexOf('.') === -1);
	}

	var minus = function(event) {
		var which = event.which;
		return (which == 45 || which == 189);
	};

	gobal.keyHelper = {
		smallKeyBoard : smallKeyBoard,
		numberKeyBoard : numberKeyBoard,
		functionKeyBoard : functionKeyBoard,
		currencyKeyBoard : currencyKeyBoard,
		floatKeyBoard : floatKeyBoard,
		minus : minus
	// 负号
	};

})(this, angular);
