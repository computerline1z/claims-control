﻿/*
* jQuery autoResize (textarea auto-resizer)
* @copyright James Padolsey http://james.padolsey.com
* @version 1.04

(function(a) { a.fn.autoResize=function(j) { var b=a.extend({ onResize: function() { }, animate: true, animateDuration: 150, animateCallback: function() { }, extraSpace: 20, limit: 1000 }, j); this.filter('textarea').each(function() { var c=a(this).css({ resize: 'none', 'overflow-y': 'hidden' }), k=c.height(), f=(function() { var l=['height', 'width', 'lineHeight', 'textDecoration', 'letterSpacing'], h={}; a.each(l, function(d, e) { h[e]=c.css(e) }); return c.clone().removeAttr('id').removeAttr('name').css({ position: 'absolute', top: 0, left: -9999 }).css(h).attr('tabIndex', '-1').insertBefore(c) })(), i=null, g=function() { f.height(0).val(a(this).val()).scrollTop(10000); var d=Math.max(f.scrollTop(), k)+b.extraSpace, e=a(this).add(f); if(i===d) { return } i=d; if(d>=b.limit) { a(this).css('overflow-y', ''); return } b.onResize.call(this); b.animate&&c.css('display')==='block'?e.stop().animate({ height: d }, b.animateDuration, b.animateCallback):e.height(d) }; c.unbind('.dynSiz').bind('keyup.dynSiz', g).bind('keydown.dynSiz', g).bind('change.dynSiz', g) }); return this } })(jQuery);
Pakeistas apatiniu
*/
/*!
	jQuery Autosize v1.16.7
	(c) 2013 Jack Moore - jacklmoore.com
	updated: 2013-03-20
	license: http://www.opensource.org/licenses/mit-license.php
*/
(function(e){var t,o,n={className:"autosizejs",append:"",callback:!1},i="hidden",s="border-box",a="lineHeight",l='<textarea tabindex="-1" style="position:absolute; top:-999px; left:0; right:auto; bottom:auto; border:0; -moz-box-sizing:content-box; -webkit-box-sizing:content-box; box-sizing:content-box; word-wrap:break-word; height:0 !important; width: 0; min-height:0 !important; overflow:hidden;"/>',r=["fontFamily","fontSize","fontWeight","fontStyle","letterSpacing","textTransform","wordSpacing","textIndent"],c="oninput",h="onpropertychange",p=e(l).data("autosize",!0)[0];p.style.lineHeight="99px","99px"===e(p).css(a)&&r.push(a),p.style.lineHeight="",e.fn.autosize=function(a){return a=e.extend({},n,a||{}),p.parentNode!==document.body&&(e(document.body).append(p),p.value="\n\n\n",p.scrollTop=9e4,t=p.scrollHeight===p.scrollTop+p.clientHeight),this.each(function(){function n(){o=b,p.className=a.className,e.each(r,function(e,t){p.style[t]=f.css(t)})}function l(){var e,s,l;if(o!==b&&n(),!d){d=!0,p.value=b.value+a.append,p.style.overflowY=b.style.overflowY,l=parseInt(b.style.height,10),p.style.width=Math.max(f.width(),0)+"px",t?e=p.scrollHeight:(p.scrollTop=0,p.scrollTop=9e4,e=p.scrollTop);var r=parseInt(f.css("maxHeight"),10);r=r&&r>0?r:9e4,e>r?(e=r,s="scroll"):u>e&&(e=u),e+=x,b.style.overflowY=s||i,l!==e&&(b.style.height=e+"px",w&&a.callback.call(b)),setTimeout(function(){d=!1},1)}}var u,d,g,b=this,f=e(b),x=0,w=e.isFunction(a.callback);f.data("autosize")||((f.css("box-sizing")===s||f.css("-moz-box-sizing")===s||f.css("-webkit-box-sizing")===s)&&(x=f.outerHeight()-f.height()),u=Math.max(parseInt(f.css("minHeight"),10)-x,f.height()),g="none"===f.css("resize")||"vertical"===f.css("resize")?"none":"horizontal",f.css({overflow:i,overflowY:i,wordWrap:"break-word",resize:g}).data("autosize",!0),h in b?c in b?b[c]=b.onkeyup=l:b[h]=l:b[c]=l,e(window).on("resize",function(){d=!1,l()}),f.on("autosize",function(){d=!1,l()}),l())})}})(window.jQuery||window.Zepto);

/*
 * jQuery autoResizeTextAreaQ plugin
 * @requires jQuery v1.4.2 or later
 *
 * Copyright (c) 2010 M. Brown (mbrowniebytes A gmail.com)
 * Licensed under the Revised BSD license:
 * http://www.opensource.org/licenses/bsd-license.php
 * http://en.wikipedia.org/wiki/BSD_licenses 
 *
 * Versions:
 * 0.1 - 2010-07-21
 *       initial
 * 
 * usage:
 *  $(document).ready( function() {
 *      $('textarea').autoResizeTextAreaQ({"max_rows":8});
 *  });
 *
 */
