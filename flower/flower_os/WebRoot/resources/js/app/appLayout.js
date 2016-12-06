/** 与页面布局相关的指令 */
(function() {
	"use strict";
	
	/** 依赖的模块 */
	var deps = [ "angular", "jquery", "Layout", "appRouter", "bootstrap-hover-dropdown" ];
	
	/** 定义angular模块 */
	function factory(angular, $, Layout, appRouter) {
		var module = angular.module("appLayout", []);
		module.directive('ngSpinnerBar', [ '$rootScope', "$location", function($rootScope, $location) {
			function show() {
				$rootScope.session.hideSpinnerBar = false;
			}
			
			function hide() {
				$rootScope.session.hideSpinnerBar = true;
			}
			return {
				link : function(scope, element, attrs) {
					// by defult hide the spinner bar
					// element.addClass('hide'); // hide spinner bar by default
					hide();

					// display the spinner bar whenever the route changes(the content part started loading)
					$rootScope.$on('$stateChangeStart', function() {
						// element.removeClass('hide'); // show spinner bar
						show();
					});

					// hide the spinner bar on rounte change success(after the content loaded)
					$rootScope.$on('$stateChangeSuccess', function() {
						// element.addClass('hide'); // hide spinner bar
						hide();
						$('body').removeClass('page-on-load'); // remove page loading indicator
						Layout.scrollTop();
						// Layout.setSidebarMenuActiveLink('match'); // activate selected link in the sidebar menu

						// auto scorll to page top
						// setTimeout(function() {
						// scrollTop(); // scroll to the top on content load
						// }, $rootScope.app.layout.pageAutoScrollOnLoad);
					});

					// handle errors
					$rootScope.$on('$stateNotFound', function() {
						// element.addClass('hide'); // hide spinner bar
						hide();
					});

					// handle errors
					$rootScope.$on('$stateChangeError', function() {
						// element.addClass('hide'); // hide spinner bar
						// $rootScope.session.hideSpinnerBar = true;
						hide();
					});
				}
			};
		} ]);
		

		/** 登录按钮已经加载，则可以初始化登录容器的高度 */
		module.directive('loginAction', function() {
			return {
				link : function(scope, elem) {
					// $(elem).parents(".login-container").css("", Layout.getContentHeight() + "px");
					$("body").addClass("page-login");	// 添加登录

					$('body').removeClass('page-on-load'); // remove page loading indicator
					
					var initContainerHeight = function() {
						$(elem).parents(".login-container").attr('style', 'min-height:' + Layout.getContentHeight() + 'px');
					};
					Layout.addResizeHandler(initContainerHeight);
				}
			};
		});

		// Handle Dropdown Hover Plugin Integration
		module.directive('dropdownMenuHover', function() {
			return {
				link : function(scope, elem) {
					$(elem).dropdownHover();
				}
			};
		});

		// /* Setup Layout Part - Header */
		// module.controller('HeaderController', ['$scope', function($scope) {
		// $scope.$on('$includeContentLoaded', function() {
		// Layout.initHeader(); // init header
		// });
		// }]);

		/* Setup Layout Part - Sidebar */
		module.controller('SidebarController', [ '$scope', "$rootScope", "$timeout", function($scope, $rootScope, $timeout) {
			$scope.$on('$includeContentLoaded', function() {
				$("body").removeClass("page-login");
				Layout.initSidebar(); // init sidebar
			});
			
			/** 切换菜单的open状态 */
			$scope.toggle = function(menu) {
				menu.open = !menu.open;
				$(window).trigger('resize');
			};
			
			// 显示导航路径
			$rootScope.$on('$stateChangeSuccess', function() {
				var navs = $rootScope.session.navs;
				// console.log('$stateChangeSuccess' + "," + navs+"," + $rootScope.session.currentMenu);
				navs.length = 0;
				var menu = $rootScope.session.currentMenu;
				if (!menu) return;
				menu = appRouter.menus[ menu.id ];	// 重新从菜单数据中根据id取得菜单对象，防止是登录超时后重登陆的menu对象
				navs.push(menu);
				var parent = menu.parent;
				while (parent) {
					parent.open = true;
					navs.splice(0, 0, parent);
					parent = parent.parent;
				}
			});

			
			// 500ms后触发resize
			$timeout(function() { $(window).trigger('resize'); }, 1500);
		} ]);
		
		/* 用于导航栏的controller */
		module.controller('BreadcrumbController', [ '$scope', "$rootScope", function($scope, $rootScope) {
			/** 切换菜单的open状态 */
			$scope.toggle = function(menu) {
				menu.open = !menu.open;
				$(window).trigger('resize');
			};
		} ]);
		module.controller('FooterController', [ '$scope', function($scope) {
			$scope.$on('$includeContentLoaded', function() {
		        Layout.initFooter(); // init footer
		        
				$(window).trigger('resize');
			});
		} ]);
		
		// /* Setup Layout Part - Quick Sidebar */
		// module.controller('QuickSidebarController', ['$scope', function($scope) {
		// $scope.$on('$includeContentLoaded', function() {
		// setTimeout(function(){
		// QuickSidebar.init(); // init quick sidebar
		// }, 2000)
		// });
		// }]);
		//
		// /* Setup Layout Part - Theme Panel */
		// module.controller('ThemePanelController', ['$scope', function($scope) {
		// $scope.$on('$includeContentLoaded', function() {
		// Demo.init(); // init theme panel
		// });
		// }]);
		//
		// /* Setup Layout Part - Footer */
		// module.controller('FooterController', ['$scope', function($scope) {
		// $scope.$on('$includeContentLoaded', function() {
		// Layout.initFooter(); // init footer
		// });
		// }]);

		module.controller('UiFormSMController', [ "$scope", "$element", function($scope, $element) {
			var addClass = this.addClass = function() {
				$('input:not([type=button]).form-control', $element).addClass('input-sm');
				$('select.form-control', $element).addClass('input-sm');
				$('textarea.form-control', $element).addClass('input-sm');
				$(':button:not(.btn-icon-only).btn', $element).addClass('btn-sm');
			}
			
			$scope.$on('$includeContentLoaded', function() {
				addClass();
			});

			addClass();
		} ]);

		module.directive('uiFormSm', [ function() {
			return {
				restrict : "A",
				controller: "UiFormSMController",
				link : function(scope, elem, attrs, ctrl) {
					// TODO
					$(elem).addClass('ui-form-sm');
				}
			};
		}]);
		
		module.directive('queryContainer', [ function() {
			return {
				restrict : "AC",
				controller: "UiFormSMController",
				link : function(scope, elem, attrs, ctrl) {
					// TODO
					$(elem).addClass('query-container');
				}
			};
		}]);
		return "appLayout";
	}

	define("appLayout", deps, function(angular, $, Layout, appRouter) {
		return factory(angular, $, Layout, appRouter);
	});
})();
