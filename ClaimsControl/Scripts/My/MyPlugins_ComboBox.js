﻿/// <reference path="../JSMain/jquery-1.6.2-vsdoc.js"
(function ($) {
	$.widget("ui.ComboBox", {
		//fnChangeCallBack:fn($(this).data("newval")
		//Jeigu controlsas neturi tipo(Type), Type="List", kitais atvejai kitas, tada inputas gali turėt bet kokia reiksme, OnlyListItems
		options: { ListType: "List", Editable: { Add: false, Edit: false }, iVal: 0, iText: [1], selectFirst: false, Value: "" },
		_create: function () {
			//surandam artimiausia inputa ant kurio desim listboxa
			//         if(this.element[0].nodeName==='INPUT') { var input=$(this.element[0]); }
			//         else {
			//            var t=this.element.parent().find('input')[0];
			//            if(t.nodeName==='INPUT') { var input=$(t); } else { alert('Error! Input not found for ComboBox! (MyPlugins_ComboBox:10)'); }
			//         }
			var input = $(this.element[0]); if (input === undefined) { alert('Error! Input not found for ComboBox! (MyPlugins_ComboBox:15)'); }
			var opt = $.extend(this.options, $(input).data("ctrl"));
			var fnEditItem = function (id) {
				new clsEditableForm({ objData: opt.Source, Action: (id) ? "Edit" : "Add", aRowData: (id) ? oDATA.GetRow(id, opt.Source) : 0,
					CallBackAfter: function (RowData) {//Ikisam naujas val i newval, o teksta i inputa
						$(input).data("newval", RowData[opt.iVal]); $(input).val(RowData.MapArrToString(opt.iText));
						$(input).removeClass("inputTip");
						var Action = (id) ? "Edit" : "Add";
						if (Action === "Add") { data[data.length] = RowData.MapArrToString(opt.iText); }
						else { data.UpdateArrToNew(RowData.MapArrToString(opt.iText)); }
					}
				})
			}
			//opt = $.extend({ ListType: "List", Editable: false, iVal: 0, iText: [1], selectFirst: false }, opt);     //ListType:{None(be nieko, galima spausdint), List(listas, spausdint negalima), Combo(Listas, spausdint galima)}
			var Editable = (opt.Editable.Add || opt.Editable.Edit) ? true : false, data;
			//            if(opt.Type==="List") { //Jei Type==List mapinam pagal opt.iText kitu atveju pagal Field
			OptVal = parseInt(opt.Value, 10);
			data = $.map(oDATA.GET(opt.Source).Data,
                 function (a) {
                 	//for(var i=0; i<opt.iText.length; i++) { { ret.push(a[opt.iText[i]]); } }
                 	if (a[0] === OptVal) { input.val(a.MapArrToString(opt.iText)); } //Idedam verte i textboxa
                 	//return { id: a[0], value: a.MapArrToString(opt.iText), label: a[opt.iText[0]] };
                 	return { id: a[0], label: a.MapArrToString(opt.iText) };
                 });
			//            } else {
			//                input.val(opt.Value);
			//                var i=oDATA.GET(opt.Source).Cols.FNameIndex(opt.Field);
			//                data=$.map(oDATA.GET(opt.Source).Data, function(a) { return { id: a[0], value: a[i] }; });
			//            }
			//if(typeof data!='undefined') { if(input.val()==='') { log('<p style="color:red;">Listas "'+opt.Source+'" nerado value:'+opt.Value+'</p>'); } }
			if (typeof opt.Append !== 'undefined') { data[data.length] = opt.Append; } //Pridedam prie listo pvz: {Value:0, Text:"Neapdrausta"}
			$(input).data("newval", opt.Value)
			//.val(value)
   .autocomplete({
   	selectFirst: opt.selectFirst, delay: 0, minLength: ((this.options.ListType === "None") ? 2 : 0), autoFocus: true,

   	//      source: function(request, response) {
   	//         response($.ui.autocomplete.filter(data, request.term));
   	//      },
   	//            source: function(request, response) {
   	//               var matcher=new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
   	//               response(Ul.children("a").map(function() {
   	//                  var text=$(this).text();
   	//                  if(this.value&&(!request.term||matcher.test(text)))
   	//                     return {
   	//                        label: text.replace(
   	//            											new RegExp("(?![^&;]+;)(?!<[^<>]*)("+$.ui.autocomplete.escapeRegex(request.term)+")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>"),
   	//                        value: text,
   	//                        option: this
   	//                     };
   	//               }));
   	//            },
   	//      source: function(request, response) {
   	//         var matcher=new RegExp($.ui.autocomplete.escapeRegex(request.term), "i"), suggestions=[];
   	//         input.removeClass('alink');
   	//         $.each(data, function(i, a) {
   	//            if(a.value&&(!request.term||matcher.test(a.value)))
   	//            //suggestions.push({ label: text.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)("+$.ui.autocomplete.escapeRegex(request.term)+")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>"),
   	//            suggestions.push({ label: a.value,
   	//               value: a.value, // option: this,
   	//               id: a.id
   	//            });
   	//         });
   	//         response(suggestions);
   	//      },
   	source: function (request, response) {
   		response($.ui.autocomplete.filter(data, request.term));
   	},

   	select: function (event, ui) {
   		if (ui.item) {
   			if (ui.item.id !== $(this).data("newval")) {
   				$(this).data("newval", ui.item.id).val(($(this).data("ctrl").Type === "List") ? ui.item.value : ui.item.label); //jeigu ne List tipo kisam viska priesingu atveju tik pirma lauka
   				if (opt.fnChangeCallBack) { MY.execByName(opt.fnChangeCallBack, MY, this, ui.item); }
   				return false; //kad nieko daugiau nedarytu
   			}
   		}
   	}, change: function (event, ui) {
   		//if(ui.item) { if(opt.Type!=="List") { $(this).val(ui.item.label); } }
   		//var lbl =(ui.item)?ui.item.label:"";
   		//if($(this).val()!==lbl) {
   		if (!ui.item) {
   			// opt.fnChangeCallBack yra stringas, o opt.fnValueChanged funkcija
   			if (opt.fnChangeCallBack) { MY.execByName(opt.fnChangeCallBack, MY, this, null); } //ui.item===null kitais atvejais eina per select
   			var t = $(this); t.data("newval", "");
   			if (opt.Tip) { if (opt.Tip === t.val()) return true; }
   			// remove invalid value, as it didn't match anything
   			if (opt.Type === "List") { t.val(""); }
   			if (typeof input.data("autocomplete") != 'undefined') input.data("autocomplete").term = "";
   			t.removeClass('alink'); return false;
   		}
   		$(this).removeClass("inputTip");
   	}, close: function (event, ui) {
   		//$(input).rem
   		if (opt.Editable.Edit) { //linko pridėjimas
   			var t = input, newVal = t.data("newval"); // (t.data("newval"))?t.data("newval").replace("0", ""):"";
   			if (!t.hasClass('alink') && newVal) { t.addClass('alink').unbind('dblclick').bind('dblclick', function () { fnEditItem(newVal); }) }
   			else if (newVal) { t.unbind('dblclick').bind('dblclick', function () { fnEditItem(newVal); }) }
   			else if (t.hasClass('alink') && !newVal) { t.removeClass('alink').unbind('dblclick'); }
   		}
   		input.removeClass("activeField"); //if(opt.ListType!=="List") { input.removeClass("activeField"); }
   		if (opt.fnValueChanged && input.data("newval")) { opt.fnValueChanged(input.data("newval"), input.val()); } //NewVal,NewText
   	}, open: function () {
   		if (opt.ListType !== "List") { if (!input.hasClass("activeField")) { input.addClass("activeField"); } }
   		if (opt.ListType == "None" || opt.ListType == "Combo") {
   			var acData = $(this).data('autocomplete');
   			var termTemplate = '<span style="color:red">%s</span>';
   			acData.menu.element.find('a').each(function () {
   				var me = $(this);
   				var regex = new RegExp(acData.term, "gi");
   				me.html(me.text().replace(regex, function (matched) {
   					return termTemplate.replace('%s', matched);
   				}));
   			});
   		}
   	}
   })
			//-----Inicializavimas pagal parametrus-------------------------------------------------------------------------------------
			if (opt.Editable.Edit) {
				var val = input.data("newval");
				if (val) { input.addClass('alink').bind('dblclick', function () { fnEditItem((val) ? val : 0); }); }
			}
			//---------------------------------------------------------------------------------------------------
			if (opt.ListType !== "None" || opt.Editable.Add) { input.removeClass("ui-corner-all").addClass("ui-corner-left"); } //ui-widget-content
			//pluginas AutoComplete Select first
			$(".ui-autocomplete-input").live("autocompleteopen", function () {
				var autocomplete = $(this).data("autocomplete"), menu = autocomplete.menu;
				if (!autocomplete.options.selectFirst) { return; }
				menu.activate($.Event({ type: "mouseenter" }), menu.element.children().first());
			});
			//---------------------------------------------------------------------------------------------------
			// This line added to set default value of the combobox
			$(input).data("autocomplete")._renderItem = function (ul, item) {
				return $("<li></li>").data("item.autocomplete", item).append("<a>" + item.value + "</a>").appendTo(ul);
			};
			if (opt.Editable.Add) {
				var id = $(this).data("newval"); id = (id) ? id : 0;
				this.addButton({ title: "Pridėti naują", icon: "img16-add_new",
					fn: function () {
						fnEditItem(0);
					}, NoCorners: false
				}, input);
			};
			if (opt.ListType != "None") {
				this.addButton({ title: "Parodyti visus", icon: "ui-icon-triangle-1-s",
					fn: function () {
						// close if already visible
						if (input.autocomplete("widget").is(":visible")) { input.autocomplete("close"); return; }
						// pass empty string as value to search for, displaying all results
						input.autocomplete("search", ""); input.focus(); return false;
					}, NoCorners: ((opt.Editable.Add) ? true : false)
				}, input);
				//input.focus(function() { input.autocomplete("search", ""); return false; }); //ant input focuso atidarom autocomplete
			};
			if (opt.ListType == "List") {
				input.attr("readonly", true);
				input.click(function () {
					if (input.autocomplete("widget").is(":visible")) { input.autocomplete("close"); return false; }
					input.autocomplete("search", ""); input.focus(); return false;
				}) //display all records
			} else {
				input.click(function () { this.select(); })
			}
		},
		addButton: function (p, input) {
			//title,icon,fn,NoCorners
			this.button = $("<button style='margin:0 0 0 -3px;height:" + input.outerHeight() + "px;'>&nbsp;</button>").attr("tabIndex", -1).attr("title", p.title).insertAfter(input)
                      .button({ icons: { primary: p.icon }, text: false })//.width(22)  //.css("vertical-align", "bottom")
                      .click(function () { p.fn(); return false; })
                      .removeClass("ui-corner-all").addClass("ui-button-icon" + ((p.NoCorners) ? "" : " ui-corner-right"))
                      .find('span.ui-icon'); //.attr("style", "margin-left:0.1em;left:0;");
			//if ($.browser.mozilla) { this.button.attr() }
			//else if ($.browser.msie) { }
			//if (!$.browser.chrome) { this.button.css("margin", "0"); }
			if ($.browser.mozilla) { this.button.css("margin", "0"); }

			var btnWidth = this.button.parent().outerWidth(); //31
			var w = input.outerWidth() - btnWidth + 2; //223
                        input.css("width",w);
			//input.log("width after:" + input.width()); //236

		},
		destroy: function () {
			//input.remove();
			//if(typeof this.button!='undefined') this.button.remove(); //Reikia uncomentinti norint buttono
			//this.element.show();
			$.Widget.prototype.destroy.call(this);
		}
	});
})(jQuery);