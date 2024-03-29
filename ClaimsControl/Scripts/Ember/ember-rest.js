/// <reference path="../Main/jquery-1.7.2-vsdoc.js" />
// $(function () {
	// Em.run.next(function () {
		// oGLOBAL.logFromStart("Ember finished.");
		// oDATA.fnLoadNext();
		// //oDATA.fnWriteVersions();
	// });
// });
$(window).load(function () {
	oGLOBAL.logFromStart("All finished.");
	$("body").spinner('remove');
});
$(oGLOBAL.logFromStart("DOM ready."));
var oDATA = Ember.Object.create({
	me: this,
	Obj: {},
	objNames:[],
	listTemplates: {},
	SET: function (objName, oINST) {
		this.Obj[objName] = oINST; if (!this.objNames.contains(objName)){this.objNames.push(objName);}
	},
	GET: function (objName) {
		if (this.Obj[objName]) return this.Obj[objName];
		else {//this.get("fnErr")("Object " + objName + " not downloaded yet.")
			console.warn("Object " + objName + " not downloaded yet."); return false;
		}
	},
	GetRow: function (id, tbl) {
		return this.GET(tbl).emData.findProperty("iD", id);
	},
//	NEED: function (objNames, fnExec) {//jei objektu nera siunciames ir kai turim executinam funkcija
//		var all_queued = false, noHits = 0, me = this;
//		objNames.forEach(function (objName) {
//			if (!this.get("exists").call(this, objName)) {//jei neturim sito objekto tai atsisiunciam
//				noHits++;
//				this.get("load").call(this, objName, function (json) {
//					noHits--;
//					if (all_queued && noHits === 0) fnExec();
//				});
//			}
//		}, this); //second parameter becomes this in the callback function
//		all_queued = true;
//	},
	execWhenLoaded: function (objNames, fnExec, context, timeoutId) {//jei objektu nera laukiam kol ateis
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
				oDATA.execWhenLoaded(objNames, fnExec, context,  tId)
			}, 200); return false;
		}
		else if (tId !== 0) { clearTimeout(tId); }
		//fnExec();
		fnExec.call(context);
	},
	emBuilder: function (p) {//{newData:newData, tblName:tblName, toAppend:{"sort":"asc/desc","col":"date"}}
		oData = oDATA.GET(p.tblName);
		if (!oData.emData) { oData.emData = []; }
		if (!p.newData) return;
		var d = p.newData, c = oData.Cols, f = [], n, i, y, cnt = oData.emData;
		for (i = 0; i < c.length; i++) {//Sudedam vardus, kad prasidetų nuo mažos raidÄ—s
			n = c[i].FName;
			f[f.length] = n.slice(0, 1).toLowerCase() + n.slice(1);
		};
		if (p.toAppend) {
			for (i = 0; i < d.length; i++) {//bÄ—gam per eilutes
				var e = {};
				for (y = 0; y < c.length; y++) {//bÄ—gam per stulpelius
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
			for (i = 0; i < d.length; i++) {//bÄ—gam per eilutes
				var toReplace = cnt.findProperty("iD", d[i][0]);
				for (y = 1; y < c.length; y++) {//bÄ—gam per stulpelius
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
					execOnSuccess(emData); //čia įkišam json'č…
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
	fnLoadMain: function () {
		//oGLOBAL.logFromStart("Pradedu apdorot fnLoadNext");
		this.fnLoad2({ url: "Main/tabMain" });
		//oGLOBAL.logFromStart("Baigiau apdorot fnLoadNext");
	},
	// fnLoad: function (p) {//url:url, callBack:callBack
		// var start = new Date().getTime(), setter = this.get("SET"), emBuilder = this.get("emBuilder"), me = this, obj;
		// $.ajax({
			// url: p.url, dataType: 'json', type: 'POST',
			// success: function (json) {
				// if (json.jsonObj) {
					// $.each(json.jsonObj, function (objName, value) {
						// console.log("New jsonObj:" + objName);
						// setter.call(me, objName, value);
						// emBuilder.call(me, { newData: value.Data, tblName: objName, toAppend: true }); //{oData, toAppend:{"sort":"asc/desc","col":"date"}}
					// });
				// }
				// if (json.templates) {
					// $.each(json.templates, function (objName, value) {
						// console.log("New template:" + objName);
						// Em.TEMPLATES[objName] = Em.Handlebars.compile(value);
						// //kitas variantas: http://stackoverflow.com/questions/8659787/using-pre-compiled-templates-with-handlebars-js-jquery-mobile-environment
					// });
				// }
				// if (json.Script) {
					// if (json.Script.File) $.getScript(json.Script.File);
					// //if (json.Script.oSCRIPT) return this.oSCRIPT = jsRes.Script.oSCRIPT;
				// }
				// if (p.callBack) p.callBack();
			// }
		// });
	// },
	executed: {}, //Čia įsimenam kas buvo klikinta (tie turės viską atsisiuntę
	fnLoad2: function (p) {
		//url:url,callBack:callBack
		//ctrl: uzdedam, kad siunciasi
		if (!localStorage) throw new Error("No localStorage in Browser");
		//užsikraunant įrašom localStorage["topNew_ver"] versijas ir siunčiam ar atitinka, jei neatitinka grazinam tuos objektus
		//scripta užkraunam atsakydami, kontroleryj versijos kontroliuojamos "/controller/action?ver=123"
		//if (!p.checkFn) console.error("oDATA.fnLoad without checkFn");	

		var start = new Date().getTime(), setter = this.get("SET"), emBuilder = this.get("emBuilder"), me = this;
		var finished = function (start, msg) { 
			//console.warn("fnLoad2 started '" + p.url + "'. " + msg + ". Time,ms:" + (new Date().getTime() - start)); 
			if (p.callBack) p.callBack();
		}
		if (p.ctrl) { $(p.ctrl).spinner(); } else {$('body').spinner();}
		var wasLoaded=(p.name)?("ver_"+p.name):p.url;	//ar reikia antra kart kviest		
		if (this.executed[wasLoaded]&&!p.runAllways) {//jei jau buvo klikinta, nieko siųst nereikia(nebent reikia)
			finished(start, "Second click no need to load.");
			$("img.spinner").remove();
		} else {
			var dataPars = {
				ver: (localStorage[wasLoaded])?localStorage[wasLoaded]:0//Versijos Nr
				//tmp: (localStorage[wasLoaded] ? false : true),
				//obj: (oDATA.GET(p.checkObj) ? false : true)
			}
			if (p.name) { dataPars.name=p.name;}
			if (p.dataPars){$.extend(dataPars,p.dataPars);}//Papildomi parametrai
			$.ajax({
				url: p.url, dataType: 'json', type: 'POST', data: dataPars,
				success: function (json) {
					if (json.system){
						if (json.system.resObj){App.Lang=JSON.parse(json.system.resObj);}
					}
					if (json.jsonObj) {
						$.each(json.jsonObj, function (objName, value) {
							//console.log("New jsonObj:" + objName); setter.call(me, objName, value);
							objName=(p.name)?p.name: objName;//obj pavadinimas
							setter.call(me, objName, value); 
							emBuilder.call(me, { newData: value.Data, tblName:objName, toAppend: true }); //{oData, toAppend:{"sort":"asc/desc","col":"date"}}
							if (objName==="userData"){App.userData=oDATA.GET("userData").emData[0];}//dėl patogumo
						});
					}
					if (json.templates) {
						$.each(json.templates, function (objName, value) {
							//console.log("New template:" + objName);
							objName=(p.name)?p.name: objName;//tmp pavadinimas bus koks ir objekto, nebent, mes nurodom parametra 'name'
							if (!value) { value = localStorage[objName]; } //Jei nėra imam iš localStorage		
							else { 
								if (wasLoaded===objName){debugger;}
								localStorage[objName] = value; 
							}
							if (!value) console.error("No template " + objName);
							if (objName.slice(0,4)==="tmp2") {//tmpl template naudojama file uploads
								$("body").append('<script id="'+objName+'" type="text/x-tmpl">'+value+'</script>');
							} else {
								if (!Em.TEMPLATES[objName]) { Em.TEMPLATES[objName] = Em.Handlebars.compile(value); } //kitas variantas: http://stackoverflow.com/questions/8659787/using-pre-compiled-templates-with-handlebars-js-jquery-mobile-environment						
							}
						});
					}
					if (json.Script) {
						if (json.Script.File) {
							//if (localStorage[localStorage[objName]]) new Function ("var1","var2","functionBody");
							console.log("Downloading js file - " + json.Script.File);
							$.ajaxSetup({ cache: true });
							$.getScript(json.Script.File, function () {
								finished(start, "First click, script loaded.");
							});
						} 
					} else{//Jei yra scriptas callBack executinam tik po scripto užkrovimo (viršuj), šiuo atveju nėra, taigi executinam čia
						finished(start, "First click, no script.");
					}
					localStorage[wasLoaded] = json.ver; //Isaugojam, kad antra kart nekviest tos pacios akcijos arba url	
					oDATA.executed[wasLoaded] = (new Date()).getTime();
				},
				error:function(xhr,x,y){
					console.log(xhr.responseText);
					debugger;
					window.location='/Account/Logon';// App.router.location.lastSetURL
					//document.location.href = '/account/login';
				},
				complete:function(xhr,x,y){
					//window.location='/Account/Logon';
					$("img.spinner").remove();
				}
				
			});
		}
	}
});
/**************************************************************************************************************************
*/
Ember.ResourceController = Ember.ArrayController.extend(Ember.ResourceAdapter, {
	//	list: [{
	//		"vehicles": ""
	//	}, {
	//		"proc_Accidents": "Accident/AccidentsList"
	//	}],
	//	init: function () {
	//		this._super();
	//		var me = this, tbl = me.get("tableName");
	//		if (tbl === "?") {
	//			me.set("loadStatus", "ok");
	//		} else {
	//			console.log("loading new table" + tbl);
	//			me.set("loadStatus", "loading")
	//			oDATA.load2(tbl, function (emData) {
	//				oGLOBAL.logFromStart("Data recieved in controller - '" + me.get("tableName") + "' ");
	//				//if (json.Data) {
	//				me.set("content", emData);
	//				//me.get("setContent").call(me, { data: json.Data, toAppend: true });
	//				//json.json=me.get("content");
	//				me.set("loadStatus", "ok");
	//				//}
	//				//else {
	//				//	throw new Error("json need to have data in ResourceController;");
	//				//}
	//			});
	//			me.set("loadStatus", "loading");
	//		}
	//	},
	init: function () {
		this._super();
		var me = this, url = me.get("url");	
		if (url)	oDATA.fnLoad2({ 
				url: url,
				callBack: function () {
					if (me.tableName) {
						me.set("content", oDATA.GET(me.tableName).emData);				
					}
			}
		});
	},
	content: [], //overridinam
	tableName: null,
	cols: null,
	config: null,
	grid: null,
	path: null,
	loadStatus: null,
	getByID: function (id) {
		var r = this.get("content").findValueByID(id);
		if (!r) { throw new Error("Didn't found arr value in getById, id -" + id); }
		return r;
	},
	setNewVal: function (p) {
		if (Em.typeOf(p.newVal[0]) !== "array") { p.newVal = [p.newVal]; }
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
	update3: function(p){//paprasta fn tik gražinanti atsakymą - p={pars:{},CallBack(JsonResp:{ErrorMsg,ResponseMsg},pars):fn),url:'/Account/NewPassword'}
		updData=(p.ctrl)?($.extend({},p.pars,p.ctrl)):p.pars
		this.send(p.pars, p.CallBack, updData, p.url);
	},
	update2: function (p) {
		//nereikia callbacko, updatina jsonObj, todėl papildomai reikia "source"(oDATA pavadinimas) ir "row" //oDATA.GET("proc_Vehicles").emData
		//jei nėra Ctrl, nerodo rutuliuko
		//SERVER.update2({"Action":Action,DataToSave:{},"Ctrl":Ctrl,"source":source,"row":row
		if (!p.DataToSave) return false; var me=this;
		var CallBack = { Success: function (resp, updData) {
			var oData = oDATA.GET(p.source),id=(updData.Action==="Add")?resp.ResponseMsg.ID:p.DataToSave.id,Row={},obj={};
			if (p.Action==="updateRelations"){
				var idField=p.DataToSave.idField.firstSmall(),field=p.DataToSave.Field.firstSmall(), filtered=oData.emData.filter(function(i){return i[idField]!==id;})
				var newArr=p.DataToSave.Data.map(function(i){ var o={};o[idField]=id;o[field]=i;  return Em.Object.create(o);})
				//console.log("New relations array:");console.log(newArr);
				var joined=filtered.concat(newArr),newNo=joined.length; oData.emData=joined;
				var docsTbl=(p.source==="tblDocsInActivity")?"proc_Activities":"proc_Finances";
				oDATA.GET(docsTbl).emData.findProperty("iD",id).set("docs",((newNo===0)?"":newNo));//Atnaujinam dokumentų skaičių
			} else {
				Row =(p.Action === "Add")?Em.Object.create({}):p.row;  obj=(updData.Action==="Add")?oGLOBAL.helper .emData_fromDataToSave(p.DataToSave,id):oData.emData.findProperty("iD", id);  
				if (p.source==="proc_Drivers"){//Panaikinam dublicatus prieš jei du, nes galejo keistis, po jei du ir daugiau uzdesim
					var dublicates=oData.emData.filter(function(item){
						return item.firstName===obj.firstName && item.lastName===obj.lastName;
					});
					if (dublicates.length===2){dublicates.map(function(i){i.notUnique=false;});}
				}		
				if (p.DataToSave.id&&!Row){//when we have id we can find Row if missing
					Row=oData.emData.findProperty("iD",p.DataToSave.id);
				}
				if (updData.Action==="Delete"){	
					oData.emData.removeObject(obj)				
				}else{
					var Adding = (p.Action === "Add") ? true : false;
					if (!Row) throw new Error("p.Row is empty");
					var  Cols = oData.Cols;
					if (!oData) throw new Error("p.oData is empty");
					if (Adding) { Row.iD = resp.ResponseMsg.ID; }

					Cols.forEach(function (col, i) {//Eina per esamus laukus
						var ok = false, fieldName = col.FName.firstSmall();  //f=col.FName, f.slice(0, 1).toLowerCase() +f.slice(1);
						updData.DataToSave.Fields.forEach(function (updateField, i2) {//Randam ar yra col tarp updatinamu
							if (fieldName == updateField.firstSmall()) {
								//debugger;
								var newVal = updData.DataToSave.Data[i2];
								if  (col.Type) {
									if (col.Type==="Decimal") {newVal=parseFloat(newVal,10);}
									var newVal2=newVal.toString().toLowerCase();
									if ((col.Type==="Integer"||col.Type==="Radio"||col.Type==="Boolean") && !(newVal2==="false"||newVal2==="true")){newVal=parseInt(newVal,10);}//bit'a gaunam kaip toki, tai praleidziam
									if(typeof newVal==="number"){if(isNaN(newVal)){newVal="";}}//Viršutinės 2 eilutės gali tokį padaryt 
								}else if (col.FName.slice(-2)==="ID"){newVal=parseInt(newVal,10);}
								Row.set(fieldName, newVal); ok = true;
								if (col.List) {//Jeigu List, updatinam ir teksto lauka
									var updateCol = Cols.findObjectByProperty("IdField", fieldName);
									if (updateCol) {
										var newVal1 = oDATA.GET(col.List.Source).emData.findObjectByProperty("iD", newVal).MapArrToString(col.List.iText, true);
										Row.set(updateCol.FName.firstSmall(), newVal1);
									} else { console.warn("List field '" + updateField + "' without IdField"); }
								}
							}
						});
						if (!ok && (Adding && fieldName !== "iD")) {//Jeigu naujos pridejimas ir nerado, ikisam ka nors
							if (col.Default) {
								var u=oDATA.GET('userData').emData[0];
								if (col.Default === "Today") { Row.set(fieldName, oGLOBAL.date.getTodayString()); }
								else if (col.Default === "UserName") { Row.set(fieldName, u.userName); }
								else if (col.Default === "UserId") { Row.set(fieldName, u.userID); }
								else Row.set(fieldName, col.Default);
							} else { 
								//debugger;
								// if  (col.IdField) {		
									// var infoRow=Cols.getColByFName (col.IdField), source=infoRow.List.Source,Field=infoRow.FName;
									// var i=updData.DataToSave.Fields.findIndexByVal(Field,true),iDVal=updData.DataToSave.Data[i];
									// Row.set(fieldName,oDATA.GET(source).emData.findProperty("iD", iDVal).MapArrToString(infoRow.List.iText, false));
								// }else 
								//if(fieldName==="docs"){Row.set("docs", "(0)");}else {}
								Row.set(fieldName, ""); 
							}
						}
						console.log("col: " + fieldName + ", ok: " + ok + ", fieldValue:" + Row[fieldName])
					})
					if (p.source==="proc_Drivers"){//dublikatus tikrinam prieš ir po
						var confirm; dublicates=oData.emData.filter(function(item){return item.firstName===Row.firstName && item.lastName===Row.lastName;});
						if (dublicates.length<2){confirm=false;}else{confirm=true;}
						dublicates.map(function(i){i.notUnique=confirm;});Row.notUnique=confirm;
					}				
					if (Adding) { 
							Row.set("visible", true); 
							oData.emData.unshiftObject(Row);//Į pradžią
							//if  (p.source==="proc_Activities"||p.source==="proc_Finances") {oData.emData.unshiftObject(Row);}
							//else {oData.emData.pushObject(Row); } 
					}
					else { oData.emData.findProperty("iD", Row.iD).updateTo(Row); }
					var controller = updData.controller, emObject = (updData.emObject) ? updData.emObject : "content";
					if (controller) {//Updatinam ir į pagrindinį kontrolerį tik insertinant (kiti updatinasi
						if (Adding) { App[controller][emObject].unshiftObject(Row); }
						else{App[controller][emObject].findProperty("iD",Row.iD).updateTo(Row);}				
					}
				}
			}
			Em.run.next(function () { $("img.spinner").remove(); });
			if (p.CallBackAfter) { p.CallBackAfter(Row,updData.Action,resp,updData); }
		}
		};
		$.extend(p, { CallBack: CallBack });
		if  (!p.Ctrl){p.Ctrl="";}
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
		SERVER.send(p.DataToSave, this.fnUpdated, updData, url);
		////CallServer(JSON.stringify({ id: id, DataObject: _SD.Config.tblUpdate }), obj.fnResponse_DeleteUser, anSelected, '/'+_SD.Config.Controler+'/Delete', 'json');
	},
	send: function (JSONarg, CallFunc, updData, url, dataType) {
		///<summary>Sends data to server (JSONarg), and call function CallFunc(Response,updData)</summary>
		///<param name="JSONarg">Json. To parse from javascript - JSON.stringify(jsObject)</param>
		///<param name="CallFunc">Function to call. Example SetnewMenuData</param>
		///<param name="updData">example 'Darbuotojai'</param>
		///<param name="url">example '/[Controler]Tab/GetTab[Action]'</param>
		///<param name="dataType">JSONarg datatype 'json'|'html'|'texc'</param>
		///<returns type="calls_CallFunc(Response,updData)"/>
		if (!dataType){dataType='json';}
		if  (typeof  JSONarg!=="string"){JSONarg=JSON.stringify(JSONarg);}
		if (updData.Ctrl) { $(updData.Ctrl).spinner({ position: 'center', img: 'spinnerBig.gif' }); }
		//else if (updData.Ctrl!==""){$("div.content:first").spinner({ position: 'center', img: 'spinnerBig.gif' });}

		if (!dataType) {dataType = 'json';}
		//oGLOBAL.notify.msg("", "Siunčiami duomenys..");
		$.ajax({
			type: "POST",
			//contentType: "charset=utf-8",
			url: url,
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
			},
			data: JSONarg,
			contentType: "application/json; charset=utf-8",
			dataType: dataType,
			error: function (msg) {
				debugger;
				console.warn(msg);
				window.location='/Account/Logon';// App.router.location.lastSetURL
			},
			success: function (d) {
				//Wait.Hide();
				//try { var d = JSON.parse(d.Message); } catch (e) { ; }
				CallFunc(d, updData);
			},
			complete: function (jqXHR, textStatus) {
				//$("div.content:first").spinner('remove');
				$("img.spinner").remove();
			}
		});
	},
	fnUpdated: function (resp, updData) {  //updData["Action"]
		var titleFields = (updData.source) ? oDATA.GET(updData.source).Config.titleFields : false, Title = "Duomenų keitimas.";
		if (titleFields) {
			if (updData.row){Title = (updData.row.iD) ? updData.row.MapArrToString(titleFields, true) : "Duomenų keitimas.";}
		}
		DefMsg = {
			Title: (Title || updData.Title || "Duomenų keitimas"),
			Error: {
				Add: "Nepavyko išsaugot naujų duomenų.",
				Edit: "Nepavyko pakeisti duomenų.",
				Delete: "Nepavyko ištrinti duomenų."
			},
			Success: {}
			/*,	Add: "Duomenys sėkmingai pridėti.",
				Edit: "Duomenys sėkmingai pakeisti.",
				Delete: "Duomenys ištrinti."
			}*/
		};
		var Msg, Sign, Type, notExpires;
		if (resp.ErrorMsg) { Type = "Error", Sign = "img32-warning", notExpires = true; }
		else { Type = "Success", Sign = "img32-check", notExpires = false; }

		Msg = (updData.Msg)?updData.Msg[Type]:DefMsg[Type][updData.Action];
		if (!Msg) Msg="";//Jei kitas duomenų tipas
		if (Type === "Error") { Msg += " Klaida:\n" + resp.ErrorMsg; }
		if (updData.CallBack) {
			if (typeof updData.CallBack[Type] === 'function') { updData.CallBack[Type](resp, updData); }
		}
		if (resp.ErrorMsg) { oGLOBAL.notify.withIcon(DefMsg.Title, Msg, Sign, notExpires);}
		return false;
	},
	updateRecord: function (url,JSONarg, objName,Action,CallBack) {
	/*Skirta updatinti naujus arba redaguotus recordus. Normaliai updatinasi per update2, bet claimsuose negaunam to recordo*/
		$.ajax({
			type: "POST",url: url,data: JSONarg,dataType: 'json',
			error: function (msg) {
				debugger;
				console.warn(msg);
			},
			success: function (d) {
				var obj=oDATA.GET(objName), cols=obj.Cols, row=Em.Object.create({});
				cols.forEach(function(col,i){
					row[col.FName.firstSmall()]=d.data.Data[0][col.FName];
				})
				row.visible=true;
				if (objName==="proc_Claims"){//nauja claima updatinam jei jau sugeneruota lentele
					var ctrl=App.claimsController;
					if (ctrl.content.length){ctrl.setClaimContext(row);}
				}
				if (Action=="Add"){
					obj.emData.unshiftObject(row);
				}else{
					obj.emData.findProperty("iD",row.iD).updateTo(row);
				}
				if (CallBack){CallBack();}
			}
		});
	}
};