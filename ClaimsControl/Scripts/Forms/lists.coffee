
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
		App.topNewController.vehicles.clear();App.topNewController.drivers.clear();App.topNewController.InsPolicies.clear()
		App.topNewController.drivers.pushObjects(oDATA.GET("proc_topDrivers").emData.slice(0,3))	
		App.topNewController.vehicles.pushObjects(oDATA.GET("proc_topVehicles").emData.slice(0,3))
		App.topNewController.InsPolicies.pushObjects(oDATA.GET("proc_topInsPolicies").emData.slice(0,3))
	) 
	
	#sortedDrivers = oDATA.GET("proc_Drivers").emData.sort( (a,b)-> return b.get('firstName') - a.get('firstName'))
	
	#App.topNewController.vehicles.pushObjects(oDATA.GET("proc_Vehicles").emData);
	

App.topNewController = Em.ResourceController.create(
	vehicles: [],
	drivers: [],
	InsPolicies: [],
	tableName: "?",
	sortProperties: ['firstName']
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
MY.lists={}