(function(factory) {
	"use strict";
	var deps = [ "angular", "jquery", "DriectiveHelper", "DataLoader", "ui.select" ];
	define("app.ui", deps, function(angular, $, Helper) {
		return factory(window.app, angular, $, Helper);
	});
})(function(app, ng, $, Helper) {
	"use strict";
	var module = ng.module("app.ui", [ "DataLoader" ]);
	/**
	 * 将参数转为显示的字符串
	 * 
	 * @param dict 要显示的参数
	 * @param properties 要显示的字段,可省略,默认为code, name
	 * @param separator 多个字段间的分隔符,可省略,默认为-
	 */
	var getValue = function(data, properties, separator) {
		if (!data) return "";
		properties = properties || [ 'code', 'name' ]; // showProperty可以为字符串或数组
		if (angular.isString(properties)) properties = properties.split(/\s*,\s*/);
		if (properties.length == 1) {
			var p = properties[0];
			if (p != "name") return data[ p ];
		}
		separator = separator || '-';
		var value = '';
		angular.forEach(properties, function(property) {
			var v = data[ property ];
			if (angular.isUndefined(v) || v === null) v = '';
			if (property == 'name' && data.i18nKey) {
				// name可能需要国际化
				/*v = LocaleService.get(data.i18nKey) || v;*/
			}
			if (v) {
				value += (value ? ' - ' : '') + v;
			}
		});
		return value;
	}
	
	/** 初始化方法 */
	var init = function($scope, DataLoader) {
		/** 得到单个data对应的value，如果$scope.useProperty为false，则返回data本身 */
		$scope.val = function(data) {
			if (!$scope.useProperty) return data;
			return $scope.getValue(data);
		}
		/** 得到单个data对应的显示文本 */
		$scope.show = function(data) {
			return getValue(data, $scope.showProperties, $scope.separator);
		}
		/** 得到单个data对应的property的值 */
		$scope.getValue = function(data) {
			return getValue(data, $scope.property, $scope.separator);
		};

		/** 判断从后台读取的数据obj和当前model是否相等 */
		$scope.equal = function(obj, model) {
			if (obj == model) return true;
			if ($scope.useProperty) {
				var v = $scope.val(obj);
				v = v == model;
				return v;
			}
			return $scope.getValue(obj) == $scope.getValue(model);
		}
		
		var prop = $scope.valProperty || "id";	// 得到数据的value的字段,默认为id,此字段是必须的
		if (ng.isArray(prop) && prop.length == 1) prop = prop[0];	// 只有一个参数
		$scope.property = prop;
		$scope.showProperties = $scope.showProperty || [ "code", "name" ];
		
		if ($scope.cssClass) {		// ngClass
			var ngClass = { };
			ng.forEach($scope.cssClass.split("\\s*,\\s*"), function(name) {
				ngClass[ name ] = true;
			});
			$scope.ngClass = ngClass;
		}
		$scope.getCssClass = function(css) {
			return $.extend(ngClass || { }, css || { });
		}
		$scope.useProperty = ng.isUndefined($scope.isUseProperty) || !$scope.isUseProperty || Boolean.parse($scope.isUseProperty);
		// $scope.required = !ng.isUndefined($scope.isRequired) && !$scope.isRequired || Boolean.parse($scope.isRequired);
		
//		if ($scope.defaultValue && !$scope.model) {
//			$scope.model = $scope.defaultValue;
//		}
		
		if (!$scope.useProperty) {
			// 如果不是使用属性读取select的值,则必须指定track by的属性名,必须只有1个,默认为id
			if (!$scope.property) $scope.property = "id";
			else if (ng.isArray($scope.property)) $scope.property = $scope.property[0] || "id";
		}
		Helper.destroy($scope, $scope.$watch('model', function(newValue, oldValue) { 
			if (newValue != oldValue) {
				if ((newValue === null || ng.isUndefined(newValue)) && $scope.defaultValue) {	// 默认值
					$scope.model = $scope.defaultValue;
				}
				$scope.change();
			}
		}));
		var load = function(args) {
			if (!$scope.url) return;	// 没有url
			args = $.extend({ status: app.status.valid, pageSize: 1000000000 }, $scope.args || { }, args || { });
			var promise = DataLoader.load(app.url($scope.url), args, $scope.options);
			promise.then(function(data) {
				if (($scope.model === null || ng.isUndefined($scope.model)) && $scope.defaultValue) {	// 默认值
					// 不要放到外部初始化的时候就进行model赋值，因为外部可能会修改model的值，造成默认值被覆盖
					$scope.model = $scope.defaultValue;
				}
				if (data.content && ng.isArray(data.content)) data = data.content;
				else if (!ng.isArray(data)) data = [ data ];
				var arr = [ ];
				ng.forEach(data, function(obj) {
					obj = $.extend({ }, obj);
					if ($scope.useProperty) {
						obj.fieldValue = $scope.val(obj);
					}
					obj.fieldText = $scope.show(obj);
					arr.push(obj);
				});
				$scope.data = arr;
			});
			return promise;
		}
		return load;
	}

	var defaultPageScopeSize = 5;	// 默认底部的分页数量
	/** ui-select下拉框的封装 */
	var AppUiSelectController = function($scope, DataLoader, element, attr) {
		var multiple = attr.multiple;	// 多选
		$scope.multiple = multiple = (ng.isDefined(multiple) && !multiple) || Boolean.parse(multiple);
		
		$scope.selected = $scope.multiple ? [ ] : null;	// 被选中的数据，默认留空
		// $scope.theme = $scope.uiSelectTheme || 'bootstrap';
		$scope.placeholder = $scope.uiPlaceholder || $scope.title;
		$scope.resetSearchInput = ng.isUndefined($scope.uiResetSearchInput) || !$scope.uiResetSearchInput || Boolean.parse($scope.uiResetSearchInput);
		$scope.closeOnSelect = ng.isUndefined($scope.closeOnSelect) ? !multiple : (!$scope.closeOnSelect || Boolean.parse($scope.closeOnSelect));
		$scope.useCache = (ng.isDefined($scope.isUseCache) && !$scope.isUseCache) || Boolean.parse($scope.isUseCache);
		var appPage = $scope.appPage = { }; 	// 分页的相关信息
		if (!$scope.useCache) {	// 不缓存，则使用分页
			// 分页参数,传入分页参数，防止数据读取的太大造成页面卡顿.如果使用缓存，则分页数量设为最大，以便返回所有数据
			var pageSize = $scope.pageSize;
			if (pageSize) pageSize = parseInt(pageSize);
			pageSize = pageSize || app.pageSize;
			
			appPage.pageRequest = { pageNumber: 0, pageSize: pageSize };	// 分页参数
			
			var pageScopeSize = $scope.pageScopeSize;
			if (pageScopeSize) pageScopeSize = parseInt(pageScopeSize);
			appPage.pageScopeSize = pageScopeSize || defaultPageScopeSize;
		}
		var minlength = $scope.searchMinlength;
		// if (minlength) minlength = parseInt(minlength);
		$scope.minlength = minlength = minlength ? (parseInt(minlength) || 0) : 0; //($scope.multiple ? 1 : 0);
		
		var $this = this;
		var CACHE = { };
		var all = null;
		
		var loadAll = init($scope, DataLoader);	// 不分页的查询
		var load = function(args) {	// 根据useCache判断是否分页
			if (!$scope.url) return;	// 没有url
			args = $.extend({ status: app.status.valid }, $scope.args || { }, args || { });
			var promise = DataLoader.load(app.url($scope.url), args, $scope.options);
			promise.then(function(data) {
				if (!$scope.useCache && data.content) {
					// 分页,data是page数据
					$scope.page = appPage.page = data;
					data = data.content;
				} else {
					$scope.page = appPage.page = null;
				}
				// data必须是数组
				var arr = [ ];
				ng.forEach(data, function(obj) {
					obj = $.extend({ }, obj);
					if ($scope.useProperty) {
						obj.fieldValue = $scope.val(obj);
					}
					obj.fieldText = $scope.show(obj);
					arr.push(obj);
				});
				$scope.data = arr;
			});
			return promise;
		}
		
		/** 查询缓存的数据 */
		var searchCache = function(search) {
			if (!$scope.useCache) return null;
			if (!search) return all;
			var cache = CACHE[ search ];
			if (cache) return cache;
			var key = search;
			while (!cache && key.length > 1) {
				key = key.substring(0, key.length - 1);
				cache = CACHE[ key ];
			}
			if (!cache) cache = all;
			if (!cache) return null;
			// cache中通过search查找
			cache = searchFilter(cache || all, search, $scope.showProperties);
			if (cache && cache.length == 0) return null;
			return cache;
		};
		var first = true;	// 是否为第一次触发search方法
		var defaultValue = $scope.model;	// 默认赋值
		if ($scope.model === null || ng.isUndefined($scope.model)) defaultValue = $scope.defaultValue;
		
		/** 是否有默认值 */
		this.hasDefaultValue = function() {
			if (!defaultValue) return false;
			if (ng.isArray(defaultValue)) return defaultValue.length > 0;
			return true;
		};
		function doSearch(search, notSaveCache) {
			if (first) {	// 第一次触发search方法，需要将model的值注入到selected中
				if ($this.hasDefaultValue()) {
					setSelected(defaultValue);
					defaultValue = null;
				}
				first = false;
			}

			if ($scope.useCache && !notSaveCache) {
				if (!search) all = $scope.data;	// 缓存没有条件的所有数据
				else CACHE[ search ] = $scope.data;
			}
		}
		
		/** 有默认值，初始化查询默认值 */
		this.searchDefault = function() {
			if (!$this.hasDefaultValue()) return;
			var search;
			var args = {};
			if (!multiple) {
				if ($scope.useProperty) search = defaultValue;
				else search = $scope.getValue(defaultValue)
				args[ $scope.property ] = search;	// 按属性名对应的字段进行查询
			} else {
				search = [ ];
				ng.forEach(defaultValue, function(v) {
					if ($scope.useProperty) search.push(v);
					else search.push($scope.val(v));
				});
				args[ $scope.property + 's' ] = search;	// 按属性名+s的字段进行查询
			}
			// args.search = search;
			return loadAll(args).then(function() {
				doSearch(null, true);
			});
		};

		if ($scope.defaultValue) {
			Helper.destroy($scope, $scope.$watch('model', function(newValue, oldValue) { 
				if (newValue != oldValue) {
					if ((newValue === null || ng.isUndefined(newValue)) && $scope.defaultValue) {
						// 如果model对应的值已经变为了null，则需要重新使用默认值
						defaultValue = $scope.defaultValue;
						first = false;
						$scope.searchDefault();
					}
				}
			}));
		}
		
		/**
		 * 根据search查找数据
		 * @param search 查询关键字
		 * @param pageRequest 分页参数
		 * @param refresh: 是否强制刷新数据，如果为false，则如果search参数为空，则不刷新后台读取数据
		 */
		$scope.search = this.search = function(search, pageRequest, refresh) {
			search = String.trim(search).toLowerCase();
			appPage.params = { search: search };
			if (Mortal.isBoolean(pageRequest)) {
				var b = pageRequest;
				pageRequest = refresh;
				refresh = b;
			}
			if (!refresh && $scope.useCache) { // 读取缓存数据
				var cache = searchCache(search);
				if (cache && cache.length > 0) {
					$scope.data = cache;
					doSearch(search);
					return;
				}
			}
			if (!refresh && minlength > search.length) return;	// 长度不够，不从数据库读取
			var args = { search : search };
			if (!$scope.useCache) {
				if (pageRequest) {
					$.extend(appPage.pageRequest, pageRequest);
				} else {
					// 没有分页参数，则视为查询第1页
					appPage.pageRequest.pageNumber = 0;
				}
				// $.extend(args, appPage.pageRequest);
				args.pageNumber = appPage.pageRequest.pageNumber;
				args.pageSize = appPage.pageRequest.pageSize;
			}
			return load(args).then(function() {
				doSearch(search);
			});
		}
		
		/** 分页的查询方法 */
		$scope.query = function(params, pageRequest) {
			var params = params || appPage.params;
			$scope.search(params.search, pageRequest);
		};
		var equal = $scope.equal;
		/**
		 * 根据value设定被选中的数据,仅用于第一次加载数据且model有值时调用
		 * @param value 当前被选中的数据，数据来源于$scope.model 
		 */
		var setSelected = function(value) {
			var selected = $scope.multiple ? $scope.selected : null;
			$.each($scope.data, function(idx, obj) {
				if ($scope.multiple) {
					// 多选value必须为数组
					$.each(value, function(vIdx, v) {
						if (equal(obj, v)) {
							selected.push(obj);
							return false;
						}
					});
				} else {
					// 单选
					if (equal(obj, value)) {
						$scope.selected = obj;
						return false;
					}
				}
			});
			// $scope.selected = selected;
		};

		// 注意此指令没有监控外部model的变化，因此如果手工修改外部model，不会对多选列表显示的数据有任何改变
		if ($scope.multiple) {
			// model必须是数组
			Helper.destroy($scope, $scope.$watchCollection('selected', function(newValue, oldValue) {
				var arr = [ ];
				ng.forEach(newValue, function(v) {
					arr.push($scope.val(v));
				});
				$scope.model = arr;
			}));
		} else {
			Helper.destroy($scope, $scope.$watch('selected', function(newValue, oldValue) {
				if(newValue != oldValue) {
					$scope.model = $scope.val(newValue);
				}
			}));
		}
	};
	AppUiSelectController.$inject = [ "$scope", "DataLoader", "$element", "$attrs" ];
	module.controller("AppUiSelectController", AppUiSelectController);
	
	/** 在数据items中的props这些字段中查找包含关键字search的数据 */
	function searchFilter(items, search, props) {
		var out = [];
		if (angular.isArray(items)) {
			var props = props || [ "code", "name" ];
			if (ng.isString(props)) props = props.split("\\s*,\\s*");
			search = String.trim(search).toLowerCase();
			if (!search) {
				out = out.concat(items);
			} else {
				items.forEach(function(item) {
					for (var i = 0; i < props.length; i++) {
						var prop = props[i];
						var text = String.trim(item[prop]).toLowerCase();
						if (text.indexOf(search) !== -1) {
							out.push(item);
							break;
						}
					}
				});
			}
		} else {
			// Let the output be the input untouched
			out = items;
	  	}
		return out;
	};
	module.filter('searchFilter', function() {
		return searchFilter;
	});

	/** 添加指令为app-ui-select="model" */
	module.directive('appUiSelect', function() {
		return {
			// 根据multiple属性判断是否可多选,如果定义了此属性，且不等于false，则为多选
			templateUrl : function(tElement, tAttrs) {
				var multiple = tAttrs.multiple;
				multiple = (ng.isDefined(multiple) && !multiple) || Boolean.parse(multiple);
				return app.url('/resources/template/directives/ui-select' + (multiple ? '-multiple' : '')  + '.html');
			},
			scope : {
				model : '=appUiSelect', // 绑定的外部数据
				// uiSelectTheme: '@theme',		// ui-select的theme参数，默认为bootstrap
				isUseCache: '@isUseCache',		// 使用缓存，默认为false,会每次查询后台取得数据,如果为true应该将pageSize设置较大的值,以防止缓存后取不到第2页的数据
				disabled: '=disabled',	// 是否禁用
				searchMinlength: '@minlength',	// 要调用ajax查询的最小字符串长度,默认为0，即会查询所有数据
				uiResetSearchInput: '@resetSearchInput',	// 是否在搜索的时候重置input的值
				uiCloseOnSelect: '@closeOnSelect',
				pageSize: '@pageSize',
				pageScopeSzie: '@pageScopeSzie',
				title: '@title',
				uiPlaceholder: '@placeholder',
				allowClear: '@allowClear',	// 是否允许清空，默认为true
				defaultValue: '=defaultValue',
				// linkFieldName: '@fieldName', // 绑定到select的name
				url : '@url', // 加载数据的URL
				args : '=args', // 请求参数,默认会加上status=1的参数
				options : '=options',	// 设置参数
				required: '=required',	// 是否必选,默认为false，如果定义了属性，值为空，则视为true
				cssClass : "@cssClass", // select的样式,多个之间用逗号隔开
				valProperty : "@property", // 设定值时使用的字段,默认为id
				isUseProperty: "@useProperty",	// option的值是否使用数据的字段,如果为false,则option绑定的model就是查询到的对象.默认为true
				showProperty : "@showProperty", // 显示值时使用的字段,默认为code + name
				separator : "@separator", // 如果要设置的值为多个字段,字段内容的分隔,默认为-
				change : "&change"		// 外部的写法为change="change()",这里的修饰符不能为&,&会造成select触发ng-change时,外部$scope中的model未同步
			},
			controller : "AppUiSelectController",
			link : function($scope, element, attr, ctrl) {
				$(element).addClass('app-ui-select');
				if (ctrl.hasDefaultValue()) {
					// 如果model有初始值
					ctrl.searchDefault();
				}
			}
		};
	});

	/** select下拉框 */
	var AppSelectController = function($scope, DataLoader) {
		this.load = init($scope, DataLoader);
	};
	AppSelectController.$inject = [ "$scope", "DataLoader" ];
	module.controller("AppSelectController", AppSelectController);
	/** 添加指令为ui-select="model" */
	module.directive('appSelect', function() {
		return {
			templateUrl : app.url('/resources/template/directives/app-select.html'),
			scope : {
				model : '=appSelect', // 绑定的外部数据
				defaultValue: '=defaultValue',
				linkFieldName: '@fieldName', // 绑定到select的name
				url : '@url', // 加载数据的URL
				args : '=args', // 请求参数,默认会加上status=1的参数
				options : '=options',	// 设置参数
				required: '=required',	// 是否必选,默认为false，如果定义了属性，值为空，则视为true
				cssClass : "@cssClass", // select的样式,多个之间用逗号隔开
				isUseProperty: "@useProperty",	// option的值是否使用数据的字段,如果为false,则option绑定的model就是查询到的对象.默认为true
				valProperty : "@property", // 设定值时使用的字段,默认为id
				showProperty : "@showProperty", // 显示值时使用的字段,默认为code + name
				separator : "@separator", // 如果要设置的值为多个字段,字段内容的分隔,默认为-
				change : "&change",		// 外部的写法为change="change()",这里的修饰符不能为&,&会造成select触发ng-change时,外部$scope中的model未同步
				showHeader : '=header'	// 第一个option显示的数据,可以为boolean或者String/JSON{value: xxx, text: xxx}
			},
			controller : "AppSelectController",
			link : function($scope, element, attr, ctrl) {
				$(element).addClass('app-ui-select');
				$scope.fieldName = $scope.linkFieldName;		// 如果linkFieldName有定义,则无法直接覆盖linkFieldName的值
				if (!$scope.fieldName) {
					$scope.fieldName = 'ui_select_' + Math.round(Math.random() * Math.pow(10, 10));
				}
				ctrl.load();
			}
		};
	});

	/** checkbox/radio指令 */
	var AppCheckController = function($scope, DataLoader) {
		$scope.inline = ng.isUndefined($scope.showInline) || !$scope.showInline || Boolean.parse($scope.showInline);
		var load = init($scope, DataLoader);

		this.init = function(radio) {
			$scope.radio = !!radio;			
			if (!$scope.radio) {
				/** 得到所有选择的参数的values */
				var getCheckedValues = function() {
					var values = [];
					angular.forEach($scope.data, function(obj) {
						if (obj.checked) {
							values.push($scope.val(obj));
						}
					});
					return values;
				}
				/** 设置值,主要用于多选按钮.单选按钮直接通过ng-model进行的绑定 */
				$scope.setCheckedValues = function() {
					$scope.model = getCheckedValues();
				}
				
				/** 根据values设定被选中的数据 */
				var setValues = function(values) {
					ng.forEach($scope.data, function(obj) {
						var checked = false;
						if (values) {
							$.each(values, function(v) {
								checked = $scope.equal(obj, v)
								return !checked;
							});
						}
						obj.checked = checked;
					});
				};
				this.load = function() {
					return load().then(function() {
						setValues($scope.model || defaultValue)
					});
				};
				// checkbox的model必须是数组
				Helper.destroy($scope, $scope.$watchCollection('model', function(newValue, oldValue) { 
					setValues(newValue);
				}));
			} else {
				this.load = function() {
					return load().then(function() {
						if (!$scope.useProperty && ($scope.model || defaultValue)) {
							$.each($scope.data, function(idx, obj) {
								if ($scope.equal(obj, $scope.model || defaultValue)) {
									$scope.model = obj;
									return false;
								}
							});
						}
					});
				};
			}
			
			this.load();
		}
	};
	AppCheckController.$inject = [ "$scope", "DataLoader" ];
	module.controller("AppCheckController", AppCheckController);

	/** 添加指令为ui-checkbox="model" */
	module.directive('appCheckbox', function() {
		return {
			templateUrl : app.url('/resources/template/directives/app-checkbox.html'),
			scope : {
				model : '=appCheckbox', // 绑定的外部数据,应该是一个数组对象
				defaultValue: '=defaultValue',
				linkFieldName: '@fieldName', // 绑定到checkbox的name
				url : '@url', // 加载数据的URL
				args : '=args', // 请求参数,默认会加上status=1的参数
				options : '=options',	// 设置参数
				// isRequired: '@required',	// 是否必选,默认为false，如果定义了属性，值为空，则视为true
				cssClass : "@cssClass", // select的样式,多个之间用逗号隔开
				property : "@property", // 设定值时使用的字段,默认为id
				isUseProperty: "@useProperty",	// option的值是否使用数据的字段,如果为false,则option绑定的model就是查询到的对象.默认为true
				showProperty : "@showProperty", // 显示值时使用的字段,默认为code + name
				separator : "@separator", // 如果要设置的值为多个字段,字段内容的分隔,默认为-
				change : "&change",		// 外部的写法为change="change()",这里的修饰符不能为&,&会造成select触发ng-change时,外部$scope中的model未同步
				showInline: '=showInline'					// 是否在一行内显示,默认为true
			},
			controller : "AppCheckController",
			link : function($scope, element, attr, ctrl) {
				$(element).addClass('app-ui-select');
				$scope.fieldName = $scope.linkFieldName;		// 如果linkFieldName有定义,则无法直接覆盖linkFieldName的值
				if (!$scope.fieldName) {
					$scope.fieldName = 'ui_checkbox_' + Math.round(Math.random() * Math.pow(10, 10));
				}
				ctrl.init();
			}
		};
	});

	/** 添加指令为app-checkbox="model" */
	module.directive('appRadio', function() {
		return {
			templateUrl : app.url('/resources/template/directives/app-radio.html'),
			scope : {
				model : '=appRadio', // 绑定的外部数据,应该是一个数组对象
				defaultValue: '=defaultValue',
				linkFieldName: '@fieldName', // 绑定到radio的name
				url : '@url', // 加载数据的URL
				args : '=args', // 请求参数,默认会加上status=1的参数
				options : '=options',	// 设置参数
				// isRequired: '@required',	// 是否必选,默认为false，如果定义了属性，值为空，则视为true
				cssClass : "@cssClass", // select的样式,多个之间用逗号隔开
				property : "@property", // 设定值时使用的字段,默认为id
				isUseProperty: "@useProperty",	// option的值是否使用数据的字段,如果为false,则option绑定的model就是查询到的对象.默认为true
				showProperty : "@showProperty", // 显示值时使用的字段,默认为code + name
				separator : "@separator", // 如果要设置的值为多个字段,字段内容的分隔,默认为-
				change : "&change",		// 外部的写法为change="change()",这里的修饰符不能为&,&会造成select触发ng-change时,外部$scope中的model未同步
				showInline: '=showInline'					// 是否在一行内显示,默认为true
			},
			controller : "AppCheckController",
			link : function($scope, element, attr, ctrl) {
				$(element).addClass('app-ui-select');
				$scope.fieldName = $scope.linkFieldName;		// 如果linkFieldName有定义,则无法直接覆盖linkFieldName的值
				if (!$scope.fieldName) {
					$scope.fieldName = 'ui_radio_' + Math.round(Math.random() * Math.pow(10, 10));
				}
				ctrl.init(true);
			}
		};
	});
	

	var AppShowController = function($scope, DataLoader) {
		/** 得到单个data对应的显示文本 */
		$scope.show = function(data) {
			return getValue(data, $scope.showProperty || [ "code", "name" ], $scope.separator);
		}
		var init = this.init = function(id) {
			var args = { };
			id = id || $scope.id;
			var property = $scope.property;
			if (!property) { property = isArr ? "ids" : "id"; }
			args[ property ] = $scope.id;
			if ($scope.args) $.extend(args, $scope.args);
			var hasArg = false;
			$.each(args, function(key, value) {
				if (value !== null && !ng.isUndefined(value)) {
					hasArg = true;
					return false;
				}
			});
			if (!hasArg) return;	// ui-show指令中，如果没有任何参数不处理
			DataLoader.load(app.url($scope.url), args, $scope.options).then(function(data) {
				$scope.data = data;
				var showText = "";
				var groupSeparator = $scope.groupSeparator || ',';
				// data如果是数组
				if (ng.isArray(data)) {
					ng.forEach(data, function(obj) {
						showText = showText + (showText ? groupSeparator : '') + $scope.show(obj);
					});
				} else if (data) {
					showText = $scope.show(data);
				}
				
				$scope.showText = showText;
			});
		}

		var isArr = ng.isArray($scope.id);
		if (isArr) {
			Helper.destroy($scope, $scope.$watchCollection('id', function(newValue, oldValue) {
				if (newValue != oldValue) {
					init(newValue);
				}
			}));
		} else {
			Helper.destroy($scope, $scope.$watch('id', function(newValue, oldValue) {
				if (newValue != oldValue) {
					init(newValue);
				}
			}));
		}
	};
	AppShowController.$inject = [ "$scope", "DataLoader" ];
	module.controller("AppShowController", AppShowController);
	/** 添加指令为ui-show="args" */
	module.directive('appShow', function() {
		return {
			template : "{{ showText }}",
			scope : {
				id: "=appShow",
				url : '@url', // 加载数据的URL
				args : '=args', // 请求参数
				options : '=options',	// 设置参数
				onLoad : '&onLoad',	// 加载后的回调函数
				property : "@property", // uiShow属性对应的参数名,默认为id
				showProperty : "@showProperty", // 显示值时使用的字段,默认为code + name
				separator : "@separator", // 如果要设置的值为多个字段,字段内容的分隔,默认为-
				groupSeparator : "@groupSeparator" // 得到的数据有多个时,每个数据的分隔符
				// showHeader : '=header'	// 第一个option显示的数据,可以为boolean或者String/JSON{value: xxx, text: xxx}
			},
			controller : "AppShowController",
			link : function($scope, element, attr, ctrl) {
				$(element).addClass('app-ui-show');
				ctrl.init();
			}
		};
	});
	
	/** 过滤器,金额过滤器，默认保留2位小数 */
	module.filter("amount", [ "$filter", function($filter) {
		return function(number, format) {
			return $filter("number")(number, format || 2);
		};
	} ]);
	/** 过滤器,汇率过滤器，默认保留4位小数 */
	module.filter("exchangeRate", [ "$filter", function($filter) {
		return function(number, format) {
			return $filter("number")(number, format || 4);
		};
	} ]);
	/** 格式化小数，默认保留2位小数 */
	module.filter("double", [ "$filter", function($filter) {
		return function(number, format) {
			return $filter("number")(number, format || 2);
		};
	} ]);
	/** 格式化整数 */
	module.filter("int", [ "$filter", function($filter) {
		return function(number) {
			return $filter("number")(number, 0);
		};
	} ]);
	/** datetime过滤器，显示的格式为yyyy-MM-dd HH:mm:ss */
	module.filter("datetime", [ "$filter", function($filter) {
		return function(date, timezone) {
			if (ng.isString(date)) date = Date.parse(date);
			return $filter("date")(date, 'yyyy-MM-dd HH:mm:ss', timezone);
		};
	} ]);
	
	
	module.run(["$templateCache", function($templateCache) {
//		$templateCache.put("bootstrap/match-multiple.tpl.html","<span class=\"ui-select-match\"><span ng-repeat=\"$item in $select.selected\"><span class=\"ui-select-match-item btn btn-default btn-xs\" tabindex=\"-1\" type=\"button\" ng-disabled=\"$select.disabled\" ng-click=\"$selectMultiple.activeMatchIndex = $index;\" ng-class=\"{\'btn-primary\':$selectMultiple.activeMatchIndex === $index, \'select-locked\':$select.isLocked(this, $index)}\" ui-select-sort=\"$select.selected\"><span class=\"close ui-select-match-close\" ng-hide=\"$select.disabled\" ng-click=\"$selectMultiple.removeChoice($index)\">&nbsp;&times;</span> <span uis-transclude-append=\"\"></span></span></span></span>");
		$templateCache.put("bootstrap/match.tpl.html","<div class=\"ui-select-match\" ng-hide=\"$select.open\" ng-disabled=\"$select.disabled\" ng-class=\"{\'btn-default-focus\':$select.focus}\">"
					+ "<span tabindex=\"-1\" class=\"btn btn-default form-control ui-select-toggle\" ng-class=\"cssClass\" aria-label=\"{{ $select.baseTitle }} " +
							"activate\" ng-disabled=\"$select.disabled\" ng-click=\"$select.activate()\" style=\"outline: 0;\">" +
							"<span ng-show=\"$select.isEmpty()\" class=\"ui-select-placeholder text-muted\">{{$select.placeholder}}</span> " +
							"<span ng-hide=\"$select.isEmpty()\" class=\"ui-select-match-text pull-left\" " +
							"ng-class=\"{\'ui-select-allow-clear\': $select.allowClear && !$select.isEmpty()}\" ng-transclude=\"\"></span> " +
							"<i class=\"caret pull-right\" ng-click=\"$select.toggle($event)\"></i> " +
							"<a ng-show=\"$select.allowClear && !$select.isEmpty()\" aria-label=\"{{ $select.baseTitle }} clear\" " +
							"style=\"margin-right: 10px\" ng-click=\"$select.clear($event)\" class=\"btn btn-xs btn-link ui-select-clear pull-right\">" +
							"<i class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\"></i></a></span></div>");
//		$templateCache.put("bootstrap/select-multiple.tpl.html","<div class=\"ui-select-container ui-select-multiple ui-select-bootstrap dropdown form-control\" ng-class=\"getCssClass({open: $select.open})\"><div><div class=\"ui-select-match\"></div><input type=\"text\" autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" class=\"ui-select-search input-xs\" placeholder=\"{{$selectMultiple.getPlaceholder()}}\" ng-disabled=\"$select.disabled\" ng-hide=\"$select.disabled\" ng-click=\"$select.activate()\" ng-model=\"$select.search\" role=\"combobox\" aria-label=\"{{ $select.baseTitle }}\" ondrop=\"return false;\"></div><div class=\"ui-select-choices\"></div></div>");
//
//		$templateCache.put("bootstrap/select.tpl.html",
//				"<div class=\"ui-select-container ui-select-bootstrap dropdown\" ng-class=\"{open: $select.open}\">"
//				+ "<div class=\"ui-select-match\"></div>"
//				+ "<input type=\"text\" autocomplete=\"off\" tabindex=\"-1\" aria-expanded=\"true\" "
//				+ "aria-label=\"{{ $select.baseTitle }}\" aria-owns=\"ui-select-choices-{{ $select.generatedId }}\" "
//				+ "aria-activedescendant=\"ui-select-choices-row-{{ $select.generatedId }}-{{ $select.activeIndex }}\" "
//				+ "class=\"form-control ui-select-search\" ng-class=\"ngClass\" placeholder=\"{{$select.placeholder}}\" ng-model=\"$select.search\" "
//				+ "ng-show=\"$select.searchEnabled && $select.open\"><div class=\"ui-select-choices\"></div></div>");


		$templateCache.put("bootstrap/choices.tpl.html",
				"<ul class=\"ui-select-choices ui-select-choices-content ui-select-dropdown dropdown-menu\" role=\"listbox\" ng-show=\"$select.open\">"
				+ "<li class=\"ui-select-choices-group\" id=\"ui-select-choices-{{ $select.generatedId }}\">"
				+ "<div class=\"divider\" ng-show=\"$select.isGrouped && $index > 0\"></div>"
				+ "<div ng-show=\"$select.isGrouped\" class=\"ui-select-choices-group-label dropdown-header\" ng-bind=\"$group.name\"></div>" 
				+ "<div id=\"ui-select-choices-row-{{ $select.generatedId }}-{{$index}}\" class=\"ui-select-choices-row\" " 
				+ "ng-class=\"{active: $select.isActive(this), disabled: $select.isDisabled(this)}\" role=\"option\">" 
				+ "<a href=\"\" class=\"ui-select-choices-row-inner\"></a>" 
				+ "</div>"
				+ "</li>"
				// + "<li ng-if=\"!$select.multiple\"><a href=\"javascript:;\" ng-click=\"$select.clear()\" app-locale=\"app.clear\"></a></li>"
				+ "<li ng-if=\"!useCache && appPage.page && appPage.page.totalPages && appPage.page.totalPages > 1\" "
				+ "app-page=\"appPage.page\" params=\"appPage.params\" page-request=\"appPage.pageRequest\" hide-input=\"true\" page-scope-size=\"appPage.pageScopeSize\">分页信息</li>"
				
				+ "</ul>");
	}]);

	return "app.ui";
});