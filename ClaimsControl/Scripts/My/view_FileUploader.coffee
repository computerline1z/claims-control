
`var w=window, App=w.App, Em=w.Em, oGLOBAL=w.oGLOBAL, oDATA=w.oDATA, oCONTROLS=w.oCONTROLS, MY=w.MY`
App.fileUploader = Em.View.extend(
	uploader:null,
	init: -> (@_super();c=@context;@title=c.title;)
	didInsertElement: ()->
		@_super(); #dialogFrm=$("#openItemDialog");dialogContent=$("#dialogContent");
		$("#fileUploadID").next().find("button:contains('Persiųsti failus')").attr("disabled","disabled").addClass("ui-state-disabled")
		Em.run.next(
			@, -> 
				console.log(@)
				@.$().find("div.qq-upload-button input").trigger("submit")
		)
		@uploader = new qq.CustomizedFileUploader(
			debug: true
			element: document.getElementById("file-uploader-demo1")
			listElement: document.getElementById("fileUploaderList")
			fileTemplate: "<tr id='{fileId}'} class='colored-row' data-isSelected='0'>"+
				#"<td class='rightAligned'>{fileNumber}</td><td><input type='text' name='fileName' value='{shortFileName}'></td>"+
				"<td><span class='qq-upload-file'>{fileName}</span></td><td name='fileSize' class='rightAligned'>{fileSize}</td>"+
				"<td>{tblDocTypesDropDown}</td><td><input style='width:100%;' type='text' name='fileDescription'></td>"+
				#"<td><a href='#' onclick='return ShowThisMemo(this);'>Aprašymas</a><textarea name='current-memo' style='display: none;' cols='90' rows='15' ></textarea></td>
				"<td><span class='qq-upload-size'></span><a class='qq-upload-cancel' href='#' onclick='return RemoveFile(this)'>{cancelButtonText}</a><div class='qq-progress-bar'></div><span class='qq-upload-spinner'></span><span class='qq-upload-finished'></span><span class='qq-upload-failed-text'>{failUploadtext}</span></td></tr>"
			addToListFunction: (id, fileName, fileSize) ->
				cancelButtonText = this["cancelButtonText"]
				template = FormatFileRow(this["fileTemplate"], id, fileName, fileSize, cancelButtonText)
				$("#fileUploaderList").append template

			endpoint: "/Files/Start"
			#action: "Files/Start" #"@Url.Action(\"Start\", \"Files\")"
			autoUpload: false
			#button: document.getElementById("file-select-button")
			#button: "<a hreff='#'>Opa</a>"
			uploadButtonText: "Įkelti dokumentus"
			cancelButtonText: "Ištrinti"
			forceMultipart: true
			onSubmit: (id, fileName) ->
				$("#triggerUpload:disabled").removeAttr "disabled"
				$("#fileUploaderList").show()
				true

			onComplete: (id, fileName, responseJSON) ->
				$("#triggerUpload").attr "disabled", "disabled"

			onCancel: (id, fileName) ->
				argument = "#fileUploaderList tbody tr#" + id
				$(argument).remove()

			onPrepareParams: (id) ->
				rzlt = PrepareHiddenParameters()
				argument = "#fileUploaderList tbody tr#" + id
				PrepareRowParameters $(argument), rzlt
				rzlt
		)
		$("#triggerUpload").on("click", ->
			selectedRow = $("#fileUploaderList tbody tr[data-isSelected='1']")
			CloseThisMemo null	if selectedRow.length > 0
			uploader.uploadStoredFiles()
			)
		FormatFileRow = (template, id, fileName, fileSize, cancelButtonText) ->
			rowNumber = Number(id) + 1
			shortFileName = fileName.substr(0, fileName.lastIndexOf(".")) or fileName
			dropDown = $("#tblDocTypesListTemplate").clone().removeAttr("id").html()
			rzlt = template.replace(/\{fileId\}/g, id).replace(/\{fileNumber\}/g, rowNumber)
			rzlt = rzlt.replace(/\{shortFileName\}/g, shortFileName).replace(/\{fileName\}/g, fileName)
			rzlt = rzlt.replace(/\{fileSize\}/g, fileSize).replace(/\{cancelButtonText\}/g, cancelButtonText)
			rzlt = rzlt.replace(/\{tblDocTypesDropDown\}/g, dropDown)
			rzlt
		RemoveFile = (currentElement) ->
			fileId = $(currentElement).closest("tr[id]").attr("id")
			$("#" + fileId).remove()
		# CloseThisMemo = (aLink) ->
			# memoValue = $("#dvDescription textarea.txtDescription").val()
			# selectedRow = $("#fileUploaderList tr[data-isSelected='1']")
			# selectedRow.find("td textarea[name='current-memo']").val memoValue
			# selectedRow.attr "data-isSelected", "0"
			# $("#dvDescription").hide()
			# false
		# ShowThisMemo = (aLink) ->
			# thisElement = $(aLink)
			# memoValue = thisElement.siblings("textarea:hidden").val()
			# $("#dvDescription textarea.txtDescription").val memoValue
			# selectedRow = thisElement.closest("tr")
			# selectedRow.attr "data-isSelected", "1"
			# selectedRow.siblings().attr "data-isSelected", "0"
			# $("#dvDescription").show()
		PrepareHiddenParameters = ->
			rzlt = {}
			rzlt["AccountID"] = $("#AccountID").val()
			rzlt["DocGroupID"] = $("#DocGroupID").val()
			rzlt["RefID"] = $("#RefID").val()
			rzlt["AccidentID"] = $("#AccidentID").val()
			rzlt
		PrepareRowParameters = (currentRow, rzlt) ->
			rzlt["fileName"] = currentRow.find("td input[name='fileName']").val()
			rzlt["currentMemo"] = currentRow.find("td textarea[name='current-memo']").val()
			rzlt["docTypeID"] = currentRow.find("td select.dropDownTemplate").val()
			rzlt["fileSize"] = currentRow.find("td[name='fileSize']").text()
		
	# width:800
	templateName: 'tmpStartUpload'	
	#elementId: "fileUploadID"
)	
oCONTROLS.fnStartUploader=(pars) -> (
	if (MY.fileUploader) then MY.fileUploader.remove()
	MY.fileUploader=App.fileUploader.create(
		context:pars
	).appendTo("#uploadPlaceId")
)