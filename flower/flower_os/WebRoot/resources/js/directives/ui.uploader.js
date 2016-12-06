/** angular-file-upload插件的使用 */
(function(factory) {
	'use strict';
	define('ui.uploader', [ "angular", "jquery", "angular-file-upload" ], function(ng, $) {
		return factory(window.app, ng, $);
	});
})(function(app, ng, $) {
	'use strict';

	var module = ng.module("ui.uploader", [ "angularFileUpload" ]);

	var $break = { };
	var uiUploaderController = function($scope, $parse, element, attrs, FileUploader) {
		var options = $.extend({
            url: app.url('/upload.do'),	// 文件上传地址
            autoUpload: true,
            alias: 'upload'            
		}, $scope.options || {});
		if (attrs.autoUpload) options.autoUpload = $scope.$parent.$eval(attrs.autoUpload) !== false;
		if (attrs.alias) options.alias = $scope.$parent.$eval(attrs.alias) || 'upload';
		if ($scope.url) options.url = app.url($scope.url);
		if ($scope.formData) options.formData = $scope.formData;	// 此参数应是一个数组
		var acceptTypes = $scope.acceptTypes || app.acceptFileTypes; // 过滤的文件类型
		var acceptTypesFilter = "acceptTypes";
		if (acceptTypes) {
			var types = ng.isArray(acceptTypes) ? acceptTypes : acceptTypes.toLowerCase().split(/\s*,\s*/); // item.type是小写的
			var filters = options.filters;
			if (!filters) filters = options.filters = [];
			filters.push({
				name : acceptTypesFilter,
				fn : function(item /* {File|FileLikeObject} */, options) {
					var type = item.type.slice(item.type.lastIndexOf('/') + 1);
					if (type && types.include(type)) return true;

					// 按照后缀名进行处理
					type = item.name.slice(item.name.lastIndexOf('.') + 1).toLowerCase();
					return types.include(type) || types.include('.' + type);
				}
			});
		}

		var uploader = new FileUploader(options);


		/** 在callback函数前执行before函数 */
		function before(callback, before) {
			return function(fileItem, response, status, headers) {
				if ($break == before(fileItem, response, status, headers)) return;
				return callback ? callback.apply(uploader, arguments) : null;
			}
		}
		/** 覆盖回调函数函数,判断是否登录超时 */
		function interceptSessionTimeout(callback) {
			return before(callback, function(fileItem, response, status, headers) {
				if (response && !app.interceptSessionTimeout(response)) { // 登陆超时
					return;
				}
				if (response.error) {
					uploader.error = { message: response.message };
				}
			});
		}
		
		var callbacks = $scope.callbacks || {};
		if ($scope.onSuccess) callbacks.onSuccessItem = $scope.onSuccess;
		if ($scope.onComplete) callbacks.onCompleteItem = $scope.onComplete;
		// callbacks.onSuccessItem = interceptSessionTimeout(callbacks.onSuccessItem);
		callbacks.onCompleteItem = interceptSessionTimeout(callbacks.onCompleteItem);
		
		callbacks.onAfterAddingFile = before(callbacks.onAfterAddingFile, function(fileItem) {
			uploader.error = false;
		})
		callbacks.onWhenAddingFileFailed = before(callbacks.onWhenAddingFileFailed, function(item, filter, options) {
			if (filter.name == acceptTypesFilter) {
				var message = "文件\"" + item.name + "\"不允许上传，请重新选择!\n仅允许\"" + acceptTypes + "\"类型的文件!";
				alert(message);
				// uploader.clearQueue();
				uploader.error = { message: message	};
				// throw message;
			}
			uploader.clearQueue();	// 删除所有已添加的文件
		});
//		callbacks.onErrorItem = before(callbacks.onErrorItem, function(fileItem, response, status, headers) {
//			// 高版本IE使用AJAX提交的才会出现这种情况,低版本使用iframe提交则最终都会调用onSuccessItem
//			// console.info('onErrorItem', fileItem, response, status, headers);
//			var message = response.message;
//			if (!response.error) {
//				message = "文件\"" + fileItem.file.name + "\"上传失败!\n" + (response.message || response);
//				alert(message);
//			}
//			uploader.error = { message: message };
//			return $break;
//		});
		
		// 将回调函数添加到uplodaer
		ng.forEach(callbacks, function(callback, name) {
			uploader[ name ] = callback;
		});

		$parse($scope.uploader).assign($scope.$parent, uploader);
	};
	uiUploaderController.$inject = [ "$scope", "$parse", "$element", "$attrs", "FileUploader" ];
	module.controller("uiUploaderController", uiUploaderController);
	module.directive('uiUploader', function() {
		return {
			restrict : 'A',
			controller : "uiUploaderController",
			scope : {
				uploader : '@uploader',
				options : '=uploaderOptions', // 配置
				url : '@uploaderUrl', // 上传地址
				formData : '=uploaderFormData', // 其他表单参数,必须为数组,数组的每个值为{key:value}的参数
				acceptTypes : '@uploaderAcceptTypes',	// 允许的文件类型
				callbacks : '=uploaderCallbacks', // 回调函数
				onSuccess : '=onSuccessItem',		// onSuccessItem函数,注意不能使用&,&指向的对象是函数调用,写法为on-success-item="fn()",无法传参数
				onComplete : '=onCompleteItem'
			}
		}
	});

	return "ui.uploader";
});