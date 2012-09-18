##opt={objData:??, Action:Edit/Add/Delete, aRowData:[??], Title:??, DialogFormId(divDialogForm),RenderHTML:[opcija], CallBackAfter,
##newVals: {vals:newVals,cols:opt.iText} vertės ir indeksai kuriuos reik ikist
##GridButtons:{form:"Dialog"/"Head"/Container(doom el),Action:"Add"/function,icon}
class clsEditableForm
	constructor: (options) ->
		$("body").css("cursor","wait")
		opt={DialogFormId:"divDialogForm",fnAddNewForm:"Dialog",CallBackAfter:0,aRowData:0,Title:0}	
		$.extend(opt,options)
		id=if opt.aRowData? then opt.aRowData[0] else 0 ##jei 0 reiskia naujas irasas
		oData=oDATA.GET(opt.objData)
		Action=opt.Action
		unless oData?
			alert("Neradau objekto #{opt.objData} clsEditableForm klaseje")
		Row = Cols:oData.Cols, Grid:oData.Grid, Data:opt.aRowData
		if id and not Row.Data? ##jei yra id ir nera Row.Data surasom duomenis is oData
			for rows in oData.Data
				if rows[0]==id 
					Row.Data = rows
					break
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
				#dragStart: () -> $("div.validity-modal-msg").remove()
				dragStart: () -> $("div.validity-tooltip").remove()
			_html=if (opt.RenderHTML) then opt.RenderHTML else @fnGenerateHTML(Row,id,Config,opt)
			$( "#dialog:ui-dialog" ).dialog("destroy")
			$("<div id='"+opt.DialogFormId+"'></div>").html(_html).dialog(dlgEditableOpt).dialog('open')
		else
			_html=if (opt.RenderHTML) then opt.RenderHTML else @fnGenerateHTML(Row,id,Config,opt)
			$(_html)
				.append('<button style="float:right;" title="Atšaukti">Atšaukti</button>').find('button:last').button().click( ->fnResetForm(opt))
				.end().append('<button style="float:right;" title="Išsaugoti">Išsaugoti</button>').find('button:last').button().click( ->fnSaveChanges(opt,oData,Row))
				.end().appendTo(opt.form)
				.append('<div style="clear:both;"></div>').prepend("<h3>"+opt.Title+"</h3>")
		oCONTROLS.UpdatableForm($("#divEditableForm"))	##I pusiau sugeneruota forma (Extend) sudedam likusius dalykus 
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
					RowLength=Row.Cols.length; RowI=0
					updLength=updData.DataToSave.Fields.length
					if opt.Action=="Add"
						Row.Data=new Array(RowLength) ##inicializuojam nauja Arr jei "Add"
						Row.Data[0]=resp.ResponseMsg.ID
						oData.Data.push(Row.Data)#ikišam naujus duomenis
					##Prabegam iš eilės per visus  per visus Row.Cols[RowI].FName ir surašom ką keitėm arba įstatom default values (Add keisis visi, Edit tik dalis)
					while RowI<RowLength-1 
						updI=0;Found=0;RowI++##Pradedam ne nuo 0, nes ten ID ir jis neupdatinamas
						while updI<updLength
							if Row.Cols[RowI].FName==updData.DataToSave.Fields[updI]
								Row.Data[RowI]=updData.DataToSave.Data[updI]
								Found=1; break
							updI++
						## jei nera tokio lauko ir pridedam nauja irasa idedam defaultine arba tuscia reiksme ir iskertam null, nes meta errorus kisant i grida
						if (not Found and opt.Action=="Add") 
							if Row.Cols[RowI].Default?
								if Row.Cols[RowI].Default=="Today"
									Row.Data[RowI]=oGLOBAL.date.getTodayString()
								else if Row.Cols[RowI].Default=="UserName"
									Row.Data[RowI]=UserData.Name()#UserData turėt būt
								else if Row.Cols[RowI].Default=="UserId"
									Row.Data[RowI]=UserData.Id()
								else	
									Row.Data[RowI]=Row.Cols[RowI].Default
							else if Row.Cols[RowI].UpdateField ##pvz Date
								f=Row.Cols[RowI].UpdateField
								Row.Data[RowI]=updData.DataToSave[f]
							else
								Row.Data[RowI]=""
						if Row.Data[RowI]==null
							Row.Data[RowI]=""
					##Prabegam per visus jau surašytus Row.Data ir jei ten stovi IdInMe, tada įrašom teksta is kitos lenteles (kad nepalikt tuscio lauko)
					RowI=0
					while RowI<RowLength-1
						RowI++
						if Row.Cols[RowI].IdInMe
							ix=Row.Cols[RowI].IdInMe
							id=Row.Data[ix]
							obj=Row.Cols[ix].List.Source
							TextId=Row.Cols[ix].List.iText
							Row.Data[RowI]=oData.GetStringFromIndexes(id,obj,TextId)
					#Updatinasi per Row, nieko daugiau nereikia
					#oData.UpdateRow(Row.Data,oData,opt.Action)##Updatinam duomenis masyve ???Reikia tokio metodo array prototype
					if opt.CallBackAfter
						opt.CallBackAfter(Row.Data)
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
			Append=""
			if Row.Grid.aoColumns[i].sTitle? ## laukus generuojam tik su sTitle
				if Row.Data[i]? and Row.Data[i]
					if typeof Row.Data[i] == "number"
						val=Row.Data[i]
					else
						t=(if Row.Cols[i].Type then Row.Cols[i].Type else "")
						val=if t in ["String","Email"]||t.substring(0,4)=="Date" then ('"'+ Row.Data[i].replace(/"/g,"\\u0027")+'"') else Row.Data[i]
						##Row.Data[i].replace('"',"\'")
				else if opt.newVals? #newVals: {vals:newVals,cols:opt.iText}
					if i==opt.newVals.cols[inewVals]
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