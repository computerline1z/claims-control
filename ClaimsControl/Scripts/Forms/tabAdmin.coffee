
`var w=window, App=w.App, Em=w.Em, oGLOBAL=w.oGLOBAL, oDATA=w.oDATA, oCONTROLS=w.oCONTROLS, MY=w.MY;`
App.adminStart=()->
	oDATA.execWhenLoaded(["tblUsers","tblAccount"], ()->
		App.usersController.set("content",oDATA.GET("tblUsers").emData)	
		App.accountController.set("content",oDATA.GET("tblAccount").emData)
	)
App.TabAdminView = App.mainMenuView.extend(
	didInsertElement: ->
		#c=this.content[0] neturi	
		@_super();
		frm='#AccountForm'
		oCONTROLS.UpdatableForm(frm:frm,btnSaveToDisable:$(frm).find("button.btnSave"))
	templateName: 'tmpAdminMain', viewIx: 5
)
App.UsersRowView = Em.View.extend(
	templateName: 'tmpUserRow'
	tagName: ""
	##fullName: ()-> (@.get('firstName')+' '+@.get('surname')).property('firstName','surname')
)
App.accountController = Em.ArrayController.create(
	tableName: "tblAccount"
	content: []
	SaveChanges: (e) ->
		console.log(e);
		frm=$('#AccountForm'); Action='Edit'
		#Msg= Title: "Paskyros redagavimas", Success: "Paskyros duomenys pakeisti.", Error: "Nepavyko pakeisti paskyros duomenų."
		$(frm).data("ctrl").id=App.accountController.content[0].iD
		DataToSave = oCONTROLS.ValidateForm(frm)
		if (DataToSave)
			opt = Action: Action, DataToSave: DataToSave, row:App.accountController.content[0],source:"tblAccount",Ctrl:frm,CallBackAfter:((Row,Action,resp)->$("#accountName").html(Row.name))#Msg: Msg
			SERVER.update2(opt)			
			#update2: function (p){
			#nereikia callbacko, updatina jsonObj, todėl papildomai reikia "source"(oDATA pavadinimas) ir "row" //oDATA.GET("proc_Vehicles").emData
			#SERVER.update2({"Action":Action,DataToSave:{},"Ctrl":Ctrl,"source":source,"row":row
	deleteAccount: (e) ->
		title="Paskyros naikinimas"
		oCONTROLS.dialog.Confirm(title:title,msg:"Ištrinti šią paskyrą?", ()->oCONTROLS.dialog.Alert( title:title,msg:"Negaliu ištrinti šitos paskyros.."))
)
App.usersController = Em.ArrayController.create(
	tableName: "tblUsers"
	content: []
)
MY.tabAdmin={}
`//@ sourceURL= /Forms/tabAdmin.js`