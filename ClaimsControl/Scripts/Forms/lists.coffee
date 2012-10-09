
`var w=window, App=w.App, Em=w.Em, oGLOBAL=w.oGLOBAL, oDATA=w.oDATA, oCONTROLS=w.oCONTROLS, MY=w.MY`
App.listsStart=()->
	#outerHeight() innerHeight()
	#$(window).height();   // returns height of browser viewport
	#$(document).height(); // returns height of HTML document
	#LeftHeight=$(window).height()-$("#divlogindisplay").outerHeight()-$("#ulMainMenu").outerHeight()-$("#tabLists h3:first").outerHeight()
	#LeftHeight-=($("#tabLists h3:first").outerHeight()+$("#topNewDrivers").outerHeight())*3
	#totalRows=Math.floor(LeftHeight/31)
	
	oDATA.fnLoad(url: "Main/topNew", callBack: -> #url:url, callBack:callBack
		#proc_topDrivers,proc_topVehicles,proc_topInsPolicies
		App.topNewController.vehicles.clear();App.topNewController.drivers.clear();App.topNewController.insPolicies.clear()
		App.topNewController.drivers.pushObjects(oDATA.GET("proc_topDrivers").emData.slice(0,3))	
		App.topNewController.vehicles.pushObjects(oDATA.GET("proc_topVehicles").emData.slice(0,3))
		App.topNewController.insPolicies.pushObjects(oDATA.GET("proc_topInsPolicies").emData.slice(0,3))
	) 
	
	#sortedDrivers = oDATA.GET("proc_Drivers").emData.sort( (a,b)-> return b.get('firstName') - a.get('firstName'))
	
	#App.topNewController.vehicles.pushObjects(oDATA.GET("proc_Vehicles").emData);
	

App.topNewController = Em.ResourceController.create(
	vehicles: [],
	drivers: [],
	insPolicies: [],
	tableName: "?"
)	
App.DriverView = Em.View.extend(
	edit: (e)->
		alert("opa")
		tr=$(e.target).closest('tr')
		id=e.view._context.iD
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
	current: "",#{emObject:drivers/vehicles/insPolicies, filterCols:["fsf","fss"]}
	clicked: "",
	filterValue: "",
	valueDidChange: (()->		
		#alert @filterValue
		@filterItems()
	).observes('filterValue')
	init: -> ( @_super();oDATA.execWhenLoaded(["proc_Vehicles","proc_Drivers","proc_InsPolicies"], ()->
		App.listAllController.set("vehicles",oDATA.GET("proc_Vehicles").emData)
		App.listAllController.set("drivers",oDATA.GET("proc_Drivers").emData)
		App.listAllController.set("insPolicies",oDATA.GET("proc_InsPolicies").emData)
	))
	addNew: (e)->
		pars=$(e.target).parent().data("ctrl")#{"source":"proc_Drivers","controller":"topNewController","emObject":"drivers"}
		new oGLOBAL.clsEditableForm(
			objData: pars.source
			Action: "Add" #(if (id) then "Edit" else "Add")
			#aRowData: (if (id) then oDATA.GetRow(id, Source) else 0)
			CallBackAfter: (RowData) -> #Ikisam naujas val i newval, o teksta i inputa
				RowData.docs='(0)' if RowData.docs!=undefined
				#RowData.set("docs","(0)")
				if pars.controller=="topNewController"
					App[pars.controller][pars.emObject].unshiftObject(RowData)
				#App[pars.controller][pars.emObject].addObject(RowData) visais atvejais listAllController prideda i gala ?reikia perrusiuoti is naujo
		)
	edit: (e)->
		#tr=$(e.target).closest('tr')
		context=e.view._context
		pars=$(e.target).closest("table").next().data("ctrl")
		pars=if(pars) then pars else @current #{"source":"proc_Drivers","controller":"topNewController","emObject":"drivers"}
		#pars=if(@current) then @current else $(e.target).closest("table").next().data("ctrl")#{"source":"proc_Drivers","controller":"topNewController","emObject":"drivers"}
		new oGLOBAL.clsEditableForm(
			pars: pars
			objData: pars.source
			aRowData: context
			Action: "Edit" #(if (id) then "Edit" else "Add")
			CallBackAfter: (RowData,opt) -> #Ikisam naujas val i newval, o teksta i inputa
				#data=if (opt.pars.controller=="topNewController") then App[opt.pars.controller][opt.pars.emObject] else App[opt.pars.controller]["content"]
				#data.findProperty("iD",RowData.iD).updateTo(RowData)
				if (opt.pars.controller=="topNewController")#Šitas nesiriša su kitais, todėl reik updatint ir pagrindinį
					oDATA.GET(opt.pars.source).emData.findProperty("iD",RowData.iD).updateTo(RowData)
		)
	filterByField: ()->#jei yra filterValue grazina true jei ten randa, jei ne grazina true visada
		fn=if not @filterValue then "return true;" else "var ret=false,cols="+JSON.stringify(this.current.filterCols)+
		";console.log('Filtering by val:"+@filterValue+"'); for(var i=0; i < cols.length; i++){console.log(row[cols[i]]+', '+(row[cols[i]].toLowerCase().indexOf('"+@filterValue+"')>-1));
		if (row[cols[i]].toLowerCase().indexOf('"+@filterValue+"')>-1){ret=true; break;}} console.log('filterByval rez: '+ret);return ret;"
		new Function("row",fn)
	filterByTab: ()->
		if @current.emObject=="drivers"
			mark=if (@clicked=="NotWorking") then "!" else "";
			fn="var ret=true; if ($.trim(row.dateEnd)) {ret=oGLOBAL.date.firstBigger(row.dateEnd);} console.log('dateEnd: '+row.dateEnd+', '+ret);return "+mark+"ret"
		else if @current.emObject=="vehicles"
			mark=if (@clicked=="NotWorking") then "!" else "";
			fn="var ret=true; if ($.trim(row.endDate)) {ret=oGLOBAL.date.firstBigger(row.endDate);} console.log('endDate: '+row.endDate+', '+ret);return "+mark+"ret"
		else
			throw new Error("filterByTab has no such emObject")
		new Function("row",fn)
	filterItems: ()->
		if @current.emObject=="insPolicies"
			fn=(row)=>(v=@filterByField()(row); console.log("finalRez: "+v); row.set('visible',v);)	
		else
			fn=(row)=>(v=(if (@filterByTab()(row)) then (@filterByField()(row)) else false;); console.log("finalRez: "+v); row.set('visible',v);)			
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
	edit: (e)->
		alert("opa")
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


#console.log "App.listAllController.vehicles:" + App.listAllController.vehicles

MY.lists={}