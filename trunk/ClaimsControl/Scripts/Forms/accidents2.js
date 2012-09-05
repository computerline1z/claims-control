App.AccidentsView = App.mainMenuView.extend({
	content: null,
	viewIx: 0, //reikalinga meniu pazymet
	templateName: 'tmpAccidentsMain',
	init: function () {      //    didInsertElement
		this._super();
		console.log("accidentInit");
	},
	didInsertElement: function () {
		alert("loaded");
		this._super();
		console.log("I loaded all accidents");
		//////////////App.accidents.setContent();
		//Ember.run.schedule('sync', this, function () {
		// this will be executed at the end of the RunLoop, when bindings are synced
		//    alert("sync");
		//});
	},
	contentObserver: function () {
		this.rerender();
		alert("App.AccidentsssssView has changed!")
	} .observes('content')
});
App.AccidentView = Em.View.extend({
	//contentObserver: function() {
	//    this.rerender();
	//}.observes('content.lossSum'),//     
	templateName: 'tmpAccidentRow', //<div class="tr accident" @Html.Raw("{{action tbodyClick this target=\"this\"}}")>
	tagName: ""//,
	//classNames: "tr",
});
App.SelectedAccidentView = Em.View.extend({
	templateName: 'tmpAccident_Claims',
	init: function () {      //    didInsertElement
		console.log("init selected accident");
		this._super();
		var ArrClaims = this.get("claims_C").replace(new RegExp('{{(.*?)}}', 'gm'), '').split('#||'); //Iskertam nenaudojamus tarp{{ ir}}//?-kad nebutu greedy
		var ArrClaims2 = this.get("claims_C2").split('#||');
		var ArrView = [], objView = [];
		if (ArrClaims[0] !== "")
			for (var i = 0; i < ArrClaims.length; i++) {
				ArrView[i] = {
					Claims: ArrClaims[i].split('#|'),
					Claims2: ArrClaims2[i].split('#|')
				};
				///Claims: 0-ClaimStatus,1-No,2-ClaimType(text),3-Vehicle,4-Insurer(text),5-lossAmount
				//Claims2: 0-ClaimID, 1-VehicleID, 2-InsPolicyID, 3-InsuranceClaimAmount, 4-InsurerClaimID, 5-IsTotalLoss, 6-IsInjuredPersons, 7-Days, 8-PerDay
				objView[i] = {
					finished: ((ArrClaims[i][0] === "2") ? true : false),
					no: ArrView[i].Claims[1],
					type: ArrView[i].Claims[2],
					autoNo: ArrView[i].Claims[3],
					insurer: ArrView[i].Claims[4],
					loss: ArrView[i].Claims[5],
					Claims2: ArrView[i].Claims2,
					accidentID: this.get("iD")
				};
			}
		App.thisAccidentController.set("content", objView); //butinai masyvas
	},
	tbodyClick: function (e) {//Reik daryti tik kai ant claimo, kitu atveju matyt išeinam
		var tr = $(e.target).closest("tr")
		tr.parent().find("tr.selectedClaim").removeClass("selectedClaim title")
		var ClaimW = $("#ClaimWraper");
		if (ClaimW.length > 0) {
			MY.accidents.SelectedClaimView.remove();
			ClaimW.remove();
		}
		var d = e.context;
		MY.accidents.SelectedClaimView = App.SelectedClaimView.create({
			rowContext: { Claims2: d.Claims2, newClaim: false, LossAmount: d.loss, InsuranceType: d.type, accidentID: d.accidentID }
		});
		tr.addClass("selectedClaim title").after("<tr><td id='ClaimWraper' colspan='7' class='selectedClaim content'></td></tr>");
		MY.accidents.SelectedClaimView.appendTo("#ClaimWraper");

		Ember.run.next(function () { $("#ClaimDetailsContent").slideDown(); });
		return false;
	},
	newClaim: function (e) {
		var nTr = $(e.target).closest('tr')[0];
		$(e.target).replaceWith("<div id='divNewClaimCard' data-ctrl='{\"id\":\"0\",\"NewRec\":\"1\",\"Source\":\"tblClaims\",\"ClaimTypeID\":\"0\"}'></div>");
		d = { ctrl: $('#divNewClaimCard'), oDATA: oDATA.Get("tblClaimTypes"), opt: { val: 0, text: 1, FieldName: "ClaimTypeID", SelectText: "Pasirinkite žalos tipą:" },
			fnAfterOptClick: function (T) {
				$('#trNewClaimCard').find('div.HalfDivleft,div.HalfDivright,div.frmbottom').remove();
				fnSetClaimCard(1, T);
			},
			fnCancel: function () { $(nTr).find('td').html(CancelNewClaimHtml); }
		};
		oCONTROLS.Set_Updatable_HTML.mega_select_list(d);
		return false;
	},
	elementId: "AccDetailsContent",
	contentBinding: 'App.thisAccidentController.content',
	destroyElement: function () {
		if (MY.accidents.SelectedClaimView) {
			MY.accidents.SelectedClaimView.remove();
		}
	}
});
//reikia dadet TypeID, LossAmount
//var Claim = { ID: d[0], VehicleID: d[1], InsPolicyID: d[2], InsuranceClaimAmount: d[3], InsurerClaimID: d[4], IsTotalLoss: d[5],
//	IsInjuredPersons: d[6], Days: d[7], PerDay: d[8],
//	newClaim: this.get("newClaim")

