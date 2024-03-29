// Generated by CoffeeScript 1.6.3
(function() {
  var w=window, Em=w.Em, oGLOBAL=w.oGLOBAL, oDATA=w.oDATA, oCONTROLS=w.oCONTROLS, MY=w.MY;;
  w.App = Em.Application.create();

  App.ApplicationController = Em.Controller.extend();

  App.ApplicationView = Em.View.extend({
    templateName: "tmpApplication"
  });

  App.NavbarController = Em.Controller.extend({
    currentState: null,
    fnSetNewTab: function(p) {
      var controller, fnUnhideOutlet, lastState;
      controller = this;
      lastState = this.get("currentState");
      $(window).scrollTop(0);
      if (lastState) {
        $("#ulMainMenu a.selected").removeClass("selected").addClass("notactive");
        if (controller.get("currentOutlet") === "tabEmpty") {
          $("tabEmpty").empty();
        }
        $("body").find("div.validity-tooltip").remove();
      } else {
        controller.set("currentOutlet", "tabAccidents");
      }
      if (!oDATA.GET("userData")) {
        oDATA.fnLoadMain();
      }
      fnUnhideOutlet = function(p) {
        return Em.run.next(p, function() {
          var outlet;
          outlet = $("#" + this.newOutlet);
          outlet.removeClass("hidden");
          if (!this.transparent) {
            outlet.removeClass("transparent");
          } else {
            outlet.addClass("transparent");
          }
          if (this.viewIx > -1) {
            $("#ulMainMenu a:eq(" + this.viewIx + ")").removeClass("notactive").addClass("selected");
          }
          if (this.needUrl) {
            oDATA.fnLoad2({
              url: this.needUrl,
              callBack: this.callBack
            });
          }
          if (this.hide) {
            $(this.hide).hide();
          }
          if (this.show) {
            return $(this.show).show();
          }
        });
      };
      $("#" + controller.get("currentOutlet")).addClass("hidden");
      if (!p.newOutlet) {
        p.newOutlet = p.newState;
      }
      if (controller.currentState || p.newOutlet === p.newState) {
        controller.set("currentState", p.newState).set("currentOutlet", p.newOutlet);
        if (p.newState === "tabAccidents" || p.newState === "tabReports" || p.newState === "tabMyCard" || p.newState === "changePass") {
          $("img.spinner").remove();
        }
        fnUnhideOutlet(p);
        return true;
      } else {
        p.newOutlet = (p.newOutlet === "tabEmpty" ? "tabAccidents" : p.newOutlet);
        controller.set("currentState", p.newOutlet).set("currentOutlet", p.newOutlet);
        App.router.transitionTo(p.newOutlet);
        console.log("fnSetNewTab2:" + p.newOutlet + ";" + p.viewIx);
        p.newOutlet = "";
        fnUnhideOutlet(p);
        return false;
      }
    }
  });

  MY.NavbarController = App.NavbarController.create();

  App.NavbarView = Em.View.extend({
    templateName: "tmpNavbar"
  });

  App.mainMenuView = Em.View.extend({});

}).call(this);

/*
//@ sourceMappingURL=appStart.map
*/
