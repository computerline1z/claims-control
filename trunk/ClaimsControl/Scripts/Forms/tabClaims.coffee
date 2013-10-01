
`var w=window, App=w.App, Em=w.Em, oGLOBAL=w.oGLOBAL, oDATA=w.oDATA, oCONTROLS=w.oCONTROLS, MY=w.MY`
App.claimsStart=()->
	actTypes=App.tabClaimsRegulationController.activityTypes
	if actTypes then (if actTypes.length then return)
	oDATA.execWhenLoaded(["proc_Claims"], ()->
		App.claimsController.set("content",oDATA.GET("proc_Claims").emData)	
	)
	oDATA.execWhenLoaded(["proc_Activities","tblActivityTypes","tblUsers"], ()-> # Cia deda duomenis i App.tabClaimsRegulationController, nes jei paspaus claimRegulation tai jo reiks
		actTypes=oDATA.GET("tblActivityTypes").emData.map((t)->t.typeID=t.iD; delete t.iD; return t;) #delete t.iD; 
		me=App.tabClaimsRegulationController
		me.set("activities",oDATA.GET("proc_Activities").emData).set("activityTypes",actTypes).set("users",oDATA.GET("tblUsers").emData)
		me.set("ativitiesNotFin",actTypes.filter((a)->not a.isFinances))
	)