App.SelectedClaimView = Ember.View.extend({
	didInsertElement: function () {
		oCONTROLS.UpdatableForm('#divClaimCard');
	},
	init: function () {      //    didInsertElement
		this._super();

		var d = this.get("rowContext"), C2 = d.Claims2, TypeID = oDATA.GET("tblClaimTypes").Data.findColValByColVal(d.InsuranceType, 1, 0);
		//Claims2: 0-ClaimID, 1-VehicleID, 2-InsPolicyID, 3-InsuranceClaimAmount, 4-InsurerClaimID, 5-IsTotalLoss, 6-IsInjuredPersons, 7-Days, 8-PerDay
		var Claim = {
			ID: C2[0],
			VehicleID: C2[1],
			InsPolicyID: C2[2],
			InsuranceClaimAmount: C2[3],
			InsurerClaimID: C2[4],
			IsTotalLoss: C2[5],
			IsInjuredPersons: C2[6],
			Days: C2[7],
			PerDay: C2[8],
			LossAmount: d.LossAmount,
			NewClaim: d.newClaim,
			TypeID: TypeID
		};
		App.claimEditController.set("content", [Claim]); //butinai masyvas view'e su each
	},
	SaveClaim: function (e) {
		var frm = $('#divClaimCard'), Action = 'Edit',
        Msg = {
        	Title: "Žalos redagavimas",
        	Success: "Žalos duomenys pakeisti.",
        	Error: "Nepavyko pakeisti žalos duomenų."
        };
		var DataToSave = oCONTROLS.ValidateForm(frm); // [{Fields: "AccidentID", Data: e.view.rowContext.accidentID } ]);         
		//, { Fields: "ClaimTypeID", Data: e.view.content.TypeID }    
		if (DataToSave) {
			DataToSave["Ext"] = e.view.rowContext.accidentID;
			var opt = {
				Action: Action,
				DataToSave: DataToSave,
				CallBack: {
					Success: function (resp) {
						var newRow = (resp.ResponseMsg.Ext).split("|#|");
						App.accidentsController.get("setNewVal").call(App.accidentsController, (newRow), [0, 1, 5, 6, 7, 8])[0]; //kuriuos reikia paverst integeriais
						//var newContext = App.accidentsController.findProperty("iD",parseInt(newRow[0], 10))
						//var newView = App.AccidentView.create({
						//    content:newContext,
						//    templateName: "tmpAccidentRow"
						//});
						var tr = $("#accidentsTable").find("div.selectedAccident"); //.empty();
						//newView.appendTo(tr);

						//Ember.View.create({
						//    personName: 'Dr. Tobias Fünke',
						//    template: Ember.Handlebars.compile('Hello {{personName}}')
						//}).appendTo(tr);
						tr.trigger("click");
					}
				},
				Msg: Msg
			};
			SERVER.update(opt);
		}
	},
	CancelSaveClaim: function () {
		oCONTROLS.UpdatableForm_reset("#divClaimCard");
	},
	DeleteClaim: function () {
		alert("DeleteSaveClaim");
	},
	templateName: 'tmpClaimEdit',
	elementId: "ClaimDetailsContent",
	contentBinding: 'App.claimEditController.content'
});
App.NewClaimView = Ember.View.extend({
	didInsertElement: function () {
		oCONTROLS.UpdatableForm('#divNewClaimCard');
	},
	init: function () {      //    didInsertElement
		this._super();

		var d = this.get("rowContext"), C2 = d.Claims2, TypeID = oDATA.GET("tblClaimTypes").Data.findColValByColVal(d.InsuranceType, 1, 0);
		//Claims2: 0-ClaimID, 1-VehicleID, 2-InsPolicyID, 3-InsuranceClaimAmount, 4-InsurerClaimID, 5-IsTotalLoss, 6-IsInjuredPersons, 7-Days, 8-PerDay
		var Claim = {
			ID: C2[0],
			VehicleID: C2[1],
			InsPolicyID: C2[2],
			InsuranceClaimAmount: C2[3],
			InsurerClaimID: C2[4],
			IsTotalLoss: C2[5],
			IsInjuredPersons: C2[6],
			Days: C2[7],
			PerDay: C2[8],
			LossAmount: d.LossAmount,
			NewClaim: d.newClaim,
			TypeID: TypeID
		};
		App.claimEditController.set("content", [Claim]); //butinai masyvas view'e su each
	},
	SaveClaim: function (e) {
		var frm = $('#divClaimCard'), Action = 'Edit',
        Msg = {
        	Title: "Žalos redagavimas",
        	Success: "Žalos duomenys pakeisti.",
        	Error: "Nepavyko pakeisti žalos duomenų."
        };
		var DataToSave = oCONTROLS.ValidateForm(frm); // [{Fields: "AccidentID", Data: e.view.rowContext.accidentID } ]);         
		//, { Fields: "ClaimTypeID", Data: e.view.content.TypeID }    
		if (DataToSave) {
			DataToSave["Ext"] = e.view.rowContext.accidentID;
			var opt = {
				Action: Action,
				DataToSave: DataToSave,
				CallBack: {
					Success: function (resp) {
						var newRow = (resp.ResponseMsg.Ext).split("|#|");
						App.accidentsController.get("setNewVal").call(App.accidentsController, (newRow), [0, 1, 5, 6, 7, 8])[0]; //kuriuos reikia paverst integeriais
						//var newContext = App.accidentsController.findProperty("iD",parseInt(newRow[0], 10))
						//var newView = App.AccidentView.create({
						//    content:newContext,
						//    templateName: "tmpAccidentRow"
						//});
						var tr = $("#accidentsTable").find("div.selectedAccident"); //.empty();
						//newView.appendTo(tr);

						//Ember.View.create({
						//    personName: 'Dr. Tobias Fünke',
						//    template: Ember.Handlebars.compile('Hello {{personName}}')
						//}).appendTo(tr);
						tr.trigger("click");
					}
				},
				Msg: Msg
			};
			SERVER.update(opt);
		}
	},
	CancelSaveClaim: function () {
		oCONTROLS.UpdatableForm_reset("#divClaimCard");
	},
	DeleteClaim: function () {
		alert("DeleteSaveClaim");
	},
	templateName: 'tmpClaimEdit',
	elementId: "ClaimDetailsContent",
	contentBinding: 'App.claimEditController.content'
});

