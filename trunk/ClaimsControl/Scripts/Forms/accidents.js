// Generated by CoffeeScript 1.3.3
(function() {
  var w=window, App=w.App, Em=w.Em, oGLOBAL=w.oGLOBAL, oDATA=w.oDATA, oCONTROLS=w.oCONTROLS, MY=w.MY;

  App.AccidentsView = App.mainMenuView.extend({
    content: null,
    viewIx: 0,
    templateName: 'tmpAccidentsMain',
    init: function() {
      this._super();
      return console.log("accidentInit");
    },
    didInsertElement: function() {
      alert("loaded");
      this._super();
      return console.log("I loaded all accidents");
    }
  });

  App.AccidentView = Em.View.extend({
    templateName: 'tmpAccidentRow',
    tagName: ""
  });

  App.SelectedAccidentView = Em.View.extend({
    templateName: 'tmpAccident_Claims',
    init: function() {
      var ArrView = [],objView=[];

      var ArrClaims, ArrClaims2, i, iterator;
      console.log("init selected accident");
      this._super();
      ArrClaims = this.get("claims_C").replace(new RegExp('{{(.*?)}}', 'gm'), '').split('#||');
      ArrClaims2 = this.get("claims_C2").split('#||');
      if (ArrClaims[0] !== "") {
        iterator = ArrClaims.length - 1;
        i = -1;
        while ((i++) < iterator) {
          ArrView[i] = {
            Claims: ArrClaims[i].split('#|'),
            Claims2: ArrClaims2[i].split('#|')
          };
          objView[i] = {
            finished: (ArrClaims[i][0] === "2" ? true : false),
            no: ArrView[i].Claims[1],
            type: ArrView[i].Claims[2],
            autoNo: ArrView[i].Claims[3],
            insurer: ArrView[i].Claims[4],
            loss: ArrView[i].Claims[5],
            Claims2: ArrView[i].Claims2,
            accidentID: this.get("iD"),
            accidentDate: this.date
          };
        }
      }
      App.thisAccidentController.set("content", objView);
      return App.thisAccidentController.set("accidentID", this.get("iD"));
    },
    tbodyClick: function(e) {
      var ClaimW, d, tr;
      tr = $(e.target).closest("tr");
      ClaimW = $("#ClaimWraper");
      if (ClaimW.length > 0) {
        MY.accidents.SelectedClaimView.remove();
        ClaimW.remove();
      }
      tr.parent().find("tr.selectedClaim").removeClass("selectedClaim title");
      d = e.context;
      MY.accidents.SelectedClaimView = App.SelectedClaimView.create({
        rowContext: {
          Claims2: d.Claims2,
          newClaim: false,
          LossAmount: d.loss,
          InsuranceType: d.type,
          accidentID: d.accidentID,
          accidentDate: d.accidentDate
        },
        elementId: "ClaimDetailsContent",
        contentBinding: 'App.claimEditController.content'
      });
      tr.addClass("selectedClaim title").after("<tr><td id='ClaimWraper' colspan='7' class='selectedClaim content'></td></tr>");
      MY.accidents.SelectedClaimView.appendTo("#ClaimWraper");
      Em.run.next(function() {
        return $("#ClaimDetailsContent").slideDown();
      });
      return false;
    },
    newClaim: function(e) {
      var d, nTr;
      nTr = $(e.target).closest('div.tr')[0];
      $(nTr).replaceWith("<div id='divNewClaimCard' data-ctrl='{\"id\":\"0\",\"NewRec\":\"1\",\"Source\":\"tblClaims\",\"ClaimTypeID\":\"0\"}'></div>");
      d = {
        ctrl: $('#divNewClaimCard'),
        oDATA: oDATA.GET("tblClaimTypes"),
        opt: {
          val: 0,
          text: 1,
          FieldName: "ClaimTypeID",
          SelectText: "Pasirinkite žalos tipą:"
        },
        fnAfterOptClick: function(T) {
          $('#divNewClaimCard').find('#divClaimCardDetails,div.frmbottom').remove();
          if (MY.accidents.NewClaimView) {
            MY.accidents.NewClaimView.remove();
            $("#newClaimDetailsContent").remove();
          }
          MY.accidents.NewClaimView = App.SelectedClaimView.create({
            rowContext: {
              newClaim: true,
              accidentID: App.thisAccidentController.get("accidentID")
            },
            elementId: "newClaimDetailsContent",
            contentBinding: 'App.newClaimController.content'
          });
          MY.accidents.NewClaimView.appendTo("#divNewClaimCard");
          Em.run.next(function() {
            return $("#newClaimDetailsContent").slideDown();
          });
          false;
          return {
            fnCancel: function() {
              return $("#accidentsTable").find("div.selectedAccident").trigger("click");
            }
          };
        },
        fnCancel: function() {
          return $("#accidentsTable").find("div.selectedAccident").trigger("click");
        }
      };
      oCONTROLS.Set_Updatable_HTML.mega_select_list(d);
      return false;
    },
    elementId: "AccDetailsContent",
    contentBinding: 'App.thisAccidentController.content',
    destroyElement: function() {
      if (MY.accidents.SelectedClaimView) {
        return MY.accidents.SelectedClaimView.remove();
      }
    }
  });

  App.SelectedClaimView = Em.View.extend({
    didInsertElement: function() {
      var IClaim, c, fnCheckIsInjured, frm;
      c = this.content[0];
      frm = c.NewClaim ? "#divNewClaimCard" : '#divClaimCard';
      oCONTROLS.UpdatableForm(frm);
      if (c.TypeID === 2) {
        IClaim = $("#InsuranceClaimAmount").parent();
        IClaim.find("span").html("Planuojama žalos suma asmeniui");
        $("#LossAmount").parent().find("span").html("Planuojama žalos suma turtui");
        fnCheckIsInjured = function() {
          if (this.attr("checked")) {
            return IClaim.css("display", "block").find("input").data("ctrl").Validity = IClaim.find("input").data("ctrl").Validity.replace("require().", "");
          } else {
            return IClaim.css("display", "none").find("input").val("").data("ctrl").Validity = "require()." + IClaim.find("input").data("ctrl").Validity;
          }
        };
        fnCheckIsInjured.call($("#IsInjuredPersons"));
        $("#IsInjuredPersons").on("click", function() {
          return fnCheckIsInjured.call($("#IsInjuredPersons"));
        });
      }
      return $("#inputDays, #inputPerDay").on("keyup", function() {
        return $("#inputSum").val($("#inputDays").val() * $("#inputPerDay").val());
      });
    },
    init: function() {
      var C2, Claim, TypeID, d;
      this._super();
      d = this.get("rowContext");
      if (!d.newClaim) {
        C2 = d.Claims2;
        TypeID = oDATA.GET("tblClaimTypes").Data.findColValByColVal(d.InsuranceType, 1, 0);
        Claim = {
          ID: C2[0],
          VehicleID: C2[1],
          InsPolicyID: C2[2],
          InsuranceClaimAmount: C2[3],
          InsurerClaimID: C2[4],
          IsTotalLoss: C2[5],
          IsInjuredPersons: parseInt(C2[6], 10),
          Days: C2[7],
          PerDay: C2[8],
          LossAmount: d.LossAmount,
          NewClaim: false,
          TypeID: TypeID
        };
        return App.claimEditController.set("content", [Claim]);
      } else {
        TypeID = $("#divNewClaimCard").data("ctrl").ClaimTypeID;
        Claim = {
          ID: 0,
          VehicleID: 0,
          InsPolicyID: "",
          InsuranceClaimAmount: 0,
          InsurerClaimID: "",
          IsTotalLoss: 0,
          IsInjuredPersons: 0,
          Days: 5,
          PerDay: 500,
          LossAmount: (TypeID === 6 ? 2500 : 0),
          NewClaim: true,
          TypeID: TypeID
        };
        App.newClaimController.set("content", [Claim]);
        return console.log("init new Claim.Type - " + TypeID);
      }
    },
    SaveClaim: function(e) {
      var Action, DataToSave, Msg, frm, newClaim, opt;
      newClaim = this.rowContext.newClaim;
      if (newClaim) {
        frm = $('#divNewClaimCard');
        Action = 'Add';
        Msg = {
          Title: "Naujos žalos sukūrimas",
          Success: "Nauja žala sukurta.",
          Error: "Nepavyko išsaugot naujos žalos."
        };
      } else {
        frm = $('#divClaimCard');
        Action = 'Edit';
        Msg = {
          Title: "Žalos redagavimas",
          Success: "Žalos duomenys pakeisti.",
          Error: "Nepavyko pakeisti žalos duomenų."
        };
      }
      DataToSave = oCONTROLS.ValidateForm(frm);
      if (DataToSave) {
        if (newClaim) {
          DataToSave.Fields.push("ClaimTypeID");
          DataToSave.Data.push(e.view.content[0].TypeID);
          DataToSave.Fields.push("AccidentID");
          DataToSave.Data.push(e.view.rowContext.accidentID);
        }
        DataToSave["Ext"] = e.view.rowContext.accidentID;
        opt = {
          Action: Action,
          DataToSave: DataToSave,
          CallBack: {
            Success: function(resp) {
              var newRow, tr;
              newRow = resp.ResponseMsg.Ext.replace(/#\|#\|/g, ":::").split("|#|");
              newRow[13] = newRow[13].replace(/:::/g, "#|#|");
              App.accidentsController.get("setNewVal").call(App.accidentsController, {
                newVal: newRow,
                toAppend: false,
                fieldsToInt: [0, 1, 5, 6, 7, 8]
              })[0];
              tr = $("#accidentsTable").find("div.selectedAccident");
              return tr.trigger("click");
            }
          },
          Msg: Msg
        };
        return SERVER.update(opt);
      }
    },
    CancelSaveClaim: function(e) {
      return $("#accidentsTable").find("div.selectedAccident").trigger("click");
    },
    DeleteClaim: function(e) {
      var context, oData;
      oData = oDATA.GET("tblClaims");
      context = e.context.rowContext;
      console.log("Žalos ID: " + context.Claims2[0]);
      return oCONTROLS.dialog.Confirm({
        title: "",
        msg: "Ištrinti pasirinktą žalą?"
      }, function() {
        return SERVER.update({
          Action: "Delete",
          DataToSave: {
            id: context.Claims2[0],
            DataTable: oData.Config.tblUpdate,
            Ext: context.accidentID
          },
          Msg: {
            Title: "Duomenų ištrynimas",
            Success: "Pasirinkta žala buvo pašalinta.",
            Error: "Nepavyko pašalinti šios žalos"
          },
          CallBack: {
            Success: function(resp, updData) {
              var newRow;
              newRow = resp.ResponseMsg.Ext.replace(/#\|#\|/g, ":::").split("|#|");
              newRow[13] = newRow[13].replace(/:::/g, "#|#|");
              App.accidentsController.get("setNewVal").call(App.accidentsController, {
                newVal: newRow,
                toAppend: false,
                fieldsToInt: [0, 1, 5, 6, 7, 8]
              })[0];
              oData.Data.removeRowByID(parseInt(updData.DataToSave.id, 10));
              return $("#accidentsTable").find("div.selectedAccident").trigger("click");
            }
          }
        });
      });
    },
    templateName: 'tmpClaimEdit'
  });

  App.accidentsController = Em.ResourceController.create({
    filter: null,
    tableName: "proc_Accidents",
    fields: {},
    removeClaims: function(AddWr) {
      AddWr.parent().find("div.dividers").remove();
      if (AddWr.length > 0) {
        MY.accidents.AcccidentdetailsView.remove();
        return AddWr.remove();
      }
    },
    tbodyClick: function(e) {
      var AddWr, parent, tr;
      tr = $(e.target).closest("div.tr");
      this.setfilteredPolicies(e.context.date);
      AddWr = $("#AccDetailsWraper");
      parent = tr.parent();
      if (tr.hasClass("selectedAccident") && !e.isTrigger) {
        if (parent.find("div.dividers").length) {
          this.removeClaims(AddWr);
          return false;
        }
      } else {
        parent.find("div.selectedAccident").removeClass("selectedAccident");
        this.removeClaims(AddWr);
      }
      if (!tr.hasClass("selectedAccident")) {
        tr.addClass("selectedAccident");
      }
      MY.accidents.AcccidentdetailsView = App.SelectedAccidentView.create(e.context);
      tr.after("<div id='AccDetailsWraper'></div><div class='dividers'></div>").prev().before("<div class='dividers'></div>");
      MY.accidents.AcccidentdetailsView.appendTo("#AccDetailsWraper");
      if (e.isTrigger) {
        Em.run.next(function() {
          return $("#AccDetailsContent, div.dividers").show();
        });
      } else {
        Em.run.next(function() {
          return $("#AccDetailsContent, div.dividers").slideDown();
        });
      }
      return false;
    },
    setfilteredPolicies: function(accidentDate) {
      var proc_InsPolicies_forThisAccident, thisAccidentPolicies;
      thisAccidentPolicies = $.map(oDATA.GET("proc_InsPolicies").Data, function(i) {
        if (oGLOBAL.date.firstBigger(i[4], accidentDate)) {
          return [i];
        } else {
          return null;
        }
      });
      proc_InsPolicies_forThisAccident = $.extend({}, oDATA.GET("proc_InsPolicies"), {
        Data: thisAccidentPolicies
      });
      return oDATA.SET("proc_InsPolicies_forThisAccident", proc_InsPolicies_forThisAccident);
    },
    editAccident: function(e) {
      return this.openAccident(e.context.no);
    },
    addNewAccident: function() {
      return this.openAccident(null);
    },
    openAccident: function(AccNo) {
      var ctrlEdit;
      $('#tabAccidents').removeClass("colmask");
      $('#divAccidentsList').hide();
      ctrlEdit = $('#divAccidentEdit').show();
      ctrlEdit.spinner({
        position: 'center',
        img: 'spinnerBig.gif'
      });
      oGLOBAL.LoadAccident_Card(AccNo);
      return false;
    }
  });

  App.thisAccidentController = Em.ResourceController.create({
    content: [],
    tableName: "?"
  });

  App.claimEditController = Em.ResourceController.create({
    tableName: "?"
  });

  App.newClaimController = Em.ResourceController.create({
    tableName: "?"
  });

  MY.accidents = {};

}).call(this);
