//tabAccidents.js
//App.AccidentsView = App.mainMenuView.extend({ templateName: 'tmpAccidents', viewIx: 0 });
App.ClaimsView = App.mainMenuView.extend({ templateName: 'tmpClaims', viewIx: 1 });
App.MapView = App.mainMenuView.extend({ templateName: 'tmpMap', viewIx: 2 });
App.ReportsView = App.mainMenuView.extend({ templateName: 'tmpReports', viewIx: 3 });
//App.AdminView = App.mainMenuView.extend({ templateName: 'tmpAdmin', viewIx: 5 });

App.Router = Em.Router.extend({
	executed:{},//Užsižymim, kad buvo spausti
	enableLogging: false,
	location: 'hash',
	root: Em.Route.extend({
		// EVENTS
		viewAccidents: Em.State.transitionTo('tabAccidents'),
		viewClaims: function(router,e) {
			if (e.context){
				if (e.target.tagName.toUpperCase()==="A"){
					var iD=$(e.target).data("id");
					if (iD){console.log("ActivityID: "+ iD);App.tabClaimsRegulationController.clickActivityID=iD;}
				}
				if (!e.context.claimNo){e.context.claimNo=e.context.accident.no+"-"+e.context.no;}//Nr reikalingas routu atvaizdavimui
				router.transitionTo('claimRegulation',e.context);
			}
			else{router.transitionTo('claimList');}
		},
		viewMap: Em.State.transitionTo('tabMap'),
		viewReports: Ember.State.transitionTo('tabReports'),
		viewLists: Ember.State.transitionTo('tabLists'),
		viewAdmin: Ember.State.transitionTo('tabAdmin'),
		// STATES
		//main
		tabAccidents: Em.Route.extend({
			route: '/',
			connectOutlets: function (router, context) {
				MY.NavbarController.fnSetNewTab({newState:router.currentState.name, viewIx:0});//newState, viewIx,newOutlet
				$("#divAccidentsList").find("div.col2").css("top","0");//Pataisyt šoninį stulpelį, kad būtų lygiai su viršum
			}
		}),
		claimList: Em.Route.extend({
			route: '/claims',
			connectOutlets:function (router, context){
				MY.NavbarController.fnSetNewTab({newState:'tabClaims', viewIx:1,transparent:true,hide:"#divClaimRegulation",show:"#divClaimsList",needUrl:"Main/tabClaims",
					callBack:function(){
						App.claimsStart();
						router.get('applicationController').connectOutlet('claimsOutlet', 'tabClaims');
						router.get('applicationController').connectOutlet('claimsSidePanelOutlet', 'sidePanelForClaims');
					}
				});
			}
		}),
		claimRegulation: Em.Route.extend({
			route: '/claim/:claimNo',
			connectOutlets:function (router, context){
				MY.NavbarController.fnSetNewTab({newState:'tabClaims', viewIx:1,transparent:true,show:"#divClaimRegulation",hide:"#divClaimsList",needUrl:"Main/tabClaims",
					callBack:function(){
						App.claimsStart();
						if (!context.accident){
							var no=context.claimNo.split("-"),accNo=parseInt(no[0],10),clNo=parseInt(no[1],10);
							var accident=oDATA.GET("proc_Accidents").emData.find(function(a){if (a.no===accNo){return true} return false;  });
							var claim=oDATA.GET("proc_Claims").emData.find(function(c){if (c.no===clNo){if (c.accidentID===accident.iD) return true;} return false;});
							if (!claim){router.transitionTo('tabAccidents'); return false;}
							App.claimsController.setClaimContext(claim);
							$.extend(context,claim);
						}
						App.tabClaimsRegulationController.set('claim',context);
						router.get('applicationController').connectOutlet('claimRegulationOutlet','tabClaimsRegulation'); 
					}
				});
			}
		//})
		}),
		/*tabMap: Em.Route.extend({
			route: '/map',
			connectOutlets: function (router, context) {
				MY.NavbarController.fnSetNewTab({newState:router.currentState.name, viewIx:2});
			}
		}),*/
		tabReports: Em.Route.extend({
			route: '/reports',
			connectOutlets: function (router, context) {
				MY.NavbarController.fnSetNewTab({newState:router.currentState.name, viewIx:3});
				if ($("#tabReports").length){if  ($("#tabReports>div").html().length){return false;}}//Jei ten tuscia idedam nauja (emberis viduj diva ideda)
				oDATA.fnLoad2({ url: "Main/tabReports", callBack: function () {App.reportsStart();router.get('applicationController').connectOutlet('reportsOutlet','tabReportsMain');}});
			}
		}),
		tabLists: Em.Route.extend({
			route: '/tabLists',
			connectOutlets: function (router, context) {
				MY.NavbarController.fnSetNewTab({newState:router.currentState.name, viewIx:4,transparent:true});
				oDATA.fnLoad2({ url: "Main/tabLists", checkFn: "App.listsStart", runAllways:true, callBack: function () {
						App.listsStart();
						router.get('applicationController').connectOutlet('listsOutlet','topLists');
					}
				});
			},
			toListAll: function (router, context) {
				if (MY.NavbarController.fnSetNewTab({newState:router.currentState.name, viewIx:4,newOutlet:'tabLists'})) {
					d=$(context.target).parent().data("ctrl");
					App.listAllController.set("current",d);			
					router.get('applicationController').connectOutlet('listsOutlet', d.goTo);
				}
			},
			toTop: function (router, context){
				MY.NavbarController.fnSetNewTab({newState:router.currentState.name, viewIx:4,transparent:true});
				App.listsStart();//Atnaujinam, jai buvo keista
				router.get('applicationController').connectOutlet('listsOutlet','topLists');
			}
		}),
		tabAdmin: Em.Route.extend({
			route: '/tabAdmin',
			connectOutlets: function (router, context) {
				MY.NavbarController.fnSetNewTab({newState:router.currentState.name, viewIx:5,transparent:true});
				oDATA.fnLoad2({ url: "Main/tabAdmin", callBack: function () {
					App.adminStart();
					console.log(".connectOutlet('adminOutlet', 'tabAdmin');");
					router.get('applicationController').connectOutlet('adminOutlet', 'tabAdmin');					
					}
				});			
			}
		}),
		tabUserCard: Em.Route.extend({
			route: '/tabUserCard',
			connectOutlets: function (router, context) {	
				var ix=(App.userCardController.myInfo)?-1:5;
				if (MY.NavbarController.fnSetNewTab({newState:router.currentState.name, viewIx:ix,newOutlet:'tabAdmin'})){//Jeigu false jis permes i route tabAdmin, todel sito nevykdysim
					router.get('applicationController').connectOutlet('adminOutlet', 'tabUserCard');		
				}				
			}
		}),
		tabMyCard: Em.Route.extend({
			route: '/tabMyCard',
			connectOutlets: function (router, context) {	
				if (MY.NavbarController.fnSetNewTab({newState:router.currentState.name, viewIx:-1,newOutlet:'tabAdmin'})){//Jeigu false jis permes i route tabAdmin, todel sito nevykdysim
					router.get('applicationController').connectOutlet('adminOutlet', 'tabUserCard');		
				}				
			}
		}),		
		tabChangePass: Em.Route.extend({
			route: '/changePass',
			connectOutlets: function (router, context) {			
				if (MY.NavbarController.fnSetNewTab({newState:router.currentState.name, viewIx:-1,newOutlet:'tabEmpty'})){
					router.get('applicationController').connectOutlet('emptyOutlet', 'changeUserPass');	//'tabAdmin';			
				}				
			}
		}) 
	})
});
App.initialize();