(function($) {
   $.fn.autoResizeTextAreaQ=function(options) {
      var opts=$.extend({
         // ya prob want to use
         max_rows: 10, // # - max rows to resize too
         // ya may want to use, but defaults should be ok
         extra_rows: 1,  // # - nbr extra rows after last line ie padding; 0|1 optimal
         // ya should really specify in html
         rows: null, 	// null|# - null infer from html; # override html
         cols: null, 	// null|# - null infer from html; # override html
         debug: false	// true|false - turn on|off console.log()
      }, options);
      // extra padding based on browser
      if($.browser.msie) {
         opts.extra_rows+=1;
      } else if($.browser.webkit) {
         opts.extra_rows+=1;
      } // else $.browser.mozilla
      // iterate over passed in selector, only process actual textareas
      return $(this).filter('textarea').each(function(index) {
         var ta=$(this);
         var orig={};
         // textarea rows cols current state
         if(opts.cols!=null&&opts.cols>0) {
            ta.attr('cols', opts.cols);
         }
         orig.cols=ta.attr('cols');
         if(opts.rows!=null&&opts.rows>0) {
            ta.attr('rows', opts.rows);
         }
         orig.rows=ta.attr('rows');
         // validate max extra_rows
         if(opts.max_rows==null||opts.max_rows<orig.rows) {
            opts.max_rows=orig.rows;
         }
         if(opts.extra_rows==null||opts.extra_rows<0) {
            opts.extra_rows=0;
         }
         if(opts.debug) {
            console.log('opts: ', opts, ' orig: ', orig);
         }
         // resize textares on load
         resize(ta, orig);
         // check resize on key input
         ta.bind('keyup', function(e) {
            resize(ta, orig);
         });
      }); // end each()
      function resize(ta, orig) {
         // nbr explicit rows
         var nl_rows=ta.val().split('\n');
         // nbr inferred rows
         var nbr_ta_rows=0;
         for(index in nl_rows) {
            // overly simple check to account for text being auto wrapped and thus a new line
            nbr_ta_rows+=Math.floor((nl_rows[index].length/orig.cols))+1;
         }
         // get final nbr ta rows
         var final_nbr_ta_rows=nbr_ta_rows-1; // deduct for current line
         final_nbr_ta_rows+=opts.extra_rows; // add on extra rows
         // resize textarea
         // note: $.animate() doesnt work well here since only inc/dec row by one
         if(final_nbr_ta_rows>=opts.max_rows) {
            ta.attr('rows', opts.max_rows);
         } else if(final_nbr_ta_rows>=orig.rows) {
            ta.attr('rows', final_nbr_ta_rows);
         } else {
            ta.attr('rows', orig.rows);
         }
         if(opts.debug) {
            console.log('rows: ', ta.attr('rows'), ' nbr nl_rows: ', nl_rows.length, ' nbr_ta_rows: ', nbr_ta_rows, ' final_nbr_ta_rows: ', final_nbr_ta_rows);
         }
      } // end resize()
   }; // end autoResizeTextAreaQ()
})(jQuery);

