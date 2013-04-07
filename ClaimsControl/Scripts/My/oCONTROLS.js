/// <reference path="../Main/jquery-1.7.2-vsdoc.js"/>
var oCONTROLS = {
	UpdatableForm_reset: function (frm) {//resetinam į buvusias reikšmes
		$(frm).find(".UpdateField").each(function () {
			var e = $(this), eOpt = e.data('ctrl'), isList = ((e.data("ctrl").Type === "List") ? true : false),
				val = eOpt.Value;
			if (e.attr("type") === "checkbox") {
				e.attr("checked", val);
			}
			else if (e.is("textarea")) { e.html(val); }
			else if (isList) {
				if ($.isNumeric(val)) {
					e.data("newval", val);
					//Array.prototype.findColValuesByID = function (ID, ArrValuesCol)
					e.val(oDATA.GET(e.data("ctrl").Source).Data.findColValuesByID(val, eOpt.iText));
				}
			}
			else {
				e.val(val);
			}
		});
	},
	UpdatableForm_toSaved: function (RecId, frm, OtherDataToSave) {//Darasom, value kiekvienam
		if (OtherDataToSave) {
			SERVER.update({
				Action: "Edit",
				DataToSave: OtherDataToSave
			});
		}

		if (RecId) {//Darasom, kad tai ne naujas rec ir id, bei ijungiam controlsus, kurie nesimate kol nebuvo sukurtas irasas
			$.extend(frm.data("ctrl"), {
				NewRec: 0,
				id: RecId
			});
			// frm.find("span.Control, div.Control").each(function () {//renderinam swfUpload jei nera
				// var e = $(this), eOpt = e.data('ctrl');
				// if (eOpt.Control === "swfUpload" && e.children().length === 0) {
					// $.extend(e.data("ctrl"), {
						// RecId: RecId
					// }); //Darasom id
					// e[eOpt.Control](e.data("ctrl"));
				// }
			// });
		}
		frm.find('.UpdateField').each(function () {//Darasom Value
			var e = $(this), eOpt = e.data('ctrl'), val;
			if (e.attr("type") === "checkbox") {
				val = (e.attr("checked")) ? 1 : 0;
			}
			//else if(e.is("textarea")) { val=e.html(); }
			else if (e.is("input") && e.data("ctrl").Type === "List") {
				val = e.data("newval");
			}
			else {
				val = e.val();
			}
			$.extend(e.data("ctrl"), {
				Value: val
			});
		});
	},
	getValFromRow: function (field,row){
		var f=field.slice(0, 1).toLowerCase() + field.slice(1);
		return row[f];
	},
	UpdatableForm: function (p) {//{frm:frm,row:row,btnSaveToDisable:btnSaveToDisable}
	//Em.run.next({t:this,p:p},function(){
		//frm data-ctrl:: labelType:Top/Left/undefined,
		//var p=this.p, me=this.t;
		var sTitle = "", frmOpt = $(p.frm).data('ctrl'),btnSaveToDisable,me=this;
		if (p.row){ if (p.row.iD)  {frmOpt.NewRec=0;frmOpt.id=p.row.iD;}}//Jeigu yra p.row tai redagavimas
		if (frmOpt.NewRec==="0"){frmOpt.NewRec=0;}
		var data = (frmOpt.Source === 'NoData') ? "NoData" : oDATA.GET(frmOpt.Source);
		//if(typeof data==='undefined') { alert('Source undefined in UpdatableForm(objFunc:79)!'); }
		//log('<div>==========UpdatableForm========</div>');
		//var elements = $(p.frm).find('div.ExtendIt, span.ExtendIt');
		//      for(var i=0; i<elements.length; i++) {
		//      }
		var fnEnableSave=function(){	
			btnSaveToDisable.removeAttr("disabled", "disabled");	
		}
		if  (!frmOpt.NewRec) {
			if (p.btnSaveToDisable) { 
				if(p.btnSaveToDisable.length===1){
					btnSaveToDisable=p.btnSaveToDisable;if (btnSaveToDisable.is("button")){btnSaveToDisable.attr("disabled", "disabled");}else{console.error("btnSaveToDisable not button");}				
				} else {console.error("wrong btnSaveToDisable no: "+p.btnSaveToDisable.length);}}
			else console.warn("no btnSaveToDisable");
		}
		$(p.frm).find('div.ExtendIt, span.ExtendIt').each(function () {
			var e = $(this), eOpt = e.data('ctrl'), eHTML = '', ix = -1, data_ctrl = {};
			if (!eOpt) {return true;}
			//log("-------------------------------");
			//log("Elementas:"+e[0].tagName+"; id:"+e.attr("id")+"; klase:"+e.attr("class")+"; e.data('ctrl'):"+typeof e.data("ctrl"));
			if (typeof eOpt.Control !== "undefined") {
				if (eOpt.Control === "swfUpload" && typeof frmOpt.id === "undefined") {
					return true;
				} else {
					e[eOpt.Control](eOpt);
					return true;
				}
			} //swfUpload nerenderinam jei naujas dokumentas

			if (data !== "NoData") {
				var eCols = data.Cols;
				if (eOpt.Field) {
					for (var i = 0; i < eCols.length; i++) {
						if (eCols[i].FName === eOpt.Field) {
							ix = i;
							sTitle = data.Grid.aoColumns[i].sTitle;
							break;
						}
					}
					if (ix === -1) {
						console.error('Wrong Field indicated ' + eOpt.Field + ' in UpdatableForm(objFunc:84)!');
					}
				}
			}
			sTitle = (eOpt.sTitle) ? eOpt.sTitle : sTitle;
			//#region duomenu is data.Cols[ix] ir eOpt(elemento data('ctrl')) surasymas i data_ctrl arba i propercius
			var col = {}, input;
			if (data !== "NoData") {
				col = $.extend({}, data.Cols[ix]);
			} //Naujas objektas turi but
			col = $.extend(true, col, eOpt); //overridinu data.Cols<----e.data('ctrl')
			var Type = (col.Type) ? col.Type : ((col.List) ? "List" : ""); // (col.List)?"List":col.Type;
			if (Type === undefined) {alert("Nesusiparsino ctrl elemento objFunc.js-UpdatableForm (n�ra Type)");return true;}
			var AddToClasses = "ui-widget-content " //ui-corner-all
			AddToClasses += (e.hasClass("NotUpdateField")) ? " NotUpdateField" : " UpdateField";
			if (Type === 'Integer' || Type === 'Decimal') {AddToClasses += " number";}
			else if (Type === "List") {col.Type = "List";}
			else if (Type) {if (Type.search("Date") !== -1) {AddToClasses += " date";}}    //classes+' text', textarea,
			
			col.classes = (col.classes) ? col.classes + " " + AddToClasses : AddToClasses;
			if (typeof col.Value !== "number"&&typeof col.Value !== "boolean") {col.Value = (col.Value) ? col.Value.replace(/'/g, "\"") : "";} //Kitaip gaidinasi	
			for (var prop in col) {
				if (prop === 'List') {
					$.extend(data_ctrl, col[prop]);
				} //Listo propercius dedu vienam lygyje su kitais data_ctrl.Type="List";
				else if (prop === 'Value' || prop === 'Validity' || prop === 'AgrValidity' || prop === 'Tip' || prop === 'Field' || prop === 'Type' || prop === 'Ext' || prop === 'UpdateField' || prop === 'Editable') {
					data_ctrl[prop] = col[prop];
				}
			}
			if (p.row){var v =  me.getValFromRow(col.FName,p.row);
			
			if (v){data_ctrl.Value =  v; col.Value=v;}}
			if (Type === 'Integer' || Type === 'Decimal') {
				if (typeof  v ==="number"){data_ctrl.Value =  v; col.Value=v;}
				else if (v!==null&&typeof v!=='undefined'){data_ctrl.Value =  v; col.Value=v;}
			}else{
				if (v){data_ctrl.Value =  v; col.Value=v;}
			}		
			data_ctrl = JSON.stringify(data_ctrl);
			if (Type === 'Integer' || Type === 'Decimal') {
				data_ctrl = data_ctrl.replace("match('integer')", "match(integer)").replace("match('number')", "match(number)");
			}
			else if (Type.search("Date") !== -1) {
				data_ctrl = data_ctrl.replace("match('date')", "match(date)").replace("lessThanOrEqualTo(new Date())","lessThanOrEqualTo(new Date(),\\&quot;Data negali būti didesnė už šiandieną.\\&quot;)");
			}
			$.extend(col, {data_ctrl: data_ctrl}, {label: {"txt": sTitle,"type": col.labelType}});
			//var CtrlOpt={ "Value": Value, "data_ctrl": data_ctrl, "title": sTitle, "classes": classes, "id": id, "attr": attr, "label": { "txt": sTitle, "type": col.labelType} }
			if (Type === 'Boolean' || Type === 'checkbox') {
				eHTML = oCONTROLS.chk(col);
				$(eHTML).prependTo(e);
			}
			else if (Type === 'String' || Type === 'Email' || Type === "text" || Type === "textarea" || Type === "hidden") {
				var len = (typeof col.LenMax === 'undefined') ? 0 : col.LenMax;
				if (Type === "hidden") {
					eHTML += oCONTROLS.hidden(col);
					input = $(eHTML).prependTo(e).parent().find('input:first');
				} else if (len < 101 && Type !== "textarea") {
					eHTML += oCONTROLS.txt(col);
					input = $(eHTML).prependTo(e).parent().find('input:first');
				} else {
					eHTML += oCONTROLS.txtarea(col);
					input = $(eHTML).prependTo(e).parent().find('textarea:first');
				}
			}
			else if (Type === 'Integer' || Type === 'Decimal') {
				eHTML += oCONTROLS.txt(col);
				input = $(eHTML).prependTo(e).find("input:first");
			}
			else if (Type.search("Date") !== -1) {// Date DateNotMore DateNotLess DateNotMoreCtrl DateNotLessCtrl
				var isTime = 0;
				if (!col.Value && col.Default === "Today") {
					col.Value = oGLOBAL.date.getTodayString();
				}  //Jei col.Default.Today
				if (Type.search("Time") !== -1) {
					var TimeValue = (col.Value.length >= 16) ? col.Value.substring(11, 16) : "00:00";
					isTime = 1;
				}
				col.Value = col.Value.substring(0, 11);

				eHTML += oCONTROLS.txt(col);
				if (isTime) {
					eHTML += oCONTROLS.txt({Value: TimeValue,style: "margin:0 20px;",title: "Laikas",classes: "time ui-widget-content ui-corner-all"});
				} // UpdateField nereikia, nes..
				input = $(eHTML).prependTo(e).parent().find('input:first');
			}
			if (col.List) {
				if (input) {
					input.ComboBox();
				} else {
					eHTML += oCONTROLS.txt(col);
					input = $(eHTML).prependTo(e)
					.parent().find('input')
					.ComboBox();
				}
			}

			if (col.Plugin) {
				$.each(col.Plugin, function (name, value) {
					input[name](value);
				});
			}
			if (btnSaveToDisable){
				if (Type === 'Boolean' || Type === 'checkbox') {e.find("input:checkbox").on("change",fnEnableSave);}
				else if (col.List) {input.data("autocomplete").fnItemChanged=function(newId){fnEnableSave();}}
				else if (input){					
					if (input.hasClass("hasDatepicker")){
						input.on("keyup",fnEnableSave).datepicker("option", "onSelect",fnEnableSave);
						input.closest("div.ExtendIt").find("input.time").on("keyup",fnEnableSave);
					}
					else{input.on("keyup",fnEnableSave);}
				}
			}						
			if (typeof input !== 'undefined') {
				input.val($.trim(input.val()));
				if (Type === 'Integer' || Type === 'Decimal' || Type === 'Date') {
					input.ValidateOnBlur({
						Allow: Type
					});
				}
				if (typeof col.Tip !== 'undefined') {input.attr("placeholder", col.Tip)} 
			}
		});
		//log('<div>==========UpdatableForm========</div>');
	//});
	},
	ValidateForm: function (frm, DataToSaveAppend) { //Formos lauku validacija (pagal data-ctrl duomenis)
		$("div.validity-modal-msg").remove(); //panaikinam validacijos msg jei buvo
		var c = frm.data("ctrl"), id = parseInt(c.id, 10), NewRec = parseInt(c.NewRec, 10), DataTable = (c.tblUpdate) ? (c.tblUpdate) : (oDATA.GET(c.Source).Config.tblUpdate); //Updatinimui imam is markupo, jei nera is objekto
		if (!id & !NewRec) {
			console.error("Nėra nurodyta id formos data(ctrl)!");
		}
		//$.validity.setup({
		//    outputMode: "modal"
		//});
		$.validity.start();
		var DataToSave = {
			Data: [],
			Fields: [],
			DataTable: DataTable
		};
		$.each(frm.find(".UpdateField:visible"), function (i, v) {
			var e = $(v);
			var elDesc = e[0].tagName + ", id-" + e.attr("id"), Value, UpdateField = (e.data("ctrl").UpdateField) ? e.data("ctrl").UpdateField : false;
			if (e.data("ctrl") === undefined) {
				console.error("Nerasta data(ctrl),el: " + elDesc);
				return true;
			}
			var Type, FName = e.data("ctrl").Field, OldVal = (NewRec) ? '' : $.trim(e.data("ctrl").Value), val = '';
			if (e.attr("type") === "checkbox") {
				if (!NewRec) { OldVal = (!OldVal || OldVal === "False" || OldVal === "0") ? 0 : 1; } //leidžiam neupdatint checkbox'o tik jai ne naujas rekordas
				val = (e.attr("checked")) ? 1 : 0; // Type="CheckBox";
			} else {
				if (typeof e.data("ctrl").Type === 'undefined') {
					console.error("Nerastas elemento Tipas!");
					//log("<div style='color:red'>Nerastas elemento Tipas!</div>");
				} else {
					Type = e.data("ctrl").Type;
					var Validity = (e.data("ctrl").Validity) ? e.data("ctrl").Validity : "";
					if (Type === "hidden") {
						val = e.val();
					} else if (Type.substring(0, 4) == "Date") {
						Validity = (Validity.replace(/match\(date\)/g, "match('date')"));
						val = $.trim(e.val());
						if (val === "-") { val = ""; } //Datai leidžiam įrašyt ir tokį, kurį paskui panaikinam	
						if (Validity.indexOf("require") !== -1 || e.val() !== "") {//jei data neprivaloma ir ten nieko ner tai ok // $.validity.patterns.date.test(e.val())
							eval("$(this)." + Validity);
							if (Type.search(/time/i) > -1) {
								var TimeCtrl = e.parent().next()
								TimeCtrl.require().match(/^\d{2}[:]\d{2}$/, "Turi būti laiko formatas - valandos:minutės, pvz.12:30");
								val = val + " " + TimeCtrl.val() + ":00"; //Prie laiko pridedam valandas
							}
						}
					} else if (Type === "List") {
						if ($.isNumeric(e.data("newval"))) {
							val = e.data("newval");
						} //log("ui, val:"+(val)?"":val);
						else if (e.hasClass("notRequired")) {e.val("");}
						else {							
							e.val("");
							e.require("Parinkite reikšmę iš sąrašo.");
						}
					} else {
						if (Type === "Decimal" || Type === "Integer") {
							e.val(e.val().replace(/,/g, "."));
							Validity = Validity.replace(/match\(number\)/g, "match('number')").replace(/match\(integer\)/g, "match('integer')");
						}
						val = e.val();
						var CheckIt = (id) ? (OldVal != val ? true : false) : true; //Jei naujas tikrinam, jei senas tikrinam tik jei pasikeite
						var Require = Validity.search(/require/i) > -1;
						var NotEmpty = (val === "") ? false : true;

						if (CheckIt && (Require || NotEmpty)) {//Pasikeite reiksme && (Require arba Netuscias)
							if (Validity) eval("$(this)." + Validity);
						}
					}
				}
				if (typeof e.data("ctrl").AgrValidity !== 'undefined') {//Jeigu reikia uzpildyti viena is privalomu lauku
					var aVal = e.data("ctrl").AgrValidity;
					if (aVal.Validity === "require") {
						var Empty = $.map($(aVal.Selector), function (e, index) {
							return ($(e).val()) ? null : 1;
						});
						if (Empty.length === $(aVal.Selector).length) {
							e.require(aVal.Msg);
						}
					}
				}
			}
			if (OldVal != val || (val === 0 && OldVal === "")) {
				if (UpdateField) {
					DataToSave[UpdateField] = val;
				}
				else {
					DataToSave.Data.push(val);
					DataToSave.Fields.push(FName);
				} //Add to DataToSave
				//log("Save element: val-"+val+", OldVal-"+OldVal+", Type-"+Type);
			}
		});
		//[{ Fields: "AccidentID", Data: $('#tblClaims').data('ctrl').AccidentID }]
		//Pridedam papildomus parametrus kuriuos siunciam servui

		if (typeof (DataToSaveAppend) != 'undefined') {
			for (var i = 0; i < DataToSaveAppend.length; i++) {
				DataToSave.Data.push(DataToSaveAppend[i].Data);
				DataToSave.Fields.push(DataToSaveAppend[i].Fields)
			}
		}
		var ValRes = $.validity.end();
		if (ValRes.valid && DataToSave.Data.length) {
			if (!NewRec) {
				DataToSave["id"] = id;
			};
			return DataToSave;
		}
		else if (ValRes.valid) return 0//reiskia, kad niekas nepakeista
		else return false;
	},
	lbl: function (text) {
		return "<label class='dialog-form-label'>" + text + "</label>";
	},
	AddToProperty: function (Object, Property, Value) {
		Object[Property] = (Object[Property]) ? Object[Property] + ' ' + Value : Value;
		return Object;
	},

	//{id:??,data-ctrl:??,classes:??,title:??, notabstop:??, style:??}
	basic: function (p) {
		//disabled - dadedam klase ui-state-disabled
		//green - dadedam klase ui-state-green
		//if(p.type!='undefined') { if(p.type=='green') { oCONTROLS.AddToProperty(p, 'classes', 'ui-state-green'); }   }
		return ((p.attr) ? p.attr + " " : "") + ((p.id) ? "id='" + p.id + "' " : "") + ((p.style) ? 'style="' + p.style + '" ' : '') + ((p.notabstop) ? "tabindex='-1' " : "") + ((p.title) ? "title='" + p.title + "' " : "") + ((p.data_ctrl) ? "data-ctrl='" + p.data_ctrl + "' " : "") + ((p.classes) ? "class='" + p.classes + "' " : "");

		//return ((p.attr)?p.attr:'')+((p.id)?'id="'+p.id+'" ':'')+((p.style)?"style='"+p.style+"' ":"")+((p.notabstop)?'tabindex="-1" ':'')+((p.title)?'title="'+p.title+'" ':'')+((p.data_ctrl)?'data-ctrl="'+p.data_ctrl+'" ':'')+((p.classes)?'class="'+p.classes+'" ':'');
	},
	//prideda lbl prie txt, txtarea, chk. p.label={txt:"labelio tekstas", classes:"lblclass", type:"Top/Left"}
	appendLabel: function (p, t) {
		if (!p.label) return t;
		if (!p.label.txt || p.label.type === "None") return t;
		if (typeof p.label === 'undefined' || p.label === 'None') {
			return t;
		} else {
			return (p.label.type === "Top") ? "<label class='toplabel'><span>" + p.label.txt + "</span>" + t + "</label>" : "<label class='leftlabel'><span>" + p.label.txt + ":</span>" + t + "</label>";
		}
	},
	//appendLabel: function(p, t) { if(typeof p.label==='undefined') { return t; } else { return (p.label.type==="Top")?"<label><div"+((p.label.classes)?" class='"+p.label.classes+"'":"")+">"+p.label.txt+"</div>"+t+"</label>":"<label"+((p.label.classes)?" class='"+p.label.classes+"'":"")+">"+p.label.txt+t+"</label>"; } },
	//kaip basic + p.text
	txt: function (p) {
		if (p.Type=="Integer"||p.Type=="Decimal"){p.Value=p.Value+'';}
		return this.appendLabel(p, "<input type='text' " + this.basic(p) + ((p.Value) ? 'value="' + $.trim(p.Value).replace(/"/g, '&quot;') + '" ' : '') + "/>");
	},
	hidden: function (p) {
		return this.appendLabel(p, "<input type='hidden' " + this.basic(p) + ((p.Value) ? 'value="' + $.trim(p.Value).replace(/"/g, '&quot;') + '" ' : '') + "/>");
	},
	a: function (p) {
		return "<a " + this.basic(p) + " href='javascript:void(0);return false;'>" + $.trim(p.Value).replace(/"/g, '&quot;')+ "</a>";
	},
	txtarea: function (p) {
		return this.appendLabel(p, "<textarea cols='100' rows='" +((p.textAreaRows)?p.textAreaRows:4)+"' " + this.basic(p) + ">" + ((p.Value) ? p.Value.replace(/"/g, '&quot;') : "") + "</textarea>");
	},
	chk: function (p) {
		if (typeof p.Value === "string") { p.Value = ((p.Value.toLowerCase().search(/false/i) > -1 || p.Value === ""|| p.Value == 0) ? 0 : 1); }//==kad tiktu 0 ir "0"
		return "<label " + ((p.label.classes) ? " class='" + p.label.classes + "'" : "") + ((p.attr) ? p.attr + " " : "") + "><input type='checkbox' " + this.basic(p) + ((p.Value) ? "checked='checked'" : "") + "/>" + ((p.label.txt) ? p.label.txt : "") + "</label>";
	},
	//{src:??,alt:??,onclickfn:??}
	img: function (p) {
		return "<img src='" + p.src + "' alt='" + p.alt + "' onclick='" + p.onclickfn + "'/>";
	},
	//{name:??,style:??,onclickfn:??,colorClass:??-not implemented}
	ui_img: function (p) {
		return "<span class='ui-icon " + p.name + "' style='" + p.style + ";margin-top:.5em;' onclick=\"" + p.onclickfn + "\"/>";
	},
	//{pWraper.width:??,pWraper.style:??,pWraper.classes:??(default ui-widget-content),ptxt:(kaip basic),pimg:(kaip img)}

	txt_imgINtxt: function (pWraper, ptxt, pui_img) {
		ptxt.classes = (ptxt.classes) ? ptxt.classes + ' InputInWraper' : 'InputInWraper'; //panaikinami inputo borderiai
		var w = 'width:' + (pWraper.width - 20) + 'px;';
		ptxt.style = (ptxt.style) ? ptxt.style + w : w;
		return "<div " + this.basic(pWraper) + "width:" + pWraper.width + "px;" + "'>" + this.txt(ptxt) + this.ui_img(pui_img) + "</div>";
		//return "<div style='"+(pWraper.style?pWraper.style:"")+"width:"+pWraper.width+"px;' class='ui-widget-content "+((pWraper.classes)?" "+pWraper.classes:"")+"'>"+this.txt(ptxt)+this.ui_img(pui_img)+"</div>";
	},

	btnOKimg: function (title) {
		return "<button tabindex='-1' title='" + title + "' class='ui-button ui-widget ui-state-default ui-button-icon-only ui-corner-all ui-button-icon' role='button'><span class='ui-button-icon-primary ui-icon ui-icon-circle-check'></span><span class='ui-button-text'>&nbsp;</span></button></div>";
	},
	lbltxt_inline_btnConfirm: function (id, lblTitle, txtData, txtValue, btnTitle) {
		return "<div id=" + id + "><label class='dialog-form-r'>" + lblTitle + "</label><input type='text' data-ctrl=\"" + txtData + "\" value='" + txtValue + "' class='validate-dialog ui-widget-content ui-corner-left'/><button tabindex='-1' title='" + btnTitle + "' class='ui-button ui-widget ui-state-default ui-button-icon-only ui-corner-right ui-button-icon' role='button'><span class='ui-button-icon-primary ui-icon ui-icon-circle-check'></span><span class='ui-button-text'>&nbsp;</span></button></div>";
	},
	lbla_inline: function (id, lblTitle, aValue, data_ctrl) {
		return "<div id=" + id + "><label class='dialog-form-label'>" + lblTitle + "</label><a data-ctrl=\"" + data_ctrl + "\" href='javascript:void(0);'>" + aValue + "</a></div>";
	},
	//{id:??,text:??,icon:??(zaliam dadedama klase 'green'),title:??,disabled:??, notabstop:??, floatRight:??}

	btnTextOnly: function (p) {
		oCONTROLS.AddToProperty(p, 'classes', 'ui-button ui-corner-all ui-button-text-icon-primary');
		return '<button ' + oCONTROLS.basic(p) + '" role="button"><span class="ui-button-text">' + p.text + '</span></button>';
	},
	btnImgOnly: function (p) {
		oCONTROLS.AddToProperty(p, 'classes', 'ui-button ui-corner-all ui-icon-only');
		return '<button ' + oCONTROLS.basic(p) + '" role="button"><span class="ui-button-icon-primary ui-icon ' + p.icon + '"></span></button>';
	},
	btnTextImg: function (p) {
		oCONTROLS.AddToProperty(p, 'classes', 'ui-button ui-corner-all ui-button-text-icon-primary');
		return '<button ' + oCONTROLS.basic(p) + '" role="button"><span class="ui-button-icon-primary ui-icon ' + p.icon + '"></span><span class="ui-button-text">' + p.text + '</span></button>';
	},
	OptionList: function (p) {
		///<summary>Gets option list HTML</summary>
		///<param name="p">{Arr:'Array to get options from',ListBoxid:'id of listbox to set', ValI:'index in array to get value for listbox',TextI:'arry of indexes to show in listbox text',
		///SelectedID:'id to be selected',ReplaceArr:'[{Ix:??,txtIx:??,obj:??}] - pakeicia idus tekstais(Ix-kuri i pakeisti, txtIx-kur obj sedi tekstas, obj-duomenu objektas)'}</param>
		var HTML = "<select id='" + p.id + "' name= id='" + p.id + "'>";
		for (var i = 0; i < p.Arr.length; i++) {
			var Text = [];
			for (var I = 0; I < p.TextI.length; I++) {
				Text.push(p.Arr[i][p.TextI[I]]);
			}
			//-----------------id lauku pakeitimas-----------pradzia---------------------------------
			if (typeof (p.ReplaceArr) != 'undefined') {
				for (var iobj = 0; iobj < p.ReplaceArr.length; iobj++) {//begam per objektus
					var obj = p.ReplaceArr[iobj].obj.Data, Ix = p.ReplaceArr[iobj].Ix, txtIx = p.ReplaceArr[iobj].txtIx;
					for (var ix = 0; ix < obj.length; ix++) {
						if (Text[Ix] === obj[ix][0]) {
							Text[Ix] = obj[ix][txtIx];
							break;
						}
					} //begam per obj ir kai surandam i pakeiciam i tekstu
				}
			}
			//-----------------id lauku pakeitimas------------pabaiga---------------------------------
			Text = Text.join(", ");
			if (p.SelectedID) {
				HTML += "<option value=\"" + p.Arr[i][p.ValI] + ((+p.Arr[i][0] == p.SelectedID) ? "\" selected=\"selected\"" : "\"") + ">" + Text + "</option>";
			}
			else {
				HTML += "<option value=\"" + p.Arr[i][p.ValI] + "\">" + Text + "</option>";
			}
		}
		return HTML + "</select>";
	},
	//AppendFuncToForm: { ComboBox: function(frm) {
	//   $(frm).find('input.data-list').ComboBox();
	//}},
	//------------------Funkcijos ne tik generuojancios html i kontrola, bet ir upsidatinancios------------------------------------------------------------------------------
	Set_Updatable_HTML: {
		mega_select_list: function (d) {
			//d={ctrl:??,oDATA:??, opt:{text:??,val:??,FieldName:??,SelectText:??},fnAfterOptClick:?? }
			//oDATA.obj atiduodamas visas SD (kad turet ir Data ir Cols
			//istatomas listas, kuris i data("ctrl")._FieldName_ pagal pasirinkima istato val, be to kolapsinasi
			var HTML = "<div tabindex='0' class='container medium' style='background-color:#d3d1ba;margin-top:0px;font-weight:bold;'><div class='left'>"
				 + d.opt.SelectText + "<span style='cursor:pointer;color: #3366CC;text-decoration: underline;'></span></div>"
				 + "<div class='right'><a id='aCancelSelectOpt' class='floatright' href='#'>Atšaukti</a></div></div>";
			HTML += "<div class='megaselectlistoptions'>";
			var listHTML = "";
			for (var i = 1; i < d.oDATA.emData.length; i += 3) {//0-neimam, nes ten neapdrausta - jei kitur naudosim reiks tai daryt tik Source='tblClaimTypes'
				listHTML += "<div class='megaselectlistcolumn'><ul>";
				listHTML += "<li 'tabindex=-1' data-val=" + d.oDATA.emData[i][d.opt.val] + ">" + d.oDATA.emData[i][d.opt.text] + "</li>";
				listHTML += "<li 'tabindex=-1' data-val=" + d.oDATA.emData[i + 1][d.opt.val] + ">" + d.oDATA.emData[i + 1][d.opt.text] + "</li>";
				listHTML += "<li 'tabindex=-1' data-val=" + d.oDATA.emData[i + 2][d.opt.val] + ">" + d.oDATA.emData[i + 2][d.opt.text] + "</li></ul></div>";
			}
			HTML += listHTML + "<div style='clear: both;'></div></div></hr>"; //&nbsp;
			$(d.ctrl).append(HTML);
			var Opt = d.ctrl.find('div.megaselectlistoptions');
			Opt.data("height", Opt.height());
			//d.ctrl.delegate('a.floatright', 'click', function() { d.fnCancel(); return false; });
			d.ctrl.find('a.floatright').bind('click', function () {
				d.fnCancel();
				return false;
			});
			d.ctrl.find('li').bind('click', function () {
				$('#aCancelSelectOpt').remove();
				li = $(this);
				d.ctrl.find('span:eq(0)').html(li.html());
				//d.ctrl.find('div.right').html("<a id='aCancelSelectOpt' href='#'>Atšaukti</a>");
				d.ctrl.data("ctrl")[d.opt.FieldName] = li.data("val");
				d.ctrl.attr("data-ctrl", JSON.stringify(d.ctrl.data("ctrl"))); //ikisu i "data-ctrl" atrributa

				if (typeof d.fnAfterOptClick == "function") d.fnAfterOptClick($(this));
				//d.ctrl.find('div.megaselectlistoptions').animate({ height: "0px" });
				d.ctrl.find('div.megaselectlistoptions').height("0px");
				//alert("2 "+d.ctrl.find('div.megaselectlistoptions').height());
				//d.ctrl.find('div.megaselectlistoptions').animate({ height: "0" }); //$(d).animate({ height: "0px" });
			});
			d.ctrl.find('span').bind('click', function () {
				var Opt = d.ctrl.find('.megaselectlistoptions');
				if (Opt.height() == 0) {
					Opt.animate({
						height: Opt.data("height") + 'px'
					});
				}
				else {
					Opt.animate({
						height: "0px"
					});
				}
			});
		},
		lbltxt_inline_btnConfirm: function (d) {
			//d={ctrl:??,lblTitle:??,txt:{Title:??,Value:??}, btnTitle:??,Data:{tblToUpdate:??,UpdateField:??,id:??,Validity:??},fnCallBack:??,fnPostInit:?? }

			//d={ctrl:??,lblTitle:??,txt:{Title:??,Value:??}, btnTitle:??,Data:{tblToUpdate:??,Validity:??},DataToSave:{Data:[??],Fields:[?],id:??},fnCallBack:??,fnPostInit:?? }
			//var primaryHTML=ctrl.html();
			d.ctrl.html(oCONTROLS.lbl(d.lblTitle) + oCONTROLS.txt(d.txt.Title, d.txt.Value, "{\"Validity\":\"" + d.Data.Validity + "\"}") + oCONTROLS.btnOKimg(d.btnTitle));
			if (typeof d.fnPostInit != 'undefined') d.fnPostInit();
			d.ctrl.find("button").bind('click', function (e) {
				e.preventDefault();
				if (oGLOBAL.ValidateCtrlsArr([d.ctrl.find("input")])) {
					//var DataToSave={ Data: [d.ctrl.find("input").val()], Fields: [d.Data.UpdateField] }; DataToSave["id"]=d.Data.id;
					d.DataToSave.Data[0] = d.ctrl.find("input").val();
					SERVER.update("Edit", d.DataToSave, d.Data.tblToUpdate, d.fnCallBack, "");
				}
				d.ctrl.block("Siunčiami duomenys..");
				return false;
			});
		},
		lbla_inline: function (d) {
			//d={ctrl:??,lblTitle:??,a:Value:??, Data:{tblToUpdate:??},DataToSave:{Data:[??],Fields:[?],id:??},fnCallBack:??}
			d.ctrl.html(oCONTROLS.lbla_inline("divID" + d.DataToSave.id, d.lblTitle, d.Value, ""));
			d.ctrl.find("a").bind('click', function (e) {
				e.preventDefault();
				//var DataToSave={ Data: [null], Fields: ["DataEnd"] }; DataToSave["id"]=RowData[0];
				SERVER.update("Edit", d.DataToSave, d.Data.tblToUpdate, d.fnCallBack, "");
				d.ctrl.block("Siunčiami duomenys..");
				return false;
			});
		}
	},
	dialog: {
		opt: {
			title: '', msg: '', autoOpen: false, height: 'auto', width: 350, minWidth: 300, modal: true, show: 'clip', hide: 'clip',
			close: function () { oCONTROLS.dialog.destroy(this); }
		},
		destroy: function (t) { $(t).dialog("destroy"); $('#dialog_form_tmp_id').remove(); }, //$(this).dialog("close");
		Alert: function (opt) {//iskvietimui oCONTROLS.dialog.Alert({title:"fds",msg:"sdf"})
			buttons = { "Gerai": function () { oCONTROLS.dialog.destroy(this); } };
			this.showDialog(opt, buttons);
		},
		Confirm: function (opt, fnCallBack) {//iskvietimui oCONTROLS.dialog.Confirm({title:"fds",msg:"sdf"},fnCallBack)
			oCONTROLS.dialog.fnCallBack = fnCallBack;
			buttons = {
				"Taip": function () { d = oCONTROLS.dialog; d.fnCallBack(); d.destroy(this); },
				"Ne": function () { oCONTROLS.dialog.destroy(this); }
			};
			this.showDialog(opt, buttons);
		},
		showDialog: function (opt, buttons) {
			var o = $.extend(true, {}, this.opt, { buttons: buttons }, opt);
			var $dialog = $('<div id="dialog_form_tmp_id">').html(opt.msg).dialog(o).dialog('open');
		}
	}
};
