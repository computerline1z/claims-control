
`var w=window, App=w.App, Em=w.Em, oGLOBAL=w.oGLOBAL, oDATA=w.oDATA, oCONTROLS=w.oCONTROLS, MY=w.MY`
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
		oCONTROLS.UpdatableForm(frm)
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
		Msg= Title: "Paskyros redagavimas", Success: "Paskyros duomenys pakeisti.", Error: "Nepavyko pakeisti paskyros duomenų."
		$(frm).data("ctrl").id=App.accountController.content[0].iD
		DataToSave = oCONTROLS.ValidateForm(frm)
		if (DataToSave)
			opt = Action: Action, DataToSave: DataToSave, row:App.accountController.content[0],source:"tblAccount",Ctrl:frm,Msg: Msg
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
	modifyUsers: (pars)->
		pars=$.extend(pars, objData: "tblUsers",CallBackAfter: ((RowData,opt) ->
			inputs=$("#divDialogForm").find("div.ExtendIt input"); name=$(inputs[0]); surname=$(inputs[1]); mail=$(inputs[2]);
			if opt.Action=="Add" or mail.data("ctrl").Value!=mail.val
				msg="Vartotojui '<b>"+name.val()+" "+ surname.val()+"</b>' bus išsiųstas pranešimas susikurti prisijungimo prie sistemos slaptažodį e-paštu <b>"+mail.val()+"</b>. Bet kuriuo metu galite pakeisti e-paštą, tokiu atveju bus siunčiamas naujas pranešimas, o prieš tai buvęs nustos galioti."		
				title=if opt.Action=="Add" then "Sukurtas naujas vartotojas" else "Pakeistas e-paštas"
				oCONTROLS.dialog.Alert( title:title,msg:msg)
			)
		)
		new oGLOBAL.clsEditableForm(pars)
		# CallBackAfter: (RowData,opt) -> #Ikisam naujas val i newval, o teksta i inputa
			# if (opt.pars.controller=="topNewController")#Šitas nesiriša su kitais, todėl reik updatint ir pagrindinį
				# oDATA.GET(opt.pars.source).emData.findProperty("iD",RowData.iD).updateTo(RowData)
	addNewUser: (e)->
		# pars=$(e.target).parent().data("ctrl")#{"source":"proc_Drivers","controller":"topNewController","emObject":"drivers"}
		# $.extend(pars,row:0,Action:"Add",me:@,CallBackAfter:(Row)->)
		# @set("endDate","");@set("editItem",false);@openItem(pars)	
		@modifyUsers(Action:"Add",aRowData:0)
	editUser: (e)->
		@modifyUsers(Action:"Edit",aRowData:e.view._context)
		#tr=$(e.target).closest('tr')
		# context=e.view._context
		# pars=$(e.target).closest("table").next().data("ctrl")
		# pars=if(pars) then pars else @current #{"source":"proc_Drivers","controller":"topNewController","emObject":"drivers"}
		# $.extend(pars,row:context,Action:"Edit",me:@)
		# endDate=if pars.emObject=="drivers" then pars.row.endDate else pars.row.endDate
		# @set("endDate",endDate);@set("editItem",true);@openItem(pars)
)
MY.tabAdmin={}
`//@ sourceURL= /Forms/tabAdmin.js`