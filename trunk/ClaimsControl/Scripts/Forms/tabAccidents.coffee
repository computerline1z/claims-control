
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
		#console.log("init selected accident")
		@_super(); claimsTypeID=@claims_TypeID.split('#')
		ArrClaims = @get("claims_C").replace(new RegExp('{{(.*?)}}', 'gm'), '').split('#||'); #Iskertam nenaudojamus tarp{{ ir}}//?-kad nebutu greedy
		ArrClaims2 = @get("claims_C2").split('#||');
		if (ArrClaims[0] != "")
			iterator=ArrClaims.length-1; i=-1
			while ((i++)<iterator)
				clTypeID=claimsTypeID[i]
				ArrView[i] = 
					Claims: ArrClaims[i].split('#|'),
					Claims2: ArrClaims2[i].split('#|')
				#Claims: 0-ClaimStatus,1-No,2-ClaimType(text),3-Vehicle,4-Insurer(text),5-lossAmount
				#Claims2: 0-ClaimID, 1-VehicleID, 2-InsPolicyID, 3-InsuranceClaimAmount, 4-InsurerClaimID, 5-IsTotalLoss, 6-IsInjuredPersons, 7-Days, 8-PerDay	
				objView[i] = 
					finished: (if(ArrClaims[i][0] == "5") then true else false), no: ArrView[i].Claims[1], type: ArrView[i].Claims[2]
					autoNo: ArrView[i].Claims[3], insurer: ArrView[i].Claims[4], loss:ArrView[i].Claims[5] # tmpAccident_Claims.cshtml naudos totalLoss jei jo nėra, tada loss
					totalLoss:(if (ArrView[i].Claims2[2]!="0" and ArrView[i].Claims2[6] and clTypeID=="2" and not isNaN(parseFloat(ArrView[i].Claims2[3]))) then +ArrView[i].Claims[5]+ +ArrView[i].Claims2[3] else 0) # if InsPolicyID!=0 and IsInjuredPersons and clTypeID==2 and InsuranceClaimAmount is number then lossAmount+InsuranceClaimAmount else lossAmount
					Claims2: ArrView[i].Claims2, claimStatus:ArrClaims[i][0]
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
		clickOnSelected=if (tr.hasClass("selectedClaim")) then true else false
		if (ClaimW.length > 0)
			MY.tabAccidents.SelectedClaimView.remove()
			ClaimW.remove();	
		tr.parent().find("tr.selectedClaim").removeClass("selectedClaim title")
		if clickOnSelected then return false #Ant pasirinkto naujo nededam
		d = e.context;
		MY.tabAccidents.SelectedClaimView = App.SelectedClaimView.create(
			rowContext: { Claims2: d.Claims2, newClaim: false, LossAmount: d.loss, InsuranceType: d.type, accidentID: d.accidentID, accidentDate: d.accidentDate, claimStatus: d.claimStatus }
			elementId: "ClaimDetailsContent", contentBinding: 'App.claimEditController.content'
		)
		tr.addClass("selectedClaim title").after("<tr><td id='ClaimWraper' colspan='7' class='selectedClaim content'></td></tr>");
		MY.tabAccidents.SelectedClaimView.appendTo("#ClaimWraper");
		Em.run.next(() -> $("#ClaimDetailsContent").slideDown() )
		false		
	newClaim: (e) ->
		nTr = $(e.target).closest('div.tr'); $(e.target).closest('div.rightFooterBig').hide();
		#Naudojam šito rekvizitus, nes divNewClaimCard_Content dar nėra
		nTr.append("<div id='divNewClaimCard' data-ctrl='{\"id\":\"0\",\"NewRec\":\"1\",\"Source\":\"proc_Claims\",\"ClaimTypeID\":\"0\"}'></div>")
		fnCancelNewClaim=()->$("#divNewClaimCard").remove(); $("#AccDetailsContent").find('div.rightFooterBig').show()
		d =	
			ctrl: $('#divNewClaimCard')
			oDATA: oDATA.GET("tblClaimTypes")
			opt: { val: "iD", text: "name", FieldName: "ClaimTypeID", SelectText: "Pasirinkite žalos tipą:" }
			fnAfterOptClick: (T) ->
				$('#divNewClaimCard').find('#divNewClaimCard_Content,div.frmbottom').remove();
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
				fnCancel: () -> fnCancelNewClaim()
			fnCancel: () -> fnCancelNewClaim()
		oCONTROLS.Set_Updatable_HTML.mega_select_list(d)
		false
	toClaimRegulation: (e) ->
		App.router.transitionTo('claimRegulation',{claimNo:e.context.no});
		# Ember.State.transitionTo('claimRegulation',1);
	elementId: "AccDetailsContent"
	contentBinding: 'App.thisAccidentController.content'
	destroyElement: () -> MY.tabAccidents.SelectedClaimView.remove() if (MY.tabAccidents.SelectedClaimView)
)
App.SelectedClaimView = Em.View.extend(
	didInsertElement: ->
		c=App.claimEditController.claim
		frm=if c.newClaim then "#divNewClaimCard" else '#divClaimCard_Content' # Negalim naudot '#divNewClaimCard_Content', nes divNewClaimCard yra data-ctrl, nes ten mes dedam žalos tipą kai dar nėra divNewClaimCard_Content
		btnSaveToDisable=if c.newClaim then $(frm).find("button.btnSave") else $(frm).next().find("button.btnSave")
		oCONTROLS.UpdatableForm(frm:frm,btnSaveToDisable:btnSaveToDisable)
		if c.typeID==2
			IClaim=$("#InsuranceClaimAmount").parent().parent(); IClaim.find("span").html("Žalos suma asmeniui");
			$("#LossAmount").parent().find("span").html("Žalos suma turtui");
			fnCheckIsInjured =() ->
				if this.attr("checked") then IClaim.css("display","block").find("input").data("ctrl").Validity=IClaim.find("input").data("ctrl").Validity.replace("require().","")
				else IClaim.css("display","none").find("input").val("").data("ctrl").Validity="require()."+IClaim.find("input").data("ctrl").Validity				
				# IClaim.css("display", (if this.attr("checked") then "block" else "none"))
				# $($0).data("ctrl").Validity=$($0).data("ctrl").Validity.replace("require()","")
			fnCheckIsInjured.call($("#IsInjuredPersons"))
			$("#IsInjuredPersons").on("click",-> fnCheckIsInjured.call($("#IsInjuredPersons")))	
		#$("#inputDays,#inputPerDay").on("keyup",-> $("#inputSum").val(($("#inputDays").val()*$("#inputPerDay").val()));)
		if c.typeID==6
			inpSum=$(frm).find('.inputSum input'); days=$(frm).find('.days input');perDay=$(frm).find('.perDay input')
			$(frm).find('.days input,.perDay input').on("keyup",-> inpSum.val(days.val()*perDay.val());)
		if c.claimStatus>2
			inputs=$(frm).find("input")
			if c.claimStatus=="3" then inputs=inputs.eq(1).prop('title', 'Suma jau patvirtina')#lossAmount placement important!!
			else if c.claimStatus=="4" then inputs=inputs.filter((i)->i==1||$(@).attr("id")=="InsuranceClaimAmount").prop('title', 'Suma jau patvirtina')#lossAmount & insuranceClaimAmount
			else if c.claimStatus=="5" then ($(frm).find("button").prop("disabled", true); inputs.prop('title', 'Žala uždaryta'))#laimStatus==5 disabled everything
			inputs.prop("disabled", true)
		if c.noInsurance then $("#NotInsuredClaim").trigger("click")
	init: ->
		@_super(); d = @get("rowContext"); 	
		if not d.newClaim
			C2 = d.Claims2; TypeID = oDATA.GET("tblClaimTypes").emData.findProperty("name",d.InsuranceType).iD
			#Claims2: 0-ClaimID, 1-VehicleID, 2-InsPolicyID, 3-InsuranceClaimAmount, 4-InsurerClaimID, 5-IsTotalLoss, 6-IsInjuredPersons, 7-Days, 8-PerDay
			Claim = Em.Object.create(
				iD: C2[0],vehicleID: C2[1],insPolicyID: C2[2],insuranceClaimAmount: C2[3],insurerClaimID: C2[4].slice(1).slice(0, -1)#Panaikinam pirmą ir paskutinį ' ('nr Pvz')
				isTotalLoss: C2[5],isInjuredPersons: parseInt(C2[6],10),days: C2[7],perDay: C2[8],lossAmount: d.LossAmount, claimStatus: d.claimStatus
				newClaim: false,typeID: TypeID, deleteButton:true, noInsurance: if C2[2]=="0" then true else false #insPolicyID
			)	
		else #newClaim
			TypeID = $("#divNewClaimCard").data("ctrl").ClaimTypeID
			Claim = Em.Object.create(
				iD: 0,vehicleID: "",insPolicyID: "",insuranceClaimAmount: 0,insurerClaimID: ""
				isTotalLoss: 0,isInjuredPersons: 0,days: 5,perDay: 500,lossAmount: (if TypeID==6 then 2500 else 0) #(->@get('days')*@get('perDay')).property('days','perDay')
				newClaim: true,typeID: TypeID, noInsurance: false
			)
		App.claimEditController.set("claim", Claim)

		console.log("init Claim.Type - "+TypeID)
	templateName: 'tmpClaimEdit'
)
App.claimEditController = Em.Controller.create(#save, delete, cancel Claims events
	fnToggle_noInsurance: (e)->
		t=e.target; chk=if (t.tagName.toUpperCase()=="INPUT") then $(t) else $(t).find("input:checkbox")
		noInsurance=@claim.noInsurance; 
		if not e.isTrigger 
			noInsurance=not noInsurance #Jei trigeris nereikia apvers, nes ten jau teisinga reiksme
			chk.toggleClass("UpdateField")
			@claim.set('noInsurance', noInsurance)
		console.log(@claim.get('noInsurance'))
		chk.attr("checked", noInsurance)
		content=$("#ClaimDetailsContent");eToggle=content.find("div.js-toggle")
		content.find("button.btnSave").attr("disabled",false);
		#$("#ClaimDetailsContent").find("div.js-toggle").toggle().end().find("button.btnSave").attr("disabled",false);
		if noInsurance then chk.addClass("UpdateField"); eToggle.hide()
		else chk.removeClass("UpdateField"); eToggle.show(); $("#InsuredClaimList").data("newval","") #.data("ctrl").Value="";#Kad sita updatintu
		if $('#IsInjuredPersons').length then $('#IsInjuredPersons').prop("checked",false); $("#InsuranceClaimAmount").parent().parent().hide() #Jeigu yra IsInjuredPersons atslepiant varnele bus nuimta, o lauko nerodom
		false
	deleteForm: (e) ->
		oData=oDATA.GET("proc_Claims"); context=e.view._parentView.templateData.view.rowContext;
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
					oData.Data.removeRowByID(parseInt(updData.DataToSave.id,10)) #ištrinam ir iš proc_Claims jau ištrintą žalą					
					#oData.Data.removeRowByID(p.id) data.removeRowByProperty("id",p.id)
					$("#accidentsTable").find("div.selectedAccident").trigger("click")
			)
	fnUpdateAccident: (resp)-> #also used when updating claimStatus from claim regulation
		newRow = resp.ResponseMsg.Ext.replace(/#\|#\|/g,":::").split("|#|"); newRow[13]=newRow[13].replace(/:::/g,"#|#|") #atkeičiam atgal
		App.accidentsController.get("setNewVal").call(App.accidentsController, {newVal:newRow,toAppend:false,fieldsToInt:[0, 1, 5, 6, 7, 8]})[0] #kuriuos reikia paverst integeriais
		tr = $("#accidentsTable").find("div.selectedAccident") #.empty()
		tr.trigger("click").trigger("click")	
	saveForm: (e) ->
		newClaim=e.view._context.newClaim; accidentID=e.view._parentView.templateData.view.rowContext.accidentID
		if newClaim
			frm=$('#divNewClaimCard'); Action='Add'
			Msg= Title: "Naujos žalos sukūrimas", Success: "Nauja žala sukurta.", Error: "Nepavyko išsaugot naujos žalos."
		else
			frm=$('#divClaimCard_Content'); Action='Edit'
			Msg= Title: "Žalos redagavimas", Success: "Žalos duomenys pakeisti.", Error: "Nepavyko pakeisti žalos duomenų."
		DataToSave = oCONTROLS.ValidateForm(frm)
		if (DataToSave)
			if newClaim
				DataToSave.Fields.push("ClaimTypeID"); DataToSave.Data.push(e.view._context.typeID)
				DataToSave.Fields.push("AccidentID"); DataToSave.Data.push(accidentID)
			DataToSave["Ext"] = accidentID
			opt = Action: Action, DataToSave: DataToSave, CallBack: {Success: @fnUpdateAccident}, Msg: Msg
			SERVER.update(opt)
	cancelForm: (e) ->
		t=$(e.target); tr=t.closest("tr")
		if (tr.find("td.selectedClaim").length)#Redaguojama žala
			MY.tabAccidents.SelectedClaimView.remove()
			tr.parent().find("tr.selectedClaim").removeClass("selectedClaim title").next("tr").remove()
		else #nauja žala
			if MY.tabAccidents.NewClaimView then MY.tabAccidents.NewClaimView.remove()
			$("#divNewClaimCard").remove()
			$("#AccDetailsContent").find('div.rightFooterBig').show()
)
#***************************************Controler**************************************************************
App.accidentsController = Em.ResourceController.create(
	url: "Accident/AccidentsList",#jei yra atsisiunčiam
	tableName: "proc_Accidents",#jei yra, turinį į content
	currency: 'Lt'
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
			AddWr.slideUp(App.accidentsController.animationSpeedEnd, () -> 
				if tr.hasClass("selectedAccident") then tr.removeClass("selectedAccident"); AddWr.remove();
				else parent.find("div.selectedAccident").removeClass("selectedAccident"); AddWr.remove(); me.addClaim(e,tr);) 
		#else if MY.tabAccidents.AcccidentdetailsView #jei filtruojant pakavojom ir spaudziam kitur panaikinam jį. Pridėjus  AddWr.remove(); užkomentavom ir šitą. Lygtai viskas veikia Ok.
			#MY.tabAccidents.AcccidentdetailsView.destroy();MY.tabAccidents.AcccidentdetailsView=null;$('div.dividers').remove()
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
		# App.router.transitionTo('claims','bla');
		# App.router.transitionTo('claimRegulation');
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
	#filterFromVisible: false
	filterCols: ['accType','driver','shortNote','userName','place','claims_C']#no neimam, nes jis jau yra claims_C
	filterValue:null
	chkDocs:null #chkWithDocs,#chkWithOutDocs
	chkOpen:null #chkWithOpen,#chkWithoutOpen
	chkData:null #chk12month,#chk2011,#chk2010,#chk2009
	chkClaim:null #chkClaim_1,chkClaim_2,chkClaim_3,chkClaim_4,chkClaim_5,chkClaim_6
	filterByField: (row)->#jei yra filterValue grazina true jei ten randa, jei ne grazina true visada
		if not @filterReduced
			if (row.filterToHide) then return false #hidden by textFilter so return
		me=this;ret=false;cols=JSON.parse(JSON.stringify(me.filterCols)); #console.log("Filtering by val:"+cols)
		fnFilter =(i)-> 
			if (row[cols[i]].toLowerCase().indexOf(me.filterValue)>-1) then true else false
		console.log("---Start filtering----")
		for i in [0...cols.length] by 1			
			if fnFilter(i) then console.log("true - "+row[cols[i]]); ret=true; break;
			else console.log("false - "+row[cols[i]]); ret=false;
		console.log("---End filtering----")
		row.set("filterToHide",not ret);
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
			#console.log('claims_TypeID: '+ row.claims_TypeID+' - '+this.chkClaim);
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
# App.newClaimController = Em.ResourceController.create(
	# # tableName: "?"
	# #    setContent: function (ArrView) {
	# #    	@set("content", ArrView)
	# #    }
# )
App.sidePanelController = Em.ResourceController.create(
	tableName: "?"
	chkHandler: (lbl, option)->		
		#newVal=if (chk.attr("checked")) then chk.data("opt") else null
		lbl.parent().find("label").not(lbl).removeClass("ui-state-active")
		newVal=if (lbl.hasClass("ui-state-active")) then lbl.attr("for").replace("chk_claimTypes","").replace("chk_date","") else null
		#lbl.toggleClass("ui-state-active")
		App.accidentsController.set(option,newVal)
	init: -> 
		@_super();
		oDATA.execWhenLoaded(["tblClaimTypes"],()=>
			# @.set('years',oDATA.GET("proc_Years").emData)
			# @.set('claimTypes',oDATA.GET("tblClaimTypes").emData)
			@.set('years',oDATA.GET("proc_Years").emData.map((item)->item.chkId="chk_date"+item.year; return item))
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
			$("#sidePanel").closest("div.col2").stickyPanel()
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
		$("#sidePanel").find("label.ui-state-active").removeClass("ui-state-active")
		$("#sidePanel").find("input:checkbox").removeAttr("checked").parent().next().next().find("span.ui-checkbox-icon").removeClass("ui-icon ui-icon-check").attr("aria-checked","false")				

		ctrl=App.accidentsController
		ctrl.chkOpen=null; ctrl.chkDocs=null
		ctrl.chkData=null; ctrl.chkClaim=null
		ctrl.filterDidChange(@,'All')	
		#e.stopPropagation();
		#e.preventDefault();
		#if $(this.target).attr("checked") then $(this.target).attr("checked", "") else $(this.target).attr("checked", "checked")	
)
MY.tabAccidents={}
