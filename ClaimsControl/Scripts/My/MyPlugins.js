/*
	Masked Input plugin for jQuery
	Copyright (c) 2007-2013 Josh Bush (digitalbush.com)
	Licensed under the MIT license (http://digitalbush.com/projects/masked-input-plugin/#license)
	Version: 1.3.1
*/
(function($) {
	function getPasteEvent() {
    var el = document.createElement('input'),
        name = 'onpaste';
    el.setAttribute(name, '');
    return (typeof el[name] === 'function')?'paste':'input';             
}

var pasteEventName = getPasteEvent() + ".mask",
	ua = navigator.userAgent,
	iPhone = /iphone/i.test(ua),
	android=/android/i.test(ua),
	caretTimeoutId;

$.mask = {
	//Predefined character definitions
	definitions: {
		'9':"[0-9]",
		'a': "[A-Za-z]",
		'*': "[A-Za-z0-9]",
		'~': "[^0-9]"
	},
	dataName: "rawMaskFn",
	placeholder: '_',
};

$.fn.extend({
	//Helper Function for Caret positioning
	caret: function(begin, end) {
		var range;

		if (this.length === 0 || this.is(":hidden")) {
			return;
		}

		if (typeof begin == 'number') {
			end = (typeof end === 'number') ? end : begin;
			return this.each(function() {
				if (this.setSelectionRange) {
					this.setSelectionRange(begin, end);
				} else if (this.createTextRange) {
					range = this.createTextRange();
					range.collapse(true);
					range.moveEnd('character', end);
					range.moveStart('character', begin);
					range.select();
				}
			});
		} else {
			if (this[0].setSelectionRange) {
				begin = this[0].selectionStart;
				end = this[0].selectionEnd;
			} else if (document.selection && document.selection.createRange) {
				range = document.selection.createRange();
				begin = 0 - range.duplicate().moveStart('character', -100000);
				end = begin + range.text.length;
			}
			return { begin: begin, end: end };
		}
	},
	unmask: function() {
		return this.trigger("unmask");
	},
	mask: function(mask, settings) {
		var input,
			defs,
			tests,
			partialPosition,
			firstNonMaskPos,
			len;

		if (!mask && this.length > 0) {
			input = $(this[0]);
			return input.data($.mask.dataName)();
		}
		settings = $.extend({
			placeholder: $.mask.placeholder, // Load default placeholder
			completed: null
		}, settings);


		defs = $.mask.definitions;
		tests = [];
		partialPosition = len = mask.length;
		firstNonMaskPos = null;

		$.each(mask.split(""), function(i, c) {
			if (c == '?') {
				len--;
				partialPosition = i;
			} else if (defs[c]) {
				tests.push(new RegExp(defs[c]));
				if (firstNonMaskPos === null) {
					firstNonMaskPos = tests.length - 1;
				}
			} else {
				tests.push(null);
			}
		});

		return this.trigger("unmask").each(function() {
			var input = $(this),
				buffer = $.map(
				mask.split(""),
				function(c, i) {
					if (c != '?') {
						return defs[c] ? settings.placeholder : c;
					}
				}),
				focusText = input.val();

			function seekNext(pos) {
				while (++pos < len && !tests[pos]);
				return pos;
			}

			function seekPrev(pos) {
				while (--pos >= 0 && !tests[pos]);
				return pos;
			}

			function shiftL(begin,end) {
				var i,j;
				if (begin<0) {
					return;
				}

				for (i = begin, j = seekNext(end); i < len; i++) {
					if (tests[i]) {
						if (j < len && tests[i].test(buffer[j])) {
							buffer[i] = buffer[j];
							buffer[j] = settings.placeholder;
						} else {
							break;
						}
						j = seekNext(j);
					}
				}
				writeBuffer();
				input.caret(Math.max(firstNonMaskPos, begin));
			}

			function shiftR(pos) {
				var i,c,j,t;

				for (i = pos, c = settings.placeholder; i < len; i++) {
					if (tests[i]) {
						j = seekNext(i);
						t = buffer[i];
						buffer[i] = c;
						if (j < len && tests[j].test(t)) {
							c = t;
						} else {
							break;
						}
					}
				}
			}
			var fnDateAfter=function(){
				var newVal=input.val().replace(/[^0-9\.]+/g,'.')
				input.val(newVal);
			}
			var fnDateBefore=function(e,input,buffer,k){
				var val=input.val(), notNumeric=(k<48 || (k>57 && k < 96) || k > 105);
				if  (notNumeric&&val.length===2) {
					var No=parseInt(val,10);
					buffer.splice(0,2);/*panaikinam sena*/var old=val.split("");
					if (val>30){
						buffer.unshift("1","9",old[0],old[1],".");
						input.val(19+input.val()+".");
					}
					else if (val<30){
						buffer.unshift("2","0",old[0],old[1],".");
						input.val(20+input.val()+".");
					}
					e.preventDefault();
				}
				if  (notNumeric&&val.length===6) {
					buffer.splice(0,6);/*panaikinam sena*/
					var old=val.split("");
					console.log(old);
					old.splice(5,1,"0",val[5],".");// darašom priekyj nulį   be val[5] - 0 . 5
					//buffer.slice(0,6);
					// console.log(old);
					// console.log("buffer before");
					// console.log(buffer);
					//buffer.unshift(JSON.stringify(old).replace("[","").replace("]",""));
					buffer.unshift(old[0],old[1],old[2],old[3],old[4],old[5],old[6],old[7]);//
					input.val(old.join(""));
					e.preventDefault();
				}
				// console.log("buffer after");
				// console.log(buffer);
			}
			function keydownEvent(e) {
				var k = e.which,pos,begin,end;				
				//backspace, delete, and escape get special treatment
				if (k === 8 || k === 46 || (iPhone && k === 127)) {
					pos = input.caret();
					begin = pos.begin;
					end = pos.end;

					if (end - begin === 0) {
						begin=k!==46?seekPrev(begin):(end=seekNext(begin-1));
						end=k===46?seekNext(end):end;
					}
					clearBuffer(begin, end);
					shiftL(begin, end - 1);

					e.preventDefault();
				} else if (k == 27) {//escape
					input.val(focusText);
					input.caret(0, checkVal());
					e.preventDefault();
				}else{
					if (settings.isDate){fnDateBefore(e,input,buffer,k);}
				}
			}

			function keypressEvent(e) {
				var k = e.which,pos = input.caret(),p,c,next;

				if (e.ctrlKey || e.altKey || e.metaKey || k < 32) {//Ignore
					return;
				} else if (k) {
					if (pos.end - pos.begin !== 0){
						clearBuffer(pos.begin, pos.end);
						shiftL(pos.begin, pos.end-1);
					}

					p = seekNext(pos.begin - 1);
					if (p < len) {
						c = String.fromCharCode(k);
						if (tests[p].test(c)) {
							shiftR(p);

							buffer[p] = c;
							writeBuffer();
							next = seekNext(p);

							if(android){
								setTimeout($.proxy($.fn.caret,input,next),0);
							}else{
								input.caret(next);
							}
							if (settings.isDate){fnDateAfter();}
							if (settings.completed) {//&& next >= len
								settings.completed.call(input);
							}
						}
					}
					e.preventDefault();
				}
			}

			function clearBuffer(start, end) {
				var i;
				for (i = start; i < end && i < len; i++) {
					if (tests[i]) {
						buffer[i] = settings.placeholder;
					}
				}
			}

			function writeBuffer() { input.val(buffer.join('')); }

			function checkVal(allow) {
				//try to place characters where they belong
				var test = input.val(),lastMatch = -1,i,c,length=test.length;
				if (settings.isDate&&length<10&&length>6){
					var oldVal=test.split(".");
					if (oldVal[1].length===1){oldVal[1]="0"+oldVal[1];}
					if (oldVal[2].length===1){oldVal[2]="0"+oldVal[2];}
					test=oldVal.join(".");
					input.val(test);
				}
				for (i = 0, pos = 0; i < len; i++) {
					if (tests[i]) {
						buffer[i] = settings.placeholder;
						while (pos++ < test.length) {
							c = test.charAt(pos - 1);
							if (tests[i].test(c)) {
								buffer[i] = c;
								lastMatch = i;
								break;
							}
						}
						if (pos > test.length) {
							break;
						}
					} else if (buffer[i] === test.charAt(pos) && i !== partialPosition) {
						pos++;
						lastMatch = i;
					}
				}
				if (allow) {
					writeBuffer();
				} else if (lastMatch + 1 < partialPosition) {
					input.val("");
					clearBuffer(0, len);
				} else {
					writeBuffer();
					input.val(input.val().substring(0, lastMatch + 1));
				}
				return (partialPosition ? i : firstNonMaskPos);
			}

			input.data($.mask.dataName,function(){
				return $.map(buffer, function(c, i) {
					return tests[i]&&c!=settings.placeholder ? c : null;
				}).join('');
			});

			if (!input.attr("readonly"))
				input
				.one("unmask", function() {
					input
						.unbind(".mask")
						.removeData($.mask.dataName);
				})
				.bind("focus.mask", function() {
					clearTimeout(caretTimeoutId);
					var pos,
						moveCaret;

					focusText = input.val();
					pos = checkVal();
					
					caretTimeoutId = setTimeout(function(){
						writeBuffer();
						if (pos == mask.length) {
							input.caret(0, pos);
						} else {
							input.caret(pos);
						}
					}, 10);
				})
				.bind("blur.mask", function() {
					checkVal();
					if (input.val() != focusText)
						input.change();
				})
				.bind("keydown.mask", keydownEvent)
				.bind("keypress.mask", keypressEvent)
				.bind(pasteEventName, function() {
					setTimeout(function() { 
						var pos=checkVal(true);
						input.caret(pos); 
						if (settings.completed && pos == input.val().length)
							settings.completed.call(input);
					}, 0);
				});
			checkVal(); //Perform initial check for existing values
		});
	}
});
})(jQuery);
/*
(function($,len,createRange,duplicate){ //http://www.examplet.org/jquery/caret.php
	$.fn.caret=function(options,opt2){
		var start,end,t=this[0],browser=$.browser.msie;
		if(typeof options==="object" && typeof options.start==="number" && typeof options.end==="number") {
			start=options.start;
			end=options.end;
		} else if(typeof options==="number" && typeof opt2==="number"){
			start=options;
			end=opt2;
		} else if(typeof options==="string"){
			if((start=t.value.indexOf(options))>-1) end=start+options[len];
			else start=null;
		} else if(Object.prototype.toString.call(options)==="[object RegExp]"){
			var re=options.exec(t.value);
			if(re != null) {
				start=re.index;
				end=start+re[0][len];
			}
		}
		if(typeof start!="undefined"){
			if(browser){
				var selRange = this[0].createTextRange();
				selRange.collapse(true);
				selRange.moveStart('character', start);
				selRange.moveEnd('character', end-start);
				selRange.select();
			} else {
				this[0].selectionStart=start;
				this[0].selectionEnd=end;
			}
			this[0].focus();
			return this
		} else {
			// Modification as suggested by Андрей Юткин
           if(browser){
                if (this[0].tagName.toLowerCase() != "textarea") {
                    var val = this.val(),
					selection=document.selection,
                    range = selection[createRange]()[duplicate]();
                    range.moveEnd("character", val[len]);
                    var s = (range.text == "" ? val[len]:val.lastIndexOf(range.text));
                    range = selection[createRange]()[duplicate]();
                    range.moveStart("character", -val[len]);
                    var e = range.text[len];
                } else {
                    var range = selection[createRange](),
                    stored_range = range[duplicate]();
                    stored_range.moveToElementText(this[0]);
                    stored_range.setEndPsoint('EndToEnd', range);
                    var s = stored_range.text[len] - range.text[len],
                    e = s + range.text[len]
                }
			// End of Modification
            } else {
				var s=t.selectionStart,
					e=t.selectionEnd;
			}
			var te=t.value.substring(s,e);
			return {start:s,end:e,text:te,replace:function(st){
				return t.value.substring(0,s)+st+t.value.substring(e,t.value[len])
			}}
		}
	}
})(jQuery,"length","createRange","duplicate");
*/
(function($){
$.widget("ui.inputControl", {
_init : function() {//type:date
	var self = this;
	$(this.element).on("keyUp change input",function(e) {
		//var handler = self.options.delay;	
		var a=e.charCode?e.charCode:e.keyCode?e.keyCode:0;
		if (self.options.type==="date"){
			console.log(String.fromCharCode(a));
			console.log($(this).caret().replace(String.fromCharCode(a)));
			//console.log($(this).caret().replace('hfgfghfh'));

			console.log(String.fromCharCode(a));
		}
	});
},
	options: {
		delay: 500
	}
});
})(jQuery);
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
		showOtherMonths: true,
		constrainInput:false
	});
});
(function ($) {
	$.fn.extend({
		tblSortable: function (options) {
			var defaults = { cols: [], controller: null, sortedCol: 1 }
			var opt = $.extend(defaults, options), table=this;
			return table.each(function () {
				// var span='<span class="ui-icon ui-icon-carat-2-n-s ui-tblHead-icon"></span>',newClass,n="ui-icon-carat-1-n",s="ui-icon-carat-1-s",ns="ui-icon-carat-2-n-s",base="ui-icon ui-tblHead-icon";
				
				// $(this).find('th').addClass("clickable").append(span)
					// .end().on("click","th", function(e){
						// //alert($(this).text()+" "+$(this).index());
						// var t=$(this); thisSpan=t.find("span"); thisClass=thisSpan.attr("class");
						// if (thisClass.indexOf(ns)>-1){newClass=n;}	//Nerūšiuota	
						// else if (thisClass.indexOf(n)>-1){newClass=s;}//desc
						// else if (thisClass.indexOf(s)>-1){newClass=n;}//asc
						// else  throw new Error("noClass");
						// thisSpan.attr("class",newClass+" "+base);
						// t.siblings().find("span").attr("class",ns+" "+base);
						
						// var c=App[opt.controller];							
						// if (newClass===n){c.set("sortAscending", true);}else{c.set("sortAscending", false);}
						// c.set("sortProperties",[opt.cols[index]]);
						// c.set("content",c.get("arrangedContent"));
						// if (opt.refreshView&&!e.isTrigger) { opt.refreshView.call(c);}//kai su funkcija pats saves nepaleis, turinys turi but jau išrusiuotas pries tai (!e.isTrigger||e.isOk)
					// });
				// if (index===opt.sortedCol){$(this).trigger("click"); }
				// $(this).on("click","th", function(e){
					// alert($(this).text()+" "+$(this).index());
				// });
				
				$(this).find('th').each(function(index){
					if (opt.cols[index]){
						$(this).addClass("clickable").on("click",function(e){
							table.spinner();
							var $e=(e.target.tagName.toUpperCase()==="TH")?$(e.target ):$(e.target ).closest("th"), classes=$e.find("span").attr("class"),newClass,n="ui-icon-carat-1-n",s="ui-icon-carat-1-s",ns="ui-icon-carat-2-n-s";				
							if (classes.indexOf(ns)>-1){newClass=n;}	//Nerūšiuota	
							else if (classes.indexOf(n)>-1){newClass=s;}//desc
							else if (classes.indexOf(s)>-1){newClass=n;}//asc
							else  throw new Error("no needed class found");
							
							$e.closest("tr").find("span."+n).toggleClass(n+" "+ns);
							$e.closest("tr").find("span."+s).toggleClass(s+" "+ns);
							$e.find("span").toggleClass(ns+" "+newClass);
							
							var c=App[opt.controller];							
							if (newClass===n){c.set("sortAscending", true);}else{c.set("sortAscending", false);}
							c.set("sortProperties",[opt.cols[index]]);
							c.set("content",c.get("arrangedContent"));
							if (opt.refreshView&&!e.isTrigger) { opt.refreshView.call(c);}//kai su funkcija pats saves nepaleis, turinys turi but jau išrusiuotas pries tai (!e.isTrigger||e.isOk)
							table.spinner('remove');
						}).append('<span class="ui-icon ui-icon-carat-2-n-s ui-tblHead-icon"></span>');
						if (index===opt.sortedCol){$(this).trigger("click"); }//{type:"click",isOk:true}
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
			return false;
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
	if (nodeHeight+50>parentHeight){return false;}
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
        // Tomas 2013.08.08 $('label:first', this).css('border-bottom', 'none');
        // Tomas 2013.08.08 $('label:last', this).css('border-bottom', 'solid 1px #ccc');
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
// jQuery.download = function(url, data, method){
	// //url and data options required
	// if( url && data ){ 
		// //data can be string of parameters or array/object
		// data = typeof data == 'string' ? data : jQuery.param(data);
		// //split params into form inputs
		// var inputs = '';
		// jQuery.each(data.split('&'), function(){ 
			// var pair = this.split('=');
			// inputs+='<input type="hidden" name="'+ pair[0] +'" value="'+ pair[1] +'" />'; 
		// });
		// //send request
		// jQuery('<form action="'+ url +'" method="'+ (method||'post') +'">'+inputs+'</form>')
		// .appendTo('body').submit().remove();
	// };
// };