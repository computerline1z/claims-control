// Generated by CoffeeScript 1.6.2
(function() {
  var w=window, App=w.App, Em=w.Em, oGLOBAL=w.oGLOBAL, oDATA=w.oDATA, oCONTROLS=w.oCONTROLS, MY=w.MY;  App.TabUserCardView = Em.View.extend({
    userContent: null,
    didInsertElement: function() {
      var SaveOk, ctrl, frm;

      this._super();
      $("#userInfoTab").tabs();
      frm = $("#InfoDataForm");
      ctrl = App.userCardController;
      if (ctrl.userContent) {
        frm.data("ctrl", {
          NewRec: 0,
          id: ctrl.userContent.iD,
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
        btnSaveToDisable: frm.parent().find("button.btnSave:first")
      });
      SaveOk = App.userCardController.SaveOk;
      if (SaveOk) {
        $("#savePasswordNote").html(SaveOk).show().delay(2000).fadeOut();
        App.userCardController.set("SaveOk", null);
      }
      $("#userInfoRights").on("click keypress", "input", {
        me: this
      }, this.warnChanged);
      this.set("userContent", App.userCardController.userContent);
      return this.setWarnSettings();
    },
    warnTimer: null,
    warnChanged: function(e) {
      var me;

      me = e.data.me;
      if (me.warnTimer) {
        clearTimeout(me.warnTimer);
      }
      return me.warnTimer = setTimeout($.proxy(me.updateWarnSettings, me), 3000);
    },
    updateWarnSettings: function() {
      var DataToSave, ctrl, u;

      u = this.userContent;
      DataToSave = {
        id: u.iD,
        DataTable: "tblUsers",
        Fields: [],
        Data: []
      };
      ctrl = $("#userInfoRights");
      ctrl.find("input:checkbox").each(function() {
        var data, e, input, name;

        data = "";
        e = $(this);
        name = e.attr("name");
        input = e.closest("tr").find("input:text");
        if (input.length && e.prop("checked")) {
          data = parseInt(input.val(), 10);
        } else {
          data = e.prop("checked");
        }
        if (u[name] !== void 0) {
          console.log(u[name] !== data);
          console.log(!(u[name] === null && data === false));
          if (u[name] !== data && !(u[name] === null && data === false)) {
            DataToSave.Fields.push(name);
            return DataToSave.Data.push(data);
          }
        } else {
          return console.error("wrong userInfoRights");
        }
      });
      if (DataToSave.Data.length) {
        return SERVER.update2({
          Action: 'Edit',
          DataToSave: DataToSave,
          Ctrl: ctrl,
          source: "tblUsers",
          row: u
        });
      }
    },
    setWarnSettings: function() {
      var me, u;

      me = this;
      u = this.userContent;
      return $("#userInfoRights").find("input:checkbox").each(function() {
        var e, input, name;

        e = $(this);
        name = e.attr("name");
        input = e.closest("tr").find("input:text");
        if (u[name] !== void 0) {
          if (u[name]) {
            e.prop("checked", true);
            if (input.length) {
              return input.val(u[name]);
            }
          }
        } else {
          return console.error("wrong userInfoRights");
        }
      });
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
      email = email ? email : App.userCardController.userContent.email;
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
          row: App.userCardController.userContent,
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
      return this.set("userContent", (p.User ? p.User : null));
    },
    myInfo: true,
    passwordReset: false,
    userContent: null,
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
      row = App.userCardController.userContent;
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
          row: App.userCardController.userContent,
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

/*
//@ sourceMappingURL=userCard.map
*/
