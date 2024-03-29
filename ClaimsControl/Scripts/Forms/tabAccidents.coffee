
`var w=window, App=w.App, Em=w.Em, oGLOBAL=w.oGLOBAL, oDATA=w.oDATA, oCONTROLS=w.oCONTROLS, MY=w.MY;`
App.tabAccidentsView = App.mainMenuView.extend(
	content: null
	viewIx: 0
	templateName: 'tmpAccidentsMain'
)
App.AccidentView = Em.View.extend(
	templateName: 'tmpAccidentRow' #<div class="tr accident" @Html.Raw("{{action tbodyClick this target=\"this\"}}")>
	tagName: ""
)
App.SelectedAccidentView = Em.View.extend(
	templateName: 'tmpAccident_Claims'
	init: ->
		@_super(); App.thisAccidentController.setContent(@)
	tbodyClick: (e) -> #Reik daryti tik kai ant claimo, kitu atveju matyt išeinam
		tr = $(e.target).closest("tr");
		clickOnSelected=if (tr.hasClass("selectedClaim")) then true else false
		App.claimEditController.removeOpenClaimDetails()
		#tr.parent().find("tr.selectedClaim").removeClass("selectedClaim title")
		if clickOnSelected then return false #Ant pasirinkto naujo nededam
		d = e.context;
		MY.tabAccidents.SelectedClaimView = App.SelectedClaimView.create(
			rowContext: { Claims2: d.Claims2, newClaim: false, LossAmount: d.loss, InsuranceType: d.type, accidentID: d.accidentID, accidentDate: d.accidentDate, claimStatus: d.claimStatus }
			elementId: "ClaimDetailsContent", contentBinding: 'App.claimEditController.oldClaim'
		)
		tr.addClass("selectedClaim title").after("<tr><td id='ClaimWraper' colspan='7' class='selectedClaim content'></td></tr>");
		MY.tabAccidents.SelectedClaimView.appendTo("#ClaimWraper");
		Em.run.next(() -> $("#ClaimDetailsContent").slideDown() )
		false		
	newClaim: (e) ->
		nTr = $(e.target).closest('div.tr'); $(e.target).closest('div.rightFooterBig').hide();
		#Naudojam šito rekvizitus, nes divNewClaimCard_Content dar nėra
		nTr.append("<div id='divNewClaimCard' class='js-frm' data-ctrl='{\"id\":\"0\",\"NewRec\":\"1\",\"Source\":\"proc_Claims\",\"ClaimTypeID\":\"0\"}'></div>")
		fnCancelNewClaim=()->$("#divNewClaimCard").remove(); $("#AccDetailsContent").find('div.rightFooterBig').show()
		d =	
			ctrl: $('#divNewClaimCard')
			oDATA: oDATA.GET("tblClaimTypes")
			opt: { val: "iD", text: "name", FieldName: "ClaimTypeID", SelectText: "Pasirinkite žalos tipą:" }
			fnAfterOptClick: (T) ->
				#App.claimEditController.removeOpenClaimDetails()
				$('#divNewClaimCard').find('#divNewClaimCard_Content,div.frmbottom').remove();
				#fnSetClaimCard(1, T)
				if (MY.tabAccidents.NewClaimView) ##($("#newClaimDetailsContent").length > 0)
					MY.tabAccidents.NewClaimView.remove()
					$("#newClaimDetailsContent").remove();
				MY.tabAccidents.NewClaimView = App.SelectedClaimView.create(
					#rowContext: { Claims2: d.Claims2, newClaim: true, LossAmount: d.loss, InsuranceType: d.type, accidentID: d.accidentID }
					rowContext: { newClaim: true, accidentID: App.thisAccidentController.get("accidentID") }
					elementId: "newClaimDetailsContent", contentBinding: 'App.claimEditController.newClaim'
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
		false
		# Ember.State.transitionTo('claimRegulation',1);
	elementId: "AccDetailsContent"
	contentBinding: 'App.thisAccidentController.content'
	destroyElement: () -> MY.tabAccidents.SelectedClaimView.remove() if (MY.tabAccidents.SelectedClaimView)
)
App.SelectedClaimView = Em.View.extend(
	didInsertElement: ->
		c=@rowContext;typeID=@content.typeID;thisCtrl=@$();
		frm=if c.newClaim then "#divNewClaimCard" else '#divClaimCard_Content' # Negalim naudot '#divNewClaimCard_Content', nes divNewClaimCard yra data-ctrl, nes ten mes dedam žalos tipą kai dar nėra divNewClaimCard_Content
		btnSaveToDisable=if c.newClaim then $(frm).find("button.btnSave") else $(frm).next().find("button.btnSave")
		oCONTROLS.UpdatableForm(frm:frm,btnSaveToDisable:btnSaveToDisable)
		if typeID==2
			IClaim=thisCtrl.find(".js-InsuranceClaimAmount").parent().parent(); IClaim.find("span").html("Žalos suma asmeniui");
			thisCtrl.find('.js-lossAmount').parent().find("span").html("Žalos suma turtui");
			fnCheckIsInjured =() ->
				if this.attr("checked") then IClaim.css("display","block").find("input").data("ctrl").Validity=IClaim.find("input").data("ctrl").Validity.replace("require().","")
				else IClaim.css("display","none").find("input").val("").data("ctrl").Validity="require()."+IClaim.find("input").data("ctrl").Validity				
				# IClaim.css("display", (if this.attr("checked") then "block" else "none"))
				# $($0).data("ctrl").Validity=$($0).data("ctrl").Validity.replace("require()","")
			isInjured=thisCtrl.find('.js-IsInjuredPersons'); fnCheckIsInjured.call(isInjured)
			isInjured.on("click",-> fnCheckIsInjured.call(isInjured))#.click();	
		#$("#inputDays,#inputPerDay").on("keyup",-> $("#inputSum").val(($("#inputDays").val()*$("#inputPerDay").val()));)
		if typeID==6
			# inpSum=$(frm).find('.inputSum input'); days=$(frm).find('.days input');perDay=$(frm).find('.perDay input')
			# $(frm).find('.days input,.perDay input').on("keyup",-> inpSum.val(days.val()*perDay.val());)
			# $("#claimEditDays,#claimEditPerDay").on("keyup",$.proxy(->
			thisCtrl.find(".js-claimEditDays, .js-claimEditPerDay").on("keyup",$.proxy(->
				@.find('.js-lossAmount').setVal(@.find(".js-claimEditDays").getVal()*@.find(".js-claimEditPerDay").getVal());
				#$("#LossAmount").val($("#claimEditDays").val()*$("#claimEditPerDay").val());
			,thisCtrl)
			)
			
		if c.claimStatus>2
			inputs=$(frm).find("input")
			$(frm).find("input").filter(".js-lossAmount, .js-claimEditDays")
			$(frm).find("input").filter(".js-lossAmount, .js-claimEditDays")
			if c.claimStatus=="3" then inputs=inputs.filter(".js-lossAmount").prop('title', 'Suma jau patvirtina')
			else if c.claimStatus=="4" then inputs=inputs.filter(".js-lossAmount, .insuranceClaimAmount").prop('title', 'Suma jau patvirtina')
			else if c.claimStatus=="5"
				$(frm).parent().find("button").prop("disabled", true); inputs.prop('title', 'Žala uždaryta')#claimStatus==5 disabled everything
			inputs.prop("disabled", true)
		fnToggle_noInsurance=(content,isClicked)->#this == current form 
			noInsurance=content.noInsurance; 
			chk=$(".js-NotInsuredClaim").find("input")
			if not chk.data("ctrl") then chk.data("ctrl", {"Type":"Boolean","Value":"0","ToggleValue":true,"Field":"InsPolicyID"})#Kad pagal šitą updatintusi
			if isClicked then @.find("button.btnSave").attr("disabled",false);
			
			eToggle=@find("div.js-toggle")		
			if noInsurance then chk.addClass("UpdateField"); eToggle.hide()
			else chk.removeClass("UpdateField"); eToggle.show(); @find("js-InsuredClaimList").data("newval","") #.data("ctrl").Value="";#Kad sita updatintu
			isInjured=@find('.js-IsInjuredPersons');
			if isInjured.length
				claimAmount=@find('.js-InsuranceClaimAmount').closest('.ExtendIt')
				if isInjured.prop("checked") then claimAmount.show() else claimAmount.hide()#Jeigu yra IsInjuredPersons atslepiant varnele bus nuimta, o lauko nerodom
			false
		cnt=@content;frm=$("#"+this.elementId)
		cnt.addObserver('noInsurance',-> fnToggle_noInsurance.call(frm,cnt,true))
		fnToggle_noInsurance.call(frm,cnt,false)
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
			App.claimEditController.set("oldClaim", Claim)
		else #newClaim
			TypeID = $("#divNewClaimCard").data("ctrl").ClaimTypeID
			Claim = Em.Object.create(
				iD: 0,vehicleID: "",insPolicyID: "",insuranceClaimAmount: 0,insurerClaimID: ""
				isTotalLoss: 0,isInjuredPersons: 0,days: 5,perDay: 500,lossAmount: (if TypeID==6 then 2500 else 0) #(->@get('days')*@get('perDay')).property('days','perDay')
				newClaim: true,typeID: TypeID, noInsurance: false
			)
			App.claimEditController.set("newClaim", Claim)
		
		console.log("init Claim.Type - "+TypeID)
	templateName: 'tmpClaimEdit'
)
App.claimEditController = Em.Controller.create(#save, delete, cancel Claims events
	removeOpenClaimDetails:() ->
		ClaimW = $("#ClaimWraper").closest('tbody').find('.selectedClaim').removeClass('selectedClaim title').end().end()
		if (ClaimW.length > 0)
			MY.tabAccidents.SelectedClaimView.remove()
			ClaimW.remove(); false

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
		#tr = $("#accidentsTable").find("div.selectedAccident") #.empty()
		#tr.trigger("click").trigger("click")	
	saveForm: (e) ->
		@goToLastClick()
		newClaim=e.view._context.newClaim; accidentID=e.view._parentView.templateData.view.rowContext.accidentID; tr=$("#accidentsTable").find("div.selectedAccident"); clickedCtrl=$(e.target)
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
			fnAfterUpdate=(resp, updData)-> #Sinhronizuojam su "proc_Claims"
				me=App.claimEditController; me2=App.sidePanelController
				rowArr=me.fnUpdateAccident.call(me,resp);
				me2.refreshPanels.call(me2, "refreshClaims"); 
				id=resp.ResponseMsg.ID; if not id then id=updData.DataToSave.id;
				SERVER.updateRecord("Main/claim",{id:id},"proc_Claims",updData.Action)
				App.thisAccidentController.setContent_afterEdit(accidentID:rowArr[0],claimID:id,Action:updData.Action,cancelCtrl:clickedCtrl.next())
				#@tr.trigger('click')
				#Em.run.later(@,(->@tr.trigger("click");console.log("trigger click");console.log(@tr)),500)
				false
			opt = Action: Action, DataToSave: DataToSave, CallBack: {Success: $.proxy(fnAfterUpdate,tr:tr)}, Msg: Msg
			SERVER.update(opt)
			false
	cancelForm: (e) ->
		@goToLastClick()
		t=$(e.target); tr=t.closest("tr")
		if (tr.find("td.selectedClaim").length)#Redaguojama žala
			MY.tabAccidents.SelectedClaimView.remove()
			tr.parent().find("tr.selectedClaim").removeClass("selectedClaim title").next("tr").remove()
		else #nauja žala
			if MY.tabAccidents.NewClaimView then MY.tabAccidents.NewClaimView.remove()
			$("#divNewClaimCard").remove()
			$("#AccDetailsContent").find('div.rightFooterBig').show()
	goToLastClick: () ->
		if @scroolBack
			Em.run.next(@scroolBack,()->
				@tr[0].scrollIntoView();@tr.trigger("click")
				if @div then @div[0].remove()
				App.claimEditController.scroolBack=null; return false
			)
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
		console.log("removeClaims")
		#$("#divAccidentsList").find("div.validity-tooltip").remove()
		#$("div.validity-tooltip").remove()
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
		tr.after("<div id='AccDetailsWraper'></div><div class='dividers'></div>") #.prev().before("<div class='dividers'></div>")
		MY.tabAccidents.AcccidentdetailsView.appendTo("#AccDetailsWraper")
		if e.isTrigger
			Em.run.next(-> $("#AccDetailsContent, div.dividers").show())
		else
			Em.run.next(-> $("#AccDetailsContent, div.dividers").slideDown(App.accidentsController.animationSpeedStart))	
	tbodyClick: (e) ->
		tr = $(e.target).closest("div.tr");
		#---------------------------------	
		button=$("#accidentsTable").find("button.btnSave")
		if button.length then if not button.prop("disabled") #Kazka redaguoja pasiulom pirma išsaugot arba atšaukt
			offset=button.parent().offset();button.parent()[0].scrollIntoView()
			div = $("<div class='js-tip js-tip-warning' style='left:" + offset.left + "px;top:" + offset.top + "px;width:250px;margin-left:-50px;'>"+App.Lang.forms.accidents.scroll_warn+"</div>").appendTo("body")
			if offset.top - div.height() - 20 > $(window).scrollTop() #Telpa - dedam viršuj
				div.addClass("js-tip-top").offset top: (div.offset().top - div.height() - 20)
			else #Netelpa - dedam apacioj
				div.addClass("js-tip-bottom").offset top: (div.offset().top + ext.height() + div.height())
			div.fadeIn("slow").click(->@remove();)
			App.claimEditController.scroolBack=tr:tr,div:div
			return false
		#---------------------------------	
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
		if MY.tabAccidents.AcccidentdetailsView
			dtl=MY.tabAccidents; dtl.AcccidentdetailsView.remove(); dtl.AcccidentdetailsView=null
			$('#AccDetailsWraper').next('div.dividers').remove().end().prev().removeClass('selectedAccident').end().remove()
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
	getContent:(context)->
		console.log("getContent CONTEXT:")
		console.log(context)
	
		`var ArrView = [],objView=[],claimsTypeID=context.claims_TypeID.split('#')`
		ArrClaims = context.claims_C.replace(new RegExp('{{(.*?)}}', 'gm'), '').split('#||'); #Iskertam nenaudojamus tarp{{ ir}}//?-kad nebutu greedy
		ArrClaims2 = context.claims_C2.split('#||');
		if (ArrClaims[0] != "")
			iterator=ArrClaims.length-1; i=-1
			while ((i++)<iterator)
				clTypeID=claimsTypeID[i]
				ArrView[i] = 
					Claims: ArrClaims[i].split('#|'),
					Claims2: ArrClaims2[i].split('#|')
				#Claims: 0-ClaimStatus,1-No,2-ClaimType(text),3-Vehicle,4-Insurer(text),5-lossAmount
				#Claims2: 0-ClaimID, 1-VehicleID, 2-InsPolicyID, 3-InsuranceClaimAmount, 4-InsurerClaimID, 5-IsTotalLoss, 6-IsInjuredPersons, 7-Days, 8-PerDay	
				objView[i] = Em.Object.create(
					finished: (if(ArrClaims[i][0] == "5") then true else false), no: ArrView[i].Claims[1], type: ArrView[i].Claims[2]
					autoNo: ArrView[i].Claims[3], insurer: ArrView[i].Claims[4], loss:ArrView[i].Claims[5] # tmpAccident_Claims.cshtml naudos totalLoss jei jo nėra, tada loss
					totalLoss:(if (ArrView[i].Claims2[2]!="0" and ArrView[i].Claims2[6] and clTypeID=="2" and not isNaN(parseFloat(ArrView[i].Claims2[3]))) then +ArrView[i].Claims[5]+ +ArrView[i].Claims2[3] else 0) # if InsPolicyID!=0 and IsInjuredPersons and clTypeID==2 and InsuranceClaimAmount is number then lossAmount+InsuranceClaimAmount else lossAmount
					Claims2: ArrView[i].Claims2, claimStatus:ArrClaims[i][0], claimID: parseInt(ArrView[i].Claims2[0],10)
					accidentID: context.iD, accidentDate: context.date
				)
		objView:objView,accidentID:context.iD
	setContent:(context)->
		obj=@getContent(context)
		@set("content", obj.objView).set("accidentID", obj.accidentID)
	setContent_afterEdit:(p)->#accidentID:,claimID:,Action:,cancelCtrl:
		accident=App.accidentsController.content.findProperty('iD',p.accidentID);#Surandam ivykio irasa
		objView=@getContent(accident).objView; #Gaunam visus ivykio claims'us
		if p.Action=="Add"
			@content.pushObject(objView[objView.length-1])#Pridedant visada bus paskutinis
		else
			newClaim=objView.findProperty("claimID",p.claimID)
			@content.findProperty("claimID",p.claimID).updateTo(newClaim)
		p.cancelCtrl.trigger('click'); false
)
App.sidePanelController = Em.ResourceController.create(
	chkHandlerToggle: (id,option,controller)->		
		$(id).buttonset().on("click",(e)->
			chk=$(e.target).closest("label").prev();
			newVal=if (chk.next().hasClass("ui-state-active")) then chk.attr("id") else null #Jei aktyvus priskiriam
			$(@).find("label").not(chk.next()).removeClass("ui-state-active").end().prev().not(chk).removeAttr("checked")	
			App[controller].set(option,newVal)
			false
		); return @
	chkHandler: (id,option,controller)->
		$(id).buttonset().on("click",(e)->
			e.preventDefault(); lbl=$(e.target).closest("label");
			lbl.parent().find("label").not(lbl).removeClass("ui-state-active")
			newVal=if (lbl.hasClass("ui-state-active")) then lbl.attr("for").replace("chkClaimAcc_","").replace("chk_date","").replace("chkInsurers_","").replace("chkData_","").replace("chkClaim_","") else null
			App[controller].set(option,newVal)
			false
		); if controller=="claimsController" or option=="chkClaim" then App.sidePanelController.fnHighlight(option,controller)#option=="chkClaim" kad highlightintu filtro btn po refresh
		return @
	#init: -> @_super();
	#refreshPanels paruošia duomenis paneliams tabAccidents ir tabClaims
	#duomenys turi but atskiri kiekvienam, kad junginėjant nesipjautu, bet to perjungiant is claims i accidents jie refresinami ir ant nauju varneliu neuzdedamas pluginas buttonset
	refreshPanels: (event)->#loadAcc arba loadCl arba refreshClaims refreshCriteria
		event=event
		# id(chkId2) reikalingas kaip elemento id. Antras claim side panelyje naudojamas
		#Po užkrovimo: uzsikrauna is App.SidePanelView.didInsertElement ir App.SidePanelForClaimsView.didInsertElement
		#Pridėjus naujų claimsu perpaisom tik claimsus
		#Pridejus ivykiu, draudiku, pasikeitus statusui perpaisom tik "Rodyti tik žalose" -> App.sidePanelController.refreshPanels("claimsAdded");

		claimTypes=[]; insurers=[]; policies=[]
		if not @years.length #metus dedam be kuriuo atveju
			@.set('years',oDATA.GET("proc_Years").emData.map((item)->item.chkId="chk_date"+item.year; item.chkId2="chkData_"+item.year; return item))
		oDATA.GET("proc_Claims").emData.forEach((claim)->
			if not claimTypes.contains(claim.claimTypeID) then claimTypes.push(claim.claimTypeID)
			if event=="loadCl" or event=="refreshCriteria"
				if not policies.contains(claim.insPolicyID) then policies.push(claim.insPolicyID)
				if not @isOpen then (if claim.claimStatus!=5 then @set('isOpen',true))
				if not @isWithWarnings then (if claim.warnings then @set('isWithWarnings',true))
				if not @isWithMyTasks then if claim.warnings then if claim.warnings.tasks
					if claim.warnings.tasks.filter((t)->t.toID==App.userData.userID).length then @set('isWithMyTasks',true)
				@set('isWith',(@isOpen or @isWithWarnings or @isWithMyTasks))
				policies.forEach((pID)->
					policy=oDATA.GET("proc_InsPolicies").emData.findProperty("iD",pID)
					insurerID=if policy then policy.insurerID else null
					if insurerID and not insurers.contains(insurerID) then insurers.push(insurerID)
				)
			if event=="loadCl"
				insurers=oDATA.GET("tblInsurers").emData.filter((i)->insurers.contains(i.iD)).map((item)->item.chkId="chkInsurers_"+item.iD; return item)
				@.set('insurers',insurers)
			false
		,@)
		if event=="refreshClaims" or not @claimTypes.length #Jei nera nieko arba refreshinam claimTypes
			claimTypes=oDATA.GET("tblClaimTypes").emData.filter((t)->claimTypes.contains(t.iD)).map((item)->
				if item.iD==0 then item.visible=false
				if item.iD==6 then item.notForClaims=true
				item.chkId="chkClaimAcc_"+item.iD; item.chkId2="chkClaim_"+item.iD; 
				return item;
			)
			@.set('claimTypes',claimTypes)
		if event=="refreshCriteria" then @attachBtnClaims(event);
		if event=="refreshClaims" then @attachBtnClaims(event);@attachBtnAccidents(event)
		return @
	fnAfterAtach:(panel)->
		panel=$(panel); if panel.hasClass('hidden') then panel.closest("div.col2").stickyPanel().end().removeClass('hidden')
	#$("#sidePanelCl").closest("div.col2").stickyPanel()
	attachBtnAccidents:(event)->
		Em.run.next({me:@,event:event},()->
			ctrl="accidentsController"
			if @event=="refreshClaims" then @me.chkHandler("#chkClaimsTypes","chkClaim",ctrl)
			else
				@me.chkHandlerToggle("#chkOpen","chkOpen",ctrl)
				.chkHandlerToggle("#chkDocs","chkDocs",ctrl)
				.chkHandler("#chkYears","chkData",ctrl)
				.chkHandler("#chkClaimsTypes","chkClaim",ctrl)
				.fnAfterAtach("#sidePanel")
		)
	attachBtnClaims:(event)->
		Em.run.next({me:@,event:event},()->
			clCtrl="claimsController"
			if @event=="refreshCriteria" then @me.chkHandler("#chkCriteria","chkCriteria",clCtrl)
			else if @event=="refreshClaims" then @me.chkHandler("#chkClaimsTypesCl","chkClaim",clCtrl)
			else
				@me.chkHandler("#chkCriteria","chkCriteria",clCtrl)
				.chkHandler("#chkInsurers","chkInsurers",clCtrl)
				.chkHandler("#chkYearsCl","chkData",clCtrl)
				.chkHandler("#chkClaimsTypesCl","chkClaim",clCtrl)
				.fnAfterAtach("#sidePanelCl")
		)
	fnHighlight: (valName,ctrl)->
		val=App[ctrl][valName]
		if val
			if ctrl=="accidentsController" then lbl=valName+"Acc_"+val
			else if valName=="chkCriteria" then lbl=val
			else lbl=valName+"_"+val
			lbl=$("#"+lbl).next('label');
			if not lbl.hasClass("ui-state-active") then lbl.addClass("ui-state-active")
	
	years:[], claimTypes:[],insurers:[], years:[]
)
App.SidePanelView = Em.View.extend(
	templateName: "tmpSidePanel"
	controller: App.sidePanelController
	panel:"#sidePanel"
	didInsertElement: ()->
		@_super(); oDATA.execWhenLoaded(["tblClaimTypes"], -> 
			@controller.refreshPanels("loadAcc").attachBtnAccidents()
		, @)	
	showAll: ()->		
		$(@panel).find("label.ui-state-active").removeClass("ui-state-active")
		$(@panel).find("input:checkbox").removeAttr("checked").parent().next().next().find("span.ui-checkbox-icon").removeClass("ui-icon ui-icon-check").attr("aria-checked","false")				
		ctrl=App.accidentsController
		ctrl.chkOpen=null; ctrl.chkDocs=null
		ctrl.chkData=null; ctrl.chkClaim=null
		ctrl.filterDidChange(@,'All')	
)
App.SidePanelForClaimsView = Em.View.extend(
	templateName: "tmpSidePanelForClaims"
	controller: App.sidePanelController
	panel:"#sidePanelCl"
	#didInsertElement: ()->
		#@_super(); App.sidePanelController.refreshPanels("loadCl").attachBtnClaims() - vyksta App.TabClaimsView.didInsertElement
	showAll: ()->		
		$(@panel).find("input:checkbox").removeAttr("checked").parent().next().next().find("span.ui-checkbox-icon").removeClass("ui-icon ui-icon-check").attr("aria-checked","false")
		$(@panel).find("label.ui-state-active").removeClass("ui-state-active")
		ctrl=App.claimsController
		ctrl.chkCriteria=null; ctrl.chkInsurers=null
		ctrl.chkData=null; ctrl.chkClaim=null
		ctrl.filterDidChange(@,'All')	
)

MY.tabAccidents={}
