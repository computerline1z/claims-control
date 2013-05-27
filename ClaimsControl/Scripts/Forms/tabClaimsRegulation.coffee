
`var w=window, App=w.App, Em=w.Em, oGLOBAL=w.oGLOBAL, oDATA=w.oDATA, oCONTROLS=w.oCONTROLS, MY=w.MY`
# App.claimsStart=()->
	# oDATA.execWhenLoaded(["tblClaims"], ()->
		# App.claimsController.set("content",oDATA.GET("tblClaims").emData)	
	# )
App.tabClaimsRegulationController = Em.ArrayController.create(
	stepsCont1: ['<a href="#">Parenkite ir siųskite</a><div>arba</div><a href="#">Užregistruokite</a>','<a href="#">Patvirtinti, kad visa informacija yra pateikta</a>','<a href="#">Patvirtinti #### Lt kaip galutinę žalos sumą</a>','<a href="#">Patvirtinti #### Lt kaip galutinę išmokos sumą</a>','<a href="#">Uždaryti bylą</a>']
	stepsCont2: ['Draudikui pranešta ####','Visa informacija pateikta:</br>####</br><a href="#">Atšaukti</a>','Patvirtinta galutinė žalos suma: #### Lt</br><a href="#">Atšaukti</a>','Patvirtinta galutinė išmokos suma: #### Lt</br><a href="#">Atšaukti</a>','Byla uždaryta <a href="#"></br>Atidaryti</a>']
	stepsConfirm: ['','<p>Įveskite paskutinio dokumento pateikimo datą:</p><input class="date" type="text" value="####"><button class="btn btn-small">Patvirtinti</button>','<p>Galutinė žalos dydžio suma - #### Lt.</p><button class="btn btn-small">Patvirtinti</button>','<p>Galutinė išmokos dydžio suma - #### Lt</p><button class="btn btn-small">Patvirtinti</button>','']
	stepVal:[]
	stepsTemp: [{stepNo:1,name:'Pranešimas draudikui'},{stepNo:2,name:'Informacija draudikui'},{stepNo:3,name:'Žalos suma'},{stepNo:4,name:'Draudimo išmoka'},{stepNo:5,name:'Bylos uždarymas'}]
	fnSetContent: (isCurrent,idx)->
		content=if isCurrent then @stepsCont1 else @stepsCont2
		@claim.steps[idx].set('content', content[idx].replace('####',@stepVal[idx]))
	setSteps: ->
		claim=@claim; today=oGLOBAL.date.getTodayString(); @.set('stepVal',[today,today,claim.lossAmount,claim.insuranceClaimAmount,''])
		sTemp=@stepsTemp;s1=@stepsCont1;s2=@stepsCont2; sConfirm=@stepsConfirm; s=[];sVal=@stepVal; 
		reached=false#if claim.claimStatus then false else true		
		#stepsEm=Em.Object.create(step:null,stepNo:null,name:null,content:'')
		fnGetContent=(cnt,idx)->cnt[idx].replace("####",sVal[idx])
		sTemp.forEach((item) -> 
			step=$.extend({},item); idx=item.stepNo-1
			if claim.claimStatus+1==step.stepNo 
				step.step='current'; reached=true;
				step.content=fnGetContent(s1,idx)
				#step.alert=true#jei vėluoja dadedam alertą
			else
				if reached then step.step='pending'
				else
					step.step='completed';
					step.content=if claim.claimStatus==step.stepNo then fnGetContent(s2,idx) else fnGetContent(s2,idx).replace('<a href="#">Atšaukti</a>','') #CONTENT: pending:"",current:stepsCont1,completed:stepsCont2
			#item.content=s1[item.stepNo-1]
			s.pushObject(Em.Object.create(step))
		)	
		claim.steps=s
		# console.log('------------------logging claims-------------------'); console.log(@claim)
	fnStepForward: (idx)-> #
		s=@claim.steps; stepVal=@stepVal; newStepNo=idx+1
		s[idx].set('step','completed'); s[idx].set('content',@stepsCont2[idx].replace('####',stepVal[idx]))
		if s.length!=newStepNo
			s[newStepNo].set('step','current'); s[idx+1].set('content',@stepsCont1[newStepNo].replace('####',stepVal[newStepNo]))
		if idx-1>0
			newHtml=@stepsCont2[idx-1].replace('####',stepVal[idx-1]).replace('<a href="#">Atšaukti</a>','')
			s[idx-1].set('content',newHtml)
		dF=Data:[newStepNo],Fields:['claimStatus']
		if newStepNo==1 then dF.Fields.push("DateNotification"); dF.Data.push(stepVal[idx])
		else if newStepNo==2 then dF.Fields.push("DateDocsSent"); dF.Data.push(stepVal[idx])
		else if newStepNo==3 then dF.Fields.push("LossAmount"); dF.Data.push(stepVal[idx])
		else if newStepNo==4 then dF.Fields.push("InsuranceClaimAmount"); dF.Data.push(stepVal[idx])
		@fnSaveData(dF)
	fnConfirm: (stepBox,idx)->
		newHtml='<div class="step-box-addon"><div class="inner">'+(@stepsConfirm[idx].replace("####",@stepVal[idx]))+'</div></div>'	
		$(newHtml).appendTo(stepBox).hide().slideDown('slow',->$(@).css('overflow','visible'))
	fnStepBack: (idx)-> 
		s=@claim.steps
		s[idx].set('step','current'); s[idx].set('content',@stepsCont1[idx].replace('####',@stepVal[idx]))
		if idx+1<5
			s[idx+1].set('step','pending'); s[idx+1].set('content','')
		if idx-1>0
			s[idx-1].set('content',@stepsCont2[idx-1].replace('####',@stepVal[idx-1]))
		dF=Data:[idx],Fields:['claimStatus']
		@fnSaveData(dF)
	fnSaveData: (dataAndFields)->
		DataToSave=$.extend({"id":@claim.iD,"DataTable":"tblClaims"},dataAndFields)
		#DataToSave={"id":@claim.iD,"Data":[groupID,docTypeID,desc],"Fields":["groupID","docTypeID","description"],"DataTable":"tblClaims"}
		SERVER.update2(Action:'Edit',DataToSave:DataToSave,Ctrl:$("#claimsSteps"),source:"tblClaims",row:@claim,CallBackAfter:(Row)-> console.log(Row))		
)	
App.ActionMainView = Em.View.extend(
	viewName:"actionMain",
	templateName: 'tmpActionMain',
	controller: App.actionViewController
)
App.actionViewController = Em.ObjectController.create(
	parentView:{},#ref to App.TabClaimsRegulationView
	#wrapperView:{},
	#wrapperView:App.ActionWrapperView,
	#childView:App.Action_createEmail,
	init: -> 
		#@.set('userData',oDATA.GET("userData").emData[0])
		#me=@
		#oDATA.execWhenLoaded(["userData"], ()->console.log(me); me.set('userData',oDATA.GET("userData").emData[0]))
	title:"",childViewName:"", userData:{}
	goToOtherView: (e) -> 
		p=$(e.target).data("ctrl")
		@.set("title",p.title).set("childViewName","view_"+p.view);
		@parentView.set("actionView",@view_wrapper).rerender()
		Em.run.next(->
			#$("#claimsFromField").find("div.ExtendIt").data("ctrl").Value=oDATA.GET("userData").emData[0].userID
			$("#contentOfClaimReg").find("div.row").find("div.ExtendIt:first").data("ctrl").Value=oDATA.GET("userData").emData[0].userID
			
			#$("#claims-from-input").data("ctrl").Value=oDATA.GET("userData").emData[0].userID;#pagal nutylejima esamas useris
			oCONTROLS.UpdatableForm(frm:"#contentOfClaimReg")
		)
	saveForm: (e) ->
		alert("saveForm")
	cancelForm: (e) ->
		@parentView.set("actionView",App.ActionMainView).rerender()
	view_wrapper: Em.View.extend(
		#cia savo kontrollerio nesimato, matosi tik pats view'as kaip view
		init: -> 
			@_super(); ctrl=App.actionViewController;
			@set("childView",@[ctrl.childViewName]).set("title",ctrl.title)
		childView:{},childViewName:""#controller will set
		viewName:"actionWrapper",
		templateName: 'tmpActionWrapper',
		view_sendEmail: Em.View.extend(
			viewName:"action_sendEmail", templateName: 'tmpAction_sendEmail'
		),
		view_addEmail: Em.View.extend(
			viewName:"action_addEmail", templateName: 'tmpAction_addEmail'
		),
		view_meeting: Em.View.extend(
			viewName:"action_meeting", templateName: 'tmpAction_meeting'
		),
		view_note: Em.View.extend(
			viewName:"action_note", templateName: 'tmpAction_note'
		),
		view_phone: Em.View.extend(
			viewName:"action_phone", templateName: 'tmpAction_phone'
		),
		view_task: Em.View.extend(
			viewName:"action_task", templateName: 'tmpAction_task'
		),
		view_addCompensation: Em.View.extend(
			viewName:"addCompensation", templateName: 'tmpAddCompensation'
		),
		view_addInsuranceBenefit: Em.View.extend(
			viewName:"addInsuranceBenefit", templateName: 'tmpAddInsuranceBenefit'
		),
		view_addInvoice: Em.View.extend(
			viewName:"addInvoice", templateName: 'tmpAddInvoice'
		),
		view_addPropReport: Em.View.extend(
			viewName:"addPropReport", templateName: 'tmpAddPropReport'
		)
	)
)
App.TabClaimsRegulationView = Ember.View.extend(App.HidePreviousWindow,
	viewName:"tabClaimsRegulation",
	previuosWindow: '#divClaimsList'
	thisWindow: '#divClaimRegulation'
	init: -> 
		@_super(); @controller.setSteps()
		App.actionViewController.set("parentView",@)
		#$('#tabClaims').removeClass("colmask")
	actionView: App.ActionMainView,
	templateName: 'tmpClaimRegulation'
	didInsertElement: ()->
		#------------------step boxes-----------------------------------------------------------
		@_super(); me=@; idx=0; ctrl=me.controller;stepBox={}; 
		@.$().find("#claimsSteps").on('click','a',(e)->#Patvirtinimo iškvietimas arba atšaukimas
			stepBox=$(@).closest("div.step-box"); classes=stepBox.attr("class"); stepNo=stepBox.data("stepno") #current completed pending
			idx=stepNo-1; steps=ctrl.claim.steps
			if classes.indexOf("completed")>0 #Atšaukimas
				ctrl.fnStepBack(idx)
			else if classes.indexOf("current")>0#Patvirtinimas
				if stepNo==1 then ctrl.fnStepForward(idx); 
				else if stepNo==5
					ctrl.fnStepForward(idx);
				else
					# span=stepBox.find("span.value")
					# input=if span.length then span.html() else oGLOBAL.date.getTodayString()
					ctrl.fnConfirm(stepBox,idx)
					if stepNo==2 then Em.run.next(@,->stepBox.find("input.date").ValidateOnBlur(Allow:'Date').datepicker();) #Informacija draudikui įdedam data

			false
		).on('click','button',(e)->#Patvirtinimas
			if idx==1 then stepVal=stepBox.find("input.date").val();ctrl.stepVal[idx]=stepVal
			ctrl.fnStepForward(idx);
			stepBox.find("div.step-box-addon").slideUp('slow').remove()
			false
		)
		#------------------actions tabs-----------------------------------------------------------
		$("#claimRegulationTab").tabs().on( "tabsactivate", (event, ui) ->
			if (ui.newTab.index()==1) then console.log("first")
		)
	#contentBinding: 'App.claimsRegulationController.content'
	#controller: 'App.claimsRegulationController'
	controller:App.tabClaimsRegulationController
)

###
MY.tabAccidents={}
MY.tabAccidents.SelectedClaimView = App.SelectedClaimView.create(
	rowContext: { Claims2: d.Claims2, newClaim: false, LossAmount: d.loss, InsuranceType: d.type, accidentID: d.accidentID, accidentDate: d.accidentDate }
	elementId: "ClaimDetailsContent", contentBinding: 'App.claimEditController.content'
)
tr.addClass("selectedClaim title").after("<tr><td id='ClaimWraper' colspan='7' class='selectedClaim content'></td></tr>");
MY.tabAccidents.SelectedClaimView.appendTo("#ClaimWraper");
tr = $(e.target).closest("tr");ClaimW = $("#ClaimWraper")
if (ClaimW.length > 0)
	MY.tabAccidents.SelectedClaimView.remove()
	ClaimW.remove();
###