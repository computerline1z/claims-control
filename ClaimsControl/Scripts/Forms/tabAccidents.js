// Generated by CoffeeScript 1.6.2
(function() {
  var w=window, App=w.App, Em=w.Em, oGLOBAL=w.oGLOBAL, oDATA=w.oDATA, oCONTROLS=w.oCONTROLS, MY=w.MY;
  var panelFilterIsActive, textFilterIsActive;

  App.tabAccidentsView = App.mainMenuView.extend({
    content: null,
    viewIx: 0,
    templateName: 'tmpAccidentsMain'
  });

  App.AccidentView = Em.View.extend({
    templateName: 'tmpAccidentRow',
    tagName: ""
  });

  App.SelectedAccidentView = Em.View.extend({
    templateName: 'tmpAccident_Claims',
    init: function() {
      var ArrView = [],objView=[];
      var ArrClaims, ArrClaims2, clTypeID, claimsTypeID, i, iterator;

      this._super();
      claimsTypeID = this.claims_TypeID.split('#');
      ArrClaims = this.get("claims_C").replace(new RegExp('{{(.*?)}}', 'gm'), '').split('#||');
      ArrClaims2 = this.get("claims_C2").split('#||');
      if (ArrClaims[0] !== "") {
        iterator = ArrClaims.length - 1;
        i = -1;
        while ((i++) < iterator) {
          clTypeID = claimsTypeID[i];
          ArrView[i] = {
            Claims: ArrClaims[i].split('#|'),
            Claims2: ArrClaims2[i].split('#|')
          };
          objView[i] = {
            finished: (ArrClaims[i][0] === "5" ? true : false),
            no: ArrView[i].Claims[1],
            type: ArrView[i].Claims[2],
            autoNo: ArrView[i].Claims[3],
            insurer: ArrView[i].Claims[4],
            loss: ArrView[i].Claims[5],
            totalLoss: (ArrView[i].Claims2[2] !== "0" && ArrView[i].Claims2[6] && clTypeID === "2" && !isNaN(parseFloat(ArrView[i].Claims2[3])) ? +ArrView[i].Claims[5] + +ArrView[i].Claims2[3] : 0),
            Claims2: ArrView[i].Claims2,
            claimStatus: ArrClaims[i][0],
            accidentID: this.get("iD"),
            accidentDate: this.date
          };
        }
      }
      App.thisAccidentController.set("content", objView);
      return App.thisAccidentController.set("accidentID", this.get("iD"));
    },
    tbodyClick: function(e) {
      var clickOnSelected, d, tr;

      tr = $(e.target).closest("tr");
      clickOnSelected = tr.hasClass("selectedClaim") ? true : false;
      App.claimEditController.removeOpenClaimDetails();
      if (clickOnSelected) {
        return false;
      }
      d = e.context;
      MY.tabAccidents.SelectedClaimView = App.SelectedClaimView.create({
        rowContext: {
          Claims2: d.Claims2,
          newClaim: false,
          LossAmount: d.loss,
          InsuranceType: d.type,
          accidentID: d.accidentID,
          accidentDate: d.accidentDate,
          claimStatus: d.claimStatus
        },
        elementId: "ClaimDetailsContent",
        contentBinding: 'App.claimEditController.content'
      });
      tr.addClass("selectedClaim title").after("<tr><td id='ClaimWraper' colspan='7' class='selectedClaim content'></td></tr>");
      MY.tabAccidents.SelectedClaimView.appendTo("#ClaimWraper");
      Em.run.next(function() {
        return $("#ClaimDetailsContent").slideDown();
      });
      return false;
    },
    newClaim: function(e) {
      var d, fnCancelNewClaim, nTr;

      nTr = $(e.target).closest('div.tr');
      $(e.target).closest('div.rightFooterBig').hide();
      nTr.append("<div id='divNewClaimCard' class='js-frm' data-ctrl='{\"id\":\"0\",\"NewRec\":\"1\",\"Source\":\"proc_Claims\",\"ClaimTypeID\":\"0\"}'></div>");
      fnCancelNewClaim = function() {
        $("#divNewClaimCard").remove();
        return $("#AccDetailsContent").find('div.rightFooterBig').show();
      };
      d = {
        ctrl: $('#divNewClaimCard'),
        oDATA: oDATA.GET("tblClaimTypes"),
        opt: {
          val: "iD",
          text: "name",
          FieldName: "ClaimTypeID",
          SelectText: "Pasirinkite žalos tipą:"
        },
        fnAfterOptClick: function(T) {
          App.claimEditController.removeOpenClaimDetails();
          $('#divNewClaimCard').find('#divNewClaimCard_Content,div.frmbottom').remove();
          if (MY.tabAccidents.NewClaimView) {
            MY.tabAccidents.NewClaimView.remove();
            $("#newClaimDetailsContent").remove();
          }
          MY.tabAccidents.NewClaimView = App.SelectedClaimView.create({
            rowContext: {
              newClaim: true,
              accidentID: App.thisAccidentController.get("accidentID")
            },
            elementId: "newClaimDetailsContent",
            contentBinding: 'App.newClaimController.content'
          });
          MY.tabAccidents.NewClaimView.appendTo("#divNewClaimCard");
          Em.run.next(function() {
            return $("#newClaimDetailsContent").slideDown();
          });
          false;
          return {
            fnCancel: function() {
              return fnCancelNewClaim();
            }
          };
        },
        fnCancel: function() {
          return fnCancelNewClaim();
        }
      };
      oCONTROLS.Set_Updatable_HTML.mega_select_list(d);
      return false;
    },
    toClaimRegulation: function(e) {
      App.router.transitionTo('claimRegulation', {
        claimNo: e.context.no
      });
      return false;
    },
    elementId: "AccDetailsContent",
    contentBinding: 'App.thisAccidentController.content',
    destroyElement: function() {
      if (MY.tabAccidents.SelectedClaimView) {
        return MY.tabAccidents.SelectedClaimView.remove();
      }
    }
  });

  App.SelectedClaimView = Em.View.extend({
    didInsertElement: function() {
      var IClaim, btnSaveToDisable, c, fnCheckIsInjured, frm, inputs;

      c = App.claimEditController.claim;
      frm = c.newClaim ? "#divNewClaimCard" : '#divClaimCard_Content';
      btnSaveToDisable = c.newClaim ? $(frm).find("button.btnSave") : $(frm).next().find("button.btnSave");
      oCONTROLS.UpdatableForm({
        frm: frm,
        btnSaveToDisable: btnSaveToDisable
      });
      if (c.typeID === 2) {
        IClaim = $("#InsuranceClaimAmount").parent().parent();
        IClaim.find("span").html("Žalos suma asmeniui");
        $("#LossAmount").parent().find("span").html("Žalos suma turtui");
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
      if (c.typeID === 6) {
        $("#claimEditDays,#claimEditPerDay").on("keyup", function() {
          return $("#LossAmount").val($("#claimEditDays").val() * $("#claimEditPerDay").val());
        });
      }
      if (c.claimStatus > 2) {
        inputs = $(frm).find("input");
        if (c.claimStatus === "3") {
          inputs = inputs.eq(1).prop('title', 'Suma jau patvirtina');
        } else if (c.claimStatus === "4") {
          inputs = inputs.filter(function(i) {
            return i === 1 || $(this).attr("id") === "InsuranceClaimAmount";
          }).prop('title', 'Suma jau patvirtina');
        } else if (c.claimStatus === "5") {
          $(frm).find("button").prop("disabled", true);
          inputs.prop('title', 'Žala uždaryta');
        }
        inputs.prop("disabled", true);
      }
      if (c.noInsurance) {
        return App.claimEditController.fnToggle_noInsurance();
      }
    },
    init: function() {
      var C2, Claim, TypeID, d;

      this._super();
      d = this.get("rowContext");
      if (!d.newClaim) {
        C2 = d.Claims2;
        TypeID = oDATA.GET("tblClaimTypes").emData.findProperty("name", d.InsuranceType).iD;
        Claim = Em.Object.create({
          iD: C2[0],
          vehicleID: C2[1],
          insPolicyID: C2[2],
          insuranceClaimAmount: C2[3],
          insurerClaimID: C2[4].slice(1).slice(0, -1),
          isTotalLoss: C2[5],
          isInjuredPersons: parseInt(C2[6], 10),
          days: C2[7],
          perDay: C2[8],
          lossAmount: d.LossAmount,
          claimStatus: d.claimStatus,
          newClaim: false,
          typeID: TypeID,
          deleteButton: true,
          noInsurance: C2[2] === "0" ? true : false
        });
      } else {
        TypeID = $("#divNewClaimCard").data("ctrl").ClaimTypeID;
        Claim = Em.Object.create({
          iD: 0,
          vehicleID: "",
          insPolicyID: "",
          insuranceClaimAmount: 0,
          insurerClaimID: "",
          isTotalLoss: 0,
          isInjuredPersons: 0,
          days: 5,
          perDay: 500,
          lossAmount: (TypeID === 6 ? 2500 : 0),
          newClaim: true,
          typeID: TypeID,
          noInsurance: false
        });
      }
      App.claimEditController.set("claim", Claim);
      return console.log("init Claim.Type - " + TypeID);
    },
    templateName: 'tmpClaimEdit'
  });

  App.claimEditController = Em.Controller.create({
    removeOpenClaimDetails: function() {
      var ClaimW;

      ClaimW = $("#ClaimWraper").closest('tbody').find('.selectedClaim').removeClass('selectedClaim title').end().end();
      if (ClaimW.length > 0) {
        MY.tabAccidents.SelectedClaimView.remove();
        ClaimW.remove();
        return false;
      }
    },
    fnToggle_noInsurance: (function(e) {
      var chk, content, eToggle, noInsurance;

      noInsurance = this.claim.noInsurance;
      console.log(this.claim.get('noInsurance'));
      chk = $("#NotInsuredClaim").find("input");
      if (!chk.data("ctrl")) {
        chk.data("ctrl", {
          "Type": "Boolean",
          "Value": "0",
          "ToggleValue": true,
          "Field": "InsPolicyID"
        });
      }
      content = this.claim.iD ? $("#ClaimDetailsContent") : $("#newClaimDetailsContent");
      eToggle = content.find("div.js-toggle");
      content.find("button.btnSave").attr("disabled", false);
      if (noInsurance) {
        chk.addClass("UpdateField");
        eToggle.hide();
      } else {
        chk.removeClass("UpdateField");
        eToggle.show();
        $("#InsuredClaimList").data("newval", "");
      }
      if ($('#IsInjuredPersons').length) {
        $('#IsInjuredPersons').prop("checked", false);
        $("#InsuranceClaimAmount").parent().parent().hide();
      }
      return false;
    }).observes("claim.noInsurance"),
    deleteForm: function(e) {
      var context, oData;

      oData = oDATA.GET("proc_Claims");
      context = e.view._parentView.templateData.view.rowContext;
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
    fnUpdateAccident: function(resp) {
      var newRow;

      newRow = resp.ResponseMsg.Ext.replace(/#\|#\|/g, ":::").split("|#|");
      newRow[13] = newRow[13].replace(/:::/g, "#|#|");
      return App.accidentsController.get("setNewVal").call(App.accidentsController, {
        newVal: newRow,
        toAppend: false,
        fieldsToInt: [0, 1, 5, 6, 7, 8]
      })[0];
    },
    saveForm: function(e) {
      var Action, DataToSave, Msg, accidentID, fnAfterUpdate, frm, newClaim, opt, tr;

      newClaim = e.view._context.newClaim;
      accidentID = e.view._parentView.templateData.view.rowContext.accidentID;
      tr = $("#accidentsTable").find("div.selectedAccident");
      if (newClaim) {
        frm = $('#divNewClaimCard');
        Action = 'Add';
        Msg = {
          Title: "Naujos žalos sukūrimas",
          Success: "Nauja žala sukurta.",
          Error: "Nepavyko išsaugot naujos žalos."
        };
      } else {
        frm = $('#divClaimCard_Content');
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
          DataToSave.Data.push(e.view._context.typeID);
          DataToSave.Fields.push("AccidentID");
          DataToSave.Data.push(accidentID);
        }
        DataToSave["Ext"] = accidentID;
        fnAfterUpdate = function(resp, updData) {
          var id, me, me2;

          me = App.claimEditController;
          me2 = App.sidePanelController;
          me.fnUpdateAccident.call(me, resp);
          me2.refreshPanels.call(me2, "refreshClaims");
          id = resp.ResponseMsg.ID;
          if (!id) {
            id = updData.DataToSave.id;
          }
          SERVER.updateRecord("Main/claim", {
            id: id
          }, "proc_Claims", updData.Action);
          this.tr.trigger('click');
          Em.run.later(this, (function() {
            this.tr.trigger("click");
            console.log("trigger click");
            return console.log(this.tr);
          }), 500);
          return false;
        };
        opt = {
          Action: Action,
          DataToSave: DataToSave,
          CallBack: {
            Success: $.proxy(fnAfterUpdate, {
              tr: tr
            })
          },
          Msg: Msg
        };
        SERVER.update(opt);
        return false;
      }
    },
    cancelForm: function(e) {
      var t, tr;

      t = $(e.target);
      tr = t.closest("tr");
      if ((tr.find("td.selectedClaim").length)) {
        MY.tabAccidents.SelectedClaimView.remove();
        return tr.parent().find("tr.selectedClaim").removeClass("selectedClaim title").next("tr").remove();
      } else {
        if (MY.tabAccidents.NewClaimView) {
          MY.tabAccidents.NewClaimView.remove();
        }
        $("#divNewClaimCard").remove();
        return $("#AccDetailsContent").find('div.rightFooterBig').show();
      }
    }
  });

  App.accidentsController = Em.ResourceController.create({
    url: "Accident/AccidentsList",
    tableName: "proc_Accidents",
    currency: 'Lt',
    animationSpeedEnd: 400,
    animationSpeedStart: 400,
    setAnimationSpeed: function(e) {
      var n, onSpeed;

      n = parseInt($(e.target).val(), 10);
      onSpeed = $(e.target).data("action") === "start" ? "animationSpeedStart" : "animationSpeedEnd";
      if ($.isNumeric(n)) {
        return this.set(onSpeed, n);
      } else {
        return alert("turi būti skaičius");
      }
    },
    removeClaims: function(AddWr, e, tr, parent) {
      var dividers, me;

      console.log("removeClaims");
      dividers = AddWr.parent().find("div.dividers");
      dividers.slideUp(App.accidentsController.animationSpeedEnd, function() {
        return dividers.remove();
      });
      if (AddWr.length > 0) {
        MY.tabAccidents.AcccidentdetailsView.remove();
        me = this;
        return AddWr.slideUp(App.accidentsController.animationSpeedEnd, function() {
          if (tr.hasClass("selectedAccident")) {
            tr.removeClass("selectedAccident");
            return AddWr.remove();
          } else {
            parent.find("div.selectedAccident").removeClass("selectedAccident");
            AddWr.remove();
            return me.addClaim(e, tr);
          }
        });
      } else {
        return this.addClaim(e, tr);
      }
    },
    addClaim: function(e, tr) {
      if (!tr.hasClass("selectedAccident")) {
        tr.addClass("selectedAccident");
      }
      MY.tabAccidents.AcccidentdetailsView = App.SelectedAccidentView.create(e.context);
      tr.after("<div id='AccDetailsWraper'></div><div class='dividers'></div>");
      MY.tabAccidents.AcccidentdetailsView.appendTo("#AccDetailsWraper");
      if (e.isTrigger) {
        return Em.run.next(function() {
          return $("#AccDetailsContent, div.dividers").show();
        });
      } else {
        return Em.run.next(function() {
          return $("#AccDetailsContent, div.dividers").slideDown(App.accidentsController.animationSpeedStart);
        });
      }
    },
    tbodyClick: function(e) {
      var AddWr, parent, tr;

      tr = $(e.target).closest("div.tr");
      console.log("tbodyClick");
      this.setfilteredPolicies(e.context.date);
      AddWr = $("#AccDetailsWraper");
      parent = tr.parent();
      if (tr.hasClass("selectedAccident") && !e.isTrigger) {
        if (parent.find("div.dividers").length) {
          this.removeClaims(AddWr, e, tr, parent);
          return false;
          parent.find("div.selectedAccident").removeClass("selectedAccident");
        }
      } else {
        this.removeClaims(AddWr, e, tr, parent);
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
      $("body").spinner('remove');
      return false;
    },
    filterDidChange: (function(thisObj, filterName) {
      var dtl, filterValue;

      console.log("filterDidChange");
      if (MY.tabAccidents.AcccidentdetailsView) {
        dtl = MY.tabAccidents;
        dtl.AcccidentdetailsView.remove();
        dtl.AcccidentdetailsView = null;
        $('#AccDetailsWraper').next('div.dividers').remove().end().prev().removeClass('selectedAccident').end().remove();
      }
      filterValue = filterName === "All" ? void 0 : thisObj[filterName];
      if (filterName === "filterValue") {
        this.textFilterIsActive = filterValue === "" ? false : true;
      } else {
        this.panelFilterIsActive = this.chkDocs || this.chkOpen || this.chkData || this.chkClaim ? true : false;
        this.filterByPanel = this.get_filterByPanel();
      }
      this.filterItems(filterName, filterValue, thisObj);
      return Em.run.next(function() {
        var tbl;

        tbl = $('#accidentsTable');
        if (!tbl.find('div.selectedAccident').length) {
          return tbl.find('div.dividers').remove();
        }
      });
    }).observes('chkDocs', 'chkOpen', 'chkData', 'chkClaim', 'filterValue')
  }, textFilterIsActive = false, panelFilterIsActive = false, {
    filterCols: ['accType', 'driver', 'shortNote', 'userName', 'place', 'claims_C'],
    filterValue: null,
    chkDocs: null,
    chkOpen: null,
    chkData: null,
    chkClaim: null,
    filterByField: function(row) {
      var cols, fnFilter, i, me, ret, _i, _ref;

      if (!this.filterReduced) {
        if (row.filterToHide) {
          return false;
        }
      }
      me = this;
      ret = false;
      cols = JSON.parse(JSON.stringify(me.filterCols));
      fnFilter = function(i) {
        if (row[cols[i]].toLowerCase().indexOf(me.filterValue) > -1) {
          return true;
        } else {
          return false;
        }
      };
      console.log("---Start filtering----");
      for (i = _i = 0, _ref = cols.length; _i < _ref; i = _i += 1) {
        if (fnFilter(i)) {
          console.log("true - " + row[cols[i]]);
          ret = true;
          break;
        } else {
          console.log("false - " + row[cols[i]]);
          ret = false;
        }
      }
      console.log("---End filtering----");
      row.set("filterToHide", !ret);
      return ret;
    },
    get_filterByPanel: function() {
      var fn;

      fn = "";
      if (this.chkOpen) {
        fn += this.chkOpen === "chkWithOpen" ? "if (row.cNo_NotF===0) return false;" : "if (row.cNo_NotF>0) return false;";
      }
      if (this.chkDocs) {
        fn += this.chkDocs === "chkWithDocs" ? "if (row.docNo===0) return false;" : "if (row.docNo>0) return false;";
      }
      if (this.chkData) {
        fn += this.chkData === "12month" ? "if (row.daysFrom>365) return false;" : "if (row.date.indexOf(" + this.chkData + ")===-1) return false;";
      }
      if (this.chkClaim) {
        fn += "if (row.claims_TypeID.indexOf('" + this.chkClaim + "')===-1) return false;";
      }
      fn += "return true;";
      return new Function("row", fn);
    },
    filterByPanel: null,
    filterItems: function(filterName, filterValue, thisObj) {
      var fnFilter,
        _this = this;

      if (filterName === 'filterValue') {
        if (filterValue === "") {
          fnFilter = this.panelFilterIsActive ? function(row) {
            row.filterToHide = false;
            return _this.filterByPanel(row);
          } : function(row) {
            row.filterToHide = false;
            return true;
          };
        } else {
          if (this.panelFilterIsActive) {
            fnFilter = function(row) {
              var result;

              result = (!_this.filterByField(row) ? false : _this.filterByPanel(row));
              return result;
            };
          } else {
            fnFilter = function(row) {
              return _this.filterByField(row);
            };
          }
        }
        console.log("Filtro pradžia - tekstas---------------");
      } else {
        if (!this.textFilterIsActive && !this.panelFilterIsActive) {
          fnFilter = function(row) {
            return true;
          };
        } else {
          fnFilter = function(row) {
            if (row.filterToHide) {
              return false;
            }
            return _this.filterByPanel(row);
          };
        }
        console.log("Filtro pradžia - kiti filtrai---------------");
      }
      return this.content.forEach(function(row) {
        var res;

        res = fnFilter(row);
        return row.set('visible', res);
      });
    }
  });

  App.thisAccidentController = Em.ResourceController.create({
    content: [],
    tableName: "?"
  });

  App.sidePanelController = Em.ResourceController.create({
    chkHandlerToggle: function(id, option, controller) {
      $(id).buttonset().on("click", function(e) {
        var chk, newVal;

        chk = $(e.target).closest("label").prev();
        newVal = chk.next().hasClass("ui-state-active") ? chk.attr("id") : null;
        $(this).find("label").not(chk.next()).removeClass("ui-state-active").end().prev().not(chk).removeAttr("checked");
        App[controller].set(option, newVal);
        return false;
      });
      return this;
    },
    chkHandler: function(id, option, controller) {
      $(id).buttonset().on("click", function(e) {
        var lbl, newVal;

        e.preventDefault();
        lbl = $(e.target).closest("label");
        lbl.parent().find("label").not(lbl).removeClass("ui-state-active");
        newVal = lbl.hasClass("ui-state-active") ? lbl.attr("for").replace("chkClaimAcc_", "").replace("chk_date", "").replace("chkInsurers_", "").replace("chkData_", "").replace("chkClaim_", "") : null;
        App[controller].set(option, newVal);
        return false;
      });
      if (controller === "claimsController" || option === "chkClaim") {
        App.sidePanelController.fnHighlight(option, controller);
      }
      return this;
    },
    refreshPanels: function(event) {
      var claimTypes, insurers, policies;

      event = event;
      claimTypes = [];
      insurers = [];
      policies = [];
      if (!this.years.length) {
        this.set('years', oDATA.GET("proc_Years").emData.map(function(item) {
          item.chkId = "chk_date" + item.year;
          item.chkId2 = "chkData_" + item.year;
          return item;
        }));
      }
      oDATA.GET("proc_Claims").emData.forEach(function(claim) {
        if (!claimTypes.contains(claim.claimTypeID)) {
          claimTypes.push(claim.claimTypeID);
        }
        if (event === "loadCl" || event === "refreshCriteria") {
          if (!policies.contains(claim.insPolicyID)) {
            policies.push(claim.insPolicyID);
          }
          if (!this.isOpen) {
            if (claim.claimStatus !== 5) {
              this.set('isOpen', true);
            }
          }
          if (!this.isWithWarnings) {
            if (claim.warnings) {
              this.set('isWithWarnings', true);
            }
          }
          if (!this.isWithMyTasks) {
            if (claim.warnings) {
              if (claim.warnings.tasks) {
                if (claim.warnings.tasks.filter(function(t) {
                  return t.toID === App.userData.userID;
                }).length) {
                  this.set('isWithMyTasks', true);
                }
              }
            }
          }
          this.set('isWith', this.isOpen || this.isWithWarnings || this.isWithMyTasks);
          policies.forEach(function(pID) {
            var insurerID, policy;

            policy = oDATA.GET("proc_InsPolicies").emData.findProperty("iD", pID);
            insurerID = policy ? policy.insurerID : null;
            if (insurerID && !insurers.contains(insurerID)) {
              return insurers.push(insurerID);
            }
          });
        }
        if (event === "loadCl") {
          insurers = oDATA.GET("tblInsurers").emData.filter(function(i) {
            return insurers.contains(i.iD);
          }).map(function(item) {
            item.chkId = "chkInsurers_" + item.iD;
            return item;
          });
          this.set('insurers', insurers);
        }
        return false;
      }, this);
      if (event === "refreshClaims" || !this.claimTypes.length) {
        claimTypes = oDATA.GET("tblClaimTypes").emData.filter(function(t) {
          return claimTypes.contains(t.iD);
        }).map(function(item) {
          if (item.iD === 0) {
            item.visible = false;
          }
          if (item.iD === 6) {
            item.notForClaims = true;
          }
          item.chkId = "chkClaimAcc_" + item.iD;
          item.chkId2 = "chkClaim_" + item.iD;
          return item;
        });
        this.set('claimTypes', claimTypes);
      }
      if (event === "refreshCriteria") {
        this.attachBtnClaims(event);
      }
      if (event === "refreshClaims") {
        this.attachBtnClaims(event);
        this.attachBtnAccidents(event);
      }
      return this;
    },
    fnAfterAtach: function(panel) {
      panel = $(panel);
      if (panel.hasClass('hidden')) {
        return panel.closest("div.col2").stickyPanel().end().removeClass('hidden');
      }
    },
    attachBtnAccidents: function(event) {
      return Em.run.next({
        me: this,
        event: event
      }, function() {
        var ctrl;

        ctrl = "accidentsController";
        if (this.event === "refreshClaims") {
          return this.me.chkHandler("#chkClaimsTypes", "chkClaim", ctrl);
        } else {
          return this.me.chkHandlerToggle("#chkOpen", "chkOpen", ctrl).chkHandlerToggle("#chkDocs", "chkDocs", ctrl).chkHandler("#chkYears", "chkData", ctrl).chkHandler("#chkClaimsTypes", "chkClaim", ctrl).fnAfterAtach("#sidePanel");
        }
      });
    },
    attachBtnClaims: function(event) {
      return Em.run.next({
        me: this,
        event: event
      }, function() {
        var clCtrl;

        clCtrl = "claimsController";
        if (this.event === "refreshCriteria") {
          return this.me.chkHandler("#chkCriteria", "chkCriteria", clCtrl);
        } else if (this.event === "refreshClaims") {
          return this.me.chkHandler("#chkClaimsTypesCl", "chkClaim", clCtrl);
        } else {
          return this.me.chkHandler("#chkCriteria", "chkCriteria", clCtrl).chkHandler("#chkInsurers", "chkInsurers", clCtrl).chkHandler("#chkYearsCl", "chkData", clCtrl).chkHandler("#chkClaimsTypesCl", "chkClaim", clCtrl).fnAfterAtach("#sidePanelCl");
        }
      });
    },
    fnHighlight: function(valName, ctrl) {
      var lbl, val;

      val = App[ctrl][valName];
      if (val) {
        if (ctrl === "accidentsController") {
          lbl = valName + "Acc_" + val;
        } else if (valName === "chkCriteria") {
          lbl = val;
        } else {
          lbl = valName + "_" + val;
        }
        lbl = $("#" + lbl).next('label');
        if (!lbl.hasClass("ui-state-active")) {
          return lbl.addClass("ui-state-active");
        }
      }
    },
    years: [],
    claimTypes: [],
    insurers: [],
    years: []
  });

  App.SidePanelView = Em.View.extend({
    templateName: "tmpSidePanel",
    controller: App.sidePanelController,
    panel: "#sidePanel",
    didInsertElement: function() {
      this._super();
      return oDATA.execWhenLoaded(["tblClaimTypes"], function() {
        return this.controller.refreshPanels("loadAcc").attachBtnAccidents();
      }, this);
    },
    showAll: function() {
      var ctrl;

      $(this.panel).find("label.ui-state-active").removeClass("ui-state-active");
      $(this.panel).find("input:checkbox").removeAttr("checked").parent().next().next().find("span.ui-checkbox-icon").removeClass("ui-icon ui-icon-check").attr("aria-checked", "false");
      ctrl = App.accidentsController;
      ctrl.chkOpen = null;
      ctrl.chkDocs = null;
      ctrl.chkData = null;
      ctrl.chkClaim = null;
      return ctrl.filterDidChange(this, 'All');
    }
  });

  App.SidePanelForClaimsView = Em.View.extend({
    templateName: "tmpSidePanelForClaims",
    controller: App.sidePanelController,
    panel: "#sidePanelCl",
    showAll: function() {
      var ctrl;

      $(this.panel).find("input:checkbox").removeAttr("checked").parent().next().next().find("span.ui-checkbox-icon").removeClass("ui-icon ui-icon-check").attr("aria-checked", "false");
      $(this.panel).find("label.ui-state-active").removeClass("ui-state-active");
      ctrl = App.claimsController;
      ctrl.chkCriteria = null;
      ctrl.chkInsurers = null;
      ctrl.chkData = null;
      ctrl.chkClaim = null;
      return ctrl.filterDidChange(this, 'All');
    }
  });

  MY.tabAccidents = {};

}).call(this);

/*
//@ sourceMappingURL=tabAccidents.map
*/
