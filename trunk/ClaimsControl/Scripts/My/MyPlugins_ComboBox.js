// Generated by CoffeeScript 1.6.2
(function() {
  var $ = window.jQuery;  $.widget("ui.ComboBox", {
    options: {
      ListType: "List",
      Editable: {
        EditThis: false,
        EditList: false
      },
      selectFirst: false,
      Value: "",
      mapWithNoCommas: false,
      addNewIfNotExists: false
    },
    _create: function() {
      var data, fnEditItem, fnSetData, id, input, opt;

      input = $(this.element[0]);
      if (input.length === 0) {
        console.error("Input not found for ComboBox!");
      }
      opt = $.extend(true, this.options, input.data("ctrl"));
      if (opt.Source === "proc_Drivers") {
        opt.mapWithNoCommas = true;
      }
      fnEditItem = function(id, newVals, e) {
        var Action, pars, template;

        id = parseInt(id, 10);
        Action = id ? "Edit" : "Add";
        template = opt.Source === "proc_InsPolicies_forThisAccident" ? "tmp_InsPolicies" : opt.Source.replace("proc_", "tmp_");
        pars = {
          source: opt.Source,
          template: template,
          row: id ? oDATA.GET(opt.Source).emData.findProperty("iD", id) : 0,
          Action: (id ? "Edit" : "Add"),
          newVals: newVals ? {
            vals: newVals,
            cols: opt.iText
          } : null,
          input: e ? $(e.target) : null,
          CallBackAfter: function(Row) {
            return dialogFrm.dialog("close");
          }
        };
        App.listAllController.openItem(pars);
        return false;
      };
      data = void 0;
      fnSetData = function() {
        var OptVal, fn;

        OptVal = parseInt(opt.Value, 10);
        if (opt.data) {
          data = opt.data();
        } else {
          fn = function(a) {
            if (opt.excludeFromList) {
              if (opt.excludeFromList.ValueInMe(a.iD)) {
                return null;
              }
            }
            if (a.iD === OptVal) {
              input.val(a.MapArrToString(opt.iText, opt.mapWithNoCommas, opt.Source));
            }
            return {
              id: a[opt.iVal],
              label: a.MapArrToString(opt.iText, opt.mapWithNoCommas, opt.Source)
            };
          };
          data = $.map(oDATA.GET(opt.Source).emData, function(a) {
            return fn(a);
          });
        }
        if (opt.Editable.EditList) {
          data[data.length] = {
            id: -1,
            value: "Redaguoti sąrašą",
            label: "Redaguoti sąrašą"
          };
        }
        if (opt.Editable.AddNew) {
          return data[data.length] = {
            id: -2,
            value: "Įvesti naują",
            label: "Įvesti naują"
          };
        }
      };
      fnSetData();
      $(input).on('keyup', function() {
        return $(this).parent().find("span.ui-menu-icon").remove();
      }).data("newval", opt.Value).autocomplete({
        selectFirst: opt.selectFirst,
        delay: 0,
        minLength: (this.options.ListType === "None" ? 2 : 0),
        autoFocus: true,
        fnRefresh: function() {
          if (input.data("newval")) {
            opt.Value = input.data("newval");
          }
          fnSetData();
          if (opt.Editable.EditThis && input.data("newval") && opt.ListType === "None") {
            return input.after("<i title='redaguoti..' class='img18-pencil ui-menu-icon'></i>");
          }
        },
        source: function(request, response) {
          return response($.ui.autocomplete.filter(data, request.term));
        },
        select: function(event, ui) {
          var ctrl, isPencil;

          if (typeof ui.item.id === "function") {
            ui.item.id();
            return false;
          }
          if (ui.item.id === -1) {
            App.listAllController.editListItems(input, event);
          } else if (ui.item.id === -2) {
            fnEditItem(0, null, event);
            return false;
          }
          ctrl = input.next().next("span");
          isPencil = ctrl.hasClass("img18-pencil");
          if (ui.item.id === 0 && isPencil) {
            ctrl.css("display", "none");
          } else if (isPencil) {
            ctrl.css("display", "block");
          }
          if ($(event.srcElement).hasClass("ui-menu-icon")) {
            input.data("autocomplete").fnClickOnBtn({
              id: ui.item.id,
              elm: $(event.srcElement),
              fromInput: false
            });
            return false;
          }
          if (ui.item) {
            if (ui.item.id !== $(this).data("newval")) {
              $(this).data("newval", ui.item.id).val(ui.item.value);
              if (input.data("autocomplete").fnItemChanged) {
                input.data("autocomplete").fnItemChanged(ui.item.id);
              }
            }
            if (ui.item.refID) {
              $(this).data("refID", ui.item.refID);
              $(this).data("categoryID", ui.item.categoryID);
              false;
            }
            if (opt.fnChangeCallBack) {
              return opt.fnChangeCallBack(event, ui);
            }
          }
        },
        change: function(event, ui) {
          var t;

          if (!ui.item) {
            fnEditItem(0, input.val(), event);
            t = $(this);
            t.data("newval", "");
            if (opt.Type === "List") {
              t.val("");
            }
            if (typeof input.data("autocomplete") !== "undefined") {
              input.data("autocomplete").term = "";
            }
            return false;
          }
        },
        close: function(event, ui) {
          return false;
        },
        open: function() {
          var acData, termTemplate;

          if (opt.Editable.EditList || opt.Editable.AddNew) {
            $('ul.ui-autocomplete:visible').find("a:last").addClass("actionLink");
          }
          if (opt.ListType === "None" || opt.ListType === "Combo") {
            acData = $(this).data("autocomplete");
            termTemplate = "<span style=\"color:red\">%s</span>";
            return acData.menu.element.find("a").each(function() {
              var me, regex;

              me = $(this);
              regex = new RegExp(acData.term, "gi");
              return me.html(me.text().replace(regex, function(matched) {
                return termTemplate.replace("%s", matched);
              }));
            });
          }
        }
      });
      $(".ui-autocomplete-input").live("autocompleteopen", function() {
        var autocomplete, menu;

        autocomplete = $(this).data("autocomplete");
        menu = autocomplete.menu;
        if (!autocomplete.options.selectFirst) {
          return;
        }
        return menu.activate($.Event({
          type: "mouseenter"
        }), menu.element.children().first());
      });
      if (opt.Editable.EditThis) {
        id = $(this).data("newval");
        id = (id ? id : 0);
        opt.appendToList = "<i title='redaguoti..' class='img18-pencil ui-menu-icon'></i>";
        input.after(opt.appendToList);
        input.data("autocomplete").fnClickOnBtn = function(p) {
          var Action, c, msg, oData, val;

          Action = p.elm.hasClass("img18-pencil") ? "Edit" : "Delete";
          oData = oDATA.GET(opt.Source);
          if (p.elm.hasClass("img18-pencil")) {
            return fnEditItem(p.id);
          } else {
            val = oData.Data.findValueByID(p.id).MapArrToString(input.data("ctrl").iText, true);
            c = oData.Config.Msg.Delete;
            msg = c + " <b>\"" + val + "\"</b>?";
            return oCONTROLS.dialog.Confirm({
              title: c,
              msg: msg
            }, function() {
              return SERVER.update({
                Action: "Delete",
                DataToSave: {
                  id: p.id,
                  DataTable: oData.Config.tblUpdate
                },
                Msg: {
                  Title: "Duomenų ištrynimas",
                  Success: oData.Config.Msg.GenName + " " + val + " buvo pašalintas.",
                  Error: oData.Config.Msg.Delete + " " + val + " nepavyko."
                },
                CallBack: {
                  Success: function(resp, updData) {
                    if (data.findObjectByProperty("id", p.id).label === input.val()) {
                      input.val("").parent().find("span.ui-menu-icon").remove();
                    }
                    oData.Data.removeRowByID(p.id);
                    data.removeRowByProperty("id", p.id);
                    return input.autocomplete("search", input.val());
                  }
                }
              });
            });
          }
        };
        input.parent().on("click", "span.ui-menu-icon,i.ui-menu-icon", function() {
          var e;

          e = $(this);
          id = e.parent().find("input").data("newval");
          return input.data("autocomplete").fnClickOnBtn({
            id: id,
            elm: e,
            fromInput: true
          });
        });
      }
      if (opt.ListType !== "None") {
        this.addButton({
          Editable: opt.Editable,
          title: "Parodyti visus",
          icon: "ui-icon-triangle-1-s",
          fn: function() {
            if (input.autocomplete("widget").is(":visible")) {
              input.autocomplete("close");
              return;
            }
            input.autocomplete("search", "");
            input.focus();
            return false;
          }
        }, input);
      }
      if (opt.ListType === "List") {
        return input.click(function() {
          if (input.autocomplete("widget").is(":visible")) {
            input.autocomplete("close");
            return false;
          }
          input.autocomplete("search", "");
          input.focus();
          return false;
        });
      } else {
        return input.click(function() {
          return this.select();
        });
      }
    },
    addButton: function(p, input) {
      var height, w;

      height = input.outerHeight() !== 0 ? "style='height:" + input.outerHeight() + "px;'" : "";
      this.button = $("<button " + height + " class='drop-down'>&nbsp;</button>").attr("tabIndex", -1).attr("title", p.title).insertAfter(input).button({
        icons: {
          primary: p.icon
        },
        text: false
      }).click(function() {
        p.fn();
        return false;
      }).removeClass("ui-corner-all").find("span").attr("class", "");
      if (p.icon === "img18-plus") {
        this.button.removeClass("ui-button-icon-primary ui-icon").css("margin", "-2px 0 0 -8px");
      }
      console.log("opa opa");
      if (p.Editable.EditThis) {
        w = input.prev().width() - 26 + 'px';
        return input.css("width", w);
      }
    },
    destroy: function() {
      return $.Widget.prototype.destroy.call(this);
    }
  });

  $.widget("ui.ComboBoxCategory", $.ui.ComboBox, {
    _create: function() {
      var categoryOpts, editList, emCategories, fnGetData, opts, renderGroup, widget;

      opts = this.options;
      opts.element = this.element;
      categoryOpts = opts.categoryOpts;
      if (categoryOpts.showCategories) {
        emCategories = categoryOpts.showCategories;
      } else {
        emCategories = oDATA.GET("tblDocGroup").emData;
      }
      if (!App.docsTypesController) {
        App.create_docsTypesController();
      }
      fnGetData = function() {
        var emTypes;

        emTypes = oDATA.GET("tblDocTypes").emData;
        return $.map.call(this, emTypes, function(a) {
          return {
            id: a[opts.iVal],
            label: a.MapArrToString(opts.iText, opts.mapWithNoCommas),
            categoryID: a["docGroupID"]
          };
        });
      };
      editList = function(opts) {
        var dialogID;

        dialogID = "dialog" + (+(new Date));
        return MY[dialogID] = JQ.Dialog.create({
          dialogID: dialogID,
          title: "Redaguoti sąrašą",
          title2: "Dokumentų tipai",
          saveData: function(p) {
            var Source, docGroupID;

            Source = App.docsTypesController.docTypes;
            docGroupID = p.row.docGroupID;
            $.extend(p, {
              "Ctrl": $("#" + this.dialogID),
              "source": "tblDocTypes",
              CallBackAfter: function(Row) {
                if (p.Action === "Edit") {
                  Source.findProperty("iD", Row.iD).set("edit", false);
                }
                if (p.Action === "Add") {
                  MY.dialog.set("addNewType" + Row.docGroupID, false);
                }
                App.docsTypesController.init();
                opts.element.closest("table").find("input").autocomplete('option', 'source', opts.data());
                console.log("New Row");
                return console.log(Row);
              }
            });
            SERVER.update2(p);
            return false;
          },
          editDocType: function(e) {
            return e.context.set("edit", e.context.name);
          },
          cancelDocType: function(e) {
            return e.context.set("edit", false);
          },
          saveDocType: function(e) {
            var Msg, input, row, type, val;

            type = e.context.name;
            input = $(e.target).prev();
            val = input.val();
            row = e.context;
            row.name = val;
            if (type.length > 2) {
              Msg = {
                Title: this.title2,
                Success: "Dokumento tipas '" + type + "' pakeistas.",
                Error: "Nepavyko pakeisti tipo '" + type + "'."
              };
              return this.saveData({
                DataToSave: {
                  "id": row.iD,
                  "Data": [row.name],
                  "Fields": ["Name"],
                  "DataTable": "tblDocTypes"
                },
                Msg: Msg,
                row: row,
                Action: "Edit"
              });
            } else {
              return e.context.set("name", e.context.edit).set("edit", false);
            }
          },
          deleteDocType: function(e) {
            var me, type;

            type = e.context.name;
            me = this;
            return oCONTROLS.dialog.Confirm({
              title: this.title2,
              msg: "Ištrinti tipą '" + type + "'?"
            }, function() {
              var Msg, row;

              Msg = {
                Title: me.title2,
                Success: "Dokumento tipas '" + type + "' ištrintas.",
                Error: "Nepavyko ištrinti tipo '" + type + "'."
              };
              row = e.context;
              return me.saveData({
                DataToSave: {
                  "id": row.iD,
                  "DataTable": "tblDocTypes"
                },
                Msg: Msg,
                row: row,
                Action: "Delete"
              });
            });
          },
          addNewDocType: function(e) {
            return this.set("addNewType" + $(e.target).data("category-id"), true);
          },
          cancelNewDocType: function(e) {
            return this.set("addNewType" + $(e.target).data("category-id"), false);
          },
          saveNewDocType: function(e) {
            var Msg, docGroupID, input, val;

            input = $(e.target).prev();
            val = input.val();
            docGroupID = input.data("category-id");
            Msg = {
              Title: this.title2,
              Success: "Dokumento tipas '" + val + "' pridėtas.",
              Error: "Nepavyko pridėt tipo '" + val + "'"
            };
            return this.saveData({
              DataToSave: {
                "Data": [val, docGroupID],
                "Fields": ["Name", "DocGroupID"],
                "DataTable": "tblDocTypes"
              },
              Msg: Msg,
              row: [val, docGroupID],
              Action: "Add"
            });
          },
          closeDialog: function(e) {
            $("#" + this.dialogID).dialog("close");
            return false;
          },
          width: 600,
          templateName: 'tmpDocTypes'
        }).append();
      };
      $.extend(true, this.options, {
        data: fnGetData,
        editList: editList
      });
      this._super();
      renderGroup = function(me, ul, myCategory, docTypes, categoryID) {
        var currentTypes;

        currentTypes = docTypes.filter(function(type) {
          return type.categoryID === categoryID;
        });
        return myCategory.forEach(function(category) {
          ul.append("<li class='ui-autocomplete-category'>" + category.title + "</li>");
          return currentTypes.forEach(function(type, i) {
            var typeClone;

            typeClone = $.extend({}, type, {
              refID: category.iD
            });
            return me._renderItemData(ul, typeClone);
          });
        });
      };
      widget = this;
      return this.element.data("autocomplete")._renderMenu = function(ul, docTypes) {
        var currentCategoryID, me;

        me = this;
        currentCategoryID = "";
        emCategories.forEach(function(catItem, i) {
          if (catItem.ref === 0) {

          } else if (catItem.ref === 1) {
            return me._renderItemData(ul, {
              id: 0,
              label: "Nuotrauka",
              value: "Nuotrauka",
              categoryID: 1,
              refID: categoryOpts.accident.iD
            });
          } else if (catItem.ref === 3 && categoryOpts.driver) {
            return renderGroup(me, ul, [categoryOpts.driver], docTypes, catItem.iD);
          } else if (catItem.ref === 4 && categoryOpts.vehicles) {
            return renderGroup(me, ul, categoryOpts.vehicles, docTypes, catItem.iD);
          } else if (catItem.ref === 2 && categoryOpts.accident) {
            return renderGroup(me, ul, [categoryOpts.accident], docTypes, catItem.iD);
          }
        });
        if (categoryOpts.editList) {
          me._renderItemData(ul, {
            id: function(target) {
              return widget.options.editList(widget.options);
            },
            label: "Redaguoti sarašą",
            value: "Redaguoti sarašą"
          });
          return ul.find("li:last a").addClass("actionLink");
        }
      };
    }
  });

  $.widget("my.sortableGrid", {
    _create: function() {
      this.ctrl = this.options.controller;
      this.element[0].innerHTML = "<table class='zebra-striped'><thead></thead><tbody></tbody><table>";
      this.updateGrid(true);
      return false;
    },
    updateGrid: function(updateAll) {
      var cont, el, f, last, len;

      f = this.ctrl.fields;
      cont = this.ctrl.content;
      el = this.element;
      len = f.length;
      last = len - 1;
      if (updateAll) {
        el.find('thead')[0].innerHTML = this._getHead(f, last);
        this._appendHandler();
      }
      el.find('tbody')[0].innerHTML = this._getBody(f, cont);
      return false;
    },
    _getHead: function(f, last) {
      var thead;

      thead = "<tr>";
      f.forEach(function(col, i) {
        if (col.visible) {
          thead += "<th data-name='";
          thead += col.name;
          thead += "'>";
          thead += col.title;
          return thead += (i !== last ? "</th>" : "</th><tr>");
        }
      });
      return thead;
    },
    _getBody: function(f, cont) {
      var last, tbody;

      tbody = "";
      last = 0;
      f.forEach(function(v, i) {
        if (v.visible) {
          return last = i;
        }
      });
      cont.forEach(function(row) {
        tbody += "<tr><td>";
        return f.forEach(function(col, i) {
          if (col.visible) {
            tbody += row[col.name];
            return tbody += (i !== last ? "</td><td>" : "</td></tr>");
          }
        });
      });
      return tbody;
    },
    _appendHandler: function() {
      var base, cl, ctrl, me, n, newClass, ns, s, sortCols, span, thead;

      span = '<span class="ui-icon ui-icon-carat-2-n-s ui-tblHead-icon"></span>';
      newClass = "";
      me = this;
      ctrl = this.ctrl;
      n = "ui-icon-carat-1-n";
      s = "ui-icon-carat-1-s";
      ns = "ui-icon-carat-2-n-s";
      base = "ui-icon ui-tblHead-icon";
      thead = this.element.find("thead").find("th").addClass("clickable").append(span).end().on("click", "th", function(e) {
        var newContent, t, thisClass, thisSpan;

        t = $(this);
        thisSpan = t.find("span");
        thisClass = thisSpan.attr("class");
        if (thisClass.indexOf(n) > -1) {
          newClass = s;
        } else {
          newClass = n;
        }
        thisSpan.attr("class", newClass + " " + base);
        t.siblings().find("span").attr("class", ns + " " + base);
        if (newClass === n) {
          ctrl.set("sortAscending", true);
        } else {
          ctrl.set("sortAscending", false);
        }
        ctrl.set("sortProperties", [t.data("name")]);
        newContent = ctrl.get("arrangedContent");
        ctrl.set("content", newContent);
        return Em.run.next(me, function() {
          return this.updateGrid(false);
        });
      });
      sortCols = ctrl.get("sortProperties");
      if (sortCols.length > 0) {
        cl = ctrl.sortAscending ? n : s;
        thead.find("th").filter("[data-name='" + sortCols[0] + "']").find("span").attr("class", cl + " " + base);
      }
      return false;
    },
    _setOption: function(key, value) {
      this.options[key] = value;
      return this._update();
    },
    destroy: function() {
      return $.Widget.prototype.destroy.call(this);
    }
  });

}).call(this);

/*
//@ sourceMappingURL=MyPlugins_ComboBox.map
*/
