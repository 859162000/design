(function(factory){
	define("ReDeployment", [ "angular", "jquery", "PermissionLv" ], function(angular, $, PermissionLv) {
		return factory(angular, $);
	});
})(
		function factory(angular, $,PermissionLv){
			"use strict";
			var namespace = "/activiti/re_deployment"; // 此模块的namespace
			// 业务层的声明
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
						var url = "/acti/workflow/process-list";
						var method = 'GET';
						return this.remote(url,method,null,params);
						
					},remove:function(deploymentId){
						var url = "/acti/workflow/delete";
						var method = 'GET';
						var params = {deploymentId:deploymentId};
						return this.remote(url,method,null,params);
					},
					toModel:function(processDefinitionId){
						var url = "/acti/workflow/processdefinition/";
						var method = 'GET';
						return this.remote(url,method,processDefinitionId,null);
						
					},active:function(processDefinitionId){
						var url = "/acti/workflow/processdefinition/active";
						var method = 'POST';
						return this.remote(url,method,processDefinitionId,null);
					},suspend:function(processDefinitionId){
						var url = "/acti/workflow/processdefinition/suspend";
						var method = 'POST';
						return this.remote(url,method,processDefinitionId,null);
					}
				}
			};
			
			service.$inject = [ "$rootScope", "$http", "$q", "$timeout", "LocaleService" ];
			service.$name = "ReDeploymentService"; // 可以省略，系统会默认以"模块名+Service"进行注册.如果此模块可能被其他模块依赖,则不能省略
			
			
			
			// 控制层的声明
			var controller = function($scope, $rootScope, $window, ReDeploymentService, LocaleService){
				// 统一用全局作用域中的current对象来保存当前对象数据
				var current = $rootScope.current;
				// 声明作用域属性
				var scope = {
						query:function(params,pageRequest){
							var page_params = pageRequest||current.pageRequest;
							// 其他参数需要合并到args
							var args = $.extend({},params,page_params);
							ReDeploymentService.query(args).then(function(data){
								current.page = data;
							});
						},
						remove:function(deploymentId){
						
							ReDeploymentService.remove(deploymentId).then(function(data){
								if(data['success']=='1'){
									$window.alert(data['message']);
								}else{
									$window.alert(data['message']);
								}
							});
						
						},
						toModel:function(processDefinitionId){
							ReDeploymentService.toModel(processDefinitionId).then(function(data){
								if(data['success']=='1'){
									$window.alert(data['message']);
								}else{
									$window.alert(data['message']);
								}
							});
						},
						active:function(processDefinitionId){
							ReDeploymentService.active(processDefinitionId).then(function(data){
								if(data['success']=='1'){
									$window.alert(data['message']);
									$scope.query();
									
								}else{
									$window.alert(data['message']);
								}
							});
						},
						suspend:function(processDefinitionId){
							ReDeploymentService.suspend(processDefinitionId).then(function(data){
								if(data['success']=='1'){
									$window.alert(data['message']);
									$scope.query();
								}else{
									$window.alert(data['message']);
								}
							});
						}
						
				};
				
				// 把声明的当前作用域下面的属性拷贝到$scope对象中去
				$.extend($scope,scope);
				
			};
			controller.$inject = [ "$scope", "$rootScope", "$window", "ReDeploymentService", "LocaleService" ];
			controller.$name = "ReDeploymentController"; // 可以省略，系统会默认以"模块名+Service"进行注册.如果此模块可能被其他模块依赖,则不能省略
			var module = {
					service : service,
					controller : controller
				};
				
			return module;
		}
);