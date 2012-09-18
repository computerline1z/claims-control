
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
					accidentID: @get("iD"), accidentDate: @date
		App.thisAccidentController.set("content", objView) #butinai masyvas
		App.thisAccidentController.set("accidentID", @get("iD")) #butinai masyvas		
	tbodyClick: (e) -> #Reik daryti tik kai ant claimo, kitu atveju matyt išeinam
		#fnFilterPolicies=(i)-> if (oGLOBAL.date.firstBigger(i[4],options.contexts[0].rowContext.accidentDate)) then return [i] else return null
		accidentDate=@date
		thisAccidentPolicies=$.map(oDATA.GET("proc_InsPolicies").Data, (i)-> if (oGLOBAL.date.firstBigger(i[4],accidentDate)) then return [i] else return null)
		proc_InsPolicies_forThisAccident=$.extend({},oDATA.GET("proc_InsPolicies"),{Data:thisAccidentPolicies})#not deep copy -overwrite
		oDATA.SET("proc_InsPolicies_forThisAccident", proc_InsPolicies_forThisAccident)
		tr = $(e.target).closest("tr");ClaimW = $("#ClaimWraper")
		if (ClaimW.length > 0)
			MY.accidents.SelectedClaimView.remove()
			ClaimW.remove();	
		tr.parent().find("tr.selectedClaim").removeClass("selectedClaim title")
		d = e.context;
		MY.accidents.SelectedClaimView = App.SelectedClaimView.create(
			rowContext: { Claims2: d.Claims2, newClaim: false, LossAmount: d.loss, InsuranceType: d.type, accidentID: d.accidentID, accidentDate: d.accidentDate }
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
		c=this.content[0]
			# $("#IsInjuredPersons").attr("checked")
			# if (c.IsInjuredPersons)
				# console.log("dsf")
			# else 
				# console.log("dsf")
			
		frm=if c.NewClaim then "#divNewClaimCard" else '#divClaimCard'
		oCONTROLS.UpdatableForm(frm)
		if c.TypeID==2
			IClaim=$("#InsuranceClaimAmount").parent(); IClaim.find("span").html("Planuojama žalos suma asmeniui")
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
			C2 = d.Claims2; TypeID = oDATA.GET("tblClaimTypes").Data.findColValByColVal(d.InsuranceType, 1, 0)
			#Claims2: 0-ClaimID, 1-VehicleID, 2-InsPolicyID, 3-InsuranceClaimAmount, 4-InsurerClaimID, 5-IsTotalLoss, 6-IsInjuredPersons, 7-Days, 8-PerDay
			Claim =
				ID: C2[0],VehicleID: C2[1],InsPolicyID: C2[2],InsuranceClaimAmount: C2[3],InsurerClaimID: C2[4]
				IsTotalLoss: C2[5],IsInjuredPersons: parseInt(C2[6],10),Days: C2[7],PerDay: C2[8],LossAmount: d.LossAmount
				NewClaim: false,TypeID: TypeID
			App.claimEditController.set("content", [Claim]) #butinai masyvas view'e su each		
		else #newClaim
			TypeID = $("#divNewClaimCard").data("ctrl").ClaimTypeID
			Claim =
				ID: 0,VehicleID: 0,InsPolicyID: "",InsuranceClaimAmount: 0,InsurerClaimID: ""
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
						#newRow = (resp.ResponseMsg.Ext).split("|#|")
						#if newRow.length==18
						#	claims_c=newRow.slice(13,17).join("|#|"); claims_c2=newRow[17]; newRow=newRow.slice(0,13)
						#	newRow[13]=claims_c; newRow[14]=claims_c2
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
	filter: null,
	tableName: "proc_Accidents",
	fields: {},
	removeClaims: (AddWr) ->
		AddWr.parent().find("div.dividers").remove()
		if (AddWr.length > 0)
			MY.accidents.AcccidentdetailsView.remove(); AddWr.remove(); # AddWr.hide('slow', () -> AddWr.remove();) 
	tbodyClick: (e) ->
		tr = $(e.target).closest("div.tr")
		AddWr = $("#AccDetailsWraper"); parent=tr.parent()		
		if tr.hasClass("selectedAccident") and not e.isTrigger
			if parent.find("div.dividers").length
				this.removeClaims(AddWr); return false; #Ištrinam ir išeinam
			#atidarom
		else
			parent.find("div.selectedAccident").removeClass("selectedAccident"); this.removeClaims(AddWr) #priešingu atveju ištrinam ir pridedam
			
		tr.addClass("selectedAccident")	if not tr.hasClass("selectedAccident")
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