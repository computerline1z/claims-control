`var w=window,$ = w.jQuery, App=w.App, Em=w.Em, initTreePadding = false;`

App.create_docsTypesController=(categoryOpts)->(
	App.docsTypesController = Em.ResourceController.create(	
		#docsTypesControllerOpt:
		init: ()-> 
			@_super(); me = this; docTypes = oDATA.GET("tblDocTypes").emData; @.set("docTypes",docTypes) #docTypes naudojam sarašųredagavimui
			if categoryOpts then @refreshTree(categoryOpts)
		refreshTree: (categoryOpts)->
			oGLOBAL.logFromStart("Started refreshTree");
			if categoryOpts then @set("categoryOpts",categoryOpts) else categoryOpts=@categoryOpts;
			catOpts=categoryOpts; cats=oDATA.GET("tblDocGroup").emData; docs=oDATA.GET("tblDocs").emData; c = []; me=@; newItem_Nepriskirti=""	

			if catOpts.driver then cats.findProperty("ref",3).set("name",catOpts.driver.title)
			cats.forEach (catItem, i) ->
				newItem = categoryId: catItem.iD, title: catItem.name
				ref = catItem.ref
				#console.log "catItem.iD: " + i + ", catItem.name: " + catItem.name
				newItem.isTree = "isTree" if ref isnt 1 and ref isnt 5 #Nuotraukom ir nepriskirtom nedarom medzio
				newItem.isGroup = "isGroup"
				newItem.isSelectable = true	if ref isnt 4 #masinom bus uz masinas medis, tai negalim pasirinkt
				fnGetCatDocs=(refID,item)->
					catDocs=docs.filter((doc)->doc.refID==refID and doc.groupID==catItem.iD);
					item.title+=if catDocs.length then " ("+catDocs.length+")" else ""
					catDocs
				if ref is 4
					No=0
					newItem.items = catOpts.vehicles.map (item) ->
						isGroup: "isGroup", refID: item.iD, categoryId: catItem.iD, title: item.title, isTree: "isTree", isSelectable: true
					newItem.items.forEach (vehicle) ->
						catDocs=fnGetCatDocs(vehicle.refID,vehicle); No+=catDocs.length
						vehicle.items = me.setDocTypes(me.docTypes,catItem.iD,vehicle.refID,catDocs)#automobiliam atskiriam pagal refID
					newItem.title+=if No then " ("+No+")" else ""
				else
					refID=if ref==3 then catOpts.driver.iD else catOpts.accident.iD # 3-driveris, kiti įvykio iD
					catDocs=fnGetCatDocs(refID,newItem)
					newItem.items = me.setDocTypes(me.docTypes,catItem.iD,refID,catDocs)
				if ref==5 then newItem_Nepriskirti=newItem else c[c.length] = newItem #Paciam gale priskiriam
			c[c.length] = newItem_Nepriskirti	
			@set "content", c
			oGLOBAL.logFromStart("Finished refreshTree");
		setDocTypes: (docTypes, groupID, refID,catDocs) ->
			No="";catDocs=catDocs
			# if (refID) then fnMap=(item) -> (categoryId: item.iD, title: item.name, refID: refID) #atskiriam pagal refID
			# else fnMap=(item) -> (categoryId: item.iD, title: item.name)
			docTypes.filter((type) -> type.docGroupID is groupID).map((docType) ->
				No=catDocs.filter((doc)->
					doc.docTypeID==docType.iD
				).length;
				No=if No then " ("+No+")" else ""
				categoryId: docType.iD, title: (docType.name+No), refID: refID
			)#atskiriam pagal refID
		###################### dokumentų tipai ( naudojami redagavimui) App.docsTypesController #####################
		content:[],docTypes:[]
		filterTypes:(->
			console.log("Start filterTypes fn")
			dt=@.get("docTypes");dg=oDATA.GET("tblDocGroup").emData
			@set("docTypes_accident",dt.filterProperty("docGroupID",dg.findProperty("ref",2).iD);)
			@set("docTypes_driver",dt.filterProperty("docGroupID",dg.findProperty("ref",3).iD);)
			@set("docTypes_vehicle",dt.filterProperty("docGroupID",dg.findProperty("ref",4).iD);)
		#).observes("docTypes.@each")
		).observes("docTypes.length")

		  # duration: function() {
		# var duration = this.get('content.duration'),
			 # minutes = Math.floor(duration / 60),
			 # seconds = duration % 60;

		# return [minutes, seconds].join(':');
		# }.property('content.duration')	
	)
)


