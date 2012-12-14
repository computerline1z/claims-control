// Generated by CoffeeScript 1.4.0
(function() {
  var $ = window.jQuery;

  $.widget("ui.UploadFiles", {
    options: {
      uploadTemplateId: "tmp2templateUpload",
      downloadTemplateId: "tmp2templateDownload",
      formTemplate: "tmpUploadForm",
      url: "Files/Start",
      fileuploaddone: function() {
        return console.log("opa");
      },
      categoryOpts: {
        editList: true
      },
      ListType: "List",
      Source: "tblDocType",
      iVal: "iD",
      iText: ["name"]
    },
    _create: function() {
      Em.View.create({
        templateName: this.options.formTemplate
      }).appendTo(this.element);
      return Em.run.next(this, function() {
        var form;
        form = this.element.find("form").data("opts", this.options);
        return form.fileupload(this.options).bind('fileuploadadded', function(e, data) {
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
          var GroupID, RefID, catInput, f, optsAccident, tr;
          tr = data.context;
          f = data.files[0];
          optsAccident = data.form.data("opts").categoryOpts.accident;
          catInput = tr.find("input[name='category[]']");
          RefID = catInput.data("refID");
          RefID = RefID ? RefID : null;
          GroupID = catInput.data("categoryID");
          GroupID = GroupID ? GroupID : null;
          if (typeof catInput.data("newval") !== "number") {
            oGLOBAL.notify.withIcon("Ne visi dokumentai išsaugoti", "Dokumentas '" + data.files[0].name + "'  neturi priskirtos kategorijos..", "img32-warning", true);
            return false;
          }
          return data.formData = {
            FileName: f.name,
            FileSize: f.size,
            DocTypeID: catInput.data("newval"),
            RefID: RefID,
            GroupID: GroupID,
            Description: tr.find("textarea[name='description[]']").val(),
            AccidentID: optsAccident ? optsAccident.iD : null
          };
        }).bind("fileuploaddone", function(e, data) {
          if (data.result.success) {
            console.log("Upload result for file '" + data.files[0].name + "':");
            console.log(data.result);
            data.context.remove();
            if (data.form.find("table tbody tr").length === 0) {
              return data.form.find(".submitButtons, table").addClass("hidden");
            }
          } else {
            return console.log("erroras");
          }
        }).find(".fileinput-button").on("click", function() {
          return $(this).closest("form").find("table").removeClass("hidden").end().find("button.cancel").on("click", function() {
            $(this).closest("form").find(".submitButtons, table").addClass("hidden");
            console.log("Removing tr");
            console.log($(this).closest("form").find("table tbody tr"));
            return $(this).closest("form").find("table tbody tr").remove();
          });
        });
      });
    },
    _refresh: function() {
      return this._trigger("change");
    },
    _destroy: function() {
      this.changer.remove();
      return this.element.removeClass("custom-colorize").enableSelection().css("background-color", "transparent");
    }
  });

}).call(this);
