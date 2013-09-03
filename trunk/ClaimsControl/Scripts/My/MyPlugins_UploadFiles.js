// Generated by CoffeeScript 1.6.2
(function() {
  var w=window, $=w.jQuery, App=w.App, Em=w.Em;;
  var WAIT_AJAX;

  WAIT_AJAX = 0;

  $.widget("ui.UploadFiles", {
    options: {
      uploadTemplateId: "tmp2templateUpload",
      downloadTemplateId: "tmp2templateDownload",
      formTemplate: "tmpUploadForm",
      docsController: "treeDocController",
      url: "Files/Start",
      fileuploaddone: function() {},
      categoryOpts: {},
      ListType: "List",
      Source: "tblDocTypes",
      iVal: "iD",
      iText: ["name"]
    },
    _create: function() {
      var form;

      form = "";
      Em.View.create({
        templateName: this.options.formTemplate,
        options: this.options,
        showPhoto: this.options.showPhoto,
        showFromAccident: this.options.showFromAccident,
        addFromAccident: function(e) {
          return Em.run.next(this, function() {
            return MY.dialog = JQ.Dialog.create({
              controllerBinding: "App.claimDocController",
              categoryOpts: this.options.categoryOpts,
              claim: this.options.claim,
              init: function() {
                var a;

                this._super();
                a = this.claim.accident;
                this.title = "Įvykis Nr. " + a.no + ", " + a.accType + ", " + a.date;
                return App.claimDocController.setAccDocs(this.categoryOpts, this.claim);
              },
              didInsertElement: function() {
                var dialogContent;

                this._super();
                return dialogContent = $("#dialogContent");
              },
              width: 700,
              buttons: {
                "Išsaugoti pakeitimus": function() {
                  var DataToSave, changedID, ctrl;

                  changedID = [];
                  ctrl = App.claimDocController;
                  ctrl.vGroup.forEach(function(gr) {
                    return gr.items.forEach(function(item) {
                      if (item.added) {
                        return changedID.push(item.docID);
                      }
                    });
                  });
                  DataToSave = {
                    id: ctrl.activityID,
                    idField: "ActivityID",
                    Field: "DocID",
                    Data: changedID,
                    DataTable: ctrl.relationTbl
                  };
                  SERVER.update2({
                    Action: 'updateRelations',
                    DataToSave: DataToSave,
                    source: ctrl.relationTbl,
                    CallBackAfter: function() {
                      ctrl.refreshDocs();
                      return MY.dialog.ui.close();
                    }
                  });
                  console.log(DataToSave);
                  return oDATA.GET('proc_InsPolicies').emData;
                }
              },
              runFunction: function(t) {
                return t.$().find("div.groupHead input").on("click", function(e) {
                  var groupHead, groupItems;

                  t = $(e.target);
                  groupHead = t.closest("div.groupHead");
                  if (groupHead.length) {
                    return groupItems = groupHead.next().find("input").prop("checked", $(e.target).prop("checked"));
                  }
                });
              },
              cancelLink: true,
              templateName: 'tmpAccidentDocs'
            }).append();
          });
        }
      }).appendTo(this.element);
      Em.run.next(this, function() {
        form = this.element.find("form").data("opts", this.options);
        form.fileupload(this.options);
        return $(".fileupload-progress").addClass("hidden");
      });
      return Em.run.next(this, function() {
        return form.bind('fileuploadadded', function(e, data) {
          var inputCat, opts, tr;

          tr = data.context;
          data.form.find(".submitButtons").removeClass("hidden");
          inputCat = tr.find("input[name='category[]']");
          opts = data.form.data("opts");
          if (data.paramName = "docs[]") {
            return inputCat.ComboBoxCategory(opts);
          } else {
            return console.log("paveikslai");
          }
        }).bind("fileuploadadd", function(e, data) {
          var ext;

          data.files[0].paramName = data.paramName;
          ext = data.files[0].name.split('.').pop().substring(0, 3);
          if (ext === "xls" || ext === "doc" || ext === "pdf") {
            data.files[0].extension = ext;
          } else {
            data.files[0].extension = "unknown";
          }
          return data.files[0].type2 = data.files[0].type.split("/")[0];
        }).bind("fileuploadsubmit", function(e, data) {
          var AccidentID, GroupID, RefID, catInput, f, opts, optsAccident, refGroupID, tr;

          $(".fileupload-progress").removeClass("hidden");
          tr = data.context;
          f = data.files[0];
          opts = data.form.data("opts");
          optsAccident = opts.categoryOpts.accident;
          catInput = tr.find("input[name='category[]']");
          GroupID;
          AccidentID = optsAccident ? optsAccident.iD : null;
          RefID = catInput.data("refID");
          RefID = RefID ? RefID : AccidentID;
          if (catInput.length) {
            GroupID = catInput.data("categoryID");
            GroupID = GroupID ? GroupID : 5;
          } else {
            GroupID = 1;
          }
          if (opts.requireCategory) {
            if (typeof catInput.data("newval") !== "number") {
              oGLOBAL.notify.withIcon("Ne visi dokumentai išsaugoti", "Dokumentas '" + data.files[0].name + "'  neturi priskirtos kategorijos..", "img32-warning", true);
              return false;
            }
          }
          data.formData = {
            FileName: f.name,
            FileSize: f.size,
            DocTypeID: catInput.data("newval"),
            RefID: RefID,
            GroupID: GroupID,
            Description: tr.find("textarea[name='description[]']").val(),
            AccidentID: AccidentID
          };
          refGroupID = opts.lastUpload ? oDATA.GET("tblDocGroup").emData.findProperty("iD", opts.lastUpload.GroupID).ref : {};
          if (data.formData.GroupID === 5) {
            return opts.lastUpload = data.formData;
          } else if (refGroupID !== 5 && refGroupID !== 2) {
            return opts.lastUpload = data.formData;
          }
        }).bind("fileuploaddone", function(e, data) {
          var DataToSave, No, docsContr, docsNo, drv, drvTop, newDoc, opts, refGroupID, source, topDrivers, topVehicles, veh, vehTop;

          if (data.result.success) {
            console.log("Upload result for file '" + data.files[0].name + "':");
            console.log(data.result);
            newDoc = Em.Object.create(data.result.tblDoc);
            oDATA.GET("tblDocs").emData.pushObject(newDoc);
            refGroupID = oDATA.GET('tblDocGroup').emData.findProperty('iD', newDoc.groupID).ref;
            if (refGroupID === 3) {
              drv = oDATA.GET('proc_Drivers').emData.findProperty('iD', newDoc.refID);
              No = parseInt(drv.docs.slice(1, -1), 10);
              if (isNaN(No)) {
                No = 0;
              }
              No++;
              docsNo = '(' + No + ')';
              drv.set('docs', docsNo);
              topDrivers = oDATA.GET('proc_topDrivers');
              if (topDrivers) {
                drvTop = topDrivers.emData.findProperty('iD', newDoc.refID);
                if (drvTop) {
                  drvTop.set('docs', docsNo);
                }
              }
            } else if (refGroupID === 4) {
              veh = oDATA.GET('proc_Vehicles').emData.findProperty('iD', newDoc.refID);
              No = parseInt(veh.docs.slice(1, -1), 10);
              if (isNaN(No)) {
                No = 0;
              }
              No++;
              docsNo = '(' + No + ')';
              veh.set('docs', docsNo);
              topVehicles = oDATA.GET('proc_topVehicles');
              if (topVehicles) {
                vehTop = topVehicles.emData.findProperty('iD', newDoc.refID);
                if (vehTop) {
                  vehTop.set('docs', docsNo);
                }
              }
            }
            opts = data.form.data("opts");
            if (opts.updateRelationsTbl) {
              WAIT_AJAX++;
              DataToSave = JSON.parse(JSON.stringify(opts.updateRelationsTbl));
              source = DataToSave.DataTable;
              DataToSave.Data.push(data.result.tblDoc.iD);
              SERVER.update2({
                Action: "Add",
                DataToSave: DataToSave,
                "source": source,
                CallBackAfter: function(Row) {
                  return WAIT_AJAX--;
                }
              });
            }
            data.context.remove();
            if (!data.form.find("table tbody tr").length) {
              data.form.find(".submitButtons, table, .fileupload-progress").addClass("hidden");
              docsContr = opts.docsController;
              if (opts.updateRelationsTbl) {
                oGLOBAL.helper.execWhen({
                  fnCondition: function() {
                    return WAIT_AJAX === 0;
                  },
                  fnExec: function() {
                    return App[docsContr].refreshDocs();
                  }
                });
              } else {
                App[docsContr].refreshDocs();
              }
              if (opts.lastUpload.AccidentID && opts.refreshTree) {
                App.docsTypesController.refreshTree();
                return Em.run.next({
                  opts: opts
                }, function() {
                  var DocTypeID, lastUpload, node;

                  lastUpload = this.opts.lastUpload;
                  refGroupID = oDATA.GET("tblDocGroup").emData.findProperty("iD", lastUpload.GroupID).ref;
                  DocTypeID = lastUpload.DocTypeID;
                  node = $("#dynamicTree>div>ul").children("li[data-category-id='" + lastUpload.GroupID + "']");
                  if (refGroupID === 4) {
                    node = node.find("ul").children("li.isGroup[data-ref-id='" + lastUpload.RefID + "']");
                  }
                  this.opts.lastUpload = null;
                  return node.trigger("click");
                });
              }
            }
          } else {
            return console.warn("upload error");
          }
        }).find(".fileinput-button").on("click", function() {
          return $(this).closest("form").find("table").removeClass("hidden").end().find("a.cancel").on("click", function() {
            $(this).closest("form").find(".submitButtons, table").addClass("hidden");
            return $(this).closest("form").find("table tbody tr").remove();
          });
        });
      });
    }
  });

  App.editDocsController = Em.Object.create({
    getOpts: function(t) {
      var form;

      form = t.closest("ul").parent().find("form");
      if (!form.length) {
        form = t.closest("ul").closest("table").parent().parent().find("form:first");
      }
      return form.data("opts");
    },
    editDoc: function(e) {
      var t;

      t = $(e.target).parent().parent();
      t.addClass('docs-selected');
      e.context.set("editMode", true);
      return Em.run.next(this, function() {
        return t.find("input.docType").ComboBoxCategory(this.getOpts(t));
      });
    },
    cancelSaveDoc: function(e) {
      var input;

      input = $(e.target).parent().parent().find("input.docType");
      $('.docs-selected').removeClass("docs-selected");
      input.autocomplete("destroy").removeData('autocomplete');
      return e.context.set("editMode", false);
    },
    SaveEditedDoc: function(e) {
      var cont, controller, desc, doc, docID, docTypeID, docTypeVal, groupID, t;

      t = $(e.target).parent().parent();
      desc = t.find("input.description").val();
      docTypeID = t.find("input.docType").data("newval");
      controller = App[this.getOpts(t).docsController];
      docTypeVal = t.find("input.docType").val();
      cont = e.context;
      docID = cont.docID;
      doc = oDATA.GET("tblDocs").emData.findProperty("iD", docID);
      docTypeID = docTypeID ? docTypeID : doc.docTypeID;
      groupID = oDATA.GET("tblDocTypes").emData.findProperty("iD", docTypeID).docGroupID;
      return SERVER.update2({
        "Action": "Edit",
        "Ctrl": t,
        "source": "tblDocs",
        "row": doc,
        DataToSave: {
          "id": docID,
          "Data": [groupID, docTypeID, desc],
          "Fields": ["groupID", "docTypeID", "description"],
          "DataTable": "tblDocs"
        },
        CallBackAfter: function(Row) {
          controller.refreshDocs();
          return $('.docs-selected').removeClass("docs-selected");
        }
      });
    },
    deleteDoc: function(e) {
      var c, controller, t;

      t = $(e.target).parent().parent();
      c = e.context;
      controller = App[this.getOpts(t).docsController];
      return oCONTROLS.dialog.Confirm({
        title: "Dokumento pašalinimas",
        msg: "Ištrinti dokumentą '" + c.docName + "'?"
      }, function() {
        return SERVER.update2({
          "Action": "Delete",
          "Ctrl": t,
          "source": "tblDocs",
          DataToSave: {
            "id": c.docID,
            "DataTable": "tblDocs"
          },
          Msg: {
            Title: "Dokumento pašalinimas",
            Success: "Dokumentas '" + c.docName + "' pašalintas.",
            Error: "Nepavyko pašalinti dokumento '" + c.docName + "'."
          },
          CallBackAfter: function(Row) {
            controller.refreshDocs();
            return $('.docs-selected').removeClass("docs-selected");
          }
        });
      });
    }
  });

}).call(this);

/*
//@ sourceMappingURL=MyPlugins_UploadFiles.map
*/