$.widget "ui.Tree",	
options:
	treeId:"dynamicTree", docViewForTreeId:"docViewForTree", formTemplate:"tmpUploadForm", docsUpdateCallBack: null,
	categoryOpts: {}, # <- kategorijos
	docsTypesController:"docsTypesController",#-jame(content) sudedamos grupės ir tipai, pagal jį paišomas medis
	TreeDocController:"treeDocController"#-jame(docs) pagal dokumentus paišomi dokumentai
_create: ->	
	#Changed to Apurav v. $('<table width="100%;"><tr style="vertical-align:top"><td style="width:28em"><div id="'+@options.treeId+'" style="border-right: 1px solid #ddd;"></div></td>'+
	$('<table width="100%;"><tr style="vertical-align:top"><td style="width:28em"><div id="'+@options.treeId+'" ></div></td>'+
	'<td style="vertical-align:top;padding:10px;"><div id="'+@options.docViewForTreeId+'"></div></td></tr></table>').appendTo(@.element)
	
	#Kontrolerio, kuris turi dokumentų tipus medziui ir dokumentų redagavimui sukūrimas
	if App.docsTypesController then App.docsTypesController.refreshTree(@options.categoryOpts)#atnaujinam content, kuris naudojamas medžiui
		#if App.docsTypesController.content.length then App.docsTypesController.refreshTree(@options.categoryOpts)#atnaujinam content, kuris naudojamas medžiui		
	else App.create_docsTypesController(@options.categoryOpts)
		
	App.DocTreeView = Em.View.extend(@DocTreeViewOpt) #Paišo medžio šakas
	@TreeViewOpts.opts=@options
	@TreeDocControllerOpts.opts=@options
	@DocTreeViewOpt.opts=@options
	App.TreeView = Em.View.extend(@TreeViewOpts) #Jame inicializuojasi dokai	
	App[@options.TreeDocController]  = Em.Object.create(@TreeDocControllerOpts)
	MY.accidentCard.TreeView=Em.View.create(templateName: "tmpDocsTree").appendTo "#"+@options.treeId
	@docViewForTreeOpts.controller = App[@options.TreeDocController]
	@docViewForTreeOpts.opts = @options
	
	MY.accidentCard.DocsView=Em.View.create(@docViewForTreeOpts).appendTo "#"+@options.docViewForTreeId
  
