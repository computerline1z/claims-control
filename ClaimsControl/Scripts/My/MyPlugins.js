(function ($) {
	$.fn.extend({
		//pass the options variable to the function
		ValidateOnBlur: function (options) {
			//Set the default values, use comma to separate the settings, example:
			var defaults = {
				ValidArray: [],
				Allow: 'Integer', //Decimal Date Time DateCtrl DateNotLessCtrl DateNotMoreCtrl  //Sutampa su nurodymais oDATA.SD.Cols[i].Type
				Trim: true
			}
			var opt = $.extend(defaults, options);
			//Jei turi but array, jo opcija ValidArray
			//ValidateOnBlur({ Allow: 'Integer' })
			//ValidateOnBlur({ Allow: 'Decimal' })
			return this.each(function () {
				var t = $(this);
				t.blur(function () {
					var inputVal = t.val();
					var re = /^(\s*)([\W\w]*)(\b\s*$)/;
					if (re.test(inputVal)) {
						inputVal = inputVal.replace(re, '$2');
					} //remove leading and trailing whitespace characters
					if (opt.ValidArray.length) {
						var idx = jQuery.inArray(inputVal, ValidArray); if (idx === -1) { t.val(""); return; }
					}
					else if (opt.Allow === 'Integer') {
						re = /\D*(\d+)\D*/; if (re.test(inputVal)) inputVal = inputVal.replace(re, "$1"); else { t.val(""); return; }
					}
					else if (opt.Allow === 'Decimal') {
						inputVal = inputVal.replace(',', '.'); //re=/.*?(([0-9]?\.)?[0-9]+).*/g;
						re = /\D*(\d\d*\.\d+|\d+)\D*/;
						if (re.test(inputVal))
							inputVal = inputVal.replace(re, "$1");
						else { t.val(""); return; }
					}
					else if (opt.Allow === 'Date' || opt.Allow === 'DateCtrl' || opt.Allow === 'DateNotLessCtrl' || opt.Allow === 'DateNotMoreCtrl') {
						//inputVal = inputVal.replace('.', '-').replace('/', '-').replace('\\', '-');
						inputVal = inputVal.replace('-', '.').replace('/', '.').replace('\\', '.');
						//re = $.validity.patterns.date;
						//if (re.test(inputVal))
						//	inputVal = inputVal.replace(re, "$1");
						//if ($.isNumeric(inputVal) && opt.Allow === 'DateNotMoreCtrl') { if ((parseInt(inputVal, 10)) >= ((new Date()).getFullYear())) { inputVal = ((new Date()).getFullYear()); } }
						//if ($.isNumeric(inputVal) && opt.Allow === 'DateNotLessCtrl') { if ((parseInt(inputVal, 10)) <= ((new Date()).getFullYear())) { inputVal = ((new Date()).getFullYear()); } }
						//else { t.val(""); return; }
					}
					else if (opt.Allow === 'Year' || opt.Allow === 'YearNotMore' || opt.Allow === 'YearNotLess') {
						inputVal = inputVal.replace('.', '-').replace('/', '-').replace('\\', '-');
						re = /\.*(19|20\d{2})\.*/;
						if (re.test(inputVal)) inputVal = inputVal.replace(re, "$1");
						if ($.isNumeric(inputVal) && opt.Allow === 'YearNotMore') { if ((parseInt(inputVal, 10)) >= ((new Date()).getFullYear())) { inputVal = ((new Date()).getFullYear()); } }
						if ($.isNumeric(inputVal) && opt.Allow === 'YearNotLess') { if ((parseInt(inputVal, 10)) <= ((new Date()).getFullYear())) { inputVal = ((new Date()).getFullYear()); } }
						else { t.val(""); return; }
					}
					// \.*(19|20\d{2})\.*
					//\.*((19|20\d{2})[./-]([0]?[1-9]|[1][0-2])[./-]([0-2][1-9]|3[0-1]|\d))+\.*
					t.val(inputVal);
				});
			});
		}
	});
})(jQuery);

