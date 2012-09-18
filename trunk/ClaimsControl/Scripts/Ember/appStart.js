App = Em.Application.create();
App.ApplicationController = Em.Controller.extend();
App.ApplicationView = Em.View.extend({ templateName: 'tmpApplication'});
App.NavbarController = Em.Controller.extend({
	currentState: null,
	fnSetNewTab: function (newState, viewIx) {
		var controller = this;
		var lastState = this.get("currentState");
		if (lastState) {
			//$('#ulMainMenu a.selected').removeClass("selected").addClass("notactive");
			//$('#ulMainMenu a:eq(' + this.get("viewIx") + ')').removeClass("notactive").addClass("selected ui-corner-top");
			$('#ulMainMenu a.selected').removeClass("selected").addClass("notactive");
		} else { controller.set("currentState", "tabAccidents"); }
		Em.run.next(function () {
			$('#ulMainMenu a:eq(' + viewIx + ')').removeClass("notactive").addClass("selected ui-corner-top"); //Pazymim naujo menu taba
			$('#' + controller.get("currentState")).addClass("hidden"); //Paslepiam aktyvų taba
			$('#' + newState).removeClass("hidden"); //Atslepiam naujai aktyvų taba
			controller.set("currentState", newState);
		})
	}
});
MY.NavbarController=App.NavbarController.create();

App.NavbarView = Em.View.extend({templateName: 'tmpNavbar'});
App.mainMenuView = Em.View.extend({
	didInsertElement: function () {
		if (typeof (this.get("viewIx")) !== "number") return false;
		$('#ulMainMenu a.selected').removeClass("selected").addClass("notactive");
		$('#ulMainMenu a:eq(' + this.get("viewIx") + ')').removeClass("notactive").addClass("selected ui-corner-top");
	}
});