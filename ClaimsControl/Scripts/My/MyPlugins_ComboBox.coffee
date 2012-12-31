
`var $ = window.jQuery`
$.widget "ui.ComboBox",  
#fnChangeCallBack:fn($(this).data("newval")
#Jeigu controlsas neturi tipo(Type), Type="List", kitais atvejai kitas, tada inputas gali turėt bet kokia reiksme, OnlyListItems
options:
	ListType: "List", Editable: {Add: false, Edit: false},# iVal: 0,	iText: [1]
	selectFirst: false, Value: "", mapWithNoCommas: false, addNewIfNotExists: false
_create: ->	
	#surandam artimiausia inputa ant kurio desim listboxa
	input = $(@element[0])
	console.error("Input not found for ComboBox!")	if input.length==0
	opt = $.extend(true, @options, input.data("ctrl"))
	opt.mapWithNoCommas=true if opt.Source=="proc_Drivers"
	fnEditItem = (id,newVals) ->
		id= parseInt(id,10)
		Action= if (id) then "Edit" else "Add"
		pars=
			source: opt.Source, template: opt.Source.replace("proc_","tmp_")#controllerio ir emObject reikia tik iš listAll (dėl updatinimo)
			row: if (id) then oDATA.GET("proc_Vehicles").emData.findProperty("iD",id) else 0
			Action: (if (id) then "Edit" else "Add")
			newVals: if newVals then {vals:newVals,cols:opt.iText} else null#?
			CallBackAfter:(Row)->
				dialogFrm.dialog("close");
				alert "fnEditItem finished!"		
		App.listAllController.openItem(pars)			
	Editable = (if (opt.Editable.Add or opt.Editable.Edit) then true else false)
	data = undefined
	
	#if(opt.Type==="List") { //Jei Type==List mapinam pagal opt.iText kitu atveju pagal Field
	OptVal = parseInt(opt.Value, 10)
	if opt.data then data = opt.data else
		data = $.map(oDATA.GET(opt.Source).emData, (a) -> 
			#for(var i=0; i<opt.iText.length; i++) { { ret.push(a[opt.iText[i]]); } }
			input.val a.MapArrToString(opt.iText,opt.mapWithNoCommas) if a.iD is OptVal #Idedam verte i textboxa
			#return { id: a[0], value: a.MapArrToString(opt.iText), label: a[opt.iText[0]] };
			id: a[opt.iVal]
			label: a.MapArrToString(opt.iText,opt.mapWithNoCommas)
		)
	data[data.length] = opt.Append	if typeof opt.Append isnt "undefined" #Pridedam prie listo pvz: {Value:0, Text:"Neapdrausta"}
	$(input).on('keyup',->$(this).parent().find("span.ui-menu-icon").remove()
	).data("newval", opt.Value).autocomplete
		selectFirst: opt.selectFirst
		delay: 0
		minLength: ((if (@options.ListType is "None") then 2 else 0))
		autoFocus: true
		source: (request, response) ->
			response $.ui.autocomplete.filter(data, request.term)

		select: (event, ui) ->
			if typeof ui.item.id=="function" then ui.item.id(); return false#jei id yra funkcija executinam ir iseinam
			if $(event.srcElement).hasClass("ui-menu-icon")#paspaudimas ant controlu
				input.data("autocomplete").fnClickOnBtn(id:ui.item.id,elm:$(event.srcElement),fromInput:false)
				#event.stopPropagation()#event.preventDefault()				
				return false
			if ui.item
				if (!$(event.target).parent().find("span.ui-menu-icon").length&&opt.appendToList)#pridedu redagavimo controlsus jei nebuvo
					$(event.target).parent().append(opt.appendToList)
				if ui.item.id isnt $(this).data("newval")
					$(this).data("newval", ui.item.id).val (if ($(this).data("ctrl").Type is "List") then ui.item.value else ui.item.label) #jeigu ne List tipo kisam viska priesingu atveju tik pirma lauka
					MY.execByName opt.fnChangeCallBack, MY, this, ui.item	if opt.fnChangeCallBack
				if ui.item.refID #Su kategorijom naudojamas
					$(this).data("refID", ui.item.refID)
					$(this).data("categoryID", ui.item.categoryID)
					false #kad nieko daugiau nedarytu

		change: (event, ui) ->
			unless ui.item
				fnEditItem(0,input.val()) #čia iškviečiu naujo pridėjimo popupa, jei įrašė ko nėra
				# opt.fnChangeCallBack yra stringas, o opt.fnValueChanged funkcija
				MY.execByName opt.fnChangeCallBack, MY, this, null	if opt.fnChangeCallBack #ui.item===null kitais atvejais eina per select
				t = $(this)
				t.data "newval", ""
				t.val ""	if opt.Type is "List"
				input.data("autocomplete").term = ""	unless typeof input.data("autocomplete") is "undefined"
				return false
		close: (event, ui) ->
			return false
			if opt.Editable.Edit #linko pridėjimas
				t = input # (t.data("newval"))?t.data("newval").replace("0", ""):"";
				newVal = t.data("newval")
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
		blur: ->
			alert "nu ble"
	#-----Inicializavimas pagal parametrus-------------------------------------------------------------------------------------
	if (opt.addNewIfNotExists)
		input.on("blur", ->
			alert "opa"
		)
	if opt.Editable.Edit
		val = input.data("newval")
	#---------------------------------------------------------------------------------------------------
	#pluginas AutoComplete Select first
	$(".ui-autocomplete-input").live "autocompleteopen", ->
		autocomplete = $(this).data("autocomplete")
		menu = autocomplete.menu
		return	unless autocomplete.options.selectFirst
		menu.activate $.Event(type: "mouseenter"), menu.element.children().first()

	#---------------------------------------------------------------------------------------------------
	# This line added to set default value of the combobox
	# $(input).data("autocomplete")._renderMenu = (ul, items) ->
		# that = this; currentCategory = "";
		# $.each( items, ( index, item ) ->
			# # if ( item.category != currentCategory )
				# # ul.append( "<li class='ui-autocomplete-category'>" + item.category + "</li>" );
				# # currentCategory = item.category;
			# ul.append( "<li class='ui-autocomplete-category'>OpaOpa</li>" );
			# that._renderItemData( ul, item );
		# )
	
	$(input).data("autocomplete")._renderItem = (ul, item) ->
		# if opt.Editable.Add
			# toAdd="<a "+("data-id="+item.id)+">"+item.value+opt.appendToList+"</a>"
		# else
		toAdd="<a> " + item.value + "</a>"	
		$("<li></li>").data("item.autocomplete", item).append(toAdd).appendTo ul

	if opt.Editable.Add
		id = $(this).data("newval")
		id = (if (id) then id else 0)#onclick='alert(\"opa\"); return false;'
		opt.appendToList="<span title='redaguoti..' class='ui-icon ui-icon-pencil ui-menu-icon'>&nbsp;</span>"
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
	@button = $("<button style='margin:0 0 0 -2.2em;height:" + input.outerHeight() + "px;'>&nbsp;</button>").attr("tabIndex", -1).attr("title", p.title).insertAfter(input).button( #.attr("style", "margin-left:0.1em;left:0;");
		icons: {primary: p.icon}
		text: false
	).click(->
		p.fn()
		false
	).removeClass("ui-corner-all").find("span").attr("class","")#.addClass("ui-button-icon" + ((if (p.NoCorners) then "" else " ui-corner-right"))).find("span.ui-icon")
	@button.removeClass("ui-button-icon-primary ui-icon").css("margin", "-2px 0 0 -8px") if p.icon=="img18-plus"
	#if ($.browser.mozilla) { this.button.attr() }
	#else if ($.browser.msie) { }
	#if (!$.browser.chrome) { this.button.css("margin", "0"); }
	#@button.css "margin", "0"	if $.browser.mozilla
