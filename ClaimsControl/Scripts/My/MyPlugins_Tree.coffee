#`var w=window, App=w.App, Em=w.Em, oGLOBAL=w.oGLOBAL, oDATA=w.oDATA, oCONTROLS=w.oCONTROLS, MY=w.MY`
`var w=window,$ = w.jQuery, App=w.App, Em=w.Em`

#`var $ = window.jQuery, App=w.App, Em=w.Em, oGLOBAL=w.oGLOBAL, oDATA=w.oDATA, oCONTROLS=w.oCONTROLS, MY=w.MY`

$.widget "ui.Tree",	
options:
	treeId:"dynamicTree", docViewForTreeId:"docViewForTree", formTemplate:"tmpUploadForm", docsUpdateCallBack: null,
	categoryOpts: {}, # <- kategorijos
	DocsTypesController:"DocsTypesController",#-jame(content) sudedamos grupės ir tipai, pagal jį paišomas medis
	TreeDocController:"TreeDocController"#-jame(docs) pagal dokumentus paišomi dokumentai
_create: ->	
	# $('<div id="'+@options.treeId+'" style="float: left;border-right: 1px solid #ddd; width: 20%"></div>'+
	# '<div id="'+@options.docViewForTree+'" style="float:left; padding:10px;width:70%;"></div>').appendTo(@.element)
	$('<table width="100%;"><tr style="vertical-align:top"><td style="width:28em"><div id="'+@options.treeId+'" style="border-right: 1px solid #ddd;"></div></td>'+
	'<td style="vertical-align:top;padding:10px;"><div id="'+@options.docViewForTreeId+'"></div></td></tr></table>').appendTo(@.element)
	
	#App.DocInfo = Em.Object.extend(docId: null, categoryId: null) if not App.DocInfo
	@DocsTypesControllerOpt.categoryOpts=@options.categoryOpts
	
	App[@options.DocsTypesController] = Em.ResourceController.create(@DocsTypesControllerOpt)
	App.DocTreeView = Em.View.extend(@DocTreeViewOpt) #Paišo medžio šakas
	@TreeViewOpts.opts=@options
	@TreeDocControllerOpts.opts=@options
	@DocTreeViewOpt.opts=@options
	App.TreeView = Em.View.extend(@TreeViewOpts) #Jame inicializuojasi dokai	
	App[@options.TreeDocController]  = Em.Object.create(@TreeDocControllerOpts)
	Em.View.create(templateName: "tmpDocsTree").appendTo "#"+@options.treeId
	@docViewForTreeOpts.controller = App[@options.TreeDocController]
	@docViewForTreeOpts.opts = @options
	Em.View.create(@docViewForTreeOpts).appendTo "#"+@options.docViewForTreeId
DocsTypesControllerOpt:
	init: -> 
		@_super(); me = this; catOpts=me.categoryOpts
		cats = oDATA.GET("tblDocGroup").emData; docTypes = oDATA.GET("tblDocType").emData;	c = [];
		if catOpts.driver then cats.findProperty("iD",3).set("name",catOpts.driver.title)
		cats.forEach (catItem, i) ->
			newItem =
				categoryId: catItem.iD, title: catItem.name
			i = catItem.iD
			console.log "catItem.iD: " + i + ", catItem.name: " + catItem.name
			newItem.isTree = "isTree" if i isnt 1 and i isnt 5 #Nuotraukom ir nepriskirtom nedarom medzio
			newItem.isGroup = "isGroup"
			newItem.isSelectable = true	if i isnt 4 #masinom bus uz masinas medis, tai negalim pasirinkt
			if i is 4
				newItem.items = catOpts.vehicles.map((item) ->
					isGroup: "isGroup", refID: item.iD, categoryId: 4, title: item.title, isTree: "isTree", isSelectable: true
				)
				newItem.items.forEach (vehicle) ->
					vehicle.items = me.setDocTypes(docTypes, catItem.iD, vehicle.refID)#automobiliam atskiriam pagal refID
			else
				newItem.items = me.setDocTypes(docTypes, catItem.iD)
			c[c.length] = newItem
		@set "content", c
		console.log("new content:")
		console.log(c)
	setDocTypes: (docTypes, groupID, refID) ->
		fnMap
		if (refID) then fnMap=(item) -> (categoryId: item.iD, title: item.name, refID: refID) #atskiriam pagal refID
		else fnMap=(item) -> (categoryId: item.iD, title: item.name)
		docTypes.filter((type) -> type.docGroupID is groupID).map(fnMap)
	content: []
	
