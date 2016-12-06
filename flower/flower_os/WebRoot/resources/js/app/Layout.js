/** 使用jquery操作页面布局的函数 */
(function() {
	"use strict";
	var $; // jquery
	var resizeHandlers = []; // 窗口resize的所有事件
	var Layout = {
		/** 整个布局窗口 */
		getViewPort : function() {
			var e = window, a = 'inner';
			if (!('innerWidth' in window)) {
				a = 'client';
				e = document.documentElement || document.body;
			}

			return {
				element : e,
				width : e[ a + 'Width' ],
				height : e[ a + 'Height' ]
			};
		},

		/** 滚动到el节点 */
		scrollTo : function(el, offeset) {
			var pos = (el && el.size() > 0) ? el.offset().top : 0;
			if (el) {
				if ($('body').hasClass('page-header-fixed')) {
					pos = pos - $('.page-header').height();
				} else if ($('body').hasClass('page-header-top-fixed')) {
					pos = pos - $('.page-header-top').height();
				} else if ($('body').hasClass('page-header-menu-fixed')) {
					pos = pos - $('.page-header-menu').height();
				}
				pos = pos + (offeset || offeset === 0 ? offeset : -1 * el.height());
			}
			$('html,body').animate({
				scrollTop : pos
			}, 'slow');
		},
		/** 滚动到页面顶部 */
		scrollTop : function() {
			this.scrollTo($('.page-container'), 0);
		},
		
		/** 得到content的可用高度 */
		getContentHeight: function() {
			var body = $('body');
			var height;
			if (body.hasClass("page-footer-fixed") === true && body.hasClass("page-sidebar-fixed") === false) {
				height = this.getViewPort().height - $('.page-footer').outerHeight() - $('.page-header').outerHeight();
			} else {
				if (body.hasClass('page-sidebar-fixed')) {
					height = _calculateFixedSidebarViewportHeight();
					if (body.hasClass('page-footer-fixed') === false) {
						height = height - $('.page-footer').outerHeight();
					}
				} else {
					var headerHeight = $('.page-header').outerHeight();
					var footerHeight = $('.page-footer').outerHeight();

					if (this.getViewPort().width < resBreakpointMd) {
						height = this.getViewPort().height - headerHeight - footerHeight;
					} else {
						height = $('.page-sidebar').height() + 20;
					}

					if ((height + headerHeight + footerHeight) <= this.getViewPort().height) {
						height = this.getViewPort().height - headerHeight - footerHeight;
					}
				}
			}
			return height;
		},

		/** 主要用于设置右侧内容的高度 */
		handleSidebarAndContentHeight : function() {
			var content = $('.page-content');
			var body = $('body');
			var height = this.getContentHeight();

			if (body.hasClass("page-footer-fixed") === true && body.hasClass("page-sidebar-fixed") === false) {
//				var availableHeight = this.getViewPort().height - $('.page-footer').outerHeight()
//						- $('.page-header').outerHeight();
				if (content.height() < height) {
					content.attr('style', 'min-height:' + height + 'px');
				}
			} else {
//				if (body.hasClass('page-sidebar-fixed')) {
//					height = _calculateFixedSidebarViewportHeight();
//					if (body.hasClass('page-footer-fixed') === false) {
//						height = height - $('.page-footer').outerHeight();
//					}
//				} else {
//					var headerHeight = $('.page-header').outerHeight();
//					var footerHeight = $('.page-footer').outerHeight();
//
//					if (this.getViewPort().width < resBreakpointMd) {
//						height = this.getViewPort().height - headerHeight - footerHeight;
//					} else {
//						height = sidebar.height() + 20;
//					}
//
//					if ((height + headerHeight + footerHeight) <= this.getViewPort().height) {
//						height = this.getViewPort().height - headerHeight - footerHeight;
//					}
//				}
				content.attr('style', 'min-height:' + height + 'px');
			}
		},

		/** 菜单加载完成后的处理 */
		initSidebar : function() {
			// layout handlers
			handleFixedSidebar(); // handles fixed sidebar menu
			// handleSidebarMenu(); // handles main menu
			handleSidebarToggler(); // handles sidebar hide/show

			// if (App.isAngularJsApp()) {
			// handleSidebarMenuActiveLink('match'); // init sidebar active links
			// }

			this.addResizeHandler(handleFixedSidebar); // reinitialize fixed sidebar on window resize
		},
		

		initFooter: function() {
			handleGoTop(); //handles scroll to top functionality in the footer
		},


		/** 增加一个window的resize事件 */
		addResizeHandler : function(func) {
			resizeHandlers.push(func);
		},
		/** 调用所有resize事件 */
		runResizeHandlers : function() {
			for (var i = 0; i < resizeHandlers.length; i++) {
				var each = resizeHandlers[ i ];
				each.call();
			}
		},

		initSlimScroll : function(el) {
			$(el).each(function() {
				if ($(this).attr("data-initialized")) {
					return; // exit
				}

				var height;

				if ($(this).attr("data-height")) {
					height = $(this).attr("data-height");
				} else {
					height = $(this).css('height');
				}

				$(this).slimScroll(
						{
							allowPageScroll : true, // allow page scroll when the element scroll is ended
							size : '7px',
							color : ($(this).attr("data-handle-color") ? $(this).attr("data-handle-color")
									: '#bbb'),
							wrapperClass : ($(this).attr("data-wrapper-class") ? $(this).attr(
									"data-wrapper-class") : 'slimScrollDiv'),
							railColor : ($(this).attr("data-rail-color") ? $(this).attr("data-rail-color")
									: '#eaeaea'),
							position : isRTL ? 'left' : 'right',
							height : height,
							alwaysVisible : ($(this).attr("data-always-visible") == "1" ? true : false),
							railVisible : ($(this).attr("data-rail-visible") == "1" ? true : false),
							disableFadeOut : true
						});

				$(this).attr("data-initialized", "1");
			});
		},
		destroySlimScroll : function(el) {
			$(el).each(function() {
				if ($(this).attr("data-initialized") === "1") { // destroy existing instance before updating the
																// height
					$(this).removeAttr("data-initialized");
					$(this).removeAttr("style");

					var attrList = {};

					// store the custom attribures so later we will reassign.
					if ($(this).attr("data-handle-color")) {
						attrList[ "data-handle-color" ] = $(this).attr("data-handle-color");
					}
					if ($(this).attr("data-wrapper-class")) {
						attrList[ "data-wrapper-class" ] = $(this).attr("data-wrapper-class");
					}
					if ($(this).attr("data-rail-color")) {
						attrList[ "data-rail-color" ] = $(this).attr("data-rail-color");
					}
					if ($(this).attr("data-always-visible")) {
						attrList[ "data-always-visible" ] = $(this).attr("data-always-visible");
					}
					if ($(this).attr("data-rail-visible")) {
						attrList[ "data-rail-visible" ] = $(this).attr("data-rail-visible");
					}

					$(this).slimScroll(
							{
								wrapperClass : ($(this).attr("data-wrapper-class") ? $(this).attr(
										"data-wrapper-class") : 'slimScrollDiv'),
								destroy : true
							});

					var the = $(this);

					// reassign custom attributes
					$.each(attrList, function(key, value) {
						the.attr(key, value);
					});
				}
			});
		},

		getResponsiveBreakpoint : function(size) {
			// bootstrap responsive breakpoints
			var sizes = {
				'xs' : 480, // extra small
				'sm' : 768, // small
				'md' : 992, // medium
				'lg' : 1200
			// large
			};

			return sizes[ size ] ? sizes[ size ] : 0;
		}
	};

	var resBreakpointMd = Layout.getResponsiveBreakpoint('md');
	// Helper function to calculate sidebar height for fixed sidebar layout.
	var _calculateFixedSidebarViewportHeight = function() {
		var sidebarHeight = Layout.getViewPort().height - $('.page-header').outerHeight(true);
		if ($('body').hasClass("page-footer-fixed")) {
			sidebarHeight = sidebarHeight - $('.page-footer').outerHeight();
		}

		return sidebarHeight;
	};

	/** 处理固定菜单，如果给body加上page-sidebar-fixed样式，则左侧菜单不会随着滚动条上下滚动 */
	var handleFixedSidebar = function() {
		var menu = $('.page-sidebar-menu');

		Layout.destroySlimScroll(menu);

		if ($('.page-sidebar-fixed').size() === 0) {
			Layout.handleSidebarAndContentHeight();
			return;
		}

		if (Layout.getViewPort().width >= resBreakpointMd) {
			menu.attr("data-height", _calculateFixedSidebarViewportHeight());
			Layout.initSlimScroll(menu);
			Layout.handleSidebarAndContentHeight();
		}
	};
	// Hanles sidebar toggler
	var handleSidebarToggler = function() {
		var body = $('body');
		if ($.cookie && $.cookie('sidebar_closed') === '1' && Layout.getViewPort().width >= resBreakpointMd) {
			$('body').addClass('page-sidebar-closed');
			$('.page-sidebar-menu').addClass('page-sidebar-menu-closed');
		}

		// handle sidebar show/hide
		$('body').on('click', '.sidebar-toggler', function(e) {
			var sidebar = $('.page-sidebar');
			var sidebarMenu = $('.page-sidebar-menu');
			// $(".sidebar-search", sidebar).removeClass("open");

			if (body.hasClass("page-sidebar-closed")) {
				// body.removeClass("page-sidebar-closed");
				// sidebarMenu.removeClass("page-sidebar-menu-closed");
				// if ($.cookie) {
				// $.cookie('sidebar_closed', '0');
				// }
			} else {
				// body.addClass("page-sidebar-closed");
				// sidebarMenu.addClass("page-sidebar-menu-closed");
				if (body.hasClass("page-sidebar-fixed")) {
					sidebarMenu.trigger("mouseleave");
				}
				// if ($.cookie) {
				// $.cookie('sidebar_closed', '1');
				// }
			}

			$(window).trigger('resize');
		});
	};


	// Handles the go to top button at the footer
	var handleGoTop = function () {
		var offset = 300;
		var duration = 500;
		if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {  // ios supported
			$(window).bind("touchend touchcancel touchleave", function(e){
			   if ($(this).scrollTop() > offset) {
					$('.scroll-to-top').fadeIn(duration);
				} else {
					$('.scroll-to-top').fadeOut(duration);
				}
			});
		} else {  // general 
			$(window).scroll(function() {
				if ($(this).scrollTop() > offset) {
					$('.scroll-to-top').fadeIn(duration);
				} else {
					$('.scroll-to-top').fadeOut(duration);
				}
			});
		}
		
		$('.scroll-to-top').click(function(e) {
			e.preventDefault();
			// $('html, body').animate({scrollTop: 0}, duration);
			Layout.scrollTop();
			return false;
		});
	};

	/** 为window添加resize事件 */
	var handleOnResize = function() {
		var resize;
		$(window).resize(function() {
			if (resize) {
				clearTimeout(resize);
			}
			resize = setTimeout(function() {
				Layout.runResizeHandlers();
			}, 50); // wait 50ms until window resize finishes.
		});
	};

	define("Layout", [ "jquery", "jquery.slimscroll" ], function(jquery) {
		$ = jquery;
		$(document).ready(function() {
			handleGoTop();
			handleOnResize();
		});
		return Layout;
	});
})();