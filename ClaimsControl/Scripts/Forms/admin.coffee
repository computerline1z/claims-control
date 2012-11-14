
`var w=window, App=w.App, Em=w.Em, oGLOBAL=w.oGLOBAL, oDATA=w.oDATA, oCONTROLS=w.oCONTROLS, MY=w.MY`
console.log("loading admin1")
App.adminStart=()->
	oDATA.execWhenLoaded(["tblUsers","tblAccount"], ()->
		App.usersController.set("content",oDATA.GET("tblUsers").emData)
		App.accountController.set("content",oDATA.GET("tblAccount").emData)
	) #if not App.usersController
console.log("loading admin2")

App.AdminView = App.mainMenuView.extend(
	didInsertElement: ->
		#c=this.content[0] neturi	
		@_super();
		frm='#AccountForm'
		oCONTROLS.UpdatableForm(frm)
	templateName: 'tmpAdminMain', viewIx: 5
)

App.UsersRowView = Em.View.extend(
	templateName: 'tmpUserRow'
	tagName: ""
	##fullName: ()-> (@.get('firstName')+' '+@.get('surname')).property('firstName','surname')
)
console.log("loading admin3")
console.log(oDATA.GET("tblAccount").emData)

App.accountController = Em.ArrayController.create(
	tableName: "tblAccount"
	content: []
	# init: ->
		# console.log("loading in init admin4")
		# console.log(oDATA.GET("tblAccount").emData)
		# @_super();
		# App.accountController.set("content",oDATA.GET("tblAccount").emData)
)
console.log("loading admin4")

App.usersController = Em.ArrayController.create(
	tableName: "tblUsers"
	content: []
)
console.log("loading admin5")

MY.admin={}
`//@ sourceURL= /Forms/admin.js`