DocTreeViewOpt:
	templateName: "tmpDocsNodes", tagName: "", opts: null,
	didInsertElement: ->
		$("li.treeItem").droppable
			accept: "#gallery > li"
			accept: "#"+@opts.docViewForTreeId+" li"
			over: (event, dragged) ->
				$(this).addClass "treeItemHover" if not $(this).hasClass "isTree"
				#console.log this
				subbranches = $("ul", this)
				if subbranches.size() > 0
					subbranch = subbranches.eq(0)
					if subbranch.css("display") is "none"
						targetBranch = subbranch.get(0)
						window.setTimeout (->
							$(targetBranch).show()
							$("img.expandImage", targetBranch.parentNode).eq(0).attr "src", "Content/less/images/toggle_minus.png"
						), 200
			out: ->
				$(this).removeClass "treeItemHover"
			drop: (event, dropped) ->
				$(this).removeClass "treeItemHover"
				subbranch = $("ul", this)
				if subbranch.size() is 0
					textElement = $(this).find("span.textHolder").eq(0)		
					opts=$(this).closest("tr").find("td:eq(1) ul").data("opts")
					#var content =textElement.text().split('(');
					#textElement.text(content[0]+ "("+ (parseInt(content[1].split(')')[0]) + 1)+ ")");
					App[opts.TreeDocController].deleteDocument dropped.draggable, this

#DocManagementService.deleteDocument(dropped.draggable,this);
TreeViewOpts :
	docs:null, opts: null #čia laikomos widgeto opcijos
	templateName: "tmpDocsCategory"
	tagName: ""
	classNames: []
	getDocs: (event) ->		
		App.TreeDocController.set "selectedCategoryId", event.view.bindingContext.categoryId
		$("#"+@opts.treeId).find("span").removeClass "ui-state-highlight"
		#dynamicTree @_context={categoryId,isSelectable,isTree,items,title} ir t.p. bindingContext
		t = $(event.target); (if t.is("li") then t.find("span:first") else t.closest("span")).addClass("ui-state-highlight");

		console.log "categoryId: " + event.view.bindingContext.categoryId
		console.log "context: "
		console.log @_context
		#{categoryId: 2, title: "Įvykio dokumentai", isTree: true, isSelectable: true, items: Array[6]…}
		#Em.Object.extend(docId: null, categoryId: null)
		currentDocs=[]; ctx=@_context; fnFilter
		if ctx.isGroup#išrenkam visus tos grupės dokus, nes tai grupės node'as
			if ctx.refID then fnFilter=(doc) -> doc.groupID == ctx.categoryId and doc.refID == ctx.refID
			else fnFilter=(doc) -> doc.groupID == ctx.categoryId			
		else#išrenkam visus to tipo dokus, nes tai apatinis node'as
			if ctx.refID then fnFilter=(doc) -> doc.docTypeID == ctx.categoryId and doc.refID == ctx.refID
			else fnFilter=(doc) -> doc.docTypeID == ctx.categoryId
			
		currentDocs=App[@opts.TreeDocController].AllDocs.filter(fnFilter)	
		#currentDocs=@docs.filter(fnFilter)	
		currentDocs.forEach (doc) -> console.log "iD: " + doc.iD + ", docName: " + doc.docName + ", docTypeID:" + doc.docTypeID + ", groupID:" + doc.groupID	
		account=oDATA.GET("userData").emData[0].account; url="Uploads/"+account; users=oDATA.GET("tblUsers").emData; docTypes=oDATA.GET("tblDocType").emData
		
		fnGetIcon=(ext) -> ext=ext.slice(0,3); return "img32-doc_" + (if ext=="xls"||ext=="doc"||ext=="pdf" then ext else "unknown" )
		fnGetUser=((userID) -> u=users.find((user)->user.iD==userID); u.firstName+" "+u.surname;)		
		fnGetDocType = (typeID)-> docTypes.find((type)->type.iD==typeID).name
		
		isPhoto=if (ctx.isGroup and ctx.categoryId==1) then true else false 
			
		showDocs=currentDocs.map((doc)-> 
			user=fnGetUser(doc.userID);file="/"+doc.iD+"."+doc.fileType
			docID:doc.iD,
			hasThumb:doc.hasThumb, urlThumb:url+"/Thumbs"+file, urlDoc:url+file,docType:fnGetDocType(doc.docTypeID),description:doc.description,
			docName:doc.docName,userName:user,fileDate:doc.fileDate,fileName:doc.docName+"."+doc.fileType
			fileIcon: if not doc.hasThumb then fnGetIcon(doc.fileType) else "img32-doc_unknown"
			docDetails: if isPhoto then "" else "Įkėlė "+user+" "+doc.fileDate+", dydis - "+Math.ceil(doc.fileSize/10000)/100+"Mb"
		)
		
		App[@opts.TreeDocController].set("isPhoto", isPhoto)
		console.log("showDocs:")
		console.log(showDocs)
		App[@opts.TreeDocController].set("docs", showDocs)
		false
	expandCollapse: (event) ->
		node = event.target
		if node.src.indexOf("spacer") is -1
			subbranch = $("ul", node.parentNode)
			action = "hide"
			action = "show"	if subbranch.eq(0).css("display") is "none"
			$(subbranch).each ->
				if action is "show"
					$(this).show()
					$(this).parent().find("img.expandImage").attr "src", "Content/less/images/toggle_minus.png"
				else
					$(this).hide()
					$(this).parent().find("img.expandImage").attr "src", "Content/less/images/toggle_plus.png"
					