/*
* jQuery.validity v1.1.1
* http://validity.thatscaptaintoyou.com/
* http://code.google.com/p/validity/
* 
* Copyright (c) 2010 Wyatt Allen
* Dual licensed under the MIT and GPL licenses.
*
* Date: 2010-08-16 (Tuesday, 16 August 2010)
* Revision: 134
*/
(function ($) {

   // Default settings:
   ////////////////////////////////////////////////////////////////

   var 
        defaults={
           // The default output mode is label because it requires no dependencies:
           outputMode: "label",

           // The css class on the output
           cssClass: "error",

           // The this property is set to true, validity will scroll the browser viewport
           // so that the first error is visible when validation fails:
           scrollTo: false,

           // If this setting is true, modal errors will disappear when they are clicked on:
           modalErrorsClickable: true,

           // If a field name cannot be otherwise inferred, this will be used:
           defaultFieldName: "This field",

           // jQuery selector to filter down to validation-supported elements:
           elementSupport: ":text, :password, textarea, select, :radio, :checkbox",

           // Function to stringify argments for use when generating error messages.
           // Primarily, it just generates pretty date strings:
           argToString: function (val) {
              //              return val.getDate?
              //                    (val.getMonth()+1)+"/"+val.getDate()+"/"+val.getFullYear():
              //                    val;
              return val.getDate?
                    val.getFullYear()+"-"+(val.getMonth()+1)+"-"+val.getDate():
                     val;
           }
        };

   // Static functions and properties:
   ////////////////////////////////////////////////////////////////

   $.validity={

      // Clone the defaults. They can be overridden with the setup function:
      settings: $.extend(defaults, {}),

      // Built-in library of format-checking tools for use with the 
      // match validator as well as the nonHtml validator:
      patterns: {
         integer: /^\d+$/,
         // Used to use Date.parse(), which was the cause of Issue 9, 
         // where the function would accept 09/80/2009 as parseable.
         // The fix is to use a RegExp that will only accept American Middle-Endian form.
         // See the Internationalization section in the documentation for how to
         // cause it to support other date formats:
         dateUS: /^((0?\d)|(1[012]))\/([012]?\d|30|31)\/\d{1,4}$/,  //MM/dd/yyyy
         date: /^(19|20)[0-9]{2}[\s\.\/-]((0?\d)|(1[012]))[\s\.\/-]([012]?\d|30|31)$/,  //19|20yy/MM/dd
         email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,
         emailList: /^(([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5}){1,25})+([;.](([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5}){1,25})+)*$/,
         usd: /^\$?(\d{1,3},?(\d{3},?)*\d{3}(\.\d{0,2})?|\d{1,3}(\.\d{0,2})?|\.\d{1,2}?)$/,
         url: /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,

         // Number should accept floats or integers, be they positive or negative.
         // It should also support scientific-notation, written as a lower or capital 'E' followed by the radix.
         // Number assumes base 10. 
         // Unlike the native parseFloat or parseInt functions, this should not accept trailing Latin characters.
         number: /^[+-]?(\d+(\.\d*)?|\.\d+)([Ee]\d+)?$/,

         zip: /^\d{5}(-\d{4})?$/,
         phone: /^[2-9]\d{2}-\d{3}-\d{4}$/,
         guid: /^(\{?([0-9a-fA-F]){8}-(([0-9a-fA-F]){4}-){3}([0-9a-fA-F]){12}\}?)$/,
         time12: /^[01]?\d:[0-5]\d?\s?[aApP]\.?[mM]\.?$/,
         time24: /^(20|21|22|23|[01]\d|\d)(([:][0-5]\d){1,2})$/,

         nonHtml: /^[^<>]*$/
      },

      // Built-in set of default error messages (for use when a message isn't specified):
      messages: {

         require: "#{field} reikalinga užpildyti.",
         // Format validators:
         match: "Netinkamo formato laukas #{field}",
         integer: "#{field} turi būti teigiamas, sveikas skaičius",
         dateUS: "#{field} must be formatted as US date (mm/dd/yyyy).",
         date: "#{field} turi būt datos formato - (yyyy/mm/dd)",
         email: "#{field} turi būt e-pašto formato.",
         emailList: "#{field} turi būti e-pašto formato ir atskirtas ';'.",
         usd: "#{field} must be formatted as a US Dollar amount.",
         url: "#{field} must be formatted as a URL.",
         number: "#{field} turi būti numerio formato.",
         zip: "#{field} must be formatted as a zipcode ##### or #####-####.",
         phone: "#{field} must be formatted as a phone number ###-###-####.",
         guid: "#{field} must be formatted as a guid like {3F2504E0-4F89-11D3-9A0C-0305E82C3301}.",
         time24: "#{field} must be formatted as a 24 hour time: 23:00.",
         time12: "#{field} must be formatted as a 12 hour time: 12:00 AM/PM",

         // Value range messages:
         lessThan: "#{field} turi būti mažiau negu #{max}.",
         lessThanOrEqualTo: "#{field} turi būti mažiau arba lygu #{max}.",
         greaterThan: "#{field} turi būti daugiau negu #{min}.",
         greaterThanOrEqualTo: "#{field} turi būti daugiau arba lygu #{min}.",
         range: "#{field} turi būti tarp #{min} ir #{max}.",

         // Value length messages:
         tooLong: "#{field} negali būti ilgesnis negu #{max} raidžių.",
         tooShort: "#{field} negali būti ilgesnis negu #{min} raidžių.",

         // Composition validators:
         nonHtml: "#{field} negali turėti HTML raidžių.",
         alphabet: "#{field} turi būti tik raidės.",

         minCharClass: "#{field} cannot have more than #{min} #{charClass} characters.",
         maxCharClass: "#{field} cannot have less than #{min} #{charClass} characters.",

         // Aggregate validator messages:
         equal: "Values don't match.",
         distinct: "A value was repeated.",
         sum: "Values don't add to #{sum}.",
         sumMax: "The sum of the values must be less than #{max}.",
         sumMin: "The sum of the values must be greater than #{min}.",

         // Radio validator messages:
         radioChecked: "The selected value is not valid.",

         generic: "Invalid."
      },

      // Character classes can be used to determine the quantity
      // of a given type of character in a string:
      charClasses: {
         alphabetical: /\w/g,
         numeric: /\d/g,
         alphanumeric: /[A-Za-z0-9]/g,
         symbol: /[^A-Za-z0-9]/g
      },

      // Object to contain the output modes. The three built-in output modes are installed
      // later on in this script.
      outputs: {},

      // Override the default settings with user-specified ones.
      setup: function (options) {
         this.settings=$.extend(this.settings, options);
      },

      // Object to store information about ongoing validation.
      // When validation starts, this will be set to a report object.
      // When validators fail, they will inform this object.
      // When validation is completed, this object will contain the 
      // information of whether it succeeded:
      report: null,

      // Determine whether validity is in the middle of validation:
      isValidating: function () {
         return !!this.report;
      },

      // Function to prepare validity to start validating:
      start: function () {
         // The output mode should be notified that validation is starting.
         // This usually means that the output mode will erase errors from the 
         // document in whatever way the mode needs to:
         if(this.outputs[this.settings.outputMode]&&
                this.outputs[this.settings.outputMode].start) {
            this.outputs[this.settings.outputMode].start();
         }

         // Initialize the report object:
         this.report={ errors: 0, valid: true };
      },

      // Function called when validation is over to examine the results and clean-up:
      end: function () {
         // Null coalescence: fix for Issue 5:
         var results=this.report||{ errors: 0, valid: true };

         this.report=null;

         // Notify the current output mode that validation is over:
         if(this.outputs[this.settings.outputMode]&&
                this.outputs[this.settings.outputMode].end) {
            this.outputs[this.settings.outputMode].end(results);
         }

         return results;
      },

      // Remove validiation errors:
      clear: function () {
         this.start();
         this.end();
      }
   };

   // jQuery instance methods:
   ////////////////////////////////////////////////////////////////

   $.fn.extend({

      // The validity function is how validation can be bound to forms.
      // The user may pass in a validation function or, as a shortcut, 
      // pass in a string of a CSS selector that grabs all the inputs to 
      // require:
      validity: function (arg) {

         return this.each(

                function () {

                   // Only operate on forms:
                   if(this.tagName.toLowerCase()=="form") {
                      var f=null;

                      // If the user entered a string to select the inputs to require,
                      // then make the validation logic ad hoc:
                      if(typeof (arg)=="string") {
                         f=function () {
                            $(arg).require();
                         };
                      }

                      // If the user entered a validation function then just call
                      // that at the appropriate time:
                      else if($.isFunction(arg)) {
                         f=arg;
                      }

                      if(arg) {
                         $(this).bind(
                                "submit",
                                function () {
                                   $.validity.start();
                                   f();
                                   return $.validity.end().valid;
                                }
                            );
                      }
                   }
                }
            );
      },

      // Validators:
      ////////////////////////////////////////////////

      // Common validators:
      ////////////////////////////////

      // Validate whether the field has a value.
      // http://validity.thatscaptaintoyou.com/Demos/index.htm#Require
      require: function (msg) {
         return validate(
                this,
                function (obj) {
                   var val=$(obj).val();

                   var res=val.length;

                   return res;
                },
                msg||$.validity.messages.require
            );
      },

      // Validate whether the field matches a regex.
      // http://validity.thatscaptaintoyou.com/Demos/index.htm#Match
      match: function (rule, msg) {

         // If a default message is to be used:
         if(!msg) {
            // First grab the generic one:
            msg=$.validity.messages.match;

            // If there's a more specific one, use that.
            if(typeof (rule)==="string"&&$.validity.messages[rule]) {
               msg=$.validity.messages[rule];
            }
         }

         // If the rule is named, rather than specified:
         if(typeof (rule)=="string") {
            rule=$.validity.patterns[rule];
         }

         return validate(
                this,

         // Some of the named rules can be functions, such as 'date'.
         // If the discovered rule is a function use it as such.
         // Otherwise, assume it's a RegExp.
                $.isFunction(rule)?

                    function (obj) {
                       return !obj.value.length||rule(obj.value);
                    } :

                    function (obj) {
                       // Fix for regexes where the global flag is set.
                       // Make sure to test from the start of the string.
                       if(rule.global) {
                          rule.lastIndex=0;
                       }

                       return !obj.value.length||rule.test(obj.value);
                    },

                msg
            );
      },

      // http://validity.thatscaptaintoyou.com/Demos/index.htm#Range
      range: function (min, max, msg) {
         return validate(
                this,

                min.getTime&&max.getTime?

         // If both arguments are dates then use them that way.
                    function (obj) {
                       var d=new Date(obj.value);
                       return d>=new Date(min)&&d<=new Date(max);
                    } :

                    min.substring&&max.substring&&Big?

         // If both arguments are strings then parse them 
         // using the Arbitrary-Precision library.
                        function (obj) {
                           var n=new Big(obj.value);
                           return (
                                n.greaterThanOrEqualTo(new Big(min))&&
                                n.lessThanOrEqualTo(new Big(max))
                            );
                        } :

         // Otherwise treat them like floats.
                        function (obj) {
                           var f=parseFloat(obj.value);
                           return f>=min&&f<=max;
                        },

                msg||format(
                    $.validity.messages.range, {
                       min: $.validity.settings.argToString(min),
                       max: $.validity.settings.argToString(max)
                    }
                )
            );
      },

      // http://validity.thatscaptaintoyou.com/Demos/index.htm#GreaterThan
      greaterThan: function (min, msg) {
         return validate(
                this,

                min.getTime?
                    function (obj) {
                       return new Date(obj.value)>min;
                    } :

                    min.substring&&Big?

                        function (obj) {
                           return new Big(obj.value).greaterThan(new Big(min));
                        } :

                        function (obj) {
                           return parseFloat(obj.value)>min;
                        },

                msg||format(
                    $.validity.messages.greaterThan, {
                       min: $.validity.settings.argToString(min)
                    }
                )
            );
      },

      // http://validity.thatscaptaintoyou.com/Demos/index.htm#GreaterThan
      greaterThanOrEqualTo: function (min, msg) {
         return validate(
                this,

                min.getTime?
                    function (obj) {
                       return new Date(obj.value)>=min;
                    } :

                    min.substring&&Big?

                        function (obj) {
                           return new Big(obj.value).greaterThanOrEqualTo(new Big(min));
                        } :

                        function (obj) {
                           return parseFloat(obj.value)>=min;
                        },

                msg||format(
                    $.validity.messages.greaterThanOrEqualTo, {
                       min: $.validity.settings.argToString(min)
                    }
                )
            );
      },

      // http://code.google.com/p/validity/wiki/Validators#LessThan
      lessThan: function (max, msg) {
         return validate(
                this,

                max.getTime?
                    function (obj) {
                       return new Date(obj.value)<max;
                    } :

                    max.substring&&Big?

                        function (obj) {
                           return new Big(obj.value).lessThan(new Big(max));
                        } :

                        function (obj) {
                           return parseFloat(obj.value)<max;
                        },

                msg||format(
                    $.validity.messages.lessThan, {
                       max: $.validity.settings.argToString(max)
                    }
                )
            );
      },

      // http://validity.thatscaptaintoyou.com/Demos/index.htm#LessThan
      lessThanOrEqualTo: function (max, msg) {
         return validate(
                this,

                max.getTime?
                    function (obj) {
                       return new Date(obj.value)<=max;
                    } :

                    max.substring&&Big?

                        function (obj) {
                           return new Big(obj.value).lessThanOrEqualTo(new Big(max));
                        } :

                        function (obj) {
                           return parseFloat(obj.value)<=max;
                        },

                msg||format(
                    $.validity.messages.lessThanOrEqualTo, {
                       max: $.validity.settings.argToString(max)
                    }
                )
            );
      },

      // http://validity.thatscaptaintoyou.com/Demos/index.htm#LessThan
      maxLength: function (max, msg) {
         return validate(
                this,
                function (obj) {
                   return obj.value.length<=max;
                },
                msg||format(
                    $.validity.messages.tooLong, {
                       max: max
                    }
                )
            );
      },

      // http://validity.thatscaptaintoyou.com/Demos/index.htm#Length
      minLength: function (min, msg) {
         return validate(
                this,
                function (obj) {
                   return obj.value.length>=min;
                },
                msg||format(
                    $.validity.messages.tooShort, {
                       min: min
                    }
                )
            );
      },

      // TODO: Document
      alphabet: function (alpha, msg) {
         var chars=[];

         return validate(
                this,
                function (obj) {

                   // For each character in the string, ensure that 
                   // it's in the alphabet definition:
                   for(var idx=0; idx<obj.value.length; ++idx) {
                      if(alpha.indexOf(obj.value.charAt(idx))== -1) {
                         chars.push(obj.value.charAt(idx));
                         return false;
                      }
                   }

                   return true;
                },
                msg||format(
                    $.validity.messages.alphabet, {
                       chars: chars.join(", ")
                    }
                )
            );
      },

      // TODO: Document
      minCharClass: function (charClass, min, msg) {
         if(typeof (charClass)=="string") {
            charClass=charClass.toLowerCase();

            if($.validity.charClasses[charClass]) {
               charClass=$.validity.charClasses[charClass];
            }
         }

         return validate(
                this,
                function (obj) {
                   return (obj.value.match(charClass)||[]).length>=min;
                },
                msg||format(
                    $.validity.messages.minCharClass, {
                       min: min,
                       charClass: charClass
                    }
                )
            );
      },

      // TODO: Document
      maxCharClass: function (charClass, max, msg) {
         if(typeof (charClass)=="string") {
            charClass=charClass.toLowerCase();

            if($.validity.charClasses[charClass]) {
               charClass=$.validity.charClasses[charClass];
            }
         }

         return validate(
                this,
                function (obj) {
                   return (obj.value.match(charClass)||[]).length<=max;
                },
                msg||format(
                    $.validity.messages.maxCharClass, {
                       max: max,
                       charClass: charClass
                    }
                )
            );
      },

      // TODO: Document
      password: function (opts, msg) {
         opts=$.extend({
            alphabet: null,

            minLength: 0,
            maxLength: 0,

            minSymbol: 0,
            minAlphabetical: 0,
            minNumeric: 0,
            minAlphaNumeric: 0
         },
                opts
            );

         if(opts.alphabet) {
            this.alphabet(opts.alphabet);
         }

         if(opts.minLength) {
            this.minLength(opts.minLength);
         }

         if(opts.maxLength) {
            this.maxLength(opts.maxLength);
         }

         if(opts.minSymbol) {
            this.minCharClass("symbol", opts.minSymbol);
         }

         if(opts.minAlphabetical) {
            this.minCharClass("alphabetical", opts.minAlphabetical);
         }

         if(opts.minNumeric) {
            this.minCharClass("numeric", opts.minNumeric);
         }

         if(opts.minAlphanumeric) {
            this.minCharClass("alphanumeric", opts.minAlphanumeric);
         }

         return this;
      },

      // Validate that the input does not contain potentially dangerous strings.
      // http://validity.thatscaptaintoyou.com/Demos/index.htm#NonHtml
      nonHtml: function (msg) {
         return validate(
                this,

                function (obj) {
                   return $.validity.patterns.nonHtml.test(obj.value);
                },

                msg||$.validity.messages.nonHtml
            );
      },

      // Aggregate validators:
      ////////////////////////////////

      // Validate that all matched elements bear the same values.
      // Accepts a function to transform the values for testing.
      // http://validity.thatscaptaintoyou.com/Demos/index.htm#Equal
      equal: function (arg0, arg1) {
         var 
         // If a reduced set is attached, use it.
         // Also, remove unsupported elements.
                $reduction=(this.reduction||this).filter($.validity.settings.elementSupport),

                transform=function (val) {
                   return val;
                },

                msg=$.validity.messages.equal;

         if($reduction.length) {

            // Figure out what arguments were specified.
            if($.isFunction(arg0)) {
               transform=arg0;

               if(typeof (arg1)=="string") {
                  msg=arg1;
               }
            }

            else if(typeof (arg0)=="string") {
               msg=arg0;
            }

            var 
                    map=$.map(
                        $reduction,
                        function (obj) {
                           return transform(obj.value);
                        }
                    ),

            // Get the first value.
                    first=map[0],
                    valid=true;

            // If any value is not equal to the first value,
            // then they aren't all equal, and it's not valid.
            for(var i in map) {
               if(map[i]!=first) {
                  valid=false;
               }
            }

            if(!valid) {
               raiseAggregateError($reduction, msg);

               // The set reduces to zero valid elements.
               this.reduction=$([]);
            }
         }

         return this;
      },

      // Validate that all matched elements bear distinct values.
      // Accepts an optional function to transform the values for testing.
      // http://validity.thatscaptaintoyou.com/Demos/index.htm#Distinct
      distinct: function (arg0, arg1) {
         var 
         // If a reduced set is attached, use it.
         // Also, remove unsupported elements.
                $reduction=(this.reduction||this).filter($.validity.settings.elementSupport),

                transform=function (val) {
                   return val;
                },

                msg=$.validity.messages.distinct,

         // An empty array to store already-examined values
                subMap=[],

                valid=true;

         if($reduction.length) {

            // Figure out what arguments were specified.
            if($.isFunction(arg0)) {
               transform=arg0;

               if(typeof (arg1)=="string") {
                  msg=arg1;
               }
            }

            else if(typeof (arg0)=="string") {
               msg=arg0;
            }

            // Map all the matched values into an array.    
            var map=$.map(
                    $reduction,
                    function (obj) {
                       return transform(obj.value);
                    }
                );

            // For each transformed value:
            for(var i1=0; i1<map.length; ++i1) {
               // Unless it's an empty string:
               if(map[i1].length) {
                  // For each value we've already looked at:
                  for(var i2=0; i2<subMap.length; ++i2) {
                     // If we've already seen the transformed value:
                     if(subMap[i2]==map[i1]) {
                        valid=false;
                     }
                  }

                  // We looked at the value.
                  subMap.push(map[i1]);
               }
            }

            if(!valid) {
               raiseAggregateError($reduction, msg);

               // The set reduces to zero valid elements.
               this.reduction=$([]);
            }
         }

         return this;
      },

      // Validate that the numeric sum of all values is equal to a given value.
      // http://validity.thatscaptaintoyou.com/Demos/index.htm#Sum
      sum: function (sum, msg) {
         // If a reduced set is attached, use it.
         // Also, remove unsupported elements.
         var $reduction=(this.reduction||this).filter($.validity.settings.elementSupport);

         if($reduction.length&&sum!=numericSum($reduction)) {
            raiseAggregateError(
                    $reduction,
                    msg||format(
                        $.validity.messages.sum,
                        { sum: sum }
                    )
                );

            // The set reduces to zero valid elements.
            this.reduction=$([]);
         }

         return this;
      },

      // Validates an inclusive upper-bound on the numeric sum of the values of all matched elements.
      // http://validity.thatscaptaintoyou.com/Demos/index.htm#Sum
      sumMax: function (max, msg) {
         // If a reduced set is attached, use it.
         // Also, remove unsupported elements.
         var $reduction=(this.reduction||this).filter($.validity.settings.elementSupport);

         if($reduction.length&&max<numericSum($reduction)) {
            raiseAggregateError(
                    $reduction,
                    msg||format(
                        $.validity.messages.sumMax,
                        { max: max }
                    )
                );

            // The set reduces to zero valid elements.
            this.reduction=$([]);
         }

         return this;
      },

      // Validates an inclusive lower-bound on the numeric sum of the values of all matched elements.
      // http://validity.thatscaptaintoyou.com/Demos/index.htm#Sum
      sumMin: function (min, msg) {
         // If a reduced set is attached, use it.
         // Also, remove unsupported elements.
         var $reduction=(this.reduction||this).filter($.validity.settings.elementSupport);

         if($reduction.length&&min<numericSum($reduction)) {
            raiseAggregateError(
                    $reduction,
                    msg||format(
                        $.validity.messages.sumMin,
                        { min: min }
                    )
                );

            // The set reduces to zero valid elements.
            this.reduction=$([]);
         }

         return this;
      },

      // Radio group validators:
      ////////////////////////////////

      // TODO: Document
      radioChecked: function (val, msg) {
         // If a reduced set is attached, use it.
         // Also, remove unsupported elements.
         var $reduction=(this.reduction||this).filter($.validity.settings.elementSupport);

         if($reduction.is(":radio")&&$reduction.find(":checked").val()!=val) {
            raiseAggregateError(
                    $reduction,
                    msg||$.validity.messages.radioChecked
                );
         }
      },

      // TODO: Document
      radioNotChecked: function (val, msg) {
         // If a reduced set is attached, use it.
         // Also, remove unsupported elements.
         var $reduction=(this.reduction||this).filter($.validity.settings.elementSupport);

         if($reduction.is(":radio")&&$reduction.filter(":checked").val()==val) {
            raiseAggregateError(
                    $reduction,
                    msg||$.validity.messages.radioChecked
                );
         }
      },

      // Checkbox validators:
      ////////////////////////////////

      // TODO: Document
      checkboxChecked: function (msg) {
         // If a reduced set is attached, use it.
         // Also, remove unsupported elements.
         var $reduction=(this.reduction||this).filter($.validity.settings.elementSupport);

         if($reduction.is(":checkbox")&&!$reduction.is(":checked")) {
            raiseAggregateError(
                    $reduction,
                    msg||$.validity.messages.radioChecked
                );
         }
      },

      // Specialized validators:
      ////////////////////////////////

      // If expression is a function, it will be called on each matched element.
      // Otherwise, it is treated as a boolean, and the determines the validity 
      // of elements in an aggregate fashion.
      // http://validity.thatscaptaintoyou.com/Demos/index.htm#Assert
      assert: function (expression, msg) {
         // If a reduced set is attached, use it.
         // Do not reduce to supported elements.
         var $reduction=this.reduction||this;

         if($reduction.length) {

            // In the case that 'expression' is a function, 
            // use it as a regimen on each matched element individually:
            if($.isFunction(expression)) {
               return validate(
                        this,
                        expression,
                        msg||$.validity.messages.generic
                    );
            }

            // Otherwise map it to a boolean and consider this as an aggregate validation:
            else if(!expression) {

               raiseAggregateError(
                        $reduction,
                        msg||$.validity.messages.generic
                    );

               // The set reduces to zero valid elements.
               this.reduction=$([]);
            }
         }

         return this;
      }
   });

   // Private utilities:
   ////////////////////////////////////////////////////////////////

   // Do non-aggregate validation.
   // Subject each element in $obj to the regimen.
   // Raise the specified error on failures.
   // This function is the heart of validity:
   function validate($obj, regimen, message) {
      var 
      // If a reduced set is attached, use it
      // Also, remove any unsupported elements.
            $reduction=($obj.reduction||$obj).filter($.validity.settings.elementSupport),

      // Array to store only elements that pass the regimen.
            elements=[];

      // For each in the reduction.
      $reduction.each(
            function () {
               // If the element passes the regimen, include it in the reduction.
               if(regimen(this)) {
                  elements.push(this);
               }

               // Else give the element an error message.
               else {
                  raiseError(
                        this,
                        format(message, {
                           field: infer(this)
                        })
                    );
               }
            }
        );

      // Attach a (potentially) reduced set of only elements that passed.
      $obj.reduction=$(elements);

      // Return the full set with attached reduction.
      return $obj;
   }

   // Inform the report object that there was a failure.
   function addToReport() {
      if($.validity.isValidating()) {
         $.validity.report.errors++;
         $.validity.report.valid=false;
      }
   }

   // Inform the report of a failure and display an error according to the 
   // idiom of the current ouutput mode.
   function raiseError(obj, msg) {
      addToReport();

      if($.validity.outputs[$.validity.settings.outputMode]&&
            $.validity.outputs[$.validity.settings.outputMode].raise) {
         $.validity.outputs[$.validity.settings.outputMode].raise($(obj), msg);
      }
   }

   // Inform the report of a failure and display an aggregate error according to the 
   // idiom of the current output mode.
   function raiseAggregateError($obj, msg) {
      addToReport();

      if($.validity.outputs[$.validity.settings.outputMode]&&
            $.validity.outputs[$.validity.settings.outputMode].raiseAggregate) {
         $.validity.outputs[$.validity.settings.outputMode].raiseAggregate($obj, msg);
      }
   }

   // Yield the sum of the values of all fields matched in obj that can be parsed.
   function numericSum(obj) {
      var accumulator=0;
      obj.each(
            function () {
               var n=parseFloat(this.value);

               accumulator+=isNaN(n)?0:n;
            }
        );
      return accumulator;
   }

   // Using the associative array supplied as the 'obj' argument,
   // replace tokens of the format #{<key>} in the 'str' argument with
   // that key's value.
   function format(str, obj) {
      for(var p in obj) {
         str=str.replace("#{"+p+"}", obj[p]);
      }
      return capitalize(str);
   }

   // Infer the field name of the passed DOM element.
   // If a title is specified, its value is returned.
   // Otherwise, attempt to parse a field name out of the id attribute.
   // If that doesn't work, return the default field name in the configuration.
   function infer(field) {
      var 
            $f=$(field),
            ret=$.validity.settings.defaultFieldName;

      // Check for title.
      if($f.attr("title").length) {
         ret=$f.attr("title");
      }

      // Check for UpperCamelCase.
      else if(/^([A-Z0-9][a-z]*)+$/.test(field.id)) {
         ret=field.id.replace(/([A-Z0-9])[a-z]*/g, " $&");
      }

      // Check for lowercase_separated_by_underscores
      else if(/^[a-z0-9_]*$/.test(field.id)) {
         var arr=field.id.split("_");

         for(var i=0; i<arr.length; ++i) {
            arr[i]=capitalize(arr[i]);
         }

         ret=arr.join(" ");
      }

      return ret;
   }

   // Capitolize the first character of the string argument.
   function capitalize(sz) {
      return sz.substring?
            sz.substring(0, 1).toUpperCase()+sz.substring(1, sz.length):
            sz;
   }

})(jQuery);

