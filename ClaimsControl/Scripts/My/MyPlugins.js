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
							var $e=(e.target.tagName.toUpperCase()==="TH")?$(e.target ):$(e.target ).closest("th"), classes=$e.find("span").attr("class"),newClass,n="ui-icon-carat-1-n",s="ui-icon-carat-1-s",ns="ui-icon-carat-2-n-s"							
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
/*
*   jQuery.stickyPanel
*   ----------------------
*   version: 2.0.1
*   date: 3/13/13
*   Copyright (c) 2011 Donny Velazquez
*   http://donnyvblog.blogspot.com/
*   http://code.google.com/p/sticky-panel/
*   Licensed under the Apache License 2.0
*   revisions
*   -----------------------
*   11/19/12 - re-architect plugin to use jquery.com best practices http://docs.jquery.com/Plugins/Authoring
*/
(function ($) {
var methods = {
        options: {
            // Use this to set the top margin of the detached panel.
            topPadding: 0,
            // This class is applied when the panel detaches.
            afterDetachCSSClass: "",
            // When set to true the space where the panel was is kept open.
            savePanelSpace: false,
            // Event fires when panel is detached
            // function(detachedPanel, panelSpacer){....}
            onDetached: null,
            // Event fires when panel is reattached
            // function(detachedPanel){....}
            onReAttached: null,
            // Set this using any valid jquery selector to 
            // set the parent of the sticky panel.
            // If set to null then the window object will be used.
            parentSelector: null
        },
        init: function (options) {
            var options = $.extend({element:$(this)}, methods.options, options);
            return this.each(function () {
                var id = Math.ceil(Math.random() * 9999); /* Pick random number between 1 and 9999 */
                $(this).data("stickyPanel.state", {
                    stickyPanelId: id,
                    isDetached: false,
                    parentContainer: $((options.parentSelector ? options.parentSelector : window)),
                    options: options					
                });
                if (options.parentSelector) {
                    var p = $(this).data("stickyPanel.state").parentContainer.css("position");
                    switch (p) {
                        case "inherit":
                        case "static":
                            $(this).data("stickyPanel.state").parentContainer.css("position", "relative");
                            break;
                    }
                }
                $(this).data("stickyPanel.state").parentContainer.bind("scroll.stickyPanel_" + id, {
                    selected: $(this)
                }, methods.scroll);
		$(window).resize(function(){
			methods.unstick(options.element);
			Em.run.next(methods,function(){this.scroll(options.element);});//call resize to remove add fix
		}); 					
            });
        },
        scroll: function (event) {
            //var node = event.data.selected;
            var node = (event.originalEvent)?event.data.selected:event;//call from resize to remove resize bug
            var o = node.data("stickyPanel.state").options//event.data.options;
            var parentContainer = node.data("stickyPanel.state").parentContainer;
            var parentHeight = parentContainer.height();
            var nodeHeight = node.outerHeight(true);
            var scrollTop = o.parentSelector ? parentContainer.scrollTop() : $(document).scrollTop();
            var docHeight = o.parentSelector ? parentContainer.height() : $(document).height();
            var HeightDiff = o.parentSelector ? parentHeight : (docHeight - parentHeight);
            var topdiff = node.position().top - o.topPadding;
            var TopDiff = topdiff < 0 ? 0 : topdiff;
            var isDetached = node.data("stickyPanel.state").isDetached;
            // when top of parent reaches the top of the panel detach
            if (scrollTop <= HeightDiff && // Fix for rubberband scrolling in Safari on Lion
        	    scrollTop > TopDiff &&
                !isDetached) {
                node.data("stickyPanel.state").isDetached = true;
                // topPadding
                var newNodeTop = 0;
                if (o.topPadding != "undefined") {
                    newNodeTop = newNodeTop + o.topPadding;
                }
                // get top & left before adding spacer
                var nodeLeft = o.parentSelector ? node.position().left : node.offset().left;
                var nodeTop = o.parentSelector ? node.position().top : node.offset().top;
                // save panels top
                node.data("PanelsTop", nodeTop - newNodeTop);
                // MOVED: savePanelSpace before afterDetachCSSClass to handle afterDetachCSSClass changing size of node
                // savePanelSpace
                var PanelSpacer = null;
                if (o.savePanelSpace == true) {
                    var nodeWidth = node.outerWidth(true);
                    var nodeCssfloat = node.css("float");
                    var nodeCssdisplay = node.css("display");
                    var randomNum = Math.ceil(Math.random() * 9999); /* Pick random number between 1 and 9999 */
                    node.data("stickyPanel.PanelSpaceID", "stickyPanelSpace" + randomNum);
                    PanelSpacer = $("<div id='" + node.data("stickyPanel.PanelSpaceID") + "' style='width:" +nodeWidth + "px;height:" + nodeHeight + "px;float:" + nodeCssfloat + ";display:" + nodeCssdisplay + ";'>&#20;</div>");
                    node.before(PanelSpacer);
                }
                // afterDetachCSSClass
                if (o.afterDetachCSSClass != "") {
                    node.addClass(o.afterDetachCSSClass);
                }
                // save inline css
                node.data("Original_Inline_CSS", (!node.attr("style") ? "" : node.attr("style")));
                // detach panel
                node.css({
                    "margin": 0,
                    "left": nodeLeft,
                    "top": newNodeTop,
                    "position": o.parentSelector ? "absolute" : "fixed",
					"width": node.outerWidth(false)
                });
                // fire detach event
                if (o.onDetached)
                    o.onDetached(node, PanelSpacer);
            }
            // Update top for div scrolling
            if (o.parentSelector && isDetached) {
                node.css({
                    "top": o.topPadding ? (scrollTop + o.topPadding) : scrollTop
                });
            }
            // ADDED: css top check to avoid continuous reattachment
            if (scrollTop <= node.data("PanelsTop") &&
                node.css("top") != "auto" &&
                isDetached) {
                methods.unstick(node);
            }
        },
        unstick: function (nodeRef) {
            var node = nodeRef ? nodeRef : this; ;
            node.data("stickyPanel.state").isDetached = false;
            var o = node.data("stickyPanel.state").options;
            if (o.savePanelSpace == true) {
                $("#" + node.data("stickyPanel.PanelSpaceID")).remove();
            }
            // attach panel
            node.attr("style", node.data("Original_Inline_CSS"));
            if (o.afterDetachCSSClass != "") {
                node.removeClass(o.afterDetachCSSClass);
            }
            // fire reattached event
            if (o.onReAttached)
                o.onReAttached(node);
            if (!nodeRef)
                methods._unstick(node);
        },
        _unstick: function (nodeRef) {
            nodeRef.data("stickyPanel.state").parentContainer.unbind("scroll.stickyPanel_" + nodeRef.data("stickyPanel.state").stickyPanelId);
        }
    };
    $.fn.stickyPanel = function (method) {
        // Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.stickyPanel');
        }
    };
})(jQuery);
// (function($){
	// $.fn.scrollelement = function(options) {
		// var defaults = { 
			// 'animate': true,
			// 'duration': '10',
			// 'easing': 'swing'
			// //'complete': function(){},
			// //'offset': 0,
		// };
		// var options = $.extend(defaults, options);
		// if (!options.offset){options.offset=this.parent().offset().top;}
		
		// return this.each(function() {
			// var element = $(this);
			// //var offset = element.offset().top - options.offset;
			// var toScroll = 0;
			
			// $(window).scroll(function(){ 
				// var scroll = $(window).scrollTop()-options.offset;
				// toScroll=(scroll>0)?scroll:0;
				// // if( scroll > offset ){toScroll = offset+(scroll - offset);} 
				// // else {toScroll = offset;}
				// if( options.animate == true ){
					// element.stop().animate({"margin-top": toScroll + "px"} ,100);//, options.easing, options.duration, options.complete
				// } else {
					// element.stop().offset({top:toScroll});
				// }
			// });
			
		// });
	// }
// })(jQuery);
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