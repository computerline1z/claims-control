
`var $ = window.jQuery`
$.widget "ui.ComboBox",  
#fnChangeCallBack:fn($(this).data("newval")
#Jeigu controlsas neturi tipo(Type), Type="List", kitais atvejai kitas, tada inputas gali turėt bet kokia reiksme, OnlyListItems
options:
	ListType: "List", Editable: {Add: false, Edit: false}, iVal: 0,	iText: [1]
	selectFirst: false, Value: "", mapWithNoCommas: false, addNewIfNotExists: false
_create: ->	
	#surandam artimiausia inputa ant kurio desim listboxa
	#				 if(this.element[0].nodeName==='INPUT') { var input=$(this.element[0]); }
	#				 else {
	#						var t=this.element.parent().find('input')[0];
	#						if(t.nodeName==='INPUT') { var input=$(t); } else { alert('Error! Input not found for ComboBox! (MyPlugins_ComboBox:10)'); }
	#				 }
	input = $(@element[0])
	alert "Error! Input not found for ComboBox! (MyPlugins_ComboBox:15)"	if input is `undefined`
	opt = $.extend(true, @options, $(input).data("ctrl"))
	opt.mapWithNoCommas=true if opt.Source=="proc_Drivers"
	fnEditItem = (id,newVals) ->
		new oGLOBAL.clsEditableForm(
			newVals: if newVals then {vals:newVals,cols:opt.iText} else null
			objData: opt.Source
			Action: (if (id) then "Edit" else "Add")
			aRowData: (if (id) then oDATA.GetRow(id, opt.Source) else 0)
			CallBackAfter: (RowData) -> #Ikisam naujas val i newval, o teksta i inputa
				$(input).data "newval", RowData[opt.iVal]
				newVal=RowData.MapArrToString(opt.iText,opt.mapWithNoCommas)
				$(input).val newVal
				if this.Action=="Edit"#pakeiciam comboboxo duomenis, oDATA jau pakeista
					data.findObjectByProperty("id",RowData[0]).label=newVal
				else #pridedam naują
					data.push({id:RowData[0],label:newVal})
				input.autocomplete "search", input.val() #refreshinam duomenis
				#$(input).removeClass "inputTip"
				#if (this.Action=="Add"){}#pakeiciam value nauju
				#Action = (if (id) then "Edit" else "Add")
				#if Action is "Add" - clsEditableForm jau viskas padaryta
				#	data[data.length] = RowData.MapArrToString(opt.iText)
				#else
				#	data.UpdateArrToNew RowData.MapArrToString(opt.iText)
		)
	#opt = $.extend({ ListType: "List", Editable: false, iVal: 0, iText: [1], selectFirst: false }, opt);		 //ListType:{None(be nieko, galima spausdint), List(listas, spausdint negalima), Combo(Listas, spausdint galima)}
	Editable = (if (opt.Editable.Add or opt.Editable.Edit) then true else false)
	data = undefined
	
	#if(opt.Type==="List") { //Jei Type==List mapinam pagal opt.iText kitu atveju pagal Field
	OptVal = parseInt(opt.Value, 10)
	data = $.map(oDATA.GET(opt.Source).Data, (a) ->		
		#for(var i=0; i<opt.iText.length; i++) { { ret.push(a[opt.iText[i]]); } }
		input.val a.MapArrToString(opt.iText,opt.mapWithNoCommas)	if a[0] is OptVal #Idedam verte i textboxa
		#return { id: a[0], value: a.MapArrToString(opt.iText), label: a[opt.iText[0]] };
		id: a[0]
		label: a.MapArrToString(opt.iText,opt.mapWithNoCommas)
	)
	
	#						} else {
	#								input.val(opt.Value);
	#								var i=oDATA.GET(opt.Source).Cols.FNameIndex(opt.Field);
	#								data=$.map(oDATA.GET(opt.Source).Data, function(a) { return { id: a[0], value: a[i] }; });
	#						}
	#if(typeof data!='undefined') { if(input.val()==='') { log('<p style="color:red;">Listas "'+opt.Source+'" nerado value:'+opt.Value+'</p>'); } }
	data[data.length] = opt.Append	if typeof opt.Append isnt "undefined" #Pridedam prie listo pvz: {Value:0, Text:"Neapdrausta"}
	
	#.val(value)
	$(input).on('keyup',->$(this).parent().find("span.ui-menu-icon").remove()
	).data("newval", opt.Value).autocomplete
		selectFirst: opt.selectFirst
		delay: 0
		minLength: ((if (@options.ListType is "None") then 2 else 0))
		autoFocus: true
		#			source: function(request, response) {
		#				 response($.ui.autocomplete.filter(data, request.term));
		#			},
		#						source: function(request, response) {
		#							 var matcher=new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
		#							 response(Ul.children("a").map(function() {
		#									var text=$(this).text();
		#									if(this.value&&(!request.term||matcher.test(text)))
		#										 return {
		#												label: text.replace(
		#																	new RegExp("(?![^&;]+;)(?!<[^<>]*)("+$.ui.autocomplete.escapeRegex(request.term)+")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>"),
		#												value: text,
		#												option: this
		#										 };
		#							 }));
		#						},
		#			source: function(request, response) {
		#				 var matcher=new RegExp($.ui.autocomplete.escapeRegex(request.term), "i"), suggestions=[];
		#				 input.removeClass('alink');
		#				 $.each(data, function(i, a) {
		#						if(a.value&&(!request.term||matcher.test(a.value)))
		#						//suggestions.push({ label: text.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)("+$.ui.autocomplete.escapeRegex(request.term)+")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>"),
		#						suggestions.push({ label: a.value,
		#							 value: a.value, // option: this,
		#							 id: a.id
		#						});
		#				 });
		#				 response(suggestions);
		#			},
		source: (request, response) ->
			response $.ui.autocomplete.filter(data, request.term)

		select: (event, ui) ->
			if $(event.srcElement).hasClass("ui-menu-icon")#paspaudimas ant controlu
				input.data("autocomplete").fnClickOnBtn(id:ui.item.id,elm:$(event.srcElement),fromInput:false)
				#event.stopPropagation()#event.preventDefault()				
				return false
			if ui.item
				if (!$(event.target).parent().find("span.ui-menu-item").length&&opt.appendToList)#pridedu redagavimo controlsus jei nebuvo
					$(event.target).parent().append(opt.appendToList)
				if ui.item.id isnt $(this).data("newval")
					$(this).data("newval", ui.item.id).val (if ($(this).data("ctrl").Type is "List") then ui.item.value else ui.item.label) #jeigu ne List tipo kisam viska priesingu atveju tik pirma lauka
					MY.execByName opt.fnChangeCallBack, MY, this, ui.item	if opt.fnChangeCallBack
					false #kad nieko daugiau nedarytu

		change: (event, ui) ->
			#if(ui.item) { if(opt.Type!=="List") { $(this).val(ui.item.label); } }
			#var lbl =(ui.item)?ui.item.label:"";
			#if($(this).val()!==lbl) {
			unless ui.item
				fnEditItem(0,input.val()) #čia iškviečiu naujo pridėjimo popupa, jei įrašė ko nėra
				# opt.fnChangeCallBack yra stringas, o opt.fnValueChanged funkcija
				MY.execByName opt.fnChangeCallBack, MY, this, null	if opt.fnChangeCallBack #ui.item===null kitais atvejais eina per select
				t = $(this)
				t.data "newval", ""
				#return true	if opt.Tip is t.val()	if opt.Tip
				
				# remove invalid value, as it didn't match anything
				t.val ""	if opt.Type is "List"
				input.data("autocomplete").term = ""	unless typeof input.data("autocomplete") is "undefined"
				#t.removeClass "alink"
				return false
			#$(this).removeClass "inputTip"

		close: (event, ui) ->
			#if $(event.srcElement).hasClass("ui-menu-icon")#buvo paspaudimas ant controlsu todel atidarau selecta vel
			#	input.autocomplete "search", input.val()
			#$(input).rem
			if opt.Editable.Edit #linko pridėjimas
				t = input # (t.data("newval"))?t.data("newval").replace("0", ""):"";
				newVal = t.data("newval")
				# if not t.hasClass("alink") and newVal
					# t.addClass("alink").unbind("dblclick").bind "dblclick", ->
						# fnEditItem newVal
				# else if newVa
					# t.unbind("dblclick").bind "dblclick", ->
						# fnEditItem newVal
				# else t.removeClass("alink").unbind "dblclick"	if t.hasClass("alink") and not newVal
			#input.removeClass "activeField" #if(opt.ListType!=="List") { input.removeClass("activeField"); }
			opt.fnValueChanged input.data("newval"), input.val()	if opt.fnValueChanged and input.data("newval") #NewVal,NewText

		open: ->
			input.addClass "activeField"	unless input.hasClass("activeField")	if opt.ListType isnt "List"
			if opt.ListType is "None" or opt.ListType is "Combo"
				acData = $(this).data("autocomplete")
				termTemplate = "<span style=\"color:red\">%s</span>"
				acData.menu.element.find("a").each ->
					me = $(this)					
					regex = new RegExp(acData.term, "gi")
					me.html me.text().replace(regex, (matched) -> termTemplate.replace "%s", matched)
					# me.append(opt.appendToList) if opt.appendToList

	#-----Inicializavimas pagal parametrus-------------------------------------------------------------------------------------
	if (opt.addNewIfNotExists)
		input.on("blur", ->
			alert "opa"
		)
	if opt.Editable.Edit
		val = input.data("newval")
		# if val
			# input.addClass("alink").bind "dblclick", ->
				# fnEditItem (if (val) then val else 0)
				
	#---------------------------------------------------------------------------------------------------
	input.removeClass("ui-corner-all").addClass "ui-corner-left"	if opt.ListType isnt "None" or opt.Editable.Add #ui-widget-content
	#pluginas AutoComplete Select first
	$(".ui-autocomplete-input").live "autocompleteopen", ->
		autocomplete = $(this).data("autocomplete")
		menu = autocomplete.menu
		return	unless autocomplete.options.selectFirst
		menu.activate $.Event(type: "mouseenter"), menu.element.children().first()

	#---------------------------------------------------------------------------------------------------
	# This line added to set default value of the combobox
	$(input).data("autocomplete")._renderItem = (ul, item) ->
		# if opt.Editable.Add
			# toAdd="<a "+("data-id="+item.id)+">"+item.value+opt.appendToList+"</a>"
		# else
		toAdd="<a> " + item.value + "</a>"	
		$("<li></li>").data("item.autocomplete", item).append(toAdd).appendTo ul

	if opt.Editable.Add
		id = $(this).data("newval")
		id = (if (id) then id else 0)#onclick='alert(\"opa\"); return false;'
		opt.appendToList="<span style='margin:-24px 4px auto auto;' title='redaguoti..' class='ui-icon ui-icon-pencil ui-menu-icon'>&nbsp;</span>"
		#"<span style='margin:-22px 20px auto auto;' title='redaguoti..' class='ui-icon ui-icon-pencil ui-menu-icon'>&nbsp;</span>"
		# <span style='margin:-16px 2px auto auto;' title='ištrinti..' class='ui-icon ui-icon-trash ui-menu-icon'>&nbsp;</span>"
		input.after(opt.appendToList)
		input.data("autocomplete").fnClickOnBtn=(p) ->
			Action=if p.elm.hasClass("ui-icon-pencil") then "Edit" else "Delete"
			oData=oDATA.GET(opt.Source)
			if p.elm.hasClass("ui-icon-pencil")#Edit
				fnEditItem p.id
			else
				#parent=p.elm.parent(); val=if p.fromInput then parent.find("input").val().trim() else parent.find("span:nth(0)").html()+parent.html().replace(/<span\b[^>]*>(.*?)<\/span>/gi,"").replace(/&nbsp;/gi,"").trim()
				val=oData.Data.findValueByID(p.id).MapArrToString(input.data("ctrl").iText,true)
				c=oData.Config.Msg.Delete;msg=c+" <b>\""+val+"\"</b>?"
				oCONTROLS.dialog.Confirm({title:c,msg:msg},-> 
					SERVER.update(Action:"Delete", DataToSave:{ id:p.id, DataTable: oData.Config.tblUpdate },
					Msg: { Title: "Duomenų ištrynimas", Success: oData.Config.Msg.GenName+" "+val+" buvo pašalintas.", Error: oData.Config.Msg.Delete+" "+val+" nepavyko." },									
					CallBack: 
						Success:(resp,updData) ->
							input.val("").parent().find("span.ui-menu-icon").remove() if data.findObjectByProperty("id", p.id).label==input.val()
							oData.Data.removeRowByID(p.id)
							data.removeRowByProperty("id",p.id)
							input.autocomplete "search", input.val() #refreshinam duomenis
					)
				)	
				
		#input.siblings().filter("span.ui-menu-icon").on("click", ->
		input.parent().on("click", "span.ui-menu-icon", ->
			e=$(this);id=e.parent().find("input").data("newval");
			input.data("autocomplete").fnClickOnBtn(id:id,elm:e,fromInput:true)
		)

		#input.data("autocomplete").originalSelect=input.data("autocomplete").select
		# input.data("autocomplete").menu.options.selected=(event,ui,originalSelect)->			
			# if $(event.srcElement).hasClass("ui-menu-icon")#buvo paspaudimas ant controlsu
				# alert "my select"
				# false
			# else				
				# input.data("autocomplete").selectOriginal.apply(this,arguments)
				#input.data("autocomplete").originalSelect.apply(this,arguments)
		#@addButton
		#	title: "Pridėti naują"
		#	icon: "img18-plus"
		#	fn: ->
		#		fnEditItem 0
		#	NoCorners: false
		#, input
	unless opt.ListType is "None"
		@addButton
			title: "Parodyti visus"
			icon: "ui-icon-triangle-1-s"
			fn: ->
				# close if already visible
				if input.autocomplete("widget").is(":visible")
					input.autocomplete "close"
					return
				# pass empty string as value to search for, displaying all results
				input.autocomplete "search", ""
				input.focus()
				false
			NoCorners: ((if (opt.Editable.Add) then true else false))
		, input
	
	#input.focus(function() { input.autocomplete("search", ""); return false; }); //ant input focuso atidarom autocomplete
	if opt.ListType is "List"
		input.attr "readonly", true
		input.click ->
			if input.autocomplete("widget").is(":visible")
				input.autocomplete "close"
				return false
			input.autocomplete "search", ""
			input.focus()
			false
	#display all records
	else
		input.click ->
			@select()
