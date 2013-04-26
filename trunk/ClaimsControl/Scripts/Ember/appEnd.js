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
		viewClaims: Em.State.transitionTo('tabClaims'),
		viewMap: Em.State.transitionTo('tabMap'),
		viewReports: Ember.State.transitionTo('tabReports'),
		viewLists: Ember.State.transitionTo('tabLists'),
		viewAdmin: Ember.State.transitionTo('tabAdmin'),
		// STATES
		//main
		tabAccidents: Em.Route.extend({
			route: '/',
			connectOutlets: function (router, context) {
				MY.NavbarController.fnSetNewTab(router.currentState.name, 0);
				$("#divAccidentsList").find("div.col2").css("top","0");//Pataisyt šoninį stulpelį, kad būtų lygiai su viršum
			}//,
			//uploadFiles:function (e){
			//	oCONTROLS.fnStartUploader({title:"mano titulas"});
			//}
		}),
		tabClaims: Em.Route.extend({
			route: '/claims',
			connectOutlets: function (router, context) {
				MY.NavbarController.fnSetNewTab(router.currentState.name, 1);
				oDATA.fnLoad2({ url: "Main/tabClaims", callBack: function () {
						App.claimsStart();
						router.get('applicationController').connectOutlet('claimsOutlet', 'tabClaims');		
						router.get('applicationController').connectOutlet('claimsSidePanelOutlet', 'sidePanelForClaims');
					}
				});
			},
			//route: '/claimEdit',
			// connectOutlets: function (router, context) {
				// MY.NavbarController.fnSetNewTab(router.currentState.name, 1);
				// router.get('applicationController').connectOutlet('editClaimOutlet', 'tabClaims');		
			// },
			claimRegulation: function (router, context){
				//App.listsStart();//Atnaujinam, jai buvo keista
				//MY.NavbarController.fnSetNewTab(router.currentState.name, 1);
				console.log(context.context);
				//App.tabClaimsRegulationController.set('content',[context.context]);//!!!!būtinai array
				App.tabClaimsRegulationController.set('claim',context.context);//!!!!būtinai array
				router.get('applicationController').connectOutlet('claimRegulationOutlet','tabClaimsRegulation'); 
			},
			// goBack:function (router, context){
				// $('#divClaimRegulation').hide().parent().spinner({ position: 'center', img: 'spinnerBig.gif' });
				// $('#divClaimsList').show();
				// $("body").find("img.spinner").remove();
			// }
		}),
		tabMap: Em.Route.extend({
			route: '/map',
			connectOutlets: function (router, context) {
				MY.NavbarController.fnSetNewTab(router.currentState.name, 2);
				//	router.get('applicationController').connectOutlet('map');
			}
		}),
		tabReports: Em.Route.extend({
			route: '/reports',
			connectOutlets: function (router, context) {
				MY.NavbarController.fnSetNewTab(router.currentState.name, 3);
				//router.get('applicationController').connectOutlet('reports');
			}
		}),
		tabLists: Em.Route.extend({
			route: '/tabLists',
			connectOutlets: function (router, context) {
				MY.NavbarController.fnSetNewTab(router.currentState.name, 4);
				oDATA.fnLoad2({ url: "Main/tabLists", checkFn: "App.listsStart", runAllways:true, callBack: function () {
						App.listsStart();
						router.get('applicationController').connectOutlet('listsOutlet','topLists');
					}
				});
			},
			toListAll: function (router, context) {
				if (MY.NavbarController.fnSetNewTab(router.currentState.name, 4,'tabLists')) {
					d=$(context.target).parent().data("ctrl");
					App.listAllController.set("current",d);			
					router.get('applicationController').connectOutlet('listsOutlet', d.goTo);
				}
			},
			toTop: function (router, context){
				App.listsStart();//Atnaujinam, jai buvo keista
				router.get('applicationController').connectOutlet('listsOutlet','topLists');
			}
		}),
		tabAdmin: Em.Route.extend({
			route: '/tabAdmin',
			connectOutlets: function (router, context) {
				MY.NavbarController.fnSetNewTab(router.currentState.name, 5);
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
				if (MY.NavbarController.fnSetNewTab(router.currentState.name, ix,'tabAdmin')){//Jeigu false jis permes i route tabAdmin, todel sito nevykdysim
					router.get('applicationController').connectOutlet('adminOutlet', 'tabUserCard');		
				}				
			}
		}),
		tabMyCard: Em.Route.extend({
			route: '/tabMyCard',
			connectOutlets: function (router, context) {	
				if (MY.NavbarController.fnSetNewTab(router.currentState.name, -1,'tabAdmin')){//Jeigu false jis permes i route tabAdmin, todel sito nevykdysim
					router.get('applicationController').connectOutlet('adminOutlet', 'tabUserCard');		
				}				
			}
		}),		
		tabChangePass: Em.Route.extend({
			route: '/changePass',
			connectOutlets: function (router, context) {			
				if (MY.NavbarController.fnSetNewTab(router.currentState.name, -1,'tabEmpty')){
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
});