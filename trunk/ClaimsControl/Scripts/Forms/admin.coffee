
`var w=window, App=w.App, Em=w.Em, oGLOBAL=w.oGLOBAL, oDATA=w.oDATA, oCONTROLS=w.oCONTROLS, MY=w.MY`
App.AdminView = App.mainMenuView.extend(
	templateName: 'tmpListsTop', viewIx: 4
)

App.UsersRowView = Em.View.extend(
	templateName: 'tmpInsPolicyRow' #<div class="tr accident" @Html.Raw("{{action tbodyClick this target=\"this\"}}")>
	tagName: ""
)
App.listAllController = Em.ResourceController.create(
	current:"",#{emObject:drivers/vehicles/insPolicies, filterCols:["fsf","fss"]}
	clicked:"", endDate:"", editItem:"", filterValue: ""
	valueDidChange: (()->		
		#alert @filterValue
		@filterItems()
	).observes('filterValue')
	init: -> ( @_super();oDATA.execWhenLoaded(["proc_Vehicles","proc_Drivers","proc_InsPolicies"], ()->
		App.listAllController.set("vehicles",oDATA.GET("proc_Vehicles").emData)
		App.listAllController.set("drivers",oDATA.GET("proc_Drivers").emData)
		App.listAllController.set("insPolicies",oDATA.GET("proc_InsPolicies").emData)
	))
	vehicles: [], drivers: [], insPolicies: [],
	tableName: "?"
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
MY.lists={}