TreeDocControllerOpts:
	init: () -> @_super(); @refreshDocs()
	refreshDocs: () ->
		docs=oDATA.GET("tblDocs").emData; cats=@opts.categoryOpts
		if cats.accident
			@AllDocs=docs.filterByTbl(filterTbl:oDATA.GET("tblDocsInAccidents").emData,joinField:"docID",filterField:"accidentID",filterValue:cats.accident.iD)
		else @AllDocs=docs
		Em.run.next(@,->
			if @AllDocs.filter((doc)-> doc.groupID==5).length #Jei yra nepriskirtų keliam ten
				$("#"+@opts.treeId).find("ul>li:last").trigger("click")
			else
				t=$("#"+@opts.treeId); selected=t.find("span.ui-state-highlight")
				if selected.length then selected.trigger("click") else t.find("li:first span").trigger("click") #refreshinam
		)
	docs: [], opts: null, AllDocs: [] #šito konteksto visi dokai
	selectedCategoryId: null
	deleteDocument: (docElement, selectedNode) ->		
		# alert "Document Id -> " + docElement.data("doc-id")
		# + "\n" + "From category -> " + @get("selectedCategoryId") #App[@opts.TreeDocController].get("selectedCategoryId")
		# + "\n" + "To category -> " + $(selectedNode).data("category-id")
		sN=$(selectedNode); refID=sN.data("ref-id"); isGroup=sN.hasClass("isGroup")
		docID=docElement.data("doc-id")
		newdocTypeID=$(selectedNode).data("category-id")
		
		docType=oDATA.GET("tblDocType").emData.find((types)->types.iD==newdocTypeID)
		newGroupID=docType.docGroupID	
		newTypeName=docType.name	
		
		if isGroup #gali būt tik 'Nuotraukos' ir 'Nepriskirti' grupės
				if newdocTypeID==1 then newGroupID=1;newdocTypeID=0 #Nuotrauka
				if newdocTypeID==5 then newGroupID=5;newdocTypeID=11 #Nepriskirti
		console.log "docID:"+docID+", new type:"+newdocTypeID+", new group:"+newGroupID
		Data=new Array(newdocTypeID,newGroupID)
		Fields=new Array("DocTypeID","GroupID")
		if refID then Data.push(refID); Fields.push("RefID")
		doc=@AllDocs.findProperty("iD", docID)
		opts=@opts
		
		SERVER.update2("Action":"Edit","Ctrl":$("#"+opts.treeId),"source":"tblDocs","row":doc,
		DataToSave:{"id":docID,"Data":Data,"Fields":Fields,"DataTable":"tblDocs"},
		Msg: { Title: "Duokumento tipo priskyrimas", Success: "Dokumentas '"+doc.docName+"' priskirtas tipui '"+newTypeName+"'.", Error: "Nepavyko pakeisti dokumento '"+doc.docName+"' tipo." },
		CallBackAfter:(Row)->
			#doc.set("docTypeID", newdocTypeID).set("groupID", newGroupID) nereikia
			# if opts.categoryOpts.accident
				# accidentID=opts.categoryOpts.accident.iD
				# oDATA.GET("tblDocsInAccidents").emData.filter((item)->(item.docID==docID and item.accidentID==opts.categoryOpts.accident))
			#docElement.fadeOut() reiktu ant erroro atstatyt bus ko gero CallBack:{Error:function(){}}
		)	
		docElement.fadeOut()
		#pakeitus App.TreeDocController.AllDocs pasikeičia ir oDATA.GET("tblDocs").emData, todėl			
		
