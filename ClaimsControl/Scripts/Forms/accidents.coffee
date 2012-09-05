
`var w=window, App=w.App, Em=w.Em, oGLOBAL=w.oGLOBAL, oDATA=w.oDATA, oCONTROLS=w.oCONTROLS, MY=w.MY`
App.AccidentsView = App.mainMenuView.extend(
	content: null
	viewIx: 0
	templateName: 'tmpAccidentsMain'
	init: -> 
		@_super()
		console.log("accidentInit")
	didInsertElement: -> 
		alert("loaded")
		@_super()
		console.log("I loaded all accidents")
	#contentObserver: (->
	#	@rerender()
	#	alert("App.AccidentsssssView has changed!")
	#	).observes("App.accidentsController.content")
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
					accidentID: @get("iD")
		App.thisAccidentController.set("content", objView) #butinai masyvas
		App.thisAccidentController.set("accidentID", @get("iD")) #butinai masyvas
	tbodyClick: (e) -> #Reik daryti tik kai ant claimo, kitu atveju matyt išeinam
		tr = $(e.target).closest("tr")
		tr.parent().find("tr.selectedClaim").removeClass("selectedClaim title")
		ClaimW = $("#ClaimWraper")
		if (ClaimW.length > 0)
			MY.accidents.SelectedClaimView.remove()
			ClaimW.remove();
		d = e.context;
		MY.accidents.SelectedClaimView = App.SelectedClaimView.create(
			rowContext: { Claims2: d.Claims2, newClaim: false, LossAmount: d.loss, InsuranceType: d.type, accidentID: d.accidentID }
			elementId: "ClaimDetailsContent", contentBinding: 'App.claimEditController.content'
		)
		tr.addClass("selectedClaim title").after("<tr><td id='ClaimWraper' colspan='7' class='selectedClaim content'></td></tr>");
		MY.accidents.SelectedClaimView.appendTo("#ClaimWraper");
		Em.run.next(() -> $("#ClaimDetailsContent").slideDown() )
		false		
	newClaim: (e) ->
		nTr = $(e.target).closest('div.tr')[0]
		$(nTr).replaceWith("<div id='divNewClaimCard' data-ctrl='{\"id\":\"0\",\"NewRec\":\"1\",\"Source\":\"tblClaims\",\"ClaimTypeID\":\"0\"}'></div>")
		d =	
			ctrl: $('#divNewClaimCard')
			oDATA: oDATA.GET("tblClaimTypes")
			opt: { val: 0, text: 1, FieldName: "ClaimTypeID", SelectText: "Pasirinkite žalos tipą:" }
			fnAfterOptClick: (T) ->
				$('#divNewClaimCard').find('#divClaimCardDetails,div.frmbottom').remove();
				#fnSetClaimCard(1, T)
				#naujam Claimsui imamas redaguojamas viewsas SelectedClaimView ir kitas kontroleris newClaimController
				if (MY.accidents.NewClaimView) ##($("#newClaimDetailsContent").length > 0)
					MY.accidents.NewClaimView.remove()
					$("#newClaimDetailsContent").remove();
				MY.accidents.NewClaimView = App.SelectedClaimView.create(
					#rowContext: { Claims2: d.Claims2, newClaim: true, LossAmount: d.loss, InsuranceType: d.type, accidentID: d.accidentID }
					rowContext: { newClaim: true, accidentID: App.thisAccidentController.get("accidentID") }
					elementId: "newClaimDetailsContent", contentBinding: 'App.newClaimController.content'
				)
				MY.accidents.NewClaimView.appendTo("#divNewClaimCard")
				Em.run.next(() -> $("#newClaimDetailsContent").slideDown() )
				false
				fnCancel: () -> $("#accidentsTable").find("div.selectedAccident").trigger("click")# $(nTr).find('td').html(CancelNewClaimHtml)
			fnCancel: () -> $("#accidentsTable").find("div.selectedAccident").trigger("click") #$(nTr).find('td').html(CancelNewClaimHtml)
		oCONTROLS.Set_Updatable_HTML.mega_select_list(d)
		false
	elementId: "AccDetailsContent"
	contentBinding: 'App.thisAccidentController.content'
	destroyElement: () -> MY.accidents.SelectedClaimView.remove() if (MY.accidents.SelectedClaimView)
)
App.SelectedClaimView = Em.View.extend(
	didInsertElement: ->
		frm=if this.rowContext.newClaim then "#divNewClaimCard" else '#divClaimCard'
		oCONTROLS.UpdatableForm(frm)
		$("#inputDays, #inputPerDay").on("keyup",-> $("#inputSum").val(($("#inputDays").val()*$("#inputPerDay").val()));)
	init: ->
		@_super(); d = @get("rowContext");		
		if not d.newClaim
			C2 = d.Claims2; TypeID = oDATA.GET("tblClaimTypes").Data.findColValByColVal(d.InsuranceType, 1, 0)
			#Claims2: 0-ClaimID, 1-VehicleID, 2-InsPolicyID, 3-InsuranceClaimAmount, 4-InsurerClaimID, 5-IsTotalLoss, 6-IsInjuredPersons, 7-Days, 8-PerDay
			Claim =
				ID: C2[0],VehicleID: C2[1],InsPolicyID: C2[2],InsuranceClaimAmount: C2[3],InsurerClaimID: C2[4]
				IsTotalLoss: C2[5],IsInjuredPersons: C2[6],Days: C2[7],PerDay: C2[8],LossAmount: d.LossAmount
				NewClaim: false,TypeID: TypeID
			App.claimEditController.set("content", [Claim]) #butinai masyvas view'e su each		
		else #newClaim
			TypeID = $("#divNewClaimCard").data("ctrl").ClaimTypeID
			Claim =
				ID: 0,VehicleID: 0,InsPolicyID: 0,InsuranceClaimAmount: 0,InsurerClaimID: ""
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
						newRow = (resp.ResponseMsg.Ext).split("|#|")
						if newRow.length==18
							claims_c=newRow.slice(13,17).join("|#|"); claims_c2=newRow[17]; newRow=newRow.slice(0,13)
							newRow[13]=claims_c; newRow[14]=claims_c2
						#setNewVal: function ({newVal:??,toAppend:true/false, fieldsToInt:??}) {
						#toAppend:false - nes net ir žalos pridėjimas tai tik accidento pakeitimas (jos visos ten susirašo
						App.accidentsController.get("setNewVal").call(App.accidentsController, {newVal:newRow,toAppend:false,fieldsToInt:[0, 1, 5, 6, 7, 8]})[0] #kuriuos reikia paverst integeriais
						#var newContext = App.accidentsController.findProperty("iD",parseInt(newRow[0], 10))
						#var newView = App.AccidentView.create({
						#    content:newContext,
						#    templateName: "tmpAccidentRow"
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
	DeleteClaim: () ->
		alert("DeleteSaveClaim")
	templateName: 'tmpClaimEdit'
	#elementId: "ClaimDetailsContent",
	#contentBinding: 'App.claimEditController.content'
)
#***************************************Controler**************************************************************
App.accidentsController = Em.ResourceController.create(
	filter: null,
	tableName: "proc_Accidents",
	fields: {},
	tbodyClick: (e) ->
		AddD = $("#AccDetailsWraper")
		AddD.parent().find("div.selectedAccident").removeClass("selectedAccident").end().find("div.dividers").remove()
		if (AddD.length > 0)
			MY.accidents.AcccidentdetailsView.remove()
			AddD.remove()
		#if (e.isTrigger)
		#    e.context=App.accidentsController.get("getByID").call(App.accidentsController,e.context[0])
		#    $(e.target).closest("div.tr").replaceWith((Em.TEMPLATES["tmpAccidentRow"](e.context)) )
		tr = $(e.target).closest("div.tr").addClass("selectedAccident")
		MY.accidents.AcccidentdetailsView = App.SelectedAccidentView.create(e.context)
		tr.after("<div id='AccDetailsWraper'></div><div class='dividers'></div>").prev().before("<div class='dividers'></div>")
		MY.accidents.AcccidentdetailsView.appendTo("#AccDetailsWraper")
		if e.isTrigger
			Em.run.next(-> $("#AccDetailsContent, div.dividers").show())
		else
			Em.run.next(-> $("#AccDetailsContent, div.dividers").slideDown())
		false
	# filteredRecords: (->
		# f = @get("filter")
		# if (!f)
			# @get('content')
		# else
			# f = f.toLowerCase()
			# @get('content').filter((item, index, self)->
				# item[3].toLowerCase().indexOf(f) + item[4].toLowerCase().indexOf(f) + item[9].toLowerCase().indexOf(f) + item[10].toLowerCase().indexOf(f) + item[11].toLowerCase().indexOf(f) + item[12].toLowerCase().indexOf(f) + item[13].toLowerCase().indexOf(f) + item[14].toLowerCase().indexOf(f) > -8
			# )
	# ).property('filter', 'content.@each').cacheable(),
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
		false
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

MY.accidents={}