addButton: (p, input) ->
	#this.button = $("<button style='margin:0 0 0 -3px;height:" + input.outerHeight(true) + "px;'>&nbsp;</button>").attr("tabIndex", -1).attr("title", p.title).insertAfter(input)
	#.width(22)	//.css("vertical-align", "bottom")
	@button = $("<button style='margin:0 0 0 -2.2em;height:" + input.outerHeight() + "px;'>&nbsp;</button>").attr("tabIndex", -1).attr("title", p.title).insertAfter(input).button( #.attr("style", "margin-left:0.1em;left:0;");
		icons: {primary: p.icon}
		text: false
	).click(->
		p.fn()
		false
	).removeClass("ui-corner-all").addClass("ui-button-icon" + ((if (p.NoCorners) then "" else " ui-corner-right"))).find("span.ui-icon")
	@button.removeClass("ui-button-icon-primary ui-icon").css("margin", "-2px 0 0 -8px") if p.icon=="img18-plus"
	#if ($.browser.mozilla) { this.button.attr() }
	#else if ($.browser.msie) { }
	#if (!$.browser.chrome) { this.button.css("margin", "0"); }
	@button.css "margin", "0"	if $.browser.mozilla

#var btnWidth = this.button.parent().outerWidth(); //31
#var w = input.outerWidth() - btnWidth + 2; //223
#input.css("width",w);
destroy: ->
	#input.remove();
	#if(typeof this.button!='undefined') this.button.remove(); //Reikia uncomentinti norint buttono
	#this.element.show();
	$.Widget::destroy.call this