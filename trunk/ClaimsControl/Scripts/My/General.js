(function ($) {
	$.fn.spinner = function (options) {
		var opts = $.extend({}, $.fn.spinner.defaults, options);
		return this.each(function () {
			var l = 0, t = 0, w = 0, h = 0, shim = 0, $s, $this = $(this);
			// removal handling
			if (options == 'remove' || options == 'close') {
				var $s = $this.data('spinner');
				var o = $this.data('opts');
				if (typeof $s != 'undefined') {
					$s.remove();
					$this.removeData('spinner').removeData('opts');
					if (o.hide) $this.css('visibility', 'visible');
					o.onFinish.call(this);
					return;
				}
			}
			if ($this.is("body")){
				if  ($this.height()<$(document).height()) {$this.height($(document).height());}
			}
			
			if (opts.img === "spinnerBig.gif") { opts.height = 66; opts.width = 66; }

			var pos = $this.offset();
			w = $this.outerWidth();
			h = $this.outerHeight();
			//Aukštį darom, kad matytūsi
			if (h>$(window).height()){h=$(window).height();}
			
			// calculate vertical centering
			if (h > opts.height) shim = Math.round((h - opts.height) / 2);
			else if (h < opts.height) shim = 0 - Math.round((opts.height - h) / 2);
			t = pos.top + shim + 'px';

			// calculate horizontal positioning
			if (opts.position == 'right') {
				l = pos.left + w + 10 + 'px';
			} else if (opts.position == 'left') {
				l = pos.left - opts.width - 10 + 'px';
			} else {//center
				var add=0; if ($this.is("body")){var lmargin=$("body").css("margin-left");add=parseInt(lmargin.replace("px",""),10);}
				l = add+pos.left + Math.round(.5 * w) - Math.round(.5 * opts.width) + 'px';
			}
			// call start callback
			opts.onStart.call(this);
			// hide element?
			if (opts.hide) $this.css('visibility', 'hidden');
			// create the spinner and attach
			$s = $('<img class="spinner" src="/Content/images/' + opts.img + '" style="position: absolute; left: ' + l + '; top: ' + t + '; width: ' + opts.width + 'px; height: ' + opts.height + 'px; z-index: ' + opts.zIndex + ';" />').appendTo('body')
			// removal handling
			$this.data('spinner', $s).data('opts', opts);
		});
	};
	// default spinner options
	$.fn.spinner.defaults = {
		// position: left, right, center(pagal nutylėjima)
		  img: 'spinnerBig.gif' //'spinnerBig.gif', 'spinner.gif'
		  , height: 16            // height of spinner img
		  , width: 16            // width of spinner img
		  , zIndex: 1001          // z-index of spinner
		  , hide: false         // whether to hide the elem
		  , onStart: function () { } // start callback
		  , onFinish: function () { } // end callback
	};
})(jQuery);
if ($("div.content:visible:first").length > 0) { $("div.content:visible:first").spinner({ centerOnBody: true, position: 'center', img: 'spinnerBig.gif' }); }
else $("body").spinner({ centerOnBody: true, position: 'center', img: 'spinnerBig.gif' });
// $('selector').log('BEGIN')
//     .css('color', 'red')
//     .log('new value')
//         // etc
//{{action MenuClicked}}
//        $.fn.log=function (msg) {
//            if(window.console&&console.log) { console.log("%s: %o", msg, this); }
//            return this;
//        };
if (!window.console) console = {};
console.log = console.log || function () { };
console.warn = console.warn || function () { };
console.error = console.error || function () { };
console.info = console.info || function () { };/*
jQuery.fn.log = function (msg) {
	msg = msg || "log";
	console.log("%s: %o", msg, this);
	this.each(function (n) {
		id = this.id ? "ID: " + this.id : ""
		console.log("%d: %s.%s %s", n, this.tagName, this.className, id)
	})
	return this;
};*/
//Naudojimas
//App.NumberField=Ember.TextField.extend({
//    valueBinding: Ember.Binding.from("App.person.age").transform(onlyNumber), <-------------
//    _cleanValue: function () {
//        this.set('value', onlyNumber(this.get('value')));
//    } .observes('value')
//});
//arba
//    ageChanged: function() {
//        this.set('age', onlyNumber(this.get('age')));
//    }.observes('age')
//App.NumberField=Ember.TextField.extend({
//    valueBinding: Ember.Binding.from("App.person.age")
//});
//http://jsfiddle.net/L6vmc/4/
if (!Object.keys) {//del senoviniu brovseriu (IE8)
	Object.keys = (function () {
		var hasOwnProperty = Object.prototype.hasOwnProperty,
		hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
		dontEnums = ['toString','toLocaleString','valueOf','hasOwnProperty','isPrototypeOf','propertyIsEnumerable','constructor' ],
		dontEnumsLength = dontEnums.length;
		return function (obj) {
			if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) throw new TypeError('Object.keys called on non-object');
			var result = [];
			for (var prop in obj) {if (hasOwnProperty.call(obj, prop)) result.push(prop); }
			if (hasDontEnumBug) {
				for (var i=0; i < dontEnumsLength; i++) {if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i]);}
			}
			return result;
		};
	})();
}
var MY = {
	change: {
		onlyNumbers: function (input) {
			return input.toString().replace(/[^\d.]/g, "");
		}
	}
}
Number.prototype.toRound=function(){
	return (Math.round(this*100)/100).toFixed(2);
}
String.prototype.toRowObject=function (fieldNamesArr){
	var valsArr=this.split(" "); retObj={};
	for (var i = 0; i < valsArr.length; i++) {
		if  (fieldNamesArr[i]){retObj[fieldNamesArr[i]] = $.trim(valsArr[i]);}
	}
	return retObj;
}
String.prototype.firstSmall=function (){
	return this.slice(0, 1).toLowerCase() +this.slice(1);
}
String.prototype.firstBig=function (){
	return this.slice(0, 1).toUpperCase() +this.slice(1);
}
String.prototype.replaceAt=function (ch,index){
	return this.substr(0, index) + ch + this.substr(index);
}
Array.prototype.filterByTbl = function (p) {//filterTbl,joinField,filterField,filterValue --Em objektų masyvams
	fTbl=[];me=this;
	if (!me.length) return fTbl;
	if (!me[0].iD) console.error("No iD for filter");
	var filterTbl=p.filterTbl.filter(function(item){return item[p.filterField]===p.filterValue;})
	filterTbl.forEach(function(filterItem){
		for (var i = 0; i < me.length; i++) {
			if (me[i].iD===filterItem[p.joinField]){fTbl[fTbl.length]=me[i];break;}
		}
	})
	return fTbl;
}
Em.Object.prototype.MapArrToString = function (arrNames, mapWithNoCommas,Source) {
	var arrRet = [], e;
	for (var i = 0; i < arrNames.length; i++) {
		e = $.trim(this[arrNames[i]]);
		if (e !== "") arrRet[arrRet.length] = e;
	}
	if  (Source||""==="proc_Drivers"){return  (this.notUnique)?(arrRet.join(" ")+", "+this.dateBorn ):arrRet.join(" ");}
	else if (mapWithNoCommas) return arrRet.join(" ");
	else return arrRet.join(", ");
}

