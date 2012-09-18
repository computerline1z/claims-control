Handlebars.registerHelper('highlight', function (prop, options) {
	var value = Ember.getPath(this, prop);
	return new Handlebars.SafeString('<span class="highlight">' + value + '</span>');
});
Handlebars.registerHelper('checkOut', function (prop, options) {
	var value = Ember.getPath(this, prop);
        console.log("opa");
	return new Handlebars.SafeString('<span class="highlight">' + value + '</span>');
});

Handlebars.registerHelper('updatableField', function (prop, options) {
	var err = "updatableField helper ";
	var f = options.hash['Field'];
	if (!f) throw new Error(err + "did not found Field");
	var v = this.content[0][f]; //Em.getPath(this.content[0], prop)
	if (typeof(v)==="undefined") console.error("Field "+f+"has no value in Handlebar updatableField helper");
	if (!f) throw new Error(err + "did not found value for Field" + f);

	v = (typeof (v) === "string") ? v.replace(/'/g, "\"") : v;
	var cl = options.hash['classes']; cl = (cl) ? cl + " UpdateField" : "UpdateField";
	var id = options.hash['id']; id = (id) ? "\"id\":\"" + id + "\"," : "";
	var lblT = options.hash['labelType']; lblT = (lblT) ? "\"labelType\":\"" + lblT + "\"," : "";
	var attr = options.hash['attr']; attr = (attr) ? "\"attr\":\"" + attr + "\"," : "";
	var List = options.hash['List']; List = (List) ? "\"List\":" + List + "," : ""; //List yra objektas ir jam kabuciu nereikia
	var Editable = options.hash['Editable']; Editable = (Editable) ? "\"Editable\":" + Editable + "," : ""; //Editable yra objektas ir jam kabuciu nereikia
	
	var retString = "<div class='ExtendIt' data-ctrl='{\"Value\":" + (v===""?"\"\"":v) + ",\"Field\":\"" + f + "\",\"classes\":\"" + cl + "\"," + id + lblT + attr+List+Editable;
	if (retString.charAt(retString.length - 1) === ",") {retString = retString.slice(0, -1); } //iškertam paskutini kalbeli jei yra
	
	return new Handlebars.SafeString(retString + "}'></div>");
});
Handlebars.registerHelper('eachArr', function (context, block) {
	var ret = "";
	for (var i = 0, j = context.length; i < j; i++) {
		//context[i].index = i;
		ret = ret + block(context[i]);
	}
	return ret;
});
Handlebars.registerHelper('each11', function (context, options) {
	var ret = "";

	for (var i = 0, j = context.length; i < j; i++) {
		ret = ret + options.fn(context[i]);
	}

	return ret;
});

/*	{{#compare Database.Tables.Count ">" 5}}
		There are more than 5 tables
	{{/compare}}

	{{#compare "claimID" "Test"}}
		Default comparison of "==="
	{{/compare}}*/
Handlebars.registerHelper('compare', function (lvalue, operator, rvalue, options) {
	var operators, result;
	if (arguments.length < 3) { throw new Error("Handlerbars Helper 'compare' needs 2 parameters"); }
	if (options === undefined) {
		options = rvalue;
		rvalue = operator;
		operator = "===";
	}
	//jei value yra this.TypeID, laikom, kad reikia paimt lauko reiksme is konteksto
	if (lvalue.slice(0, 4) === "this") { var v = lvalue.slice(5); lvalue = this.content[0][v]; if (lvalue === undefined) { throw new Error("Handlerbars Helper 'compare' doesn't know field " + v); } }
	if (rvalue.slice(0, 4) === "this") { var v = rvalue.slice(5); rvalue = this.content[0][v]; if (rvalue === undefined) { throw new Error("Handlerbars Helper 'compare' doesn't know field " + v); } }
	operators = {
		'==': function (l, r) { return l == r; },
		'===': function (l, r) { return l === r; },
		'!=': function (l, r) { return l != r; },
		'!==': function (l, r) { return l !== r; },
		'<': function (l, r) { return l < r; },
		'>': function (l, r) { return l > r; },
		'<=': function (l, r) { return l <= r; },
		'>=': function (l, r) { return l >= r; },
		'typeof': function (l, r) { return typeof l == r; }
	};
	if (!operators[operator]) {
		throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
	}
	result = operators[operator](lvalue, rvalue);
	if (result) {
		return options.fn(this); //grazina ka grazina
	} else {
		return options.inverse(this); //grazina tai kas yra po else
	}
});
//Handlebars.registerHelper('searchField', function (id, options) {
//	if (!id)	 throw new Error("searchField helper didn't found id.")
//	var value = Ember.getPath(this, prop);
//	return new Handlebars.SafeString('<input id="srcSubmit" name="submit" type="submit" value="Search" {{action aSearch}}/>');
//});
App.SearchField = Ember.View.extend({
	context: null,
	tagName: "form",
	template: Em.Handlebars.compile('<input {{action "valueDidChange" on="keyUp" target="parentView"}} type="text" class="searchField" placeholder="Ieškoti.."/><div class="divSearch"><span {{action "clear" target="parentView"}} class="spanToClearText">x</span></div>'),
	clear: function (e) { $(e.target).closest("form").find("input").val(""); this.get("valueDidChange").call(this, ""); },
	valueDidChange: function (e) {
		var f = (e) ? $(e.target).val() : "", context = this.get("context");
		if (context === "accidents") {
			if (!f) { $("#accidentsTable").find(">div.tr").removeClass("hidden"); return; }
			else { f = f.toLowerCase(); }
			$("#accidentsTable").find(">div.tr").each(function () {
				var t = this, c = t.children, hidden = (t.className.indexOf("hidden") > -1) ? true : false, toHide = true;
				if (c[0].innerHTML.indexOf(f) + c[1].innerHTML.toLowerCase().indexOf(f) + c[2].innerHTML.toLowerCase().indexOf(f) + c[5].innerHTML.toLowerCase().indexOf(f) > -4) {
					if (hidden) { t.className = t.className.replace(" hidden", ""); }
					toHide = false;
				} else {
					if (!hidden) { t.className = t.className + " hidden"; }
				}
				if (t.className.indexOf("selectedAccident") > -1) {//pagal selected rodom/pakavojam ir jo details
					var d = $("#AccDetailsWraper");
					if (toHide && !d.hasClass("hidden")) { d.addClass("hidden"); $("#accidentsTable").find(">div.dividers").css("display", "none"); }
					else if (!toHide && d.hasClass("hidden")) { d.removeClass("hidden"); $("#accidentsTable").find(">div.dividers").css("display", "block"); }
				}
			});
		}
	}
})
App.AccidentViewObj = Em.View.extend({
	didInserElement: function () {
		console.log("I loaded one accident");
	},

	templateName: 'tmpAccidentRowObj', //<div class="tr accident" @Html.Raw("{{action tbodyClick this target=\"this\"}}")>
	tagName: ""//,
	//classNames: "tr",

});
