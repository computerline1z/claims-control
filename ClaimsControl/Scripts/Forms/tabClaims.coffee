
`var w=window, App=w.App, Em=w.Em, oGLOBAL=w.oGLOBAL, oDATA=w.oDATA, oCONTROLS=w.oCONTROLS, MY=w.MY`
App.claimsStart=()->
	oDATA.execWhenLoaded(["proc_Claims"], ()->
		App.claimsController.set("content",oDATA.GET("proc_Claims").emData)	
	)
	oDATA.execWhenLoaded(["proc_Activities","tblActivityTypes","tblUsers"], ()-> # Cia deda duomenis i App.tabClaimsRegulationController, nes jei paspaus claimRegulation tai jo reiks
		actTypes=oDATA.GET("tblActivityTypes").emData.map((t)->t.typeID=t.iD; return t;) #delete t.iD; 
		me=App.tabClaimsRegulationController
		me.set("activities",oDATA.GET("proc_Activities").emData).set("activityTypes",actTypes).set("users",oDATA.GET("tblUsers").emData)
		me.set("ativitiesNotFin",actTypes.filter((a)->not a.isFinances))
	)

App.TabClaimsView = App.mainMenuView.extend(
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
		claim.set("accident",oDATA.GET("proc_Accidents").emData.findProperty("iD", claim.accidentID))
		claim.set("claimType",oDATA.GET("tblClaimTypes").emData.findProperty("iD", claim.claimTypeID))
		claim.set("vehicle",oDATA.GET("proc_Vehicles").emData.findProperty("iD", claim.vehicleID))
		claim.set("insPolicy",oDATA.GET("proc_InsPolicies").emData.findProperty("iD", claim.insPolicyID))
		$.extend(claim, {insurerID:claim.insPolicy.insurerID, daysFrom:claim.accident.daysFrom, date:claim.accident.date}) #greičio padidinimui dedam tiesiai
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
			fn+="return true;"
		if @chkInsurers 
			fn+="console.log('chkInsurers result:'+row.insurerID+', '+(('+row.insurerID+'==='+this.chkInsurers+')?true:false));"
			fn+="if (row.insurerID!=="+@chkInsurers+") return false;"			
		if @chkData 
			fn+="console.log('chkData result:'+row.date+', dienų:'+row.daysFrom);"
			#fn += "console.log(row);";
			fn += "if (!row.date) return false;";#jei be dates tai nereikalingas šitam saraše ClaimType
			fn+=if(@chkData=="12month") then "if (row.daysFrom>365) return false;" else "if (row.date.indexOf("+@chkData+")===-1) return false;"
		if @chkClaim 
			fn+="console.log('claimTypeID:'+row.claimTypeID);"
			fn+="console.log('chkClaim option:"+@chkClaim+"');"
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
App.sidePanelForClaimsController = Em.ResourceController.create(
	chkHandler: (lbl, option)->		
		#newVal=if (chk.attr("checked")) then chk.data("opt") else null
		lbl.parent().find("label").not(lbl).removeClass("ui-state-active")
		newVal=if (lbl.hasClass("ui-state-active")) then lbl.attr("for").replace("chkInsurers_","").replace("chkDate_","").replace("chkClaimTypes_","") else null
		console.log('NewOption: '+option+'; New val: '+newVal)
		App.claimsController.set(option,newVal)
	init: -> 
		@_super();
		oDATA.execWhenLoaded(["tblClaimTypes"],()=>
			#turi but unikalus id o panasus yra accidentuose, todel pamakaluojam
			@.set('insurers',oDATA.GET("tblInsurers").emData.map((item)->item.chkId="chkInsurers_"+item.iD; return item))
			@.set('years',oDATA.GET("proc_Years").emData.map((item)->item.chkId2="chkDate_"+item.year; return item))
			@.set('claimTypes',oDATA.GET("tblClaimTypes").emData.map((item)->
				item.chkId2="chkClaimTypes_"+item.iD; 
				if (item.iD==0 or item.iD==6) then item.visible=false;#panaikinam "Neapdrausta ir prastova"
				return item;
				)
			)
		)
	insurers:[], years:[], claimTypes:[]
)

App.SidePanelForClaimsView = Em.View.extend(
	templateName: "tmpSidePanelForClaims"
	controller: App.sidePanelForClaimsController
	didInsertElement: ()->
		@_super(); 	
		Em.run.next(@,()->
			$("#sidePanelCl").closest("div.col2").stickyPanel()
			me=@controller
			$("#chkCriteria").buttonsetv().on("click",(e)-> e.preventDefault(); lbl=$(e.target).closest("label"); me.chkHandler(lbl,"chkCriteria"); false)
			$("#chkInsurers").buttonsetv().on("click",(e)-> e.preventDefault(); lbl=$(e.target).closest("label"); me.chkHandler(lbl,"chkInsurers"); false)
			$("#chkYearsCl").buttonsetv().on("click",(e)-> e.preventDefault(); lbl=$(e.target).closest("label"); me.chkHandler(lbl,"chkData"); false)
			$("#chkClaimsTypesCl").buttonsetv().on("click",(e)-> lbl=$(e.target).closest("label"); me.chkHandler(lbl,"chkClaim"); false)
		)
	showAll: ()->		
		$("#sidePanelCl").find("input:checkbox").removeAttr("checked").parent().next().next().find("span.ui-checkbox-icon").removeClass("ui-icon ui-icon-check").attr("aria-checked","false")
		$("#sidePanelCl").find("label.ui-state-active").removeClass("ui-state-active")
		ctrl=App.claimsController
		ctrl.chkCriteria=null; ctrl.chkInsurers=null
		ctrl.chkData=null; ctrl.chkClaim=null
		ctrl.filterDidChange(@,'All')	
)



# MY.tabAdmin={}