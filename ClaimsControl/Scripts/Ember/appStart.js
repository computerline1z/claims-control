App = Em.Application.create();
App.ApplicationController = Em.Controller.extend();
App.ApplicationView = Em.View.extend({ templateName: 'tmpApplication'});
App.NavbarController = Em.Controller.extend({
	currentState: null,
	fnSetNewTab: function (newState, viewIx,newOutlet) {
		var controller = this;
		var lastState = this.get("currentState");
		if (lastState) {
			$('#ulMainMenu a.selected').removeClass("selected").addClass("notactive");
			if (controller.get("currentOutlet")==="tabEmpty") $("tabEmpty").empty();
			$("body").find("div.validity-tooltip").remove(); //validičio tooltipus removinam
			//$('#' + controller.get("currentOutlet")).empty();
		} else { controller.set("currentOutlet", "tabAccidents"); }
		Em.run.next(function () {
			$('#' + controller.get("currentOutlet")).addClass("hidden"); //Paslepiam aktyvų taba .empty()
			if (viewIx>-1){
				$('#ulMainMenu a:eq(' + viewIx + ')').removeClass("notactive").addClass("selected ui-corner-top"); //Pazymim naujo menu taba
			}
			if  (!newOutlet){newOutlet=newState;}//else{$('#' + controller.get("currentOutlet")).empty();}
			$('#' + newOutlet).removeClass("hidden");//Atslepiam naujai aktyvų taba
			controller.set("currentState", newState).set("currentOutlet", newOutlet);
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