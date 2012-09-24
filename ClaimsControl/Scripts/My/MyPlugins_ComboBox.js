// Generated by CoffeeScript 1.3.3
(function() {
  var $ = window.jQuery;

  $.widget("ui.ComboBox", {
    options: {
      ListType: "List",
      Editable: {
        Add: false,
        Edit: false
      },
      selectFirst: false,
      Value: "",
      mapWithNoCommas: false,
      addNewIfNotExists: false
    },
    _create: function() {
      var Editable, OptVal, data, fnEditItem, id, input, opt, val;
      input = $(this.element[0]);
      if (input === undefined) {
        alert("Error! Input not found for ComboBox! (MyPlugins_ComboBox:15)");
      }
      opt = $.extend(true, this.options, $(input).data("ctrl"));
      if (opt.Source === "proc_Drivers") {
        opt.mapWithNoCommas = true;
      }
      fnEditItem = function(id, newVals) {
        return new oGLOBAL.clsEditableForm({
          newVals: newVals ? {
            vals: newVals,
            cols: opt.iText
          } : null,
          objData: opt.Source,
          Action: (id ? "Edit" : "Add"),
          aRowData: (id ? oDATA.GetRow(id, opt.Source) : 0),
          CallBackAfter: function(RowData) {
            var newVal;
            $(input).data("newval", RowData[opt.iVal]);
            newVal = RowData.MapArrToString(opt.iText, opt.mapWithNoCommas);
            $(input).val(newVal);
            if (this.Action === "Edit") {
              data.findObjectByProperty("id", RowData[opt.iVal]).label = newVal;
            } else {
              data.push({
                id: RowData[opt.iVal],
                label: newVal
              });
            }
            if (!input.parent().find("span.ui-menu-icon").length && opt.appendToList) {
              return input.parent().append(opt.appendToList);
            }
          }
        });
      };
      Editable = (opt.Editable.Add || opt.Editable.Edit ? true : false);
      data = void 0;
      OptVal = parseInt(opt.Value, 10);
      data = $.map(oDATA.GET(opt.Source).emData, function(a) {
        if (a.iD === OptVal) {
          input.val(a.MapArrToString(opt.iText, opt.mapWithNoCommas));
        }
        return {
          id: a[opt.iVal],
          label: a.MapArrToString(opt.iText, opt.mapWithNoCommas)
        };
      });
      if (typeof opt.Append !== "undefined") {
        data[data.length] = opt.Append;
      }
      $(input).on('keyup', function() {
        return $(this).parent().find("span.ui-menu-icon").remove();
      }).data("newval", opt.Value).autocomplete({
        selectFirst: opt.selectFirst,
        delay: 0,
        minLength: (this.options.ListType === "None" ? 2 : 0),
        autoFocus: true,
        source: function(request, response) {
          return response($.ui.autocomplete.filter(data, request.term));
        },
        select: function(event, ui) {
          if ($(event.srcElement).hasClass("ui-menu-icon")) {
            input.data("autocomplete").fnClickOnBtn({
              id: ui.item.id,
              elm: $(event.srcElement),
              fromInput: false
            });
            return false;
          }
          if (ui.item) {
            if (!$(event.target).parent().find("span.ui-menu-icon").length && opt.appendToList) {
              $(event.target).parent().append(opt.appendToList);
            }
            if (ui.item.id !== $(this).data("newval")) {
              $(this).data("newval", ui.item.id).val(($(this).data("ctrl").Type === "List" ? ui.item.value : ui.item.label));
              if (opt.fnChangeCallBack) {
                MY.execByName(opt.fnChangeCallBack, MY, this, ui.item);
              }
              return false;
            }
          }
        },
        change: function(event, ui) {
          var t;
          if (!ui.item) {
            fnEditItem(0, input.val());
            if (opt.fnChangeCallBack) {
              MY.execByName(opt.fnChangeCallBack, MY, this, null);
            }
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
          var newVal, t;
          if (opt.Editable.Edit) {
            t = input;
            newVal = t.data("newval");
          }
          if (opt.fnValueChanged && input.data("newval")) {
            return opt.fnValueChanged(input.data("newval"), input.val());
          }
        },
        open: function() {
          var acData, termTemplate;
          if (!(opt.ListType !== "List" ? input.hasClass("activeField") : void 0)) {
            input.addClass("activeField");
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
      if (opt.addNewIfNotExists) {
        input.on("blur", function() {
          return alert("opa");
        });
      }
      if (opt.Editable.Edit) {
        val = input.data("newval");
      }
      if (opt.ListType !== "None" || opt.Editable.Add) {
        input.removeClass("ui-corner-all").addClass("ui-corner-left");
      }
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
      $(input).data("autocomplete")._renderItem = function(ul, item) {
        var toAdd;
        toAdd = "<a> " + item.value + "</a>";
        return $("<li></li>").data("item.autocomplete", item).append(toAdd).appendTo(ul);
      };
      if (opt.Editable.Add) {
        id = $(this).data("newval");
        id = (id ? id : 0);
        opt.appendToList = "<span style='margin:-24px 4px auto auto;' title='redaguoti..' class='ui-icon ui-icon-pencil ui-menu-icon'>&nbsp;</span>";
        input.after(opt.appendToList);
        input.data("autocomplete").fnClickOnBtn = function(p) {
          var Action, c, msg, oData;
          Action = p.elm.hasClass("ui-icon-pencil") ? "Edit" : "Delete";
          oData = oDATA.GET(opt.Source);
          if (p.elm.hasClass("ui-icon-pencil")) {
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
        input.parent().on("click", "span.ui-menu-icon", function() {
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
          },
          NoCorners: (opt.Editable.Add ? true : false)
        }, input);
      }
      if (opt.ListType === "List") {
        input.attr("readonly", true);
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
      this.button = $("<button style='margin:0 0 0 -2.2em;height:" + input.outerHeight() + "px;'>&nbsp;</button>").attr("tabIndex", -1).attr("title", p.title).insertAfter(input).button({
        icons: {
          primary: p.icon
        },
        text: false
      }).click(function() {
        p.fn();
        return false;
      }).removeClass("ui-corner-all").addClass("ui-button-icon" + (p.NoCorners ? "" : " ui-corner-right")).find("span.ui-icon");
      if (p.icon === "img18-plus") {
        this.button.removeClass("ui-button-icon-primary ui-icon").css("margin", "-2px 0 0 -8px");
      }
      if ($.browser.mozilla) {
        return this.button.css("margin", "0");
      }
    },
    destroy: function() {
      return $.Widget.prototype.destroy.call(this);
    }
  });

}).call(this);