App.TabClaimsView = App.mainMenuView.extend(
	didInsertElement: ()->
		#App.sidePanelController.refreshPanels("loadCl");#sudeda, kokius filtrus rodyt
		oDATA.execWhenLoaded(["tblClaimTypes"],()->	
			App.sidePanelController.refreshPanels("loadCl").attachBtnClaims()
		)
	templateName: 'tmpClaimsMain'#, viewIx: 5
)
App.ClaimView = Em.View.extend(
	init: ->
		@_super(); App.claimsController.setClaimContext(@bindingContext)
		# claim=@bindingContext
		# claim.set("accident",oDATA.GET("proc_Accidents").emData.findProperty("iD", claim.accidentID))
		# claim.set("claimType",oDATA.GET("tblClaimTypes").emData.findProperty("iD", claim.claimTypeID))
		# claim.set("vehicle",oDATA.GET("proc_Vehicles").emData.findProperty("iD", claim.vehicleID))
		# claim.set("insPolicy",oDATA.GET("proc_InsPolicies").emData.findProperty("iD", claim.insPolicyID))
		# $.extend(claim, {insurerID:claim.insPolicy.insurerID, daysFrom:claim.accident.daysFrom, date:claim.accident.date}) #greičio padidinimui dedam tiesiai
	templateName: 'tmpClaimView' #<div class="tr accident" @Html.Raw("{{action tbodyClick this target=\"this\"}}")>
	tagName: ""
)
App.claimsController = Em.ArrayController.create(
	setClaimContext: (claim)->
		claimID=claim.iD
		claim.set("accident",oDATA.GET("proc_Accidents").emData.findProperty("iD", claim.accidentID))
		claim.set("claimType",oDATA.GET("tblClaimTypes").emData.findProperty("iD", claim.claimTypeID))
		claim.set("vehicle",oDATA.GET("proc_Vehicles").emData.findProperty("iD", claim.vehicleID))
		claim.set("insPolicy",oDATA.GET("proc_InsPolicies").emData.findProperty("iD", claim.insPolicyID))
		claim.set("activities",oDATA.GET("proc_Activities").emData.filter((a)->a.claimID==claimID))
		$.extend(claim, {insurerID:claim.insPolicy.insurerID, daysFrom:claim.accident.daysFrom, date:claim.accident.date}) #greičio padidinimui dedam tiesiai
		@getWarnings(claim); false
	getWarnings: (claim)->
		warnings={};tasks=[];dateFormat=App.userData.dateFormat; red=false
		if not claim.accident then @setClaimContext(claim)
		if claim.warnings then claim.warnings=null# Jei buvo varningu nuresetinam
		ctrl=App.tabClaimsRegulationController; fnGetUser=ctrl.fnGetUser
		if claim.insPolicyID #claim.insPolicyID=0, kai neapdrausta
			if claim.claimStatus==0 then warnings={notifyOfClaim:true}; red=true
			else if claim.claimStatus<2
				X=moment().diff(moment(claim.date,dateFormat),'days')#kiek dienu praėjo nuo įvykio
				if X<0 then warnings=notifyOfDocs:{expired:math.abs(X)}; red=true#baigėsi laikas
				else if X==0 then warnings=notifyOfDocs:{today:true}; red=true #šiandien baigiasi
				else if X-claim.insPolicy.warn_DocsSupplyTermExpire<1 then warnings=notifyOfDocs:{leftDays:X}; red=true #liko mažiau nei nurodyta ir jau reikia perspėt
			else #claim.claimStatus==2 ir daugiau
				daysAfterDocs=moment().diff(moment(claim.date,dateFormat),"days")
				if daysAfterDocs>claim.insPolicy.warn_PaymentTerm then warnings.noPayment=daysAfterDocs
		claim.activities.forEach((a)->
			if a.typeID==3
				obj=date:a.date,user:fnGetUser.call(ctrl, a.userID),subject:a.subject,iD:a.iD,toID:a.toID
				if moment().diff(moment(a.date,dateFormat),"days")>0 then red=true; obj.red=true
				tasks.addObject(obj); 
		)
		if tasks.length then warnings.tasks=tasks
		if not $.isEmptyObject(warnings) then claim.set("warnings",warnings).set("warningClass",(if red then "red-border" else "yellow-border"))
		console.log("getWarnings. New Warning:")
		console.log(claim.warnings)
		
		false
	addNewAccident: ->
		this.openAccident(null)
	# openClaim: (e) -> #(AccNo) ->
		# console.log(e) #e.context.iD e.context.accident
		# $('#tabClaims').removeClass("colmask")
		# $('#divClaimsList').hide()
		# ctrlEdit=$('#divClaimEdit').show()
		# ctrlEdit.spinner({ position: 'center', img: 'spinnerBig.gif' })
		# #oGLOBAL.LoadAccident_Card(AccNo)
		# $("body").find("img.spinner").remove() # $("body").spinner('remove'); - neveikia
		# false
	content: []
	filterDidChange: ((thisObj, filterName)->	
		console.log("filterDidChange")
		console.log(@chkCriteria)
		filterValue=if filterName=="All" else thisObj[filterName]
		if (filterName=="filterValue")
			@textFilterIsActive=if(filterValue=="")then false else true
		else
			@panelFilterIsActive=if (@chkCriteria||@chkInsurers||@chkData||@chkClaim) then true else false
			@filterByPanel=@get_filterByPanel() #generate new function
		@filterItems(filterName,filterValue,thisObj);		
	).observes('chkCriteria','chkInsurers','chkData','chkClaim','filterValue')
	textFilterIsActive=false; panelFilterIsActive=false
	filterCols: [['accident','place'],['accident','shortNote'],['vehicle','plate'],'insurerClaimID']
	#filterValue:null// chkCriteria:null #chkWithDocs// chkWithOutDocschkInsurers:null //insuranceID (No)chkData:null // chk12month,#chk2011 //chk2010,#chk2009chkClaim:null //chkClaim_1,chkClaim_2,chkClaim_3,chkClaim_4,chkClaim_5,chkClaim_6
	filterByField: (row)->#jei yra filterValue grazina true jei ten randa, jei ne grazina true visada
		if not @filterReduced
			if (row.filterToHide) then return false #hidden by textFilter so return
		if not row.accident then return false #be row.accident reiskia ne to tipo, nenaudojami
		me=this;ret=false;cols=me.filterCols;filterValue=me.filterValue	
		fnFilter =(val)->#i
			if (val.toLowerCase().indexOf(filterValue)>-1) then true else false
		console.log("---Start filtering----")
		for i in [0...cols.length] by 1	
			colName=cols[i];
			colVal=if typeof colName=='string' then row[colName] else row[colName[0]][colName[1]]
			toShow=if not colVal then false else fnFilter(colVal)
			if toShow then console.log("true - "+row[cols[i]]); ret=true; break;
			else console.log("false - "+row[cols[i]]); ret=false;
		console.log("---End filtering----")
		row.set("filterToHide",not ret);
		ret
	get_filterByPanel: ()-> #ikisam nauja funkcija
		fn=""#"console.log('-----------Filtering by panel-------');"#grazina tik kai tenkinamos visos sąlygos var ret=true;
		if @chkCriteria 
			#fn+="console.log('chkDocs result:'+row.docNo);"
			#fn+="if(@chkDocs=="chkWithDocs") then "if (row.docNo===0) return false;" else "if (row.docNo>0) return false;"	
			if @chkCriteria=="chkOpenCl" then fn+="if (row.claimStatus===5) return false;" 
			else if @chkCriteria=="chkWithWarnings" then fn+=" if (!row.warnings) return false;"
			else if @chkCriteria=="chkWithMyTasks" then fn+="
			if(!row.warnings){
				return false;
			}else{
				if(!row.warnings.tasks){return false;}
				else{if(row.warnings.tasks.filter(function(t){return t.toID="+App.userData.userID+"}).length===0) return false;}
			};"
		if @chkInsurers 
			#fn+="console.log('chkInsurers result:'+row.insurerID+', '+(('+row.insurerID+'==='+this.chkInsurers+')?true:false));"
			fn+="if (row.insurerID!=="+@chkInsurers+") return false;"			
		if @chkData 
			#fn+="console.log('chkData result:'+row.date+', dienų:'+row.daysFrom);"
			#fn += "console.log(row);";
			fn += "if (!row.date) return false;";#jei be dates tai nereikalingas šitam saraše ClaimType
			fn+=if(@chkData=="12month") then "if (row.daysFrom>365) return false;" else "if (row.date.indexOf("+@chkData+")===-1) return false;"
		if @chkClaim 
			#fn+="console.log('claimTypeID:'+row.claimTypeID);"
			#fn+="console.log('chkClaim option:"+@chkClaim+"');"
			fn+="if (row.claimTypeID!=="+@chkClaim+") return false;"
		fn+="return true;"	
		new Function("row",fn)
	filterByPanel: null
	filterItems: (filterName,filterValue,thisObj)->
		if (filterName=='filterValue')
			if (filterValue=="")
				fnFilter=if @panelFilterIsActive then (row)=>row.filterToHide=false; return @filterByPanel(row); else (row)=>row.filterToHide=false; return true
			else 
				if @panelFilterIsActive then fnFilter=(row)=>result=(if(not@filterByField(row))then false else@filterByPanel(row)); return result;
				else fnFilter=(row)=>return @filterByField(row)			
			console.log("Filtro pradžia - tekstas---------------")
		else
			if not @textFilterIsActive and not @panelFilterIsActive
				fnFilter=(row)->return true
			else
				fnFilter=(row)=>
					if row.filterToHide then return false
					@filterByPanel(row)
					#return @filterByPanel.call(thisObj,row)		
			console.log("Filtro pradžia - kiti filtrai---------------")
		#fnFilter=(row)=>(v=fn(row);console.log("finalRez: "+v); row.set('visible',v);)
		#panelFilterIsActive
		#fn=(row)=>(v=@filterByField()(row); console.log("finalRez: "+v); row.set('visible',v);)
		#fn=(row)=>(v=(if (@filterByTab()(row)) then (@filterByField()(row)) else false;); console.log("finalRez: "+v); row.set('visible',v);)			
		@content.forEach((row)->res=fnFilter(row);row.set('visible',res); ) #console.log("finalResult: "+res);
)
# MY.tabAdmin={}