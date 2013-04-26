//@ sourceMappingURL=userCard.map
// Generated by CoffeeScript 1.6.1
(function() {
  var w=window, App=w.App, Em=w.Em, oGLOBAL=w.oGLOBAL, oDATA=w.oDATA, oCONTROLS=w.oCONTROLS, MY=w.MY;
  App.TabUserCardView = Em.View.extend({
    didInsertElement: function() {
      var SaveOk, ctrl, frm;
      this._super();
      $("#userInfoTab").tabs();
      frm = $("#InfoDataForm");
      ctrl = App.userCardController;
      if (ctrl.content.length) {
        frm.data("ctrl", {
          NewRec: 0,
          id: ctrl.content[0].iD,
          Source: "tblUsers"
        });
      } else {
        frm.data("ctrl", {
          NewRec: 1,
          id: 0,
          Source: "tblUsers"
        });
      }
      oCONTROLS.UpdatableForm({
        frm: frm,
        btnSaveToDisable: frm.next().find("button.btnSave")
      });
      SaveOk = App.userCardController.SaveOk;
      if (SaveOk) {
        $("#savePasswordNote").html(SaveOk).show().delay(2000).fadeOut();
        return App.userCardController.set("SaveOk", null);
      }
    },
    templateName: 'tmpUserCard',
    controllerBinding: "App.userCardController",
    changeMyPassword: function() {
      return App.router.transitionTo('tabChangePass');
    },
    sendUserPasswordForm: function() {
      return App.userCardController.set("passwordReset", true);
    },
    sendUserPassword: function(e, mailTmpl, email) {
      var ctrl, tmpl;
      ctrl = e ? $(e.target).parent() : null;
      tmpl = mailTmpl ? mailTmpl : "ResetUserPsw";
      email = email ? email : App.userCardController.content[0].email;
      return SERVER.update3({
        pars: {
          email: email,
          mailTmpl: tmpl
        },
        ctrl: ctrl,
        CallBack: (function(resp) {
          if (resp.ErrorMsg) {
            $("#savePasswordNote").html("Nepavyko išsiųsti, klaida: " + resp.ErrorMsg).show().delay(2000).fadeOut();
          } else {
            $("#savePasswordNote").html(resp.ResponseMsg).show().delay(2000).fadeOut();
          }
          return App.userCardController.set("passwordReset", false);
        }),
        url: '/Account/RecoverPassword2'
      });
    },
    emailText: function() {
      return alert("Laiško tekstas");
    },
    cancelSendUserPassword: function() {
      return App.userCardController.set("passwordReset", false);
    },
    saveUserCard: function() {
      var Action, DataToSave, frm, opt, sendUserPassword;
      frm = $("#InfoDataForm");
      DataToSave = oCONTROLS.ValidateForm(frm);
      sendUserPassword = this.sendUserPassword;
      Action = frm.data("ctrl").NewRec ? "Add" : "Edit";
      if (DataToSave) {
        opt = {
          Action: Action,
          DataToSave: DataToSave,
          row: App.userCardController.content[0],
          source: "tblUsers",
          Ctrl: frm,
          CallBackAfter: function(Row, Action) {
            if (Action === "Add") {
              sendUserPassword(null, "NewUserPsw", Row.email);
            }
            App.userCardController.setUser({
              myInfo: false,
              User: Row
            });
            return App.router.transitionTo('tabAdmin');
          }
        };
        return SERVER.update2(opt);
      }
    },
    saveUserRights: function() {
      return alert("saveUserRights");
    },
    goToAdminTab: function() {
      App.router.transitionTo('tabAdmin');
      return false;
    }
  });

  App.userCardController = Em.ArrayController.create({
    init: function() {
      return console.log("init");
    },
    setUser: function(p) {
      var id;
      this.set("myInfo", (p.myInfo ? true : false)).set("passwordReset", false);
      if (p.myInfo) {
        id = oDATA.GET("userData").emData[0].userID;
        p.User = oDATA.GET("tblUsers").emData.findProperty("iD", id);
      }
      if (this.content.length) {
        this.content.removeAt(0);
      }
      if (p.User) {
        return this.content.pushObject(p.User);
      }
    },
    myInfo: true,
    passwordReset: false,
    content: [],
    addNewUser: function(e) {
      this.setUser({
        myInfo: false
      });
      this.set("deleteButton", false);
      App.router.transitionTo('tabUserCard');
      return false;
    },
    editUser: function(e) {
      this.setUser({
        myInfo: false,
        User: e.view._context
      });
      this.set("deleteButton", true);
      App.router.transitionTo('tabUserCard');
      return false;
    },
    deleteForm: function(e) {
      var Msg, frm, oData, pars, row;
      frm = $("#InfoDataForm");
      pars = frm.data("ctrl");
      oData = oDATA.GET(pars.Source);
      Msg = oData.Config.Msg;
      row = App.userCardController.content[0];
      return oCONTROLS.dialog.Confirm({
        title: "",
        msg: "Ištrinti " + Msg.GenNameWhat + " '" + row.MapArrToString(oData.Config.titleFields, true) + "'?"
      }, function() {
        return SERVER.update2({
          Action: "Delete",
          DataToSave: {
            id: row.iD,
            DataTable: oData.Config.tblUpdate
          },
          "Ctrl": $("#tabLists"),
          "source": pars.Source,
          "row": row,
          CallBackAfter: function(Row) {
            App.router.transitionTo('tabAdmin');
            return false;
          }
        });
      });
    },
    saveForm: function(e) {
      var Action, DataToSave, frm, opt, sendUserPassword;
      frm = $("#InfoDataForm");
      DataToSave = oCONTROLS.ValidateForm(frm);
      sendUserPassword = App.TabUserCardView.sendUserPassword;
      Action = frm.data("ctrl").NewRec ? "Add" : "Edit";
      if (DataToSave) {
        opt = {
          Action: Action,
          DataToSave: DataToSave,
          row: App.userCardController.content[0],
          source: "tblUsers",
          Ctrl: frm,
          CallBackAfter: function(Row, Action) {
            var mailInput;
            if (Action === "Add") {
              sendUserPassword(null, "NewUserPsw", Row.email);
            } else {
              mailInput = $('#systemEmail');
              if (mailInput.val() !== mailInput.data("ctrl").Value) {
                sendUserPassword(null, "ResetUserPsw", Row.email);
              }
            }
            if (!App.userCardController.myInfo) {
              App.userCardController.setUser({
                myInfo: false,
                User: Row
              });
              return App.router.transitionTo('tabAdmin');
            }
          }
        };
        SERVER.update2(opt);
        return false;
      }
    },
    cancelForm: function(e) {
      App.router.transitionTo('tabAdmin');
      return false;
    }
  });

  App.ChangeUserPassView = Em.View.extend({
    saveNewPass: function() {
      var newPass, newPsw, newPsw2, ok, oldPass, oldPsw, t;
      t = this.$();
      oldPass = t.find("input:eq(0)");
      newPass = t.find("input:gt(0)");
      $.validity.start();
      oldPass.require("Įveskite esamą slaptažodį");
      newPass.require("Įveskite naują slaptažodį").minLength(3, 'Įveskite ne mažiau 3 raidžių').match("textOrNumber");
      newPsw = $.trim(newPass.eq(0).val());
      newPsw2 = $.trim(newPass.eq(1).val());
      oldPsw = $.trim(oldPass.val());
      ok = function() {
        return newPsw === newPsw2;
      };
      newPass.assert(ok, "Nesutampa slaptažodžiai");
      if ($.validity.end().valid) {
        return SERVER.update3({
          pars: {
            OldPassword: oldPsw,
            NewPassword: newPsw,
            UserId: 0
          },
          CallBack: (function(resp) {
            if (resp.ErrorMsg) {
              $("#changePaswordError").html(resp.ErrorMsg);
            } else {
              App.userCardController.set("SaveOk", resp.ResponseMsg);
              App.router.transitionTo(App.userCardController.myInfo ? 'tabMyCard' : 'tabUserCard');
              false;
            }
            return console.log(resp);
          }),
          url: '/Account/NewPassword2'
        });
      }
    },
    cancelNewPass: function() {
      App.router.transitionTo(App.userCardController.myInfo ? 'tabMyCard' : 'tabUserCard');
      return false;
    },
    templateName: 'tmpChangeUsrPass'
  });

}).call(this);