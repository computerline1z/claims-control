##opt={objData:??, Action:Edit/Add/Delete, aRowData:[??], Title:??, DialogFormId(divDialogForm),RenderHTML:[opcija], CallBackAfter,
##newVals: {vals:newVals,cols:opt.iText} vertės ir indeksai kuriuos reik ikist
##GridButtons:{form:"Dialog"/"Head"/Container(doom el),Action:"Add"/function,icon}
class clsEditableForm
	constructor: (options) ->
		$("body").css("cursor","wait")
		opt={DialogFormId:"divDialogForm",fnAddNewForm:"Dialog",CallBackAfter:0,aRowData:0,Title:0}	
		$.extend(opt,options)
		id=if opt.aRowData? then opt.aRowData.iD else 0 ##jei 0 reiskia naujas irasas
		oData=oDATA.GET(opt.objData)
		Action=opt.Action
		unless oData?
			alert("Neradau objekto #{opt.objData} clsEditableForm klaseje")
		Row = Cols:oData.Cols, Grid:oData.Grid, Data:opt.aRowData
		if id and not Row.Data? ##jei yra id ir nera Row.Data surasom duomenis is oData
			Row.Data =oData.emData.findProperty("iD", id)
		if (!opt.Title)
			Config=oData.Config
			opt.Title=if Action=="Add" then Config.Msg.AddNew else Config.Msg.Edit
			if Config.Msg.AddToTitle and Action=="Edit"##Kuriant nauja neturim ka rodyti
				AddToTitle = for ix in Config.Msg.AddToTitle
					Row.Data[ix]
				opt.Title+=" - "+AddToTitle.join(' ')
		@fnLoadEditableForm(opt,id,oData,Row)
			##tr=opt.fnAddNewForm.grid.find("tbody tr:first");colspan=tr.find('td').length
			##insertedRow=$("tr").attr("colspan",colspan).insertBefore(tr)
			##Cia viska sumetam, o ant fnSave ismetam ir pan
		$("body").css("cursor","default");

	fnLoadEditableForm: (opt,id,oData,Row) ->
		Config=$.extend(true,{},{Source:opt.objData},oData.Config)#I Configa irasom Source:opt.objData, jei ten nera Source
		if !opt.form or opt.form=="Dialog"
			dlgEditableOpt = 
				autoOpen: false, minWidth: '35em', minHeight: '40em', width: '50em', modal: true, title: opt.Title, draggable: true
				buttons:
					"Išsaugoti pakeitimus": () -> fnSaveChanges(opt,oData,Row)
					"Ištrinti": () -> $(this).dialog("close")
					"Atšaukti": () -> $(this).dialog("close")
				close: () -> $("div.validity-tooltip").remove(); $(this).remove()
				dragStart: () -> $("div.validity-tooltip").remove()
			_html=if (opt.RenderHTML) then opt.RenderHTML else @fnGenerateHTML(Row,id,Config,opt)
			#$( "#dialog:ui-dialog" ).dialog("destroy")
			$("#"+opt.DialogFormId).parent().dialog("destroy")
			$("<div id='"+opt.DialogFormId+"'></div>").html(_html).dialog(dlgEditableOpt).dialog('open')
		else
			_html=if (opt.RenderHTML) then opt.RenderHTML else @fnGenerateHTML(Row,id,Config,opt)
			$(_html)
				.append('<button style="float:right;" title="Atšaukti">Atšaukti</button>').find('button:last').button().click( ->fnResetForm(opt))
				.end().append('<button style="float:right;" title="Išsaugoti">Išsaugoti</button>').find('button:last').button().click( ->fnSaveChanges(opt,oData,Row))
				.end().appendTo(opt.form)
				.append('<div style="clear:both;"></div>').prepend("<h3>"+opt.Title+"</h3>")
		#return false;		
		oCONTROLS.UpdatableForm(frm:$("#divEditableForm"))	##I pusiau sugeneruota forma (Extend) sudedam likusius dalykus 
		form=$("#"+opt.DialogFormId).parent()
		form.find("button:contains('Išsaugoti')").attr("disabled","disabled").addClass("ui-state-disabled")
		form.find("input, textarea").bind('click keyup', -> 
			form.find("button:contains('Išsaugoti')").removeAttr("disabled").removeClass("ui-state-disabled"))
		form.find("div.ExtendIt button").click -> 
			form.find("button:contains('Išsaugoti')").removeAttr("disabled").removeClass("ui-state-disabled")
		form.find("button:contains('Ištrinti')").css("display","none");
		
	fnResetForm=(opt) ->
		opt.target.css("display","block") if opt.target
		opt.form.empty()
		
	fnSaveChanges=(opt,oData,Row) ->
		DataToSave=oCONTROLS.ValidateForm($('#divEditableForm'))
		if DataToSave
			SERVER.update(Action: opt.Action, DataToSave: DataToSave
			,CallBack:
				Success:(resp,updData) -> ##{ "Action": p.Action, "DataToSave": p.DataToSave, "CallBack": p.CallBack, "Msg": p.Msg };
					# RowLength=Row.Cols.length; RowI=0
					# updLength=updData.DataToSave.Fields.length					
					if opt.Action=="Add"
						Row.Data=Em.Object.create({})
						Row.Data.iD=resp.ResponseMsg.ID
					# if opt.Action=="Add"
						# Row.Data=new Array(RowLength) ##inicializuojam nauja Arr jei "Add"
						# Row.Data.iD=resp.ResponseMsg.ID
						
					Row.Cols.forEach((col,i)->
						ok=false; fieldName=col.FName.slice(0, 1).toLowerCase() + col.FName.slice(1)
						updData.DataToSave.Fields.forEach((updateField,i2)->
							if col.FName==updateField
								#Row.Data[fieldName]=updData.DataToSave.Data[i2]; ok=true
								Row.Data.set(fieldName,updData.DataToSave.Data[i2]); ok=true
						if not ok and (opt.Action=="Add" and fieldName!="iD")
							if (col.IdField)								
								infoRow=Row.Cols[col.IdField]
								source=infoRow.List.Source
								Field=infoRow.FName
								id=oGLOBAL.helper.getData_fromDataToSave(updData.DataToSave,Field)							
								#Row.Data[fieldName]=oDATA.GET(source).emData.findProperty("iD", id).MapArrToString(infoRow.List.iText, false)
								Row.Data.set(fieldName,oDATA.GET(source).emData.findProperty("iD", id).MapArrToString(infoRow.List.iText, false))
							else if (col.Default)
								if col.Default=="Today"
									#Row.Data[fieldName]=oGLOBAL.date.getTodayString()
									Row.Data.set(fieldName,oGLOBAL.date.getTodayString())
								else if col.Default=="UserName"
									#Row.Data[fieldName]=UserData.Name()
									Row.Data.set(fieldName,UserData.Name())
								else if col.Default=="UserId"
									#Row.Data[fieldName]=UserData.Id()
									Row.Data.set(fieldName,UserData.Id())
								else Row.Data[fieldName]=col.Default
								
							else
								Row.Data[fieldName]=""
								Row.Data.set(fieldName,"")
						)
						console.log("col: "+col.FName+", ok: "+ok+", fieldValue:" +Row.Data[fieldName])
					) 
					if opt.Action=="Add"
						oDATA.GET(opt.objData).emData.pushObject(Row.Data)
					
					if opt.CallBackAfter
						opt.CallBackAfter(Row.Data, opt)
					if !opt.form or opt.form=="Dialog" 
						$("#"+opt.DialogFormId).dialog("close")
					else
						fnResetForm(opt)
			,Msg: "", BlockCtrl:$('#divEditableForm')
			)
		else if DataToSave==0##reiskia, kad niekas nepakeista
			$("#"+opt.DialogFormId).dialog("close")
	fnGenerateHTML: (Row,id,Config,opt) ->
		Length=Row.Cols.length; i=0;html="";Head="";inewVals=0
		if opt.newVals #naujai įkišamos vertės turi būt array, jei ne suskaldom ir įkišam
			opt.newVals.vals=if opt.newVals.vals instanceof Array then opt.newVals.vals else opt.newVals.vals.split(" ")
		while i<Length
			Append=""; n=Row.Cols[i].FName; n=n.slice(0, 1).toLowerCase() + n.slice(1); colVal=Row.Data[n];
			if Row.Grid.aoColumns[i].sTitle? and not (Row.Cols[i].IdField or Row.Cols[i].NotEditable) ## laukus generuojam tik su sTitle
				if colVal? and colVal
					if typeof colVal == "number"
						val=colVal
					else
						t=(if Row.Cols[i].Type then Row.Cols[i].Type else "")
						val=if t in ["String","Email"]||t.substring(0,4)=="Date" then ('"'+ colVal.replace(/"/g,"\\u0027")+'"') else colVal
				else if opt.newVals? #newVals: {vals:newVals,cols:opt.iText}
					if n==opt.newVals.cols[inewVals]
						val=if opt.newVals.vals[inewVals] then ('"'+ opt.newVals.vals[inewVals].replace(/"/g,"\\u0027")+'"') else "\"\""
						inewVals++
					else
						val="\"\""
				else
					val="\"\"" 
				Append+="\"Value\":#{val},"
				html+="<div class='ExtendIt' data-ctrl='{#{Append}\"Field\":\"#{Row.Cols[i].FName}\",\"classes\":\"UpdateField\",\"labelType\":\"Left\"}'></div>"
			i++;
		if id?
			Head='"NewRec":0,"id":'+id+','
		else
			Head='"NewRec":1,'
		#Head+='"Source":"#{Config.Source}","tblUpdate":"#{Config.tblUpdate}"'
		Head+='"Source":"'+Config.Source+'","tblUpdate":"'+Config.tblUpdate+'"'
		"<div id='divEditableForm' class='inputform' style='margin:0 2em;' data-ctrl='{#{Head}}'>#{html}</div>"
`window.oGLOBAL.clsEditableForm=clsEditableForm`