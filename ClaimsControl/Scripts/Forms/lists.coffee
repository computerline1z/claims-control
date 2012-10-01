
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
	init: ()-> ( @_super();oDATA.execWhenLoaded(["proc_Vehicles","proc_Drivers","proc_InsPolicies"], ()->
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
		
		# vehicles: oDATA.GET("proc_Vehicles").emData,
		# drivers: oDATA.GET("proc_Drivers").emData,
		# InsPolicies: oDATA.GET("proc_InsPolicies").emData,

	vehicles: [], drivers: [], insPolicies: [],
	tableName: "?",
	sortProperties: ['firstName']
)	
console.log "App.listAllController.vehicles:" + App.listAllController.vehicles

MY.lists={}