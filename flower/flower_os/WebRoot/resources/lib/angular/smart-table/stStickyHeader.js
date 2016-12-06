(function(ng, undefined) {
	// 用于固定头部信息
	'use strict';
	ng.module('smart-table').directive('stStickyHeader', [ '$window', function($window) {
		return {
			require : '^?stTable',
			link : function(scope, element, attr, ctrl) {
				var stickyHeader = lrStickyHeader(element[0]);

				var watcher = scope.$watch(function() {
					return ctrl.tableState();
				}, function() {
					$window.scrollTo(0, lrStickyHeader.treshold);
				}, true);
				scope.$on('$destroy', function() {
					stickyHeader.clean();
					watcher();
				});
			}
		}
	} ]);
})(angular);