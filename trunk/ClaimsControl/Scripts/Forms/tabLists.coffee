
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
	App.topNewController.drivers.pushObjects(oDATA.GET("proc_topDrivers").emData.slice(0,3))	
	App.topNewController.vehicles.pushObjects(oDATA.GET("proc_topVehicles").emData.slice(0,3))
	App.topNewController.insPolicies.pushObjects(oDATA.GET("proc_topInsPolicies").emData.slice(0,3))	
	
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
	clicked:"", endDate:"", editItem:"", filterValue: "", addMakeMode:""
	valueDidChange: (()->		
		@filterItems()
	).observes('filterValue')
	#init: -> (
		#@_super() #;oDATA.execWhenLoaded(["proc_Vehicles","proc_Drivers","proc_InsPolicies"], ()->
		# App.listAllController.set("vehicles",oDATA.GET("proc_Vehicles").emData)
		# App.listAllController.set("drivers",oDATA.GET("proc_Drivers").emData)
		# App.listAllController.set("insPolicies",oDATA.GET("proc_InsPolicies").emData)
	# ))	
	openItem:(pars)->#source,template,row
		@.set("dateIsEdited",false) #nuresetinam datų redagavimą, kad nerodytų	
		if not App.docsTypesController then App.create_docsTypesController() #reikalingas sarašam parodyt ir redaguot

		config=oDATA.GET(pars.source).Config
		title=if pars.row then config.Msg.GenName+" "+pars.row.MapArrToString(config.titleFields,true) else config.Msg.AddNew
		if not pars.row and pars.newVals then pars.row=pars.newVals.vals.toRowObject(pars.newVals.cols) #ivedimo forma užpildom jau užpildytais iš langelio 
		console.log "JQ.Dialog.create"
		console.log MY.dialog
		if MY.dialog then MY.dialog.remove()
		if MY.dialog then MY.dialog.remove()
		Em.run.next(@, -> MY.dialog=JQ.Dialog.create( #MY.dialog needed to destroyElement in ui-ember.js
			controllerBinding: "App.listAllController"
			controller: pars.me, pars: pars
			init: -> @_super(); console.log "init"; @templateName=pars.template; @title=title
			cancelAddNewMake:()-> App.listAllController.set("addMakeMode",false)
			saveAddNewMake:(e)-> 
				div=$(e.target).parent(); newVal=div.prev().find("input").val(); ctrl=$(e.target).parent().parent()
				autoComplete=div.next().next().find("input")
				if newVal
					SERVER.update2("Action":"Add","Ctrl":ctrl,"source":"tblVehicleMakes","row":"",#įvedant naują markę nereikia row (nes jos ir nėra)
					DataToSave:{"Data":[newVal],"Fields":["Name"],"DataTable":"tblVehicleMakes"},
					CallBackAfter:(Row)-> 
						autoComplete.autocomplete("option").fnRefresh()
						console.log Row #$("#tabLists").find("div.ui-tabs").find("li.ui-tabs-selected a").trigger("click")#trigerinam, kad pagal tabus uzdėtų visible	
					)	
				App.listAllController.set("addMakeMode",false)
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
				categoryOpts=false
				@_super(); dialogFrm=$("#openItemDialog");dialogContent=$("#dialogContent");me=@
				if pars.emObject=="vehicles" or pars.source=="proc_Vehicles"
					name="TP "+pars.row.make+", "+pars.row.model+", "+pars.row.plate+" dokumentai"
					categoryOpts={showCategories:[iD:4,name:name],vehicles:[{iD:pars.row.iD,title:name}]}
				if pars.emObject=="drivers" or pars.source=="proc_Drivers"
					name="Vairuotojo '"+pars.row.firstName+" "+pars.row.lastName+"' dokumentai"
					categoryOpts={showCategories:[iD:3,name:name],driver:{iD:pars.row.iD,title:name}}#Įrašom kurias kategorijas rodyt ir tos kategorijos duomenis
				if categoryOpts
					#Ref 1-Nuotraukos,2-Įvykio dok, 3-Vairuotojo dok, 4-TP dok, 0-Nepriskirti
					dialogFrm.find("div.uploadDocsContainer").UploadFiles(categoryOpts: categoryOpts,showPhoto:false,docsController:"dialogDocController")
					#Atrenkam dokumentus kuriuos reiks parodyti
					refID=pars.row.iD
					groupID=if pars.emObject=="vehicles" then 4 else 3
					App.dialogDocController.setDocs(refID,groupID)
					this.removeOnCloseView=Em.View.create(docsViewOpts).appendTo "#dialoguploadDocsContainer" #docsViewOpts	#Pridedam dokumentų uploadinimo view'ą					
				$("#btnSaveItem").on("click",()->
					DataToSave=oCONTROLS.ValidateForm(dialogContent)
					$.extend(pars,DataToSave:DataToSave,Ctrl:$("#tabLists"),CallBackAfter:(Row)->
						dialogFrm.dialog("close");
						if Row.iD
							App[pars.controller][pars.emObject].findProperty("iD",Row.iD).set("docs","(0)")#Dokumentų skaičius priklausis nuo uploadintų doku						
							$("#tabLists").find("div.ui-tabs").find("li.ui-tabs-selected a").trigger("click")#trigerinam, kad pagal tabus uzdėtų visible						
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
		
		account=oDATA.GET("userData").emData[0].account; url="Uploads/"+account; users=oDATA.GET("tblUsers").emData; docTypes=oDATA.GET("tblDocTypes").emData	
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