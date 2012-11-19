/// <reference path="../Main/jquery-1.7.2-vsdoc.js" />
$(function () {
	Em.run.next(function () {
		oGLOBAL.logFromStart("Ember finished.");
		oDATA.fnLoadNext();
		//oDATA.fnWriteVersions();
	});
});
$(window).load(function () {
	oGLOBAL.logFromStart("All finished.");
	$("body").spinner('remove');
});
$(oGLOBAL.logFromStart("DOM ready."));

//function AddScript(url, object) {
//	if (object != null) {
//		// add script
//		var script = document.createElement("script");
//		script.type = "text/javascript";
//		script.src = "path/to/your/javascript.js";
//		document.body.appendChild(script);
//		// remove from the dom
//		document.body.removeChild(document.body.lastChild);
//		return true;
//	} else {
//		return false;
//	};
//};
var oDATA = Ember.Object.create({
	me: this,
	Obj: {},
	//1-reiškia, kad atsisiusta po sistemos užsikrovimo per 'fnLoadNext'
	listUrl: {
		proc_Accidents: "Accident/AccidentsList",
		tblAccidents: 1,
		proc_Drivers: 1,
		tblAccidentsTypes: 1,
		tblClaimTypes: 1,
		proc_Vehicles: 1,
		proc_InsPolicies: 1,
		tblInsurers: 1,
		tblVehicleMakes: 1,
		tblClaims: 1
	},
	listTemplates: {},
	SET: function (objName, oINST) {
		this.Obj[objName] = oINST;
	},
	GET: function (objName) {
		if (this.Obj[objName]) return this.Obj[objName];
		else {//this.get("fnErr")("Object " + objName + " not downloaded yet.")
			console.warn("Object " + objName + " not downloaded yet.");  return false;
		}
	},
	GetRow: function (id, tbl) {
		return this.GET(tbl).emData.findProperty("iD", id);
	},
	NEED: function (objNames, fnExec) {//jei objektu nera siunciames ir kai turim executinam funkcija
		var all_queued = false, noHits = 0, me = this;
		objNames.forEach(function (objName) {
			if (!this.get("exists").call(this, objName)) {//jei neturim sito objekto tai atsisiunciam
				noHits++;
				this.get("load").call(this, objName, function (json) {
					noHits--;
					if (all_queued && noHits === 0) fnExec();
				});
			}
		}, this); //second parameter becomes this in the callback function
		all_queued = true;
	},
	execWhenLoaded: function (objNames, fnExec, timeoutId) {//jei objektu nera laukiam kol ateis
		var tId = (timeoutId) ? timeoutId : 0, me = this, notExists = false;
		objNames.forEach(function (objName) {
			//console.log("cheking obj " + objName);
			if (objName.slice(0, 3) === "tmp") {
				if (!Em.TEMPLATES[objName]) { console.log("template " + objName + " not exists"); notExists = true; }
			}
			else if (!this.get("exists").call(this, objName)) {
				console.log("obj " + objName + " not exists"); notExists = true;
			}
		}, me); //second parameter becomes this in the callback function
		if (notExists) {
			tId = setTimeout(function () {
				oDATA.execWhenLoaded(objNames, fnExec, tId)
			}, 200); return false;
		}
		else if (tId !== 0) { clearTimeout(tId); }
		fnExec();
	},
	emBuilder: function (p) {//{newData:newData, tblName:tblName, toAppend:{"sort":"asc/desc","col":"date"}}
		oData = oDATA.GET(p.tblName);
		if (!oData.emData) { oData.emData = []; }
		if (!p.newData) return;
		var d = p.newData, c = oData.Cols, f = [], n, i, y, cnt = oData.emData;
		for (i = 0; i < c.length; i++) {//Sudedam vardus, kad prasidetų nuo mažos raidės
			n = c[i].FName;
			f[f.length] = n.slice(0, 1).toLowerCase() + n.slice(1);
		};
		if (p.toAppend) {
			for (i = 0; i < d.length; i++) {//bėgam per eilutes
				var e = {};
				for (y = 0; y < c.length; y++) {//bėgam per stulpelius
					e[f[y]] = d[i][y];
				}
				e.visible = true; //Visi pradzioj matomi
				if (p.toAppend.sort) {//ikisam ne bet kur
					oDATA.setToPlace(p.toAppend, e, cnt);
				}
				else {
					cnt.pushObject(Em.Object.create(e));
				}
			}
		}
		else {
			for (i = 0; i < d.length; i++) {//bėgam per eilutes
				var toReplace = cnt.findProperty("iD", d[i][0]);
				for (y = 1; y < c.length; y++) {//bėgam per stulpelius
					toReplace.set(f[y], d[i][y]);
				}
			}
		}
		if (p.toAppend) { oData.Data.length = 0; } //
		return cnt;
	},
	setToPlace: function (toAppend, e, cnt) {//toAppend:{"sort":"asc/desc","col":"date"}
		var col = toAppend.col, fn, before;
		if (toAppend.sort === "desc")
			fn = function (index, item) { if (item.get(col) <= e[col]) { before = index; return false; } }
		else {
			fn = function (index, item) { if (item.get(col) >= e[col]) { before = index; return false; } }
		}
		$.each(cnt, fn);
		cnt.insertAt(before, Em.Object.create(e));
	},
	load: function (objName, execOnSuccess) {
		if (!this.get("exists").call(this, objName)) {//jei neturim sito objekto tai atsisiunciam
			var setter = this.get("SET"), emBuilder = this.get("emBuilder");
			var me = this;
			$.ajax({
				url: this.get("listUrl")[objName],
				dataType: 'json',
				type: 'POST',
				success: function (json) {
					setter.call(me, objName, json[objName]);
					var emData = emBuilder.call(me, { newData: json[objName].Data, tblName: objName, toAppend: true }); //{newData:newData, tblName:tblName, toAppend:{"sort":"asc/desc","col":"date"}}
					execOnSuccess(emData); //čia įkišam json'ą
				}
			});
		} else throw new Error(objName + "  already loaded");
	},
	exists: function (objName, mustBe) {
		//if (this.get("listUrl")[objName]) {return typeof (this.Obj[objName]) !== "undefined";}
		//else {this.get("fnErr")(objName);}
		return typeof (this.Obj[objName]) !== "undefined";
	},
	fnErr: function (objName, msg) {
		if (msg) {
			throw new Error(msg);
		}
		else {
			throw new Error("No object '" + objName + "' in oDATA.listUrl;");
		}
	},
	fnLoadNext: function () {
		oGLOBAL.logFromStart("Pradedu apdorot fnLoadNext");
		this.fnLoad({ url: "Main/tabAccidents" });
		oGLOBAL.logFromStart("Baigiau apdorot fnLoadNext");
	},
	fnLoad: function (p) {//url:url, callBack:callBack
		var start = new Date().getTime(), setter = this.get("SET"), emBuilder = this.get("emBuilder"), me = this, obj;
		$.ajax({
			url: p.url, dataType: 'json', type: 'POST',
			success: function (json) {
				if (json.jsonObj) {
					$.each(json.jsonObj, function (objName, value) {
						console.log("New jsonObj:" + objName);
						setter.call(me, objName, value);
						emBuilder.call(me, { newData: value.Data, tblName: objName, toAppend: true }); //{oData, toAppend:{"sort":"asc/desc","col":"date"}}
					});
				}
				if (json.templates) {
					$.each(json.templates, function (objName, value) {
						console.log("New template:" + objName);
						Em.TEMPLATES[objName] = Em.Handlebars.compile(value);
						//kitas variantas: http://stackoverflow.com/questions/8659787/using-pre-compiled-templates-with-handlebars-js-jquery-mobile-environment
					});
				}
				if (json.Script) {
					if (json.Script.File) $.getScript(json.Script.File);
					//if (json.Script.oSCRIPT) return this.oSCRIPT = jsRes.Script.oSCRIPT;
				}
				if (p.callBack) p.callBack();
			}
		});
	},
	// fnWriteVersions: function() {
		// if (localStorage){
			// localStorage["Lists/topNew_ver"]="1";		
			// localStorage["Admin/edit"]="1";		
		// }
	// },
	executed:{},//čia įsimenam kas buvo klikinta (tie turės viską atsisiuntę
	fnLoad2: function (p) {
		//url:url,callBack:callBack, checkObj:checkObj //checkObj:checkObj[nebūtinas] - pagal juos tikrinam ar reikia siustis ir ar reikia objekto
		if (!localStorage)throw new Error("No localStorage in Browser");
		//užsikraunant įrašom localStorage["topNew_ver"] versijas ir siunčiam ar atitinka, jei neatitinka grazinam tuos objektus
		//scripta užkraunam atsakydami, kontroleryj versijos kontroliuojamos "/controller/action?ver=123"
		//if (!p.checkFn) console.error("oDATA.fnLoad without checkFn");	
		
		
		var start = new Date().getTime(), setter = this.get("SET"), emBuilder = this.get("emBuilder"), me = this, obj;
		var finished=function (start,msg){console.warn("Started '"+ p.url+"'. "+msg+". Time,ms:" + (new Date().getTime() - start));if (p.callBack) p.callBack();}	

		
		if  (this.executed[p.url]){//jei jau buvo klikinta, nieko siųst nereikia
			finished(start,"Second click no need to load.");
		}else{
			var url=p.url, dataPars={
				ver: localStorage[url],
				tmp:(localStorage[url]?false:true),
				obj:(oDATA.GET(p.checkObj)?false:true)
			}
			$.ajax({
				url: p.url, dataType: 'json', type: 'POST', data: dataPars,
				success: function (json) {
					if (json.jsonObj) {
						$.each(json.jsonObj, function (objName, value) {
							console.log("New jsonObj:" + objName); setter.call(me, objName, value);							
							emBuilder.call(me, { newData: value.Data, tblName: objName, toAppend: true }); //{oData, toAppend:{"sort":"asc/desc","col":"date"}}
						});
					}
					if (json.templates) {
						$.each(json.templates, function (objName, value) {
							console.log("New template:" + objName);
							if (!value){ value=localStorage[objName]; }//Jei nėra imam iš localStorage					
							else {localStorage[objName]=value;}				
							if (!Em.TEMPLATES[objName]){Em.TEMPLATES[objName] = Em.Handlebars.compile(value);}//kitas variantas: http://stackoverflow.com/questions/8659787/using-pre-compiled-templates-with-handlebars-js-jquery-mobile-environment						
						});
					}
					if (json.Script) {
						if (json.Script.File) {
							//if (localStorage[localStorage[objName]]) new Function ("var1","var2","functionBody");
							console.log("Downloading js file - "+json.Script.File);
							$.ajaxSetup({ cache: true });
							$.getScript(json.Script.File, function(){
								finished(start,"First click, script loaded.");
							});
						}else{finished(start,"First click, no script.");}
					}
					localStorage[url]=json.ver;//išsaugom versija	
					oDATA.executed[url]=(new Date()).getTime();
				}
			});
		}	
	}
});
/**************************************************************************************************************************
*/
Ember.ResourceController = Ember.ArrayController.extend(Ember.ResourceAdapter, {
	list: [{
		"vehicles": ""
	}, {
		"proc_Accidents": "Accident/AccidentsList"
	}],
	init: function () {
		this._super();
		var me = this, tbl = me.get("tableName");
		if (tbl === "?") {
			me.set("loadStatus", "ok");
		} else {
			console.log("loading new table" + tbl);
			me.set("loadStatus", "loading")
			oDATA.load(tbl, function (emData) {
				oGLOBAL.logFromStart("Data recieved in controller - '" + me.get("tableName") + "' ");
				//if (json.Data) {
				me.set("content", emData);
				//me.get("setContent").call(me, { data: json.Data, toAppend: true });
				//json.json=me.get("content");
				me.set("loadStatus", "ok");
				//}
				//else {
				//	throw new Error("json need to have data in ResourceController;");
				//}
			});
			me.set("loadStatus", "loading");
		}
	},
	content: [], //overridinam
	tableName: Ember.required(),
	cols: null,
	config: null,
	grid: null,
	path: null,
	loadStatus: null,
	getByID: function (id) {
		var r = this.get("content").findValueByID(id);
		if (!r) {throw new Error("Didn't found arr value in getById, id -" + id);}		
		return r;
	},
	setNewVal: function (p) {
		if (Em.typeOf(p.newVal[0]) !== "array") {p.newVal = [p.newVal];}
		var me = this;
		if (p.fieldsToInt) {
			p.newVal.forEach(function (val, index) {
				val.arrElementToInt(p.fieldsToInt)
			});
		} //paverciam i intigerius
		oDATA.emBuilder.call(me, { newData: p.newVal, tblName: me.tableName, toAppend: p.toAppend });
		//me.get("setContent").call(me, { data: p.newVal, toAppend: p.toAppend });
		return p.newVal; //grazinam array
	},
	refreshContent: function () {
		if (!this.get("content").length) {
			this.getAll(url);
		}
		else {
			alert("Not populated");
		}
	},
	getAll: function (url) { //loadinam per init, tai šitas nereikalingas ko gero
		var self = this;
		return this._resourceRequest({
			type: 'POST',
			url: url
		})		//, complete: callBack
		  .done(function (json) {
		  	self.set("loadStatus", "ok");
		  	var tbl = json[self.get('tableName')];
		  	//oDATA.SET(
		  	if (tbl.Data) {
		  		self.set("content", tbl.Data);
		  	}
		  	if (tbl.cols) {
		  		self.set("cols", tbl.cols);
		  	}
		  	if (tbl.config) {
		  		self.set("config", tbl.config);
		  	}
		  	if (tbl.grid) {
		  		self.set("grid", tbl.grid);
		  	}
		  	console.log("data loaded");
		  	//Ember.run.next(function () { self.set("loaded", true); });
		  });
	}
});

