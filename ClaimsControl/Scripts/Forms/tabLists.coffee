
`var w=window, App=w.App, Em=w.Em, oGLOBAL=w.oGLOBAL, oDATA=w.oDATA, oCONTROLS=w.oCONTROLS, MY=w.MY;`
DOCSVIEW={}
App.listsStart=()->
	ctrl=App.topNewController
	ctrl.set('drivers',oDATA.GET("proc_topDrivers").emData)	
	ctrl.set('vehicles',oDATA.GET("proc_topVehicles").emData)	
	ctrl.set('insPolicies',oDATA.GET("proc_topInsPolicies").emData)	
	oDATA.execWhenLoaded(["proc_Vehicles","proc_Drivers","proc_InsPolicies"], ()->
		ctrl=App.listAllController
		ctrl.set("vehicles",oDATA.GET("proc_Vehicles").emData)
		ctrl.set("drivers",oDATA.GET("proc_Drivers").emData)
		ctrl.set("insPolicies",oDATA.GET("proc_InsPolicies").emData)
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
	deleteForm:(e)->
		console.log(e)
		pars=e.view._parentView.pars; oData=oDATA.GET(pars.source); Msg=oData.Config.Msg; row=pars.row
		oCONTROLS.dialog.Confirm({title:"",msg:"Ištrinti "+Msg.GenNameWhat+" '"+row.MapArrToString(oData.Config.titleFields, true)+"'?"},->
			SERVER.update2(Action:"Delete", DataToSave:{ id:row.iD, DataTable: oData.Config.tblUpdate },"Ctrl":$("#tabLists"),"source":pars.source,"row":row,CallBackAfter:(Row)->
				App.topNewController[pars.emObject].removeObject(row);App.listAllController.content.removeObject(row);oDataTop=oDATA.GET(pars.source.replace("_","_top")).emData;r=oDataTop.findProperty("iD",row.iD);oDataTop.removeObject(r)
				$("#openItemDialog").dialog("close")
			)
		)
	saveForm:(e,opts)-> #opts:{Alert:true, pars:pars, execOnSuccess:fn}
		pars=(if opts then opts.pars else e.view._parentView.pars); Alert=(if opts then opts.Alert else null); execOnSuccess=(if opts then opts.execOnSuccess else null) #pars=if pars then pars else e.view._parentView.pars;	
		DataToSave=oCONTROLS.ValidateForm($("#dialogContent"))
		if DataToSave
			# $("input[type=file]").show().focus().trigger("click");  //veikia - atsidaro pasirinkimas
			# console.log("clicked ->");console.log($("input[type=file]")); 
			# $("#dialoguploadDocsContainer").find("form").show().focus().fileupload('add');	
			$.extend(pars,{DataToSave:DataToSave,Ctrl:$("#tabLists"),CallBackAfter:(row)-> #t.p. 189 eilutė
				if pars.Action=='Add'
					#App.listAllController.content.unshiftObject(row); 
					#if App.topNewController[pars.emObject] then App.topNewController[pars.emObject].unshiftObject(row)
				if pars.input then pars.input.data("newval",row.iD); pars.input.autocomplete("option").fnRefresh(); pars.input.data("autocomplete").fnItemChanged(row.iD)
				if row.iD then $("#tabLists").find("div.ui-tabs").find("li.ui-tabs-selected a").trigger("click")#trigerinam, kad pagal tabus uzdėtų visible		
				if pars.CallBackFromComboBox then pars.CallBackFromComboBox(row)
				if execOnSuccess then execOnSuccess(row) #Neuždarom, nes dabar paruošiam prikabinimui
				else $("#openItemDialog").dialog("close")	
				false
			})
			SERVER.update2(pars); false
		else if Alert then oCONTROLS.dialog.Alert( title:'Įšsaugojimas',msg:'Užpildykite pažymėtus laukus..')
		else $("#openItemDialog").dialog("close")
		#else $("#openItemDialog").dialog("close");
	cancelForm:(e)-> $("#openItemDialog").dialog("close");false
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
			legend: source.Config.Msg.ListName
			title: "Redaguoti sąrašą"
			msg: source.Config.Msg
			addNewMsg: "Pridėti naują"#+source.Config.Msg.GenNameWhat.firstSmall()
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
				item=e.context.name;input=$(e.target).closest('.js').find('input');val=input.val();row=e.context;row.name=val
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
				input=$(e.target).closest('.js').find('input');val=input.val()
				Msg=Title:@title,Success:@msg.GenName+" '"+val+"' pridėtas.",Error:@msg.GenNameWhat+" '"+val+"' nepavyko pridėti." 
				@saveData({DataToSave:{"Data":[val],"Fields":["Name"],"DataTable":tblUpdate},Msg:Msg,row:[val],Action:"Add"})
			closeDialog: (e)-> $("#"+@dialogID).dialog("close"); false
			width:600
			templateName: 'tmpEditItems'
		).append();		
	openItem:(pars)->#source,template,row
		if pars.row.iD then @set('deleteButton',true) else @set('deleteButton',false)
		@.set("dateIsEdited",false) #nuresetinam datų redagavimą, kad nerodytų	

		config=oDATA.GET(pars.source).Config
		title=if pars.row then config.Msg.GenName+": "+pars.row.MapArrToString(config.titleFields,(if pars.template=="tmp_Drivers" then true else false)) else config.Msg.AddNew
		if not pars.row and pars.newVals then pars.row=pars.newVals.vals.toRowObject(pars.newVals.cols) #ivedimo forma užpildom jau užpildytais iš langelio 
		MY.dialog=JQ.Dialog.create( #MY.dialog needed to destroyElement in ui-ember.js
			controllerBinding: "App.listAllController"
			thisController: @, pars: pars
			init: -> 
				@_super(); @templateName=pars.template; @title=title; @pars=pars# pars inputas reikalingas - pagal jį aukštį nusistatom
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
			makeAttach: (ref)->
				dialogFrm=$("#openItemDialog"); categoryOpts=false;docGroups=oDATA.GET("tblDocGroup").emData			
				if ref
					groupID=docGroups.findProperty("ref",ref).iD					
					if ref==4
						name="TP "+pars.row.make+", "+pars.row.model+", "+pars.row.plate+" dokumentai"
						categoryOpts=showCategories:[iD:groupID,ref:ref,name:name],vehicles:[{iD:pars.row.iD,title:name}]
					if ref==3
						name="Vairuotojo '"+pars.row.firstName+" "+pars.row.lastName+"' dokumentai"
						categoryOpts={showCategories:[iD:groupID,ref:ref,name:name],driver:{iD:pars.row.iD,title:name}}#Įrašom kurias kategorijas rodyt ir tos kategorijos duomenis
					#Ref 1-Nuotraukos,2-Įvykio dok, 3-Vairuotojo dok, 4-TP dok, 0-Nepriskirti
					dialogFrm.find("div.uploadDocsContainer").UploadFiles(categoryOpts: categoryOpts,docsController:"dialogDocController",requireCategory:true)
					#Atrenkam dokumentus kuriuos reiks parodyti
					refID=pars.row.iD					
					App.dialogDocController.setDocs(refID,groupID) #Jau uploadintų dokumentų kontroleris
					if not $.isEmptyObject(DOCSVIEW) then DOCSVIEW.remove(); DOCSVIEW.destroy() #make sure nothing left there
					DOCSVIEW=Em.View.create(
						opts: null #opcijos
						templateName: "tmpDocsView"
						tagName: "ul"
						classNames: ["gallery", "ui-helper-reset", "ui-helper-clearfix"]
						controller: App.dialogDocController
						didInsertElement: ->
							@_super()
							this.$().data("opts",@opts)
					).appendTo "#dialoguploadDocsContainer"	#Pridedam jau uploadintų dokumentų view'ą				
				else console.warn('no ref')
			didInsertElement: ()->
				@_super(); dialogContent=$("#dialogContent");ref=0; thisDialog=@
				if pars.emObject=="vehicles" or pars.source=="proc_Vehicles" then ref=4
				else if pars.emObject=="drivers" or pars.source=="proc_Drivers" then ref=3				
				if (pars.row.iD)# skriopke rodom tik redagavimui
					@makeAttach(ref)
				else
					title=if ref==4 then "tr. priemonę" else "vairuotoją"
					$('<div class="row fileupload-buttonbar" style="padding:10px 0 20px 40px;"><center><i class="img16-attach"></i><a href="#" class="fileinput-button">Išsaugoti naują '+title+' ir prisegti dokumentus</a></center></div>')
						.appendTo("#dialoguploadDocsContainer").find('a').on("click", (e)->
							e.preventDefault(); formOpts=dialogContent.data('ctrl'); #me=e.data.me;
							if dialogContent.length#If dialog then check before download
								thisDialog.thisController.saveForm(null, Alert:true, pars:pars, execOnSuccess:(row)->
									oCONTROLS.UpdatableForm_toSaved(row.iD, dialogContent);pars.row=row;
									$("#dialoguploadDocsContainer").empty(); Em.run.next(()-> 
										thisDialog.makeAttach(ref)
										# Em.run.next(()-> 
											# $("input[type=file]").show().focus().trigger("click"); 
											# console.log("clicked ->");console.log($("input[type=file]")); 
											# $("#dialoguploadDocsContainer").find("form").show().focus().fileupload('add');		 										
										# )		 						
									)						
								)
								# SERVER.update2(Action:'Add',DataToSave:DataToSave,Ctrl:dialogContent,source:formOpts.Source,CallBackAfter:(row)-> #pagr 58 eilutė
									# oCONTROLS.UpdatableForm_toSaved(row.iD, dialogContent)
									# App.listAllController.content.unshiftObject(row); topControler=App.topNewController[pars.emObject]; if topControler then topControler.unshiftObject(row)
									# $("#tabLists").find("div.ui-tabs").find("li.ui-tabs-selected a").trigger("click")#trigerinam, kad pagal tabus uzdėtų visible						
									# pars.row=row;
									# $("#dialoguploadDocsContainer").empty(); Em.run.next(()-> thisDialog.makeAttach(ref))
								# )
						)
					#$("#dialoguploadDocsContainer").remove()#jei nėra iD pašalinam skriopke
				# $("#btnSaveItem").on("click",()->
				# )
				#$("#aCancelItem").on("click",()-> dialogFrm.dialog("close");false)
				if @templateName=="tmp_InsPolicies" then @$().tabs().css("margin","-5px 1px 0 1px")
				oCONTROLS.UpdatableForm(frm:dialogContent,row:pars.row,btnSaveToDisable:dialogContent.next().find("button.btnSave"))
			width:700
			# buttons:
				# "Išsaugoti pakeitimus": ()-> alert("Išsaugoti")
				# "Atšaukti": ()-> $(this).dialog("close")
			templateName: 'dialog-content'	
		).append()		
	# prepareEdit: ()->
		# @prepareEdit=true
	addNew: (e)->
		pars=$(e.target).parent().data("ctrl")#{"source":"proc_Drivers","controller":"topNewController","emObject":"drivers"}
		console.log("addNew");
		console.log(pars);
		$.extend(pars,row:0,Action:"Add",me:@,CallBackAfter:(Row)->)
		@set("endDate","");@set("editItem",false);@openItem(pars)	
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
		@openItem(pars)
	filterByField: ()->#jei yra filterValue grazina true jei ten randa, jei ne grazina true visada
		fn=if not @filterValue then "return true;" else "var ret=false,cols="+JSON.stringify(this.current.filterCols)+
		";console.log('Filtering by val:"+@filterValue+"'); 
		for(var i=0; i < cols.length; i++){      
			if (row[cols[i]]==null){
				ret=false; break;
			}else{
				console.log(row[cols[i]]); console.log(row[cols[i]].toLowerCase().indexOf('"+@filterValue+"')>-1);
				if (row[cols[i]].toLowerCase().indexOf('"+@filterValue+"')>-1){ret=true; break;}
			}
		}
		console.log('filterByval rez: '+ret);return ret;"
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
			cols:["firstName","lastName","dateBorn","phone","docs",]
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
		if refID then @refID=refID; @groupID=groupID #else refID=@refID; groupID=@groupID
		
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

	
#MY.tabLists={}
# `//@ sourceURL=/Forms/tabLists.js` siunčiam su bendru