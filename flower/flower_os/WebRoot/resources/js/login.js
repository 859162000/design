(function(factory) {
	var deps = [ "angular", "appRouter", "ui.router", "app.locale" ];
	define("Login", deps, function(angular, appRouter) {
		return factory(angular, window.app, appRouter);
	});
})(function(angular, app, appRouter) {
	/** 定义模块 */
	var module = angular.module("Login", [ "ui.router", "app.locale" ]);
	/** 定义service */
	var LoginService = function($http, $window, $q, $rootScope, $state, $location, $log) {
		return {
			/**
			 * 登录系统，user应该至少包含code、password两个参数
			 * @param user 登录用户信息:{ code: 用户名, password: 密码 }
			 */
			login : function(user) {
				var deferred = $q.defer();
				$http.post(app.urls['login'] || (app.root + "/login.do"), user).success(function(data) {
					// 登录成功，跳转到首页
					// $rootScope.init(data);
					$window.location = app.root;
				}).error(function(data) {
					// 返回异常信息
					deferred.reject(data);
				});
			    return deferred.promise;
			},

			/** 退出系统 */
			logout : function() {
				var deferred = $q.defer();
				$http.post(app.urls['logout'] || (app.root + "/logout.do")).success(function(data) {
					// 退回后跳转到首页
					$rootScope.init(null); 
					// $window.location = app.root;
					// deferred.resolve(data);
				});
			    return deferred.promise;
			},
			
			/** 得到RAS的公钥 */
			getPublicKey: function() {
				
			}
		}
	};
	LoginService.$inject = [ "$http", "$window", "$q", "$rootScope", "$state", "$location", "$log" ];
	module.service("LoginService", LoginService);

	/** 定义Controller */
	var LoginController = function(LoginService, LocaleService, $scope, $rootScope, $location) {
		$scope.user = {	// 登录用户属性
			code: 'admin',
			password: '0000'
		}
		
		/* 登录系统  */
		$rootScope.login = $scope.login = function() {
			$scope.logining = true;
			$scope.error = false;
			$scope.message = LocaleService.getText('login.ing');
			LoginService.login($scope.user)[ "finally" ](function() {
				$scope.logining = false;
			}).then(function(data) {
				// 登陆成功
				$scope.message = LocaleService.getText('login.success');
			}, function(data) {
				// 用户名和密码错误
				$scope.error = true;
				$scope.message = data.message || LocaleService.getText('login.wrong');
			});
		};
	};
	LoginController.$inject = [ "LoginService", "LocaleService", "$scope", "$rootScope", "$location" ];
	module.controller("LoginController", LoginController);
	
	var LogoutController = function(LoginService, LocaleService, $scope, $rootScope) {
		/* 退出系统 */
		$rootScope.logout =	$scope.logout = function() {
			LoginService.logout();
		}
	}
	LogoutController.$inject = [ "LoginService", "LocaleService", "$scope", "$rootScope" ];
	module.controller("LogoutController", LogoutController);
	
	return "Login";
});