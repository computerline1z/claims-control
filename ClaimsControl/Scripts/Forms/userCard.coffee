
`var w=window, App=w.App, Em=w.Em, oGLOBAL=w.oGLOBAL, oDATA=w.oDATA, oCONTROLS=w.oCONTROLS, MY=w.MY`
# App.adminStart=()->
	# oDATA.execWhenLoaded(["tblUsers","tblAccount"], ()->
		# App.usersController.set("content",oDATA.GET("tblUsers").emData)	
		# App.accountController.set("content",oDATA.GET("tblAccount").emData)
	# )
App.TabUserCardView = Em.View.extend( #App.mainMenuView.extend(
# App.TabUserCardView = App.mainMenuView.extend(
	# init:()->
		# @_super(); ctrl=App.userCardController
		# ctrl.id=if ctrl.myInfo then oDATA.GET("userData").emData[0].userID else "iš konteksto????????????"
		# ctrl.content.pushObject(oDATA.GET("tblUsers").emData.findProperty("iD",ctrl.id))
	didInsertElement: ->
		@_super(); $("#userInfoTab").tabs(); frm=$("#InfoDataForm"); ctrl=App.userCardController;
		if ctrl.content.length then frm.data("ctrl",{NewRec:0,id:ctrl.content[0].iD,Source:"tblUsers"}) else frm.data("ctrl",{NewRec:1,id:0,Source:"tblUsers"})#Updatinant to reikia
		oCONTROLS.UpdatableForm(frm)
		#if App.userCardController.SaveOk then me=$("#savePasswordNote"); me.html("Naujas slaptažodis išsaugotas"); setTimeout((->me.html("")),2000); App.userCardController.SaveOk=null
		SaveOk=App.userCardController.SaveOk 
		if SaveOk then $("#savePasswordNote").html(SaveOk).show().delay(2000).fadeOut(); SaveOk=null

	templateName: 'tmpUserCard'#, viewIx: -1
	#controller: App.userCardController
	controllerBinding: "App.userCardController"
	changeMyPassword:()->
		App.router.transitionTo('tabChangePass') # paleidžiam ChangeUserPassView
		# MY.changePass.remove() if MY.changePass
		# $("#tabAdmin").children().hide()
		# MY.changePass = App.ChangeUserPassView.create()
		# MY.changePass.appendTo("#tabAdmin");
	
	sendUserPasswordForm:()->
		App.userCardController.set("passwordReset",true)
	sendUserPassword:(e)->
		SERVER.update3(pars:{email:App.userCardController.content[0].email},ctrl:$(e.target).parent(),CallBack:((resp)->
			if (resp.ErrorMsg) then $("#savePasswordNote").html("Nepavyko išsiųsti, klaida: "+resp.ErrorMsg).show().delay(2000).fadeOut();
			else $("#savePasswordNote").html(resp.ResponseMsg).show().delay(2000).fadeOut(); 
			App.userCardController.set("passwordReset",false)
		),url:'/Account/RecoverPassword2')		
	emailText:()->
		alert "Laiško tekstas"
	cancelSendUserPassword:()->
		App.userCardController.set("passwordReset",false)
	saveUserCard:()-> 
		frm=$("#InfoDataForm"); DataToSave = oCONTROLS.ValidateForm(frm);
		#Msg= Title: "Mano informacijos redagavimas", Success: "Duomenys pakeisti.", Error: "Nepavyko pakeisti duomenų."
		Action=if frm.data("ctrl").NewRec then "Add" else "Edit"
		if (DataToSave)
			opt = Action: Action, DataToSave: DataToSave, row:App.userCardController.content[0],source:"tblUsers",Ctrl:frm#,Msg: Msg,
			CallBackAfter:(Row,Action)->
				name=Row.firstName+" "+Row.surname; if name!=oDATA.GET("userData").emData[0].userName then oDATA.GET("userData").emData[0].userName=name; $("#userLink").html(name)
				if Action=="Add" then @.setUser(myInfo:false,User:Row); App.router.transitionTo('tabUserCard');
			SERVER.update2(opt)
	saveUserRights:()-> alert("saveUserRights")
	goToAdminTab: ()->
		App.router.transitionTo('tabAdmin'); false
)
App.userCardController = Em.ArrayController.create(
	init:()->
		console.log("init")
	setUser:(p)->
		@.set("myInfo",(if p.myInfo then true else false)).set("passwordReset",false)
		if @content.length then @content.removeAt(0)
		if p.myInfo then id=p.User=oDATA.GET("userData").emData[0].userID; p.User=oDATA.GET("tblUsers").emData.findProperty("iD",id) #Mano kortelė
		if p.User then @content.pushObject(p.User)
	myInfo: true #Jei bus useris prieitas per Admin tai false
	passwordReset:false
	content:[]
	addNewUser: (e)->
		@.setUser(myInfo:false)
		App.router.transitionTo('tabUserCard'); false
	editUser: (e)->
		@.setUser(myInfo:false,User:e.view._context)
		App.router.transitionTo('tabUserCard'); false
)
App.ChangeUserPassView = Em.View.extend(
	saveNewPass: ->
		t=@.$(); oldPass=t.find("input:eq(0)"); newPass=t.find("input:gt(0)")
		$.validity.start()
		oldPass.require("Įveskite esamą slaptažodį");
		newPass.require("Įveskite naują slaptažodį").minLength(3,'Įveskite ne mažiau 3 raidžių').match("textOrNumber");
		#newPass.equal("Nesutampa su viršutiniu"); nifiga neveikia šitas šūdas
		newPsw=$.trim(newPass.eq(0).val());newPsw2=$.trim(newPass.eq(1).val());oldPsw=$.trim(oldPass.val())
		ok=()->newPsw==newPsw2
		newPass.assert(ok,"Nesutampa slaptažodžiai");
		if $.validity.end().valid
			SERVER.update3(pars:{OldPassword:oldPsw,NewPassword:newPsw,UserId:0},CallBack:((resp)->
				if (resp.ErrorMsg) then $("#changePaswordError").html(resp.ErrorMsg) 
				else App.userCardController.set("SaveOk",resp.ResponseMsg); App.router.transitionTo('tabUserCard'); false
				console.log(resp)
			),url:'/Account/NewPassword2')
	cancelNewPass: ->
		App.router.transitionTo('tabUserCard'); false
	templateName: 'tmpChangeUsrPass'
)

