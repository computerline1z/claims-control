Handlebars.registerHelper('highlight', function (prop, options) {
	var value = Ember.getPath(this, prop);
	return new Handlebars.SafeString('<span class="highlight">' + value + '</span>');
});
Handlebars.registerHelper('checkOut_trinti', function (prop, options) {
	var value = Ember.getPath(this, prop);
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
	if (!prop) console.error("No prop");
	var f=prop,h=options.hash,v=this[f];
	if (!v&&this.content){v=this.content[0][f];}
	if (!v){v="";}
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
	var operators, result,me=this;
	if (arguments.length < 3) { throw new Error("Handlerbars Helper 'compare' needs 2 parameters"); }
	if (options === undefined) {
		options = rvalue;rvalue = operator;operator = "===";
	}
	getVal=function(name){
		if (!isNaN(name)){return parseInt(name,10);}//Jei tai numeris tuo ir baigsim
		var nameArr=name.split('.'), val=me;
		nameArr.forEach(function(n){val=val[n];});
		return  val;
	}
	lvalue=getVal(lvalue);
	rvalue=getVal(rvalue);
	operators = {
		'==': function (l, r) { return l == r; },'===': function (l, r) { return l === r; },'!=': function (l, r) { return l != r; },
		'!==': function (l, r) { return l !== r; },'<': function (l, r) { return l < r; },'>': function (l, r) { return l > r; },
		'<=': function (l, r) { return l <= r; },'>=': function (l, r) { return l >= r; },'typeof': function (l, r) { return typeof l == r; }
	};
	if (!operators[operator]) {
		console.error("No such operator " + operator);
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
	tagName:"",
	template: Em.Handlebars.compile('<form class="topSearchForm" onsubmit="return false;" ><input  {{action "valueDidChange" on="keyUp" target="parentView"}} type="text" class="searchField" placeholder="Ieškoti.."/><div class="divSearch"><span {{action "clear" target="parentView"}} class="spanToClearText"><img src="Content/images/icon-cancel.png"></span></div></form>'),
	clear: function (e) { $(e.target).closest("form").find("input").val(""); this.get("valueDidChange").call(this, ""); },
	valueDidChange: function (e) {
		if ((e.keyCode || e.which) === 13) return false;
		var f = (e) ? $(e.target).val() : "", context = this.get("context");
		controller = this.get("controller");
		if (controller) {
			var filterValue=App[controller].filterValue, lengthBefore=(filterValue)?filterValue.length:0, lengthAfter=(f)?f.length:0
			var filterReduced=(lengthBefore>lengthAfter)?true:false;
			App[controller].set("filterReduced",filterReduced).set("filterValue",f.toLowerCase());
		}
	}
})
//App.FormBottomView = Em.View.extend(Em.MyEventAttacher,{ templateName: 'tmpFormBottom' });
App.FormBottomView = Em.View.extend({ 
	init: function() {
		 var actions=['deleteForm','saveForm','cancelForm'],targetEventFnc=[],actionFnc=[];
		 target = this.get('target'),	 
		 targetObj = Ember.getPath(target);
		if (!targetObj){console.error("no target");}
		var attachFunction = function(fn){
			if (typeof fn === 'function') {
				var actionFnc = function(event) {fn(event);} 
				this.set(actions[i], actionFnc);	
				//console.log('ok action: '+actions[i]);
			} else console.warn("No target for "+actions[i]);	
		}		
		 for (i=0;i<actions.length;i++){ 
			attachFunction.call(this,targetObj[actions[i]]);
		 }
		this._super();			 
	},
	templateName: 'tmpFormBottom'
});