// Output modes:
////////////////////////////////////////////////////////////////

// Each output mode gets its own closure, 
// distinct from the validity closure.

// Install the label output.
(function ($) {
   function getIdentifier($obj) {
      return $obj.attr('id').length?
            $obj.attr('id'):
            $obj.attr('name');
   }

   $.validity.outputs.label={
      start: function () {
         // Remove all the existing error labels.
         $("label."+$.validity.settings.cssClass).remove();
      },

      end: function (results) {
         // If not valid and scrollTo is enabled, scroll the page to the first error.
         if(!results.valid&&$.validity.settings.scrollTo) {
            location.hash=$("label."+$.validity.settings.cssClass+":eq(0)").attr('for');
         }
      },

      raise: function ($obj, msg) {
         var 
                labelSelector="label."+$.validity.settings.cssClass+"[for='"+getIdentifier($obj)+"']";

         // If an error label already exists for the bad input just update its text:
         if($(labelSelector).length) {
            $(labelSelector).text(msg);
         }

         // Otherwize create a new one and stick it after the input:
         else {
            $("<label/>")
                    .attr("for", getIdentifier($obj))
                    .addClass($.validity.settings.cssClass)
                    .text(msg)

            // In the case that the element does not have an id
            // then the for attribute in the label will not cause
            // clicking the label to focus the element. This line 
            // will make that happen.
                    .click(function () {
                       if($obj.length) {
                          $obj[0].select();
                       }
                    })

                    .insertAfter($obj);
         }
      },

      raiseAggregate: function ($obj, msg) {
         // Just raise the error on the last input.
         if($obj.length) {
            this.raise($($obj.get($obj.length-1)), msg);
         }
      }
   };
})(jQuery);