DocTreeViewOpt:
	templateName: "tmpDocsNodes", tagName: "", opts: null,
	didInsertElement: ->
		#Apurav Code addition
		# unless initTreePadding
		  # $("#dynamicTree ul").each ->
		    # $(this).find("div.treeContent").animate
		      # paddingLeft: "+=5px"
		    # , 100

		  # initTreePadding = true
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
		App.treeDocController.set "selectedCategoryId", event.view.bindingContext.categoryId
		#$("#"+@opts.treeId).find("span").removeClass "ui-state-highlight"
		$('div.treeContent').removeClass("selected selectNeighbor")
		
		#dynamicTree @_context={categoryId,isSelectable,isTree,items,title} ir t.p. bindingContext
		t = $(event.target); 
		#(if t.is("li") then t.find("span:first") else t.closest("span")).addClass("ui-state-highlight");
		#Apurav changes:
		(if t.is("li") then t.find("div:first") else t.closest("div")).addClass("selected");
		
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
		#currentDocs.forEach (doc) -> console.log "iD: " + doc.iD + ", docName: " + doc.docName + ", docTypeID:" + doc.docTypeID + ", groupID:" + doc.groupID	
		docsPath=oDATA.GET("userData").emData[0].docsPath; url="Uploads/"+docsPath; users=oDATA.GET("tblUsers").emData; docTypes=oDATA.GET("tblDocTypes").emData
		
		fnGetIcon=(ext) -> ext=ext.slice(0,3); return "img32-doc_" + (if ext=="xls"||ext=="doc"||ext=="pdf" then ext else "unknown" )
		fnGetUser=((userID) -> u=users.find((user)->user.iD==userID); u.firstName+" "+u.surname;)		
		fnGetDocType = (typeID)-> docTypes.find((type)->type.iD==typeID).name
		
		isPhoto=if (ctx.isGroup and ctx.categoryId==1) then true else false 
			
		showDocs=currentDocs.map((doc)-> 
			user=fnGetUser(doc.userID);file="/"+doc.iD+"."+doc.fileType
			Em.Object.create(				
				docID:doc.iD,
				hasThumb:doc.hasThumb, urlThumb:url+"/Thumbs"+file, urlDoc:url+file,docType:fnGetDocType(doc.docTypeID),description:doc.description,
				docName:doc.docName,userName:user,fileDate:doc.fileDate,fileName:doc.docName+"."+doc.fileType
				fileIcon: if not doc.hasThumb then fnGetIcon(doc.fileType) else "img32-doc_unknown"
				docDetails: if isPhoto then "" else "Įkėlė "+user+" "+doc.fileDate+", dydis - "+Math.ceil(doc.fileSize/10000)/100+"Mb"
			)
		)
		
		App[@opts.TreeDocController].set("isPhoto", isPhoto)
		#console.log("showDocs:");console.log(showDocs)
		App[@opts.TreeDocController].set("docs", showDocs)
		false
	expandCollapse: (event) ->
		node = event.target
		if node.src.indexOf("spacer") is -1
			subbranch = $("ul", node.parentNode.parentNode)
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
	init: () ->
		@_super(); @refreshDocs();tree=$("#"+@opts.treeId);
		Em.run.next(@,->
			if @AllDocs.filter((doc)-> doc.groupID==5).length #Jei yra nepriskirtų keliam ten
				tree.find("ul>li:last").trigger("click")
			else if @AllDocs.filter((doc)-> doc.groupID==1).length
				tree.find("li:first").trigger("click")
			else
				tree.find("li:nth(1)").trigger("click")
		)
	refreshDocs: () ->
		oGLOBAL.logFromStart("Started refreshDocs");
		docs=oDATA.GET("tblDocs").emData; cats=@opts.categoryOpts; docGroups=oDATA.GET("tblDocGroup").emData
		if cats.accident
			#@AllDocs=docs.filterByTbl(filterTbl:oDATA.GET("tblDocsInAccidents").emData,joinField:"docID",filterField:"accidentID",filterValue:cats.accident.iD)
			accidentID=cats.accident.iD; vehicles=cats.vehicles; driverID=cats.driver.iD
			driverGroupID=docGroups.findProperty("ref",3).iD;vehicleGroupID=docGroups.findProperty("ref",4).iD
			@AllDocs=docs.filter((doc)->
				refID=doc.refID;groupID=doc.groupID
				if groupID==driverGroupID
					if refID==driverID then return true
				else if groupID==vehicleGroupID
					if vehicles.findProperty("iD",refID) then return true
				else if refID==accidentID then return true
				else return false
			)
		else @AllDocs=docs
		oGLOBAL.logFromStart("Finished refreshDocs");
	docs: [], opts: null, AllDocs: [] #šito konteksto visi dokai
	selectedCategoryId: null
	deleteDocument: (docElement, selectedNode) ->		
		# alert "Document Id -> " + docElement.data("doc-id")
		# + "\n" + "From category -> " + @get("selectedCategoryId") #App[@opts.TreeDocController].get("selectedCategoryId")
		# + "\n" + "To category -> " + $(selectedNode).data("category-id")
		sN=$(selectedNode); refID=sN.data("ref-id"); isGroup=sN.hasClass("isGroup")
		docID=docElement.data("doc-id")
		newdocTypeID=$(selectedNode).data("category-id")
		
		docType=oDATA.GET("tblDocTypes").emData.find((types)->types.iD==newdocTypeID)
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
	attributeBindings: ["data-toggle","data-target"]
	"data-toggle": "modal-gallery"
	"data-target": "#modal-gallery"
	#data-toggle="modal-gallery" data-target="#modal-gallery"
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
MY.accidentCard={}