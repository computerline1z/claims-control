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
		top_menu_offset = $(".js-keep-on-top").offset()["top"],
		top_menu_height = $(".js-keep-on-top").height()+70
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

	$.fn.cc_slides = function(options){

		function setup_user_settings(){

			settings = $.extend(
				{
					slide_speed: 500,
					button_next_class : "cc_slides_next",
					button_prev_class: "cc_slides_prev",
					active_slide_class: "cc_active_slide",
					pause_play_class: "cc_slides_pause_play",
					carousel_class: "cc-carousel",
					autoplay: false
				},options
			);
		}

		function load_carousel_widths(carousel_hldr, carousel_width){

			/* all li's same width as slider */
			carousel_hldr.find("li").css( "width", carousel_width );

			/* all ul's width is the sum of widths of it's direct children */
			carousel_hldr.find("ul").each(function(){
				var ul = $(this),
					ul_width = ul.find(">li").length * carousel_width
				;
				ul.css("width", ul_width);
			});
		}

		function center_carousel(carousel_hldr){
			var carousel_ul = carousel_hldr.children("ul"),
				carousel_items = carousel_ul.children("li"),
				carousel_length = carousel_items.length,
				carousel_center = Math.round( (carousel_length - 1)/2 ),
				rewind_ammount = carousel_center;
			;

			for(var i=carousel_length-1;i>carousel_center;i--){
				carousel_items.eq(i).prependTo( carousel_ul );
			}

			if(carousel_length%2===0){
				rewind_ammount--;
			}

			carousel_ul.css("left", - carousel_holder_width*rewind_ammount + "px");

			// Set active class if not set already
			if( carousel_ul.children(settings["active_slide_class"]).length < 1 ){
				carousel_ul.children("li").eq( rewind_ammount ).addClass( settings["active_slide_class"] );
			}
		}

		function slide(direction, slide_ammount){

			if(slideshow_animation_in_progress){return;}

			var carousel_class = "cc-carousel",
				carousel = $("."+carousel_class),
				carousel_slides = carousel.find("li"),
				active_slid = carousel.find("."+settings["active_slide_class"])
			;

			// if there is only one slide, exit
			if( carousel_slides.length < 2 ){
				console.log("less than two slides");
				return;
			}
			else if( carousel_slides.length === 2 ){
				alert("dvi skaidres nepalaikomos");
				return;
			}

			/* if there is not active slide, exit */
			if( active_slid.length != 1 ){
				alert("!error active slides");
				return;
			}

			// next-prev
			if( direction === "next" ){
				var slide_operator = "-=";
			}
			else {
				var slide_operator = "+=";
			}

			slideshow_animation_in_progress = true;

			active_slid.parent().animate(
				{
					left: slide_operator+slide_ammount
				},
				settings["slide_speed"],
				function(){

					var holder = $("."+carousel_class),
						slider_ul = holder.children("ul"),
						slides = slider_ul.children("li")
					;

					if( direction === "next" ){

						active_slid.removeClass(settings["active_slide_class"]);
						active_slid.next().addClass(settings["active_slide_class"]);

						slides.first().appendTo( slider_ul );
						slider_ul.css("left", "+="+slide_ammount );

						if( active_slid.next().hasClass("main") ){
							var next_slide_nr = get_next_slide_number(active_slid.next().attr("class"));
							update_slider_header(next_slide_nr);
						}

					}
					else {

						active_slid.removeClass(settings["active_slide_class"]);
						active_slid.prev().addClass(settings["active_slide_class"]);

						slides.last().prependTo( slider_ul );
						slider_ul.css("left", "-="+slide_ammount );

						if( active_slid.prev().hasClass("main") ){
							var next_slide_nr = get_next_slide_number(active_slid.prev().attr("class"));
							update_slider_header(next_slide_nr);
						}
					}

					slideshow_animation_in_progress = false;
				}
				
			);

		}

		function update_slider_header(next_nr){

			var slider_header = $(".slider-header"),
				slider_header_active_class = "active",
				slider_header_active = slider_header.find("."+slider_header_active_class),
				slider_header_next = null
			;

			slider_header_active.removeClass( slider_header_active_class );
			slider_header.find("li").eq(next_nr-1).addClass( slider_header_active_class );
		}

		function get_next_slide_number(string){

			var class_occurences = string.match(/slide./g);

			if(class_occurences.length != 1){
				alert("error slide identification");
			}

			var complete_string = class_occurences[0],
				only_digits = complete_string.replace( /^\D+/g, ''),
				number = parseInt(only_digits)
			;

			return number;
		}

		function start_autoplay(){

			if(autoslide_playing){
				return;
			}

			if( settings["autoplay"] != false ){
				autoslide = window.setInterval(function(){
						slide("next", carousel_holder_width);
					},
					settings["autoplay"]
				);
			}

			autoslide_playing = true;
		}

		function stop_autoplay(){
			if( autoslide_playing ){
				clearInterval( autoslide );
				autoslide_playing = false;
			}
		}

		function reset_autoplay(){
			if( autoslide_playing ){
				stop_autoplay();
				start_autoplay();
			}
		}

		function enable_pause_autoplay(){
			$("."+settings["pause_play_class"]).click(function(){

				if(autoslide_playing){
					stop_autoplay();
				}
				else {
					slide("next", carousel_holder_width);
					start_autoplay();
				}
			});
		}

		function add_update_bubbles(){
			/*
			var carousel = $("."+settings["carousel_class"]).children("ul"),
				carousel_items = carousel.children("li"),
				start = undefined,
				end = undefined
			;
			
			function add_bubbles(){
				var buble_count = end - start,
					html = '<div class="cc-carousel-bubles">'
				;

				for( var i=0; i< buble_count; i++ ){
					html += "<button></button>";
				}

				html += '</div>';

				for( var i=start; i< end; i++ ){
					carousel_items.eq(i).prepend(html);
				}

				start = undefined;
				end = undefined;
			}

			for( i=0; i<carousel_items.length; i++ ){

				// if li doesn't have class main
				if( carousel_items.eq(i).hasClass("main") === false && start === undefined ){
					start = i;
				}
				if( carousel_items.eq(i).hasClass("main") === true && end === undefined && start != undefined ) {
					end = i;
					add_bubbles();
				}
			}
			*/
		}

		var settings,
			carousel_holder = $(this),
			carousel_holder_width = carousel_holder.width()
		;

		setup_user_settings();
		load_carousel_widths(carousel_holder, carousel_holder_width);
		center_carousel(carousel_holder);
		add_update_bubbles();

		// on prev/next click
		$( "."+settings["button_next_class"] ).click(function(){
			slide("next", carousel_holder_width);
			reset_autoplay();
		});
		$( "."+settings["button_prev_class"] ).click(function(){
			slide("prev", carousel_holder_width);
			reset_autoplay();
		});

		// skip to slide
		$(".slider-header li").click(function(){

			if( slideshow_animation_in_progress ){
				return;
			}

			// remove slide's active class
			var slide_active = $("."+settings["carousel_class"]).find( "."+settings["active_slide_class"] ),
				slide_active_index = slide_active.index(),
				target_index = $( ".slide" + ($(this).index()+1) ).index(),
				steps = target_index - slide_active_index,
				steps_abs = Math.abs( steps )
			;

			//console.log( steps_abs );

			if( steps > 0 ){
				for( i=0; i < steps_abs; i++ ){
					$("."+settings["carousel_class"]).find(">ul li").first().appendTo( $("."+settings["carousel_class"]).find(">ul") );
				}
			}
			else {
				for( i=0; i < steps_abs; i++ ){
					$("."+settings["carousel_class"]).find(">ul li").last().prependTo( $("."+settings["carousel_class"]).find(">ul") );
				}
			}

			$("."+settings["carousel_class"]).find( "."+settings["active_slide_class"] ).removeClass( settings["active_slide_class"] );

			slide_active_number = $(this).index()+1;

			$("."+settings["carousel_class"]).find(".slide"+slide_active_number).addClass( settings["active_slide_class"] );

			$(".slider-header .active").removeClass("active");
			$(".slider-header li").eq( $(this).index() ).addClass("active");

			reset_autoplay();

		});

		start_autoplay();
		enable_pause_autoplay();

	}

	$(".cc-carousel").cc_slides({
		slide_speed: 500,
		button_next_class : "cc_slides_next",
		button_prev_class: "cc_slides_prev",
		active_slide_class: "cc_active_slide",
		pause_play_class: "cc_slides_pause_play",
		autoplay: 3000
	});

	// skip to title
	$(".navbar-nav .skip-to-title").click(function(event){
		event.preventDefault();

		var this_href = $(this).attr("href"),
			this_href_top = $(this_href).offset().top
		;

		$("html, body").animate({scrollTop: this_href_top - top_menu_height}, 0);
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
	top_menu_height = $(".js-keep-on-top").height()+70,
	animation_started = false,
	screen_xs =  480,
	screen_sm =  768,
	screen_md =  992,
	screen_lg = 1200,
	grid_float_breakpoint = screen_sm,
	// slider
	slideshow_position = 0,
	slideshow_animation_in_progress = false,
	autoslide_playing = false
;