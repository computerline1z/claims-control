
`var w=window, App=w.App, Em=w.Em, oGLOBAL=w.oGLOBAL, oDATA=w.oDATA, oCONTROLS=w.oCONTROLS, MY=w.MY;`
App.reportsStart=()->
	arrObj=["tblInsurers","proc_InsPolicies","proc_Vehicles","tblClaimTypes","proc_Accidents"]
	arrNames=["insurers","policies","vehicles","claimTypes","accidents"]
	oDATA.execWhenLoaded(arrObj, ()->
		ctrl=App.tabReportsController
		arrObj.forEach((obj,i)-> ctrl.set(arrNames[i],oDATA.GET(arrObj[i]).emData))
	)
### 
#	$("#reportType").ComboBox() pasirenkant reporta atsisiunciami duomenys
#
###
REPORTVIEW={}
App.tabReportsController = Em.ArrayController.create(
	target: (() -> @).property()
	content:[]; fields:[]
	insurers: {}, policies: {},	vehicles: {}, claimTypes: {}, accidents: {}
	getInsurerName:(insPolicyID)->
		if insPolicyID then @insurers.findProperty("iD",insPolicyID).name else "Neapdrausta"
	rep_claimsList:(oData)-> #proc_Claims
		#title=["Tipas","Įvykio data","Šalis","Įvykio tipas","Valst.Nr.","Vairuotojas","Kaltininkas","Draudikas","Sutartis","Žalos suma","Uždaryta"]
		content=oData.emData.map((row)=>
			acc=@accidents.findProperty("iD",row.accidentID); policy=@policies.findProperty("iD",row.insPolicyID)
			claimType:@claimTypes.findProperty("iD",row.claimTypeID).name,accDate:acc.date,accCountry:acc.place.slice(0,acc.place.indexOf(",")),accType:acc.accType,plate:@vehicles.findProperty("iD",row.vehicleID).plate,
			driver:acc.driver,quilty:(if acc.IsNotOurFault then "Trečia šalis" else "Mes"),insurer:@getInsurerName(policy.insurerID),policyNo:policy.policyNumber,lossAmount:row.lossAmount,
			closed:(if row.claimStatus==5 then "Taip" else "Ne"),iD:row.iD
		)
		fields=[{name:"claimType",title:"Tipas"},{name:"accDate",title:"Įvykio data"},{name:"accCountry",title:"Šalis"},{name:"accType",title:"Įvykio tipas"},{name:"plate",title:"Valst.Nr."},{name:"driver",title:"Vairuotojas"},
		{name:"quilty",title:"Kaltininkas"},{name:"insurer",title:"Draudikas"},{name:"policyNo",title:"Sutartis"},{name:"lossAmount",title:"Žalos suma"},{name:"closed",title:"Uždaryta"}]

		# for name, obj of fields 
			# obj.visible=true
		#fields.forEach((f)->f[Object.keys(f)[0]].visible=true)
		fields.forEach((f)->f.visible=true)
		@set("content",content).set("fields",fields).set("sortProperties",["accDate"]).set("content",@get("arrangedContent")); false
	changeVisibleCols: (e)->
		MY.dialog=JQ.Dialog.create( #MY.dialog needed to destroyElement in ui-ember.js
			ctrl: App.tabReportsController; chkLeft:[]; chkRight:[]
			controllerBinding: "App.tabReportsController"
			init: ->
				@_super(); @title="Rodomi ataskaitos stulpeliai"; fields=@ctrl.fields; div=Math.ceil(fields.length/2)
				@chkLeft=fields.slice(0,div);@chkRight=fields.slice(div);
			didInsertElement: ()->
				@_super();
			width:700
			buttons:
				"Išsaugoti pakeitimus": ()->
					REPORTVIEW.sortableGrid("updateGrid",true)
					$(this).dialog("close")
			cancelLink: true
			templateName: 'tmpReportCols'	
		).append();	
	openPdf: (e)-> @getReport("pdf")
	openXls: (e)-> @getReport("xls")
	getReport: (type)->
		ids=@content.map((row)=> row.iD)
		fields=[];@fields.forEach((row)=> if row.visible then fields.push(row.name))
		dataPars=$.extend({},type:type,{reportName:@report.name,Fields:fields,ID:ids,sortedField:@sortProperties[0], asc:@sortAscending}); me=@
		console.log(dataPars)
		$.ajax(
			url: "Download/makeReport", dataType: 'json', type: 'POST', data: dataPars, traditional: true,
			success:(json)->
				if $("#downloadFrame").length>0 then $("#downloadFrame").remove();
				$("body").append("<iframe id='downloadFrame' target='_blank' src='/Download/GetFile/"+me.report.name+"."+type+"' style='width: 100%;height:800px'></iframe>")#style='display: none;'
			error:(xhr,x,y)->
			complete:(xhr,x,y)->
		);
	reportsZone:"#reportsViewZone"
	refreshView: ()->
		$(@reportsZone).find("table").find("tbody").replaceWith(oCONTROLS.table.getBody(fields:@fields,content:@content));
	fnAppendReport: (report)->

		reportsZone = $(@.reportsZone)	
		# if reportsZone.length>0
			# if (reportsZone.html().length>0) then REPORTVIEW.remove(); reportsZone.empty()	
		fn=@[report.name]; oData=oDATA.GET(report.name)
		if typeof oData =='string' then oData=oDATA.GET(oData) #Stringas, reiskia lentele mes jau atsisiunte, cia tik jos pavadinimas
		if typeof fn == 'function' then fn.call(@,oData);#Iskviecia atitinkama funkcija sumapina duomenis ir ikisa i kontroleri, kuri naudoja viewas
		else console.error("NotaFunction")
		#@set("reportViewName", report.title)
		@set("report", report)
		if reportsZone.html().length==0
			Em.run.next(@,()->REPORTVIEW=reportsZone.sortableGrid(controller:@);)
		else REPORTVIEW.sortableGrid("updateGrid",true)
)
App.TabReportsMainView = Ember.View.extend(
	init: -> @_super(); 
	didInsertElement: ()->	
		@_super();
		$("#reportType").ComboBox(controller:App.tabReportsController,fnChangeCallBack:(e,ui)->
			report=oDATA.GET('words_Reports').emData.findProperty("iD",ui.item.id); controller=@controller #@ čia compo pars
			if not oDATA.GET(report.name) #Jei neturim reporto tai atsisiunciam
				oDATA.fnLoad2(url: "Reports/Main",name:report.name, dataPars:{bla:"opa1",bla2:"opa3"}, ctrl:controller.reportsZone, callBack: -> controller.fnAppendReport.call(controller,report))
			else controller.fnAppendReport.call(controller,report)
		)
	templateName: 'tmpMainReport'
	controller:App.tabReportsController
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