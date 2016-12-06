/** angularjs定义指令时可能用到的一些方法
 * 指令中scope的含义: 
 * 1.父scope(scope: false) – 这是默认情况。如果你的指令不操作父scoe的属性，你就不需要一个新的scope。这种情况下是可以使用父scope的。
 * 2.子scope(scope: true) – 这会为指令创建一个新的scope，并且原型继承自父scope。如果你的指令scope中的属性和方法与其他的指令以及父scope都没有关系的时候，你应该创建一个新scope。在这种方式下，你同样拥有父scope中所定义的属性和方法。
 * 3.隔离scope(scope:{}) – 这就像一个沙箱！当你创建的指令是自包含的并且可重用的，你就需要使用这种scope。你在指令中会创建很多scope属性和方法，它们仅在指令内部使用，永远不会被外部的世界所知晓。如果是这样的话，隔离的scope是更好的选择。隔离的scope不会继承父scope。
 * ”=“：指令中的属性取值为controller中对应$scope上属性的取值，可用于双向数据的绑定
 * ”@“：指令中的取值为html中的字面量/直接量；建立一个local scope property到DOM属性的绑定。因为属性值总是String类型，所以这个值总是返回一个字符串。如果没有通过@attr指定属性名称，那么本地名称将与DOM属性的名称一直。例如<widget my-attr=”hello {{name}}”>，widget的scope定义为：{localName:’@myAttr’}。那么，widget scope property的localName会映射出”hello {{name}}"转换后的真实值。name属性值改变后，widget scope的localName属性也会相应地改变（仅仅单向，与下面的”=”不同）。name属性是在父scope读取的（不是组件scope）
 * ”&“：指令中的取值为Contoller中对应$scope上的属性，但是这属性必须为一个函数回调
 */
define("DriectiveHelper", [ "angular" ], function(angular) {

'use strict';
var app = window[ "app" ];	// 查看config.js

var DriectiveHelper = {
	/** 读取name的值，如果得到的是String，则到$scope中查找
	 * @param json 如果得到的值为字符串，是否转换为JSON,默认为true */
	attr: function(attrs, name, $scope, json) {
		var attr = attrs[ name ];
		if (!angular.isString(attr) || !attr) return attr;
		return this.$eval($scope, attr, json || angular.isUndefined(json));
	},

	
	/** 读取静态JSON格式的属性,返回JSON数据*/
	data: function(attrs, name, $scope) {
		var attr = attrs[ name ];
		if (!attr) return null;
		if (!angular.isString(attr)) return attr;
		try {
			// attr可能是JSON字符串
			return angular.fromJson(attr);
		} catch (jsonError) {
			// TODO attr无法转换为JSON数据
		}
		if (!$scope) return null;	// 未指定$scope参数则直接返回null,在$scope中查找
		return this.$eval($scope, attr, true, false);
	},
	
	/** 
	 * 调用$scope.$eval(attr),出异常则返回attr
	 * @param json 如果得到的值为字符串，是否转换为JSON,默认为false
	 * @param self 如果$scope中未定义attr，是否返回attr,默认为false
	 */
	$eval: function($scope, attr, json, self) {
		if (!angular.isString(attr) || !attr) return attr;
		var value = attr;
		try {
			value = $scope.$eval(attr);
			if (self && angular.isUndefined(value)) value = attr;
		} catch (error) {
			// TODO 可能是attr不能解析，则直接返回attr
			value = attr;
		}
		if (json && angular.isString(value)) {
			value = angular.fromJson(value);
		}
		return value;
	},
	
	/** 处理URL，如果url是以斜杠(/)开头，则为其加上root，否则直接返回url */
	url: function(url) {
		return app.url(url);
	},
	
	/** 为$scope添加注销事件 */
	destroy: function($scope, watcher) {
		if (watcher) {
			$scope.$on("$destroy", function () {
				watcher();
	        });
		}
	}
};

return DriectiveHelper;

});