//***************************************Controler**************************************************************
App.accidentsController = Em.ResourceController.create({
	filter: null,
	tableName: "proc_Accidents",
	fields: {},
	tbodyClick: function (e) {
		var AddD = $("#AccDetailsWraper");
		AddD.parent().find("div.selectedAccident").removeClass("selectedAccident").end().find("div.dividers").remove();
		if (AddD.length > 0) {
			MY.accidents.AcccidentdetailsView.remove();
			AddD.remove();
		}
		//if (e.isTrigger){
		//    e.context=App.accidentsController.get("getByID").call(App.accidentsController,e.context[0]);
		//    $(e.target).closest("div.tr").replaceWith((Em.TEMPLATES["tmpAccidentRow"](e.context)) );
		//}
		var tr = $(e.target).closest("div.tr").addClass("selectedAccident");

		MY.accidents.AcccidentdetailsView = App.SelectedAccidentView.create(e.context);
		tr.after("<div id='AccDetailsWraper'></div><div class='dividers'></div>").prev().before("<div class='dividers'></div>");
		MY.accidents.AcccidentdetailsView.appendTo("#AccDetailsWraper");

		Ember.run.next(function () {
			$("#AccDetailsContent, div.dividers").slideDown();
		});
		return false;
	},
	filteredRecords: function () {
		f = this.get("filter");
		if (!f) {
			return this.get('content');
		} else {
			f = f.toLowerCase();
			return this.get('content').filter(function (item, index, self) {
				return item[3].toLowerCase().indexOf(f) + item[4].toLowerCase().indexOf(f) + item[9].toLowerCase().indexOf(f) + item[10].toLowerCase().indexOf(f) + item[11].toLowerCase().indexOf(f) + item[12].toLowerCase().indexOf(f) + item[13].toLowerCase().indexOf(f) + item[14].toLowerCase().indexOf(f) > -8
			})
		}
	} .property('filter', 'content.@each').cacheable()
	//	filteredRecords: function () { ##valueBinding=\"App.accidentsController.filter\"
	//		alert(this.get("filter") + "__");
	//	} .observes("filter")
});
App.thisAccidentController = Em.ResourceController.create({
	content: [],
	tableName: "?"
	//    setContent: function (ArrView) {
	//        this.set("content", ArrView);
	//    }
});
App.claimEditController = Em.ResourceController.create({
	tableName: "?"
	//    setContent: function (ArrView) {
	//    	this.set("content", ArrView);
	//    }
});

