(function(factory){
	define("ReModel", [ "angular", "jquery" ], function(angular, $, PermissionLv) {
		return factory(angular, $);
	});
})(
		function factory(angular, $){
			var service = function($rootScope, $http, $q, $timeout, LocaleService){
				var app = $rootScope.app;	// config中配置的window.app
				
				return {
					/** 构造此模块下的路径 */
					url: function(url,wildchar) {
						
						if(wildchar!=undefined&&wildchar!=null&&wildchar!=""&&/\S/g.test(wildchar)){
							url = url+'/' + wildchar ;
						}
						
						if (url.charAt('0') != '/') return url;	// 相对路径
						return app.url(url);
					},
					remote:function(url,method,wildchar,params){
						var deferred =   $q.defer();
						var httpconfig = {};
						httpconfig.method = ['GET'];
						httpconfig.url = this.url(url,wildchar);
						if(params != null ){
							httpconfig.params = params ;
						}
						
						$http(httpconfig).success(
							function(data,status){
								deferred.resolve(data);
							}
						).error(
							function(data,status){
								deferred.reject(data);
	
							}
						);
						
						return deferred.promise;
					},
					query:function(params){
						var url = "/acti/workflow/model/model-list";
						var method = 'GET';
						return this.remote(url,method,null,params);
						
					},
					remove:function(modelId){
						var url = "/acti/workflow/model/delete";
						var method = 'POST';
						return this.remote(url,method,modelId,null);
						
					},
					deploy:function(modelId){
						var url = "/acti/workflow/model/deploy";
						var method = 'POST';
						return this.remote(url,method,modelId,null);
						
					}
				}
				
			};
			service.$inject = [ "$rootScope", "$http", "$q", "$timeout", "LocaleService" ];
			service.$name = "ReModelService"; // 可以省略，系统会默认以"模块名+Service"进行注册.如果此模块可能被其他模块依赖,则不能省略
			
			var controller = function($scope, $rootScope, $window, ReModelService, LocaleService){
				// 统一用全局作用域中的current对象来保存当前对象数据
				var current = $rootScope.current;
				
				var scope = {
					query:function(params,pageRequest){
						// 其他参数需要合并到params
						var page_params = pageRequest||current.pageRequest;
						// 其他参数需要合并到params
						var args = $.extend({},params,page_params);
						ReModelService.query(args).then(function(data){
							current.page = data;
						});
						
					},
					remove:function(modelId){
						ReModelService.remove(modelId).then(function(data){
							if(data['status']==1){
								$window.alert(data['message']);
								scope.query();
							}else{
								$window.alert(data['message']);
							}
						});
					},
					deploy:function(modelId){
						ReModelService.deploy(modelId).then(function(data){
							if(data['status']==1){
								$window.alert(data['message']);
								$scope.query();
							}else{
								$window.alert(data['message']);
							}
						});
					}
				};
				
				$.extend($scope,scope);
			};
			
			controller.$inject = [ "$scope", "$rootScope", "$window", "ReModelService", "LocaleService" ];
			controller.$name = "ReModelController"; // 可以省略，系统会默认以"模块名+Service"进行注册.如果此模块可能被其他模块依赖,则不能省略
			
			var module = {
					service : service,
					controller : controller
				};
				
			return module;
		}
);