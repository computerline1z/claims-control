
`var $ = window.jQuery`
$.widget "ui.ComboBox",  
#fnChangeCallBack:fn($(this).data("newval")
#Jeigu controlsas neturi tipo(Type), Type="List", kitais atvejai kitas, tada inputas gali turėt bet kokia reiksme, OnlyListItems
options:
	ListType: "List", Editable: {EditThis: false, EditList: false},# iVal: 0,	iText: [1]
	selectFirst: false, Value: "", mapWithNoCommas: false, addNewIfNotExists: false
_create: ->	
	#surandam artimiausia inputa ant kurio desim listboxa
	input = $(@element[0]).val("Pasirinkite iš sąrašo..")
	console.error("Input not found for ComboBox!")	if input.length==0
	opt = $.extend(true, @options, input.data("ctrl"))
	opt.mapWithNoCommas=true if opt.Source=="proc_Drivers"
	fnEditItem = (id,newVals,e) ->
		id= parseInt(id,10)
		Action= if (id) then "Edit" else "Add"
		template=if (opt.Source=="proc_InsPolicies_forThisAccident") then "tmp_InsPolicies" else opt.Source.replace("proc_","tmp_")
		pars=
			source: opt.Source, template: template #controllerio ir emObject reikia tik iš listAll (dėl updatinimo)
			row: if (id) then oDATA.GET(opt.Source).emData.findProperty("iD",id) else 0
			Action: (if (id) then "Edit" else "Add")
			newVals: if newVals then {vals:newVals,cols:opt.iText} else null#?
			input: if e then $(e.target) else null
			CallBackAfter:(Row)->
				dialogFrm.dialog("close");
		App.listAllController.openItem(pars)		
		false
	data = undefined
	
	#if(opt.Type==="List") { //Jei Type==List mapinam pagal opt.iText kitu atveju pagal Field
	fnSetData=() -> #Gali būt naudojamas Refreshinant per fnRefresh
		OptVal = parseInt(opt.Value, 10)
		if opt.data then data = opt.data() else
			fn=(a) -> 
				if opt.excludeFromList then if opt.excludeFromList.ValueInMe(a.iD) then return null #ko nepridedam į sąrašus
				input.val a.MapArrToString(opt.iText,opt.mapWithNoCommas,opt.Source) if a.iD is OptVal #Idedam verte i textboxa
				return id: a[opt.iVal], label: a.MapArrToString(opt.iText,opt.mapWithNoCommas,opt.Source)				
			data = $.map(oDATA.GET(opt.Source).emData, (a) -> fn(a))
		#data[data.length] = opt.Append	if typeof opt.Append isnt "undefined" #Pridedam prie listo pvz: {Value:0, Text:"Neapdrausta"}
		if opt.Editable.EditList then data[data.length]=id:-1,value:"Redaguoti sąrašą",label:"Redaguoti sąrašą"
		if opt.Editable.AddNew then data[data.length]=id:-2,value:"Įvesti naują",label:"Įvesti naują"
	fnSetData()
	$(input).on('keyup',->$(this).parent().find("span.ui-menu-icon").remove()
	).data("newval", opt.Value).autocomplete
		selectFirst: opt.selectFirst
		delay: 0
		minLength: ((if (@options.ListType is "None") then 2 else 0))
		autoFocus: true
		fnRefresh: ()-> 
			if input.data("newval") then opt.Value=input.data("newval")
			fnSetData()
			#input.after("<span title='redaguoti..' class='ui-icon ui-icon-pencil ui-menu-icon'>&nbsp;</span>") if opt.Editable.EditThis and input.data("newval") and opt.ListType=="None"	
			input.after("<i title='redaguoti..' class='img18-pencil ui-menu-icon'></i>") if opt.Editable.EditThis and input.data("newval") and opt.ListType=="None"
		source: (request, response) ->
			response $.ui.autocomplete.filter(data, request.term)

		select: (event, ui) ->
			if typeof ui.item.id=="function" then ui.item.id(); return false#jei id yra funkcija executinam ir iseinam	
			if ui.item.id==-1 #taip žymim redagavimą
				App.listAllController.editListItems(input, event)
			else if ui.item.id==-2 #taip žymim naujo pridėjimą
				fnEditItem(0,null,event)
				# Source=$(event.target).data("ctrl").Source				
				# if Source=="tblVehicleMakes" then App.listAllController.addVehicleMake(input, event) #App.listAllController.set("addMakeMode",true) #modelio pridėjimas
				# else if Source=="tblInsurers" then App.listAllController.addInsurers
				# else fnEditItem(0)
				return false #čia tipo naujo itemso pridėjimas	
				
			ctrl=input.next().next("span"); isPencil=ctrl.hasClass("img18-pencil")	#gali būt redagavimo pieštukas		
			if ui.item.id==0 and isPencil then ctrl.css("display","none") #taip žymim neapdrausta
			else if isPencil then ctrl.css("display","block")		
			
			if $(event.srcElement).hasClass("ui-menu-icon")#paspaudimas ant controlu
				input.data("autocomplete").fnClickOnBtn(id:ui.item.id,elm:$(event.srcElement),fromInput:false)
				#event.stopPropagation()#event.preventDefault()				
				return false
			if ui.item
				#if (!$(event.target).parent().find("span.ui-menu-icon").length&&opt.appendToList)#pridedu redagavimo controlsus jei nebuvo
				#	$(event.target).parent().append(opt.appendToList)
				if ui.item.id isnt $(this).data("newval")
					#$(this).data("newval", ui.item.id).val (if ($(this).data("ctrl").Type is "List") then ui.item.value else ui.item.label) #jeigu ne List tipo kisam viska priesingu atveju tik pirma lauka
					$(this).data("newval", ui.item.id).val (ui.item.value)
					input.data("autocomplete").fnItemChanged(ui.item.id) if input.data("autocomplete").fnItemChanged
				if ui.item.refID #Su kategorijom naudojamas
					$(this).data("refID", ui.item.refID)
					$(this).data("categoryID", ui.item.categoryID)
					false #kad nieko daugiau nedarytu
				if opt.fnChangeCallBack then opt.fnChangeCallBack(event, ui) #CallBackas tik kai yra kas nors pasirinkta
		change: (event, ui) -> #įvyksta tik ant blur
			unless ui.item
				fnEditItem(0,input.val(),event) #čia iškviečiu naujo pridėjimo popupa, jei įrašė ko nėra
				t = $(this)
				t.data "newval", ""
				t.val ""	if opt.Type is "List"
				input.data("autocomplete").term = "" unless typeof input.data("autocomplete") is "undefined"
				return false
		close: (event, ui) ->
			return false
			#if opt.Editable.Edit #linko pridėjimas
				# t = input # (t.data("newval"))?t.data("newval").replace("0", ""):"";
				# newVal = t.data("newval")
		open: ->
			#input.addClass "activeField"	unless input.hasClass("activeField")	if opt.ListType isnt "List"
			if opt.Editable.EditList or opt.Editable.AddNew
				$('ul.ui-autocomplete:visible').find("a:last").addClass("actionLink") #Ten bus pridėti naują su id=-1 arba id=-2
				#$('<li class="actionLink" data-action="Add"><a href="#">Pridėti naują</a></li>').appendTo('ul.ui-autocomplete');
			if opt.ListType is "None" or opt.ListType is "Combo"
				acData = $(this).data("autocomplete")
				termTemplate = "<span style=\"color:red\">%s</span>"
				acData.menu.element.find("a").each ->
					me = $(this)					
					regex = new RegExp(acData.term, "gi")
					me.html me.text().replace(regex, (matched) -> termTemplate.replace "%s", matched)
	#-----Inicializavimas pagal parametrus-------------------------------------------------------------------------------------
	# if (opt.addNewIfNotExists)
		# input.on("blur", ->
			# alert "opa"
		# )
	# if opt.Editable.Edit
		# val = input.data("newval")
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
	
	# $(input).data("autocomplete")._renderItem = (ul, item) ->
		# if opt.Editable.Add
			# toAdd="<a data-action='Add'>Pridėti naują</a>"
			# toAdd=	
			# $("<li></li>").data("item.autocomplete", item).append("<a>Pridėti naują</a>").appendTo ul
		# else
			# toAdd="<a> " + item.value + "</a>"	
			# $("<li></li>").data("item.autocomplete", item).append(toAdd).appendTo ul

	if opt.Editable.EditThis
		id = $(this).data("newval")
		id = (if (id) then id else 0)#onclick='alert(\"opa\"); return false;'
		#opt.appendToList="<span title='redaguoti..' class='ui-icon ui-icon-pencil ui-menu-icon'>&nbsp;</span>"
		opt.appendToList="<i title='redaguoti..' class='img18-pencil ui-menu-icon'></i>"
		input.after(opt.appendToList)
		input.data("autocomplete").fnClickOnBtn=(p) ->
			Action=if p.elm.hasClass("img18-pencil") then "Edit" else "Delete"
			oData=oDATA.GET(opt.Source)
			if p.elm.hasClass("img18-pencil")#Edit
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
		input.parent().on("click", "span.ui-menu-icon,i.ui-menu-icon", ->
			e=$(this);id=e.parent().find("input").data("newval");
			input.data("autocomplete").fnClickOnBtn(id:id,elm:e,fromInput:true)
		)
	unless opt.ListType is "None"#Prideda listo buttoną
		@addButton
			Editable: opt.Editable
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
			#NoCorners: ((if (opt.Editable.Add) then true else false))
		, input
	
	if opt.ListType is "List"
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
	height=if input.outerHeight() !=0 then "style='height:" + input.outerHeight() + "px;'" else "";
	@button = $("<button "+height+" class='drop-down'>&nbsp;</button>").attr("tabIndex", -1).attr("title", p.title).insertAfter(input).button( #.attr("style", "margin-left:0.1em;left:0;");
		icons: {primary: p.icon}
		text: false
	).click(->
		p.fn()
		false
	).removeClass("ui-corner-all").find("span").attr("class","")#.addClass("ui-button-icon" + ((if (p.NoCorners) then "" else " ui-corner-right"))).find("span.ui-icon")
	@button.removeClass("ui-button-icon-primary ui-icon").css("margin", "-2px 0 0 -8px") if p.icon=="img18-plus"
	console.log("opa opa")
	if p.Editable.EditThis
		w=input.prev().width()-26+'px'; input.css("width",w)	
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
		if categoryOpts.showCategories then emCategories=categoryOpts.showCategories
		else emCategories=oDATA.GET("tblDocGroup").emData
		if not App.docsTypesController then App.create_docsTypesController() #reikalingas kategorijų sarašam parodyt ir redaguot
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
			dialogID="dialog"+(+new Date)#kad nesipjautų dialogai
			MY[dialogID]=JQ.Dialog.create( #MY.dialog needed to destroyElement in ui-ember.js	
				dialogID: dialogID
				title:"Redaguoti sąrašą"
				title2: "Dokumentų tipai"				
				saveData:(p)->#Msg,DataToSave,Action,row
					Source=App.docsTypesController.docTypes; docGroupID=p.row.docGroupID 
					# if docGroupID==2 then Source=@docTypes_accident
					# else if docGroupID==3 then Source=@docTypes_driver
					# else Source=@docTypes_vehicle					
					$.extend(p,"Ctrl":$("#"+@dialogID),"source":"tblDocTypes", 
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
				closeDialog: (e)-> $("#"+@dialogID).dialog("close"); false
				width:600
				templateName: 'tmpDocTypes'	
			).append();
		$.extend(true, @options, data:fnGetData, editList:editList)	
		@_super();	
		renderGroup=(me,ul,myCategory,docTypes,categoryID) -> 
			currentTypes = docTypes.filter((type) -> type.categoryID==categoryID)
			myCategory.forEach((category) ->
					ul.append("<li class='ui-autocomplete-category'>" + category.title + "</li>")           
					currentTypes.forEach((type,i) -> # bėgam per šios kategorijos tipus
						typeClone=$.extend({},type,refID:category.iD)#set apropriate refID for docType, clone to avoid dublication (vehicle)
						me._renderItemData(ul, typeClone)
					)        
			)  	
		widget=@
		@element.data("autocomplete")._renderMenu = (ul, docTypes) ->
			me = @; currentCategoryID = "";
			emCategories.forEach((catItem,i) -> # bėgam per kategorijas
				#Ref 1-Nuotraukos,2-Įvykio dok, 3-Vairuotojo dok, 4-TP dok, 0-Nepriskirti
				if (catItem.ref==0) then return
				else if (catItem.ref==1) then me._renderItemData(ul,{id:0,label:"Nuotrauka",value:"Nuotrauka",categoryID:1,refID:categoryOpts.accident.iD});
				else if (catItem.ref==3 and categoryOpts.driver) then renderGroup(me,ul,[categoryOpts.driver],docTypes,catItem.iD)
				else if (catItem.ref==4 and categoryOpts.vehicles) then renderGroup(me,ul,categoryOpts.vehicles,docTypes,catItem.iD)
				else if (catItem.ref==2 and categoryOpts.accident) then renderGroup(me,ul,[categoryOpts.accident],docTypes,catItem.iD)
			)
			if categoryOpts.editList
				#$( "<li class='ui-autocomplete-category editCategories'><a >Redaguoti sąrašą</a></li>" ).appendTo(ul)
				me._renderItemData(ul, {
				id:(target)-> widget.options.editList(widget.options),
				label:"Redaguoti sarašą",value:"Redaguoti sarašą"})
				ul.find("li:last a").addClass("actionLink")
				
#####Gridai######
$.widget "my.sortableGrid",
	# options:
		# controller: 0
	_create: ->
		@ctrl=@options.controller
		@element[0].innerHTML="<table class='zebra-striped'><thead></thead><tbody></tbody><table>"
		@updateGrid(true); false
	updateGrid:(updateAll)->
		f=@ctrl.fields;cont=@ctrl.content;el=@element;
		len=f.length; last=len-1; 
		#console.error "notSameNo"  if len isnt Object.keys(cont[0]).length	
		if updateAll
			el.find('thead')[0].innerHTML=@_getHead(f,last)
			@_appendHandler()
		el.find('tbody')[0].innerHTML=@_getBody(f,cont)
		false
	_getHead: (f,last) ->	
		thead = "<tr>"
		f.forEach((col, i)->
			if col.visible
				thead += "<th data-name='"; thead += col.name; thead +="'>";
				thead += col.title; thead += ((if i isnt last then "</th>" else "</th><tr>"))
		)
		thead
	_getBody: (f,cont) ->
		tbody = ""; last=0; f.forEach((v,i)->if v.visible then last=i;)
		cont.forEach((row)->
			tbody += "<tr><td>"
			f.forEach((col, i) ->
				if col.visible
					tbody += row[col.name]; tbody += ((if i isnt last then "</td><td>" else "</td></tr>"))
			)
		)
		tbody
	_appendHandler: () ->
		span='<span class="ui-icon ui-icon-carat-2-n-s ui-tblHead-icon"></span>'
		newClass=""; me=@; ctrl=@ctrl
		n="ui-icon-carat-1-n"
		s="ui-icon-carat-1-s"
		ns="ui-icon-carat-2-n-s"
		base="ui-icon ui-tblHead-icon"
		
		thead=@element.find("thead").find("th").addClass("clickable").append(span).end().on("click","th",(e) ->
			#alert($(this).text()+" "+$(this).index());
			t = $(@); thisSpan = t.find("span");thisClass = thisSpan.attr("class")
			if thisClass.indexOf(n) > -1 then newClass = s #desc
			else newClass = n #ns -Nerūšiuota or s -asc
			thisSpan.attr("class", newClass+" "+base)
			t.siblings().find("span").attr("class", ns+" "+base)
			if newClass is n then ctrl.set("sortAscending",true) else ctrl.set("sortAscending", false)
			ctrl.set("sortProperties", [t.data("name")]); newContent=ctrl.get("arrangedContent")
			ctrl.set("content", newContent)
			Em.run.next(me,()-> @updateGrid(false))
		)
		sortCols=ctrl.get("sortProperties")
		if sortCols.length>0
			cl=if ctrl.sortAscending then n else s
			thead.find("th").filter("[data-name='"+sortCols[0]+"']").find("span").attr("class",cl+" "+base);#Jei bus daugiau nei viena reiks ciklo
		false
	_setOption: (key, value) ->
        @options[ key ] = value;
        @_update();
	destroy: () ->
        #this.element.removeClass( "progressbar" ).text( "" );
        $.Widget.prototype.destroy.call(@);
