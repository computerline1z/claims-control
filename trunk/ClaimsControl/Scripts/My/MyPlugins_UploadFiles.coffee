
`var $ = window.jQuery`
$.widget "ui.UploadFiles",  
options:
	#fileupload opcijos
	uploadTemplateId:"tmp2templateUpload", downloadTemplateId:"tmp2templateDownload", formTemplate:"tmpUploadForm"
	url: "Files/Start",fileuploaddone: ->
		console.log("opa")	
	#kitos opcijos
	categoryOpts: editList:true#Kategorijos
	#accident:{iD:16,title:"Įvykio dokumentai"}
	#driver:{iD:87,title:"Vairuotojo Albinas Palubinskas dokumentai"}
	#vehicles:[{iD:14,title:"TP BBB, Volvo __ dokumentai"},{iD:7,title:"BRU643, Volvo, FH12"}]	
	ListType:"List",Source:"tblDocType",iVal:"iD",iText:["name"]#Kitos opcijos

_create: ->	
	Em.View.create(templateName:@options.formTemplate).appendTo(@.element)	
	Em.run.next(@,->
		form=@.element.find("form").data("opts",@options)
		form.fileupload(@options).bind('fileuploadadded', (e, data) -> 
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
					# ListType:"List",Source:"tblDocType",iVal:"iD",iText:["name"]#Kitos opcijos
			else
				console.log("paveikslai")
		).bind("fileuploadadd", (e, data) ->
			data.files[0].paramName=data.paramName#Kitaip šablone negali paimt
			ext=data.files[0].name.split('.').pop().substring(0, 3)
			if (ext=="xls" or ext=="doc" or ext=="pdf") then data.files[0].extension=ext else data.files[0].extension="unknown"
			data.files[0].type2=data.files[0].type.split("/")[0]
		).bind("fileuploadsubmit", (e, data) ->
			tr=data.context;f=data.files[0];optsAccident=data.form.data("opts").categoryOpts.accident;catInput=tr.find("input[name='category[]']")			
			#FileName, FileSize, DocTypeID, RefID, GroupID, Description
			RefID=catInput.data("refID");RefID=if RefID then RefID else null
			GroupID=catInput.data("categoryID");GroupID=if GroupID then GroupID else null
			
			if (typeof catInput.data("newval")!="number") then oGLOBAL.notify.withIcon("Ne visi dokumentai išsaugoti", "Dokumentas '"+data.files[0].name+"'  neturi priskirtos kategorijos..", "img32-warning", true); return false
			data.formData=FileName:f.name, FileSize:f.size, DocTypeID:catInput.data("newval"), RefID:RefID,
			GroupID:GroupID, Description:tr.find("textarea[name='description[]']").val(),
			AccidentID: if optsAccident then optsAccident.iD else null
			#console.log(data)
		).bind("fileuploaddone", (e, data) -> 
			if (data.result.success)
				console.log("Upload result for file '"+data.files[0].name+"':")
				console.log(data.result)
			 
				data.context.remove()
				if (data.form.find("table tbody tr").length==0) then (data.form.find(".submitButtons, table").addClass("hidden"))
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
	
_refresh: ->	         
    @_trigger( "change" )   
	
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
_destroy: ->
  # remove generated elements
  @changer.remove();@element.removeClass("custom-colorize").enableSelection().css "background-color", "transparent"

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
  