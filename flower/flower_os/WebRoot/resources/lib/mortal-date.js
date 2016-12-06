/**
 * 日期处理工具.主要用于日期的格式化和将字符串转为日期
 */
(function($) {
	/**
	 * 所有可用的日期格式化字符,注意:DwW尚未实现.含义如下: <code>
	// case 0: // 'G' - ERA
	// case 1: // 'y' - YEAR
	// case 2: // 'M' - MONTH
	// case 3: // 'd' - DATE
	// case 4: // 'k' - HOUR_OF_DAY: 1-based. eg, 23:59 + 1 hour =>> 24:59
	// case 5: // 'H' - HOUR_OF_DAY:0-based. eg, 23:59 + 1 hour =>> 00:59
	// case 6: // 'm' - MINUTE
	// case 7: // 's' - SECOND
	// case 8: // 'S' - MILLISECOND
	// case 9: // 'E' - DAY_OF_WEEK
	// case 10: // 'D' - DAY_OF_YEAR
	// case 11: // 'F' - DAY_OF_WEEK_IN_MONTH
	// case 12: // 'w' - WEEK_OF_YEAR
	// case 13: // 'W' - WEEK_OF_MONTH
	// case 14: // 'a' - AM_PM
	// case 15: // 'h' - HOUR:1-based. eg, 11PM + 1 hour =>> 12 AM
	// case 16: // 'K' - HOUR: 0-based. eg, 11PM + 1 hour =>> 0 AM
	// case 17: // 'z' - ZONE_OFFSET
	// case 18: // 'Z' - ZONE_OFFSET ("-/+hhmm" form)	
	</code>
	 */
	var patternChars = 'GyMdkHmsSEDFwWahKzZ';
	var DATE_GET_METHODS = [
		'getEra',
		'getFullYear',
		'getMonth',
		'getDate',
		'getHours',	// 返回 Date 对象的小时 (0 ~ 23)。 1 3
		'getHours',	// 返回 Date 对象的小时 (0 ~ 23)。 1 3
		'getMinutes',	// 返回 Date 对象的分钟 (0 ~ 59)。 1 3
		'getSeconds', // 返回 Date 对象的秒数 (0 ~ 59)。 1 3
		'getMilliseconds',
		'getDay',	// 从 Date 对象返回一周中的某一天 (0周日 ~ 6周六)。
		'getDayOfYear',
		'getDayOfWeekInMonth',
		'getWeekOfYear',
		'getWeekOfMonth',
		'getAmOrPm',
		'getHours',
		'getHours',
		'getTimezoneOffset',
		'getTimezoneOffset'	            
	];

	/** 设置日期各个字段的方法 */
	var DATE_SET_METHODS = [
		'setEra',
		'setFullYear',
		'setMonth',
		'setDate',
		'setHours',	// 返回 Date 对象的小时 (0 ~ 23)。 1 3
		'setHours',	// 返回 Date 对象的小时 (0 ~ 23)。 1 3
		'setMinutes',	// 返回 Date 对象的分钟 (0 ~ 59)。 1 3
		'setSeconds', // 返回 Date 对象的秒数 (0 ~ 59)。 1 3
		'setMilliseconds',
		'setDay',	// 从 Date 对象返回一周中的某一天 (0周日 ~ 6周六)。
		'setDayOfYear',
		'setDayOfWeekInMonth',
		'setWeekOfYear',
		'setWeekOfMonth',
		'setAmOrPm',
		'setHours',
		'setHours',
		'setTimezoneOffset',
		'setTimezoneOffset'	            
	];
	
	/** 格式中对应的日期字段 */
	var DATE_FIELDS = {
		'y': 'year',
		'M': 'month',
		'd': 'date',
		'H': 'hours',
		'h': 'hours',
		'k': 'hours',
		'K': 'hours',
		'm': 'minutes',
		's': 'seconds',
		'S': 'milliseconds',
		'a': 'am_pm'
	};

	/** 为日期添加函数 */
	Object.extend(Date.prototype, {
		/**
		 * 得到公元描述:
		 * 
		 * @return {Integer} 0.公元前; 1.公元
		 */
		getEra: function() {
			return this.getFullYear() <= 0 ? 0 : 1;
		},
		/**
		 * 得到当前是上午(AM)或下午(PM)
		 * 
		 * @return {Integer} 0.AM; 1.PM
		 */
		getAmOrPm: function() {
			return this.getHours() < 12 ? 0 : 1;
		},

		/**
		 * 将日期按pattern的格式进行格式化
		 * 
		 * @param pattern 日期格式
		 * @returns
		 */
		format : function(pattern) {
			return DateHelper.format(this, pattern);
		}
	});
	var RFC3339_FORMAT = "yyyy-MM-dd'T'HH:mm:ss";
	var RFC3339_REGEX = /^(\d{1,4})-(0?[1-9]|1[0-2])-([0-2]?\d|3[01])T([0-5]?\d):([0-5]?\d):([0-5]?\d)$/;
	var DateHelper = {
		RFC3339_FORMAT: RFC3339_FORMAT,
        DEFAULT_FORMAT_DATE: 'yyyy-MM-dd',  // 只有日期的默认格式
        DEFAULT_FORMAT_TIME: 'HH:mm:ss',    // 只有时间的默认格式
        DEFAULT_FORMAT_DATETIME: 'yyyy-MM-dd HH:mm:ss', // 日期+时间的默认格式
		/** 判断字符串是否为RFC3339_FORMAT格式的日期 */
		isRFC3339Date: function(str) {
			return RFC3339_REGEX.test(str);
		},
		/** 将RFC3339_FORMAT格式的字符串转换为日期对象 */
		parseRFC3339Date: function(str) {
			return this.parse(str, RFC3339_FORMAT);
		},
		/** 得到日期date对象field的值 */
		get: function(date, field) {
			if (Number.isNumber(field)) {
				field = Number.intValue(field);
			} else {
				field = patternChars.indexOf(field);
			}
			try {
				return date[DATE_GET_METHODS[field]]();
			} catch (ignore) {
				// TOOD
			}
			return -1;
		},
		/** 设置日期date对象field的值为value */
		set: function(date, field, value) {
			if (Number.isNumber(field)) {
				field = Number.intValue(field);
			} else {
				field = patternChars.indexOf(field);
			}
			try {
				date[DATE_SET_METHODS[field]](value);
				return true;
			} catch (ignore) {
				// TOOD
			}
			return false;
		},
		
		/** 默认的日期格式,转换日期时,使用日期格式进行处理 */
		DEFAULT_DATE_PATTERNS: [ RFC3339_FORMAT, 'yyyy-MM-dd HH:mm:ss.SSS', 'yyyy-MM-dd HH:mm:ss', 'yyyy-MM-dd', 
		                        'MM/dd/yyyy HH:mm:ss.SSS', 'MM/dd/yyyy HH:mm:ss', 'MM/dd/yyyy' ],
		caches : { },	// 格式化的缓存对象
		/**
		 * 格式化日期
		 * 
		 * @param date 要格式化的日期对象
		 * @param pattern 格式
		 * @returns 格式化的日期字符串
		 */
		format: function(date, pattern) {
			if (!Object.isDate(date)) return '';
			if (!pattern) pattern = window['DEFAULT_DATE_FORMAT'] || 'yyyy-MM-dd';
			try {
				var format = this.caches[pattern];
				if (!format) {
					format = new SimpleDateFormat(pattern);
					this.caches[pattern] = format;
				}
				return format.format(date);
			} catch (ignore) {
				// TODO
			} 
			return '';
		},
		/**
		 * 将字符串text按pattern的格式转换为日期对象
		 * @param text
		 * @param pattern
		 * @returns {Date} 转化后的日期对象或null(无法转换)
		 */
		parse: function(text, pattern) {
			if (Object.isDate(text)) return text;
			if (!pattern) return this.parse(text, this.DEFAULT_DATE_PATTERNS);
			try {
				if (Object.isArray(pattern)) {
					var patterns = pattern;
					var date = null;
					var $this = this;
					patterns.each(function(index, pattern) {
						date = $this.parse(text, pattern);
						if (date) return false;
					});
					return date;
				}
				text = String.trim(text);
				var format = this.caches[pattern];
				if (!format) {
					format = new SimpleDateFormat(pattern);
					this.caches[pattern] = format;
				}
				return format.parse(text);
			} catch (ignore) {
				// TODO
				// throw ignore;
			}
			return null;
		},
		
		/**
		 * 判断text是否可转换为pattern格式的日期
		 * @param text 日期字符串
		 * @param pattern 日期格式
		 * @returns {Boolean}
		 */
		isDate: function(text, pattern) {
			return this.parse(text, pattern) != null;
		},
		
		/**
		 * Checks if the current date falls within a leap year.
		 * 
		 * @return {Boolean} True if the current date falls within a leap year, false otherwise.
		 */
		isLeapYear : function(date) {
			date = this.parse(date);
			if (!date) return null;
			var year = date.getFullYear();
			return !!((year & 3) == 0 && (year % 100 || (year % 400 == 0 && year)));
		},
		
		/** date与another是否是同一天.同年同月同日 */
		isSameDay : function(date, another) {
			date = this.parse(date);
			if (!date) return false;
			another = this.parse(another);
			if (!another) return false;
			return date.getFullYear() == another.getFullYear() && date.getMonth() == another.getMonth()
					&& date.getDate() == another.getDate();
		}
	};

	/** 日期的格式化对象 */
	var SimpleDateFormat = Mortal.createClass({
		options: {
			eras: ['公元前', '公元'],
			months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
			shortMonths: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
			weekdays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
			shortWeekdays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
			amPm: ['AM', 'PM']
		},
		/**
		 * 得到日期对象中field字段的显示文字,其值为value,样式长度为length
		 */
		getDisplayName: function(field, value, length) {
			if (this.options['getDisplayName']) return this.options['getDisplayName'].apply(this, arguments);
			return null;
		},
		/** 初始化时调用的方法,当调用new SimpleDateFormat()时会自动调用此方法 */
		initialize : function(pattern, options) {
			if (options) $.extend(this.options, options);
			this.compile(pattern);
		},
		/** 编译日期字符串后的对象 */
		compiledPattern : [], // 编译后的表达式
		/**
		 * 对给出的日期格式字符串进行编译
		 * 
		 * @param pattern
		 */
		compile : function(pattern) {
			var length = pattern.length;
			var inQuote = false;
			var compiledPattern = [];
			var tmpBuffer = '';
			var lastTag = null;
			var count = 0;
			var encode = function(tag, length) {
				compiledPattern.push({
					tag : tag,
					count : length
				});

				lastTag = null;
				count = 0;
			};
			for ( var i = 0; i < length; i++) {
				var c = pattern.charAt(i);
				if (c == '\'') {
					// '' is treated as a single quote regardless of being in a quoted section.
					if ((i + 1) < length) {
						c = pattern.charAt(i + 1);
						if (c == '\'') {
							i++;
							if (count != 0) encode(lastTag, count);
							if (inQuote) {
								tmpBuffer += c;
							} else {
								compiledPattern.push(c);
							}
							continue;
						}
					}
					if (!inQuote) {
						if (count != 0) encode(lastTag, count);
						tmpBuffer = '';
						inQuote = true;
					} else {
						compiledPattern.push(tmpBuffer);
						inQuote = false;
					}
					continue;
				}
				if (inQuote) {
					tmpBuffer += c;
					continue;
				}
				if (!(c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z')) {
					if (count != 0) encode(lastTag, count);
					tmpBuffer = c;
					i++;
					for (; i < length; i++) {
						var d = pattern.charAt(i);
						if (d == '\'' || (d >= 'a' && d <= 'z' || d >= 'A' && d <= 'Z')) {
							break;
						}
						tmpBuffer += d;
					}
					compiledPattern.push(tmpBuffer);
					i--;
					continue;
				}

				if (!patternChars.include(c)) { // 出现了其他英文字母
					throw ("Illegal pattern character " + "'" + c + "'");
				}
				if (!lastTag || lastTag == c) {
					lastTag = c;
					count++;
					continue;
				}
				encode(lastTag, count);
				lastTag = c;
				count = 1;
			}

			if (inQuote) { // 未闭合的引号
				throw ("Unterminated quote");
			}

			if (count != 0) encode(lastTag, count);
			this.compiledPattern = compiledPattern;
		},

		/**
		 * 格式化日期对象
		 * 
		 * @param date
		 */
		format : function(date) {
			if (!Object.isDate(date)) throw (date + '不是日期!');
			var text = '';
			var $this = this;
			this.compiledPattern.each(function(index, value) {
				if (Object.isString(value)) {
					text += value;
					return;
				}
				var tag = value['tag'];
				var count = value['count'];
				var value = DateHelper.get(date, tag); 
				var current = $this.getDisplayName(tag, value, count);
				if (current) {	// 定义了此tag的显示
					text += current;
					return;
				}
				switch (tag) {	// 暂时仅处理yMdHhmsSa
				case 'G':	// 公元/公元前
					current = $this.options['eras'][value];
				case 'y':	// 年
					if (count >= 4) current = String.leftPad(value, count, '0');
					else current = String.leftPad(value % 100, 2, '0');	// 短年份格式,1997显示为97
					break;
				case 'M':	// 月,0-11
					var months = null;
					if (count >= 4) {	// 长日期格式
					    months = $this.options['months'];
					} else if (count == 3) {	// 短日期格式
					    months = $this.options['shortMonths'] || $this.options['months'];
					}
					if (months) {
						current = months[value];
					} else {// 数字
						current = String.leftPad(value + 1, count, '0');
				    }
					break;
				case 'k': // 'k' - HOUR_OF_DAY: 1-based. eg, 23:59 + 1 hour =>> 24:59
					if (value == 0) value = 24;
					current = String.leftPad(value, count, '0');
					break;
		        case 'E': // 'E' - DAY_OF_WEEK
		    		var weekdays = null;
					if (count >= 4) {	// 长日期格式
						weekdays = $this.options['weekdays'];
					} else {	// 短日期格式
						weekdays = $this.options['shortWeekdays'] || $this.options['weekdays'];
					}
					current = weekdays[value];
		        	break;
		        case 'a': // 'a' - AM_PM
					current = $this.options['amPm'][value];
		        	break;
		        case 'h': // 'h' - HOUR:1-based. eg, 11PM + 1 hour =>> 12 AM
		        	if (value == 0) value = 24;
		        case 'K': // 'K' - HOUR:0-based. eg, 11PM + 1 hour =>> 0 AM
		        	value = value - 12;
					current = String.leftPad(value, count, '0');
					break;
		        case 'Z':	// 时区
		        case 'z':
		        	value = value / 60;
		        	if (value >= 0) value = '+' + value;
		        	current = value;
		        	break;
		        default:
		            // case 3: // 'd' - DATE
		            // case 5: // 'H' - HOUR_OF_DAY:0-based. eg, 23:59 + 1 hour =>> 00:59
		            // case 6: // 'm' - MINUTE
		            // case 7: // 's' - SECOND
		            // case 8: // 'S' - MILLISECOND
		            // case 10: // 'D' - DAY_OF_YEAR
		            // case 11: // 'F' - DAY_OF_WEEK_IN_MONTH
		            // case 12: // 'w' - WEEK_OF_YEAR
		            // case 13: // 'W' - WEEK_OF_MONTH
		            // case 16: // 'K' - HOUR: 0-based. eg, 11PM + 1 hour =>> 0 AM
					current = String.leftPad(value++, count, '0');
				};

				text += (current || '');
			});
			
			return text;
		},
		
		/**
		 * 将text转换为日期对象.仅处理:年月日时分秒毫秒
		 * 
		 * @param text
		 */
		parse: function(text) {
			if (Object.isDate(date)) return text;
			text = String.trim(text);
			var date = { year : 1970, month : 0, date : 1, hours: 0, minutes : 0, seconds : 0, milliseconds : 0, 'am_pm' : 0 };
			var $this = this;
			var textLength = text.length;
			var start = 0;
			var compiledPatternLength = this.compiledPattern.length - 1;
			var parsedDate = null;
			var hours12 = false;
			this.compiledPattern.each(function(index, pattern) {
				parsedDate = null;
				if (Object.isString(pattern)) {
					// 固定字符的处理
					var count = pattern.length;
					for (var i = 0; i < count; i ++) {
					    if (start >= textLength || text.charAt(start) != pattern.charAt(i)) {
					    	// 无法转换为日期
							// return false;
					    	throw (text + '无法转换为日期:charAt(' + start + ')');
					    }
					    start++;
					}
					parsedDate = true;
					return;
				}
				var tag = pattern.tag;
				var count = pattern.count;
				var value;				
				var displayNames = null;
				switch (tag) {
				case 'G':	// 公元/公元前
					displayNames = $this.options['eras'];
					if (!displayNames) return false;
					break;
				case 'a':
					displayNames = $this.options['amPm'];
					if (!displayNames) return false;
					break;
				case 'M':	// 月
					if (count >= 4) {	// 长日期格式
						displayNames = $this.options['months'];
					} else if (count == 3) {	// 短日期格式
						displayNames = $this.options['shortMonths'] || $this.options['months'];
					}
					break;
		        case 'E': // 'E' - DAY_OF_WEEK
					if (count >= 4) {	// 长日期格式
						displayNames = $this.options['weekdays'];
					} else {	// 短日期格式
						displayNames = $this.options['shortWeekdays'] || $this.options['weekdays'];
					}
					if (!displayNames) return false;
		        	break;
				};

				if (displayNames) {
					value = null;
					var skip = false;
					displayNames.each(function(ix, ap) {
						value = text.substring(start, start + ap.length);
						if (value == ap) {
							if ('M' == tag || 'a' == tag) {
								// 月份
								date[DATE_FIELDS[tag]] = ix;
							}
							skip = true;
							return false;
						}
					});
					if (skip) {	// 匹配
						start += value.length;
						parsedDate = true;  
						return;
					}
					if ('M' != tag) {
				    	throw (text + '无法转换为日期:' + tag);
						// return false;	// 月份在下面继续查找数字的表达形式
					}
				}
				
				if ('zZ'.include(tag)) {	// 时区的处理
					if ('+-'.include(text.charAt(start))) start++;
				}

				// if (['y', 'M', 'd', 'H', 'm', 's', 'S'].include(tag)) {
				var obeyCount = false;
				if (index < compiledPatternLength) {
					// 下一个不是分隔符,则读取固定数量的数字.例如yyyMMdd格式的日期
					obeyCount = !Object.isString($this.compiledPattern[index + 1]); 
				}
				if (obeyCount) {
					value = text.substring(start, start + count);
				} else {
					// 找到不是数字为止
					value = '';
					var c;
					for (var i = start; i < textLength; i++) {
						c = text.charAt(i);
						if (c >= '0' && c <= '9') value += c;
						else break;	// 不是数字调出循环
					}
				}
				//}
				if (!value || !Number.isNumber(value)) {
			    	throw (text + '无法转换为日期:' + tag + ',不是数字' + value);
					return false;	// 不是数字,无法转换
				}
				start += value.length;
				value = Number.intValue(value);
				parsedDate = true; 
				switch (tag) {
				case 'z':
				case 'Z':
					// 时区不处理
					return false;
				case 'y':	// 年
					// year = value;
					break;
				case 'M':
					value = value - 1;
					break;
				case 'd':
					// date = value;
					break;
				case 'H': // - HOUR_OF_DAY:0-based. eg, 23:59 + 1 hour =>> 00:59
					// hours = value;
					break;
				case 'h': // 'h' - HOUR:1-based. eg, 11PM + 1 hour =>> 12 AM
					value = value % 12;
					hours12 = true;
					break;
				case 'K': // 'K' - HOUR: 0-based.  eg, 11PM + 1 hour =>> 0 AM
					// hours = value;
					hours12 = true;
					break;
				case 'k': // 'k' - HOUR_OF_DAY: 1-based.  eg, 23:59 + 1 hour =>> 24:59
					value = value % 24;
					break;
				case 'm':
					// minutes = value;
					break;
				case 's':
					// seconds = value;
					break;
				case 'S':
					// milliseconds = value;
					break;
				}
				date[DATE_FIELDS[tag]] = value;
			});
			
			if (!parsedDate) return null;	// 转换失败
			if (hours12) {
				if (date['am_pm'] == 1 && date['hours'] <= 11) {
					// 下午
					date['hours'] = (date['hours'] + 12) % 24;
				} else if (date['hours'] == 0) {
					// 12点的处理
					if (date['am_pm'] == 1) date['hours'] = 12;	// 下午0点则为12点
				} 
			}
			
			// alert(String.toJSONString(date));
			return new Date(date['year'], date['month'], date['date'],
					date['hours'], date['minutes'], date['seconds'], date['milliseconds']);
		}
	});


	Object.extend(Date, {
	     /**
	     * Date interval constant
	     * @static
	     * @type String
	     */
	    MILLISECOND : "S",

	    /**
	     * Date interval constant
	     * @static
	     * @type String
	     */
	    SECOND : "s",

	    /**
	     * Date interval constant
	     * @static
	     * @type String
	     */
	    MINUTE : "m",

	    /** Date interval constant
	     * @static
	     * @type String
	     */
	    HOUR : "H",

	    /**
	     * Date interval constant
	     * @static
	     * @type String
	     */
	    DAY : "d",

	    /**
	     * Date interval constant
	     * @static
	     * @type String
	     */
	    MONTH : "M",

	    /**
	     * Date interval constant
	     * @static
	     * @type String
	     */
	    YEAR : "y"
	});
	Object.extend(Date.prototype, {
		/**
		 * Creates and returns a new Date instance with the exact same date value as the called instance. Dates are copied
		 * and passed by reference, so if a copied date variable is modified later, the original variable will also be
		 * changed. When the intention is to create a new variable that will not modify the original instance, you should
		 * create a clone.
		 * 
		 * Example of correctly cloning a date:
		 * 
		 * <pre><code>
		//wrong way:
		var orig = new Date('10/1/2006');
		var copy = orig;
		copy.setDate(5);
		document.write(orig);  //returns 'Thu Oct 05 2006'!

		//correct way:
		var orig = new Date('10/1/2006');
		var copy = orig.clone();
		copy.setDate(5);
		document.write(orig);  //returns 'Thu Oct 01 2006'
		</code></pre>
		 * 
		 * @return {Date} The new Date instance.
		 */
		clone : function() {
			return new Date(this.getTime());
		},

		/**
		 * Checks if the current date falls within a leap year.
		 * 
		 * @return {Boolean} True if the current date falls within a leap year, false otherwise.
		 */
		isLeapYear : function() {
			var year = this.getFullYear();
			return !!((year & 3) == 0 && (year % 100 || (year % 400 == 0 && year)));
		},

		/**
		 * Get the first day of the current month, adjusted for leap year. The returned value is the numeric day index
		 * within the week (0-6) which can be used in conjunction with the {@link #monthNames} array to retrieve the textual
		 * day name. Example:
		 * 
		 * <pre><code>
		var dt = new Date('1/10/2007');
		document.write(Date.dayNames[dt.getFirstDayOfMonth()]); //output: 'Monday'
		</code></pre>
		 * 
		 * @return {Number} The day number (0-6).
		 */
		getFirstDayOfMonth : function() {
			var day = (this.getDay() - (this.getDate() - 1)) % 7;
			return (day < 0) ? (day + 7) : day;
		},

		/**
		 * Get the last day of the current month, adjusted for leap year. The returned value is the numeric day index within
		 * the week (0-6) which can be used in conjunction with the {@link #monthNames} array to retrieve the textual day
		 * name. Example:
		 * 
		 * <pre><code>
		var dt = new Date('1/10/2007');
		document.write(Date.dayNames[dt.getLastDayOfMonth()]); //output: 'Wednesday'
		</code></pre>
		 * 
		 * @return {Number} The day number (0-6).
		 */
		getLastDayOfMonth : function() {
			return this.getLastDateOfMonth().getDay();
		},

		/**
		 * Get the date of the first day of the month in which this date resides.
		 * 
		 * @return {Date}
		 */
		getFirstDateOfMonth : function() {
			return new Date(this.getFullYear(), this.getMonth(), 1);
		},

		/**
		 * Get the date of the last day of the month in which this date resides.
		 * 
		 * @return {Date}
		 */
		getLastDateOfMonth : function() {
			return new Date(this.getFullYear(), this.getMonth(), this.getDaysInMonth());
		},

		/**
		 * Get the number of days in the current month, adjusted for leap year.
		 * 
		 * @return {Number} The number of days in the month.
		 */
		getDaysInMonth : (function() {
			var daysInMonth = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

			return function() { // return a closure for efficiency
				var m = this.getMonth();

				return m == 1 && this.isLeapYear() ? 29 : daysInMonth[m];
			};
		})(),

		/**
		 * Provides a convenient method for performing basic date arithmetic. This method does not modify the Date instance
		 * being called - it creates and returns a new Date instance containing the resulting date value.
		 * 
		 * Examples:
		 * 
		 * <pre><code>
		// Basic usage:
		var dt = new Date('10/29/2006').add(Date.DAY, 5);
		document.write(dt); //returns 'Fri Nov 03 2006 00:00:00'

		// Negative values will be subtracted:
		var dt2 = new Date('10/1/2006').add(Date.DAY, -5);
		document.write(dt2); //returns 'Tue Sep 26 2006 00:00:00'

		// You can even chain several calls together in one line:
		var dt3 = new Date('10/1/2006').add(Date.DAY, 5).add(Date.HOUR, 8).add(Date.MINUTE, -30);
		document.write(dt3); //returns 'Fri Oct 06 2006 07:30:00'
		</code></pre>
		 * 
		 * @param {String} interval A valid date interval enum value.
		 * @param {Number} value The amount to add to the current date.
		 * @return {Date} The new Date instance.
		 */
		add : function(interval, value) {
			var d = this.clone();
			if (!interval || value === 0) return d;
			switch (interval.toLowerCase()) {
			case Date.MILLISECOND:
				d.setMilliseconds(this.getMilliseconds() + value);
				break;
			case Date.SECOND:
				d.setSeconds(this.getSeconds() + value);
				break;
			case Date.MINUTE:
				d.setMinutes(this.getMinutes() + value);
				break;
			case Date.HOUR:
				d.setHours(this.getHours() + value);
				break;
			case Date.DAY:
				d.setDate(this.getDate() + value);
				break;
			case Date.MONTH:
				var day = this.getDate();
				if (day > 28) {
					day = Math.min(day, this.getFirstDateOfMonth().add(Date.MONTH, value).getLastDateOfMonth().getDate());
				}
				d.setDate(day);
				d.setMonth(this.getMonth() + value);
				break;
			case Date.YEAR:
				d.setFullYear(this.getFullYear() + value);
				break;
			}
			return d;
		},
		
		/** 与date比较大小 1: !date || this > date 0: this == date -1: this < date */
		compareTo : function(date, formats) {
			date = DateHelper.parse(date, formats);
			return (!date || this.getTime() > date.getTime()) ? 1 : (this.getTime() == date.getTime() ? 0 : -1);

		}
	});
	
	Mortal.DateHelper = window['DateHelper'] = DateHelper;
	Mortal.SimpleDateFormat = window['SimpleDateFormat'] = SimpleDateFormat;
	Mortal.extend(Date, DateHelper);
})();