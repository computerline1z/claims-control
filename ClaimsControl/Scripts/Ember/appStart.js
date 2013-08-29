App = Em.Application.create();
App.ApplicationController = Em.Controller.extend();
App.ApplicationView = Em.View.extend({ templateName: 'tmpApplication'});
// App.HidePreviousWindow = Ember.Mixin.create({
	// init:function() {
		// this._super(); $(this.previuosWindow).hide().parent().spinner({ position: 'center', img: 'spinnerBig.gif' });
		// $(this.thisWindow).show();
	// },
	// didInsertElement:function() {
		// this._super(); $("body").find("img.spinner").remove() ;//$("body").spinner('remove'); - neveikia
	// },
	// goBack:function(){
		// $(this.thisWindow).hide().parent().spinner({ position: 'center', img: 'spinnerBig.gif' });
		// $(this.previuosWindow).show();
		// $("body").find("img.spinner").remove();
	// }
// });
App.NavbarController = Em.Controller.extend({
	currentState: null,
	fnSetNewTab: function (p) {//newState, viewIx, newOutlet, hide, show
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
		var fnUnhideOutlet=function(p) {
			Em.run.next(p, function () {
				var outlet=$('#' + this.newOutlet);
				outlet.removeClass("hidden");//Atslepiam naujai aktyvų taba
				if(!this.transparent){outlet.removeClass("transparent");}
				else{outlet.addClass("transparent");}
				if (this.viewIx>-1){ $('#ulMainMenu a:eq(' + this.viewIx + ')').removeClass("notactive").addClass("selected"); }//Pazymim naujo menu taba
				if (this.needUrl) {oDATA.fnLoad2({ url: this.needUrl, callBack: this.callBack});}
				if (this.hide){$(this.hide).hide();}
				if (this.show){$(this.show).show();}
			})				
		}			
		$('#' + controller.get("currentOutlet")).addClass("hidden"); //Paslepiam aktyvų taba .empty()

		if  (!p.newOutlet){p.newOutlet=p.newState;}//else{$('#' + controller.get("currentOutlet")).empty();}						
		if  (controller.currentState||p.newOutlet===p.newState){
			controller.set("currentState", p.newState).set("currentOutlet", p.newOutlet);
			//console.log("fnSetNewTab1:"+p.newOutlet+";"+p.viewIx);
			fnUnhideOutlet(p);return true;//p.newOutlet,p.viewIx,p.transparent
		} else {//jei nėra currentState ko gero buvo refresh, tai nukeliam į pradinį psl jei to reikia
			p.newOutlet=(p.newOutlet==="tabEmpty")?"tabAccidents":p.newOutlet;// galim visada mest i tabAccidents";
			controller.set("currentState", p.newOutlet).set("currentOutlet", p.newOutlet);
			App.router.transitionTo(p.newOutlet);
			console.log("fnSetNewTab2:"+p.newOutlet+";"+p.viewIx);
			p.newOutlet="";fnUnhideOutlet(p);return false;//"",p.viewIx,p.transparent
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