docViewForTreeOpts:
	opts: null #opcijos
	templateName: "tmpDocsView"
	tagName: "ul"
	#elementId: "gallery"
	classNames: ["gallery", "ui-helper-reset", "ui-helper-clearfix"]
	#controller: App[@opts.TreeDocController]
	didInsertElement: ->
		#$("#gallery").sortable
		this.$().data("opts",@opts)
		this.$().sortable
			revert: true
			opacity: 0.2
			refreshPositions: true
			# update: (event, ui) ->
				# order = []
				# $(event.target).find("li").each (index, ele) ->
					# order.push "Position " + (index + 1) + " has docId = " + $(ele).attr("data-doc-id")			
				# #Send update call to server with new order
				# opts=$(this).data("opts")
				# alert "Updated order for CategoryId " + App[opts.TreeDocController].get("selectedCategoryId") + " is =\n" + order.join("\n")
		#$("#gallery").disableSelection()	
		this.$().disableSelection()
	deleteDoc: (e)->
		c=e.context; controller=e.view.controller; opts=controller.opts; li=$(e.target).closest("li")
		oCONTROLS.dialog.Confirm({title:"Dokumento pašalinimas",msg:"Ištrinti dokumentą '"+e.context.docName+"'?"}, ()-> 
			SERVER.update2("Action":"Delete","Ctrl":$("#"+opts.docViewForTreeId),"source":"tblDocs",#"row":doc,
			DataToSave:{"id":c.docID, "DataTable":"tblDocs"},
			Msg: { Title: "Duokumento pašalinimas", Success: "Dokumentas '"+c.docName+"' pašalintas.", Error: "Nepavyko pašalinti dokumento '"+c.docName+"'." },
			CallBackAfter:(Row)->
				obj=controller.AllDocs.findProperty("iD", c.docID)
				controller.AllDocs.removeObject(obj)
				li.fadeOut()
				#doc.set("docTypeID", newdocTypeID).set("groupID", newGroupID) nereikia
				# if opts.categoryOpts.accident
					# accidentID=opts.categoryOpts.accident.iD
					# oDATA.GET("tblDocsInAccidents").emData.filter((item)->(item.docID==docID and item.accidentID==opts.categoryOpts.accident))
				#docElement.fadeOut() reiktu ant erroro atstatyt bus ko gero CallBack:{Error:function(){}}
			)		
		)
		