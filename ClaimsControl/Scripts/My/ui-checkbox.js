
/*
* jQuery UI Checkbox @VERSION
*
* Copyright (c) 2010 AUTHORS.txt (http://jqueryui.com/about)
* Dual licensed under the MIT (MIT-LICENSE.txt)
* and GPL (GPL-LICENSE.txt) licenses.
*
* {{TODO replace with docs link once plugin is released}}
* http://wiki.jqueryui.com/Checkbox
* {{/TODO}}
*
* Depends:
*   jquery.ui.core.js
*   jquery.ui.widget.js
*/
(function ($) {
	var checkboxId = 0;
	$.widget("ui.checkbox", {
		version: "@VERSION",
		options: {
			disabled: null
		},
		_create: function () {
			var that = this;
			// look for label as container of checkbox
			this.labelElement = this.element.closest("label");
			if (this.labelElement.length) {
				// move the checkbox outside (before) the label
				this.element.insertBefore(this.labelElement);
				// the checkbox needs an id since it's no longer inside the label
				if (!this.element.attr("id")) {
					this.element.attr("id", "ui-checkbox-" + checkboxId);
					checkboxId += 1;
				}
				// associate label by for=id of checkbox
				this.labelElement.attr("for", this.element.attr("id"));
			} else {
				// look for label by for=id of checkbox
				this.labelElement = $(this.element[0].ownerDocument).find("label[for=" + this.element.attr("id") + "]");
			}
			// wrap the checkbox in two new divs
			// move the checkbox's label inside the outer new div
			this.checkboxElement = this.element.wrap("<div class='ui-checkbox-inputwrapper'></div>").parent().wrap("<div></div>").parent()
			.addClass("ui-checkbox")
			.append(this.labelElement);
			this.boxElement = $("<div class='ui-checkbox-box ui-widget ui-state-active ui-corner-all'><span class='ui-checkbox-icon'></span></div>");
			this.iconElement = this.boxElement.children(".ui-checkbox-icon");
			this.checkboxElement.append(this.boxElement);
			//Em.run.next( this,function(){

			// this.element.on("click.checkbox", function(e) {
			// console.log("after checkbox check " + $(this).is(":checked"));
			// that._refresh();
			// if (that.options.onClick){
			// that.options.onClick($(e.target));
			// }
			// });
			this.element.closest("div.ui-checkbox").on("click.checkbox", function (e) {//"input:checkbox,a",
				var chk = $(e.target).closest("div.ui-checkbox").find("input:checkbox");
				console.log($(e.target));
				console.log("chk before:" + chk.attr("checked"));
				//panaikinam kas visus kas yra fieldsete
				chk.closest("fieldset").find("input:checkbox").not(chk).removeAttr("checked").parent().next().next().find("span.ui-checkbox-icon").removeClass("ui-icon ui-icon-check").attr("aria-checked", "false");
				//togglinam pasirinkta
				chk.attr("checked", !chk.attr("checked")).parent().next().next().find("span.ui-checkbox-icon").toggleClass("ui-icon ui-icon-check").attr("aria-checked", chk.attr("checked"));
				console.log("chk after:" + chk.attr("checked"));
				if (that.options.onClick) {
					that.options.onClick(chk);
				}
				return false;
			});
			// this.element.closest("div.ui-checkbox").on("click.checkbox", function(e) { //negali būt naudojamas su Emberio action, kuris iškerta šitą eventą
			// var chk=$(e.target).closest("div.ui-checkbox").find("input:checkbox");//$(e.target).parent().find(":checkbox");
			// console.log("Was clicked "+e.target.tagName.toLowerCase()+", check:"+chk.is(":checked"));	
			// //if ($.browser.msie&&chk.is(":checked")) return;
			// console.log("aš viduj ----------------------checkbox:"+chk.is(":checked"))

			// if (chk.is(":checked")){chk.removeAttr("checked");}
			// else{chk.attr("checked","checked");	}		
			// chk.trigger("click");
			// console.log("checkbox now " + chk.is(":checked"));			
			// });
			this.element.on("focus.checkbox", function () {
				if (that.options.disabled) {
					return;
				}
				that.boxElement
				.removeClass("ui-state-active")
				.addClass("ui-state-focus");
			});
			this.element.on("blur.checkbox", function () {
				if (that.options.disabled) {
					return;
				}
				that.boxElement
				.removeClass("ui-state-focus")
				.not(".ui-state-hover")
				.addClass("ui-state-active");
			});
			this.checkboxElement.on("mouseover.checkbox", function () {
				if (that.options.disabled) {
					return;
				}
				that.boxElement
				.removeClass("ui-state-active")
				.addClass("ui-state-hover");
			});
			this.checkboxElement.on("mouseout.checkbox", function () {
				if (that.options.disabled) {
					return;
				}
				that.boxElement
				.removeClass("ui-state-hover")
				.not(".ui-state-focus")
				.addClass("ui-state-active");
			});
			if (this.element.is(":disabled")) {
				this._setOption("disabled", true);
			}
			this._refresh();
			//}
		},
		_refresh: function (e) {
			var checked = this.element.is(":checked");
			this.iconElement.toggleClass("ui-icon ui-icon-check", checked).attr("aria-checked", checked);
		},
		widget: function () {
			return this.checkboxElement;
		},
		destroy: function () {
			this.boxElement.remove();
			this.checkboxElement
			.after(this.labelElement).end();
			this.element
			.unwrap("<div></div>")
			.unwrap("<div></div>");

			$.Widget.prototype.destroy.apply(this, arguments);
		},
		_setOption: function (key, value) {
			if (key === "disabled") {
				this.element
				.attr("disabled", value);
				this.checkboxElement
				[value ? "addClass" : "removeClass"]("ui-checkbox-disabled");
			}

			$.Widget.prototype._setOption.apply(this, arguments);
		}
	});
} (jQuery));