Em.Object.prototype.updateTo = function (newObject) {
	for (var prop in this) {
		if (!this.hasOwnProperty(prop)) continue;
		if (newObject[prop] && this[prop] !== newObject[prop]) {
			this.set(prop, newObject[prop]);
			// o ne this[prop]=newObject[prop];
		}
	}
}
Array.prototype.getColByFName = function (FNameVal) {
	var ctr = "";
	for (var i = 0; i < this.length; i++) {
		if (this[i].FName.toLowerCase() == FNameVal.toLowerCase()) {
			return this[i];
		}
	}
	return ctr;
};
Array.prototype.FNameIndex = function (FNameVal) {
	var ctr = "";
	for (var i = 0; i < this.length; i++) {
		if (this[i].FName.toLowerCase() == FNameVal.toLowerCase()) {
			return i;
		}
	}
	return ctr;
};
//[1, 2, 3].move(0, 1) -> [2, 1, 3]
//[1, 2, 3, 4, 5].move(-1, -2) -> [1, 2, 3, 5, 4]
Array.prototype.move = function (old_index, new_index) {
    while (old_index < 0) {
        old_index += this.length;
    }
    while (new_index < 0) {
        new_index += this.length;
    }
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
};
Array.prototype.findIndexByKeyValue = function (key, value) {
	for (var i = 0; i < this.length; i++) {
		if (this[i][key] == value) {
			return i;
		}
	}
	return null;
}
Array.prototype.findIndexByVal = function (value,normallize) {
	var ctr = "";if (normallize){value=value.toLowerCase();}
	for (var i = 0; i < this.length; i++) {
		// use ===to check for Matches. ie., identical (===), ;
		if (normallize){if (this[i].toLowerCase() == value) {return i;}}
		if (this[i] == value) {return i;}
	}
	return ctr;
};
Array.prototype.findValueByID = function (ID) {//Randa reiksme stulelio ValueCol kurio id yra ID [tik dvieju dimensiju array'ems]
	for (var i = 0; i < this.length; i++) {
		if (this[i][0] === ID) { return this[i]; }
	}
	return false;
};
Array.prototype.findObjectByProperty = function (propertyName, propertyValue) {
	for (var i = 0; i < this.length; i++) {
		if (this[i][propertyName] === propertyValue) return this[i];
	}
};
Array.prototype.findColValuesByID = function (ID, ArrValuesCol) {//Randa reiksme stulelio ValueCol kurio id yra ID [tik dvieju dimensiju array'ems]
	var ctr = "";
	for (var i = 0; i < this.length; i++) {
		// use ===to check for Matches. ie., identical (===), ;
		if (this[i][0] === ID) {
			var ret = "";
			for (var ix = 0; ix < ArrValuesCol.length; ix++) {
				ret += this[i][ArrValuesCol[ix]] + ", ";
			}
			return ret.slice(0, -2);
		}
	}
	return ctr;
};
Array.prototype.findColValueByID = function (ID, ValueCol) {//Randa reiksme stulelio ValueCol kurio id yra ID [tik dvieju dimensiju array'ems]
	var ctr = "";
	for (var i = 0; i < this.length; i++) {
		// use ===to check for Matches. ie., identical (===), ;
		if (this[i][0] === ID) {
			return this[i][ValueCol];
		}
	}
	return ctr;
};
//Array.prototype.getRowByColValue = function (value, Col) {
//	for (var Row = 0; Row < this.length; Row++) {
//		if (this[Row][Col] == value) {
//			return this[Row];
//		}
//	}
//	return "";
//};
Array.prototype.removeRowByProperty = function (propertyName, propertyValue) {
	for (var i = 0; i < this.length; i++) {
		if (this[i][propertyName] === propertyValue) {
			this.splice(i, 1);
			return i;
		}
	}
	return false;
};
Array.prototype.removeRowByID = function (ID) {//Istrina eilute kurios id yra ID
	var ctr = "";
	for (var i = 0; i < this.length; i++) {
		if (this[i][0] === ID) {
			this.splice(i, 1);
			return i;
		}
	}
	return ctr;
};
Array.prototype.AddArray = function (AnotherArray) {
	for (var i = 0; i < AnotherArray.length; i++) {
		this[this.length] = AnotherArray[i];
	}
};
Array.prototype.IndexOfFunc = function (fnc) {
	//if(!fnc||typeof (fnc)!='function') { return -1; }
	for (var i = 0; i < this.length; i++) {
		if (fnc(this[i])) return i;
	}
	return -1;
};
function ArrayIndexOf(a, fnc) {
	if (!fnc || typeof (fnc) != 'function') {
		return -1;
	}
	if (!a || !a.length || a.length < 1) return -1;
	for (var i = 0; i < a.length; i++) {
		if (fnc(a[i])) return i;
	}
	return -1;
}
Array.prototype.ValueInMe = function (value) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] === value) {
			return true;
		}
	}
	return false;
};
Array.prototype.findColValByColVal = function (value, Col1, Col2) {
	///<summary>Sends data to server (JSONarg), and call function CallFunc(Response,ActionPar)</summary>
	///<param name="JSONarg">Json. To parse from javascript - JSON.stringify(jsObject)</param>
	///<param name="CallFunc">Function to call. Example SetnewMenuData</param>
	///<param name="ActionPar">example 'Darbuotojai'</param>
	///<param name="url">example '/[Controler]Tab/GetTab[Action]'</param>
	///<param name="dataType">JSONarg datatype 'json'|'html'|'texc'</param>
	///<returns type="calls_CallFunc(Response,ActionPar)"/>
	for (var Row = 0; Row < this.length; Row++) {
		if (this[Row][Col1] == value) {
			return this[Row][Col2];
		}
	}
	return "";
};
String.prototype.endsWith = function (suffix) {
	return (this.substr(this.length - suffix.length) === suffix);
}
String.prototype.startsWith = function (prefix) {
	return (this.substr(0, prefix.length) === prefix);
}
Array.prototype.MapArrToString = function (arrIndexes, mapWithNoCommas) {
	var arrRet = [], e;
	for (var i = 0; i < arrIndexes.length; i++) {
		e = $.trim(this[arrIndexes[i]]);
		if (e !== "") arrRet[arrRet.length] = e;
	}
	if (mapWithNoCommas) return arrRet.join(" ");
	else return arrRet.join(", ");
}
Array.prototype.UpdateArrToNew = function (NewArr, fieldsToInt) {
	if (fieldsToInt) {//jei reikia paverciam integeriu
		for (var i = 0; i < fieldsToInt.length; i++) {
			NewArr[fieldsToInt[i]] = parseInt(NewArr[fieldsToInt[i]], 10);
		}
	}
	for (var i = 0; i < this.length; i++) {
		if (this[i][0] === NewArr[0]) {
			this[i] = NewArr;
			return true;
		}

	}
	return false;
};
Array.prototype.arrElementToInt = function (fieldsToInt) {
	for (var i = 0; i < fieldsToInt.length; i++) {
		this[fieldsToInt[i]] = parseInt(this[fieldsToInt[i]], 10);
	}
};
String.prototype.IsImage = function () {
	var type = (this.substring(this.search("\\.") + 1)).toUpperCase();
	if (type === "PNG" || type === "JPG" || type === "GIF" || type === "JPEG" || type === "BMP") {
		return true;
	}
	return false;
};
String.prototype.format = function () {
	//'{0} {0} {1} {2}'.format(3.14, 'abc', 'foo'); // outputs: 3.14 3.14 abc foo
	//'Your balance is {0} USD'.format(77.7)
	var s = this, i = arguments.length;
	while (i--) {
		s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
	}
	return s;
};
var jscss_filesadded = "" //list of files already added
String.prototype.GetIcon = function (FileId) {
	var pPosition = this.search("\\."), ret = "<span style='display:inline-block;' class='{0} ui-button-icon-primary'>", img = "img32-Help";
	if (pPosition > 0) {
		var type = (this.substring(this.search("\\.") + 1)).toLowerCase();
		ret = "<a href='/Uploads/" + FileId + "." + type + "' target='_blank'>" + ret + "</a>";
		if (type === "png" || type === "jpg" || type === "gif" || type === "jpg" || type === "jpeg" || type === "bmp") {
			img = "img32-Img";
		}
		else if (type === "xls" || type === "xlsx") {
			img = "img32-Excel";
		}
		else if (type === "pdf") {
			img = "img32-Pdf";
		}
		else if (type === "ppt" || type === "pptx") {
			img = "img32-ppt";
		}
		else if (type === "doc" || type === "docx") {
			img = "img32-Word";
		}
	} else {
		if (this === "Add") {
			img = "img32-" + this.toString();
		}
	}
	return ret.format(img);
}
var oSIZES = { DoneSizes: 0 };
oGLOBAL.Start = {
	fnSetNewData: function (jsResp, APar) { //jsResp:{jsonai,Render: {ctrl:View},ExecFn:{ctrl:Fn}}, APar:{Ctrl:pvzTab,StartNew:0/1,fnCallBack:fn}
		var ExecFn = 0;
		//Jeigu reikia ir esam isimine pakeiciam ctrl nauju, priesingu atveju isimenam jo outerHTML
		var Replace = (APar.RenderNew && oGLOBAL.Start[APar.Ctrl]) ? oGLOBAL.Start[APar.Ctrl] : "";
		if (Replace) {
			$('#' + APar.Ctrl).empty();
			$('#' + APar.Ctrl).replaceWith(oGLOBAL.Start[APar.Ctrl]);
		}
		else if (!oGLOBAL.Start[APar.Ctrl]) {
			/*oGLOBAL.Start[APar.Ctrl] = $('#' + APar.Ctrl).attr('outerHTML');*/ //Jei dar neisiminem
		}
		for (var p in jsResp) {
			if (p === "Render") {
				//#region   sukisam view'us i atitinkamus kontrolus ir patobulinam propercius tiems kur turi div.js-frm
				var Render = jsResp[p];
				for (var pR in Render) {
					if (!Render[pR]) { continue; }
					//var ctrl=(pR.search("cls")===0)?pR.replace("."):"#"+pR; cia jeigu naudot klase
					$('#' + pR).html(Render[pR]); var inputForm = $('#' + pR + ' div.js-frm');
					for (var i = 0; i < inputForm.length; i++) {
						var btnSaveToDisable;
						if ($(inputForm)[i].id === "AccidentForm") { btnSaveToDisable = $("#btnSaveAccident"); }
						oCONTROLS.UpdatableForm({ frm: $(inputForm)[i] ,btnSaveToDisable:btnSaveToDisable}); // pereinam per visus ir padarom updatable
					}
				}
				//#endregion
			} else if (p === "ExecFn") {
				ExecFn = jsResp[p];
			} else { if (jsResp[p]) { oDATA.SET(p, jsResp[p]); } } //Jei objektas ne tuscias tai kisam, o jei "" tai nereikia (C# negeneruoja dinaminiu objektu, tai nereikalingi yra tusti)
		}
		//#region executinam visas funkcijas ant atitinkamu controlsu
		if (ExecFn) {
			for (var pFn in ExecFn) {
				if (ExecFn[pFn]) { $('#' + pFn)[ExecFn[pFn]](); }
			}
		}
		//#endregion
		if (APar.Ctrl == "tabMessages") { }
		else if (APar.Ctrl == "tabAccidents") {
			var oTable = Tab_AccidentsList(APar.Ctrl);
			oGLOBAL.Start.fnApplyLayout(APar.Ctrl, oTable, 20);
		} // $("#tabAccidents").height($("#tabAccidents-center"));
		else if (APar.Ctrl == "tabClaims") { }
		else if (APar.Ctrl == "tabMap") { }
		else if (APar.Ctrl == "tabReports") { }
		else if (APar.Ctrl == "tabLists") { }
		if (typeof APar.fnCallBack !== 'undefined') { APar.fnCallBack(jsResp); }
		oGLOBAL.Start.FormLoaded(undefined, APar.Ctrl);
		console.log("oGLOBAL.Start.fnSetNewData," + "#" + APar.Ctrl + " height:" + $("#" + APar.Ctrl).height());
	},
	// Ctrl: {
	// CtrlHeight: {},
	// GetMinCtrlHeight: function (CtrlName) {
	// this.CtrlHeight[CtrlName] = $(document).height() - $('#ulMainMenu').outerHeight(true) - $('#divlogindisplay').outerHeight(true);
	// return this.CtrlHeight[CtrlName];
	// },
	// InnerHeight: function (ChildToFit) {
	// var h = 0;
	// $.each($(ChildToFit).children(), function (index, child) {
	// h += parseInt($(child).outerHeight(true));
	// });
	// return h;
	// },
	// ResizeChilds: function (CtrlName) {
	// var h = this.CtrlHeight[CtrlName], t = $(CtrlName); t.height(h);
	// $.each(t.children(), function (index, child) { $(child).height(h); });
	// },
	// CheckCtrlHeight: function (p) {//CtrlName, ChildToFit, ToSetCtrlHeight
	// //{ CtrlName: "#"+Ctrl, LayOutPanel: "#"+Ctrl+"-center",FirstResize:true };
	// var inner = this.InnerHeight((p.LayOutPanel) ? p.LayOutPanel : p.CtrlName); //Jei yra Layoutas matuojam layouto paneli, priesingu atveju MainCtrl
	// var container = ((this.CtrlHeight[p.CtrlName]) ? (this.CtrlHeight[p.CtrlName]) : this.GetMinCtrlHeight(p.CtrlName));
	// var Resize = ((container < (inner + p.padding)) ? (inner + p.padding) : 0);

	// if (Resize) {
	// this.CtrlHeight[p.CtrlName] = Resize;
	// if (typeof p.LayOutPanel !== 'undefined') { this.ResizeChilds(p.CtrlName) }
	// else { $(p.CtrlName).height(Resize); }
	// } else if (p.FirstResize) { $(p.CtrlName).height(this.CtrlHeight[p.CtrlName]); }
	// }
	// },
	// MakeSizes: function () {
	// function scrollbarWidth() {
	// var b = document.body; b.style.overflow = 'hidden'; b.style.overflow = 'scroll';
	// var width = b.clientWidth; width -= b.clientWidth;
	// if (!width) width = b.offsetWidth - b.clientWidth;
	// b.style.overflow = '';
	// return width;
	// }
	// if (oSIZES.DoneSizes) return;
	// oSIZES = { width: $(document).width() - scrollbarWidth(), height: $(document).height(), scr: scrollbarWidth, DoneSizes: 1 };
	// window.setTimeout(function () { oSIZES.DoneSizes = 0; }, 1000);
	// },
	// fnApplyLayout: function (Ctrl, oTable, padding) {
	// var t = $("#" + Ctrl);
	// if ($("#" + Ctrl + "-center").length) {
	// setTimeout(function () {
	// var p = { CtrlName: "#" + Ctrl, LayOutPanel: "#" + Ctrl + "-center", FirstResize: true, padding: (padding) ? padding : 0 }; //FirstResize-butina resizint, bet tik Ctrla (ne jo vaikus)
	// $('#divMainPage').fadeIn(); oGLOBAL.Start.Ctrl.CheckCtrlHeight(p);
	// t.layout({ East: { size: '500px' }, //applyDefaultStyles: true, t.children(":first").outerHeight(true)
	// onresize_end: function () { oTable.fnAdjustColumnSizing(false); }
	// }); oTable.fnAdjustColumnSizing(false);
	// }, 5);
	// }
	// },
	FormLoaded: function (SERVER, Ctrl) {
		//if(SERVER!==undefined) { CallServer(SERVER.SPar, oGLOBAL.Start.fnSetPostLoadedData, SERVER.APar, SERVER.url, "json"); }
		//Wait.Hide();
		//$.unblockUI();
		//$('#divMainPage').fadeIn();
		$("img.spinner").remove();
	}
}
oGLOBAL.date = {
	dateFormat: "yyyy.mm.dd",//$.datepicker.formatDate('yy.mm.dd', new Date())
	dateDelimiter: ".",
	getTodayString: function () {
		return moment().format(oDATA.GET("userData").emData[0].dateFormat);
		// var d = new Date();
		// this.checkFormat();
		// return d.getFullYear() + this.dateDelimiter +
		 // ((d.getMonth() <= 9) ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)) + this.dateDelimiter +
		 // ((d.getDate() <= 9) ? '0' + d.getDate() : d.getDate());
	},
	getDate: function (stringDate) {
		// accepts a date in the format 2011-01-01 (year, month, day)
		// Internet Explorer does not like dashes in dates when converting, so lets use a regular expression to get the year, month, and day 
		//var DateRegex = /([^-]*)+this.dateDelimiter+([^-]*)+this.dateDelimiter+([^-]*)/;
		var pattern = new RegExp("([^-]*)" + this.dateDelimiter + "([^-]*)" + this.dateDelimiter + "([^-]*)");
		this.checkFormat();
		var DateRegexResult = stringDate.match(pattern);
		var result=(DateRegexResult)?(new Date(DateRegexResult[2] + "/" + DateRegexResult[3] + "/" + DateRegexResult[1])):"";
		return result;
	},
	isDate: function (stringDate) {return !isNaN(Date.parse(this.getDate(stringDate)))},
	firstBigger: function (date1, date2) {
		if (arguments.length === 1) { date2 = this.getTodayString(); }
		//console.log(this.getDate(date1));console.log(this.getDate(date2));
		return this.getDate(date1) > this.getDate(date2);
	},
	checkFormat: function () {
		if (this.dateFormat !== "yyyy.mm.dd") { throw new Error(err + "no such format in General.js date obj."); }
	}
	// function fnGetDateString(Desc) {//Pradžios data
	// var d = new Date(), Y = d.getFullYear(), m = d.getMonth() + 1, M = fn2No(d.getMonth() + 1), D = fn2No(d.getDate()), retD;
	// if (Desc === "ThisYear") { retD = Y + ".01.01" }
	// else if (Desc === "Last6M") { retD = ((m < 6) ? Y - 1 : Y) + "." + ((m < 6) ? fn2No(m + 6) : fn2No(m - 6)) + "." + D; }
	// else if (Desc === "Last12M") { retD = Y - 1 + "." + M + "." + D; }
	// else { retD = Y + '.' + M + '.' + D; }
	// return retD;
	// }
	// function fnGetDateString_noDay(Desc) {//Pradžios data
	// var d = new Date(), Y = d.getFullYear(), m = d.getMonth() + 1, M = fn2No(d.getMonth() + 1), retD;
	// if (Desc === "ThisYear") { retD = Y + ".01" }
	// else if (Desc === "Last6M") { retD = ((m < 6) ? Y - 1 : Y) + "." + ((m < 6) ? fn2No(m + 6) : fn2No(m - 6)); }
	// else if (Desc === "Last12M") { retD = Y - 1 + "." + M; }
	// else { retD = Y + "." + M; }
	// return retD;
	// }
	// function fn2No(No) { return No < 10 ? '0' + No : No; }
	// function fnGetStringFromjDate(jDate) {
	// var d = new Date(parseInt(jsonDate.substr(6)));
	// return [d.format("yy/mm/dd"), d.format("HH:MM")];
	// }
	// function fnGetDateTime(expr) {
	// var re = /^(\d{4})[\-|\/|\.]?(\d{1,2})[\-|\/|\.]?(\d{1,2})[\s\S]*(\d{2}:\d{2})$/; //2011-02-31 / 06:47
	// if (expr != '') {
	// if (regs = expr.match(re)) {
	// if (regs[3] < 1 || regs[3] > 31) {
	// alert("Invalid value for day: " + regs[1]);
	// return false;
	// }
	// if (regs[2] < 1 || regs[2] > 12) {
	// alert("Invalid value for month: " + regs[2]);
	// return false;
	// }
	// if (regs[1] < 1902 || regs[1] > (new Date()).getFullYear()) {
	// alert("Invalid value for year: " + regs[3] + " - must be between 1902 and " + (new Date()).getFullYear());
	// return false;
	// }
	// } else {
	// alert("Invalid date format: " + expr);
	// return false;
	// }
	// return regs[1] + "-" + regs[2] + "-" + regs[3] + " " + regs[4] + ":00";
	// }
	// }
};
oGLOBAL.helper = {
	emData_fromDataToSave: function(DataToSave, id){//{DataToSave, id}
		ret = {};
		DataToSave.Fields.forEach(
			function (Field, i) { ret[Field.firstSmall()]=DataToSave.Data[i];}
		);
		if (id) ret.iD=id;
		return Em.Object.create(ret);
	},
	getData_fromDataToSave: function (DataToSave, field) {
		ret = "";
		DataToSave.Fields.forEach(
			function (Field, i) {
				if (Field === field) ret = DataToSave.Data[i];
			}
		);
		return ret;
	},//oGLOBAL.helper.existsFunctionByName
	executeFunctionByName: function (functionName, context /*, args */) {
		var args = Array.prototype.slice.call(arguments, 2),namespaces = functionName.split("."),func = namespaces.pop();
		for (var i = 0; i < namespaces.length; i++) {context = context[namespaces[i]];}
		return context[func].apply(context, args);
	},
	existsFunctionByName: function (functionName, context /*, args */) {
		var args = Array.prototype.slice.call(arguments, 2), namespaces = functionName.split("."), func = namespaces.pop();
		for (var i = 0; i < namespaces.length; i++) {context = context[namespaces[i]];if (!context){return false;}}
		return context[func]||false;
	},
	execWhen: function (p,calledNo) {//p:{fnCondition, fnExec, timeout} calledNo-nereikia rasyt
		if (!calledNo){calledNo=0;}
		if (!p.timeout){p.timeout=2000;}//default timeout
		if (p.fnCondition()){
			p.fnExec(); console.log("execWhen: baigiau - atitiko");
		} else {
			if (p.timeout/(200*calledNo)>200){//dar laikas nepasibaigė
				 console.log("execWhen: dar");
				setTimeout(function () {oGLOBAL.helper.execWhen(p,calledNo++)}, 200);
			} else {
				p.fnExec(); console.log("execWhen: baigesi laikas");
			}
		}
	}
}