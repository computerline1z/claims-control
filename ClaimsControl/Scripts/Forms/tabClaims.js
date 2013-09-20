// Generated by CoffeeScript 1.6.2
(function() {
  var w=window, App=w.App, Em=w.Em, oGLOBAL=w.oGLOBAL, oDATA=w.oDATA, oCONTROLS=w.oCONTROLS, MY=w.MY;
  var panelFilterIsActive, textFilterIsActive;

  App.claimsStart = function() {
    var actTypes;

    actTypes = App.tabClaimsRegulationController.activityTypes;
    if (actTypes) {
      if (actTypes.length) {
        return;
      }
    }
    oDATA.execWhenLoaded(["proc_Claims"], function() {
      return App.claimsController.set("content", oDATA.GET("proc_Claims").emData);
    });
    return oDATA.execWhenLoaded(["proc_Activities", "tblActivityTypes", "tblUsers"], function() {
      var me;

      actTypes = oDATA.GET("tblActivityTypes").emData.map(function(t) {
        t.typeID = t.iD;
        delete t.iD;
        return t;
      });
      me = App.tabClaimsRegulationController;
      me.set("activities", oDATA.GET("proc_Activities").emData).set("activityTypes", actTypes).set("users", oDATA.GET("tblUsers").emData);
      return me.set("ativitiesNotFin", actTypes.filter(function(a) {
        return !a.isFinances;
      }));
    });
  };

  App.TabClaimsView = App.mainMenuView.extend({
    templateName: 'tmpClaimsMain'
  });

  App.ClaimView = Em.View.extend({
    init: function() {
      this._super();
      return App.claimsController.setClaimContext(this.bindingContext);
    },
    templateName: 'tmpClaimView',
    tagName: ""
  });

  App.claimsController = Em.ArrayController.create({
    setClaimContext: function(claim) {
      var claimID;

      claimID = claim.iD;
      claim.set("accident", oDATA.GET("proc_Accidents").emData.findProperty("iD", claim.accidentID));
      claim.set("claimType", oDATA.GET("tblClaimTypes").emData.findProperty("iD", claim.claimTypeID));
      claim.set("vehicle", oDATA.GET("proc_Vehicles").emData.findProperty("iD", claim.vehicleID));
      claim.set("insPolicy", oDATA.GET("proc_InsPolicies").emData.findProperty("iD", claim.insPolicyID));
      claim.set("activities", oDATA.GET("proc_Activities").emData.filter(function(a) {
        return a.claimID === claimID;
      }));
      $.extend(claim, {
        insurerID: claim.insPolicy.insurerID,
        daysFrom: claim.accident.daysFrom,
        date: claim.accident.date
      });
      this.getWarnings(claim);
      return false;
    },
    getWarnings: function(claim) {
      var X, ctrl, dateFormat, daysAfterDocs, fnGetUser, red, tasks, warnings;

      warnings = {};
      tasks = [];
      dateFormat = App.userData.dateFormat;
      red = false;
      ctrl = App.tabClaimsRegulationController;
      fnGetUser = ctrl.fnGetUser;
      if (claim.insPolicyID) {
        if (claim.claimStatus === 0) {
          warnings = {
            notifyOfClaim: true
          };
          red = true;
        } else if (claim.claimStatus < 2) {
          X = moment().diff(moment(claim.date, dateFormat), 'days');
          if (X < 0) {
            warnings = {
              notifyOfDocs: {
                expired: math.abs(X)
              }
            };
            red = true;
          } else if (X === 0) {
            warnings = {
              notifyOfDocs: {
                today: true
              }
            };
            red = true;
          } else if (X - claim.insPolicy.warn_DocsSupplyTermExpire < 1) {
            warnings = {
              notifyOfDocs: {
                leftDays: X
              }
            };
            red = true;
          }
        } else {
          daysAfterDocs = moment().diff(moment(claim.date, dateFormat), "days");
          if (daysAfterDocs > claim.insPolicy.warn_PaymentTerm) {
            warnings.noPayment = daysAfterDocs;
          }
        }
      }
      claim.activities.forEach(function(a) {
        var obj;

        if (a.typeID === 3) {
          obj = {
            date: a.date,
            user: fnGetUser.call(ctrl, a.userID),
            subject: a.subject,
            iD: a.iD
          };
          if (moment().diff(moment(a.date, dateFormat), "days") > 0) {
            red = true;
            obj.red = true;
          }
          return tasks.addObject(obj);
        }
      });
      if (tasks.length) {
        warnings.tasks = tasks;
      }
      if (!$.isEmptyObject(warnings)) {
        claim.set("warnings", warnings).set("warningClass", (red ? "red-border" : "yellow-border"));
      }
      return false;
    },
    addNewAccident: function() {
      return this.openAccident(null);
    },
    content: [],
    filterDidChange: (function(thisObj, filterName) {
      var filterValue;

      console.log("filterDidChange");
      filterValue = filterName === "All" ? void 0 : thisObj[filterName];
      if (filterName === "filterValue") {
        this.textFilterIsActive = filterValue === "" ? false : true;
      } else {
        this.panelFilterIsActive = this.chkCriteria || this.chkInsurers || this.chkData || this.chkClaim ? true : false;
        this.filterByPanel = this.get_filterByPanel();
      }
      return this.filterItems(filterName, filterValue, thisObj);
    }).observes('chkCriteria', 'chkInsurers', 'chkData', 'chkClaim', 'filterValue')
  }, textFilterIsActive = false, panelFilterIsActive = false, {
    filterCols: [['accident', 'place'], ['accident', 'shortNote'], ['vehicle', 'plate'], 'insurerClaimID'],
    filterByField: function(row) {
      var colName, colVal, cols, filterValue, fnFilter, i, me, ret, toShow, _i, _ref;

      if (!this.filterReduced) {
        if (row.filterToHide) {
          return false;
        }
      }
      if (!row.accident) {
        return false;
      }
      me = this;
      ret = false;
      cols = me.filterCols;
      filterValue = me.filterValue;
      fnFilter = function(val) {
        if (val.toLowerCase().indexOf(filterValue) > -1) {
          return true;
        } else {
          return false;
        }
      };
      console.log("---Start filtering----");
      for (i = _i = 0, _ref = cols.length; _i < _ref; i = _i += 1) {
        colName = cols[i];
        colVal = typeof colName === 'string' ? row[colName] : row[colName[0]][colName[1]];
        toShow = !colVal ? false : fnFilter(colVal);
        if (toShow) {
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
      if (this.chkCriteria) {
        fn += "return true;";
      }
      if (this.chkInsurers) {
        fn += "console.log('chkInsurers result:'+row.insurerID+', '+(('+row.insurerID+'==='+this.chkInsurers+')?true:false));";
        fn += "if (row.insurerID!==" + this.chkInsurers + ") return false;";
      }
      if (this.chkData) {
        fn += "console.log('chkData result:'+row.date+', dienų:'+row.daysFrom);";
        fn += "if (!row.date) return false;";
        fn += this.chkData === "12month" ? "if (row.daysFrom>365) return false;" : "if (row.date.indexOf(" + this.chkData + ")===-1) return false;";
      }
      if (this.chkClaim) {
        fn += "console.log('claimTypeID:'+row.claimTypeID);";
        fn += "console.log('chkClaim option:" + this.chkClaim + "');";
        fn += "if (row.claimTypeID!==" + this.chkClaim + ") return false;";
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

  App.sidePanelForClaimsController = Em.ResourceController.create({
    chkHandler: function(lbl, option) {
      var newVal;

      lbl.parent().find("label").not(lbl).removeClass("ui-state-active");
      newVal = lbl.hasClass("ui-state-active") ? lbl.attr("for").replace("chkInsurers_", "").replace("chkDate_", "").replace("chkClaimTypes_", "") : null;
      console.log('NewOption: ' + option + '; New val: ' + newVal);
      return App.claimsController.set(option, newVal);
    },
    init: function() {
      var _this = this;

      this._super();
      return oDATA.execWhenLoaded(["tblClaimTypes"], function() {
        _this.set('insurers', oDATA.GET("tblInsurers").emData.map(function(item) {
          item.chkId = "chkInsurers_" + item.iD;
          return item;
        }));
        _this.set('years', oDATA.GET("proc_Years").emData.map(function(item) {
          item.chkId2 = "chkDate_" + item.year;
          return item;
        }));
        return _this.set('claimTypes', oDATA.GET("tblClaimTypes").emData.map(function(item) {
          item.chkId2 = "chkClaimTypes_" + item.iD;
          if (item.iD === 0 || item.iD === 6) {
            item.visible = false;
          }
          return item;
        }));
      });
    },
    insurers: [],
    years: [],
    claimTypes: []
  });

  App.SidePanelForClaimsView = Em.View.extend({
    templateName: "tmpSidePanelForClaims",
    controller: App.sidePanelForClaimsController,
    didInsertElement: function() {
      this._super();
      return Em.run.next(this, function() {
        var me;

        $("#sidePanelCl").closest("div.col2").stickyPanel();
        me = this.controller;
        $("#chkCriteria").buttonsetv().on("click", function(e) {
          var lbl;

          e.preventDefault();
          lbl = $(e.target).closest("label");
          me.chkHandler(lbl, "chkCriteria");
          return false;
        });
        $("#chkInsurers").buttonsetv().on("click", function(e) {
          var lbl;

          e.preventDefault();
          lbl = $(e.target).closest("label");
          me.chkHandler(lbl, "chkInsurers");
          return false;
        });
        $("#chkYearsCl").buttonsetv().on("click", function(e) {
          var lbl;

          e.preventDefault();
          lbl = $(e.target).closest("label");
          me.chkHandler(lbl, "chkData");
          return false;
        });
        return $("#chkClaimsTypesCl").buttonsetv().on("click", function(e) {
          var lbl;

          lbl = $(e.target).closest("label");
          me.chkHandler(lbl, "chkClaim");
          return false;
        });
      });
    },
    showAll: function() {
      var ctrl;

      $("#sidePanelCl").find("input:checkbox").removeAttr("checked").parent().next().next().find("span.ui-checkbox-icon").removeClass("ui-icon ui-icon-check").attr("aria-checked", "false");
      $("#sidePanelCl").find("label.ui-state-active").removeClass("ui-state-active");
      ctrl = App.claimsController;
      ctrl.chkCriteria = null;
      ctrl.chkInsurers = null;
      ctrl.chkData = null;
      ctrl.chkClaim = null;
      return ctrl.filterDidChange(this, 'All');
    }
  });

}).call(this);

/*
//@ sourceMappingURL=tabClaims.map
*/
