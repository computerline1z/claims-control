
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
	if opt.data then data = opt.data() else
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
			#input.addClass "activeField"	unless input.hasClass("activeField")	if opt.ListType isnt "List"
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
# App.DocsController = Em.ResourceController.create(
	# docTypes: oDATA.GET("tblDocTypes").emData
	# # filterFn: ((groupId)->
		# # ()-> @docTypes.filter((type)->type.docGroupID==groupId);
	# # ).property('@each')
	# # docTypes_Driver: @filterFn(3)
	
	# # docTypes_Driver:(-> 
	# # console.log(@docTypes);
	# # docTypes=@docTypes.filter((type)->type.docGroupID==3);
	# # console.log(docTypes);
	# # return docTypes
	# # ).property('docTypes')
# )


		
	  # duration: function() {
    # var duration = this.get('content.duration'),
         # minutes = Math.floor(duration / 60),
         # seconds = duration % 60;

    # return [minutes, seconds].join(':');
  # }.property('content.duration')

$.widget "ui.ComboBoxCategory", $.ui.ComboBox, 
	_create:() ->
		#me=@  #vietoj opt.Source reikia naudot this.option("Source") nes prieš create dar nėra opt 
		opts=@options;opts.element=@element;categoryOpts=opts.categoryOpts
		emCategories=oDATA.GET("tblDocGroup").emData		
		fnGetData=()->
			emTypes=oDATA.GET("tblDocTypes").emData;
			$.map.call(this, emTypes, (a) ->
				id: a[opts.iVal]#DocTypeID
				label: a.MapArrToString(opts.iText,opts.mapWithNoCommas)
				categoryID: a["docGroupID"]
			)
		editList=(opts)-> #formTemplate: "tmpUploadForm", disabled: false, docsController: "TreeDocController", Source: "tblDocTypes"
			#categoryOpts:{accident:{iD:70,title:"Įvykio dokumentai"},driver:{iD:80,title:"Vairuotojo 'Pranas Patv' dokai"},editList:{},vehicles:[{iD,title},{iD,title}]},
			#data:[{categoryID,id,label},{categoryID,id,label},{categoryID,id,label},{categoryID,id,label}]		
			#console.log(opts)
			MY.dialog=JQ.Dialog.create( #MY.dialog needed to destroyElement in ui-ember.js						
				title:"Dokumentų tipai (visi)"
				title2: "Dokumentų tipai"	
				saveData:(p)->#Msg,DataToSave,Action,row
					Source=App.docsTypesController.docTypes; docGroupID=p.row.docGroupID 
					# if docGroupID==2 then Source=@docTypes_accident
					# else if docGroupID==3 then Source=@docTypes_driver
					# else Source=@docTypes_vehicle					
					$.extend(p,"Ctrl":$("#openItemDialog"),"source":"tblDocTypes", 
					CallBackAfter:(Row)->
						# if p.Action=="Delete" then obj=Source.findProperty("iD", Row.iD); Source.removeObject(obj)
						# else if p.Action=="Add" then Source.pushObject(Em.Object.create(Row))
						# else Source.findProperty("iD", Row.iD).set("name",Row.name).set("edit",false) #redagavimas
						if p.Action=="Edit" then Source.findProperty("iD", Row.iD).set("edit",false) #redagavimas
						if p.Action=="Add" then MY.dialog.set(("addNewType"+Row.docGroupID),false)
						App.docsTypesController.init()#refreshinam medį
						opts.element.closest("table").find("input").autocomplete('option','source',opts.data())#updatinam autocompleto source'a
						console.log("New Row")
						console.log(Row)
					)	
					SERVER.update2(p);false
				editDocType: (e)-> e.context.set("edit",e.context.name) 
				cancelDocType: (e)-> e.context.set("edit",false)
				saveDocType: (e)->
					type=e.context.name;input=$(e.target).prev();val=input.val();row=e.context;row.name=val
					if type.length>2						
						Msg={Title:@title2,Success:"Dokumento tipas '"+type+"' pakeistas.",Error:"Nepavyko pakeisti tipo '"+type+"'."}
						@saveData({DataToSave:{"id":row.iD,"Data":[row.name],"Fields":["Name"],"DataTable":"tblDocTypes"},Msg:Msg,row:row,Action:"Edit"})
					else 
						e.context.set("name",e.context.edit).set("edit",false)
				deleteDocType: (e)->
					type=e.context.name; me=@
					oCONTROLS.dialog.Confirm(title:@title2,msg:"Ištrinti tipą '"+type+"'?", ()->					
						Msg={Title:me.title2,Success:"Dokumento tipas '"+type+"' ištrintas.",Error:"Nepavyko ištrinti tipo '"+type+"'."}; row=e.context				
						me.saveData({DataToSave:{"id":row.iD,"DataTable":"tblDocTypes"},Msg:Msg,row:row,Action:"Delete"})
					)
				addNewDocType: (e)-> @.set(("addNewType"+$(e.target).data("category-id")),true)
				cancelNewDocType: (e)-> @.set(("addNewType"+$(e.target).data("category-id")),false)				
				saveNewDocType: (e)-> 
					input=$(e.target).prev();val=input.val();docGroupID=input.data("category-id")
					Msg=Title:@title2,Success:"Dokumento tipas '"+val+"' pridėtas.",Error:"Nepavyko pridėt tipo '"+val+"'"
					@saveData({DataToSave:{"Data":[val,docGroupID],"Fields":["Name","DocGroupID"],"DataTable":"tblDocTypes"},Msg:Msg,row:[val,docGroupID],Action:"Add"})
				closeDialog: (e)-> $("#openItemDialog").dialog("close"); false
				width:600
				templateName: 'tmpDocTypes'	
			).append();
		$.extend(true, @options, data:fnGetData, editList:editList)
		
		
		@_super();	
		renderGroup=(me,ul,myCategory,docTypes,categoryID) -> 
			currentTypes = docTypes.filter((type) -> type.categoryID==categoryID)
			myCategory.forEach((category) ->
				ul.append("<li class='ui-autocomplete-category'>" + category.title + "</li>")		
				currentTypes.setEach("refID",category.iD)
				currentTypes.forEach((type,i) -> me._renderItemData(ul, type))# bėgam per šios kategorijos tipus	
			)	
		widget=@
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
				me._renderItemData(ul, {
				id:(target)-> widget.options.editList(widget.options),
				label:"Redaguoti sarašą",value:"Redaguoti sarašą"})
				ul.find("li:last a").addClass("actionLink")