// Install the modal output.
(function ($) {
   var 
   // Class to apply to modal errors.
        errorClass="validity-modal-msg",

   // The selector for the element where modal errors will me injected semantically.
        container="body";

   $.validity.outputs.modal={
      start: function () {
         // Remove all the existing errors.
         $("."+errorClass).remove();
      },

      end: function (results) {
         // If not valid and scrollTo is enabled, scroll the page to the first error.
         if(!results.valid&&$.validity.settings.scrollTo) {
            location.hash=$("."+errorClass+":eq(0)").attr('id');
         }
      },

      raise: function ($obj, msg) {
         if($obj.length) {
            var 
                    off=$obj.offset(),
                    obj=$obj.get(0),

            // Design a style object based off of the input's location.
                    errorStyle={
                       left: parseInt(off.left+$obj.width()+4, 10)+"px",
                       top: parseInt(off.top-10, 10)+"px"
                    };

            // Create one and position it next to the input.
            $("<div/>")
                    .addClass(errorClass)
                    .css(errorStyle)
                    .text(msg)
                    .click($.validity.settings.modalErrorsClickable?
                        function () { $(this).remove(); } :null
                    )
                    .appendTo(container);
         }
      },

      raiseAggregate: function ($obj, msg) {
         // Just raise the error on the last input.
         if($obj.length) {
            this.raise($($obj.get($obj.length-1)), msg);
         }
      }
   };
})(jQuery);