/* Lithuanian (UTF-8) initialisation for the jQuery UI date picker plugin. */
/* @author Arturas Paleicikas <arturas@avalon.lt> */
jQuery(function ($) {
	$.datepicker.regional['lt'] = {
		closeText: 'Uždaryti',
		prevText: '&#x3c;Atgal',
		nextText: 'Pirmyn&#x3e;',
		currentText: 'Šiandien',
		monthNames: ['Sausis', 'Vasaris', 'Kovas', 'Balandis', 'Gegužė', 'Birželis',
					 'Liepa', 'Rugpjūtis', 'Rugsėjis', 'Spalis', 'Lapkritis', 'Gruodis'],
		monthNamesShort: ['Sau', 'Vas', 'Kov', 'Bal', 'Geg', 'Bir',
					 'Lie', 'Rugp', 'Rugs', 'Spa', 'Lap', 'Gru'],
		dayNames: ['sekmadienis', 'pirmadienis', 'antradienis', 'trečiadienis', 'ketvirtadienis', 'penktadienis', 'šeštadienis'],
		dayNamesShort: ['sek', 'pir', 'ant', 'tre', 'ket', 'pen', 'šeš'],
		dayNamesMin: ['Se', 'Pr', 'An', 'Tr', 'Ke', 'Pe', 'Še'],
		weekHeader: 'Sv',
		dateFormat: 'yy.mm.dd',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''
	};
	$.datepicker.setDefaults($.datepicker.regional['lt']);
	$.datepicker.setDefaults({
		duration: 'fast',
		changeMonth: true,
		changeYear: true,
		showOtherMonths: true
	});
});
(function ($) {
	$.fn.extend({
		tblSortable: function (options) {
			var defaults = { cols: [], controller: null, sortedCol: 1 }
			var opt = $.extend(defaults, options);
			return this.each(function () {
				$(this).find('th').each(function(index){
					if (opt.cols[index]){
						$(this).addClass("clickable").on("click",function(e){
							var $e=$(e.target), classes=$e.find("span").attr("class"),newClass,n="ui-icon-carat-1-n",s="ui-icon-carat-1-s",ns="ui-icon-carat-2-n-s"							
							if (classes.indexOf(ns)>-1){newClass=s;}	//Nerūšiuota	
							else if (classes.indexOf(n)>-1){newClass=s;}//desc
							else if (classes.indexOf(s)>-1){newClass=n;}//asc
							else  throw new Error("no needed class found");
							
							$e.closest("tr").find("span."+n).toggleClass(n+" "+ns);
							$e.closest("tr").find("span."+s).toggleClass(s+" "+ns);
							$e.find("span").toggleClass(ns+" "+newClass);
							
							var c=App[opt.controller];							
							if (newClass===s){c.set("sortAscending", true);}else{c.set("sortAscending", false);}
							c.set("sortProperties",[opt.cols[index]]);
							c.set("content",c.get("arrangedContent"));
						}).append('<span class="ui-icon ui-icon-carat-2-n-s ui-tblHead-icon"></span>');
						if (index===opt.sortedCol){$(this).trigger("click"); }
					}
				});
			});
		}
	});
})(jQuery);

(function($){
	$.fn.scrollelement = function(options) {
		var defaults = { 
			'animate': false,
			'duration': '1000',
			'easing': 'linear',
			'complete': function(){},
			'offset': 0,
		};
		
		var options = $.extend(defaults, options);
		
		return this.each(function() {
			var element = $(this);
			var offset = element.offset().top - options.offset;
			var toScroll = 0;
			
			$(window).scroll(function(){ 
				var scroll = $(window).scrollTop();
				if( scroll > offset ){
					toScroll = offset+(scroll - offset);
					//toScroll = scroll - originalOffset;
				} else {
					//toScroll = 0;
					toScroll = offset;
				}
				
				// if( scroll > originalOffset ){
					// toScroll=scroll-originalOffset;
				// } else {
					// toScroll = originalOffset;
				// }
				
				//element.stop().offset({top:toScroll});
				if( options.animate == true ){
					element.stop().animate({"margin-top": toScroll + "px"}, options.duration, options.easing, options.complete );
				} else {
					//element.stop().css("margin-top", toScroll + "px");
					element.stop().offset({top:toScroll});
				}
			});
			
		});
	}
})(jQuery);
(function($) {
    // Public: jScroll Plugin
    $.fn.jScroll = function(options) {
        var opts = $.extend({}, $.fn.jScroll.defaults, options);
        return this.each(function() {
			var $element = $(this);
			var $window = $(window);
			var locator = new location($element);
			
			$window.scroll(function() {
				$element
					.stop()
					.animate(locator.getMargin($window), opts.speed);
			});
        });
		// Private 
		function location($element)
		{
			this.min = $element.offset().top;
			this.originalMargin = parseInt($element.css("margin-top"), 10) || 0;
			
			this.getMargin = function ($window)
			{
				var max = $element.parent().height() - $element.outerHeight();
				var margin = this.originalMargin;
			
				if ($window.scrollTop() >= this.min)
					margin = margin + opts.top + $window.scrollTop() - this.min; 
				
				if (margin > max)
					margin = max;
			
				return ({"marginTop" : margin + 'px'});
			}
		}	   
    };
    // Public: Default values
    $.fn.jScroll.defaults = {
        speed	:	"fast",
		top		:	0
    };
})(jQuery);
(function( $ ){
	//plugin buttonset vertical
	$.fn.buttonsetv = function() {
		$(':radio, :checkbox', this).wrap('<div/>');// style="margin: 1px"
		var ret=$(this).buttonset();
		$('label:first', this).removeClass('ui-corner-left').addClass('ui-corner-top');
		$('label:last', this).removeClass('ui-corner-right').addClass('ui-corner-bottom');
        $('label:first', this).css('border-bottom', 'none');
        $('label:last', this).css('border-bottom', 'solid 1px #ccc');
		mw = 0; // max witdh
		// $('label', this).each(function(index){
			// w = $(this).width();
			// if (w > mw) mw = w; 
		// })
		// $('label', this).each(function(index){
			// $(this).width(mw);
		// })
		return ret;
	};
})( jQuery );
jQuery.loadScript = function (url, arg1, arg2) {
	var cache = false, callback = null;
	//arg1 and arg2 can be interchangable
	if ($.isFunction(arg1)){
		callback = arg1;	cache = arg2 || cache;
	} else {
		cache = arg1 || cache; callback = arg2 || callback;
	}
							 
	var load = true;
	//check all existing script tags in the page for the url
	jQuery('script[type="text/javascript"]')
		.each(function () { 
			return load = (url != $(this).attr('src')); 
		});
	if (load){
		//didn't find it in the page, so load it
		jQuery.ajax({type: 'GET',url: url,success: 
			callback,
		dataType: 'script',cache: cache});
	} else {
		//already loaded so just call the callback
		if (jQuery.isFunction(callback)) {
			callback.call(this);
		};
	};
};