destroy: ->
	$.Widget::destroy.call this
	
#=======================================================================================
# $($0).data("newval") $(this).data("newvalRefID", ui.item.refID)
#categoryOpts:{editList:true,driver:{iD:87,name:"Vairuotojo Albinas Palubinskas dokumentai"},vehicles:[{iD:14,title:"TP BBB, Volvo __ dokumentai"},{iD:7,title:"BRU643, Volvo, FH12"}]}
$.widget "ui.ComboBoxCategory", $.ui.ComboBox, 
	_create:() ->
		#me=@  #vietoj opt.Source reikia naudot this.option("Source") nes prieš create dar nėra opt 
		opts=@options;categoryOpts=opts.categoryOpts
		emCategories=oDATA.GET("tblDocGroup").emData
		emTypes=oDATA.GET("tblDocType").emData
		data=$.map.call(this, emTypes, (a) ->
			id: a[opts.iVal]#DocTypeID
			label: a.MapArrToString(opts.iText,opts.mapWithNoCommas)
			categoryID: a["docGroupID"]
		)
		$.extend(true, @options, data:data)
		
		@_super();	
		renderGroup=(me,ul,myCategory,docTypes,categoryID) -> 
			currentTypes = docTypes.filter((type) -> type.categoryID==categoryID)
			myCategory.forEach((category) ->
				ul.append("<li class='ui-autocomplete-category'>" + category.title + "</li>")		
				currentTypes.setEach("refID",category.iD)
				currentTypes.forEach((type,i) -> me._renderItemData(ul, type))# bėgam per šios kategorijos tipus	
			)			
		@element.data("autocomplete")._renderMenu = (ul, docTypes) ->
			me = @; currentCategoryID = "";
			emCategories.forEach((catItem,i) -> # bėgam per kategorijas
				#Ref 1-Nuotraukos,2-Įvykio dok, 3-Vairuotojo dok, 4-TP dok, 0-Nepriskirti
				if (catItem.iD==0) then return
				else if (catItem.iD==1) then me._renderItemData(ul,{id:0,label:"Nuotrauka",value:"Nuotrauka",categoryID:1,refID:categoryOpts.accident.iD});
				else if (catItem.iD==3 and categoryOpts.driver) then renderGroup(me,ul,[categoryOpts.driver],docTypes,3)
				else if (catItem.iD==4 and categoryOpts.vehicles) then renderGroup(me,ul,categoryOpts.vehicles,docTypes,4)
				else if (catItem.iD==2 and categoryOpts.accident) then renderGroup(me,ul,[categoryOpts.accident],docTypes,2)
			)
			if categoryOpts.editList
				#$( "<li class='ui-autocomplete-category editCategories'><a >Redaguoti sąrašą</a></li>" ).appendTo(ul)
				me._renderItemData(ul, {id:(()->alert("Redaguoti")),label:"Redaguoti sarašą",value:"Redaguoti sarašą"})
				ul.find("li:last a").addClass("actionLink")