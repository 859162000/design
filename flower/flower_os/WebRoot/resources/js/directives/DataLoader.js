/** 动态加载数据 */
(function() {
	'use strict';
	var deps = [ "angular", "jquery", "DriectiveHelper" ];
	define("DataLoader", deps, function(ng, $, Helper) {
		var module = ng.module("DataLoader", []);
		/** 以加载的缓存数据,主键为加载的地址url,每个url的值为{ key, value } */
		var CACHE = { };
		
		/** 将参数转换为字符串 */
		function toKey(args) {
			if (!args) return '';
			if (ng.isString(args)) return args;
			var keys = [ ];	// 先对参数名排序
			for (var key in args) {
				keys.push(String(key));
			}
			keys.sort();
			var copy = { };
			ng.forEach(keys, function(key) {
				if (args[ key ] !== null) {
					copy[ key ] = args[ key ];
				}
			});
			return ng.toJson(copy, 0);
		}

		var service = function($http, $q, $timeout) {
			/**
			 * 读取url的数据
			 * @param $http
			 * @param $q
			 * @param url 请求的url
			 * @param args 提交的参数
			 */
			var load = function(url, args, options) {
				options = options || { };
				var data = null;
				var refresh = options.refresh;
				if (!CACHE[ url ]) CACHE[ url ] = { };
				else if (!refresh) {
					var key = toKey(args);
					data = CACHE[ url ][ key ];
				}
				
				var deferred = $q.defer();
				if (data && !refresh) {
					$timeout(function() { deferred.resolve(data); }, 100);
				} else {
					$http.post(url, args).success(function(data) {
						CACHE[ url ][ toKey(args) ] = data;
						deferred.resolve(data);
					});
				}
				return deferred.promise;
			};
			return {
				/** 从url加载参数 */
				load: function(url, args, options) {
					return load(url, args, options);
				},
				
				/** 从缓存中读取参数,不会到后台读取 */
				get: function(url, args) {
					var cache = CACHE[ url ];
					if (!cache) return null;
					return cache[ toKey(args) ] || null;
				}
			}
		};
		service.$inject = [ "$http", "$q", "$timeout" ];
		module.service('DataLoader', service);
	});
})();