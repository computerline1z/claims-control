//@ sourceMappingURL=MyPlugins_UploadFiles.map
// Generated by CoffeeScript 1.6.1
(function() {
  var w=window, $=w.jQuery, App=w.App, Em=w.Em;;
  $.widget("ui.UploadFiles", {
    options: {
      uploadTemplateId: "tmp2templateUpload",
      downloadTemplateId: "tmp2templateDownload",
      formTemplate: "tmpUploadForm",
      showPhoto: true,
      docsController: "treeDocController",
      url: "Files/Start",
      fileuploaddone: function() {
        return console.log("opa");
      },
      categoryOpts: {
        editList: true
      },
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
        showPhoto: this.options.showPhoto
      }).appendTo(this.element);
      Em.run.next(this, function() {
        form = this.element.find("form").data("opts", this.options);
        return form.fileupload(this.options);
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
          var AccidentID, GroupID, RefID, catInput, f, optsAccident, tr;
          tr = data.context;
          f = data.files[0];
          optsAccident = data.form.data("opts").categoryOpts.accident;
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
          if (data.form.data("opts").requireCategory) {
            if (typeof catInput.data("newval") !== "number") {
              oGLOBAL.notify.withIcon("Ne visi dokumentai išsaugoti", "Dokumentas '" + data.files[0].name + "'  neturi priskirtos kategorijos..", "img32-warning", true);
              return false;
            }
          }
          return data.formData = {
            FileName: f.name,
            FileSize: f.size,
            DocTypeID: catInput.data("newval"),
            RefID: RefID,
            GroupID: GroupID,
            Description: tr.find("textarea[name='description[]']").val(),
            AccidentID: AccidentID
          };
        }).bind("fileuploaddone", function(e, data) {
          var No, docRef, docsContr, docsNo, drv, drvTop, newDoc, topDrivers, topVehicles, veh, vehTop;
          if (data.result.success) {
            console.log("Upload result for file '" + data.files[0].name + "':");
            console.log(data.result);
            newDoc = Em.Object.create(data.result.tblDoc);
            oDATA.GET("tblDocs").emData.pushObject(newDoc);
            docRef = oDATA.GET('tblDocGroup').emData.findProperty('iD', newDoc.groupID).ref;
            if (docRef === 3) {
              drv = oDATA.GET('proc_Drivers').emData.findProperty('iD', newDoc.refID);
              No = parseInt(drv.docs.slice(1, -1), 10);
              if (isNaN(No)) {
                console.error("NaN");
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
            } else if (docRef === 4) {
              veh = oDATA.GET('proc_Vehicles').emData.findProperty('iD', newDoc.refID);
              No = parseInt(veh.docs.slice(1, -1), 10);
              if (isNaN(No)) {
                console.error("NaN");
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
            data.context.remove();
            if (!data.form.find("table tbody tr").length) {
              data.form.find(".submitButtons, table").addClass("hidden");
              docsContr = data.form.data("opts").docsController;
              return App[docsContr].refreshDocs();
            }
          } else {
            return console.log("erroras");
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
            Title: "Duokumento pašalinimas",
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