# App.usersController = Em.ArrayController.create(
	# tableName: "tblUsers"
	# content: []
	# modifyUsers: (pars)->
		# pars=$.extend(pars, objData: "tblUsers",CallBackAfter: ((RowData,opt) ->
			# inputs=$("#divDialogForm").find("div.ExtendIt input"); name=$(inputs[0]); surname=$(inputs[1]); mail=$(inputs[2]);
			# if opt.Action=="Add" or mail.data("ctrl").Value!=mail.val
				# msg="Vartotojui '<b>"+name.val()+" "+ surname.val()+"</b>' bus išsiųstas pranešimas susikurti prisijungimo prie sistemos slaptažodį e-paštu <b>"+mail.val()+"</b>. Bet kuriuo metu galite pakeisti e-paštą, tokiu atveju bus siunčiamas naujas pranešimas, o prieš tai buvęs slaptažodis nustos galioti."		
				# title=if opt.Action=="Add" then "Sukurtas naujas vartotojas" else "Pakeistas e-paštas"
				# oCONTROLS.dialog.Alert( title:title,msg:msg)
			# )
		# )
		# new oGLOBAL.clsEditableForm(pars)
		# # CallBackAfter: (RowData,opt) -> #Ikisam naujas val i newval, o teksta i inputa
			# # if (opt.pars.controller=="topNewController")#Šitas nesiriša su kitais, todėl reik updatint ir pagrindinį
				# # oDATA.GET(opt.pars.source).emData.findProperty("iD",RowData.iD).updateTo(RowData)
	# addNewUser: (e)->
		# # pars=$(e.target).parent().data("ctrl")#{"source":"proc_Drivers","controller":"topNewController","emObject":"drivers"}
		# # $.extend(pars,row:0,Action:"Add",me:@,CallBackAfter:(Row)->)
		# # @set("endDate","");@set("editItem",false);@openItem(pars)	
		# @modifyUsers(Action:"Add",aRowData:0)
	# editUser: (e)->
		# @modifyUsers(Action:"Edit",aRowData:e.view._context)
		# #tr=$(e.target).closest('tr')
		# # context=e.view._context
		# # pars=$(e.target).closest("table").next().data("ctrl")
		# # pars=if(pars) then pars else @current #{"source":"proc_Drivers","controller":"topNewController","emObject":"drivers"}
		# # $.extend(pars,row:context,Action:"Edit",me:@)
		# # endDate=if pars.emObject=="drivers" then pars.row.endDate else pars.row.endDate
		# # @set("endDate",endDate);@set("editItem",true);@openItem(pars)
# )