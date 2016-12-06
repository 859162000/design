(function(factory) {
	"use strict";
	var deps = [ "angular", "text!i18n", "jquery", "DriectiveHelper", "angular-translate", "ngCookies" ];
	define("app.locale", deps, function(angular, data, $, Helper) {
		var data = angular.fromJson(data);
		return factory(window.app, angular, data, $, Helper);
	});
})(function(app, angular, data, $, Helper) {
	"use strict";
	/** 定义模块 */
	var module = angular.module("app.locale", [ "pascalprecht.translate", "ngCookies" ]);
	module.config([ "$translateProvider", function($translateProvider) {
		var locale = app.locale || "zh-cn";
		$translateProvider.translations(app.locale, data); // 注册此资源文件
		$translateProvider.preferredLanguage(locale);
		$translateProvider.useMissingTranslationHandler('missingTranslationNullReturnHandler');
	} ]);
	/** 如果没有找到key对应的值则返回null */
	module.factory('missingTranslationNullReturnHandler', function() {
		return function(translationId) {
			return null;
		};
	});

	/** 格式化字符串text，将其中的{i}用args中的字符串替换，没有传入替换参数则以空字符("")替换 */
	function format(text, args) {
		args = angular.isArray(args) ? args : Array.prototype.slice.call(arguments, 1);
		// 使用args参数替换{n}占位符
		return text.replace(/\{\s*(\d+)\s*\}/g, function(m, n) {
			var v = args[n];
			if (angular.isUndefined(v) || v === null) v = '';
			return  v;
		});
	}

	/** 定义service */
	var LocaleService = function($translate, $cookieStore, $window) {
		return {
			/** 根据key得到资源文件，没有则返回key本身 */
			getText : function(key, args) {
				if (!key) return "";
				var text = $translate.instant(key) || key;
				args = angular.isArray(args) ? args : Array.prototype.slice.call(arguments, 1);
				return format(text, args);
			},
			/** 根据key得到资源文件,没有则返回"" */
			get : function(key, args) {
				var text = $translate.instant(key);
				if (!text) return "";
				args = angular.isArray(args) ? args : Array.prototype.slice.call(arguments, 1);
				return format(text, args);
			},
			/** 切换语言 */
			setLocale : function(locale) {
				$cookieStore.put("appLocale", locale); // 存入cookie
				$translate.use(locale);
			},

			/** 得到当前使用的语言 */
			getLocale : function() {
				return $translate.use();
			}
		}
	};
	LocaleService.$inject = [ "$translate", "$cookieStore", "$window" ];
	module.service("LocaleService", LocaleService);

	/** 定义Controller */
	var LocaleController = function(LocaleService, $http, $scope, $rootScope, $window) {
		/** 切换语言 */
		$scope.setLocale = function(locale) {
			LocaleService.setLocale(locale);
			var data = {};
			data[app.i18n.parameterName] = locale // 更改后台的locale
			$http.post(app.urls["i18n"], data).success(function() {
				// 切换后重新刷新页面
				$window.location.reload();
			});
		};

		/** 将当前使用的语言存入rootScope.session中 */
		app.locale = $rootScope.session.locale = LocaleService.getLocale();

		/** 为$rootScope添加读取资源的方法 */
		$rootScope.getLocaleText = function() {
			return LocaleService.getText.apply(LocaleService, arguments);
		}
		
		/** 为$rootScope添加读取资源的方法,getText对应LocaleService的get,没有对应key的资源则返回空数据 */
		$rootScope.getText = function() {
			return LocaleService.get.apply(LocaleService, arguments);
		}
	};
	LocaleController.$inject = [ "LocaleService", "$http", "$scope", "$rootScope", "$window" ];
	module.controller("LocaleController", LocaleController);

	/** 过滤器 */
	module.filter("appLocale", [ "LocaleService", function(LocaleService) {
		return function() {
			return LocaleService.getText.apply(LocaleService, arguments);
		};
	} ]);

	/**
	 * 设置或取得元素的value
	 */
	function val(element, value) {
		element = $(element);
		var input = element.is(":input");
		var val;
		if (input) {
			val = angular.isUndefined(value) ? element.val() : element.val(value);
		} else {
			val = angular.isUndefined(value) ? element.text() : element.text(value);
		}
		return val;
	}

	/** 仅用于绑定静态文本属性,如果通过key找不到对应的资源文字，则失败将保留原DOM的内容 */
	module.directive("appLocale", [ "LocaleService", function(LocaleService) {
		return {
			restrict : "A",
			template : function(ele, attrs) { // appLocale视为静态常量
				var key = attrs["appLocale"];
				var args = attrs["appLocaleArgs"]; // 用于替换占位符的数据,多个之间用逗号隔开
				if (args && angular.isString(args)) args = args.split(",");
				args = args || [];
				args.splice(0, 0, key);
				var text = LocaleService.get.apply(LocaleService, args); // 是否有配置key的值
				if (text) return text;
				var text = val(ele);
				if ($.trim(text)) return text;
				return format.apply(this, args);
			}
		}
	} ]);

	/** 可以绑定动态数据和静态文本,但是如果通过key找不到对应的资源文字，则失败后不会保留原DOM的内容 */
	module.directive("appLocaleBind", [ "LocaleService", function(LocaleService) {
		return {
			restrict : "A",
			scope: {
				key: '=appLocaleBind',
				args: '=appLocaleArgs'	// 绑定的参数
			},
			template: "{{ localeText }}",
			link : function localeTextLink($scope, ele, attr) {
				var key = $scope.key;
				if (!key) { key = attr.appLocaleBind; }	// 直接使用属性作为字符串
				
				init($scope.args);
				
				// 监视参数的变化
				Helper.destroy($scope, $scope.$watch('args', function(newValue, oldValue) {
					init(newValue);
				}));
				function init(args) {
					var params = [ key ];
					if (args) {
						params = params.concat(args);
					}
					var text = LocaleService.getText.apply(LocaleService, params);
					$scope.localeText = text;
				}
			}
		}
	} ]);

	return "app.locale";
});