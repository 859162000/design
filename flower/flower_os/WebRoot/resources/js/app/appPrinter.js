(function(factory) {
	"use strict";
	var deps = [ "angular", "jquery" ];
	define("appPrinter", deps, function(angular, $) {
		return factory(angular, $, window.app);
	});
})(function(angular, $, app) {
	"use strict";
	/** 定义模块 */
	var module = angular.module("appPrinter", []);
	/** 定义Controller */
	var PrintController = function($scope, $element, $attrs) {
		var root;	//  = $($element);		// app-printer节点
		var selector;	// 查找打印节点的selector,默认为">.app-print-content"
		var title;	// 打印页面的标题
		var url;	// 打印模板页面,默认为print.html
		var args;	// 打印参
		
		/** 初始化参数 */
		this.init = function(_root_, _selector_, attrs) {
			root = $(_root_);		// app-printer节点
			selector = selector || ">.app-print-content";
			title = attrs[ "printTitle" ];	// 打印页面的标题
			url = attrs[ "printUrl" ];		// 打印模板页面,默认为print.html
			args = attrs[ "printArgs" ];		// 打印参数
		}
		
		/**
		 * 打印html
		 * @param key 要打印节点关键字,可以省略,则默认打印contents中的第一个节点的html.如果为true则表示全部打印
		 */
		$scope.print = this.print = function(key, _url_, _title_, _args_) {	// 打印
			var dom;
			if (key === true) {
				// 打印全部节点
				var html = '';
				angular.forEach($(selector, root), function(ele) {
					html += ele.html();
				});
				return print(null, html, _url_ || url, _title_ || title, _args_ || args);
			}

			var child = selector + ":first";
			if (key) child = selector + "[app-print-content=\"" + key + "\"]";
			return print($(child, root), null, _url_ || url, _title_ || title, _args_ || args);
		};
	};
	PrintController.$inject = [ "$scope", "$element", "$attrs" ];
	module.controller("PrintController", PrintController);
	
	/** 最外层的打印指令 */
	module.directive('appPrinter', function() {
		return {
			restrict : "A",
			controller: "PrintController",
			link : function($scope, ele, attrs, ctrl) {
				$(ele).addClass('app-printer');
				ctrl.init(ele, attrs.appPrinter, attrs);
			}
		};
	});

	/** 指定要打印的节点,可以有多个 */
	module.directive('appPrintContent', function() {
		return {
			restrict : "A",
			require: "^appPrinter",
			link : function($scope, ele, attrs, ctrl) {
				$(ele).addClass('app-print-content');
			}
		};
	});

	/** 为按钮加上app-print指令,使之click可触发打印操作 */
	module.directive('appPrint', function() {
		return {
			restrict : "AC",	// 只能使用class样式或者属性定义此指令，如果使用属性定义指令，最好在此按钮外层加上app-print-action的样式，以便打印时隐藏
			link : function($scope, ele, attrs) {
				var key = attrs[ "appPrint" ];	//  || ".app-printer:first";
				var title = attrs[ "printTitle" ];
				var url = attrs[ "printUrl" ];
				var args = attrs[ "printArgs" ];
				$(ele).addClass('app-print');
				$(ele).click((function() {
					return function(event) {
						event.preventDefault();
						$scope.print(key, title ? $scope.$eval(title) : null, 
								url ? $scope.$eval(url) : null, args ? $scope.$eval(args) : null);
					};
				})($scope, title, url, args));
			}
		};
	});
	
	/** 打印时隐藏 */
	module.directive('appPrintHide', function() {
		return {
			restrict : "A",	// 只能使用class样式或者属性定义此指令，如果使用属性定义指令，最好在此按钮外层加上app-print-action的样式，以便打印时隐藏
			link : function($scope, ele, attrs) {
				$(ele).addClass('app-print-hidden');
			}
		};
	});

	/** 打印操作按钮 */
	module.directive('appPrintAction', function() {
		return {
			restrict : "A",	// 只能使用class样式或者属性定义此指令，如果使用属性定义指令，最好在此按钮外层加上app-print-action的样式，以便打印时隐藏
			link : function($scope, ele, attrs) {
				$(ele).addClass('app-print-action');
			}
		};
	});
	
	
	// 打印数据，open后的窗口通过opener取得
	var printData = window[ "PRINT_DATA" ] = {};

	/**
	 * 打印
	 * 
	 * @param dom: 要打印的节点,可以省略，默认为body
	 * @param html: 要打印的HTML，可以省略，默认为dom.html()
	 * @param title: 打印页面显示的标题
	 * @param url: 打印页面，默认为"/print.html";
	 * @param args: 打印页面open的参数,可省略
	 */
	function print(dom, html, title, url, args) {
		dom = $(dom || document.body);
		$.extend(printData, {
			html : html || dom.html(),
			dom : dom,
			title : title || ''
		});
		// debugger;
		if (!args) {
			var width = $(window).width() - 100;
			var height = $(window).height() - 100;
			args = "directories=0, location=0, menubar=0, toolbar=0, resizable=1, scrollbars=1, top=50, left=50, width="
					+ width + "px, height=" + height + "px"
		}
		url = app.url(url || "/print.html");
		window.open(url, "", args);
	}
	return "appPrinter";
});