
`var w=window, App=w.App, Em=w.Em, oGLOBAL=w.oGLOBAL, oDATA=w.oDATA, oCONTROLS=w.oCONTROLS, MY=w.MY`
App.tabAccidentsView = App.mainMenuView.extend(
	content: null
	viewIx: 0
	templateName: 'tmpAccidentsMain'
	# init: -> 
		# @_super()
		# console.log("accidentInit")
	didInsertElement: -> 
		# @_super()
		# settings=categoryOpts:
				# accident:{iD:24,title:"Įvykio dokumentai"}
				# driver:{iD:87,title:"Vairuotojo Albinas Palubinskas dokumentai"},
				# vehicles:[{iD:14,title:"TP BBB, Volvo __ dokumentai"},{iD:7,title:"BRU643, Volvo, FH12"}]
		# oDATA.execWhenLoaded(["tmpUploadForm","tmpDocsTree"], ()-> 
			# $('#uploadDocsToAccident2').UploadFiles(settings)
			# $('#uploadDocsToAccident2').next().Tree(categoryOpts:settings.categoryOpts)
		# )	
	#contentObserver: (->
	#	@rerender()
	#	alert("App.tabAccidentsssssView has changed!")
	#	).observes("App.tabAccidentsController.content")
)
App.AccidentView = Em.View.extend(
	#@addObserver('content.lossSum', ->
	#	alert("New lossSum: " + @getPath('App.AccidentView.lossSum'))
	#	@rerender();
	#)	
	templateName: 'tmpAccidentRow' #<div class="tr accident" @Html.Raw("{{action tbodyClick this target=\"this\"}}")>
	tagName: ""
)
App.SelectedAccidentView = Em.View.extend(
	templateName: 'tmpAccident_Claims'
	init: ->
		`var ArrView = [],objView=[]`
		console.log("init selected accident")
		@_super();
		ArrClaims = @get("claims_C").replace(new RegExp('{{(.*?)}}', 'gm'), '').split('#||'); #Iskertam nenaudojamus tarp{{ ir}}//?-kad nebutu greedy
		ArrClaims2 = @get("claims_C2").split('#||');
		if (ArrClaims[0] != "")
			iterator=ArrClaims.length-1; i=-1
			while ((i++)<iterator)
				ArrView[i] = 
					Claims: ArrClaims[i].split('#|'),
					Claims2: ArrClaims2[i].split('#|')
				#Claims: 0-ClaimStatus,1-No,2-ClaimType(text),3-Vehicle,4-Insurer(text),5-lossAmount
				#Claims2: 0-ClaimID, 1-VehicleID, 2-InsPolicyID, 3-InsuranceClaimAmount, 4-InsurerClaimID, 5-IsTotalLoss, 6-IsInjuredPersons, 7-Days, 8-PerDay	
				objView[i] = 
					finished: (if(ArrClaims[i][0] == "2") then true else false), no: ArrView[i].Claims[1], type: ArrView[i].Claims[2]
					autoNo: ArrView[i].Claims[3], insurer: ArrView[i].Claims[4], loss: ArrView[i].Claims[5], Claims2: ArrView[i].Claims2
					accidentID: @get("iD"), accidentDate: @date
		App.thisAccidentController.set("content", objView) #butinai masyvas
		App.thisAccidentController.set("accidentID", @get("iD")) #butinai masyvas		
	tbodyClick: (e) -> #Reik daryti tik kai ant claimo, kitu atveju matyt išeinam
		#fnFilterPolicies=(i)-> if (oGLOBAL.date.firstBigger(i[4],options.contexts[0].rowContext.accidentDate)) then return [i] else return null
		# accidentDate=@date
		# thisAccidentPolicies=$.map(oDATA.GET("proc_InsPolicies").Data, (i)-> if (oGLOBAL.date.firstBigger(i[4],accidentDate)) then return [i] else return null)
		# proc_InsPolicies_forThisAccident=$.extend({},oDATA.GET("proc_InsPolicies"),{Data:thisAccidentPolicies})#not deep copy -overwrite
		# oDATA.SET("proc_InsPolicies_forThisAccident", proc_InsPolicies_forThisAccident)
		tr = $(e.target).closest("tr");ClaimW = $("#ClaimWraper")
		if (ClaimW.length > 0)
			MY.tabAccidents.SelectedClaimView.remove()
			ClaimW.remove();	
		tr.parent().find("tr.selectedClaim").removeClass("selectedClaim title")
		d = e.context;
		MY.tabAccidents.SelectedClaimView = App.SelectedClaimView.create(
			rowContext: { Claims2: d.Claims2, newClaim: false, LossAmount: d.loss, InsuranceType: d.type, accidentID: d.accidentID, accidentDate: d.accidentDate }
			elementId: "ClaimDetailsContent", contentBinding: 'App.claimEditController.content'
		)
		tr.addClass("selectedClaim title").after("<tr><td id='ClaimWraper' colspan='7' class='selectedClaim content'></td></tr>");
		MY.tabAccidents.SelectedClaimView.appendTo("#ClaimWraper");
		Em.run.next(() -> $("#ClaimDetailsContent").slideDown() )
		false		
	newClaim: (e) ->
		nTr = $(e.target).closest('div.tr')[0]
		$(nTr).replaceWith("<div id='divNewClaimCard' data-ctrl='{\"id\":\"0\",\"NewRec\":\"1\",\"Source\":\"tblClaims\",\"ClaimTypeID\":\"0\"}'></div>")
		d =	
			ctrl: $('#divNewClaimCard')
			oDATA: oDATA.GET("tblClaimTypes")
			opt: { val: "iD", text: "name", FieldName: "ClaimTypeID", SelectText: "Pasirinkite žalos tipą:" }
			fnAfterOptClick: (T) ->
				$('#divNewClaimCard').find('#divClaimCardDetails,div.frmbottom').remove();
				#fnSetClaimCard(1, T)
				#naujam Claimsui imamas redaguojamas viewsas SelectedClaimView ir kitas kontroleris newClaimController
				if (MY.tabAccidents.NewClaimView) ##($("#newClaimDetailsContent").length > 0)
					MY.tabAccidents.NewClaimView.remove()
					$("#newClaimDetailsContent").remove();
				MY.tabAccidents.NewClaimView = App.SelectedClaimView.create(
					#rowContext: { Claims2: d.Claims2, newClaim: true, LossAmount: d.loss, InsuranceType: d.type, accidentID: d.accidentID }
					rowContext: { newClaim: true, accidentID: App.thisAccidentController.get("accidentID") }
					elementId: "newClaimDetailsContent", contentBinding: 'App.newClaimController.content'
				)
				MY.tabAccidents.NewClaimView.appendTo("#divNewClaimCard")
				Em.run.next(() -> $("#newClaimDetailsContent").slideDown() )
				false
				fnCancel: () -> $("#accidentsTable").find("div.selectedAccident").trigger("click")# $(nTr).find('td').html(CancelNewClaimHtml)
			fnCancel: () -> $("#accidentsTable").find("div.selectedAccident").trigger("click") #$(nTr).find('td').html(CancelNewClaimHtml)
		oCONTROLS.Set_Updatable_HTML.mega_select_list(d)
		false
	elementId: "AccDetailsContent"
	contentBinding: 'App.thisAccidentController.content'
	destroyElement: () -> MY.tabAccidents.SelectedClaimView.remove() if (MY.tabAccidents.SelectedClaimView)
)
App.SelectedClaimView = Em.View.extend(
	didInsertElement: ->
		c=this.content[0]
		frm=if c.NewClaim then "#divNewClaimCard" else '#divClaimCard'
		oCONTROLS.UpdatableForm(frm)
		if c.TypeID==2
			IClaim=$("#InsuranceClaimAmount").parent().parent(); IClaim.find("span").html("Žalos suma asmeniui")
			$("#LossAmount").parent().find("span").html("Žalos suma turtui");
			fnCheckIsInjured =() ->
				if this.attr("checked") then IClaim.css("display","block").find("input").data("ctrl").Validity=IClaim.find("input").data("ctrl").Validity.replace("require().","")
				else IClaim.css("display","none").find("input").val("").data("ctrl").Validity="require()."+IClaim.find("input").data("ctrl").Validity				
				# IClaim.css("display", (if this.attr("checked") then "block" else "none"))
				# $($0).data("ctrl").Validity=$($0).data("ctrl").Validity.replace("require()","")
			fnCheckIsInjured.call($("#IsInjuredPersons"))
			$("#IsInjuredPersons").on("click",-> fnCheckIsInjured.call($("#IsInjuredPersons")))	
		$("#inputDays, #inputPerDay").on("keyup",-> $("#inputSum").val(($("#inputDays").val()*$("#inputPerDay").val()));)
	init: ->
		@_super(); d = @get("rowContext"); 		
		if not d.newClaim
			C2 = d.Claims2; TypeID = oDATA.GET("tblClaimTypes").emData.findProperty("name",d.InsuranceType).iD
			#Claims2: 0-ClaimID, 1-VehicleID, 2-InsPolicyID, 3-InsuranceClaimAmount, 4-InsurerClaimID, 5-IsTotalLoss, 6-IsInjuredPersons, 7-Days, 8-PerDay
			Claim =
				ID: C2[0],VehicleID: C2[1],InsPolicyID: C2[2],InsuranceClaimAmount: C2[3],InsurerClaimID: C2[4]
				IsTotalLoss: C2[5],IsInjuredPersons: parseInt(C2[6],10),Days: C2[7],PerDay: C2[8],LossAmount: d.LossAmount
				NewClaim: false,TypeID: TypeID
			App.claimEditController.set("content", [Claim]) #butinai masyvas view'e su each		
		else #newClaim
			TypeID = $("#divNewClaimCard").data("ctrl").ClaimTypeID
			Claim =
				ID: 0,VehicleID: "",InsPolicyID: "",InsuranceClaimAmount: 0,InsurerClaimID: ""
				IsTotalLoss: 0,IsInjuredPersons: 0,Days: 5,PerDay: 500,LossAmount: (if TypeID==6 then 2500 else 0)
				NewClaim: true,TypeID: TypeID
			App.newClaimController.set("content", [Claim]) #butinai masyvas view'e su each	
			console.log("init new Claim.Type - "+TypeID)
	SaveClaim: (e) ->
		newClaim=this.rowContext.newClaim
		if newClaim
			frm=$('#divNewClaimCard'); Action='Add'
			Msg= Title: "Naujos žalos sukūrimas", Success: "Nauja žala sukurta.", Error: "Nepavyko išsaugot naujos žalos."
		else
			frm=$('#divClaimCard'); Action='Edit'
			Msg= Title: "Žalos redagavimas", Success: "Žalos duomenys pakeisti.", Error: "Nepavyko pakeisti žalos duomenų."
		DataToSave = oCONTROLS.ValidateForm(frm)
		if (DataToSave)
			if newClaim
					DataToSave.Fields.push("ClaimTypeID"); DataToSave.Data.push(e.view.content[0].TypeID)
					DataToSave.Fields.push("AccidentID"); DataToSave.Data.push(e.view.rowContext.accidentID)
			DataToSave["Ext"] = e.view.rowContext.accidentID
			opt = 
				Action: Action,
				DataToSave: DataToSave,
				CallBack:
					Success: (resp) ->
						newRow = resp.ResponseMsg.Ext.replace(/#\|#\|/g,":::").split("|#|"); newRow[13]=newRow[13].replace(/:::/g,"#|#|") #atkeičiam atgal
						App.accidentsController.get("setNewVal").call(App.accidentsController, {newVal:newRow,toAppend:false,fieldsToInt:[0, 1, 5, 6, 7, 8]})[0] #kuriuos reikia paverst integeriais
						tr = $("#accidentsTable").find("div.selectedAccident") #.empty()
						#newView.appendTo(tr)
						#Em.View.create({
						#    personName: 'Dr. Tobias Fünke',
						#    template: Em.Handlebars.compile('Hello {{personName}}')
						#}).appendTo(tr)
						tr.trigger("click")
				Msg: Msg
			SERVER.update(opt)
	CancelSaveClaim: (e) ->
		#oCONTROLS.UpdatableForm_reset("#divClaimCard")
		$("#accidentsTable").find("div.selectedAccident").trigger("click")
	DeleteClaim: (e) ->
		oData=oDATA.GET("tblClaims"); context=e.context.rowContext;
		console.log("Žalos ID: "+context.Claims2[0])
		oCONTROLS.dialog.Confirm {title:"",msg:"Ištrinti pasirinktą žalą?"},->
			SERVER.update(Action:"Delete", DataToSave:{ id:context.Claims2[0], DataTable: oData.Config.tblUpdate, Ext:context.accidentID },
			Msg: { Title: "Duomenų ištrynimas", Success: "Pasirinkta žala buvo pašalinta.", Error: "Nepavyko pašalinti šios žalos" },									
			CallBack: 
				Success:(resp,updData) ->
					newRow = resp.ResponseMsg.Ext.replace(/#\|#\|/g,":::").split("|#|"); newRow[13]=newRow[13].replace(/:::/g,"#|#|") #atkeičiam atgal
					#if newRow.length==18
					#	claims_c=newRow.slice(13,17).join("|#|"); claims_c2=newRow[17]; newRow=newRow.slice(0,13)
					#	newRow[13]=claims_c; newRow[14]=claims_c2
					App.accidentsController.get("setNewVal").call(App.accidentsController, {newVal:newRow,toAppend:false,fieldsToInt:[0, 1, 5, 6, 7, 8]})[0] #kuriuos reikia paverst integeriais
					oData.Data.removeRowByID(parseInt(updData.DataToSave.id,10)) #ištrinam ir iš tblClaims jau ištrintą žalą					
					#oData.Data.removeRowByID(p.id) data.removeRowByProperty("id",p.id)
					$("#accidentsTable").find("div.selectedAccident").trigger("click")
			)
	templateName: 'tmpClaimEdit'
	#elementId: "ClaimDetailsContent",
	#contentBinding: 'App.claimEditController.content'
)
#***************************************Controler**************************************************************
App.accidentsController = Em.ResourceController.create(
	url: "Accident/AccidentsList",#jei yra atsisiunčiam
	tableName: "proc_Accidents",#jei yra, turinį į content
	currency: 'LTL'
	#fields: {}
	animationSpeedEnd: 400
	animationSpeedStart: 400
	setAnimationSpeed:(e)->
		n=parseInt($(e.target).val(),10)
		onSpeed=if $(e.target).data("action")=="start" then "animationSpeedStart" else "animationSpeedEnd"
		if $.isNumeric(n) then @.set(onSpeed,n)
		else alert "turi būti skaičius"
	removeClaims: (AddWr,e,tr,parent) ->
		#$("#divAccidentsList").find("div.validity-tooltip").remove()
		$("div.validity-tooltip").remove()
		dividers=AddWr.parent().find("div.dividers"); dividers.slideUp(App.accidentsController.animationSpeedEnd, () -> dividers.remove())
		if (AddWr.length > 0)
			MY.tabAccidents.AcccidentdetailsView.remove(); me=@
			# AddWr.remove(); 
			AddWr.slideUp(App.accidentsController.animationSpeedEnd, () -> if tr.hasClass("selectedAccident") then tr.removeClass("selectedAccident") else parent.find("div.selectedAccident").removeClass("selectedAccident"); AddWr.remove(); me.addClaim(e,tr);) 
		else if MY.tabAccidents.AcccidentdetailsView #jei filtruojant pakavojom ir spaudziam kitur panaikinam jį
			MY.tabAccidents.AcccidentdetailsView.destroy();MY.tabAccidents.AcccidentdetailsView=null;$('div.dividers').remove()
		else #pirmas kartas tik pridedam
			@addClaim(e,tr);
	addClaim:(e,tr)->
		tr.addClass("selectedAccident")	if not tr.hasClass("selectedAccident")
		MY.tabAccidents.AcccidentdetailsView = App.SelectedAccidentView.create(e.context)
		#tr.after("<div id='AccDetailsWraper'></div><div class='dividers'></div>").prev().before("<div class='dividers'></div>")
		tr.after("<div id='AccDetailsWraper'></div><div class='dividers'></div>") #.prev().before("<div class='dividers'></div>")
		MY.tabAccidents.AcccidentdetailsView.appendTo("#AccDetailsWraper")
		if e.isTrigger
			Em.run.next(-> $("#AccDetailsContent, div.dividers").show())
		else
			Em.run.next(-> $("#AccDetailsContent, div.dividers").slideDown(App.accidentsController.animationSpeedStart))	
		
	tbodyClick: (e) ->
		tr = $(e.target).closest("div.tr")
		@setfilteredPolicies(e.context.date)#Filtruojam polisus		
		AddWr = $("#AccDetailsWraper"); parent=tr.parent()		
		if tr.hasClass("selectedAccident") and not e.isTrigger
			if parent.find("div.dividers").length
				this.removeClaims(AddWr,e,tr,parent); return false; #Ištrinam ir išeinam
				parent.find("div.selectedAccident").removeClass("selectedAccident");
		#atidarom
		else
			#parent.find("div.selectedAccident").removeClass("selectedAccident"); this.removeClaims(AddWr) #priešingu atveju ištrinam ir pridedam
			this.removeClaims(AddWr,e,tr,parent) #priešingu atveju ištrinam ir pridedam	
			

		false
	setfilteredPolicies: (accidentDate) ->
		thisAccidentPolicies=$.map(oDATA.GET("proc_InsPolicies").Data, (i)-> if (oGLOBAL.date.firstBigger(i[4],accidentDate)) then return [i] else return null)
		proc_InsPolicies_forThisAccident=$.extend({},oDATA.GET("proc_InsPolicies"),{Data:thisAccidentPolicies})#not deep copy -overwrite
		oDATA.SET("proc_InsPolicies_forThisAccident", proc_InsPolicies_forThisAccident)
	editAccident: (e) ->
		this.openAccident(e.context.no)		
	#	filteredRecords: -> ##valueBinding=\"App.accidentsController.filter\"
	#		alert(@get("filter") + "__")
	#	} .observes("filter")
	addNewAccident: ->
		this.openAccident(null)
	openAccident: (AccNo) ->
		$('#tabAccidents').removeClass("colmask")
		$('#divAccidentsList').hide()
		ctrlEdit=$('#divAccidentEdit').show()
		ctrlEdit.spinner({ position: 'center', img: 'spinnerBig.gif' })
		oGLOBAL.LoadAccident_Card(AccNo)
		$("body").spinner('remove');
		false
	# filterWillChange: ((thisobj, keyName)->
		# if (not thisobj[keyName] or keyName=='filterValue') then @filterFromVisible=true else @filterFromVisible=false ##jei pirmas paspaudimas arba filtruojama pagal filterValue galim filtruot tik matomus
		# console.log(@filterFromVisible)
	# ).observesBefore('chkDocs','chkOpen','chkData','chkClaim','filterValue')	
	filterDidChange: ((thisObj, filterName)->	
		console.log("filterDidChange")
		#alert @filterValue
		filterValue=if filterName=="All" else thisObj[filterName]
		if (filterName=="filterValue")
			@textFilterIsActive=if(filterValue=="")then false else true
		else
			@panelFilterIsActive=if (@chkDocs||@chkOpen||@chkData||@chkClaim) then true else false
			@filterByPanel=@get_filterByPanel() #generate new function
		@filterItems(filterName,filterValue,thisObj);		
		Em.run.next(-> tbl=$('#accidentsTable'); if (not tbl.find('div.selectedAccident').length) then tbl.find('div.dividers').remove())
	).observes('chkDocs','chkOpen','chkData','chkClaim','filterValue')
	#claims_C: "0#|47-1#|TP valdytojų civilinė atsakomybė#|BRU641#|Ergo Lietuva#|1520{{TGH-152 Man 160 Jonas Jonaitis}}"
	#claims_C2: "175#|4#|2#|500#|'bb10'#|0#|1#|0#|0"
	textFilterIsActive=false
	panelFilterIsActive=false
	filterFromVisible: false
	filterCols: ['accType','driver','shortNote','userName','place','claims_C']#no neimam, nes jis jau yra claims_C
	filterValue:null
	chkDocs:null #chkWithDocs,#chkWithOutDocs
	chkOpen:null #chkWithOpen,#chkWithoutOpen
	chkData:null #chk12month,#chk2011,#chk2010,#chk2009
	chkClaim:null #chkClaim_1,chkClaim_2,chkClaim_3,chkClaim_4,chkClaim_5,chkClaim_6
	filterByField: (row)->#jei yra filterValue grazina true jei ten randa, jei ne grazina true visada
		#fn=if not @filterValue then "return true;" else "var ret=false,cols="+JSON.stringify(this.current.filterCols)+
		#";console.log('Filtering by val:"+@filterValue+"'); for(var i=0; i < cols.length; i++){console.log(row[cols[i]]+', '+(row[cols[i]].toLowerCase().indexOf('"+@filterValue+"')>-1));
		#if (row[cols[i]].toLowerCase().indexOf('"+@filterValue+"')>-1){ret=true; break;}} console.log('filterByval rez: '+ret);return ret;"
		#new Function("row",fn)
		if (row.filterToHide) then return false #hidden by textFilter so return
		me=this;ret=false;cols=JSON.parse(JSON.stringify(me.filterCols)); #console.log("Filtering by val:"+cols)
		fnFilter =(i)-> 
			#console.log(row[cols[i]]+', '+(row[cols[i]].toLowerCase().indexOf(me.filterValue)>-1));
			if (row[cols[i]].toLowerCase().indexOf(me.filterValue)>-1) then true else false
		console.log("---Start filtering----")
		for i in [0...cols.length] by 1			
			if fnFilter(i) then ret=true;console.log("true - "+row[cols[i]]); break else console.log("false - "+row[cols[i]])
		console.log("---End filtering----")
		if not ret then row.filterToHide=true
		ret
	get_filterByPanel: ()-> #ikisam nauja funkcija
		fn=""#"console.log('-----------Filtering by panel-------');"#grazina tik kai tenkinamos visos sąlygos var ret=true;
		if @chkOpen 
			#fn+="console.log('chkOpen result:'+row.cNo_NotF+', '+((this.chkOpen==='chkWithOpen')?row.cNo_NotF!==0:row.cNo_NotF===0));"
			fn+=if(@chkOpen=="chkWithOpen") then "if (row.cNo_NotF===0) return false;" else "if (row.cNo_NotF>0) return false;"
		if @chkDocs 
			#fn+="console.log('chkDocs result:'+row.docNo);"
			fn+=if(@chkDocs=="chkWithDocs") then "if (row.docNo===0) return false;" else "if (row.docNo>0) return false;"		
		if @chkData 
			#fn+="console.log('chkData result:'+row.date+', dienų:'+row.daysFrom);"
			#option=@chkData #'12month','2011','2010'
			fn+=if(@chkData=="12month") then "if (row.daysFrom>365) return false;" else "if (row.date.indexOf("+@chkData+")===-1) return false;"
		if @chkClaim 
			#fn+="console.log('chkClaim types:'+row.claims_TypeID);"
			#option=@chkClaim #option iD Claim_1,Claim_2,chkClaim_3,chkClaim_4,chkClaim_5,chkClaim_6
			#fn+="console.log('chkClaim option:"+option+"');"
			fn+="if (row.claims_TypeID.indexOf('"+@chkClaim+"')===-1) return false;"
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
App.thisAccidentController = Em.ResourceController.create(
	content: [],
	tableName: "?"
	#    setContent: function (ArrView) {
	#        @set("content", ArrView)
	#    }
)
App.claimEditController = Em.ResourceController.create(
	tableName: "?"
	#    setContent: function (ArrView) {
	#    	@set("content", ArrView)
	#    }
)
App.newClaimController = Em.ResourceController.create(
	tableName: "?"
	#    setContent: function (ArrView) {
	#    	@set("content", ArrView)
	#    }
)
App.sidePanelController = Em.ResourceController.create(
	tableName: "?"
	chkHandler: (lbl, option)->		
		#newVal=if (chk.attr("checked")) then chk.data("opt") else null
		lbl.parent().find("label").not(lbl).removeClass("ui-state-active")
		newVal=if (lbl.hasClass("ui-state-active")) then lbl.attr("for").replace("chk_claimTypes","").replace("chk_","") else null
		#lbl.toggleClass("ui-state-active")
		App.accidentsController.set(option,newVal)
	init: -> 
		@_super();
		oDATA.execWhenLoaded(["tblClaimTypes"],()=>
			# @.set('years',oDATA.GET("proc_Years").emData)
			# @.set('claimTypes',oDATA.GET("tblClaimTypes").emData)
			@.set('years',oDATA.GET("proc_Years").emData.map((item)->item.chkId="chk_"+item.year; return item))
			@.set('claimTypes',oDATA.GET("tblClaimTypes").emData.map((item)->item.chkId="chk_claimTypes"+item.iD; return item;))
			@claimTypes.findProperty("iD",0).visible=false	
			Em.run.next(@,()->(
				me=@
			#	$("#sidePanel").find("fieldset.datesOptions").find("input:checkbox").checkbox("onClick":(chk)->me.chkHandler(chk,"chkData"))
			#	$("#sidePanel").find("fieldset.claimsTypesOptions").find("input:checkbox").checkbox("onClick":(chk)->me.chkHandler(chk,"chkClaim"))
				$("#chkYears").buttonsetv().on("click",(e)-> e.preventDefault(); lbl=$(e.target).closest("label"); me.chkHandler(lbl,"chkData"); false)
				$("#chkClaimsTypes").buttonsetv().on("click",(e)-> lbl=$(e.target).closest("label"); me.chkHandler(lbl,"chkClaim"); false)
			))
		)
	years:[], claimTypes:[]
)
App.SidePanelView = Em.View.extend(
	templateName: "tmpSidePanel"
	didInsertElement: ()->
		@_super(); 	
		Em.run.next(()->
			$("#sidePanel").closest("div.col2").scrollelement()
			#c=$("#sidePanel").closest("div.col2");if $.browser.msie then c.scrollelement() else c.jScroll()
			$("#chkOpen").buttonset().on("click",(e)->
				chk=$(e.target).closest("label").prev();
				newVal=if (chk.next().hasClass("ui-state-active")) then chk.attr("id") else null #Jei aktyvus priskiriam
				$("#chkOpen").find("label").not(chk.next()).removeClass("ui-state-active").end().prev().not(chk).removeAttr("checked")	
				App.accidentsController.set("chkOpen",newVal)
				e.preventDefault()
			)
			$("#chkDocs").buttonset().on("click",(e)->
				chk=$(e.target).closest("label").prev();
				newVal=if (chk.next().hasClass("ui-state-active")) then chk.attr("id") else null #Jei aktyvus priskiriam
				$("#chkDocs").find("label").not(chk.next()).removeClass("ui-state-active").end().prev().not(chk).removeAttr("checked")	
				App.accidentsController.set("chkDocs",newVal)
				e.preventDefault()
			)
		)
	showAll: ()->		
		$("#chkOpen,#chkDocs").find("label").removeClass("ui-state-active").end().prev().removeAttr("checked")
		$("#sidePanel").find("input:checkbox").removeAttr("checked").parent().next().next().find("span.ui-checkbox-icon").removeClass("ui-icon ui-icon-check").attr("aria-checked","false")				
		#App.accidentsController.filterwillChange()	
		App.accidentsController.chkOpen=null
		App.accidentsController.chkDocs=null
		App.accidentsController.chkData=null
		App.accidentsController.chkClaim=null
		App.accidentsController.filterDidChange(@,'All')	
		#e.stopPropagation();
		#e.preventDefault();
		#if $(this.target).attr("checked") then $(this.target).attr("checked", "") else $(this.target).attr("checked", "checked")	
)
MY.tabAccidents={}