var SERVER = {
	update2: function (p){
		//nereikia callbacko, updatina jsonObj, todėl papildomai reikia "source"(oDATA pavadinimas) ir "row" //oDATA.GET("proc_Vehicles").emData
		//SERVER.update2({"Action":Action,DataToSave:{},"Ctrl":Ctrl,"source":source,"row":row
		if (!p.DataToSave) return false;
		var CallBack={Success:function (resp, updData){
				var Adding=(p.Action==="Add")?true:false, Row=(Adding)?Em.Object.create({}):p.row;
				if(!Row) throw new Error("p.Row is empty");
				var oData=oDATA.GET(p.source), Cols=oData.Cols;
				if(!oData) throw new Error("p.oData is empty");	
				if (Adding) { Row.iD=resp.ResponseMsg.ID; }
				
				Cols.forEach(function(col,i){//Eina per esamus laukus
					var ok=false, fieldName=col.FName.firstSmall();  //f=col.FName, f.slice(0, 1).toLowerCase() +f.slice(1);
					updData.DataToSave.Fields.forEach(function(updateField,i2){//Randam ar yra col tarp updatinamu
						if (col.FName==updateField) {
							var newVal=updData.DataToSave.Data[i2];
							Row.set(fieldName,newVal); ok=true;
							if (col.List){//Jeigu List, updatinam ir teksto lauka
								var updateCol=Cols.findObjectByProperty("IdField",fieldName);
								if (updateCol){
									var field=updateCol.FName.firstSmall(),newVal1=oDATA.GET(col.List.Source).emData.findObjectByProperty("iD",newVal).MapArrToString(col.List.iText, true);
									Row.set(field,newVal1);
									//Row[updateCol.FName.firstSmall()]=oDATA.GET(col.List.Source).emData.findObjectByProperty("iD",newVal).MapArrToString(col.List.iText, true);
								}else{console.error("List field '"+updateField+"' without IdField");}
							}
						}
					});
					if (!ok&&(Adding&&fieldName!=="iD")){//Jeigu naujos pridejimas ir nerado, ikisam ka nors
							//if (col.IdField){								
							//	var infoRow=Cols[col.IdField];
							//	var source=infoRow.List.Source;
							//	var Field=infoRow.FName;
							//	var id=oGLOBAL.helper.getData_fromDataToSave(updData.DataToSave,Field);							
							//	Row.set(fieldName,oData.emData.findProperty("iD", id).MapArrToString(infoRow.List.iText, false));
							//}else
							if (col.Default)													
								if (col.Default==="Today"){Row.set(fieldName,oGLOBAL.date.getTodayString());}
								else if (col.Default==="UserName"){Row.set(fieldName,UserData.Name());}
								else if (col.Default==="UserId"){Row.set(fieldName,UserData.Id());}
								else Row.set(fieldName,col.Default);
							else {Row.set(fieldName,"");}	
					}
					console.log("col: "+col.FName+", ok: "+ok+", fieldValue:" +Row[fieldName])
				})					
				if(Adding){Row.set("visible",true);oData.emData.pushObject(Row);}
				else{oData.emData.findProperty("iD",Row.iD).updateTo(Row);}
				var  controller=updData.controller,emObject=(updData.emObject)?updData.emObject:"content";
				if (controller) {//Updatinam ir į pagrindinį kontrolerį tik insertinant (kiti updatinasi
					if(Adding){App[controller][emObject].pushObject(Row);}
					//else{App[controller][emObject].findProperty("iD",Row.iD).updateTo(Row);}				
				}
				Em.run.next(function (){$("img.spinner").remove();});				 
				if (p.CallBackAfter){p.CallBackAfter(Row);}
			}
		};
		$.extend(p,{CallBack:CallBack});
		this.update(p);			
	},
	update: function (p) {
		//Action, DataToSave:{}, callBack:{Success:??,Error:??}, Msg:{Title:??,Success:??,Error:??,BlockCtrl:??}
		//DataToSave: Add - {Data[],Fields[],DataTable,Ext}
		//Edit - {id,Data,Fields,DataTable,Ext}
		//Delete - {id,DataTable,Ext}
		//UpdateServer: function(Action, DataToSave, tblToUpdate, callBack, Ext) {
		//Wait.Show(); //Action-Delete,Add,Edit
		////////////if(typeof p.DataToSave.Ext=='undefined') { DataToSave["Ext"]=(Ext)?Ext:''; } //Ext pagal nutylejima ateina is DataToSave.Ext
		var url = "/Update/" + p.Action, updData = p; //{ "Action": p.Action, "DataToSave": p.DataToSave, "CallBack": p.CallBack, "Msg": p.Msg, "Ctrl":Ctrl};
		//url=(p.url)?p.url:("/Update/"+p.Action); //Add/Edit.Delete
		//log('<p style="color:green"><div>CallServer. Action:'+p.Action+'</div><div>DataToServer:'+JSON.stringify(p.DataToSave)+'</div> url:'+url+'</p>');
		SERVER.send(JSON.stringify(p.DataToSave), this.fnUpdated, updData, url, "json");
		////CallServer(JSON.stringify({ id: id, DataObject: _SD.Config.tblUpdate }), obj.fnResponse_DeleteUser, anSelected, '/'+_SD.Config.Controler+'/Delete', 'json');
	},
	send: function (JSONarg, CallFunc, updData, url,  dataType) {
		///<summary>Sends data to server (JSONarg), and call function CallFunc(Response,updData)</summary>
		///<param name="JSONarg">Json. To parse from javascript - JSON.stringify(jsObject)</param>
		///<param name="CallFunc">Function to call. Example SetnewMenuData</param>
		///<param name="updData">example 'Darbuotojai'</param>
		///<param name="url">example '/[Controler]Tab/GetTab[Action]'</param>
		///<param name="dataType">JSONarg datatype 'json'|'html'|'texc'</param>
		///<returns type="calls_CallFunc(Response,updData)"/>
		if (updData.Ctrl) { $(updData.Ctrl).spinner({ position: 'center', img: 'spinnerBig.gif' }); }
		else $("div.content:first").spinner({ position: 'center', img: 'spinnerBig.gif' });
		if (!dataType) {
			dataType = 'json';
		}
		//if (typeof updData.Ctrl !== 'undefined') {
		//	if ($('#' + updData.Ctrl).length && $('#' + updData.Ctrl).html().length === 0) {
		//		var e = $('#' + updData.Ctrl), h = e.height();
		//		e.html("<center><img style='margin-top:" + h / 2.2 + "px;' src='/Content/images/ajax-loader.gif' alt='' /></center>");
		//	}
		//}
		oGLOBAL.notify.msg("", "Siunčiami duomenys..");
		$.ajax({
			type: "POST",
			url: url,
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
			},
			data: JSONarg,
			contentType: "application/json; charset=utf-8",
			dataType: dataType,
			erorr: function (msg) {
				//Wait.Hide();
				//if (msg.d ==="Er_Saving") //{ alert("Nepavyko išsaugoti duomenų. \n Bandykite dar kartą.."); } //return else
				{
					alert("Nepavyko prisijungti..");
				}
			},
			success: function (d) {
				//Wait.Hide();
				//try { var d = JSON.parse(d.Message); } catch (e) { ; }
				CallFunc(d, updData);
			},
			complete: function (jqXHR, textStatus) {
				$("div.content:first").spinner('remove');
			}
		});
	},
	fnUpdated: function (resp, updData) {  //updData["Action"]
		var titleFields = (updData.source)?oDATA.GET(updData.source).Config.titleFields:false, Title;
		if (titleFields){Title=(updData.row)?updData.row.MapArrToString(titleFields, true): "Duomenų keitimas."}	
		DefMsg = {
			Title: ((Title)?Title:"Duomenų keitimas."),
			Error: {
				Add: "Nepavyko išsaugot naujų duomenų.",
				Edit: "Nepavyko pakeisti duomenų.",
				Delete: "Nepavyko ištrinti duomenų."
			},
			Success: {
				Add: "Duomenys sėkmingai pridėti.",
				Edit: "Duomenys sėkmingai pakeisti.",
				Delete: "Duomenys ištrinti."
			}
		};
		var MsgObj = $.extend({}, DefMsg, updData.Msg), Msg,Sign,Type;
		if (resp.ErrorMsg) {
			Type="Error",Sign="img32-warning";
		} else {
			Type="Success",Sign="img32-check";
		}
		Msg = MsgObj[Type][updData.Action];
		if (Type==="Error"){Msg += " Klaida:\n" + resp.ErrorMsg;}
		if (updData.CallBack) {
			if (typeof updData.CallBack[Type] === 'function') {updData.CallBack[Type](resp, updData);}
		}		
		//$.growlUI(DefMsg.Title, Msg);
		oGLOBAL.notify.withIcon(DefMsg.Title, Msg, Sign);		
		return false;
	}
};

//App.peopleController = Ember.ArrayController.create({
//    findByName: function(name) {
//        var found = this.findProperty('name', name);
//        //console.log('found model %@'.fmt(found.id));
//        return found;
//    },
//    findByProperty: function(Property,Value) {
//        var found = this.findProperty(Property, Value);
//        return found;
//    }       
//});


//        var f=App.peopleController.findByName('John');    
//        console.log('found model %@'.fmt(f.id));
//        
//        f=App.peopleController.findByProperty('name','John');     
//        console.log('found model %@'.fmt(f.id));​