$(function() {
	$("#userLink").on("click",function(e) {
		App.userCardController.setUser({myInfo:true});
		App.router.transitionTo('tabMyCard')
		return false;
	});
	$("body").hoverIntent({
		over: function(e){
			var t=$(this),ext=t.closest(".ExtendIt");data=ext.data("ctrl"),field=(data.colLabels)?data.colLabels:data.Field;
			var txt=App.Lang.tables[t.closest(".js-frm").data("ctrl").Source].Cols[field].tip;
			var offset=ext.offset();
			
			var div=$('<div id="js-tip-id" style="left:'+offset.left+'px;top:'+offset.top+'px;width:'+ext.width()+'px;">'+txt+'</div>').appendTo('body');
			if ( offset.top-div.height()-20> $(window).scrollTop()){//Telpa - dedam viršuj
				div.addClass("js-tip-top").offset({top:(div.offset().top-div.height()-20)});
			}else{//Netelpa - dedam apačioj
				div.addClass("js-tip-bottom").offset({top:(div.offset().top+ext.height()+div.height())});
			}
			div.fadeIn("slow");
		},
		out: function(e){
			$('#js-tip-id').fadeOut("slow").remove();
		},
		selector: 'label.js-tip'
	});
	Em.run.next(function(){
		$("#tabAccidents,#tabClaims,#tabReports,#tabLists,#tabAdmin").on('focus', 'input:text,textarea', function(e){
			$(e.target).addClass("activeField");
		}).on('blur','input:text,textarea',function(e) {
			$(e.target).removeClass("activeField");
		});
		// setInterval(function(){
			// $.post("System/Beat",
				// function(data) {console.log(data);});
		// },30000);
	});
	/*(function(){ //reload at 6 in the morning
		var upTime=6, now=new Date(),minsLeft=(24-now.getHours()+upTime)*60-(60-now.getMinutes());
		console.log("Mins left: "+minsLeft);
		var milSecs=minsLeft*60000;
		console.log("milSecs left: "+milSecs);
		setTimeout(function(){
			console.log("reloading");
			location.reload();
		}, milSecs);
	}());*/
});