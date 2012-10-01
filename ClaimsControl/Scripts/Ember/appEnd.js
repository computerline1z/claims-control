//accidents.js
//App.AccidentsView = App.mainMenuView.extend({ templateName: 'tmpAccidents', viewIx: 0 });
App.ClaimsView = App.mainMenuView.extend({ templateName: 'tmpClaims', viewIx: 1 });
App.MapView = App.mainMenuView.extend({ templateName: 'tmpMap', viewIx: 2 });
App.ReportsView = App.mainMenuView.extend({ templateName: 'tmpReports', viewIx: 3 });

App.TopListsView = App.mainMenuView.extend({ templateName: 'tmpListsTop', viewIx: 4 });
App.AllDriversView = App.mainMenuView.extend({ templateName: 'tmpAllDrivers', viewIx: 4 });
App.AllInsPoliciesView = App.mainMenuView.extend({ templateName: 'tmpAllInsPolicies', viewIx: 4 });
App.AllVehiclesView = App.mainMenuView.extend({ templateName: 'tmpAllVehicles', viewIx: 4 });
App.AdminView = App.mainMenuView.extend({ templateName: 'tmpAdmin', viewIx: 5 });

App.Router = Em.Router.extend({
	enableLogging: true,
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
				router.get('applicationController').connectOutlet('listsOutlet','topLists');
				//Ember.run.later({router2:router},function(){
				//	this.router2.get('applicationController').connectOutlet('listsOutlet','topLists2');
				//},2000);
			},
			toListAll: function (router, context) {			
				router.get('applicationController').connectOutlet('listsOutlet',$(context.target).parent().data("ctrl").goTo);
			},
			toTop: function (router, context){
				router.get('applicationController').connectOutlet('listsOutlet','topLists');
			}
		}),
		tabAdmin: Em.Route.extend({
			route: '/admin',
			connectOutlets: function (router, context) {
				MY.NavbarController.fnSetNewTab(router.currentState.name, 5);
				//router.get('applicationController').connectOutlet('admin');
			}
		})
	})
});
App.initialize();