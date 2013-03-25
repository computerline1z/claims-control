//@ sourceMappingURL=tabAccidents.map
// Generated by CoffeeScript 1.6.1
(function() {
  var w=window, App=w.App, Em=w.Em, oGLOBAL=w.oGLOBAL, oDATA=w.oDATA, oCONTROLS=w.oCONTROLS, MY=w.MY;
  var panelFilterIsActive, textFilterIsActive;

  App.tabAccidentsView = App.mainMenuView.extend({
    content: null,
    viewIx: 0,
    templateName: 'tmpAccidentsMain',
    didInsertElement: function() {}
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
        MY.tabAccidents.SelectedClaimView.remove();
        ClaimW.remove();
      }
      tr.parent().find("tr.selectedClaim").removeClass("selectedClaim title");
      d = e.context;
      MY.tabAccidents.SelectedClaimView = App.SelectedClaimView.create({
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
      nTr.append("<div id='divNewClaimCard' data-ctrl='{\"id\":\"0\",\"NewRec\":\"1\",\"Source\":\"tblClaims\",\"ClaimTypeID\":\"0\"}'></div>");
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
      var IClaim, btnSaveToDisable, c, days, fnCheckIsInjured, frm, inpSum, perDay;
      c = this.content[0];
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
        inpSum = $(frm).find('.inputSum input');
        days = $(frm).find('.days input');
        perDay = $(frm).find('.perDay input');
        return $(frm).find('.days input,.perDay input').on("keyup", function() {
          return inpSum.val(days.val() * perDay.val());
        });
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
          newClaim: false,
          typeID: TypeID,
          deleteButton: true
        });
        App.claimEditController.set("content", [Claim]);
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
          typeID: TypeID
        });
        App.newClaimController.set("content", [Claim]);
      }
      return console.log("init Claim.Type - " + TypeID);
    },
    templateName: 'tmpClaimEdit'
  });

  App.claimEditController = Em.Controller.create({
    deleteForm: function(e) {
      var context, oData;
      oData = oDATA.GET("tblClaims");
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
    saveForm: function(e) {
      var Action, DataToSave, Msg, accidentID, frm, newClaim, opt;
      newClaim = e.view._context.newClaim;
      accidentID = e.view._parentView.templateData.view.rowContext.accidentID;
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
              return tr.trigger("click").trigger("click");
            }
          },
          Msg: Msg
        };
        return SERVER.update(opt);
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
      $("div.validity-tooltip").remove();
      dividers = AddWr.parent().find("div.dividers");
      dividers.slideUp(App.accidentsController.animationSpeedEnd, function() {
        return dividers.remove();
      });
      if (AddWr.length > 0) {
        MY.tabAccidents.AcccidentdetailsView.remove();
        me = this;
        return AddWr.slideUp(App.accidentsController.animationSpeedEnd, function() {
          if (tr.hasClass("selectedAccident")) {
            return tr.removeClass("selectedAccident");
          } else {
            parent.find("div.selectedAccident").removeClass("selectedAccident");
            AddWr.remove();
            return me.addClaim(e, tr);
          }
        });
      } else if (MY.tabAccidents.AcccidentdetailsView) {
        MY.tabAccidents.AcccidentdetailsView.destroy();
        MY.tabAccidents.AcccidentdetailsView = null;
        return $('div.dividers').remove();
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
      var filterValue;
      console.log("filterDidChange");
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
    filterFromVisible: false,
    filterCols: ['accType', 'driver', 'shortNote', 'userName', 'place', 'claims_C'],
    filterValue: null,
    chkDocs: null,
    chkOpen: null,
    chkData: null,
    chkClaim: null,
    filterByField: function(row) {
      var cols, fnFilter, i, me, ret, _i, _ref;
      if (row.filterToHide) {
        return false;
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
          ret = true;
          console.log("true - " + row[cols[i]]);
          break;
        } else {
          console.log("false - " + row[cols[i]]);
        }
      }
      console.log("---End filtering----");
      if (!ret) {
        row.filterToHide = true;
      }
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

  App.newClaimController = Em.ResourceController.create();

  App.sidePanelController = Em.ResourceController.create({
    tableName: "?",
    chkHandler: function(lbl, option) {
      var newVal;
      lbl.parent().find("label").not(lbl).removeClass("ui-state-active");
      newVal = lbl.hasClass("ui-state-active") ? lbl.attr("for").replace("chk_claimTypes", "").replace("chk_", "") : null;
      return App.accidentsController.set(option, newVal);
    },
    init: function() {
      var _this = this;
      this._super();
      return oDATA.execWhenLoaded(["tblClaimTypes"], function() {
        _this.set('years', oDATA.GET("proc_Years").emData.map(function(item) {
          item.chkId = "chk_" + item.year;
          return item;
        }));
        _this.set('claimTypes', oDATA.GET("tblClaimTypes").emData.map(function(item) {
          item.chkId = "chk_claimTypes" + item.iD;
          return item;
        }));
        _this.claimTypes.findProperty("iD", 0).visible = false;
        return Em.run.next(_this, function() {
          var me;
          me = this;
          $("#chkYears").buttonsetv().on("click", function(e) {
            var lbl;
            e.preventDefault();
            lbl = $(e.target).closest("label");
            me.chkHandler(lbl, "chkData");
            return false;
          });
          return $("#chkClaimsTypes").buttonsetv().on("click", function(e) {
            var lbl;
            lbl = $(e.target).closest("label");
            me.chkHandler(lbl, "chkClaim");
            return false;
          });
        });
      });
    },
    years: [],
    claimTypes: []
  });

  App.SidePanelView = Em.View.extend({
    templateName: "tmpSidePanel",
    didInsertElement: function() {
      this._super();
      return Em.run.next(function() {
        $("#sidePanel").closest("div.col2").scrollelement();
        $("#chkOpen").buttonset().on("click", function(e) {
          var chk, newVal;
          chk = $(e.target).closest("label").prev();
          newVal = chk.next().hasClass("ui-state-active") ? chk.attr("id") : null;
          $("#chkOpen").find("label").not(chk.next()).removeClass("ui-state-active").end().prev().not(chk).removeAttr("checked");
          App.accidentsController.set("chkOpen", newVal);
          return e.preventDefault();
        });
        return $("#chkDocs").buttonset().on("click", function(e) {
          var chk, newVal;
          chk = $(e.target).closest("label").prev();
          newVal = chk.next().hasClass("ui-state-active") ? chk.attr("id") : null;
          $("#chkDocs").find("label").not(chk.next()).removeClass("ui-state-active").end().prev().not(chk).removeAttr("checked");
          App.accidentsController.set("chkDocs", newVal);
          return e.preventDefault();
        });
      });
    },
    showAll: function() {
      $("#chkOpen,#chkDocs").find("label").removeClass("ui-state-active").end().prev().removeAttr("checked");
      $("#sidePanel").find("input:checkbox").removeAttr("checked").parent().next().next().find("span.ui-checkbox-icon").removeClass("ui-icon ui-icon-check").attr("aria-checked", "false");
      App.accidentsController.chkOpen = null;
      App.accidentsController.chkDocs = null;
      App.accidentsController.chkData = null;
      App.accidentsController.chkClaim = null;
      return App.accidentsController.filterDidChange(this, 'All');
    }
  });

  MY.tabAccidents = {};

}).call(this);
