
`var w=window, $=w.jQuery, App=w.App, Em=w.Em;`

$.widget "ui.UploadFiles",  
options:
	#fileupload opcijos
	uploadTemplateId:"tmp2templateUpload", downloadTemplateId:"tmp2templateDownload", formTemplate:"tmpUploadForm",
	showPhoto:true, docsController:"treeDocController" #gavus dokus reikia žinot kokį kontrolerį refrešint
	url: "Files/Start",fileuploaddone: ->
		console.log("opa")	
	#kitos opcijos
	categoryOpts: editList:true#Kategorijos
	#accident:{iD:16,title:"Įvykio dokumentai"}
	#driver:{iD:87,title:"Vairuotojo Albinas Palubinskas dokumentai"}
	#vehicles:[{iD:14,title:"TP BBB, Volvo __ dokumentai"},{iD:7,title:"BRU643, Volvo, FH12"}]	
	ListType:"List",Source:"tblDocTypes",iVal:"iD",iText:["name"]#Kitos opcijos

_create: ->	
	form=""
	Em.View.create(templateName:@options.formTemplate,showPhoto:@options.showPhoto).appendTo(@.element);	
	Em.run.next(@,->
		form=@.element.find("form").data("opts",@options)
		form.fileupload(@options)
	)
	Em.run.next(@,->
		form.bind('fileuploadadded', (e, data) -> 
			tr=data.context#data.form,originalFiles,files[0]-bus esamas
			data.form.find(".submitButtons").removeClass("hidden");inputCat=tr.find("input[name='category[]']")
			opts=data.form.data("opts")
			if data.paramName="docs[]"
				inputCat.ComboBoxCategory(opts)
					# categoryOpts:
						# editList:true,#Kategorijos
						# accident:{iD:16,title:"Įvykio dokumentai"}
						# driver:{iD:87,title:"Vairuotojo Albinas Palubinskas dokumentai"},
						# vehicles:[{iD:14,title:"TP BBB, Volvo __ dokumentai"},{iD:7,title:"BRU643, Volvo, FH12"}]	
					# ListType:"List",Source:"tblDocTypes",iVal:"iD",iText:["name"]#Kitos opcijos
			else
				console.log("paveikslai")
		).bind("fileuploadadd", (e, data) ->
			data.files[0].paramName=data.paramName#Kitaip šablone negali paimt
			ext=data.files[0].name.split('.').pop().substring(0, 3)
			if (ext=="xls" or ext=="doc" or ext=="pdf") then data.files[0].extension=ext else data.files[0].extension="unknown"
			data.files[0].type2=data.files[0].type.split("/")[0]
		).bind("fileuploadsubmit", (e, data) ->
			tr=data.context;f=data.files[0];optsAccident=data.form.data("opts").categoryOpts.accident;catInput=tr.find("input[name='category[]']");GroupID			
			#FileName, FileSize, DocTypeID, RefID, GroupID, Description
			RefID=catInput.data("refID");RefID=if RefID then RefID else null
			
			if catInput.length#uploadinami dokumentai
				GroupID=catInput.data("categoryID");GroupID=if GroupID then GroupID else 5 #Nepriskirto kodas 5
			else GroupID=1#Nuotraukų grupė		
			#if (typeof catInput.data("newval")!="number") then oGLOBAL.notify.withIcon("Ne visi dokumentai išsaugoti", "Dokumentas '"+data.files[0].name+"'  neturi priskirtos kategorijos..", "img32-warning", true); return false
			
			data.formData=FileName:f.name, FileSize:f.size, DocTypeID:catInput.data("newval"), RefID:RefID,
			GroupID:GroupID, Description:tr.find("textarea[name='description[]']").val(),
			AccidentID: if optsAccident then optsAccident.iD else null
			#console.log(data)
		).bind("fileuploaddone", (e, data) -> 
			if (data.result.success)
				console.log("Upload result for file '"+data.files[0].name+"':");	console.log(data.result)
				#---------------------------------------------------------------------------
				newDoc=Em.Object.create(data.result.tblDoc); oDATA.GET("tblDocs").emData.pushObject(newDoc);
				if data.result.tblDocsInAccidents 
					newDocInAccident=Em.Object.create(data.result.tblDocsInAccidents); oDATA.GET("tblDocsInAccidents").emData.pushObject(newDocInAccident);
				#---------------------------------------------------------------------------
				data.context.remove()
				if not data.form.find("table tbody tr").length
					data.form.find(".submitButtons, table").addClass("hidden")
					docsContr=data.form.data("opts").docsController
					App[docsContr].refreshDocs()
			else
				console.log("erroras")
		).find(".fileinput-button").on("click", ->
			#if ($(this).closest("form").find("table tbody tr").length==0)
			$(this).closest("form").find("table").removeClass("hidden").end()#.find("tbody tr").remove().end()
			.find("button.cancel").on("click", ->
				$(@).closest("form").find(".submitButtons, table").addClass("hidden")#.end()
				console.log("Removing tr")
				console.log($(@).closest("form").find("table tbody tr"))
				$(@).closest("form").find("table tbody tr").remove()#.addClass("hidden"))
			)
		)
	)
	#$("<div>opa opa į europą</div>").appendTo( this.element )
	# @element.addClass( "custom-colorize" )
	# @changer$( "<button>", {text: "change","class": "custom-colorize-changer"}).appendTo( this.element ).button();
	
	#bind click events on the changer button to the random method
	#@_on( this.changer, {click: "random"});# _on won't call random when widget is disabled

