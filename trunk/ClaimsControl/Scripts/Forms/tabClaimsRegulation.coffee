
`var w=window, App=w.App, Em=w.Em, oGLOBAL=w.oGLOBAL, oDATA=w.oDATA, oCONTROLS=w.oCONTROLS, MY=w.MY`
# App.claimsRegulationStart=()-> visa tai vyksta tabClaims.coffee - nes jis issaukiamas po paspaudimo
	# oDATA.execWhenLoaded(["proc_Activities","tblActivityTypes","tblUsers"], ()->
		# actTypes=oDATA.GET("tblActivityTypes").emData.map((t)->t.typeID=t.iD; delete t.iD; return t;)
		# me=App.tabClaimsRegulationController
		# me.set("activities",oDATA.GET("proc_Activities").emData).set("activityTypes",actTypes).set("users",oDATA.GET("tblUsers").emData)
		# me.set("ativitiesNotFin",actTypes.filter((a)->not a.isFinances))
	# )
ACTIVITYVIEW={};DOCSVIEW={}
App.tabClaimsRegulationController = Em.ArrayController.create(
	init: -> 
		@_super(); me=@
		# oDATA.execWhenLoaded(["proc_Activities","tblActivityTypes","tblUsers"], ()->
			# actTypes=oDATA.GET("tblActivityTypes").emData.map((t)->t.typeID=t.iD; delete t.iD; return t;)
			# me.set("activities",oDATA.GET("proc_Activities").emData).set("activityTypes",actTypes).set("users",oDATA.GET("tblUsers").emData)
			# me.set("ativitiesNotFin",actTypes.filter((a)->not a.isFinances))
		# )
	stepsCont1: ['<a href="#">Parenkite ir siųskite</a><div>arba</div><a href="#">Užregistruokite</a>','<a href="#">Patvirtinti, kad visa informacija yra pateikta</a>','<a href="#">Patvirtinti #### Lt kaip galutinę žalos sumą</a>','<a href="#">Patvirtinti #### Lt kaip galutinę išmokos sumą</a>','<a href="#">Uždaryti bylą</a>']
	stepsCont2: ['Draudikui pranešta ####','Visa informacija pateikta:</br>####</br><a href="#">Atšaukti</a>','Patvirtinta galutinė žalos suma: #### Lt</br><a href="#">Atšaukti</a>','Patvirtinta galutinė išmokos suma: #### Lt</br><a href="#">Atšaukti</a>','Byla uždaryta <a href="#"></br>Atidaryti</a>']
	stepsConfirm: ['','<p>Įveskite paskutinio dokumento pateikimo datą:</p><input class="date" type="text" value="####"><button class="btn btn-small">Patvirtinti</button>','<p>Galutinė žalos dydžio suma - #### Lt.</p><button class="btn btn-small">Patvirtinti</button>','<p>Galutinė išmokos dydžio suma - #### Lt</p><button class="btn btn-small">Patvirtinti</button>','']
	stepVal:[]
	stepsTemp: [{stepNo:1,name:'Pranešimas draudikui'},{stepNo:2,name:'Informacija draudikui'},{stepNo:3,name:'Žalos suma'},{stepNo:4,name:'Draudimo išmoka'},{stepNo:5,name:'Bylos uždarymas'}]
	fnSetContent: (isCurrent,idx)->
		if not @claim.steps then return; #if not initialized
		content=if isCurrent then @stepsCont1 else @stepsCont2
		@claim.steps[idx].set('content', content[idx].replace('####',@stepVal[idx]))
	setSteps: ->
		claim=@claim; today=oGLOBAL.date.getTodayString(); @.set('stepVal',[today,today,claim.lossAmount,claim.insuranceClaimAmount,''])
		sTemp=@stepsTemp;s1=@stepsCont1;s2=@stepsCont2; sConfirm=@stepsConfirm; s=[];sVal=@stepVal; 
		reached=false#if claim.claimStatus then false else true		
		#stepsEm=Em.Object.create(step:null,stepNo:null,name:null,content:'')
		fnGetContent=(cnt,idx)->cnt[idx].replace("####",sVal[idx])
		sTemp.forEach((item)->  
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
		claim.set('steps',s); @ #return this to process futher
		# console.log('------------------logging claims---------------'); console.log(@claim)
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
		SERVER.update2(Action:'Edit',DataToSave:DataToSave,Ctrl:$("#claimsSteps"),source:"proc_Claims",row:@claim,CallBackAfter:(Row)-> console.log(Row))	
		@fnclaimStatusChanged()
	#--------------------------------activities & finances---------------------------------------------------------------------
	target: (() -> @).property() #view actions with current controler targeted to controller
	damageSum:0,insurerSum:0,compensationSum:0,activitiesTbl:[],finDamageTbl:[],finInsurerTbl:[],finOtherPartyTbl:[]
	fnSum:(arr)->
		sum=0; arr.forEach((item)->sum+=item.amount;); sum.toRound()
	# fnclaimStatusWillChange:(()->	
		# if (@claim) then @claimStatusBefore=@claim.claimStatus;
	# ).observesBefore('claim.claimStatus')	
	fnclaimStatusChanged:(()->
		#After claimStatus is changed updates Accidents with status and sums
		if @claim.claimStatus>2 or @claimStatusBefore>2 #becouse can move backward
			cl=@claim; DataToSave=DataTable:"tblClaims", Ext:cl.accidentID, id:cl.iD, Fields:["ClaimStatus"], Data:[cl.claimStatus]
			if cl.claimStatus==3 then DataToSave.Fields.push("lossAmount"); DataToSave.Data.push(cl.lossAmount)
			if cl.claimStatus==4 then DataToSave.Fields.push("insuranceClaimAmount"); DataToSave.Data.push(cl.insuranceClaimAmount)
			opt= Action: "Edit", DataToSave: DataToSave, CallBack: {Success: App.claimEditController.fnUpdateAccident} 
			SERVER.update(opt)
			@claimStatusBefore=@claim.claimStatus
	)#.observes('claim.claimStatus')	
	finDamageChanged: (()->
		Em.run.next(@,()-> 
			sum=@fnSum(@finDamageTbl); @set('damageSum', sum);
			if @claim.claimStatus<3 #change sum for steps also
				@claim.set("lossAmount",sum); @stepVal[2]=sum
				if @claim.claimStatus==2 then @fnSetContent(true,2) #change sum indicated in step ui also
		)
	).observes('finDamageTbl.@each')
	finInsurerChanged: (()->
		Em.run.next(@,()->
			sum=@fnSum(@finInsurerTbl);	@set('insurerSum', sum);
			if @claim.claimStatus<4 #change sum for steps also
				@claim.set("insuranceClaimAmount",sum); @stepVal[3]=sum
				if @claim.claimStatus==3 then @fnSetContent(true,3) #change sum indicated in step ui also			
		)
	).observes('finInsurerTbl.@each')
	finOtherPartyChanged: (()->
		Em.run.next(@,()-> sum=0; @finOtherPartyTbl.forEach((item)->sum+=item.amount;);@set('compensationSum', sum.toRound());)
	).observes('finOtherPartyTbl.@each')
	# finDamageChanged: (()->
		# alert("activitiesTblChanged")
	# ).observes('activitiesTbl.@each')
	setActivitiesTables: (newDocNo)-> #newDocNo:{ID:??,docNo:??}
		@set("finDamageTbl",[]).set("finInsurerTbl",[]).set("finOtherPartyTbl",[])
		claimID=@claim.iD; console.log("Showing all activities Claim iD: "+claimID)
		activities=@activities# oDATA.GET("proc_Activities").emData
		activityTypes=@activityTypes #oDATA.GET("tblActivityTypes").emData
		if newDocNo then activities.findProperty("iD",newDocNo.iD).set("docs",("("+newDocNo.docNo+")"))
		activities=activities.filter((item)->item.claimID==claimID);
		me=@;activitiesTbl=[];#finIDs=[]; activityTypes.forEach((item) -> if item.isFinances then finIDs.push(item.iD))
		activities.forEach((item) ->
			type=activityTypes.findProperty("typeID",item.typeID)
			activitiesTbl.push(me.fnMapActivitiesRecord(item,type))
			if type.isFinances #item.typeID in finIDs 
				switch type.tmp
					when "tmpAddDamageCA","tmpAddDamageKASKO" then me.finDamageTbl.addObject(me.fnMapDamageRecord(item,type.typeTitle))
					when "tmpAddInsuranceBenefit" then me.finInsurerTbl.addObject(me.fnMapRefundRecord(item))
					when "tmpAddCompensation" then me.finOtherPartyTbl.addObject(me.fnMapRefundRecord(item))
					else console.error('checkTmp in tblActivities')
		)
		me.set("activitiesTbl",activitiesTbl)
	users: null#, TypesKasko: null, TypesCA: null
	fnGetUser:(userID) ->
		u=@users.find((user)->user.iD==userID); u.firstName+" "+u.surname
	fnGetFrom:(acts)->
		switch acts.typeID
			#when 1,2 then console.error('not implemented')#1-sendEmail, 2-addEmail
			when 3,6 then @fnGetUser(acts.fromID) #3-task 6-note
			when 4,5 then acts.fromText #, 4-phone, 5-meeting
	fnGetTo:(acts)->
		switch acts.typeID
			#when 1,2 then console.error('not implemented')#1-sendEmail, 2-addEmail
			when 3 then @fnGetUser(acts.toID) #3-task
			when 4,5 then acts.toText #4-phone, 5-meeting
			#when 6 then "" #6-note
			else ""	
	fnMapDamageRecord: (a,typeTitle)->
		Em.Object.create(
			iD:a.iD
			amount:a.amount
			docType:typeTitle
			subject:a.subject
			body:a.body
			docs:a.docs
			typeID:a.typeID
			userID:a.userID
			userName:@fnGetUser(a.userID)
			entryDate:a.entryDate			
		)
	fnMapRefundRecord: (a)->
		Em.Object.create(
			iD:a.iD
			amount:a.amount
			date:a.date
			body:a.body#purpose nėra kaip pas fnMapDamageRecord
			docs:a.docs
			typeID:a.typeID
			userID:a.userID
			userName:@fnGetUser(a.userID)
			entryDate:a.entryDate
		)
	fnMapActivitiesRecord: (acts,type)->
		subject=if acts.typeID==6 then acts.body else acts.subject#notes=6
		from=@fnGetFrom(acts)
		Em.Object.create(	
			iD:acts.iD
			claimID:acts.claimID
			typeID:acts.typeID
			body:acts.body
			date:acts.date
			entryDate:acts.entryDate
			from:from
			fromOnlyTbl:if type.isFinances then (if type.typeTitle then type.typeTitle else type.title) else from
			subject:subject
			amount:acts.amount
			infoOnlyTbl:if type.isFinances then (if subject then subject+", " else '')+acts.amount+" Lt" else (if(subject.length>25) then subject.slice(0,25)+" [...]" else subject)#Tik bendrai lentelei
			userID:acts.userID,
			userName:@fnGetUser(acts.userID)
			icon:if type.icon then type.icon else ''
			to:@fnGetTo(acts)
			docs:acts.docs
			toID:acts.toID#reikalingi rodant naujus recordus formoj
			fromText:acts.fromText
			toText:acts.toText
		)
	actViewZone:"#actionsEnterOfClaimReg"
	frm:"#contentOfClaimReg", typeID:""
	goToOtherView: (e) -> 
		if e.target.tagName.toUpperCase()!='A' #ne linkas o lentele
			$(e.target).closest('tr').addClass('selected').siblings().removeClass('selected')
		p=$.extend(e.context,claim:@claim)
		this.replaceActivityView(p)
	replaceActivityView:(p)->
		scroll = $(window).scrollTop();
		actView = $(@actViewZone)	
		if actView.length>0
			if (actView.html().length>0) then ACTIVITYVIEW.remove(); actView.empty()	
		if p then ACTIVITYVIEW=@actionView.create(p)
		else ACTIVITYVIEW=@mainView.create(controller:@)#claim:@mainController.claim
		ACTIVITYVIEW.appendTo(@actViewZone)
		Em.run.next(scroll,->$(window).scrollTop(@);)
	editForm: (e)->
		frm=$(e.target).closest(".inputForm")
		@actionViewInstance.set("notEditable",false).set("editButton",false)
		Em.run.next(@,()->	oCONTROLS.UpdatableForm(frm:frm, btnSaveToDisable:frm.find("button.btnSave")))
	deleteForm: (e) ->
		cnt=e.context; frm=$(@frm); frmOpt=frm.data("ctrl"); me=@
		oCONTROLS.dialog.Confirm({title:("Veiksmas '"+cnt.title+"'"),msg:"Ištrinti šį veiksmą'?"},->
			SERVER.update2(Action:"Delete", DataToSave:{ id:cnt.iD, DataTable: frmOpt.tblUpdate },"Ctrl":frm,"source":frmOpt.Source,CallBackAfter:(Row)-> #"row":row,
				switch cnt.tmp
					when "tmpAddDamageCA", "tmpAddDamageKASKO" then obj= "finDamageTbl"
					when "tmpAddInsuranceBenefit" then obj= "finInsurerTbl"
					when "tmpAddCompensation" then obj= "finOtherPartyTbl"					
					#activitiesTbl:[],finDamageTbl:[],finInsurerTbl:[],finOtherPartyTbl:[]
				( (obj,objActivitiesddd)-> 
					if obj then r=obj.findProperty("iD",@iD); obj.removeObject(r); 
					r2=objActivities.findProperty("iD",@iD); objActivities.removeObject(r2); 
				).call cnt, me[obj], me["activitiesTbl"]
				me.cancelForm()
			)
		)		
	saveForm: (e) ->
		form=$(@frm); context=e.view.bindingContext; execOnSuccess=e.execOnSuccess;
		formOpts=form.data('ctrl'); me=@; addData={}; Action=if formOpts.NewRec then "Add" else "Edit"
		if Action=="Add" #new record
			ClaimID=@claim.iD; addData={Fields:["ClaimID"],Data:[ClaimID]} # me.mainController->me
			if context.isFinances  #Finances finTypeID užsideda iš Radio pas tmpAddDamageKASKO ir tmpAddDamageCA
				if context.tmp.slice(0,12)!="tmpAddDamage" then addData.Fields.push("TypeID");addData.Data.push(context.typeID)
			else 
				addData.Fields.push("TypeID","FromID");addData.Data.push(context.typeID,oDATA.GET("userData").emData[0].userID) #userID- nes gali būt reikalingas formuojant from
		DataToSave=oCONTROLS.ValidateForm(form,addData)
		if not DataToSave and e.isTrigger then oCONTROLS.dialog.Alert( title:'Veiksmo išsaugojimas',msg:'Užpildykite pažymėtus laukus..')
		if DataToSave
			CallBackAfter=(Row)->
					me.setActivitiesTables() #galim ir fnMapActivitiesRecord(Row) nes grazina naują record'ą
					if execOnSuccess then execOnSuccess(Row,form) else me.cancelForm();
			SERVER.update2(Action:Action,DataToSave:DataToSave,Ctrl:form,source:formOpts.Source,CallBackAfter:CallBackAfter)
	cancelForm: () ->
		@replaceActivityView(); $("div.validity-tooltip").remove(); @
	mainView: Em.View.extend(
		addDamage:{}, addBenefit:{}, addCompensation:{}
		init: ->#čia sudedamas kontekstas akcijom viewe
			@_super(); ctrl=App.tabClaimsRegulationController; claimTypeID=ctrl.claim.claimTypeID; types=ctrl.activityTypes
			#cmdFinances=ctrl.cmdFinances
			fnGetProperties=(propName,propFilter)->
				props=types.findProperty(propName,propFilter); #props.typeiD=props.iD;		
				if not props.title then props.title=props.typeTitle
				$.parseJSON(JSON.stringify(props))
			tmpName=if claimTypeID==1 then "tmpAddDamageKASKO" else "tmpAddDamageCA"
			@addDamage=$.extend({txt:"Įvesti žalos sumą"}, fnGetProperties("tmp",tmpName))#,tmp:"tmpAddDamage"+(if claimTypeID==1 then "KASKO" else "CA")
			@addBenefit=$.extend({txt:"Įvesti draudimo išmoką"}, fnGetProperties("tmp","tmpAddInsuranceBenefit")); @addBenefit.title+=" ("+@controller.claim.insPolicy.insurerName+")"
			compName=if claimTypeID==1 then "finances_compensationFrom" else "finances_compensationTo" #Jei Kasko
			compTxt=if claimTypeID==1 then "Įvesti kaltininko kompensaciją" else "Įvesti kompensaciją nukentėjusiam"
			@addCompensation=$.extend({txt:compTxt},fnGetProperties("name",compName))#; @addCompensation.title=@addCompensation.typeTitle
		controller: App.tabClaimsRegulationController
		templateName: 'tmpActionMain'
	)		
	taskComplete:false, notActionOwner: true, actionViewContext:null
	fnTaskComplete:((e)->
		taskComplete=@get('taskComplete'); newVal=(if taskComplete then 1 else 0); me=@; cnt=@actionViewContext; frm=$(@frm); frmOpt=frm.data("ctrl");
		SERVER.update2(Action:"Edit", DataToSave:{ id:cnt.iD, Data:[newVal],Fields:["Amount"], DataTable: frmOpt.tblUpdate },"Ctrl":frm,"source":frmOpt.Source,CallBackAfter:(Row)->	
			me.activitiesTbl.findProperty('iD',cnt.iD).set('amount',newVal) #taskComplete dedam čia nes jis laisvas, updatinam mapinta ir pagr. lentele
			#me.activities.findProperty('iD', cnt.iD).set('amount',newVal)
			false
		)
		# if not cnt.chkTrigger # pasikeite ne dėl konteksto pasikeitimo, o del tikro click'o
			# cnt.amount=if taskComplete then 1 else 0
		# else cnt.chkTrigger=false#Jei buvo trigeris, nuresetinam, nes dabar gali būt tikras clickas
		#form=$('#dialogContent';DataToSave=oCONTROLS.ValidateForm(form); #pars=e.view._parentView.pars;
		#formOpts=form.data('ctrl');Action if formOpts.NewRec then "Add" else "Edit"
		# if DataToSave
			# DataToSave={"id":@claim.iD,"Data":[groupID,docTypeID,desc],"Fields":["groupID","docTypeID","description"],"DataTable":"tblClaims"}
			# SERVER.update2(Action:'Action',DataToSave:DataToSave,Ctrl:form,source:formOpts.Source)
		console.log('------------------------------------')
		console.log('fnTaskComplete. newVal set: '+newVal)
		console.log('------------------------------------')
		#console.log('fnTaskComplete. cnt.amount: '+cnt.amount)
	).observes("taskComplete")
	actionViewInstance:{}
	actionView: Em.View.extend(
		#cia savo kontrollerio nesimato, matosi tik pats view'as kaip view
		isNew:true, deleteButton: false, editButton:false, notEditable: false	
		init: -> 
			@_super(); ctrl=App.tabClaimsRegulationController; ctrl.actionViewInstance=@
			if not @tmp #edit record
				$.extend(@, {isNew:false}, $.parseJSON(JSON.stringify(ctrl.activityTypes.findProperty("typeID", this.typeID))))
				u=oDATA.GET("userData").emData[0] #kas per vartotojas?
				@set("deleteButton", true);
				if not @isFinances
					@set("notEditable", true)
					if (u.userID==@userID or ctrl.users.findProperty("iD",u.userID).isAdmin) then @set("editButton", true) #Jei čia jo dokumentas arba jis adminas
					ctrl.set("notActionOwner", if @editButton or u.userID==@toID then false else true) #Pagal šitą lokinam arba ne užduoties įvykdymo buttona
				# if @name=='activity_tasks'
					# if @thisUserID!=@userID and @thisUserID!=@toID #then $(frm).find('input:checkbox').attr('disabled',true) #Jeigu sis vartotojas nera kurejas ir nera vykdytojas, disablinam taskComplete checkboxa
					#ctrl=App.tabClaimsRegulationController
					#ctrl.actionViewContext.chkTrigger=true
					#ctrl.set("taskComplete",(if @amount==0 then false else true))
					ctrl.taskComplete=(if @amount==0 then false else true)
					console.log('init. taskComplete val: '+ctrl.taskComplete)
					console.log('init. cnt.amount: '+@amount)

			if not @title then @title=@typeTitle
			@set("childView", Em.View.extend(templateName: @tmp))
			ctrl.set("actionViewContext",@)
		didInsertElement: ()->
			@_super(); frm=$(@frm); claim=@claim; me=@
			if @isNew #New record
				switch @typeID
					when 3,4,5 
						divExt=frm.find("div.row").find("div.ExtendIt:first"); user=oDATA.GET("userData").emData[0]
						###
						if @typeID==3 then divExt.data("ctrl").Value=user.userID #Task
						else Em.run.next({divExt:divExt,user:user}, ()-> @divExt.find("input").val(@user.userName))
						###
					else console.log("loaded view")			
			else #Edit record
				( (iD)-> 
					@NewRec=0;@id=iD #@-> frm.data("ctrl")
				).call frm.data("ctrl"), @iD
			oCONTROLS.UpdatableForm(frm:@frm,(if @notEditable then false else btnSaveToDisable:frm.find("button.btnSave")))
			if (not @isNew)# skriopke rodom tik redagavimui
				@makeAttach(@,frm,claim)
			else
				$('<div class="row fileupload-buttonbar box_2pr"><center><i class="img16-attach"></i><a class="fileinput-button">Išsaugoti ir prisegti dokumentus</a></center></div>')
					.appendTo(@uploadZone).find('a').on("click", (e)->
						e.preventDefault(); $("#contentOfClaimReg").find("button.btnSave").trigger(type:"click", execOnSuccess:(row,frm)->							
							oCONTROLS.UpdatableForm_toSaved(row.iD, frm);
							$(me.uploadZone).empty(); 
							Em.run.next(me,()-> me.makeAttach(row,frm,claim))
						)
					)
		makeAttach: (row,frm,claim)->
			categoryOpts=
				accident:{iD:claim.accidentID,title:"Įvykio dokumentai"}
				driver:{iD:claim.accident.driverID,title:"Vairuotojo '"+claim.accident.driver+"' dokumentai"}
				vehicles:[iD:claim.vehicleID,title:"TP "+claim.vehicle.make+" "+claim.vehicle.model+", "+claim.vehicle.plate]
			tblProps=Fields:["ActivityID","DocID"],Data:[row.iD] #DataTable:tbl,Fields:["ActivityID","DocID"],Data:[ActivityID-turim(row.iD),DocID - pridedam po downloadinimo - data.result.iD]	
			switch frm.data("ctrl").tblUpdate
				when "tblFinances" then tblProps.DataTable="tblDocsInFin";
				when "tblActivities" then tblProps.DataTable="tblDocsInActivity";
				else console.error('no such tbl')

			$(@uploadZone).UploadFiles(
				categoryOpts:categoryOpts, showFromAccident:true,requireCategory:true,
				docsController:"claimDocController",updateRelationsTbl:tblProps,claim:this.claim
			)
			
			App.claimDocController.setDocs(tblProps.DataTable,row.iD) #Jau uploadintų dokumentų kontroleris
			if not $.isEmptyObject(DOCSVIEW) #make sure nothing left there
				DOCSVIEW.remove(); DOCSVIEW.destroy()
			DOCSVIEW=Em.View.create(
				opts: null #opcijos
				templateName: "tmpDocsView"
				tagName: "ul"
				classNames: ["gallery", "ui-helper-reset", "ui-helper-clearfix"]
				controller: App.claimDocController
				didInsertElement: ->
					@_super()
					this.$().data("opts",@opts)
			).appendTo @uploadZone	#Pridedam jau uploadintų dokumentų view'ą	
			
		templateName: 'tmpActionWrapper'
		frm:"#contentOfClaimReg"
		uploadZone:"#uploadClaimDocs"
	)
	goToList: ->
		#App.router.transitionTo('claimRegulation',{claimNo:'All'});
		App.router.transitionTo('claimList');
)	
# App.actionViewController = Em.ObjectController.create()
App.TabClaimsRegulationView = Ember.View.extend(#App.HidePreviousWindow,
	#viewName:"tabClaimsRegulation",
	#previuosWindow: '#divClaimsList'
	#thisWindow: '#divClaimRegulation'
	init: -> 
		@_super();
		if not $.isEmptyObject(ACTIVITYVIEW) #make sure nothing left there
			ACTIVITYVIEW.remove(); ACTIVITYVIEW.destroy()
		@controller.setActivitiesTables()#.setFinancesTables(); #alert("setting table")
		Em.run.next(@,->@controller.setSteps();)#have to set steps on the end as it uses numbers from setActivitiesTable().setFinancesTables()
	templateName: 'tmpClaimRegulation'
	didInsertElement: ()->
		@_super(); ctrl=@controller; ctrl.cancelForm(); ctrl.claimStatusBefore=ctrl.claim.claimStatus #used for claimStatus control
		#------------------step boxes-----------------------------------------------------------
		me=@; idx=0; stepBox={}; 
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
#Dokummentų rodymo Tp/driverio dialoge controller'is, dar žemiau opcjos view'o (dokumentų rodymo)
App.claimDocController = Em.ResourceController.create(
	target: (() -> @).property() #view actions with current controler targeted to controller
	#refID:null, groupID:null, docs:[]
	relationTbl:null, activityID:null, docs:[], accDoc:[]
	refreshDocs: ->
		@setDocs(@relationTbl,@activityID)
		ctrl=App.tabClaimsRegulationController
		if @relationTbl=="tblDocsInActivity" then ctrl.setActivitiesTables(iD:@activityID,docNo:@docs.length) #updating oDATA and tables with new No
		else ctrl.setFinancesTables(iD:@activityID,docNo:@docs.length)
	setDocs: (relationTbl,activityID) ->
		@relationTbl=relationTbl; @activityID=activityID
		relTbl=oDATA.GET(relationTbl).emData.filter((doc)->(doc.activityID==activityID)).map((doc)->doc.docID)
		
		docsPath=oDATA.GET("userData").emData[0].docsPath; url="Uploads/"+docsPath; users=oDATA.GET("tblUsers").emData; docTypes=oDATA.GET("tblDocTypes").emData	
		fnGetIcon=(ext) -> ext=ext.slice(0,3); return "img32-doc_" + (if ext=="xls"||ext=="doc"||ext=="pdf" then ext else "unknown" )
		fnGetUser=((userID) -> u=users.find((user)->user.iD==userID); u.firstName+" "+u.surname;)		
		fnGetDocType = (typeID)-> docTypes.find((type)->type.iD==typeID).name	
		
		docs=oDATA.GET("tblDocs").emData.filter((doc)->(relTbl.contains(doc.iD))).map((doc)-> 
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
	fnMapDocs:(relationTbl,activityID)-> (
		docTypes=oDATA.GET("tblDocTypes").emData
		fnGetDocType = (typeID)-> docTypes.find((type)->type.iD==typeID).name
		docsPath=oDATA.GET("userData").emData[0].docsPath; url="Uploads/"+docsPath
		docsInAccident=oDATA.GET(relationTbl).emData.filter((o)-> o.activityID==activityID).map((o)->o.docID);
		@set("noAccidentDocs",(if docsInAccident.length==0 then true else false))
		(d)->
			file="/"+d.iD+"."+d.fileType
			Em.Object.create(				
				docID:d.iD,
				hasThumb:d.hasThumb,
				urlThumb:url+"/Thumbs"+file,
				urlDoc:url+file,
				docType:fnGetDocType(d.docTypeID)
				docName:d.docName
				fileDate:d.fileDate
				fileName:d.docName+"."+d.fileType
				isPhoto:(if d.groupID==1 then true else false)
				added:(if docsInAccident.contains(d.iD) then true else false)
			)
	)
	fnSetGroup:(vGroup)-> #array to view: {groupID:??,refID:??,title:??} refID-priklausomai nuo groupID reiškia iD įvykio, vairuotojo arba driverio iD
		(group,refID,title)->
			vGroup.push(groupID:group.iD,refID:refID,title:(if title then title else group.name),items:[])
			false
	setAccDocs:(accCats,claim)->
		vGroup=[]; fn=@fnSetGroup(vGroup);
		oDATA.GET("tblDocGroup").emData.forEach((group)->
			acc=accCats.accident;drv=accCats.driver;vehs=accCats.vehicles
			switch group.ref
				when 1,2 then fn(group,acc.iD) #photo #accident
				when 3 then fn(group,drv.iD,drv.title)#driver
				when 4 then vehs.forEach((veh)->fn(group,veh.iD,veh.title);)#vehicles array
				when 5 then fn(group,acc.iD)#other
		)
		i=vGroup.findIndexByKeyValue("groupID",5)
		if i<4 then vGroup.move(i,4)#"other" shall be the last
		fnMapDocs=@fnMapDocs(@relationTbl,@activityID)
		oDATA.GET("tblDocs").emData.forEach((d)->
			for gr in vGroup
				if d.groupID==gr.groupID
					if d.refID==gr.refID then gr.items.addObject(fnMapDocs(d)); break #for loop
					else if gr.groupID!=4 then break #All vehicles will have same groupID so we need to loop all them to check	
		)
		@.set("vGroup",vGroup)
	vGroup:[]
)
docsViewOpts= #Listų dokumentų opcijos
	opts: null #opcijos
	templateName: "tmpDocsView"
	tagName: "ul"
	classNames: ["gallery", "ui-helper-reset", "ui-helper-clearfix"]
	controller: App.dialogDocController
	didInsertElement: ->
		@_super()
		this.$().data("opts",@opts)


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