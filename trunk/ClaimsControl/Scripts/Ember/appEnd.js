//accidents.js
//App.AccidentsView = App.mainMenuView.extend({ templateName: 'tmpAccidents', viewIx: 0 });
App.ClaimsView = App.mainMenuView.extend({ templateName: 'tmpClaims', viewIx: 1 });
App.MapView = App.mainMenuView.extend({ templateName: 'tmpMap', viewIx: 2 });
App.ReportsView = App.mainMenuView.extend({ templateName: 'tmpReports', viewIx: 3 });

App.AdminView = App.mainMenuView.extend({ templateName: 'tmpAdmin', viewIx: 5 });

App.Router = Em.Router.extend({
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
				//router.get('applicationController').connectOutlet('accidents');
			},
			editAccident: function (e) {
				App.accidentsController.tbodyClick(e);
				alert("opa");
			}
		}),
		tabClaims: Em.Route.extend({
			route: '/claims',
			connectOutlets: function (router, context) {
				MY.NavbarController.fnSetNewTab(router.currentState.name, 1);
				//	router.get('applicationController').connectOutlet('claims');
			}
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
			route: '/lists',
			connectOutlets: function (router, context) {
				MY.NavbarController.fnSetNewTab(router.currentState.name, 4);
				App.listsStart();
				oDATA.execWhenLoaded(["tmpAllVehicles"], function (){
					router.get('applicationController').connectOutlet('listsOutlet','topLists');
				});			
			},
			toListAll: function (router, context) {
				d=$(context.target).parent().data("ctrl");
				 App.listAllController.set("current",d);
				router.get('applicationController').connectOutlet('listsOutlet',d.goTo);
			},
			toTop: function (router, context){
				App.listsStart();//Atnaujinam, jai buvo keista
				router.get('applicationController').connectOutlet('listsOutlet','topLists');
			}
		}),
		tabAdmin: Em.Route.extend({
			route: '/admin',
			connectOutlets: function (router, context) {
				MY.NavbarController.fnSetNewTab(router.currentState.name, 5);
				router.get('applicationController').connectOutlet('adminOutlet', 'admin');
			}
		})
	})
});
App.initialize();