Handlebars.registerHelper('highlight', function (prop, options) {
	var value = Ember.getPath(this, prop);
	return new Handlebars.SafeString('<span class="highlight">' + value + '</span>');
});
Handlebars.registerHelper('checkOut_trinti', function (prop, options) {
	var value = Ember.getPath(this, prop);
        console.log("opa");
	return new Handlebars.SafeString('<span class="highlight">' + value + '</span>');
});
Handlebars.registerHelper('currency', function (prop, options) {
	var value = Ember.getPath(this, prop)+'';
	var i=value.length-3;
	if (i>0){value=value.slice(0, i) + '.' + value.slice(i);}
	value+= ' '+App.accidentsController.currency;	
	return new Handlebars.SafeString(value);
});
Handlebars.registerHelper('updatableField', function (prop, options) {
	if  (this.content.length===0) return false;
	var err = "updatableField helper ",h=(prop.hash)?prop.hash:options.hash;
	var f = h.Field;
	if (!f) throw new Error(err + "did not found Field");
	var v = (this.content[0][f])?this.content[0][f]:""; //Em.getPath(this.content[0], prop)
	if (typeof(v)==="undefined") console.error("Field "+f+" has no value in updatableField helper");
	if (!f) throw new Error(err + "did not found value for Field" + f);

	//v = (typeof (v) === "string") ? v.replace(/'/g, "\"") : v;
	if (typeof (v) === "string"){v=v.replace(/'/g, "\\&quot;").replace(/"/g, '\\&quot;');}
	
	var cl = (h.classes)? h.classes : "";//UpdateField
	var st =  (h.style)? ("style='"+h.style+"'") : "";
	var id = h.id; id = (id) ? "\"id\":\"" + id + "\"," : "";
	var lblT = h.labelType; lblT = (lblT) ? "\"labelType\":\"" + lblT + "\"," : "";
	var sTitle = h.sTitle; sTitle = (sTitle) ? "\"sTitle\":\"" + sTitle + "\"," : "";
	var attr = h.attr; attr = (attr) ? "\"attr\":\"" + attr + "\"," : "";
	var List = h.List; List = (List) ? "\"List\":" + List + "," : ""; //List yra objektas ir jam kabuciu nereikia
	var Editable = h.Editable; Editable = (Editable) ? "\"Editable\":" + Editable + "," : ""; //Editable yra objektas ir jam kabuciu nereikia
	//var retString = " class='ExtendIt "+((h.classes)?h.classes:"")+"' "+st+" data-ctrl='{\"Value\":" + (v===""?"\"\"":v) + ",\"Field\":\"" + f.firstBig() + "\",\"classes\":\"UpdateField\"," + id + lblT + attr+List+Editable;
	var retString = " class='ExtendIt "+((h.classes)?h.classes:"")+"' "+st+" data-ctrl='{\"Value\":\"" + v + "\",\"Field\":\"" + f.firstBig() + "\",\"classes\":\"UpdateField\"," + id + lblT+sTitle + attr+List+Editable;

	if (retString.charAt(retString.length - 1) === ",") {retString = retString.slice(0, -1); } //iškertam paskutini kalbeli jei yra
	if (h.tag) {retString="<"+h.tag+ retString + "}'></"+h.tag+">";} else  {retString="<div"+ retString + "}'></div>";}
	return new Handlebars.SafeString(retString );
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
	//vietoj this.content padaro "content" tai atstatom
	if (typeof lvalue==="string") {if (lvalue.match("content")){lvalue=lvalue.replace("content","this.content");lvalue=eval(lvalue);}}
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
		controller = this.get("controller");
		if (controller) {App[controller].set("filterValue",f.toLowerCase());}
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
