
`var w=window, App=w.App, Em=w.Em, oGLOBAL=w.oGLOBAL, oDATA=w.oDATA, oCONTROLS=w.oCONTROLS, MY=w.MY`
App.listsStart=()->
	#outerHeight() innerHeight()
	#$(window).height();   // returns height of browser viewport
	#$(document).height(); // returns height of HTML document
	#LeftHeight=$(window).height()-$("#divlogindisplay").outerHeight()-$("#ulMainMenu").outerHeight()-$("#tabLists h3:first").outerHeight()
	#LeftHeight-=($("#tabLists h3:first").outerHeight()+$("#topNewDrivers").outerHeight())*3
	#totalRows=Math.floor(LeftHeight/31)
	App.topNewController.vehicles.clear();App.topNewController.drivers.clear();App.topNewController.insPolicies.clear()
	#oDATA.execWhenLoaded(["proc_topDrivers","proc_topVehicles","proc_topInsPolicies"], ()->)
	App.topNewController.drivers.pushObjects(oDATA.GET("proc_topDrivers").emData)#.slice(0,3)	
	App.topNewController.vehicles.pushObjects(oDATA.GET("proc_topVehicles").emData)
	App.topNewController.insPolicies.pushObjects(oDATA.GET("proc_topInsPolicies").emData)	
	
	oDATA.execWhenLoaded(["proc_Vehicles","proc_Drivers","proc_InsPolicies"], ()->
		App.listAllController.set("vehicles",oDATA.GET("proc_Vehicles").emData)
		App.listAllController.set("drivers",oDATA.GET("proc_Drivers").emData)
		App.listAllController.set("insPolicies",oDATA.GET("proc_InsPolicies").emData)
	)
	
