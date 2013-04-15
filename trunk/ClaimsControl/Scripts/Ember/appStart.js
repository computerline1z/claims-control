App = Em.Application.create();
App.ApplicationController = Em.Controller.extend();
App.ApplicationView = Em.View.extend({ templateName: 'tmpApplication'});
App.HidePreviousWindow = Ember.Mixin.create({
	init:function() {
		this._super(); $(this.previuosWindow).hide().parent().spinner({ position: 'center', img: 'spinnerBig.gif' });
		$(this.thisWindow).show();
	},
	didInsertElement:function() {
		this._super(); $("body").find("img.spinner").remove() ;//$("body").spinner('remove'); - neveikia
	},
	goBack:function(){
		$(this.thisWindow).empty().hide().parent().spinner({ position: 'center', img: 'spinnerBig.gif' });
		$(this.previuosWindow).show();
		$("body").find("img.spinner").remove();
	}
});
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
		if (!oDATA.GET("userData")){
			oDATA.fnLoadMain();
		}
		//
			var fnUnhideOutlet=function(outlet,viewIx) {
				Em.run.next({outlet:outlet,viewIx:viewIx}, function () {
					$('#' + this.outlet).removeClass("hidden");//Atslepiam naujai aktyvų taba
					if (this.viewIx>-1){ $('#ulMainMenu a:eq(' + this.viewIx + ')').removeClass("notactive").addClass("selected"); }//Pazymim naujo menu taba
				})				
			}
			$('#' + controller.get("currentOutlet")).addClass("hidden"); //Paslepiam aktyvų taba .empty()

			if  (!newOutlet){newOutlet=newState;}//else{$('#' + controller.get("currentOutlet")).empty();}						
			if  (controller.currentState||newOutlet===newState){
				controller.set("currentState", newState).set("currentOutlet", newOutlet);
				console.log("fnSetNewTab1:"+newOutlet+";"+viewIx);
				fnUnhideOutlet(newOutlet,viewIx);return true;
			} else {//jei nėra currentState ko gero buvo refresh, tai nukeliam į pradinį psl jei to reikia
				newOutlet=(newOutlet==="tabEmpty")?"tabAccidents":newOutlet;// galim visada mest i tabAccidents";
				controller.set("currentState", newOutlet).set("currentOutlet", newOutlet);
				App.router.transitionTo(newOutlet);
				console.log("fnSetNewTab2:"+newOutlet+";"+viewIx);
				fnUnhideOutlet("",viewIx);return false;				
			}
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