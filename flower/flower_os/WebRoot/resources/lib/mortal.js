/** 对JS基础数据类型的扩展 */
(function() {
	"use strict";
	var Mortal = window.Mortal = {
		/** 使dest继承src的所有属性 */
		extend: function(dest, src) {
			for ( var key in src) {
				dest[ key ] = src[ key ];
			}
		},
		/**
		 * 复制object对象,此方法默认会进行深度clone,即对其下的对象也进行clone
		 * 
		 * @param object
		 * @param deep 是否进行深度clone,如果缺省默认为true
		 */
		clone : function(object, deep) {
			if (!object) return object;
			if (!Object.isUndefined(deep) && !deep) return this.extend({}, object);
			/* source自带有clone方法 */
			if (Object.isFunction(object['clone'])) return object.clone();

			var src = object;
			var dest = { };
			for ( var key in src) {
				if (this.isObject(src[ key ])) {
					dest[ key ] = this.clone(src[ key ], true);
				} else if (this.isArray(src[ key ])) {
					dest[ key ] = [].concat(src[ key ]);
				} else {
					dest[ key ] = src[ key ];
				}
			}
			return dest;
		},
		/** 创建一个function */
		createClass : function(options) {
			var cls = function() {
				if (Object.isFunction(this.initialize)) {
					// 执行初始化方法
					this.initialize.apply(this, arguments);
				}
			};
			if (options) Object.extend(cls.prototype, Object.clone(options || { }));
			return cls;
		},		

		/** object的对象类型 */
		getClass : function(object) {
			return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
		},
		/** 判断obj是否为基础数据类型 */
		isPrimitive: function(obj) {
			if (!obj) return true;
			var cls = this.getClass(obj);
			return cls == "Boolean" || cls == "String" || cls == "Number" || cls == "Date";
		},
		/** object是否为Object类型 */
		isObject : function(object) {
			return !!object && this.getClass(object) == "Object";
		},
		/** object是否未定义 */
		isUndefined : function(object) {
			return typeof object === "undefined";
		},
		isFunction : function(object) {
			return typeof(object) == "function" || this.getClass(object) === "Function";
		},
		isBoolean : function(object) {
			return this.getClass(object) === "Boolean";
		},
		isString : function(object) {
			return this.getClass(object) === "String";
		},
		isNumber : function(object) {
			return this.getClass(object) === "Number";
		},
		isDate : function(object) {
			return this.getClass(object) === "Date";
		},
		isArray : function(object) {
			return this.getClass(object) === "Array";
		},
		/** object是否为HTML的DOM节点 */
		isElement : function(object) {
			return !!(object && object.nodeType == 1);
		},
		
		/** 将value转为boolean */
		parseBoolean: function(value) {
			if (Mortal.isBoolean(value) || Mortal.isUndefined(value) || Mortal.isNumber(value) || value === null) return !!value;
			var b = String(value).trim().toLowerCase();
			return [ "true", "1", "y", "yes" ].include(b);
		}
	};
	
	var extend = Mortal.extend;
	extend(Object, Mortal);
	extend(Boolean, { parse: Mortal.parseBoolean });


	/** 对String的扩展 */
	extend(String.prototype, {
		trim : function() {
			return this.replace(/(^\s*)|(\s*$)/g, '');
		},
		replaceAll: function(pattern, i) {
			return this.replace(new RegExp(pattern, i ? "gi" : "g"), "");
		},
		include : function(pattern) {
			return this.indexOf(pattern) > -1;
		},
		/**
		 * 字符串是否以pattern开头
		 * 
		 * @param pattern
		 * @returns {Boolean}
		 */
		startsWith : function(pattern) {
			return this.lastIndexOf(pattern, 0) === 0;
		},
		/**
		 * 字符串是否以pattern结尾
		 * 
		 * @param pattern
		 * @returns {Boolean}
		 */
		endsWith : function(pattern) {
			var d = this.length - pattern.length;
			return d >= 0 && this.indexOf(pattern, d) === d;
		},
		
		doubleValue: function() {
			return Number.doubleValue(this);
		},
		
		intValue: function() {
			return Number.intValue(this);
		}
	});
	extend(String, {
		trim : function(str) {
			if (str === null || Mortal.isUndefined(str)) return "";
			return String(str).trim();
		}
	});
	
	/** 对数组的扩展 */
	extend(Array.prototype, {
		/**
		 * item在数组中从i开始,第一次的出现的位置
		 * 
		 * @param item
		 * @param i 从第i处开始查找
		 * @returns
		 */
		indexOf : function(item, i) {
			var array = Object(this), length = array.length >>> 0;
			if (length === 0) return -1;

			i = Number(i);
			if (isNaN(i)) {
				i = 0;
			} else if (i !== 0 && isFinite(i)) {
				i = (i > 0 ? 1 : -1) * Math.floor(Math.abs(i));
			}

			if (i > length) return -1;

			var k = i >= 0 ? i : Math.max(length - Math.abs(i), 0);
			for (; k < length; k++) {
				if (k in array && array[ k ] === item) return k;
			}
			return -1;
		},
		/**
		 * 数组中是否包含item
		 * 
		 * @param item
		 * @returns {Boolean}
		 */
		include : function(item) {
			return this.indexOf(item) >= 0;
		},
		/**
		 * 
		 * 在数组中删除第index个元素
		 * 
		 * @param index 要删除的元素.可以为负数,表示倒数第index个元素.如果index >= this.length 或index < -this.length,不会删除任何数据
		 * @param howmany 删除的数量，默认为1
		 * @returns
		 */
		removeAt : function(index, howmany) {
			if (index < -this.length) return null;
			return this.splice(index, howmany || 1);
		},
		/**
		 * 
		 * 在数组中删除item对象
		 * 
		 * @param item 要删除的对象
		 * @returns {Boolean}
		 */
		remove : function(item) {
			var index = this.indexOf(item);
			if (index < 0) return false; // 数组中没有value这个值
			this.splice(index, 1);
			return true;
		},
		
		/** 迭代数组 */
		each: function(fn) {
			for (var i = 0, l = this.length; i < l; i++) {
				if (false === fn(i, this[i])) {
					break;
				}
			}
		}
	});
	

	extend(Number, {
		// NUMBER : /^[\+\-]?(\d+)(\.\d+)?$/, // 数字的正则表达式
		NUMBER : /^[\+\-]?(\d{1,3})(,?\d{3})*(\.\d+)?$/, // 数字的正则表达式
		isNumber : function(value) {
			if (Mortal.isNumber(value)) return !isNaN(value) && isFinite(value);
			return this.NUMBER.test(String.trim(value));
		},
		/**
		 * 
		 * 字符串转换为整数
		 * 
		 * @param value 要转换的值
		 * @param defaultValue 如果不为数字返回的默认值
		 * @param radix 进制,默认为10
		 * @returns 转换后的整数
		 */
		parseInt : function(value, defaultValue, radix) {
			if (Mortal.isString(value)) {
				if (!this.isNumber(value)) {
					return defaultValue || 0;
				}
				value = value.replace(/,/g, '');
			}
			var intNumber = parseInt(value, radix || 10);
			return isNaN(intNumber) || !isFinite(intNumber) ? defaultValue || 0 : intNumber;
		},
		/**
		 * 字符串value转换为整数
		 * 
		 * @param value 要转换的值
		 * @param defaultValue 如果不为数字返回的默认值
		 * @param radix 进制,默认为10
		 * @returns 转换后的整数
		 */
		intValue : function(value, defaultValue, radix) {
			return this.parseInt(value, defaultValue, radix);
		},
		/**
		 * 字符串转换为小数
		 * 
		 * @param value 要转换的值
		 * @param defaultValue 如果不为数字返回的默认值
		 */
		parseFloat : function(value, defaultValue) {
			if (Mortal.isString(value)) {
				if (!this.isNumber(value)) {
					return defaultValue || 0;
				}
				value = value.replace(/,/g, '');
			}
			var floatNumber = parseFloat(value);
			return isNaN(floatNumber) || !isFinite(floatNumber) ? defaultValue || 0 : floatNumber;
		},
		/**
		 * 将字符串转换为小数
		 * 
		 * @param value 要转换的值
		 * @param defaultValue 如果不为数字返回的默认值
		 * @returns
		 */
		parseDouble : function(value, defaultValue) {
			return this.parseFloat(value, defaultValue);
		},
		floatValue : function(value, defaultValue) {
			return this.parseFloat(value, defaultValue);
		},
		doubleValue : function(value, defaultValue) {
			return this.parseFloat(value, defaultValue);
		},

		/**
		 * 比较a和b的大小，小数位数(精度)为p,省略则表示不比较精度
		 * 如果a > b,返回1，a < b返回-1，相等则返回0
		 */
		compare : function(a, b, p) {
			if (a == b) return 0;
			if (p === null || Mortal.isUndefined(p) || p < 0) return a > b ? 1 : -1;
			a = a.toFixed(p);
			b = b.toFixed(p);
			if (a.length == b.length) {
				return a > b ? 1 : -1;
			}			
			return  a.length > b.length ? 1 : -1;
		},
		
		/** a<b */
		less: function(a, b, p) {
			return this.compare(a, b, p) < 0;
		},
		
		/** a>b */
		greater: function(a, b, p) {
			return this.compare(a, b, p) > 0;
		}
	});
})();