MY.accidents = {
	fnGetClaimCard: function (NewRec, Claim) {
		var HTML = "",
        lstVehicles = "<div class='ExtendIt' data-ctrl='{\"Value\":" + Claim.VehicleID + ",\"Field\":\"VehicleID\",\"classes\":\"UpdateField\",\"id\":\"lstVehicles\",\"labelType\":\"Top\"}'></div>",
        lstInsPolicies = "<div class='ExtendIt' data-ctrl='{\"Value\":" + Claim.InsPolicyID + ",\"Field\":\"InsPolicyID\",\"classes\":\"UpdateField\",\"id\":\"lstInsPolicies\",\"labelType\":\"Top\"}'></div>";

		if (!NewRec) HTML = "<div id='divClaimCard' data-ctrl='{\"id\":\"" + Claim.ID + "\",\"NewRec\":\"0\",\"Source\":\"tblClaims\",\"ClaimTypeID\":\"" + Claim.TypeID + "\"}'>";
		if (Claim.TypeID == 6) {
			HTML += "<div class='left'>"; //HalfDivleft
			HTML += "<div class='ExtendIt' data-ctrl='{\"Value\":" + Claim.Days + ",\"Field\":\"Days\",\"classes\":\"UpdateField\",\"id\":\"inputDays\",\"labelType\":\"Top\"}'></div>";
			HTML += "<div class='ExtendIt' data-ctrl='{\"Value\":" + Claim.PerDay + ",\"Field\":\"PerDay\",\"classes\":\"UpdateField\",\"id\":\"inputPerDay\",\"labelType\":\"Top\"}'></div>";
			HTML += "<div class='ExtendIt' data-ctrl='{\"Value\":" + (Math.round((Claim.Days * Claim.PerDay * 100)) / 100) + ",\"Field\":\"LossAmount\",\"classes\":\"UpdateField\",\"id\":\"inputSum\",\"attr\":\"DISABLED\",\"labelType\":\"Top\"}'></div>"; //
			HTML += "</div><div class='right'>";
			HTML += lstVehicles;
		} else {
			HTML += "<div class='left'>"; //HalfDivleft
			HTML += lstVehicles + lstInsPolicies;
			HTML += "<div class='ExtendIt' a='1' data-ctrl='{\"Value\":\"" + Claim.InsurerClaimID + "\",\"Field\":\"InsurerClaimID\",\"classes\":\"UpdateField\",\"labelType\":\"Top\"}'></div>";

			HTML += "</div><div class='right'>";
			HTML += "<div class='ExtendIt' a='2' data-ctrl='{\"Value\":" + Claim.LossAmount + ",\"Field\":\"LossAmount\",\"classes\":\"LossAmount UpdateField\",\"labelType\":\"Top\"}'></div>";
			HTML += "<div class='ExtendIt' a='3' data-ctrl='{\"Value\":" + Claim.InsuranceClaimAmount + ",\"Field\":\"InsuranceClaimAmount\",\"classes\":\"InsuranceClaimAmount UpdateField\",\"labelType\":\"Top\"}'></div>";
			if (Claim.TypeID == 1) {
				HTML += "<div class='ExtendIt' data-ctrl='{\"Value\":" + Claim.IsTotalLoss + ",\"Field\":\"IsTotalLoss\",\"classes\":\"UpdateField\",\"labelType\":\"Top\"}'></div>";
			} else if (Claim.TypeID == 2) {
				HTML += "<div class='ExtendIt' a='4' data-ctrl='{\"Value\":" + Claim.IsInjuredPersons + ",\"Field\":\"IsInjuredPersons\",\"classes\":\"UpdateField\",\"labelType\":\"Top\"}'></div>";
			}
		}
		HTML += "</div><div class='frmbottom'>";
		if (!NewRec) {
			HTML += oCONTROLS.btnImgOnly({
				id: "btnDelete",
				icon: "ui-icon-trash",
				classes: "floatleft",
				title: "ištrinti žalą"
			});
		}
		HTML += "<div class='floatright'>" + oCONTROLS.btnTextOnly({
			classes: ("BtnBackGreen btnSaveClaim" + ((NewRec) ? " NewClaim" : "")),
			title: "Išsaugoti pakeitimus",
			text: "IŠSAUGOTI"
		});
		HTML += oCONTROLS.a({
			id: "btnCancelClaim",
			classes: ((NewRec) ? " NewClaim" : ""),
			title: "Atšaukti pakeitimus",
			value: "Atšaukti"
		});
		HTML += "</div></div></div>";
		return HTML;
	}
}
//        $.getJSON(url, function (data) {
//            var c=this.get("content");
//            for(var i=0; i<data.results.length; i++) {
//                console.log(data.results[i]);
//                c.pushObject(data.results[i]);
//            };
//            this.set
//        })

//    contentDidChange: function () {
//        alert("content changed"); // stuff here
//    } .observes('content')
//    //$.getJSON('/taxes.json', function(json) {
//         console.log('got response', taxes);
//         var taxes = json.map(function(item) {
//                      return self.createTaxFromJSON(item);
//                      });
//         self.set('content', taxes);
//         });
//   }
