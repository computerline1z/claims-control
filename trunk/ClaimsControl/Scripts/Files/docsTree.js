App.startTree=function(settings) {
App.DocsTypesController = Em.ResourceController.create({
	init: function(){
		this._super();
		me=this;
		// settings={"NewRec":0,"Source":"tblAccidents","vehicles":[{"iD":4,"title":"BRU641,Man,TGH-152 dokumentai"},{"iD":10,"title":"BRU999,Man,KRAZ dokumentai"}],
		  // "id":70};
		var cats=oDATA.GET("tblDocGroup").emData,docTypes=oDATA.GET("tblDocType").emData, c=[];
		cats.forEach(function(catItem,i){
			var newItem ={"categoryId": catItem.iD, "title":catItem.name};
			var i=catItem.iD;
			console.log("catItem.iD: "+i+", catItem.name: "+catItem.name);
				if (i!==1&&i!==5){newItem.isTree=true;}
				if (i!==4){newItem.isSelectable=true;}//masinom bus uz masinas medis, tai negalim pasirinkt 
				if (i===4){
					newItem.items=settings.vehicles.map(function(item){return{"refId":item.iD,"categoryId": 4,"title":item.title,"isTree":true,"isSelectable":true};});
					newItem.items.forEach(function (vehicle){vehicle.items = me.setDocTypes(docTypes,catItem.iD)});		
				} else{
					newItem.items =me.setDocTypes(docTypes,catItem.iD);		
				}	
				c[c.length]=newItem;
		});
		this.set("content",c);
	},
	setDocTypes:function(docTypes,groupID){
		return  docTypes.filter(function(type){return type.docGroupID===groupID;})
					.map(function(item){return{"categoryId":item.iD,"title":item.name};});	
	},
	content: []
});

App.DocTreeView = Ember.View.extend({
	templateName: 'tmpDocsNodes',
	tagName:'',
	didInsertElement:function(){
		$('li.treeItem').droppable( {
				accept : "#gallery > li",
				over : function(event, dragged) {
					$(this).addClass("treeItemHover");
					subbranches = $('ul', this);
					if (subbranches.size() > 0) {
						subbranch = subbranches.eq(0);
						if (subbranch.css('display') == 'none') {
							var targetBranch = subbranch.get(0);
							window.setTimeout(
								function() {
									$(targetBranch).show();
									$('img.expandImage',targetBranch.parentNode).eq(0).attr('src','Content/less/images/bullet_toggle_minus.png');
								}, 500);
							}
						}
				},
				out : function() {
					$(this).removeClass("treeItemHover");
				},
				drop : function(event, dropped) {
					$(this).removeClass("treeItemHover");
					subbranch = $('ul', this);
					if (subbranch.size() == 0) {
						var textElement = $(this).find('span.textHolder').eq(0);
						//var content =textElement.text().split('(');
						//textElement.text(content[0]+ "("+ (parseInt(content[1].split(')')[0]) + 1)+ ")");
						App.TreeDocController.deleteDocument(dropped.draggable,this);
						//DocManagementService.deleteDocument(dropped.draggable,this);
					}
				}
			});
	  }
});
App.TreeCategoryView = Ember.View.extend({
  templateName: 'tmpDocsCategory',
  tagName:'',
  classNames:[],
  getDocs:function(event){
	
	App.TreeDocController.set('selectedCategoryId',event.view.bindingContext.categoryId);
	$('li.treeItem').removeClass("ui-state-highlight");
	//$(event.target).parent().addClass("ui-state-highlight");
	var t=$(event.target), li=(t.hasClass("clickable")) ?t:t.parent().closest("li.clickable");li.addClass("ui-state-highlight");
	/*send ajax call to get data for selected child category id and update App.TreeDocController
	   category id is retrieved by "alert(event.view.bindingContext.categoryId);".
	   For this sample creating two new dummy objects that will be updated in the doc view
	*/
	console.log("categoryId: "+event.view.bindingContext.categoryId);
	var timeStamp = new Date().getTime();
	var newDoc = 	App.DocInfo.create({
			  docId:8,
			  categoryId:6,
			  name:timeStamp+' .jpg',
			  photoUrl: 'Uploads/high_tatras3_min.jpg',
			  desc:'2011.01.15, dydis'		
			});
			var newDoc2 = 	App.DocInfo.create({
			  docId:9,
			  categoryId:6,
			  name:timeStamp+' .jpg',
			  photoUrl: 'Uploads/high_tatras3_min.jpg',
			  desc:'2011.08.09, dydis'		
			})
			var docs = App.TreeDocController.set('docs',[newDoc,newDoc2]);
	},
expandCollapse:function(event){
		var node = event.target;
		if (node.src.indexOf('spacer') == -1) {
			subbranch = $('ul', node.parentNode);
			var action = 'hide';
			if (subbranch.eq(0).css('display') == 'none') {
				action = 'show';
			}
			$(subbranch).each(function(){
				if(action =='show'){
					$(this).show();
					$(this).parent().find('img.expandImage').attr('src','Content/less/images/bullet_toggle_minus.png');
					
				}else{
					$(this).hide();
					$(this).parent().find('img.expandImage').attr('src','Content/less/images/bullet_toggle_plus.png');
					
				}
			});
		}
  }
});

App.DocInfo = Ember.Object.extend({
	  docId:null,
	  categoryId:null
});
App.TreeDocController = Ember.Object.create({
	docs: [],
	selectedCategoryId:null,
	deleteDocument: function(docElement,selectedNode) {
		/*send ajax call to delete the document from the current selected category and
		  add it to the new category
		*/
		alert("Document Id -> " + docElement.attr('data-doc-id')+'\n'+
			  "From category -> "+App.TreeDocController.get('selectedCategoryId')+'\n'+
			  "To category -> "+$(selectedNode).attr('data-category-id'));
		 docElement.fadeOut();
	   }
});
App.docViewForTree = Ember.View.create({
templateName: 'tmpDocsDocs',
tagName:'ul',
elementId:'gallery',
classNames:['gallery','ui-helper-reset','ui-helper-clearfix'],
controller:  App.TreeDocController,
didInsertElement:function(){
	
	$('#gallery').sortable({
				revert: true,
				opacity: 0.2,
				refreshPositions:true,
				update:function(event,ui){
					var order = []; 
					$('#gallery li').each( function(index,ele) {
					  order.push("Position "+(index + 1)+" has docId = "+$(ele).attr('data-doc-id') );
					});
					/*Send update call to server with new order*/
					alert('Updated order for CategoryId '+App.TreeDocController.get('selectedCategoryId')
						+' is =\n' +order.join('\n'));
				}
	});
	$('#gallery').disableSelection();
}
});

		 
App.DocsTreeView = Ember.View.create({
	templateName:"tmpDocsTree"
});
App.DocsTreeView.appendTo('#dynamicTree');		 
App.docViewForTree.appendTo('#docViewForTree');
}

// App.docsTree=function(p){ //({accidentForm:accidentForm, docsForm:docsForm, uploadForm:uploadForm});
	// oDATA.execWhenLoaded(["tmpDocsTree"], function() {//,"tblDocType"
		// App.startTree();
		// console.log("execWhenLoaded");
	// });
// }
