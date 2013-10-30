function fix_nav_wrap_width(){

	$(".js-full-bg").css({
		"width": viewport-17, // 17 for scrollbar
		"margin-left": - side
	});
}

function fix_stripe(){
	$(".js-red-stripe-visual").css(
		{ // fix stripe
			"left": side - 61,
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
		stripe_width = header_width - 327 + 18,
		top_menu_offset = $(".js-keep-on-top").offset()["top"],
		top_menu_height = $(".js-keep-on-top").height()+70
	;
}

function update_scroll_variables(){
	window_scroll_top = $(window).scrollTop();
	scroll_to_cookie(window_scroll_top);
}

function fix_sticky_menu(){

	var menu = $('.js-keep-on-top'),
		bg1 = $('.js-top-menu-one'),
		bg2 = $('.js-top-menu-two'),
		body = $('bodyz'),
		menu_height = menu.height() + 70
	;

	if( $(window).scrollTop() > top_menu_offset && viewport >= grid_float_breakpoint ){
		if( !menu.hasClass("js-sticked") ){
			menu.addClass("js-sticked");
			menu.parent().css("padding-bottom", menu_height);
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

		//body.css("padding-top", menu_height );
	}
	else {
		if( menu.hasClass("js-sticked") ){
			menu.removeClass("js-sticked");
			menu.parent().css("padding-bottom", "");
		}

		if( bg1.hasClass("active") ){
			bg1.removeClass("active");
		}
		if( bg2.hasClass("active") ){
			bg2.removeClass("active");
		}


		//body.css("padding-top", "" );
	}
}

function fix_sliding_stripe(){

	var minus_right = 0;

	if(viewport<screen_sm){
		minus_right = 45;
	}

	$(".css-js-sliding-background").css(
		{
			"width": 306,
			"height": header_height,
			"left": side
		}
	);

	$(".css-js-sliding-background>.inside_stripe").css(
		{
			"height": header_height,
			"width": 642,
			"right": -336 - minus_right
		}
	);
}

function update_sliding_stripe(){

	var minus_right = 0,
		plus_left = 0
	;

	if(viewport<screen_sm ){
		minus_right = 45;
	}
	if( $(".css-js-sliding-background").hasClass("background_on") ){
		plus_left = slider_holder_width
	}

	$(".css-js-sliding-background").css(
		{
			"height": header_height,
			"left": side + plus_left
		}
	);

	$(".css-js-sliding-background>.inside_stripe").css(
		{
			"height": header_height,
			"right": -336 - minus_right
		}
	);
}

function enable_sliding_stripe(target_hover){

	if(target_hover.length < 1){
		return;
	}

	var sliding_speed = 100,
		distance_to_right_side = undefined,
		hover = target_hover.children(".img-box-hover"),
		hover_width = viewport - target_hover.offset().left - 17
	;

	distance_to_right_side = viewport - 17 - $(".inside_stripe").offset().left - $(".inside_stripe").width() + slider_holder_width;
	distance_to_right_side = Math.floor(distance_to_right_side);

	$(".css-js-sliding-background").css(
		{
			left: "+="+slider_holder_width,
			width: distance_to_right_side
		}
	).addClass("background_on z-index2");

	$(".css-js-sliding-background .content").css("display", "block");

	/*
	$(target_hover).hover(function(e)

		{

			//
			//hover.css(
			//	{
			//		"width": hover_width,
			//		"height": target_hover.height()
			//	}
			//);
			//
			

			if( stripe_slide_animation_in_progress ){
				return;
			}
			stripe_slide_animation_in_progress = true;
			stripe_slide_in = true;

			$(".css-js-sliding-background").hoverFlow(e.type, { left: "+="+slider_holder_width }, sliding_speed, function(){
				
				distance_to_right_side = viewport - 17 - $(".inside_stripe").offset().left - $(".inside_stripe").width() + slider_holder_width;
				distance_to_right_side = Math.floor(distance_to_right_side);
				$(this).addClass("bg-blueGrayLight z-index2");
				window.setTimeout(function(){
					$(".css-js-sliding-background .content").fadeIn(sliding_speed);
				}, 50);
				
				$(".css-js-sliding-background").hoverFlow(e.type, { width: "+="+distance_to_right_side }, sliding_speed);
				
			});
		}//,
		//function(e)
		//{
		//	if(stripe_slide_in!=true){
		//		return;
		//	}
		//
		//	$(".css-js-sliding-background").hoverFlow(e.type, { width: "-="+distance_to_right_side }, sliding_speed, function(){
		//		
		//		$(".css-js-sliding-background .content").css("display", "none");
		//		$(this).removeClass("bg-blueGrayLight z-index2");
		//
		//		$(".css-js-sliding-background").hoverFlow(e.type, { left: "-="+slider_holder_width }, sliding_speed, function(){
		//			stripe_slide_animation_in_progress = false;
		//		});
		//
		//	});
		//
		//	hover.css(
		//		{
		//			"width": "",
		//			"height": ""
		//		}
		//	);
		//	stripe_slide_in = false;
		//}
		
	);
	*/

	$(".js-click-to-truckviser").click(function(){
		$(".navbar-nav").children("li").eq(1).children("a").click();
	});
}

function scroll_to_cookie(positionTop){
	$.cookie( location.pathname.substring(1), positionTop);
}

function drop_to_cooked_location(){

	if( $.cookie("dropscroll") === undefined ){
		return;
	}

	var this_location = location.pathname.substring(1);

	if( $.cookie(this_location) === undefined ){
		return;
	}

	$("html, body").scrollTop( $.cookie(this_location) );

	fix_sticky_menu();

	$.removeCookie('dropscroll');

}

function toggleBlackout(obj){
	// requires var blackout_status bool

	// var obj = { z-index, menu }

	var blackout_speed = 0;

	if( blackout_status === false ){

		if( obj["menu"] != undefined && $(".js-menu-wrap").length > 0 ){
			$(".js-menu-wrap").html('<div class="blackout"></div>');
		}

		if( obj["subscribe-news"] != undefined ){
			$("#subscribe-news").css("z-index", obj["z-index"]+1 );
			$("#js-subscribe-news").parent().css( "z-index", obj["z-index"]+1  ).addClass("seperator-fix");
		}


		$(".blackout").css({"z-index": obj["z-index"] });
		$(".blackout").fadeIn(blackout_speed);
		blackout_status = true;
	}
	else {
		$(".blackout").fadeOut(blackout_speed, function(){

			if( $(".js-menu-wrap").length > 0 ){
				$(".js-menu-wrap").html("");
			}

			if( $("#subscribe-news").length > 0 && $("#js-subscribe-news").parent().length > 0 ){
				$("#subscribe-news").css("z-index", "");
				$("#js-subscribe-news").parent().css("z-index", "").removeClass("seperator-fix");
			}

		});
			
		blackout_status = false;
	}
}

function scroll_to_object_if_not_visible(window_scroll_top, object){

	if( object.length < 1 ){
		return;
	}

	var scroll_top_visibility = window_scroll_top + $(window).height(),
		item_scroll_bottom = object.offset().top + object.height(),
		diff = item_scroll_bottom - scroll_top_visibility
	;

	if( scroll_top_visibility < item_scroll_bottom ){
		$("html, body").animate({scrollTop: window_scroll_top + diff }, 500);
	}
}

/* DOCUMENT READY */
$(function() {

	$("body").addClass("invisible");

	update_global_variables();

	fix_nav_wrap_width();

	fix_stripe();

	fix_sticky_menu();

	// Show page to the user
	$("body").removeClass("invisible");

	// SLIDING STRIPE

	fix_sliding_stripe();

	// Do some more stuff

	enable_sliding_stripe($(".tablet-driver-blue .img-box"));

	drop_to_cooked_location();

	/*
	if( $('.unslider').length > 0 ){
		flipbox_height = $(".flipbox-container").height();
		$(".flipbox-container").height(flipbox_height);

		$('.unslider').unslider({
			delay: 500
		});
	}
	*/


	
	$(".tablet-driver-red").hover(function(e) {

		var speed = 400;

			if( viewport < screen_md ){
				return;
			}

			$(".js-red-stripe").css("z-index", 1)
				.hoverFlow(e.type, {
					left: "+=327",
					"z-index": 2
				}, speed
			);

			$(".js-stripe-contents").hoverFlow(e.type, {
					opacity: 1
				}, speed
			);

			$(".js-play-fadetoggle").fadeOut(speed/1.5);

			$(".tablet-driver-red").css("width", header_width - 327 + 15);

			animation_started = true;

		},

		function(e) {

			var speed =300;

			if( viewport < screen_md || animation_started != true  ){
				return;
			}

			$(".js-red-stripe").hoverFlow(e.type, { left: "-=327"}, speed, function(){
				$(".js-red-stripe").css("z-index", 0);
			});

			$(".js-stripe-contents").hoverFlow(e.type, { opacity: 0}, speed);

			$(".js-play-fadetoggle").fadeIn(speed/1.5);

			$(".tablet-driver-red").css("width", "");
		}
	);

	// CC SLIDES

		if( $(".cc-carousel-holder").length > 0 ){

			function set_cc_interval(speed){
				clearInterval(cc_autoplay);
				cc_autoplay = setInterval(function(){
					$(".cc_slides_next").click();
				}, speed);
				current_speed = speed;
			}

			var slide_active = "a";
			var slide_active_class = "cc_slide_active";
			var autoplay_interval = 6500;
			var autoplay_interval2 = 3000;
			var cc_autoplay;
			var current_speed;

			$(".slider-header li").click(function(){
				var this_position = $(this).index();
				$(".slider-header .active").removeClass("active");

				// RESET SLIDE SPEED UNLESS NUOTOLINIS VALDYMAS
				if( this_position === 4 ){
					slider_b2.goToSlide(0);
					set_cc_interval(autoplay_interval2);
				}
				else {
					set_cc_interval(autoplay_interval);
				}
				if( this_position === 3 ){
					slider_b1.goToSlide(0);
				}

				slider_a.goToSlide( this_position );
				$(".slider-header li").eq( this_position ).addClass("active");
			});

			set_cc_interval(autoplay_interval);

			$(".cc_slides_next").click(function(){

				// IF NEXT LI CONTAINS SLIDER, RESET IT'S POSITION
				if( $("." + slide_active_class).next().find(".bx-slider-b1").length > 0 ){
					slider_b1.goToSlide(0);
				}
				if( $("." + slide_active_class).next().find(".bx-slider-b2").length > 0 ){
					slider_b2.goToSlide(0);
				}

				if( $("." + slide_active_class).find(".bx-slider-b2").length > 0 ){
					// RESET SLIDER
					if( slider_b2.getCurrentSlide()+1 === slider_b2.getSlideCount() ){
						set_cc_interval(autoplay_interval);

					}
				}

				

				// IF NO SLIDERS INSIDE, JUST ROLL THE MAIN SLIDE
				if( $("." + slide_active_class).children(".bx-wrapper").length < 1 ){
					slider_a.goToNextSlide();
					return;
				}

				// IF CURRENT SLIDER IS ON IT'S LAST SLIDE, ROLL MAIN SLIDE
				// ELSE ROLL CHILD SLIDER
				if( $("." + slide_active_class).find(".bxslider").hasClass("bx-slider-b2") ){

					if( slider_b2.getCurrentSlide()+1 === slider_b2.getSlideCount() ){

						slider_a.goToNextSlide();
						return;
					}

					slider_b2.goToNextSlide();
				}

				if( $("." + slide_active_class).find(".bxslider").hasClass("bx-slider-b1") ){

					if( slider_b1.getCurrentSlide()+1 === slider_b1.getSlideCount() ){
						slider_a.goToNextSlide();
						return;
					}

					slider_b1.goToNextSlide();
				}

			});

			$(".cc_slides_prev").click(function(){

				if( $("." + slide_active_class).prev().find(".bx-slider-b1").length > 0 ){
					slider_b1.goToSlide(  slider_b1.getSlideCount() -1 );
				}
				if( $("." + slide_active_class).prev().find(".bx-slider-b2").length > 0 ){
					slider_b2.goToSlide( slider_b2.getSlideCount() -1 );
				}

				if( $("." + slide_active_class).children(".bx-wrapper").length < 1 ){
					slider_a.goToPrevSlide();
					return;
				}

				if( $("." + slide_active_class).find(".bxslider").hasClass("bx-slider-b2") ){

					if( slider_b2.getCurrentSlide() === 0 ){
						slider_a.goToPrevSlide();
						return;
					}

					slider_b2.goToPrevSlide();
				}

				if( $("." + slide_active_class).find(".bxslider").hasClass("bx-slider-b1") ){

					if( slider_b1.getCurrentSlide() === 0 ){
						slider_a.goToPrevSlide();
						return;
					}

					slider_b1.goToPrevSlide();
				}

			});

			$(".cc_slides_pause_play").click(function(){
				var element = $(this);
				if( element.hasClass("paused") ){
					$(".cc_slides_next").click();
					element.removeClass("paused");
					set_cc_interval(current_speed);
				}
				else {
					element.addClass("paused");
					clearInterval(cc_autoplay);
				}
			});

			slider_b1 = $('.bx-slider-b1').bxSlider({
				controls: false,
				useCSS: false,
				onSliderLoad: function(){
					slider_b2 = $('.bx-slider-b2').bxSlider({
						controls: false,
						useCSS: false,
						mode: "vertical",
						onSliderLoad: function(){
							slider_a = $('.bx-slider-a').bxSlider({
								controls: false,
								useCSS: false,
								pager: false,
								onSlideAfter: function(){
									var current_slide = slider_a.getCurrentSlide() + 1;

									// set active class on main slides
									$('.bx-slider-a>li').removeClass(slide_active_class);
									$('.bx-slider-a').children('li').eq( current_slide ).addClass(slide_active_class);


									// set active in navigation
									$(".slider-header .active").removeClass("active");
									$(".slider-header li").eq( current_slide-1 ).addClass("active");

									// CHANGE SPEED ON NUOTOLINIS VALDYMAS
									if(  $("." + slide_active_class).find('.bx-slider-b2').length > 0 ){
										set_cc_interval(autoplay_interval2);
									}


								}
							});
						}
					});
				}
			});

		}

	//

	// SKIP TO TITLE
		$(".navbar-nav .skip-to-title").click(function(event){
			event.preventDefault();

			var this_href = $(this).attr("href"),
				this_href_top = $(this_href).offset().top,
				extra = 72
			;

			
			if( $(this).hasClass("js-has-zigzag") ){
				extra +=-26;
			}

			if( $(this).hasClass("js-first-item") ){
				extra +=-10;
			}
			

			$("html, body").animate({scrollTop: this_href_top - top_menu_height - extra }, 500);
		});
	//

	// put selected_item on clicked
	var selected_class_name = "selected_item";
	$(".navbar-nav>li").click(function(){
		if( $(this).hasClass(selected_class_name) || $(this).hasClass("dropdown") ){
			return;
		}
		else {
			$(".navbar-nav>li."+selected_class_name).removeClass(selected_class_name);
			$(this).addClass(selected_class_name);
		}
	});


	$(".js-click-link-to-truckviser").click(function(){
		window.location = "truckviser.html";
	});

	$(".js-click-link-to-claims-control-system-landing").click(function(){
		window.location = "zalu-valdymo-sistema.html";
	});

	// SUBSCRIBE NEWS

		$("#js-subscribe-news").click(function(event){
			event.preventDefault();
			$("#subscribe-news").toggle({duration: 0});
			$(".subscription-block").children("li").eq(2).toggleClass("active");
			$(".subscription-block").children("li").eq(2).children("a").toggleClass("hover");
			toggleBlackout(
					{
						"z-index": 4,
						"subscribe-news": true
					}
				);
		});

		$("#close-news-subscribing").click(function(event){
			event.preventDefault();
			$("#subscribe-news").hide();
			$(".subscription-block").children("li").eq(2).toggleClass("active");
			$(".subscription-block").children("li").eq(2).children("a").toggleClass("hover");
			$("#form-status").html("");
			toggleBlackout(
					{
						"z-index": 4,
						"subscribe-news": true
					}
				);
		});

	//

	// ENABLE TOP MENU DROPDOWN ON HOVER (LARGE SCREENS ONLY)
		if( viewport >= screen_lg ){
			$(".navbar-nav>.dropdown").mouseenter(function(){
				if( $(this).hasClass("open") ){
					return;
				}
				$(this).children("a").click();
				toggleBlackout(
					{
						"z-index": 3,
						"menu": true
					}
				);
			});

			$(".navbar-nav>.dropdown").mouseleave(function(){
				if( $(this).hasClass("open") === false ){
					return;
				}
				$(this).children("a").click();
				toggleBlackout(
					{
						"z-index": 3,
						"menu": true
					}
				);
			});
		}
	//


    // SLIDE SCREENS ON HOVER INSTEAD OF FLIP

    if( $(".js-hover-to-slide").length > 0 ){

    	glide = $(".slider-with-nav").glide(
	    	{
	        	autoplay: 4000,
	        	arrows: false,
	        	nav: true,
	        	animationTime: 500
			}
	    )
	    	.data('api_glide')
	    ;
	    glide.pause();

	    var slider = $(".slider-with-nav").detach();
	    slider.css({
	    	position: "absolute",
	    	left: 0,
	    	top: 0,
	    	display: "none",
	    	"z-index": 2
	    });

	    $(".js-hover-to-slide").append(slider);

    	$(".js-hover-to-slide").mouseenter(function(e){
    		glide.jump(1);
    		glide.pause();
			$(".slider-with-nav").fadeIn(500, function(){
				glide.play();
			});

		});

		$(".js-hover-to-slide").mouseleave(function(e){
			$(".slider-with-nav").fadeOut(500);
		});

    }
	

	function reset_glide_position(){
		glide.jump(1);
		glide.pause();
	}

	if( $(".slider-without-nav").length > 0 ){

		glide = $(".slider-without-nav").glide(
	    	{
	        	autoplay: false,
	        	arrows: false,
	        	nav: false,
	        	animationTime: 1000
			}
	    )
	    	.data('api_glide')
	    ;

	    function midWayFunction(){
			clock = $(".countdown").detach();
			reset_glide_position();
		}

		function midWayReverseFunction(){
			$(".countdown").remove();
			$(".blue-box-in-header .relative").append(clock);
			if( slider_speed != undefined ){
				clearInterval(my_sliding_interval);
			}
			detached_slider = $(".slider-without-nav").detach();
		}

		function flipCompleteFunction(){
			setTimeout(function(){
				glide.play();
				glide.next();
				my_sliding_interval = setInterval(function(){
					glide.next();
				},slider_speed);
			},2000);
			
		}

		var clock, my_sliding_interval;
		var detached_slider = $(".slider-without-nav").detach();
		var slider_speed = 4000;
		var verso_html = detached_slider;


	}

	if( $(".flipbox-container").length > 0 ){
		var flip_in_progress = false,
			reverse_in_progress = false,
			reverse_in_queue = false,
			flipbox_fliped = false,
			mouse_inside = false,
			mouse_outside = false,
			reverse_in_progress_on_mouseenter = false,
			revMidwayFound = false
		;

		if( verso_html === undefined ){
			verso_html = "";
		}

		$(".flipbox-container").mouseenter(function(){

			if( mouse_inside ){
				return;
			}
			mouse_inside = true;
			console.log("in");

			if( reverse_in_progress ){
				reverse_in_progress_on_mouseenter = true;
			}

			reverse_in_queue = false;

			if( flipbox_fliped || flip_in_progress ){
				return;
			}

			$(".flipbox").flippy({
				color_target: "",
				duration: "500",
				verso: verso_html,
				direction: "LEFT",
				onStart: function(){
					flip_in_progress = true;
				},
				onMidway: function(){
					midWayFunction();
				},
				onFinish: function(){
					flip_in_progress = false;
					flipbox_fliped = true;

					if( reverse_in_queue ){
						$(".flipbox").flippyReverse();
						return;	
					}

					flipCompleteFunction();
				},
				onReverseStart: function(){
					reverse_in_progress = true;
				},
				onReverseAnimation: function(){
					
					if( revMidwayFound === false ){
						if( $(".blue-box-in-header").length > 0 ){
							revMidwayFound = true;
							midWayReverseFunction();
						}
					}

				},
				onReverseFinish: function(){
					reverse_in_progress = false;
					flipbox_fliped = false;
					reverse_in_queue = false;
					revMidwayFound = false;
				}
			});

		});

		$(".flipbox-container").mouseleave(function(){

			mouse_inside = false;
			console.log("out");

			if(flip_in_progress){
				reverse_in_queue = true;
				return;
			}

			if( reverse_in_progress ){
				return;
			}

			if( reverse_in_progress_on_mouseenter ){
				reverse_in_progress_on_mouseenter = false;
				return;
			}

			//console.log("flip in progress", flip_in_progress);

			$(".flipbox").flippyReverse();

		});
	}

    //

    $(".dropdown").click(function(){

    	var dropdown = $(this),
    		dropdown_menu = dropdown.children(".dropdown-menu"),
    		dropdown_menu_height = dropdown_menu.height() + 10,
    		dropdown_top = dropdown.offset().top - window_scroll_top
    		bottom_available = $(window).height() -65 - dropdown_top
    	;

    	if( dropdown.hasClass("open") ){
    		return;
    	}

    	
    	
    	if( bottom_available < 200 ){

    		if( dropdown.hasClass("drop-top") === false ){
    			dropdown.addClass("drop-top");

    			dropdown_menu.css("top", -dropdown_menu_height);
    		}
    	}
    
		else if( dropdown.hasClass("drop-top") ){
			dropdown.removeClass("drop-top");
			dropdown_menu.css("top", "");
		}
		
    	
    });

	bajb_backdetect.OnBack = function(){
		$.cookie('dropscroll', 'true');
	}

	if( $("#anim1").length > 0 ){
		animate_icon.mirror( $("#anim1>.primary"), $("#anim1>.primary>.secondary") );
	}


	// On load

	/*$(window).load(function(){
		
	});*/


	// Don't forget responsiveness and update stuff as screen size changes
	$(window).resize(function(){
	
		update_global_variables();

		fix_nav_wrap_width();

		fix_stripe();

		fix_sticky_menu();

		update_sliding_stripe()

	});

	$(window).scroll(function(){
		update_scroll_variables();
		fix_sticky_menu();
	});

});



//	Global variables

	viewport = $(window).width()+17,
	side = $(".js-nav-wrap").position()["left"],
	header_height = $(".js-bg-red-blue").height(),
	header_width = $(".js-bg-red-blue .container").width(),
	stripe_width = header_width - 327 + 18,
	top_menu_offset = $(".js-keep-on-top").offset()["top"],
	top_menu_height = $(".js-keep-on-top").height()+70,
	animation_started = false,
	screen_xs =  480,
	screen_sm =  768,
	screen_md =  992,
	screen_lg = 960,
	grid_float_breakpoint = screen_sm,
	window_scroll_top = $(window).scrollTop(),
	// slider
	slideshow_position = 0,
	slideshow_animation_in_progress = false,
	stripe_slide_animation_in_progress = false,
	stripe_slide_in = false,
	autoslide_playing = false,
	slider_holder_width = 314,
	blackout_status = false
	;

	var animate_icon = {
		mirror: function(primary, secondary){
			var flip_in_progress = false,
			reverse_in_progress = false,
			reverse_in_queue = false,
			flipbox_fliped = false,
			mouse_inside = false,
			mouse_outside = false,
			reverse_in_progress_on_mouseenter = false,
			revMidwayFound = false,
			verso_html = '<img src="../images/anim/tablet_white_mirror.png" alt="tablet" />'
		;

		if( verso_html === undefined ){
			verso_html = "";
		}

		primary.mouseenter(function(){

			if( mouse_inside ){
				return;
			}
			mouse_inside = true;
			console.log("in");

			if( reverse_in_progress ){
				reverse_in_progress_on_mouseenter = true;
			}

			reverse_in_queue = false;

			if( flipbox_fliped || flip_in_progress ){
				return;
			}

			secondary.flippy({
				color_target: "",
				duration: "500",
				verso: verso_html,
				direction: "LEFT",
				onStart: function(){
					flip_in_progress = true;
				},
				onFinish: function(){
					flip_in_progress = false;
					flipbox_fliped = true;

					if( reverse_in_queue ){
						secondary.flippyReverse();
						return;	
					}
				},
				onReverseStart: function(){
					reverse_in_progress = true;
				},
				onReverseFinish: function(){
					reverse_in_progress = false;
					flipbox_fliped = false;
					reverse_in_queue = false;
				}
			});

		});

		primary.mouseleave(function(){

			mouse_inside = false;
			console.log("out");

			if(flip_in_progress){
				reverse_in_queue = true;
				return;
			}

			if( reverse_in_progress ){
				return;
			}

			if( reverse_in_progress_on_mouseenter ){
				reverse_in_progress_on_mouseenter = false;
				return;
			}

			secondary.flippyReverse();

		});
		}
	};
//