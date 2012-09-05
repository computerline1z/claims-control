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
console.info = console.info || function () { };
jQuery.fn.log = function (msg) {
	msg = msg || "log";
	console.log("%s: %o", msg, this);
	this.each(function (n) {
		id = this.id ? "ID: " + this.id : ""
		console.log("%d: %s.%s %s", n, this.tagName, this.className, id)
	})
	return this;
};
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
var MY = {
	change: {
		onlyNumbers: function (input) {
			return input.toString().replace(/[^\d.]/g, "");
		}
	}
}
Array.prototype.FNameIndex = function (FNameVal) {
	var ctr = "";
	for (var i = 0; i < this.length; i++) {
		// use ===to check for Matches. ie., identical (===), ;
		if (this[i].FName == FNameVal) {
			return i;
		}
	}
	return ctr;
};
Array.prototype.findIndexByVal = function (value) {
	var ctr = "";
	for (var i = 0; i < this.length; i++) {
		// use ===to check for Matches. ie., identical (===), ;
		if (this[i] == value) {
			return i;
		}
	}
	return ctr;
};
Array.prototype.findValueByID = function (ID) {//Randa reiksme stulelio ValueCol kurio id yra ID [tik dvieju dimensiju array'ems]
	for (var i = 0; i < this.length; i++) {
		if (this[i][0] === ID) { return this[i]; }
	}
	return false;
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
Array.prototype.findRowByColValue = function (value, Col) {
	for (var Row = 0; Row < this.length; Row++) {
		if (this[Row][Col] == value) {
			return Row;
		}
	}
	return "";
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
Array.prototype.MapArrToString = function (arrIndexes) {
	var arrRet = [];
	for (var i = 0; i < arrIndexes.length; i++) {
		arrRet[arrRet.length] = this[arrIndexes[i]];
	}
	return arrRet.join(", ");
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
}
Array.prototype.arrElementToInt = function (fieldsToInt) {
	for (var i = 0; i < fieldsToInt.length; i++) {
		this[fieldsToInt[i]] = parseInt(this[fieldsToInt[i]], 10);
	}
}
String.prototype.IsImage = function () {
	var type = (this.substring(this.search("\\.") + 1)).toUpperCase();
	if (type === "PNG" || type === "JPG" || type === "GIF" || type === "JPEG" || type === "BMP") {
		return true;
	}
	return false;
}
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
				//#region   sukisam view'us i atitinkamus kontrolus ir patobulinam propercius tiems kur turi div.inputForm
				var Render = jsResp[p];
				for (var pR in Render) {
					if (!Render[pR]) { continue; }
					//var ctrl=(pR.search("cls")===0)?pR.replace("."):"#"+pR; cia jeigu naudot klase
					$('#' + pR).html(Render[pR]); var inputForm = $('#' + pR + ' div.inputForm');
					for (var i = 0; i < inputForm.length; i++) {
						oCONTROLS.UpdatableForm($(inputForm)[i]); // pereinam per visus ir padarom updatable
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
	Ctrl: {
		CtrlHeight: {},
		GetMinCtrlHeight: function (CtrlName) {
			this.CtrlHeight[CtrlName] = $(document).height() - $('#ulMainMenu').outerHeight(true) - $('#divlogindisplay').outerHeight(true);
			return this.CtrlHeight[CtrlName];
		},
		InnerHeight: function (ChildToFit) {
			var h = 0;
			$.each($(ChildToFit).children(), function (index, child) {
				h += parseInt($(child).outerHeight(true));
			});
			return h;
		},
		ResizeChilds: function (CtrlName) {
			var h = this.CtrlHeight[CtrlName], t = $(CtrlName); t.height(h);
			$.each(t.children(), function (index, child) { $(child).height(h); });
		},
		CheckCtrlHeight: function (p) {//CtrlName, ChildToFit, ToSetCtrlHeight
			//{ CtrlName: "#"+Ctrl, LayOutPanel: "#"+Ctrl+"-center",FirstResize:true };
			var inner = this.InnerHeight((p.LayOutPanel) ? p.LayOutPanel : p.CtrlName); //Jei yra Layoutas matuojam layouto paneli, priesingu atveju MainCtrl
			var container = ((this.CtrlHeight[p.CtrlName]) ? (this.CtrlHeight[p.CtrlName]) : this.GetMinCtrlHeight(p.CtrlName));
			var Resize = ((container < (inner + p.padding)) ? (inner + p.padding) : 0);

			if (Resize) {
				this.CtrlHeight[p.CtrlName] = Resize;
				if (typeof p.LayOutPanel !== 'undefined') { this.ResizeChilds(p.CtrlName) }
				else { $(p.CtrlName).height(Resize); }
			} else if (p.FirstResize) { $(p.CtrlName).height(this.CtrlHeight[p.CtrlName]); }
		}
	},
	MakeSizes: function () {
		function scrollbarWidth() {
			var b = document.body; b.style.overflow = 'hidden'; b.style.overflow = 'scroll';
			var width = b.clientWidth; width -= b.clientWidth;
			if (!width) width = b.offsetWidth - b.clientWidth;
			b.style.overflow = '';
			return width;
		}
		if (oSIZES.DoneSizes) return;
		oSIZES = { width: $(document).width() - scrollbarWidth(), height: $(document).height(), scr: scrollbarWidth, DoneSizes: 1 };
		window.setTimeout(function () { oSIZES.DoneSizes = 0; }, 1000);
	},
	fnApplyLayout: function (Ctrl, oTable, padding) {
		var t = $("#" + Ctrl);
		if ($("#" + Ctrl + "-center").length) {
			setTimeout(function () {
				var p = { CtrlName: "#" + Ctrl, LayOutPanel: "#" + Ctrl + "-center", FirstResize: true, padding: (padding) ? padding : 0 }; //FirstResize-butina resizint, bet tik Ctrla (ne jo vaikus)
				$('#divMainPage').fadeIn(); oGLOBAL.Start.Ctrl.CheckCtrlHeight(p);
				t.layout({ East: { size: '500px' }, //applyDefaultStyles: true, t.children(":first").outerHeight(true)
					onresize_end: function () { oTable.fnAdjustColumnSizing(false); }
				}); oTable.fnAdjustColumnSizing(false);
			}, 5);
		}
	},
	FormLoaded: function (SERVER, Ctrl) {
		//if(SERVER!==undefined) { CallServer(SERVER.SPar, oGLOBAL.Start.fnSetPostLoadedData, SERVER.APar, SERVER.url, "json"); }
		//Wait.Hide();
		//$.unblockUI();
		//$('#divMainPage').fadeIn();
	}
}