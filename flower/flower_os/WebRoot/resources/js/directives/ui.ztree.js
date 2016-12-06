/** 使用jquery-ztree的控件 */
(function() {
	'use strict';

var angular, $;

/** 默认的setting */
function defaultSetting() {
	var dbClick = false;	// 判断是否为双击
	return {
		check : {
			enable : false,
			chkboxType: { "Y": "", "N": "" } 
		},
		data : {
			keep : { parent : true },
			simpleData : { enable : false }
		},	
		async : {
			enable : false,
			url : null, // 加载树的地址
			autoParam : [ "id" ],
			otherParam : {},
			/* 数据过滤,可在树加载前对数据进行修改 */
			dataFilter : function(treeId, parentNode, data) {
				if (!data) return null;
				if (angular.isArray(data)) {
					angular.forEach(data, function(node) {
						// 异步加载时,只有isParent==true的节点才会进行异步加载，
						// 只要数据没有empty属性,则使其isParent=true以便进行异步加载
						node.isParent = !node.empty;
						node.parent = parentNode;
					});
				}
				return data;
			}
		},
		view : { dblClickExpand : true, selectedMulti: false },
		/* 指令添加的自定义配置 */
		ng: {
			$scope: null,	// 作用域
			model: false,	// 选中的数据对应的ngModel
			checked: null,	// 多选数据的存放数组的对象，通过$eval取到的对象
			clone: false	// 为false则选中的节点直接赋值给model，否则会clone节点后赋值
		},
		callback : {
			/** 节点双击事件 */
			onDblClick: function() {	// 双击事件
				dbClick = true;
			},
			/** 节点单击事件 */
			onClick : function (event, treeId, treeNode, clickFlag) {
				var tree = $.fn.zTree.getZTreeObj(treeId);
				var ng = tree.setting.ng;
				dbClick = false;
			    if (ng.dropdownCtrl) {
			    	// 有下拉菜单,则250ms后调用click
			    	window.setTimeout(click, 250);
			    } else {
			    	// 不是下拉菜单,直接回调click
			    	click();
			    }
			    function click() {
					if (dbClick) return;
					var $scope = ng.$scope;
					var doClick = function() {
						var ngModel = ng.model;
						if (ngModel) {
							var node = treeNode;
							if (ng.clone) node = $.extend(true, { }, treeNode);
							ngModel.$setViewValue(node);
						}
						var close = !!ngModel;	// 有了ngModel,默认要关闭菜单,除非onClick返回了false
						var onClick = tree.setting.onClick;
						if (onClick) {
							close = onClick($scope, tree, treeNode, event, clickFlag);
						}
						if (close !== false && ng.dropdownCtrl && ng.dropdownCtrl.isOpen()) {
							ng.dropdownCtrl.toggle();
						}
					};
					if (!$scope.$$phase) $scope.$apply(doClick);
					else doClick();
				}
			},
			
			/** 多选框选中操作的回调函数 */
			onCheck: function(event, treeId, treeNode) {
				var tree = $.fn.zTree.getZTreeObj(treeId);
				var ng = tree.setting.ng;
				var $scope = ng.$scope;
				var doCheck = function () {
					var selector = ng.selector();
					var arr = selector.checked;	// ng.checked($scope);
					var onCheck = tree.setting.onCheck;
					
					var checked = treeNode.checked;
					if (checked) {	// 增加节点
						var l = arr.length;
						var found = false;
						for (var i = 0; i < l; i++) {
							var node = arr[ i ];
							if (node == treeNode || (node.tId == treeNode.tId)) {
								found = true;
								break;
							}
						};
						if (!found) arr.push(treeNode);
					} else {	// 删除节点
						var l = arr.length;
						for (var i = 0; i < l; i++) {
							var node = arr[ i ];
							if (node == treeNode || (node.tId == treeNode.tId)) {
								arr.splice(i, 1);
								break;
							}
						};
					}
					
					if (ng.checkedModel) {	// 将当前的选中对象赋值给checkedModel
						ng.checkedModel.assign($scope, arr);
					}

					if (onCheck) { // 回调函数
						onCheck($scope, tree, treeNode, event);
					}
				};
				if (!$scope.$$phase) $scope.$apply(doCheck);
				else doCheck();
			}
		}
	};
}

var deps = [ "angular", "jquery", "DriectiveHelper", "jquery.ztree" ];
define("ui.ztree", deps, function(_angular, jquery, Helper) {
	angular = _angular;
	$ = jquery;
	
	var module = angular.module("ui.ztree", []);
	
	module.directive('ztree', ['$parse', function ($parse) {
		return {
			require: [ '?ngModel', '?^uibDropdown' ],
			restrict: 'A',	// 仅通过属性ztree="$scope.field"进行定义
			// scope : true,
			compile: function() {
				return {
					pre: function($scope, element, attrs, ctrls) {
						element = $(element);
						var ngModel = ctrls[0];
						var dropdownCtrl = ctrls[1];
						var id = element.attr("id");
						if (!id) {	// ztree必须有id，随机生成的id不能含有小数点
							id = 'ztree' + Math.round(Math.random() * Math.pow(10, 10));
							element.attr("id", id);
						}
						element.addClass("ztree");	// 必须要ztre的css
						var ztreeExpression = attrs.ztree;
						if (!ztreeExpression) {	// 不指定ztree则视为在$scope下新建一个对象
							ztreeExpression = id;
						}				
						var nodesExpression = ztreeExpression + ".nodes";	// 初始化树节点的表达式
						var getSelector = $parse(ztreeExpression);
						var selector = getSelector($scope);	// $scope.$eval(attrs.ztree);
						if (!selector) { // 对selector进行初始化
							var setSelector = getSelector.assign;
							selector = { };
							setSelector($scope, selector);
						}
						selector.checked = [ ];	// 清空已选择的数据
						
						var checkedModel = attrs.checkedModel;
						if (checkedModel) {
							checkedModel = $parse(checkedModel);
						}
						
						var setting = Helper.data(attrs, "setting", $scope);
						setting = $.extend(true, defaultSetting(), selector.setting || { }, setting);
						// selector.setting = setting;
						
						var url = attrs.url || setting.async.url || setting.url || selector.url;	// 异步加载数据的URL
						if (url) {
							setting.async.url = Helper.url(url);
							setting.async.enable = true;
						}
						
						setting.ng = {
							$scope : $scope,
							dropdownCtrl: dropdownCtrl,		// 上级下拉弹出菜单,可能没有
							selector: (function(getSelector) {
								// 不能直接使用selector指向的对象,如果直接使用,则无法修改$scope中对应的值
								return function() {
									return getSelector($scope); 
								}
							})(getSelector, $scope),
							// sec: selector,
							model : ngModel,
							checkedModel: checkedModel,	// 指定的多选model
							clone: !!($scope.$eval(attrs[ "clone" ]) || selector.clone)
						}
						// 创建静态节点的树
						nodesExpression = attrs.nodes || nodesExpression;
						var nodes = $scope.$eval(nodesExpression);	// 非异步加载时，指定构建ztree的静态节点
						var ztree = $.fn.zTree.init(element, setting, nodes || null);

						if (nodes) {
							// var getNodes = $parse(nodesExpression);
							$scope.$watchCollection(nodesExpression, (function(ztree) {
								return function(newNodes, oldNodes, $scope) {
									ztree.empty();
									ztree.addNodes(null, newNodes);
								}
							})(ztree));
						}
						
						/** 删除tree上所有选中的数据,注意,默认此方法不会触发回调函数 */
						ztree.clearChecked = (function(ztree) {
							return function(checkTypeFlag, callbackFlag) {
								var nodes = ztree.getCheckedNodes();
								angular.forEach(nodes, function(node) {
									ztree.checkNode(node, false, checkTypeFlag || false, callbackFlag || false);
								});

								var ng = ztree.setting.ng;
								var selector = ng.selector();
								selector.checked.length = 0;
							};
						})(ztree);
						
						/** 删除ztree的所有节点 */
						ztree.empty = (function() {
							return function() {
								var nodes = ztree.getNodes();	// getNodes是根节点的集合（默认情况子节点都处于 children 属性下）；
								while (nodes && nodes.length > 0) {
									var node = nodes[0];
									if (!node.getParentNode()) {
										ztree.removeNode(node);
									}
								}
								var ng = ztree.setting.ng;
								var selector = ng.selector();
								selector.checked.length = 0;
							};
						})(ztree);
						
						selector.tree = ztree;
					}
				};
			}
		};
	}]);	
});

})();