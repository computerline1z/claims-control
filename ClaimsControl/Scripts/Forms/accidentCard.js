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
 		var fnRetunToAccidentInList=function (accNo,newAccident){
			$("#btnReturnToAccidents").trigger("click"); //paspaudžiam, kad grįžtam į lista	
			if (! $("#ClaimWraper").length){return false;}
			Em.run.next({ accNo: accNo }, function () {
				var trs=$("#accidentsTable").find("div.accident").removeClass("selectedAccident"); $("#accidentsTable").find("div.dividers").remove(); $("#AccDetailsWraper").remove();
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
		$("#inputChooseTown").on("keypress", function (e) {
			if ($(this).val().length > 1) {
				$("#btnMapTown").button("enable");
				var keyCode=e.which || e.keyCode ;
				if (keyCode === 13) {$('#btnMapTown').trigger('click');}
			} else { $("#btnMapTown").button("disable"); } 
		});
		var Dif = $('#divAccidentEdit').height() - $('h2').outerHeight(true) - $('#ulWhiteMenu').outerHeight(true) - $('#AccidentForm').outerHeight(true);
		if (Dif > 0) { $('div.HalfDivleft1').height($('div.HalfDivleft1').height() + Dif); }
		var MapHeight = $('#AccidentForm').outerHeight(false) - $('#divMapHead').outerHeight(false);
		$('#divMap').height(MapHeight).width('100%');
		oGLOBAL.AccidentForm = $("#AccidentForm").data("ctrl"); //NewRec id Lat Lng
		//$("#divSearchMap").outerHeight($("#divMapHead").height());
		//oGLOBAL.mapFn.loadGoogleMapScript(oGLOBAL.mapFn.loadGMap);
		if (typeof google!=="undefined") {oGLOBAL.mapFn.loadGMap();}
		if (!oGLOBAL.AccidentForm .NewRec){oGLOBAL.mapFn.fnSetAddress($('#txtPlace').html())};
	};
	return false;
	//*****************************************************************************************************************************************
};
if (typeof google !== "undefined") {
	oGLOBAL.map = null; //Gmap
	oGLOBAL.geocoder = null;
	oGLOBAL.AccidentForm = {};
	oGLOBAL.infoWindow = new google.maps.InfoWindow();
	oGLOBAL.openInfoWindow = function (latlng, content) {
		var iW = oGLOBAL.infoWindow; iW.close();
		iW.setContent(content);
		iW.setPosition(latlng);
		iW.open(oGLOBAL.map);
	};
}
oGLOBAL.mapFn = {
	fnToogleMapHead:function(p) {//p{hideSearchMap:true}
		$("#divSearchMap").toggleClass('hidden',p.hideSearchMap);
		$("#divMapHead").toggleClass('hidden',!p.hideSearchMap);
	},
	GetMapFromTown: function () {
		"use strict"; var Town = $("#inputChooseTown").val(), coords=Town.match(new RegExp("([0-9]+\.[0-9]+)","g")),toGeocode;
		if  (coords===null){toGeocode=Town;}		
		else{
			if  (coords.length>1){
				var toGeocode1 = new google.maps.LatLng(parseFloat(coords[0]), parseFloat(coords[1]));
				toGeocode = new google.maps.LatLng(coords[0], coords[1]);
			} else {toGeocode=Town;}
		}
		oGLOBAL.geocoder.geocode({'address':toGeocode}, oGLOBAL.mapFn.addAddressToMap);
	},
	SetAddress: function (latlng) {
		if (latlng) {
			oGLOBAL.geocoder.geocode({'latLng':latlng}, function (addresses, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					oGLOBAL.map.SetAddress = oGLOBAL.mapFn.fnGetAddress(addresses);
					oGLOBAL.openInfoWindow(latlng, oGLOBAL.map.SetAddress);
				}else{
					oGLOBAL.map.SetAddress = "Adresas nerastas";			
				}
			});
		}
	},
	fnGetAddress: function (p) {
		var ArrAddr=p[0].address_components,   len = ArrAddr.length, Ix=len-1;
		if (ArrAddr[Ix].types[0]!=="country"){Ix--;}
		var Country=ArrAddr[Ix].long_name; Ix--;
		var District=(Ix>0)?ArrAddr[Ix].long_name:''; Ix--; if (Ix<0){Ix=0;}
		var Address=ArrAddr.slice(0,Ix).map(function(e){return e.long_name;}).join(', ');
		$.extend(oGLOBAL.AccidentForm, {Address: Address, District:District, Country:Country});
		var af=oGLOBAL.AccidentForm; return  ((af.Address)?(af.Address+', '):"")+af.District+', '+af.Country;
	},
	fnSetAddress: function(place){
		var p=oGLOBAL.AccidentForm;
		//place="<a target='_blank' href='https://maps.google.com/maps?q="+p.Lat+","+p.Lng+"("+place+")'>"+place+"<a>"
		//if ($("#linkToGoogle").attr("href")!=="#"){$("#btnSaveAccident").removeAttr("disabled", "disabled");}//enablinam buttona jei neužsikrovimas
		$("#linkToGoogle").attr("href","https://maps.google.com/maps?q="+p.Lat+","+p.Lng+"("+place+")")
		$('#txtPlace').html(place);
		//$("#divSearchMap").css("display","none");
		oGLOBAL.mapFn.fnToogleMapHead({hideSearchMap:true});
	},
	Mapclicked: function (event) {
		"use strict"; var latlng=event.latLng;
		if (latlng) {
			oGLOBAL.AccidentForm.Lat = latlng.lat();
			oGLOBAL.AccidentForm.Lng = latlng.lng();
			oGLOBAL.geocoder.geocode({'latLng':latlng}, function (addresses, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					var place = oGLOBAL.mapFn.fnGetAddress(addresses);
					oGLOBAL.openInfoWindow(latlng, place);
					oGLOBAL.mapFn.fnSetAddress(place);
					if (!oGLOBAL.AccidentForm.NewRec) {//.css('display', 'inline')
						if (!$('#ConfirmNewMapData').length) {
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
										latlng = new google.maps.LatLng(oGLOBAL.AccidentForm.Lat, oGLOBAL.AccidentForm.Lng);
										oGLOBAL.map.setCenter(latlng, 8);
										var marker = new google.maps.Marker({
											position: new google.maps.LatLng(latlng),
											map: oGLOBAL.map
										}); 
										
										oGLOBAL.mapFn.SetAddress(latlng);  //Ikisa i oGlobal.map.SetAddress
										var M = google.maps.event.addListener(marker, "click", function () { oGLOBAL.openInfoWindow(latlng, oGLOBAL.map.SetAddress); }); //ignore jslint
										$('#btnEditMap').attr('title', 'Keisti įvykio vietą').html('Keisti').data("caption", "Change");
										$('#ConfirmNewMapData').remove();
										var newRow = resp.ResponseMsg.Ext.replace(/#\|#\|/g,":::").split("|#|"); newRow[13]=newRow[13].replace(/:::/g,"#|#|") //atkeičiam atgal
										App.accidentsController.get("setNewVal").call(App.accidentsController, {newVal:newRow,toAppend:false,fieldsToInt:[0, 1, 5, 6, 7, 8]})[0] //kuriuos reikia paverst integeriais
									}
									}, Msg: { Title: "Įvykio vietos keitimas", Success: "Įvykio vieta pakeista.", Error: "Nepavyko pakeist įvykio vietos." }
								});
								return false;
							});
						}
					}
				} else {
					oCONTROLS.dialog.Alert({msg:"Nepavyko rasti šios vietos adreso - " + latlng.toUrlValue(), title:"Nepavyko rasti adreso"});
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
	addAddressToMap: function (results, status) {//Naudojamas vietovardžių paieškai
		if (status == google.maps.GeocoderStatus.OK) {
			//oGLOBAL.map.setCenter(results[0].geometry.location);
			oGLOBAL.map.fitBounds(results[0].geometry.viewport);
			var marker = new google.maps.Marker({
				map: oGLOBAL.map, position: results[0].geometry.location
			});
			oGLOBAL.openInfoWindow(results[0].geometry.location, results[0].formatted_address);
		} else {
			alert("Neradau šios vietovės - '" + $('#inputChooseTown').val()+"'");
		}
	},
	loadGMap: function () {
		var EditMap = function () {
			oGLOBAL.map.EventMapclicked = google.maps.event.addListener(oGLOBAL.map, "click", oGLOBAL.mapFn.Mapclicked);
			var latlng=oGLOBAL.map.getCenter(); 
			oGLOBAL.openInfoWindow(latlng, "Suraskite ir pažymėkite įvykio vietą žemėlapyje");//"Spragtelėkit žemėlapyje pažymėti įvykio vietą!");
		};
		var latlng,zoom; oGLOBAL.geocoder = new  google.maps.Geocoder();
		
		if (!oGLOBAL.AccidentForm.NewRec) {
			latlng = new google.maps.LatLng(oGLOBAL.AccidentForm.Lat, oGLOBAL.AccidentForm.Lng); zoom=8;
		} else {
			latlng = new google.maps.LatLng(54.682961, 25.2740478); zoom=4;		
		}
		oGLOBAL.map = new google.maps.Map(document.getElementById("divMap"), {zoom: zoom,center: latlng,mapTypeId: google.maps.MapTypeId.ROADMAP});
		
		if (!oGLOBAL.AccidentForm.NewRec) {
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(latlng),
				map: oGLOBAL.map
			});              
			
			oGLOBAL.mapFn.SetAddress(latlng);  //Ikisa i oGlobal.map.SetAddress
			var M = google.maps.event.addListener(marker, "click", function () { oGLOBAL.openInfoWindow(latlng, oGLOBAL.map.SetAddress); });
			$('#cancelMap').on('click',function () {
				if(oGLOBAL.map.EventMapclicked){ google.maps.event.removeListener(oGLOBAL.map.EventMapclicked);}
				oGLOBAL.mapFn.fnSetAddress(oGLOBAL.map.SetAddress);
				if ($('#ConfirmNewMapData').length) { $('#ConfirmNewMapData').remove(); }
				oGLOBAL.openInfoWindow(latlng, oGLOBAL.map.SetAddress);
				//$("#divSearchMap").hide();
				oGLOBAL.mapFn.fnToogleMapHead({hideSearchMap:true});
			});
		} else {EditMap();}
		$('#btnEditMap').click(function () {
			//var t = $(this); $("#divSearchMap").show().outerHeight($("#divMapHead").height());
			oGLOBAL.mapFn.fnToogleMapHead({hideSearchMap:false});
			EditMap();
		});
	}
};
