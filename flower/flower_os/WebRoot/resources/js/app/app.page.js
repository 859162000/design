(function(factory) {
	"use strict";
	var deps = [ "angular", "jquery", "DriectiveHelper" ];

	define("app.page", deps, function(angular, $, Helper) {
		return factory(angular, $, Helper);
	});

})(function(angular, $, Helper) {
	"use strict";
	/** 定义模块 */
	var module = angular.module("app.page", []);
	
	var defaultPageNumberScopeSize = 10;	// 分页列表显示的页数,默认显示10个页数供选择

	/** 定义service */
	var PageService = function($rootScope) {
		return {
		// TODO
		};
	};
	PageService.$inject = [ "$rootScope" ];
	module.service("PageService", PageService);

	/** 定义Controller */
	var PageController = function(element, attrs, PageService, $scope, $rootScope, $parse, $window) {
		/** 修改页数 */
		$scope.changePageNumber = function(event) {
			$scope.pageRequest.pageNumber = (parseInt(event.target.value) || 0) + 1;
		}

		// 可点击的分页数量,默认为10
		var pageScopeSize = attrs.pageScopeSize ? $scope.$eval(attrs.pageScopeSize) : defaultPageNumberScopeSize;
		pageScopeSize = pageScopeSize || defaultPageNumberScopeSize;
				
		$scope.hideInput = attrs.hideInput && Boolean.parse(attrs.hideInput);	// 隐藏页数输入框
		var pageGetter = $parse(attrs.appPage || "current.page");	    
		$scope.$watch(function () {
	    	var page = pageGetter($scope);
	        return page;
		}, function (newValue, oldValue) {
			if (newValue !== oldValue) {
				init(newValue);
			}
		});


		var pageRequestGetter = $parse(attrs[ "pageRequest" ] || "current.pageRequest");
		var pageRequest;
		var paramsGetter = $parse(attrs[ "params" ] || "current.params");
		var params;
		var page;
		var init = function(newPage) {
			page = newPage || {
				first: true,
				last: true
			};
			pageRequest = pageRequestGetter($scope);	// 输入框的值指向此属性,但是页数点击则会重新覆盖输入框中的值
			if (!pageRequest) {
				pageRequest = { };
				pageRequestGetter.assign($scope, pageRequest);
			}
			$scope.parentPageRequest = pageRequest;	// 用于绑定ng-model输入框
			params = $.extend(true, { }, paramsGetter($scope) || { });	// 缓存当前的查询参数
			
			$scope.page = page;
			$scope.pageRequest = $.extend({}, pageRequest);	// 创建一个隔离的分页对象
			var pageNumber = $scope.pageRequest.pageNumber = page.number || 0;
			$scope.pageRequest.pageNumberView = pageNumber + 1;
			$scope.pageRequest.pageNumberFinal = pageNumber;
			var minPageNumber = Math.max(0, pageNumber - Math.floor((pageScopeSize - 1) / 2));	// 要显示的最小页数
			var maxPageNumber = !page.totalPages ? -1 : Math.min(page.totalPages - 1, minPageNumber + pageScopeSize - 1);	// 要显示的最大页数
			if (page.totalPages && maxPageNumber == page.totalPages - 1) {
				// 已到最后一页
				minPageNumber = Math.max(0, maxPageNumber - pageScopeSize + 1);	// 要显示的最小页数
			}
			var pageNumberScope = $scope.pageRequest.pageNumberScope = [ ];
			while (minPageNumber <= maxPageNumber) {
				pageNumberScope.push(minPageNumber);
				minPageNumber++;
			}
		}
		
		init(pageGetter($scope));
		
		// 查询方法,应该有两个参数，第一个为params，第二个为分页信息
		var query = $scope.$eval(attrs[ "query" ] || "query");
		$.extend($scope, {
			/** 转到首页 */
			first: function() {
				if (page.first) return;
				this.go(0);
			},
			/** 转到最后一页 */
			last: function() {
				if (page.last) return;
				this.go(page.totalPages - 1);
			},
			/** 上一页 */
			previous: function() {
				if (page.first) return;
				this.go(page.number - 1);
			},
			/** 下一页 */
			next: function() {
				if (page.last) return;
				this.go(page.number + 1);
			},
			/** 转到指定的页数
			 * @param pageNumber 页数,从0开始
			 * @param pageSize 每页数量,可以省略
			 */
			go: function(pageNumber, pageSize) {
				if (pageNumber == $scope.pageRequest.pageNumber) return;
				if (pageSize) $scope.pageRequest.pageSize = pageSize;
				$scope.pageRequest.pageNumber = pageNumber;
				query(params, $scope.pageRequest);
			}
		});
	};

	PageController.$inject = [ "$element", "$attrs", "PageService", "$scope", "$rootScope", "$parse", "$window" ];
	module.controller("PageController", PageController);

	/** 分页指令 */
	module.directive("appPage", [ function() {
		return {
			restrict : "A",
			templateUrl : Helper.url('/resources/template/page.html'),
			controller: "PageController",
			scope: true,
			link: function($scope, element, attrs, ctrl) {
				$(element).addClass('app-page')
			}
		}
	} ]);

	return "app.page";
});