App.topNewController = Em.ResourceController.create(
	vehicles: [],
	drivers: [],
	insPolicies: [],
	tableName: "?"
)	
App.DriverView = Em.View.extend(
	templateName: 'tmpDriverRow' #<div class="tr accident" @Html.Raw("{{action tbodyClick this target=\"this\"}}")>
	tagName: ""
)
App.VehicleView = Em.View.extend(
	templateName: 'tmpVehicleRow' #<div class="tr accident" @Html.Raw("{{action tbodyClick this target=\"this\"}}")>
	tagName: ""
)
App.InsPolicyView = Em.View.extend(
	templateName: 'tmpInsPolicyRow' #<div class="tr accident" @Html.Raw("{{action tbodyClick this target=\"this\"}}")>
	tagName: ""
)
App.listAllController = Em.ResourceController.create(
	current:"",#{emObject:drivers/vehicles/insPolicies, filterCols:["fsf","fss"]}
	clicked:"", endDate:"", editItem:"", filterValue: "", addMakeMode:"", VehicleMakes:[],editVehicleMake:false
	valueDidChange: (()->		
		@filterItems()
	).observes('filterValue')
	#init: -> (
		#@_super() #;oDATA.execWhenLoaded(["proc_Vehicles","proc_Drivers","proc_InsPolicies"], ()->
		# App.listAllController.set("vehicles",oDATA.GET("proc_Vehicles").emData)
		# App.listAllController.set("drivers",oDATA.GET("proc_Drivers").emData)
		# App.listAllController.set("insPolicies",oDATA.GET("proc_InsPolicies").emData)
	# ))	
	addVehicleMake:(input, e)-> #formTemplate: "tmpUploadForm", disabled: false, docsController: "TreeDocController", Source: "tblDocTypes"
		#categoryOpts:{accident:{iD:70,title:"Įvykio dokumentai"},driver:{iD:80,title:"Vairuotojo 'Pranas Patv' dokai"},editList:{},vehicles:[{iD,title},{iD,title}]},
		#data:[{categoryID,id,label},{categoryID,id,label},{categoryID,id,label},{categoryID,id,label}]		
		if @VehicleMakes.length==0 then @.set("VehicleMakes",oDATA.GET("tblVehicleMakes").emData)  
		dialogID="dialog"+(+new Date)#kad nesipjautų dialogai
		MY[dialogID]=JQ.Dialog.create( #MY.dialog needed to destroyElement in ui-ember.js	
			input: input
			dialogID: dialogID
			title:"Transporto priemonių markės"
			saveData:(p)->#Msg,DataToSave,Action,row
				Source=App.listAllController.VehicleMakes; me=@
				$.extend(p,"Ctrl":$("#"+@dialogID),"source":"tblVehicleMakes", CallBackAfter:(Row)->
					if p.Action=="Edit" then Source.findProperty("iD", Row.iD).set("edit",false) #redagavimas
					if p.Action=="Add" then MY[me.dialogID].set(("addVehicleMake"),false)
					me.input.autocomplete("option").fnRefresh()
				)	
				SERVER.update2(p);false
			editVehicleMake: (e)-> e.context.set("edit",e.context.name) 
			cancelVehicleMake: (e)-> e.context.set("edit",false)
			saveVehicleMake: (e)->
				make=e.context.name;input=$(e.target).prev();val=input.val();row=e.context;row.name=val
				if make.length>0						
					Msg={Title:@title,Success:"TP markė '"+make+"' pakeista.",Error:"Nepavyko pakeisti '"+make+"' markės."}
					@saveData({DataToSave:{"id":row.iD,"Data":[row.name],"Fields":["Name"],"DataTable":"tblVehicleMakes"},Msg:Msg,row:row,Action:"Edit"})
				else 
					e.context.set("name",e.context.edit).set("edit",false)
			deleteVehicleMake: (e)->
				make=e.context.name; me=@
				oCONTROLS.dialog.Confirm(title:@title,msg:"Ištrinti markę '"+make+"'?", ()->					
					Msg={Title:me.title,Success:"TP markė '"+make+"' ištrinta.",Error:"Nepavyko ištrinti markės '"+make+"'."}; row=e.context				
					me.saveData({DataToSave:{"id":row.iD,"DataTable":"tblVehicleMakes"},Msg:Msg,row:row,Action:"Delete"})
				)
			addNewVehicleMake: (e)-> @.set("addItem",true)
			cancelNewVehicleMake: (e)-> @.set("addItem",false)				
			saveNewVehicleMake: (e)-> 
				input=$(e.target).prev();val=input.val();
				Msg=Title:@title2,Success:"Dokumento tipas '"+val+"' pridėtas.",Error:"Nepavyko pridėt tipo '"+val+"'"
				@saveData({DataToSave:{"Data":[val],"Fields":["Name"],"DataTable":"tblVehicleMakes"},Msg:Msg,row:[val],Action:"Add"})
			closeDialog: (e)-> $("#"+@dialogID).dialog("close"); false
			width:600
			templateName: 'tmpVehicleMakes'
		).append();
	editListItems:(input, e)-> #formTemplate: "tmpUploadForm", disabled: false, docsController: "TreeDocController", Source: "tblDocTypes"
		#categoryOpts:{accident:{iD:70,title:"Įvykio dokumentai"},driver:{iD:80,title:"Vairuotojo 'Pranas Patv' dokai"},editList:{},vehicles:[{iD,title},{iD,title}]},
		#data:[{categoryID,id,label},{categoryID,id,label},{categoryID,id,label},{categoryID,id,label}]		
		sourceName=input.data("ctrl").Source
		tblUpdate=if input.data("ctrl").tblUpdate then input.data("ctrl").tblUpdate else sourceName
		source=oDATA.GET(sourceName)
		@.set("listItems",source.emData.removeObject(source.emData.findProperty("iD",0)))  		
		dialogID="dialog"+(+new Date)#kad nesipjautų dialogai
		MY[dialogID]=JQ.Dialog.create( #MY.dialog needed to destroyElement in ui-ember.js	
			input: input
			dialogID: dialogID
			title: source.Config.Msg.ListName
			msg: source.Config.Msg
			addNewMsg: "Pridėti naują "+source.Config.Msg.GenNameWhat.firstSmall()
			saveData:(p)->#Msg,DataToSave,Action,row
				Source=App.listAllController.listItems; me=@
				$.extend(p,"Ctrl":$("#"+@dialogID),"source":sourceName, 
				CallBackAfter:(Row)->
					if p.Action=="Edit" then Source.findProperty("iD", Row.iD).set("edit",false) #redagavimas
					if p.Action=="Add" then MY[me.dialogID].set(("addItem"),false)
					me.input.autocomplete("option").fnRefresh()
				)	
				SERVER.update2(p);false
			editItem: (e)-> e.context.set("edit",e.context.name) 
			cancelItem: (e)-> e.context.set("edit",false)
			saveItem: (e)->
				### reikia žiūrėt ###
				item=e.context.name;input=$(e.target).prev();val=input.val();row=e.context;row.name=val
				if item.length>0						
					Msg={Title:@title,Success:@msg.GenName+" '"+item+"' pakeista(s).",Error: @msg.GenNameWhat + " '"+item+"' nepavyko pakeisti.."}	
					@saveData({DataToSave:{"id":row.iD,"Data":[row.name],"Fields":["Name"],"DataTable":tblUpdate},Msg:Msg,row:row,Action:"Edit"})
				else 
					e.context.set("name",e.context.edit).set("edit",false)
			deleteItem: (e)->
				item=e.context.name; me=@
				oCONTROLS.dialog.Confirm(title:@title,msg:me.msg.Delete+" '"+item+"'?", ()->					
					Msg=Title:me.title, Success:me.msg.GenName+" '"+item+"' ištrinta(s).", Error:me.msg.GenNameWhat+" '"+item+"' nepavyko ištrinti."; row=e.context
					me.saveData({DataToSave:{"id":row.iD,"DataTable":tblUpdate},Msg:Msg,row:row,Action:"Delete"})
				)
			addNewItem: (e)-> @.set("addItem",true)
			cancelNewItem: (e)-> @.set("addItem",false)				
			saveNewItem: (e)-> 
				input=$(e.target).prev();val=input.val()
				Msg=Title:@title,Success:@msg.GenName+" '"+val+"' pridėtas.",Error:@msg.GenNameWhat+" '"+val+"' nepavyko pridėti." 
				@saveData({DataToSave:{"Data":[val],"Fields":["Name"],"DataTable":tblUpdate},Msg:Msg,row:[val],Action:"Add"})
			closeDialog: (e)-> $("#"+@dialogID).dialog("close"); false
			width:600
			templateName: 'tmpEditItems'
		).append();		
	openItem:(pars)->#source,template,row
		@.set("dateIsEdited",false) #nuresetinam datų redagavimą, kad nerodytų	
		if not App.docsTypesController then App.create_docsTypesController() #reikalingas sarašam parodyt ir redaguot

		config=oDATA.GET(pars.source).Config
		title=if pars.row then config.Msg.GenName+": "+pars.row.MapArrToString(config.titleFields,(if pars.template=="tmp_Drivers" then true else false)) else config.Msg.AddNew
		if not pars.row and pars.newVals then pars.row=pars.newVals.vals.toRowObject(pars.newVals.cols) #ivedimo forma užpildom jau užpildytais iš langelio 
		if MY.dialog then MY.dialog.remove()
		Em.run.next(@, -> MY.dialog=JQ.Dialog.create( #MY.dialog needed to destroyElement in ui-ember.js
			controllerBinding: "App.listAllController"
			controller: pars.me, pars: pars
			init: -> 
				@_super(); @templateName=pars.template; @title=title; @pars=pars# pars inputas reikalingas - pagal jį aukštį nusistatom
			# cancelAddNewMake:()-> App.listAllController.set("addMakeMode",false)
			# saveAddNewMake:(e)-> 
				# div=$(e.target).parent(); newVal=div.prev().find("input").val(); ctrl=$(e.target).parent().parent()
				# autoComplete=div.next().next().find("input")
				# if newVal
					# SERVER.update2("Action":"Add","Ctrl":ctrl,"source":"tblVehicleMakes","row":"",#įvedant naują markę nereikia row (nes jos ir nėra)
					# DataToSave:{"Data":[newVal],"Fields":["Name"],"DataTable":"tblVehicleMakes"},
					# CallBackAfter:(Row)-> 
						# autoComplete.autocomplete("option").fnRefresh()
						# console.log Row #$("#tabLists").find("div.ui-tabs").find("li.ui-tabs-selected a").trigger("click")#trigerinam, kad pagal tabus uzdėtų visible	
					# )	
				# App.listAllController.set("addMakeMode",false)
			goToEditDate:()->
				App.listAllController.set("dateIsEdited",true); 
				Em.run.next(@,->$("#dialogEndDateInput").datepicker({"minDate":"-3y","maxDate":"0"}).trigger("focus"))
			saveDate:()->
				newDate=$(event.target).parent().parent().find("input").val()
				if not oGLOBAL.date.isDate(newDate) then newDate=""
				obj=$("#dialogContent").data("ctrl")
				SERVER.update2("Action":"Edit","Ctrl":$("#openItemDialog"),"source":obj.Source,"row":@pars.row,
				DataToSave:{"id":obj.id,"Data":[newDate],"Fields":["EndDate"],"DataTable":obj.tblUpdate},
				CallBackAfter:(Row)->$("#tabLists").find("div.ui-tabs").find("li.ui-tabs-selected a").trigger("click")#trigerinam, kad pagal tabus uzdėtų visible	
				)						
				console.log("išsaugoti "+newDate)			
				@pars.me.endDate=newDate#kitaip keikiasi dėl metamorpho				
				App.listAllController.set("dateIsEdited",false).set("endDate",newDate)
				#Jei išsaugom data ja įrašom i endDate
			didInsertElement: ()->
				@_super();dialogFrm=$("#openItemDialog");dialogContent=$("#dialogContent")
				if (pars.row)
					categoryOpts=false;docGroups=oDATA.GET("tblDocGroup").emData;me=@; ref=0			
					if pars.emObject=="vehicles" or pars.source=="proc_Vehicles" then ref=4
					else if pars.emObject=="drivers" or pars.source=="proc_Drivers" then ref=3
					if ref
						groupID=docGroups.findProperty("ref",ref).iD					
						if ref==4
							name="TP "+pars.row.make+", "+pars.row.model+", "+pars.row.plate+" dokumentai"
							categoryOpts=showCategories:[iD:groupID,ref:ref,name:name],vehicles:[{iD:pars.row.iD,title:name}]
						if ref==3
							name="Vairuotojo '"+pars.row.firstName+" "+pars.row.lastName+"' dokumentai"
							categoryOpts={showCategories:[iD:groupID,ref:ref,name:name],driver:{iD:pars.row.iD,title:name}}#Įrašom kurias kategorijas rodyt ir tos kategorijos duomenis
						#Ref 1-Nuotraukos,2-Įvykio dok, 3-Vairuotojo dok, 4-TP dok, 0-Nepriskirti
						dialogFrm.find("div.uploadDocsContainer").UploadFiles(categoryOpts: categoryOpts,showPhoto:false,docsController:"dialogDocController",requireCategory:true)
						#Atrenkam dokumentus kuriuos reiks parodyti
						refID=pars.row.iD					
						App.dialogDocController.setDocs(refID,groupID)
						this.removeOnCloseView=Em.View.create(docsViewOpts).appendTo "#dialoguploadDocsContainer" #docsViewOpts	#Pridedam dokumentų uploadinimo view'ą					
				$("#btnSaveItem").on("click",()->
					DataToSave=oCONTROLS.ValidateForm(dialogContent)
					$.extend(pars,DataToSave:DataToSave,Ctrl:$("#tabLists"),CallBackAfter:(Row)->
						dialogFrm.dialog("close");
						if Row.iD
							if (pars.input) then pars.input.data("newval",Row.iD).autocomplete("option").fnRefresh()							
							#pars.input.val(Row.MapArrToString(pars.input.data("ctrl").iText))
							#App[pars.controller][pars.emObject].findProperty("iD",Row.iD).set("docs","(0)")#Dokumentų skaičius priklausis nuo uploadintų doku						
							else $("#tabLists").find("div.ui-tabs").find("li.ui-tabs-selected a").trigger("click")#trigerinam, kad pagal tabus uzdėtų visible						
					)
					SERVER.update2(pars); false
				)
				$("#aCancelItem").on("click",()-> dialogFrm.dialog("close");false)
				if @templateName=="tmp_InsPolicies" then @$().tabs().css("margin","-5px 1px 0 1px").find("ul").css("background-color","#505860")
				oCONTROLS.UpdatableForm(dialogContent,pars.row)
			width:700
			# buttons:
				# "Išsaugoti pakeitimus": ()-> alert("Išsaugoti")
				# "Atšaukti": ()-> $(this).dialog("close")
			templateName: 'dialog-content'	
		).append();)		
	# prepareEdit: ()->
		# @prepareEdit=true
	addNew: (e)->
		pars=$(e.target).parent().data("ctrl")#{"source":"proc_Drivers","controller":"topNewController","emObject":"drivers"}
		console.log("addNew");
		console.log(pars);
		$.extend(pars,row:0,Action:"Add",me:@,CallBackAfter:(Row)->)
		@set("endDate","");@set("editItem",false);@openItem(pars)	
		# new oGLOBAL.clsEditableForm(
			# objData: pars.source
			# Action: "Add" #(if (id) then "Edit" else "Add")
			# #aRowData: (if (id) then oDATA.GetRow(id, Source) else 0)
			# CallBackAfter: (RowData) -> #Ikisam naujas val i newval, o teksta i inputa
				# RowData.docs='(0)' if RowData.docs!=undefined
				# #RowData.set("docs","(0)")
				# if pars.controller=="topNewController"
					# App[pars.controller][pars.emObject].unshiftObject(RowData)
				# #App[pars.controller][pars.emObject].addObject(RowData) visais atvejais listAllController prideda i gala ?reikia perrusiuoti is naujo
		# )
	edit: (e)->
		#tr=$(e.target).closest('tr')
		console.log "edit"
		console.log e.target
		console.log e.view._context
		context=e.view._context
		pars=$(e.target).closest("table").next().data("ctrl")
		pars=if(pars) then pars else @current #{"source":"proc_Drivers","controller":"topNewController","emObject":"drivers"}
		$.extend(pars,row:context,Action:"Edit",me:@)
		endDate=if pars.row.endDate then pars.row.endDate else ""
		@set("endDate",endDate);@set("editItem",true);
		console.log "going to open items"; @openItem(pars)
		
		# new oGLOBAL.clsEditableForm(
			# pars: pars
			# objData: pars.source
			# aRowData: context
			# Action: "Edit" #(if (id) then "Edit" else "Add")
			# CallBackAfter: (RowData,opt) -> #Ikisam naujas val i newval, o teksta i inputa
				# #data=if (opt.pars.controller=="topNewController") then App[opt.pars.controller][opt.pars.emObject] else App[opt.pars.controller]["content"]
				# #data.findProperty("iD",RowData.iD).updateTo(RowData)
				# if (opt.pars.controller=="topNewController")#Šitas nesiriša su kitais, todėl reik updatint ir pagrindinį
					# oDATA.GET(opt.pars.source).emData.findProperty("iD",RowData.iD).updateTo(RowData)
		# )
	filterByField: ()->#jei yra filterValue grazina true jei ten randa, jei ne grazina true visada
		fn=if not @filterValue then "return true;" else "var ret=false,cols="+JSON.stringify(this.current.filterCols)+
		";console.log('Filtering by val:"+@filterValue+"'); for(var i=0; i < cols.length; i++){console.log(row[cols[i]]+', '+(row[cols[i]].toLowerCase().indexOf('"+@filterValue+"')>-1));
		if (row[cols[i]].toLowerCase().indexOf('"+@filterValue+"')>-1){ret=true; break;}} console.log('filterByval rez: '+ret);return ret;"
		new Function("row",fn)
	filterByTab: ()->
		if @current.emObject=="drivers"
			mark=if (@clicked=="NotWorking") then "!" else "";
			fn="var ret=true; if ($.trim(row.endDate)) {ret=oGLOBAL.date.firstBigger(row.endDate);} console.log('endDate: '+row.endDate+', '+ret);return "+mark+"ret"
		else if @current.emObject=="vehicles"
			mark=if (@clicked=="NotWorking") then "!" else "";
			fn="var ret=true; if ($.trim(row.endDate)) {ret=oGLOBAL.date.firstBigger(row.endDate);} console.log('endDate: '+row.endDate+', '+ret);return "+mark+"ret"
		else
			throw new Error("filterByTab has no such emObject")
		new Function("row",fn)
	filterItems: ()->
		if @current.emObject=="insPolicies"
			fn=(row)=>(v=@filterByField()(row); row.set('visible',v);)	#console.log("finalRez: "+v); 
		else
			fn=(row)=>(v=(if (@filterByTab()(row)) then (@filterByField()(row)) else false;); row.set('visible',v);)	#console.log("finalRez: "+v);		
		App.listAllController[@current.emObject].forEach(fn)
	showTabs: (e)->
		t=$(e.target); t.closest("ul").find("li").removeClass("ui-tabs-selected ui-state-active"); t.closest("li").addClass("ui-tabs-selected ui-state-active")
	filterWorking: (e)-> @set("clicked","Working"); @showTabs(e); @filterItems()
	filterNotWorking: (e)-> @set("clicked","NotWorking"); @showTabs(e); @filterItems()
		# vehicles: oDATA.GET("proc_Vehicles").emData,
		# drivers: oDATA.GET("proc_Drivers").emData,
		# InsPolicies: oDATA.GET("proc_InsPolicies").emData,

	vehicles: [], drivers: [], insPolicies: [],
	tableName: "?"
)	
App.TopListsView = App.mainMenuView.extend(
	templateName: 'tmpListsTop', viewIx: 4
)
App.AllDriversView = App.mainMenuView.extend(
	init: ->
		@_super();App.listAllController.set("content",oDATA.GET("proc_Drivers").emData)
	templateName: 'tmpAllDrivers', viewIx: 4
	didInsertElement: ()->
		@_super(); view=$("#tabLists"); view.find("div.ui-tabs").find("li:first a").trigger("click")
		view.find("table.zebra-striped").tblSortable(
			cols:["firstName","lastName","dateExpierence","drivingCategory","phone","docs",]
			controller: "listAllController", sortedCol: 1 
		);
)
App.AllInsPoliciesView = App.mainMenuView.extend(
	init: ->
		@_super();App.listAllController.set("content",oDATA.GET("proc_InsPolicies").emData)
	templateName: 'tmpAllInsPolicies', viewIx: 4
	didInsertElement: ()->
		$("#tabLists").find("table.zebra-striped").tblSortable(
			cols:["claimType","insurerName","policyNumber","endDate","isuredName"]
			controller: "listAllController", sortedCol: 0 
		);
)
App.AllVehiclesView = App.mainMenuView.extend(
	init: ->
		@_super();App.listAllController.set("content",oDATA.GET("proc_Vehicles").emData)
	templateName: 'tmpAllVehicles', viewIx: 4
	didInsertElement: ()->
		@_super(); view=$("#tabLists"); view.find("div.ui-tabs").find("li:first a").trigger("click")
		view.find("table.zebra-striped").tblSortable(
			cols:["plate","type","make","model","year","docs",]
			controller: "listAllController", sortedCol: 0 
		);
)
#Dokummentų rodymo Tp/driverio dialoge controller'is, dar žemiau opcjos view'o (dokumentų rodymo)
App.dialogDocController = Em.ResourceController.create(
	refID:null, groupID:null, docs:[]
	refreshDocs: () -> @setDocs(@refID,@groupID)
	setDocs: (refID,groupID) ->
		#currentDocs.forEach (doc) -> console.log "iD: " + doc.iD + ", docName: " + doc.docName + ", docTypeID:" + doc.docTypeID + ", groupID:" + doc.groupID	
		if refID then @refID=refID; @groupID=groupID else refID=@refID; groupID=@groupID
		
		docsPath=oDATA.GET("userData").emData[0].docsPath; url="Uploads/"+docsPath; users=oDATA.GET("tblUsers").emData; docTypes=oDATA.GET("tblDocTypes").emData	
		fnGetIcon=(ext) -> ext=ext.slice(0,3); return "img32-doc_" + (if ext=="xls"||ext=="doc"||ext=="pdf" then ext else "unknown" )
		fnGetUser=((userID) -> u=users.find((user)->user.iD==userID); u.firstName+" "+u.surname;)		
		fnGetDocType = (typeID)-> docTypes.find((type)->type.iD==typeID).name			
		docs=oDATA.GET("tblDocs").emData.filter((doc)->(doc.refID==refID and doc.groupID==groupID)).map((doc)-> 
			user=fnGetUser(doc.userID);file="/"+doc.iD+"."+doc.fileType
			Em.Object.create(
				docID:doc.iD,
				hasThumb:doc.hasThumb, urlThumb:url+"/Thumbs"+file, urlDoc:url+file,docType:fnGetDocType(doc.docTypeID),description:doc.description,
				docName:doc.docName,userName:user,fileDate:doc.fileDate,fileName:doc.docName+"."+doc.fileType
				fileIcon: if not doc.hasThumb then fnGetIcon(doc.fileType) else "img32-doc_unknown"
				docDetails: "Įkėlė "+user+" "+doc.fileDate+", dydis - "+Math.ceil(doc.fileSize/10000)/100+"Mb"
			)
		)
		@.set("docs",docs)
)
docsViewOpts= #Listų dokumentų opcijos
	opts: null #opcijos
	templateName: "tmpDocsView"
	tagName: "ul"
	classNames: ["gallery", "ui-helper-reset", "ui-helper-clearfix"]
	controller: App.dialogDocController
	didInsertElement: ->
		@_super()
		this.$().data("opts",@opts)

	
#MY.tabLists={}
# `//@ sourceURL=/Forms/tabLists.js` siunčiam su bendru