oGLOBAL.LoadAccident_Card = function (AccidentNo) {
	"use strict"; var UpdateServer, DefaultTime, fnChangeCheck, fnChange, LoadScript;
	SERVER.send("{'AccidentNo':" + AccidentNo + "}", oGLOBAL.Start.fnSetNewData, { Ctrl: "divAccidentEdit", RenderNew: 1, fnCallBack: function () { LoadScript(); } }, "/Accident/GetAccident", "json");

	LoadScript = function () {
		$("#btnMapTown").button({ disabled: true }).click(function () { oGLOBAL.mapFn.GetMapFromTown(); return false; });
		
		
		
		var frmOpts=$("#AccidentForm").data("ctrl");	//NewRec, Source, id, vehicles
		var tabOpts={}; if (frmOpts.NewRec){tabOpts.disabled=[ 1];}
		$("#accidentTab").tabs(tabOpts).on( "tabsactivate", function( event, ui ) {
			if (ui.newTab.index()===1){//Jei pereinam į įvykio dokumentus
				var accidentForm=ui.oldPanel,docsForm=ui.newPanel,uploadForm=$('#uploadDocsToAccident');
				// if  (uploadForm.html()!==""){
					// if (accidentForm.data("ctrl").id!== docsForm.data("ctrl").id) {//Jei kazkas buvo ir ne toks koks dabar ištuštinam
						// uploadForm.empty();//$("#dynamicTree,#docViewForTree").empty();
					// }
				// }
				// if  (uploadForm.html()===""){
					// App.docsAccident({accidentForm:accidentForm, docsForm:docsForm, uploadForm:uploadForm});
					// docsForm.data("ctrl").id=accidentForm.data("ctrl").id;
				// }		
				if  (docsForm.data("ctrl").id!==accidentForm.data("ctrl").id||$("#AccDocs").data("ctrl").Saved) {
					if (MY.accidentCard.TreeView) {
						MY.accidentCard.TreeView.remove();MY.accidentCard.DocsView.remove();
						if($('#uploadDocsToAccident').next().data("Tree")) $('#uploadDocsToAccident').next().Tree("destroy");
					}
					if  ($("#AccDocs").data("ctrl").Saved){App.treeDocController.refreshDocs();$("#AccDocs").data("ctrl").Saved=false;}
					oGLOBAL .appStart= new Date().getTime();
					oGLOBAL.logFromStart("Started docsAccident");
					App.docsAccident({accidentForm:accidentForm, docsForm:docsForm, uploadForm:uploadForm});
					docsForm.data("ctrl").id=accidentForm.data("ctrl").id;
					oGLOBAL.logFromStart("Finished docsAccident");
				}
			}				
		} );
		
		//$("#LongNote").autoResize();
		//$("#LongNote").bind("keyup", function () {
			//$(this).autoResizeTextAreaQ({ "max_rows": 8 });
			//$(this).autoResize();
		//});

		var fnRetunToAccidentInList=function (accNo,newAccident){
			$("#btnReturnToAccidents").trigger("click"); //paspaudžiam, kad grįžtam į lista												
			Em.run.next({ accNo: accNo }, function () {
				var trs=$("#accidentsTable").find("div.accident").removeClass("selectedAccident"); $("#accidentsTable").find("div.dividers").remove(); $("#AccDetailsWraper").remove();
				var tr = trs.find("div.td:nth(0):contains(" + this.accNo+ ")").parent().addClass("selectedAccident"); 	
				Em.run.next(function () {
					//tr.trigger("click");tr[0].click();
					console.log(tr);tr.trigger("click");tr.trigger("click");
					Em.run.next(function () {					
						if (newAccident) {$("#AccDetailsContent").find("button").trigger("click");}
						Em.run.next(function () {
							var scroolTop = tr.offset().top - $(window).height() / 2 + 100;
							$('html, body').animate({ scrollTop: scroolTop }, 'slow');
						});
					});
				});
			});
		}
		$("#btnDeleteAccident").on("click",function (e) {
			var emData=oDATA.GET("proc_Accidents").emData;
			var accidentRow=emData.findProperty("no",AccidentNo);
			if (accidentRow.cNo_All > 0) { oCONTROLS.dialog.Alert({ title: "", msg: "Negalima šalinti įvykio, kol jis turi nepašalintų žalų." }); return false; }
			oCONTROLS.dialog.Confirm({title: "Įvykio Nr. "+AccidentNo+" pašalinimas" , msg: "Ištrinti šį įvykį?"}, function() {
				SERVER.update({Action: "Delete",DataToSave: {id: accidentRow.iD,DataTable: "tblAccidents"},
				Msg: {Title: "Įvykio pašalinimas",Success: "Pasirinktas įvykis buvo pašalintas.",Error: "Nepavyko pašalinti šio įvykio"},
					CallBack: {Success: function(resp, updData) {
							$("#accidentsTable").find("div.accident").removeClass("selectedAccident"); $("#accidentsTable").find("div.dividers").remove(); $("#AccDetailsWraper").remove();
							emData.removeObject(accidentRow);
							$("#btnReturnToAccidents").trigger("click");
						}
					}
				});
			});
		});
		$("#btnSaveAccident").on("click",{fn:fnRetunToAccidentInList},function (e) {
			var DataToSave = oCONTROLS.ValidateForm($("#AccidentForm")), Action, Msg;
			if (DataToSave) {
				if (oGLOBAL.AccidentForm.NewRec) {
					if (!(oGLOBAL.AccidentForm.Lat) ? 1 : 0) {
						oCONTROLS.dialog.Alert({ msg: "Pažymėkite įvykio vietą pelės spragtelėjimu žemėlapyje..", title: "Naujo įvykio įvedimas" }); return false;
					} else {
						DataToSave.Data.push(oGLOBAL.AccidentForm.Lat); DataToSave.Fields.push("Lat");
						DataToSave.Data.push(oGLOBAL.AccidentForm.Lng); DataToSave.Fields.push("Lng");
						DataToSave.Data.push(oGLOBAL.AccidentForm.Country); DataToSave.Fields.push("LocationCountry");
						DataToSave.Data.push(oGLOBAL.AccidentForm.District); DataToSave.Fields.push("LocationDistrict");
						DataToSave.Data.push(oGLOBAL.AccidentForm.Address); DataToSave.Fields.push("LocationAddress");
					}
					Msg = { Title: "Naujo įvykio įvedimas", Success: "Naujas įvykis pridėtas", Error: "Nepavyko pridėti naujo įvykio." };
					Action = "Add";
				}
				else {
					Msg = { Title: "Įvykio duomenų keitimas", Success: "Duomenys sėkmingai pakeisti", Error: "Nepavyko pakeisti duomenų." };
					Action = "Edit";
				}

				SERVER.update({ Action: Action, DataToSave: DataToSave,
					CallBack: { Success: function (resp) {
						var newRow = resp.ResponseMsg.Ext.replace(/#\|#\|/g, ":::").split("|#|"); newRow[13] = newRow[13].replace(/:::/g, "#|#|"); //atkeičiam atgal
						var no = parseInt(newRow[1], 10), toAppend = (Action === "Edit") ? false : { "sort": "desc", "col": "date" };
						App.accidentsController.get("setNewVal").call(App.accidentsController, { newVal: newRow, toAppend: toAppend, fieldsToInt: [0, 1, 5, 6, 7, 8] })[0]; //kuriuos reikia paverst integeriais
						$("#AccDocs").data("ctrl").Saved=true;//Po išsaugojimo, kad atsinaujintų dokai 23 eilutė
			
						if (oGLOBAL.AccidentForm.NewRec) {//naujam Accidentui nukeliu useri i lista ir scroolinu, senam nieko nereikia
							e.data.fn(no, true);
						}else{
							e.data.fn(AccidentNo, false);
						}
					}
					}, Msg: Msg
				});
			}
			return false;
		});

		$("#btnCancel").on("click",{fn:fnRetunToAccidentInList},function (e) { 
			//oGLOBAL.LoadAccident_Card(AccidentNo); return false; 
			e.data.fn(AccidentNo, false);
		});
		$("#btnReturnToAccidents").click(function (e) {
			e.preventDefault();

			//oGLOBAL.Start.fnSetNewData("", { Ctrl: "divAccidentEdit", RenderNew: 1, padding: 20 });
			$('#tabAccidents').addClass("colmask");
			$('#divAccidentsList').show();
			var ctrlEdit = $('#divAccidentEdit').empty().hide();
			//return false;
		});

		//$('#Date').datetimepicker({ numberOfMonths: 2 });
		$("#inputChooseTown").bind("keypress", function () { if ($(this).val().length > 1) { $("#btnMapTown").button("enable"); } else { $("#btnMapTown").button("disable"); } });
		//var eNr=oGLOBAL.GetPar(); eNr=(eNr>0)?("Įvykis Nr:"+eNr):"Naujas įvykis";
		//$(".ui-tabs-nav li:last").after("<span class='RightSpanInTab'>"+eNr+"</span>");
		//#divlogindisplay
		//#ulMainMenu	
		/////var tabHeight = $(document).height() - $('#divlogindisplay').outerHeight(true) - $('#ulMainMenu').outerHeight(true);
		/////$('#divAccidentEdit').height(tabHeight);
		var Dif = $('#divAccidentEdit').height() - $('h2').outerHeight(true) - $('#ulWhiteMenu').outerHeight(true) - $('#AccidentForm').outerHeight(true);
		if (Dif > 0) { $('div.HalfDivleft1').height($('div.HalfDivleft1').height() + Dif); }
		var MapHeight = $('#AccidentForm').outerHeight(false) - $('#divMapHead').outerHeight(false);
		$('#divMap').height(MapHeight).width('100%');
		oGLOBAL.AccidentForm = $("#AccidentForm").data("ctrl"); //NewRec id Lat Lng
		//oGLOBAL.mapFn.loadGoogleMapScript(oGLOBAL.mapFn.loadGMap);
		oGLOBAL.mapFn.loadGMap();
		if (!oGLOBAL.AccidentForm .NewRec){oGLOBAL.mapFn.fnSetAddress($('#txtPlace').html())};
	};
	return false;
	//*****************************************************************************************************************************************
};
oGLOBAL.map = null; //Gmap
oGLOBAL.Ggeocoder = null;
oGLOBAL.AccidentForm = {};
oGLOBAL.mapFn = {
	GetMapFromTown: function () {
		"use strict"; var Town = $("#inputChooseTown").val(), coords=Town.match(new RegExp("([0-9]+\.[0-9]+)","g")),toGeocode;
		if  (coords===null){toGeocode=Town;}		
		else{
			if  (coords.length>1){
				var toGeocode1 = new GLatLng(parseFloat(coords[0]), parseFloat(coords[1]));
				toGeocode = new GLatLng(coords[0], coords[1]);
			} else {toGeocode=Town;}
		}
		oGLOBAL.Ggeocoder.getLocations(toGeocode, oGLOBAL.mapFn.addAddressToMap);
	},
	SetAddress: function (latlng) {
		if (latlng) {
			oGLOBAL.Ggeocoder.getLocations(latlng, function (addresses) {
				if (addresses.Status.code !== 200) {
					oGLOBAL.map.SetAddress = "Adresas nerastas";
				} else {
					oGLOBAL.map.SetAddress = oGLOBAL.mapFn.fnGetAddress(addresses.Placemark);
					//var address=addresses.Placemark[0];
					//oGLOBAL.map.SetAddress=address.address;
					oGLOBAL.map.openInfoWindow(latlng, oGLOBAL.map.SetAddress);
				}
			});
		}
	},
	fnGetAddress: function (p) {
		var len = p.length, btn;
		var address = p[0].address, district = (len > 3) ? p[3].address : "", address1 = (len > 1) ? p[1].address : "", address2 = (len > 2) ? p[2].address : "";
		var ArrAddr = address.split(', '), ArrDistr = district.split(', '), ArrAddr1 = address1.split(', '), ArrAddr2 = address2.split(', '), Last = (ArrAddr.length > 1) ? ArrAddr.length - 2 : 0;
		oGLOBAL.AccidentForm.Country = ArrAddr[ArrAddr.length - 1];
		oGLOBAL.AccidentForm.District = ((ArrDistr[0]) ? ArrDistr[0] : ((ArrAddr.length > 1) ? ArrAddr[ArrAddr.length - 2] : "")).replace("'","");

		if (ArrAddr[Last].search(ArrDistr[0]) > -1) { Last--; } //Neimam paskutinio, nes jis jau yra apskrities pavadinime
		if (Last === -1) { oGLOBAL.AccidentForm.Address = ""; } else {
			if (ArrAddr[Last].search(ArrAddr1[0]) === -1) { ArrAddr[Last] += ", " + ArrAddr1[0]; } //Pridedu prie paskutinio Addr1 jei jo nera
			if (ArrAddr[Last].search(ArrAddr2[0]) === -1) { ArrAddr[Last] += ", " + ArrAddr2[0]; } //Pridedu prie paskutinio Addr2 jei jo nera
			address = ArrAddr.splice(0, Last + 1);
			oGLOBAL.AccidentForm.Address = (address)?(address.join(', ').replace("'","")):"";
		}
		return ((oGLOBAL.AccidentForm.Address) ? (oGLOBAL.AccidentForm.Address + ', ') : "") + oGLOBAL.AccidentForm.District + ', ' + oGLOBAL.AccidentForm.Country;
	},
	fnSetAddress: function(place){
		var p=oGLOBAL.AccidentForm;
		//place="<a target='_blank' href='https://maps.google.com/maps?q="+p.Lat+","+p.Lng+"("+place+")'>"+place+"<a>"
		//if ($("#linkToGoogle").attr("href")!=="#"){$("#btnSaveAccident").removeAttr("disabled", "disabled");}//enablinam buttona jei neužsikrovimas
		$("#linkToGoogle").attr("href","https://maps.google.com/maps?q="+p.Lat+","+p.Lng+"("+place+")")
		$('#txtPlace').html(place);
		$("#divSearchMap").css("display","none");
	},
	Mapclicked: function (overlay, latlng) {
		"use strict";
		if (latlng) {
			oGLOBAL.AccidentForm.Lat = latlng.y;
			oGLOBAL.AccidentForm.Lng = latlng.x;
			oGLOBAL.Ggeocoder.getLocations(latlng, function (addresses) {
				if (addresses.Status.code !== 200) {
					oCONTROLS.dialog.Alert({msg:"Nepavyko rasti šios vietos adreso - " + latlng.toUrlValue(), title:"Nepavyko rasti adreso"});
				} else {
					var place = oGLOBAL.mapFn.fnGetAddress(addresses.Placemark);
					oGLOBAL.map.openInfoWindow(latlng, place);
					oGLOBAL.mapFn.fnSetAddress(place);
					if (!oGLOBAL.AccidentForm.NewRec) {//.css('display', 'inline')
						if (!$('#ConfirmNewMapData').length) {
							//btn=$('#btnEditMap').clone(); //.attr("display", "inline-block");
							//btn.attr("id", "ConfirmNewMapData").attr("title", "Patvirtinti įvykio vietą").html("Patvirtinti");
							//$('#btnEditMap').after(btn);
							$('<a id="ConfirmNewMapData" href="javascript:void(0);return false;">Patvirtinti</a>').insertAfter('#btnEditMap').button();
							$('#ConfirmNewMapData').click(function () {
								var DataToSave = { Data: [], Fields: [], DataTable: $("#AccidentForm").data("ctrl").Source };
								DataToSave.Data.push(oGLOBAL.AccidentForm.Lat); DataToSave.Fields.push("Lat");
								DataToSave.Data.push(oGLOBAL.AccidentForm.Lng); DataToSave.Fields.push("Lng");
								DataToSave.Data.push(oGLOBAL.AccidentForm.Country); DataToSave.Fields.push("LocationCountry");
								DataToSave.Data.push(oGLOBAL.AccidentForm.District); DataToSave.Fields.push("LocationDistrict");
								DataToSave.Data.push(oGLOBAL.AccidentForm.Address); DataToSave.Fields.push("LocationAddress");
								DataToSave.id = $("#AccidentForm").data("ctrl").id;

								SERVER.update({ Action: "Edit", DataToSave: DataToSave,
									CallBack: { Success: function (resp) {
										oGLOBAL.map.clearOverlays();
										latlng = new GLatLng(oGLOBAL.AccidentForm.Lat, oGLOBAL.AccidentForm.Lng);  //ignore jslint
										oGLOBAL.map.setCenter(latlng, 8);
										var marker = new GMarker(latlng);  //ignore jslint
										oGLOBAL.map.addOverlay(marker);
										oGLOBAL.mapFn.SetAddress(latlng);  //Ikisa i oGlobal.map.SetAddress
										var M = GEvent.addListener(marker, "click", function () { oGLOBAL.map.openInfoWindow(latlng, oGLOBAL.map.SetAddress); }); //ignore jslint
										$('#btnEditMap').attr('title', 'Keisti įvykio vietą').html('Keisti').data("caption", "Change");
										$('#ConfirmNewMapData').remove();
										var newRow = resp.ResponseMsg.Ext.replace(/#\|#\|/g,":::").split("|#|"); newRow[13]=newRow[13].replace(/:::/g,"#|#|") //atkeičiam atgal
										App.accidentsController.get("setNewVal").call(App.accidentsController, {newVal:newRow,toAppend:false,fieldsToInt:[0, 1, 5, 6, 7, 8]})[0] //kuriuos reikia paverst integeriais
									}
									}, Msg: { Title: "Įvykio vietos keitimas", Success: "Įvykio vieta pakeista.", Error: "Nepavyko pakeist įvykio vietos." }
								});
							});
						}
					}
				}
			});
		}
	},
	loadGoogleMapScript: function (callback) {
		"use strict";
		if (typeof GMap2 === 'function') { callback(); return; }
		var script = document.createElement('script');
		//script.setAttribute('src', 'http://maps.google.com/maps?file=api&v=2.133d&key=ABQIAAAAPnON2Rz9y3X5Mqknkx6ddhT2CXUl8nztVe9hJc_0UrwHdCv9pRR14Z_ti-1Z_5Dj_pUHY7QnFqoatQ&async=2&callback=oGLOBAL.mapFn.loadGMap');
		script.setAttribute('src', 'http://maps.google.com/maps?file=api&amp;v=2&amp;sensor=true&amp;key=AIzaSyBmiyz9zmTD_hY7qT7Degr0o7tqAzjKQos&async=2&callback=oGLOBAL.mapFn.loadGMap');
		//http://maps.google.com/maps?file=api&amp;v=2&amp;sensor=true&amp;key=AIzaSyBmiyz9zmTD_hY7qT7Degr0o7tqAzjKQos
		script.setAttribute('type', 'text/javascript');
		document.documentElement.firstChild.appendChild(script);
	},
	addAddressToMap: function (response) {//Naudojamas vietovardžių paieškai
		oGLOBAL.map.clearOverlays();
		if (response && response.Status.code !== 200) {
			alert("Neradau tokios vietovės - " + decodeURIComponent(response.name));
		} else {
			//var place=oGLOBAL.mapFn.fnGetAddress(response.Placemark);
			var place = response.Placemark[0];
			var point = new GLatLng(place.Point.coordinates[1], place.Point.coordinates[0]);
			var Address = place.address.split(", ");
			var Sub = (typeof place.AddressDetails.Country.SubAdministrativeArea === 'undefined') ? "" : "<b>Apskritis:</b> " + place.AddressDetails.Country.SubAdministrativeArea.SubAdministrativeAreaName + "<br>";
			var Adm = (Address.length < 3) ? "" : "<b>Adm. centras:</b> " + Address[1] + "<br>";
			oGLOBAL.map.setCenter(point, 5);
			oGLOBAL.map.openInfoWindowHtml(point, "<b>Vietovardis:</b> " + Address[0] + "<br>" + Adm + Sub + "<b>Šalis:</b> " + place.AddressDetails.Country.CountryName + " (" + place.AddressDetails.Country.CountryNameCode + ")");
		}
	},
	loadGMap: function () {
		var EditMap = function () {
			oGLOBAL.map.EventMapclicked = GEvent.addListener(oGLOBAL.map, "click", oGLOBAL.mapFn.Mapclicked);
			var latlng=oGLOBAL.map.getCenter(); latlng.y=latlng.y-0.3;latlng.Xd=latlng.y;//Dėl atsiradusio paieškos lauko paslenkam žemiau
			oGLOBAL.map.openInfoWindow(latlng, "Suraskite ir pažymėkite įvykio vietą žemėlapyje");//"Spragtelėkit žemėlapyje pažymėti įvykio vietą!");
		};
		
		
		if (typeof GBrowserIsCompatible==="undefined") {console.warn("GBrowserIsCompatible");return false;}
		else if (GBrowserIsCompatible()) {
			//alert(oGLOBAL.AccidentForm.NewRec); alert(oGLOBAL.AccidentForm.Lat); alert(oGLOBAL.AccidentForm.Lng);
			oGLOBAL.map = new GMap2(document.getElementById("divMap"));
			if (!oGLOBAL.AccidentForm.NewRec) {
				var latlng = new GLatLng(oGLOBAL.AccidentForm.Lat, oGLOBAL.AccidentForm.Lng);
				oGLOBAL.map.setCenter(latlng, 8);
				oGLOBAL.map.setUIToDefault(); //oGLOBAL.map.addControl(new GSmallZoomControl());
				oGLOBAL.Ggeocoder = new GClientGeocoder();
				var marker = new GMarker(latlng);
				oGLOBAL.map.addOverlay(marker);
				oGLOBAL.mapFn.SetAddress(latlng);  //Ikisa i oGlobal.map.SetAddress
				var M = GEvent.addListener(marker, "click", function () { oGLOBAL.map.openInfoWindow(latlng, oGLOBAL.map.SetAddress); });
				$('#btnEditMap').click(function () {
					var t = $(this); $("#divSearchMap").toggle();
					if (t.data("caption") === "Change") {
						EditMap();
						t.attr('title', 'Atšaukti įvykio vietos keitimą').html('Atšaukti').data("caption", "Cancel");
					}
					else {
						if(oGLOBAL.map.EventMapclicked){ GEvent.removeListener(oGLOBAL.map.EventMapclicked);}
						t.attr('title', 'Keisti įvykio vietą').html('Keisti').data("caption", "Change");
						oGLOBAL.mapFn.fnSetAddress(oGLOBAL.map.SetAddress);
						if ($('#ConfirmNewMapData').length) { $('#ConfirmNewMapData').remove(); }
						oGLOBAL.map.openInfoWindow(latlng, oGLOBAL.map.SetAddress);
					}
				});
			} else {
				oGLOBAL.map.setCenter(new GLatLng(54.682961, 25.2740478), 4);
				oGLOBAL.map.setUIToDefault(); //oGLOBAL.map.addControl(new GSmallZoomControl());
				oGLOBAL.Ggeocoder = new GClientGeocoder();
				EditMap();
			}
		}
	}
};
console.log("accidentCard loaded");