// Install the summary output
(function ($) {
   var 
   // Container contains the summary. This is the element that is shown or hidden.
        container=".validity-summary-container",

   // Erroneous refers to an input with an invalid value,
   // not the error message itself.
        erroneous="validity-erroneous",

   // Selector for erroneous inputs.
        errors="."+erroneous,

   // The wrapper for entries in the summary.
        wrapper="<li/>",

   // Buffer to contain all the error messages that build up during validation.
   // When validation ends, it'll be flushed into the summary.
   // This way, the summary doesn't flicker empty then fill up.
        buffer=[];

   $.validity.outputs.summary={
      start: function () {
         $(errors).removeClass(erroneous);
         buffer=[];
      },

      end: function (results) {
         // Hide the container and empty its summary.
         $(container)
                .hide()
                .find("ul")
                    .html('');

         // If there are any errors at all:
         // (Otherwise the container shouldn't be shown):
         if(buffer.length) {
            // Use integer based iteration for solution to Issue 7.
            for(var i=0; i<buffer.length; ++i) {
               $(wrapper)
                        .text(buffer[i])
                        .appendTo(container+" ul");
            }

            $(container).show();

            // If scrollTo is enabled, scroll the page to the first error.
            if($.validity.settings.scrollTo) {
               location.hash=$(errors+":eq(0)").attr("id");
            }
         }
      },

      raise: function ($obj, msg) {
         buffer.push(msg);
         $obj.addClass(erroneous);
      },

      raiseAggregate: function ($obj, msg) {
         this.raise($obj, msg);
      },

      container: function () {
         document.write(
                "<div class=\"validity-summary-container\">"+
                    "The form didn't submit for the following reason(s):"+
                    "<ul></ul>"+
                "</div>"
            );
      }
   };
})(jQuery);
/*alphanumeric*/
eval(function (p, a, c, k, e, d) { e=function (c) { return (c<a?"":e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36)) }; if(!''.replace(/^/, String)) { while(c--) { d[e(c)]=k[c]||e(c) } k=[function (e) { return d[e] } ]; e=function () { return '\\w+' }; c=1 }; while(c--) { if(k[c]) { p=p.replace(new RegExp('\\b'+e(c)+'\\b', 'g'), k[c]) } } return p } ('(2($){$.c.f=2(p){p=$.d({g:"!@#$%^&*()+=[]\\\\\\\';,/{}|\\":<>?~`.- ",4:"",9:""},p);7 3.b(2(){5(p.G)p.4+="Q";5(p.w)p.4+="n";s=p.9.z(\'\');x(i=0;i<s.y;i++)5(p.g.h(s[i])!=-1)s[i]="\\\\"+s[i];p.9=s.O(\'|\');6 l=N M(p.9,\'E\');6 a=p.g+p.4;a=a.H(l,\'\');$(3).J(2(e){5(!e.r)k=o.q(e.K);L k=o.q(e.r);5(a.h(k)!=-1)e.j();5(e.u&&k==\'v\')e.j()});$(3).B(\'D\',2(){7 F})})};$.c.I=2(p){6 8="n";8+=8.P();p=$.d({4:8},p);7 3.b(2(){$(3).f(p)})};$.c.t=2(p){6 m="A";p=$.d({4:m},p);7 3.b(2(){$(3).f(p)})}})(C);', 53, 53, '||function|this|nchars|if|var|return|az|allow|ch|each|fn|extend||alphanumeric|ichars|indexOf||preventDefault||reg|nm|abcdefghijklmnopqrstuvwxyz|String||fromCharCode|charCode||alpha|ctrlKey||allcaps|for|length|split|1234567890|bind|jQuery|contextmenu|gi|false|nocaps|replace|numeric|keypress|which|else|RegExp|new|join|toUpperCase|ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('|'), 0, {}));