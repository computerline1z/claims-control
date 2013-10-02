/*
* hoverFlow - A Solution to Animation Queue Buildup in jQuery
* Version 1.00
*
* Copyright (c) 2009 Ralf Stoltze, http://www.2meter3.de/code/hoverFlow/
* Dual-licensed under the MIT and GPL licenses.
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
*/
(function($) {
	$.fn.hoverFlow = function(type, prop, speed, easing, callback) {
		// only allow hover events
		if ($.inArray(type, ['mouseover', 'mouseenter', 'mouseout', 'mouseleave']) == -1) {
			return this;
		}
	
		// build animation options object from arguments
		// based on internal speed function from jQuery core
		var opt = typeof speed === 'object' ? speed : {
			complete: callback || !callback && easing || $.isFunction(speed) && speed,
			duration: speed,
			easing: callback && easing || easing && !$.isFunction(easing) && easing
		};
		
		// run immediately
		opt.queue = false;
			
		// wrap original callback and add dequeue
		var origCallback = opt.complete;
		opt.complete = function() {
			// execute next function in queue
			$(this).dequeue();
			// execute original callback
			if ($.isFunction(origCallback)) {
				origCallback.call(this);
			}
		};
		
		// keep the chain intact
		return this.each(function() {
			var $this = $(this);
		
			// set flag when mouse is over element
			if (type == 'mouseover' || type == 'mouseenter') {
				$this.data('jQuery.hoverFlow', true);
			} else {
				$this.removeData('jQuery.hoverFlow');
			}
			
			// enqueue function
			$this.queue(function() {				
				// check mouse position at runtime
				var condition = (type == 'mouseover' || type == 'mouseenter') ?
					// read: true if mouse is over element
					$this.data('jQuery.hoverFlow') !== undefined :
					// read: true if mouse is _not_ over element
					$this.data('jQuery.hoverFlow') === undefined;
					
				// only execute animation if condition is met, which is:
				// - only run mouseover animation if mouse _is_ currently over the element
				// - only run mouseout animation if the mouse is currently _not_ over the element
				if(condition) {
					$this.animate(prop, opt);
				// else, clear queue, since there's nothing more to do
				} else {
					$this.queue([]);
				}
			});

		});
	};
})(jQuery);

function fix_nav_wrap_width(){

	$(".js-full-bg").css({
		"width": viewport-17, // 17 for scrollbar
		"margin-left": - side
	});
}

function fix_stripe(){
	$(".js-red-stripe-visual").css(
		{ // fix stripe
			"left": side,
			"height": header_height,
			"width": stripe_width
		}
	);
}

function update_global_variables(){

	// On document load and window resize

	//	Update global variables
		viewport = $(window).width()+17,
		side = $(".js-nav-wrap").position()["left"],
		header_height = $(".js-bg-red-blue").height(),
		header_width = $(".js-bg-red-blue .container").width(),
		stripe_width = header_width - 327 + 15,
		top_menu_offset = $(".js-keep-on-top").offset()["top"]
	;
}

function fix_sticky_menu(){

	var menu = $('.js-keep-on-top'),
		bg1 = $('.js-top-menu-one'),
		bg2 = $('.js-top-menu-two'),
		body = $('body'),
		menu_height = menu.height() + 70
	;

	if( $(window).scrollTop() > top_menu_offset && viewport >= grid_float_breakpoint ){
		if( !menu.hasClass("js-sticked") ){
			menu.addClass("js-sticked");
		}

		if( bg1.hasClass("active") === false ){
			bg1.addClass("active")
				.css( "background-position", "0 " + ( -152 - top_menu_offset ) + "px" )
				.parent()
					.addClass("container pad-h0")
			;
		}
		if( bg2.hasClass("active") === false ){
			bg2.addClass("active")
				.css("background-position", top_menu_offset*45/96 + "px 0" )
					.parent()
						.removeClass("container pad-h0")
			;
		}

		body.css("padding-top", menu_height );
	}
	else {
		if( menu.hasClass("js-sticked") ){
			menu.removeClass("js-sticked");
		}

		if( bg1.hasClass("active") ){
			bg1.removeClass("active");
		}
		if( bg2.hasClass("active") ){
			bg2.removeClass("active");
		}


		body.css("padding-top", "" );
	}
}

/* DOCUMENT READY */
$(function() {

	$("body").addClass("invisible");

	update_global_variables();

	fix_nav_wrap_width();

	fix_stripe();

	// Show page to the user
	$("body").removeClass("invisible");

	// Do some more stuff
	
	$(".tablet-driver-red").hover(function(e) {

			if( viewport < screen_md ){
				return;
			}

			$(".js-red-stripe").css("z-index", 1)
				.hoverFlow(e.type, {
					left: "+=327",
					"z-index": 2
				},'fast'
			);

			$(".js-stripe-contents").hoverFlow(e.type, {
					opacity: 1
				},'fast'
			);

			$(this).css("width", header_width - 327 + 15);

			animation_started = true;

		},

		function(e) {

			if( viewport < screen_md || animation_started != true  ){
				return;
			}

			$(".js-red-stripe").hoverFlow(e.type, { left: "-=327"}, 'fast', function(){
				$(".js-red-stripe").css("z-index", 0);
			});

			$(".js-stripe-contents").hoverFlow(e.type, { opacity: 0}, 'fast');

			$(this).css("width", "");
		}
	);

	$("#carousel-custom-main .controls button").click(function(){

		var button = $(this),
			main_carousel = $("#carousel-custom-main"),
			number_of_all_child_slides = main_carousel.find(".item.active .item").length,
			carousel_custom_secondary = main_carousel.find(".item.active .carousel-custom-secondary"),
			prev_count = false,
			next_count = false
		;

		(function(){
			// don't do anything if there are no slides in child slideshow
			if( number_of_all_child_slides < 1 ){
				console.log("!err: number of all slides < 1");
				return true;
			}

			var active_slide = main_carousel.find(".item.active .item.active"),
				active_slide_index = active_slide.index()
			;

			if( active_slide.length < 1 ){
				// if there is no active slide, exit
				console.log("!err: no active slide");
				return;
			}

			prev_count = active_slide_index;
			next_count = number_of_all_child_slides - active_slide_index -1;


		})();	

		
		if( button.hasClass("button-next") && next_count > 0 ){
			carousel_custom_secondary.carousel("next");
		}
		else if( button.hasClass("button-prev") && prev_count > 0 ){
			carousel_custom_secondary.carousel("prev");
		}
		
	});

	// On load

	/*$(window).load(function(){
		
	});*/


	// Don't forget responsiveness and update stuff as screen size changes
	$(window).resize(function(){
	
		update_global_variables();

		fix_nav_wrap_width();

		fix_stripe();

		fix_sticky_menu();

	});

	$(window).scroll(fix_sticky_menu);

});



//	Global variables

	viewport = $(window).width()+17,
	side = $(".js-nav-wrap").position()["left"],
	header_height = $(".js-bg-red-blue").height(),
	header_width = $(".js-bg-red-blue .container").width(),
	stripe_width = header_width - 327 + 15,
	top_menu_offset = $(".js-keep-on-top").offset()["top"],
	animation_started = false,
	screen_xs =  480,
	screen_sm =  768,
	screen_md =  992,
	screen_lg = 1200,
	grid_float_breakpoint = screen_sm,
	// slider
	slideshow_position = 0
;