App.editDocsController= Em.Object.create(
	getOpts: (t)->
		form=t.closest("ul").parent().find("form")
		if not form.length then form=t.closest("ul").closest("table").parent().parent().find("form:first")
		form.data("opts")
	editDoc: (e)->
		t=$(e.target).parent().parent(); e.context.set("editMode",true)
		Em.run.next(@,-> t.find("input.docType").ComboBoxCategory(@getOpts(t)))
	cancelSaveDoc: (e)->
		input=$(e.target).parent().parent().find("input.docType")
		input.autocomplete("destroy").removeData('autocomplete');
		e.context.set("editMode",false)
	SaveEditedDoc: (e)-> 
		t=$(e.target).parent().parent(); desc=t.find("input.description").val(); docTypeID=t.find("input.docType").data("newval");
		controller=App[@getOpts(t).docsController]; docTypeVal=t.find("input.docType").val()	
		cont=e.context;
		docID=cont.docID; doc=oDATA.GET("tblDocs").emData.findProperty("iD",docID); 
		docTypeID = if docTypeID then docTypeID else doc.docTypeID
		groupID=oDATA.GET("tblDocTypes").emData.findProperty("iD",docTypeID).docGroupID #Pakeitus tipą reikia pakeist ir grupę
		SERVER.update2("Action":"Edit","Ctrl":t,"source":"tblDocs","row":doc,
		DataToSave:{"id":docID,"Data":[groupID,docTypeID,desc],"Fields":["groupID","docTypeID","description"],"DataTable":"tblDocs"},
		#Msg: { Title: "Duokumento tipo priskyrimas", Success: "Dokumentas '"+doc.docName+"' priskirtas tipui '"+newTypeName+"'.", Error: "Nepavyko pakeisti dokumento '"+doc.docName+"' tipo." },
		CallBackAfter:(Row)-> 			
			#cont.set("description",desc).set("docType",docTypeVal) # reiktų po išsaugojimo update2 išsaugot	
			controller.refreshDocs()
			#cont.set("editMode",false).set("description",desc).set("docType",docTypeVal)
		)	
	deleteDoc: (e)->
		t=$(e.target).parent().parent();c=e.context; controller=App[@getOpts(t).docsController]
		oCONTROLS.dialog.Confirm({title:"Dokumento pašalinimas",msg:"Ištrinti dokumentą '"+c.docName+"'?"}, ()-> 
			SERVER.update2("Action":"Delete","Ctrl":t,"source":"tblDocs",#"row":doc,
			DataToSave:{"id":c.docID, "DataTable":"tblDocs"},
			Msg: { Title: "Duokumento pašalinimas", Success: "Dokumentas '"+c.docName+"' pašalintas.", Error: "Nepavyko pašalinti dokumento '"+c.docName+"'." },
			CallBackAfter:(Row)->
				#doc=oDATA.GET("tblDocs").emData.findProperty("iD", c.docID)
				#oDATA.GET("tblDocs").emData.removeObject(doc)
				controller.refreshDocs()
				#controller.docs.removeObject(e.context)
			)		
		)
)	
	
# _refresh: ->	         
    # @_trigger( "change" )   
	
# a public method to change the color to a random value can be called directly via .colorize( "random" )
# random: (event) ->
  # colors = red: Math.floor(Math.random() * 256), green: Math.floor(Math.random() * 256), blue: Math.floor(Math.random() * 256)
  # # trigger an event, check if it's canceled
  # @option colors  if @_trigger("random", event, colors) isnt false	
  
# _setOptions: -> # _super and _superApply handle keeping the right this-context   
    # @_superApply arguments_; @_refresh()
    
  
# _setOption: (key, value) -> # _setOption is called for each individual option that is changing
    # # prevent invalid color values
    # return  if /red|green|blue/.test(key) and (value < 0 or value > 255)
    # @_super key, value  
	
# events bound via _on are removed automatically. Revert other modifications here
# _destroy: ->
  # remove generated elements
  # @changer.remove();@element.removeClass("custom-colorize").enableSelection().css "background-color", "transparent"

# initialize with two customized options
# $("#my-widget2").colorize(red: 60, blue: 60)

# initialize with custom green value and a random callback to allow only colors with enough green
# $("#my-widget3").colorize(green: 128,  random:(event, ui) ->ui.green > 128)

# click to toggle enabled/disabled
# $("#disable").click ->
  # # use the custom selector created for each widget to find all instances all instances are toggled together, so we can check the state from the first
  # if $(":custom-colorize").colorize("option", "disabled")
    # $(":custom-colorize").colorize "enable"
  # else
    # $(":custom-colorize").colorize "disable"

# click to set options after initalization
# $("#black").click ->
  # $(":custom-colorize").colorize "option",
    # red: 0 green: 0 blue: 0  
  