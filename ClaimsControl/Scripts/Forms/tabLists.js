// Generated by CoffeeScript 1.4.0
(function() {
  var w=window, App=w.App, Em=w.Em, oGLOBAL=w.oGLOBAL, oDATA=w.oDATA, oCONTROLS=w.oCONTROLS, MY=w.MY;

  var docsViewOpts;

  App.listsStart = function() {
    App.topNewController.vehicles.clear();
    App.topNewController.drivers.clear();
    App.topNewController.insPolicies.clear();
    App.topNewController.drivers.pushObjects(oDATA.GET("proc_topDrivers").emData);
    App.topNewController.vehicles.pushObjects(oDATA.GET("proc_topVehicles").emData);
    App.topNewController.insPolicies.pushObjects(oDATA.GET("proc_topInsPolicies").emData);
    return oDATA.execWhenLoaded(["proc_Vehicles", "proc_Drivers", "proc_InsPolicies"], function() {
      App.listAllController.set("vehicles", oDATA.GET("proc_Vehicles").emData);
      App.listAllController.set("drivers", oDATA.GET("proc_Drivers").emData);
      return App.listAllController.set("insPolicies", oDATA.GET("proc_InsPolicies").emData);
    });
  };

  App.topNewController = Em.ResourceController.create({
    vehicles: [],
    drivers: [],
    insPolicies: [],
    tableName: "?"
  });

  App.DriverView = Em.View.extend({
    templateName: 'tmpDriverRow',
    tagName: ""
  });

  App.VehicleView = Em.View.extend({
    templateName: 'tmpVehicleRow',
    tagName: ""
  });

  App.InsPolicyView = Em.View.extend({
    templateName: 'tmpInsPolicyRow',
    tagName: ""
  });

  App.listAllController = Em.ResourceController.create({
    current: "",
    clicked: "",
    endDate: "",
    editItem: "",
    filterValue: "",
    addMakeMode: "",
    VehicleMakes: [],
    editVehicleMake: false,
    valueDidChange: (function() {
      return this.filterItems();
    }).observes('filterValue'),
    addVehicleMake: function(input, e) {
      var dialogID;
      if (this.VehicleMakes.length === 0) {
        this.set("VehicleMakes", oDATA.GET("tblVehicleMakes").emData);
      }
      dialogID = "dialog" + (+(new Date));
      return MY[dialogID] = JQ.Dialog.create({
        input: input,
        dialogID: dialogID,
        title: "Transporto priemonių markės",
        saveData: function(p) {
          var Source, me;
          Source = App.listAllController.VehicleMakes;
          me = this;
          $.extend(p, {
            "Ctrl": $("#" + this.dialogID),
            "source": "tblVehicleMakes",
            CallBackAfter: function(Row) {
              if (p.Action === "Edit") {
                Source.findProperty("iD", Row.iD).set("edit", false);
              }
              if (p.Action === "Add") {
                MY[me.dialogID].set("addVehicleMake", false);
              }
              return me.input.autocomplete("option").fnRefresh();
            }
          });
          SERVER.update2(p);
          return false;
        },
        editVehicleMake: function(e) {
          return e.context.set("edit", e.context.name);
        },
        cancelVehicleMake: function(e) {
          return e.context.set("edit", false);
        },
        saveVehicleMake: function(e) {
          var Msg, make, row, val;
          make = e.context.name;
          input = $(e.target).prev();
          val = input.val();
          row = e.context;
          row.name = val;
          if (make.length > 0) {
            Msg = {
              Title: this.title,
              Success: "TP markė '" + make + "' pakeista.",
              Error: "Nepavyko pakeisti '" + make + "' markės."
            };
            return this.saveData({
              DataToSave: {
                "id": row.iD,
                "Data": [row.name],
                "Fields": ["Name"],
                "DataTable": "tblVehicleMakes"
              },
              Msg: Msg,
              row: row,
              Action: "Edit"
            });
          } else {
            return e.context.set("name", e.context.edit).set("edit", false);
          }
        },
        deleteVehicleMake: function(e) {
          var make, me;
          make = e.context.name;
          me = this;
          return oCONTROLS.dialog.Confirm({
            title: this.title,
            msg: "Ištrinti markę '" + make + "'?"
          }, function() {
            var Msg, row;
            Msg = {
              Title: me.title,
              Success: "TP markė '" + make + "' ištrinta.",
              Error: "Nepavyko ištrinti markės '" + make + "'."
            };
            row = e.context;
            return me.saveData({
              DataToSave: {
                "id": row.iD,
                "DataTable": "tblVehicleMakes"
              },
              Msg: Msg,
              row: row,
              Action: "Delete"
            });
          });
        },
        addNewVehicleMake: function(e) {
          return this.set("addItem", true);
        },
        cancelNewVehicleMake: function(e) {
          return this.set("addItem", false);
        },
        saveNewVehicleMake: function(e) {
          var Msg, val;
          input = $(e.target).prev();
          val = input.val();
          Msg = {
            Title: this.title2,
            Success: "Dokumento tipas '" + val + "' pridėtas.",
            Error: "Nepavyko pridėt tipo '" + val + "'"
          };
          return this.saveData({
            DataToSave: {
              "Data": [val],
              "Fields": ["Name"],
              "DataTable": "tblVehicleMakes"
            },
            Msg: Msg,
            row: [val],
            Action: "Add"
          });
        },
        closeDialog: function(e) {
          $("#" + this.dialogID).dialog("close");
          return false;
        },
        width: 600,
        templateName: 'tmpVehicleMakes'
      }).append();
    },
    editListItems: function(input, e) {
      var dialogID, source, sourceName, tblUpdate;
      sourceName = input.data("ctrl").Source;
      tblUpdate = input.data("ctrl").tblUpdate ? input.data("ctrl").tblUpdate : sourceName;
      source = oDATA.GET(sourceName);
      this.set("listItems", source.emData.removeObject(source.emData.findProperty("iD", 0)));
      dialogID = "dialog" + (+(new Date));
      return MY[dialogID] = JQ.Dialog.create({
        input: input,
        dialogID: dialogID,
        title: source.Config.Msg.ListName,
        msg: source.Config.Msg,
        addNewMsg: "Pridėti naują " + source.Config.Msg.GenNameWhat.firstSmall(),
        saveData: function(p) {
          var Source, me;
          Source = App.listAllController.listItems;
          me = this;
          $.extend(p, {
            "Ctrl": $("#" + this.dialogID),
            "source": sourceName,
            CallBackAfter: function(Row) {
              if (p.Action === "Edit") {
                Source.findProperty("iD", Row.iD).set("edit", false);
              }
              if (p.Action === "Add") {
                MY[me.dialogID].set("addItem", false);
              }
              return me.input.autocomplete("option").fnRefresh();
            }
          });
          SERVER.update2(p);
          return false;
        },
        editItem: function(e) {
          return e.context.set("edit", e.context.name);
        },
        cancelItem: function(e) {
          return e.context.set("edit", false);
        },
        saveItem: function(e) {
          /* reikia žiūrėt
          */

          var Msg, item, row, val;
          item = e.context.name;
          input = $(e.target).prev();
          val = input.val();
          row = e.context;
          row.name = val;
          if (item.length > 0) {
            Msg = {
              Title: this.title,
              Success: this.msg.GenName + " '" + item + "' pakeista(s).",
              Error: this.msg.GenNameWhat + " '" + item + "' nepavyko pakeisti.."
            };
            return this.saveData({
              DataToSave: {
                "id": row.iD,
                "Data": [row.name],
                "Fields": ["Name"],
                "DataTable": tblUpdate
              },
              Msg: Msg,
              row: row,
              Action: "Edit"
            });
          } else {
            return e.context.set("name", e.context.edit).set("edit", false);
          }
        },
        deleteItem: function(e) {
          var item, me;
          item = e.context.name;
          me = this;
          return oCONTROLS.dialog.Confirm({
            title: this.title,
            msg: me.msg.Delete + " '" + item + "'?"
          }, function() {
            var Msg, row;
            Msg = {
              Title: me.title,
              Success: me.msg.GenName + " '" + item + "' ištrinta(s).",
              Error: me.msg.GenNameWhat + " '" + item + "' nepavyko ištrinti."
            };
            row = e.context;
            return me.saveData({
              DataToSave: {
                "id": row.iD,
                "DataTable": tblUpdate
              },
              Msg: Msg,
              row: row,
              Action: "Delete"
            });
          });
        },
        addNewItem: function(e) {
          return this.set("addItem", true);
        },
        cancelNewItem: function(e) {
          return this.set("addItem", false);
        },
        saveNewItem: function(e) {
          var Msg, val;
          input = $(e.target).prev();
          val = input.val();
          Msg = {
            Title: this.title,
            Success: this.msg.GenName + " '" + val + "' pridėtas.",
            Error: this.msg.GenNameWhat + " '" + val + "' nepavyko pridėti."
          };
          return this.saveData({
            DataToSave: {
              "Data": [val],
              "Fields": ["Name"],
              "DataTable": tblUpdate
            },
            Msg: Msg,
            row: [val],
            Action: "Add"
          });
        },
        closeDialog: function(e) {
          $("#" + this.dialogID).dialog("close");
          return false;
        },
        width: 600,
        templateName: 'tmpEditItems'
      }).append();
    },
    openItem: function(pars) {
      var config, title;
      this.set("dateIsEdited", false);
      if (!App.docsTypesController) {
        App.create_docsTypesController();
      }
      config = oDATA.GET(pars.source).Config;
      title = pars.row ? config.Msg.GenName + ": " + pars.row.MapArrToString(config.titleFields, (pars.template === "tmp_Drivers" ? true : false)) : config.Msg.AddNew;
      if (!pars.row && pars.newVals) {
        pars.row = pars.newVals.vals.toRowObject(pars.newVals.cols);
      }
      if (MY.dialog) {
        MY.dialog.remove();
      }
      return Em.run.next(this, function() {
        return MY.dialog = JQ.Dialog.create({
          controllerBinding: "App.listAllController",
          controller: pars.me,
          pars: pars,
          init: function() {
            this._super();
            this.templateName = pars.template;
            this.title = title;
            return this.pars = pars;
          },
          goToEditDate: function() {
            App.listAllController.set("dateIsEdited", true);
            return Em.run.next(this, function() {
              return $("#dialogEndDateInput").datepicker({
                "minDate": "-3y",
                "maxDate": "0"
              }).trigger("focus");
            });
          },
          saveDate: function() {
            var newDate, obj;
            newDate = $(event.target).parent().parent().find("input").val();
            if (!oGLOBAL.date.isDate(newDate)) {
              newDate = "";
            }
            obj = $("#dialogContent").data("ctrl");
            SERVER.update2({
              "Action": "Edit",
              "Ctrl": $("#openItemDialog"),
              "source": obj.Source,
              "row": this.pars.row,
              DataToSave: {
                "id": obj.id,
                "Data": [newDate],
                "Fields": ["EndDate"],
                "DataTable": obj.tblUpdate
              },
              CallBackAfter: function(Row) {
                return $("#tabLists").find("div.ui-tabs").find("li.ui-tabs-selected a").trigger("click");
              }
            });
            console.log("išsaugoti " + newDate);
            this.pars.me.endDate = newDate;
            return App.listAllController.set("dateIsEdited", false).set("endDate", newDate);
          },
          didInsertElement: function() {
            var categoryOpts, dialogContent, dialogFrm, docGroups, groupID, me, name, ref, refID;
            this._super();
            dialogFrm = $("#openItemDialog");
            dialogContent = $("#dialogContent");
            if (pars.row) {
              categoryOpts = false;
              docGroups = oDATA.GET("tblDocGroup").emData;
              me = this;
              ref = 0;
              if (pars.emObject === "vehicles" || pars.source === "proc_Vehicles") {
                ref = 4;
              } else if (pars.emObject === "drivers" || pars.source === "proc_Drivers") {
                ref = 3;
              }
              if (ref) {
                groupID = docGroups.findProperty("ref", ref).iD;
                if (ref === 4) {
                  name = "TP " + pars.row.make + ", " + pars.row.model + ", " + pars.row.plate + " dokumentai";
                  categoryOpts = {
                    showCategories: [
                      {
                        iD: groupID,
                        ref: ref,
                        name: name
                      }
                    ],
                    vehicles: [
                      {
                        iD: pars.row.iD,
                        title: name
                      }
                    ]
                  };
                }
                if (ref === 3) {
                  name = "Vairuotojo '" + pars.row.firstName + " " + pars.row.lastName + "' dokumentai";
                  categoryOpts = {
                    showCategories: [
                      {
                        iD: groupID,
                        ref: ref,
                        name: name
                      }
                    ],
                    driver: {
                      iD: pars.row.iD,
                      title: name
                    }
                  };
                }
                dialogFrm.find("div.uploadDocsContainer").UploadFiles({
                  categoryOpts: categoryOpts,
                  showPhoto: false,
                  docsController: "dialogDocController",
                  requireCategory: true
                });
                refID = pars.row.iD;
                App.dialogDocController.setDocs(refID, groupID);
                this.removeOnCloseView = Em.View.create(docsViewOpts).appendTo("#dialoguploadDocsContainer");
              }
            }
            $("#btnSaveItem").on("click", function() {
              var DataToSave;
              DataToSave = oCONTROLS.ValidateForm(dialogContent);
              $.extend(pars, {
                DataToSave: DataToSave,
                Ctrl: $("#tabLists"),
                CallBackAfter: function(Row) {
                  dialogFrm.dialog("close");
                  if (Row.iD) {
                    if (pars.input) {
                      return pars.input.data("newval", Row.iD).autocomplete("option").fnRefresh();
                    } else {
                      return $("#tabLists").find("div.ui-tabs").find("li.ui-tabs-selected a").trigger("click");
                    }
                  }
                }
              });
              SERVER.update2(pars);
              return false;
            });
            $("#aCancelItem").on("click", function() {
              dialogFrm.dialog("close");
              return false;
            });
            if (this.templateName === "tmp_InsPolicies") {
              this.$().tabs().css("margin", "-5px 1px 0 1px").find("ul").css("background-color", "#505860");
            }
            return oCONTROLS.UpdatableForm(dialogContent, pars.row);
          },
          width: 700,
          templateName: 'dialog-content'
        }).append();
      });
    },
    addNew: function(e) {
      var pars;
      pars = $(e.target).parent().data("ctrl");
      console.log("addNew");
      console.log(pars);
      $.extend(pars, {
        row: 0,
        Action: "Add",
        me: this,
        CallBackAfter: function(Row) {}
      });
      this.set("endDate", "");
      this.set("editItem", false);
      return this.openItem(pars);
    },
    edit: function(e) {
      var context, endDate, pars;
      console.log("edit");
      console.log(e.target);
      console.log(e.view._context);
      context = e.view._context;
      pars = $(e.target).closest("table").next().data("ctrl");
      pars = pars ? pars : this.current;
      $.extend(pars, {
        row: context,
        Action: "Edit",
        me: this
      });
      endDate = pars.row.endDate ? pars.row.endDate : "";
      this.set("endDate", endDate);
      this.set("editItem", true);
      console.log("going to open items");
      return this.openItem(pars);
    },
    filterByField: function() {
      var fn;
      fn = !this.filterValue ? "return true;" : "var ret=false,cols=" + JSON.stringify(this.current.filterCols) + ";console.log('Filtering by val:" + this.filterValue + "'); for(var i=0; i < cols.length; i++){console.log(row[cols[i]]+', '+(row[cols[i]].toLowerCase().indexOf('" + this.filterValue + "')>-1));		if (row[cols[i]].toLowerCase().indexOf('" + this.filterValue + "')>-1){ret=true; break;}} console.log('filterByval rez: '+ret);return ret;";
      return new Function("row", fn);
    },
    filterByTab: function() {
      var fn, mark;
      if (this.current.emObject === "drivers") {
        mark = this.clicked === "NotWorking" ? "!" : "";
        fn = "var ret=true; if ($.trim(row.endDate)) {ret=oGLOBAL.date.firstBigger(row.endDate);} console.log('endDate: '+row.endDate+', '+ret);return " + mark + "ret";
      } else if (this.current.emObject === "vehicles") {
        mark = this.clicked === "NotWorking" ? "!" : "";
        fn = "var ret=true; if ($.trim(row.endDate)) {ret=oGLOBAL.date.firstBigger(row.endDate);} console.log('endDate: '+row.endDate+', '+ret);return " + mark + "ret";
      } else {
        throw new Error("filterByTab has no such emObject");
      }
      return new Function("row", fn);
    },
    filterItems: function() {
      var fn,
        _this = this;
      if (this.current.emObject === "insPolicies") {
        fn = function(row) {
          var v;
          v = _this.filterByField()(row);
          return row.set('visible', v);
        };
      } else {
        fn = function(row) {
          var v;
          v = (_this.filterByTab()(row) ? _this.filterByField()(row) : false);
          return row.set('visible', v);
        };
      }
      return App.listAllController[this.current.emObject].forEach(fn);
    },
    showTabs: function(e) {
      var t;
      t = $(e.target);
      t.closest("ul").find("li").removeClass("ui-tabs-selected ui-state-active");
      return t.closest("li").addClass("ui-tabs-selected ui-state-active");
    },
    filterWorking: function(e) {
      this.set("clicked", "Working");
      this.showTabs(e);
      return this.filterItems();
    },
    filterNotWorking: function(e) {
      this.set("clicked", "NotWorking");
      this.showTabs(e);
      return this.filterItems();
    },
    vehicles: [],
    drivers: [],
    insPolicies: [],
    tableName: "?"
  });

  App.TopListsView = App.mainMenuView.extend({
    templateName: 'tmpListsTop',
    viewIx: 4
  });

  App.AllDriversView = App.mainMenuView.extend({
    init: function() {
      this._super();
      return App.listAllController.set("content", oDATA.GET("proc_Drivers").emData);
    },
    templateName: 'tmpAllDrivers',
    viewIx: 4,
    didInsertElement: function() {
      var view;
      this._super();
      view = $("#tabLists");
      view.find("div.ui-tabs").find("li:first a").trigger("click");
      return view.find("table.zebra-striped").tblSortable({
        cols: ["firstName", "lastName", "dateExpierence", "drivingCategory", "phone", "docs"],
        controller: "listAllController",
        sortedCol: 1
      });
    }
  });

  App.AllInsPoliciesView = App.mainMenuView.extend({
    init: function() {
      this._super();
      return App.listAllController.set("content", oDATA.GET("proc_InsPolicies").emData);
    },
    templateName: 'tmpAllInsPolicies',
    viewIx: 4,
    didInsertElement: function() {
      return $("#tabLists").find("table.zebra-striped").tblSortable({
        cols: ["claimType", "insurerName", "policyNumber", "endDate", "isuredName"],
        controller: "listAllController",
        sortedCol: 0
      });
    }
  });

  App.AllVehiclesView = App.mainMenuView.extend({
    init: function() {
      this._super();
      return App.listAllController.set("content", oDATA.GET("proc_Vehicles").emData);
    },
    templateName: 'tmpAllVehicles',
    viewIx: 4,
    didInsertElement: function() {
      var view;
      this._super();
      view = $("#tabLists");
      view.find("div.ui-tabs").find("li:first a").trigger("click");
      return view.find("table.zebra-striped").tblSortable({
        cols: ["plate", "type", "make", "model", "year", "docs"],
        controller: "listAllController",
        sortedCol: 0
      });
    }
  });

  App.dialogDocController = Em.ResourceController.create({
    refID: null,
    groupID: null,
    docs: [],
    refreshDocs: function() {
      return this.setDocs(this.refID, this.groupID);
    },
    setDocs: function(refID, groupID) {
      var docTypes, docs, docsPath, fnGetDocType, fnGetIcon, fnGetUser, url, users;
      if (refID) {
        this.refID = refID;
        this.groupID = groupID;
      } else {
        refID = this.refID;
        groupID = this.groupID;
      }
      docsPath = oDATA.GET("userData").emData[0].docsPath;
      url = "Uploads/" + docsPath;
      users = oDATA.GET("tblUsers").emData;
      docTypes = oDATA.GET("tblDocTypes").emData;
      fnGetIcon = function(ext) {
        ext = ext.slice(0, 3);
        return "img32-doc_" + (ext === "xls" || ext === "doc" || ext === "pdf" ? ext : "unknown");
      };
      fnGetUser = (function(userID) {
        var u;
        u = users.find(function(user) {
          return user.iD === userID;
        });
        return u.firstName + " " + u.surname;
      });
      fnGetDocType = function(typeID) {
        return docTypes.find(function(type) {
          return type.iD === typeID;
        }).name;
      };
      docs = oDATA.GET("tblDocs").emData.filter(function(doc) {
        return doc.refID === refID && doc.groupID === groupID;
      }).map(function(doc) {
        var file, user;
        user = fnGetUser(doc.userID);
        file = "/" + doc.iD + "." + doc.fileType;
        return Em.Object.create({
          docID: doc.iD,
          hasThumb: doc.hasThumb,
          urlThumb: url + "/Thumbs" + file,
          urlDoc: url + file,
          docType: fnGetDocType(doc.docTypeID),
          description: doc.description,
          docName: doc.docName,
          userName: user,
          fileDate: doc.fileDate,
          fileName: doc.docName + "." + doc.fileType,
          fileIcon: !doc.hasThumb ? fnGetIcon(doc.fileType) : "img32-doc_unknown",
          docDetails: "Įkėlė " + user + " " + doc.fileDate + ", dydis - " + Math.ceil(doc.fileSize / 10000) / 100 + "Mb"
        });
      });
      return this.set("docs", docs);
    }
  });

  docsViewOpts = {
    opts: null,
    templateName: "tmpDocsView",
    tagName: "ul",
    classNames: ["gallery", "ui-helper-reset", "ui-helper-clearfix"],
    controller: App.dialogDocController,
    didInsertElement: function() {
      this._super();
      return this.$().data("opts", this.opts);
    }
  };

}).call(this);
