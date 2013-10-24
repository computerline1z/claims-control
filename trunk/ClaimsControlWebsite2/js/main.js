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

	$.fn.cc_slides = function(options){

		$(".cc_slides_pause_play").click(function(){
			$(this).toggleClass("paused");
		});

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

	if( $(".cc-carousel").length > 0 ){
		$(".cc-carousel").cc_slides({
			slide_speed: 500,
			button_next_class : "cc_slides_next",
			button_prev_class: "cc_slides_prev",
			active_slide_class: "cc_active_slide",
			pause_play_class: "cc_slides_pause_play",
			autoplay: 6500
		});
	}

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

    if( $(".slider-with-nav").length > 0 ){
    	glide = $(".slider-with-nav").glide(
	    	{
	        	autoplay: 2000,
	        	arrows: false,
	        	nav: true
			}
	    )
	    	.data('api_glide')
	    ;
	    glide.pause();
    }

    // SLIDE SCREENS ON HOVER INSTEAD OF FLIP

    
    /*
    $(".js-hover-to-slide").mouseenter(function(e){
    	$(".css-js-hover-slider").css({top:0,opacity:0}).hoverFlow( e.type, {opacity:1}, 400, function(){
    		glide.play();
    	});
    });

    $(".js-hover-to-slide").mouseleave(function(e){
    	glide.pause();
    	$(".css-js-hover-slider").hoverFlow(e.type, {opacity:0}, 400);
    });
	*/

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
			glide.play();
			glide.next();
			my_sliding_interval = setInterval(function(){
				glide.next();
			},slider_speed);
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
				duration: "800",
				verso: verso_html,
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
//