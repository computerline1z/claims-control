﻿using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using CC.Classes;

namespace CC.Models {

	public class clsAccident {

		public clsAccident(int? No) {
			Repositories_Main AccRep = new Repositories_Main();
			Accident = AccRep.Get_tblAccident((No == null) ? 0 : No.Value);
			if (Accident == null) {
				Accident = new tblAccident {
					ID = 0,
					DriverID = 1,
					No = 0,
					Date = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, 0, 0, 0),
					IsNotOurFault = false,
					IsOtherParticipants = false,
					ShortNote = "",
					LocationCountry = "",
					LocationAddress = "",
					LocationDistrict = "",
					Lat = 0,
					Lng = 0,
					GMT = 0
				};
				NewRec = 1;
				Vehicles = null;
			}
			else {
				NewRec = 0;
				Vehicles = AccRep.Get_Vehicles(Accident.ID);
			}

			//var s = AccRep.Get_tblAccident_Types();????????
			//AccTypes = s.ToSelectListItem(1, i => i.ID, i => i.Name, i => i.ID.ToString());
		}

		public tblAccident Accident { get; set; }

		public int NewRec { get; set; }

		public IQueryable<AccidentVehicles> Vehicles { get; set; }

		//v.ID,
		//v.Plate,
		//v.tblVehicleMake.Name,
		//v.Model

		//public IEnumerable<SelectListItem> AccTypes { get; set; }
		//public IEnumerable<SelectListItem> Drivers { get; set; }
	}
	public class Emails {
		public string Email { get; set; }
	}

	public class AccidentVehicles {
		public int ID { get; set; }
		public string Title { get; set; }
	}

	public interface IAccidents {

		jsonArrays GetJSON_tblAccidents();

		jsonArrays GetJSON_proc_Accidents();

		jsonArrays GetJSON_tblAccident1(int id);

		jsonArrays GetJSON_proc_Drivers();

		jsonArrays GetJSON_tblAccidentTypes();

		jsonArrays GetJSON_tblClaimTypes();

		jsonArrays GetJSON_proc_Vehicles();

		jsonArrays GetJSON_proc_InsPolicies();

		jsonArrays GetJSON_tblInsurers();

		jsonArrays GetJSON_tblVehicleMakes();
	}

	public class Repositories_Main {
		private dbDataContext dc;

		public Repositories_Main() { dc = new dbDataContext(ConfigurationManager.ConnectionStrings["ClaimsControlConnectionString"].ConnectionString); }
		public jsonArrays GetJSON_userData() {
			jsonArrays JSON = new jsonArrays();
			JSON.Data = new object[]{ new object[] {//Turi būt masyvų masyvas
            UserData.Account,//0
            UserData.AccountID,//1
				UserData.UserID,
				UserData.UserName,
				UserData.DocsPath,
				"YYYY.MM.DD",
				(from a in dc.tblAccounts where a.ID==UserData.AccountID select a.tblCurrency.ShortName).FirstOrDefault()
            }};
			object[] Cols ={
            new { FName = "Account"},//0
            new { FName = "AccountID"},//1
            new { FName = "UserID"},//1
            new { FName = "UserName"},//1
				new { FName = "DocsPath"},//1
				new { FName = "DateFormat"},
				new { FName = "Currency"}
            }; JSON.Cols = Cols;
			//JSON.Config = new { Controler = "Main", tblUpdate = "tblDocsInAccidents" };
			return JSON;
		}
		public jsonArrays GetJSON_tblDocs() {
			jsonArrays JSON = new jsonArrays();
			JSON.Data = from d in dc.tblDocs
							where d.IsDeleted == false && d.tblDocType.AccountID == UserData.AccountID || d.tblDocType.AccountID == 0
							select new object[] {
            d.ID,//0
            d.DocName,//1
            //d.FileName,//2
            d.FileType,//3
            UserData.GetStringDate(d.FileDate),//4
            d.FileSize,//5
            d.UserID,//6
            d.DocTypeID,//7
            d.RefID,//8
            d.SortNo,//9
				d.GroupID,
				d.Description,
				d.HasThumb
            };
			object[] Cols ={
            new { FName = "ID"},//0
            new { FName = "DocName",Type="string"},//1
            //new { FName = "FileName",Type="string"},//2
            new { FName = "FileType",Type="string"},//3
            new { FName = "FileDate",Type="Date"},//4
            new { FName = "FileSize",Type="Integer"},//5
            new { FName = "UserID"},//6
            new { FName = "DocTypeID"},//7
            new { FName = "RefID"},//8
            new { FName = "SortNo",Type="Integer"},//9
            new { FName = "GroupID"},//8
				new { FName = "Description"},//8
				new { FName = "HasThumb"}
								}; JSON.Cols = Cols;
			JSON.Config = new { Controler = "Lists", tblUpdate = "tblDocs" };
			//         JSON.Grid = new {
			//            aoColumns = new object[]{
			//new {bVisible=false,bSearchable=false},//0//ID////DefaultUpdate=0
			//new {sTitle="DocName",sClass="smallFont"},//1//DocName//
			//new {sTitle="FileName",sClass="smallFont"},//2//FileName//
			//new {sTitle="FileType"},//3//FileType//
			//new {sTitle="FileDate"},//4//FileDate//
			//new {sTitle="FileSize"},//5//FileSize//
			//new {bVisible=false,bSearchable=false},//6//UserID////DefaultUpdate=0
			//new {bVisible=false,bSearchable=false},//7//DocTypeID////DefaultUpdate=0
			//new {bVisible=false,bSearchable=false},//8//RefID////DefaultUpdate=0
			//new {sTitle="SortNo"}//9//SortNo//
			//}, aaSorting = new object[] { new object[] { 3, "asc" } },//???
			//         };
			return JSON;
		}
		public jsonArrays GetJSON_tblDocType() {//orderby d.DocGroupID reikalingas sukabinant su GetJSON_tblDocGroup
			jsonArrays JSON = new jsonArrays();
			JSON.Data = from d in dc.tblDocTypes orderby d.DocGroupID where d.IsDeleted == false && (d.AccountID == UserData.AccountID || d.AccountID == 0)
							select new object[] {
							d.ID,//0
							d.Name,//1
							d.DocGroupID//2
							};
			object[] Cols ={
         new { FName = "ID"},//0
         new { FName = "Name",Type="string", LenMax=100,Validity="require().nonHtml().maxLength(100)"},//1
         new { FName = "DocGroupID",List=new{Source="tblDocGroup",iVal=0,iText=new object[]{1}}}//2
         }; JSON.Cols = Cols;
			JSON.Config = new { Controler = "Lists", tblUpdate = "tblDocTypes" };
			//JSON.Grid = new {
			//   aoColumns = new object[]{
			//   new {bVisible=false,bSearchable=false},//0//ID////DefaultUpdate=0
			//   new {sTitle="Pavadinimas",sClass="smallFont"},//1//Name//
			//   new {bVisible=false,bSearchable=false}//2//DocGroupID////DefaultUpdate=0
			//   }
			//};
			return JSON;
		}
		public jsonArrays GetJSON_tblDocGroup() {
			jsonArrays JSON = new jsonArrays();
			//var tblDocTypes = (from d in dc.tblDocTypes where d.IsDeleted == false && d.AccountID == UserData.AccountID select d.DocGroupID).ToArray();
			//JSON.Data = from d in dc.tblDocGroups where d.IsDeleted == false && tblDocTypes.Contains(d.ID)
			JSON.Data = from d in dc.tblDocGroups orderby d.ID where d.IsDeleted == false && (d.AccountID == UserData.AccountID || d.AccountID == 0) //Visiems vienodos grupės
							select new object[] {
								d.ID,//0
								d.Name,//1
								d.Ref//Naudojamas tik medžiui paišyt
							};
			object[] Cols ={
				new { FName = "ID"},//0
				new { FName = "Name",Type="string", LenMax=100,Validity="require().nonHtml().maxLength(100)"},//1
				new { FName = "Ref"}//0
			}; JSON.Cols = Cols;
			JSON.Config = new {
				Controler = "Lists", tblUpdate = "tblDocGroup"
			};
		//   JSON.Grid = new {
		//      aoColumns = new object[]{
		//new {bVisible=false,bSearchable=false},//0//ID////DefaultUpdate=0
		//new {sTitle="Vardas"},//1//Name//
		//new {bVisible=false}//0//ID////DefaultUpdate=0
		//}
		//	};
			return JSON;
		}
		public jsonArrays GetJSON_tblAccount() {
			jsonArrays JSON = new jsonArrays();
			JSON.Data = from p in dc.tblAccounts where p.ID == UserData.AccountID
							select new object[] {
				p.ID,//0
				p.Name,//1
				p.CountryID,//2
				p.CurrencyID,//3
				p.TimeZoneID,//4
				p.Email//5
			};
			object[] Cols ={//NotEditable=true // Unique=true// LenMax/LenEqual/LenMin:10
				//Date,DateLess,DateNoLess,Time,String
				new { FName = "ID"},//0
				new { FName = "Name", Type="String", Validity="require().nonHtml().maxLength(50)"},//2 ClaimType
				new { FName = "CountryID",List=new{Source="tblCountries",ListType="List", iVal="iD",iText=new object []{"name"}}},//3
				new { FName = "CurrencyID",List=new{Source="tblCurrencies",ListType="List", iVal="iD",iText=new object []{"name"}}},//3
				new { FName = "TimeZoneID",List=new{Source="tblTimeZones",ListType="List", iVal="iD",iText=new object []{"name"}}},//3
				new { FName = "Email",Type="String", LenMax=50,Validity="require().match(\"textWithPoint\").maxLength(50)"},//5
			}; JSON.Cols = Cols;
			JSON.Config = new { tblUpdate = "tblAccounts", Msg = new { Edit = "Sąskaitos redagavimas", GenName = "Sąskaita", GenNameWhat = "Sąskaitą" } };
			//JSON.Grid = new {
			//   aoColumns = new object[]{
			//      new {bVisible=false},//0//ID////DefaultUpdate=0
			//      new {sTitle="Įmonės pavadinimas"},//1//ClaimType//
			//      new {sTitle="Šalis"},//2//InsurerName//
			//      new {sTitle="Valiuta"},//3//PolicyNumber//
			//      new {sTitle="Laiko juosta"},//4//EndDate//
			//      new {sTitle="Paskyros el. pašto adresas"}
			//   }
			//};
			return JSON;
		}
		public jsonArrays GetJSON_tblCurrencies() {
			jsonArrays JSON = new jsonArrays();
			JSON.Data = from d in dc.tblCurrencies
							select new object[] {
		      d.ID,//0
		      d.Name//2
		      };
			object[] Cols ={
		      new { FName = "ID"},//0
		      new { FName = "Name",Type="String",}//2
		   }; JSON.Cols = Cols;
			JSON.Config = new { tblUpdate = "tblCurrencies", Msg = new { AddNew = "Naujos valiutos sukūrimas", Edit = "Valiutos redagavimas", Delete = "Ištrinti valiutą", GenName = "Valiuta", GenNameWhat = "Valiutą", ListName = "Valiutų sąrašas" } };
			//JSON.Grid = new {
			//   aoColumns = new object[]{
			//      new {bVisible=false},//0//ID
			//      new {sTitle="Valiuta"}
			//   },
			//};
			return JSON;
		}
		public jsonArrays GetJSON_tblCountries() {
			jsonArrays JSON = new jsonArrays();
			JSON.Data = from d in dc.tblCountries
							select new object[] {
		      d.ID,//0
		      d.Name//2
		      };
			object[] Cols ={
		      new { FName = "ID"},//0
		      new { FName = "Name",Type="String",}//2
		   }; JSON.Cols = Cols;
			JSON.Config = new { tblUpdate = "tblCountries", Msg = new { AddNew = "Naujos šalies sukūrimas", Edit = "Šalies redagavimas", Delete = "Ištrinti šalį", GenName = "Šalis", GenNameWhat = "Šalį", ListName = "Šalių sąrašas" } };
			//JSON.Grid = new {
			//   aoColumns = new object[]{
			//      new {bVisible=false},//0//ID
			//      new {sTitle="Šalis"}
			//   },
			//};
			return JSON;
		}
		public jsonArrays GetJSON_tblTimeZones() {
			jsonArrays JSON = new jsonArrays();
			JSON.Data = from d in dc.tblTimeZones
							select new object[] {
		      d.ID,//0
		      d.Name//2
		      };
			object[] Cols ={
		      new { FName = "ID"},//0
		      new { FName = "Name",Type="String",}//2
		   }; JSON.Cols = Cols;
			JSON.Config = new { tblUpdate = "tblTimeZones", Msg = new { AddNew = "Naujos zonos sukūrimas", Edit = "Zonos redagavimas", Delete = "Ištrinti laiko zoną", GenName = "Laiko zona", GenNameWhat = "Laiko zona", ListName = "Laiko zonos" } };
			//JSON.Grid = new {
			//   aoColumns = new object[]{
			//      new {bVisible=false},//0//ID
			//      new {sTitle="Laiko juosta"}
			//   },
			//};
			return JSON;
		}

		public jsonArrays GetJSON_tblAccidents() {
			jsonArrays JSON = new jsonArrays();
			//            JSON.Data = JSON.Data = from d in dc.tblAccidents
			//                                    orderby d.Date
			//                                    select new object[] {
			//d.ID,//0
			//d.AccidentTypeID,//1
			//d.AccountID,//2
			//d.DriverID,//3
			//d.No,//4
			//d.Date,//5
			//d.IsNotOurFault,//6
			//d.IsOtherParticipants,//7
			//d.ShortNote,//8
			//d.LongNote,//9
			//d.LocationCountry,//10
			//d.LocationAddress,//11
			//d.LocationDistrict,//12
			//d.Lat,//13
			//d.Lng,//14
			//d.GMT//15
			//};
			object[] Cols ={//NotEditable=true // Unique=true// LenMax/LenEqual/LenMin:10
				//Date,DateLess,DateNoLess,Time,String
				new { FName = "ID"},//0
				new { FName = "AccidentTypeID", List=new{Source="tblAccidentsTypes",iVal="iD",iText=new object[]{"name"},ListType="List"}},//1
				new { FName = "DriverID", List=new{Source="proc_Drivers",iVal="iD",iText=new object[]{"firstName","lastName"},Editable=new{EditThis=true},ListType="Combo"}},//3
				new { FName = "No",Type="Integer",Validity="require().match('integer')"},//4
				new { FName = "Date",Type="Date", Default="Today",Validity="require().match('date').lessThanOrEqualTo(new Date())"},//5
				new { FName = "IsNotOurFault",Type="Boolean"},//6
				new { FName = "IsOtherParticipants",Type="Boolean"},//7
				new { FName = "ShortNote", Type="String", LenMax=100,Validity="require().nonHtml().maxLength(100)"},//8
				new { FName = "LongNote",Type="String", LenMax=800,Validity="nonHtml().maxLength(800)"},//9
				new { FName = "LocationCountry",Type="String", LenMax=100,Validity="require().nonHtml().maxLength(100)"},//10
				new { FName = "LocationAddress",Type="String", LenMax=400,Validity="require().nonHtml().maxLength(400)"},//11
				new { FName = "LocationDistrict",Type="String", LenMax=80,Validity="require().nonHtml().maxLength(80)"},//12
				new { FName = "Lat",Type="Decimal", LenEqual=10,Validity="require().match('number')"},//13
				new { FName = "Lng",Type="Decimal", LenEqual=10,Validity="require().match('number')"},//14
				new { FName = "GMT",Type="Integer",Validity="require().match('integer')"}//15
			}; JSON.Cols = Cols;
			JSON.Config = new { Controler = "Accidents", tblUpdate = "tblAccidents" };
			//JSON.Grid = new {
			//   aoColumns = new object[]{
			//      new {bVisible=false},//0//ID////DefaultUpdate=0
			//      new {sTitle="Įvykio tipas"},//1//AccidentTypeID////DefaultUpdate=0
			//      //new {bVisible=false},//2//AccountID////DefaultUpdate=0
			//      new {sTitle="Atsakingas vairuotojas",bVisible=false},//3//DriverID////DefaultUpdate=0
			//      new {sTitle="Nr"},//4//No//
			//      new {sTitle="Įvykio data ir laikas (įvykio vietos laiku)"},//5//Date//
			//      new {sTitle="Kaltininkas - trečia šalis"},//6//IsOurFault//
			//      new {sTitle="Yra daugiau nei vienas kaltininkas"},//7//IsOtherParticipants//
			//      new {sTitle="Įvykio apibūdinimas",sClass="smallFont"},//8//ShortNote//
			//      new {sTitle="Įvykio aplinkybės",sClass="smallFont"},//9//LongNote//
			//      new {sTitle="Šalis",sClass="smallFont"},//10//LocationCountry//
			//      new {sTitle="Adresas",sClass="smallFont"},//11//LocationAddress//
			//      new {sTitle="Rajonas",sClass="smallFont"},//12//LocationDistrict//
			//      new {sTitle="Lat"},//13//Lat//
			//      new {sTitle="Lng"},//14//Lng//
			//      new {sTitle="GMT"}//15//GMT//
			//   },
			//   aaSorting = new object[] { new object[] { 4, "asc" } },
			//};
			return JSON;
		}

		public jsonArrays GetJSON_proc_Accidents() {
			jsonArrays JSON = new jsonArrays();
			JSON.Data = from d in dc.proc_Accidents(UserData.AccountID,null,UserData.UserID)
							select new object[] {
				d.ID,//0
				d.No,//1
				d.Date,//2
				d.Place,//3
				d.AccType,//4
				d.CNo_All,//5
				d.CNo_NotF,//6
				d.LossSum,//7
				d.AmountIsConfirmed,//8
				d.ShortNote,//9
				d.LongNote,//10
				d.Driver,//11
				d.UserName,//12
				d.Claims_C,//13
				d.Claims_C2,//,13
				d.DaysFrom,
				d.DocNo,
				d.Claims_TypeID,
				d.DriverID,
				d.IsNotOurFault
			};
			object[] Cols ={//NotEditable=true // Unique=true// LenMax/LenEqual/LenMin:10
				//Date,DateLess,DateNoLess,Time,String
				new { FName = "ID"},//0
				new { FName = "No"},//1
				new { FName = "Date"},//2
				new { FName = "Place"},//3
				new { FName = "AccType"},//4
				new { FName = "CNo_All"},//5
				new { FName = "CNo_NotF"},//6
				new { FName = "LossSum"},//7
				new { FName = "AmountIsConfirmed"},//8
				new { FName = "ShortNote"},//9
				new { FName = "LongNote"},//10
				new { FName = "Driver"},//11
				new { FName = "UserName"},//12
				new { FName = "Claims_C"},//13
				new { FName = "Claims_C2"},//14
				new { FName = "DaysFrom"},//15
				new { FName = "DocNo"},//15
				new { FName = "Claims_TypeID"},//15
				new { FName = "DriverID"},//15
				new { FName = "IsNotOurFault"}//15
			}; JSON.Cols = Cols;
			JSON.Config = new { Controler = "Accidents", tblUpdate = "" };
			//JSON.Grid = new {
			//   aoColumns = new object[]{
			//      new {bVisible=false},//0//ID//
			//      new {sTitle="Nr"},//1//No
			//      new {sTitle="Data"},//2//Date
			//      new {sTitle="Vieta"},//3//Place
			//      new {sTitle="Tipas"},//4//AccType
			//      new {sTitle="Visos"},//5//CNo_All
			//      new {sTitle="Atviros"},//6//CNo_NotF
			//      new {sTitle="Žalos suma"},//7//LossSum
			//      new {sTitle="Visa žalos suma"},//8//AmountIsConfirmed
			//      new {sTitle="Kas atsitiko"},//9//ShortNote//
			//      new {sTitle="Pastabos",sClass="smallFont"},//10//LongNote//
			//      new {sTitle="Vairuotojas"},//11//Driver
			//      new {sTitle="Kas įvedė"},//12//UserName
			//      new {sTitle="Žalos"},//13//Claims_C
			//      new {sTitle="Žalos2"},//14//Claims_C2
			//      new {sTitle="Praėjo dienų"},//14//Claims_C2
			//      new {sTitle="Dokumentai"},//14//Claims_C2
			//      new {sTitle="Žalų tipas"},//14//Claims_C2
			//      new {bVisible=false},
			//      new {bVisible=false}
			//      //new {bSortable=false,fnRender=function(){return <span class='ui-icon ui-icon-mail-closed'></span><span class='ui-icon ui-icon-mail-closed'></span>;}} //"function(oObj){return oObj.aData[0];}"}
			//   }
				//aaSorting = new object[] { new object[] { 2, "desc" } },
			//};
			return JSON;
		}

		public jsonArrays GetJSON_proc_Drivers(bool? OnlyTop) {
			jsonArrays JSON = new jsonArrays();
			//JSON.Data = from d in dc.tblDrivers
			// where d.IsDeleted == false && d.AccountID == UserData.AccountID
			JSON.Data = from d in dc.proc_Drivers(UserData.AccountID, OnlyTop)
							select new object[] {
				d.ID,//0
				d.FirstName,//1
				d.LastName,//2
				d.DateBorn,//3
				d.Phone,//5
				d.Docs,//6
				d.EndDate,//7
				d.NotUnique
			};
			object[] Cols ={
				new { FName = "ID"},//0
				new { FName = "FirstName",Type="String", LenMax=100,IsUnique=new object[]{1,2},Validity="require().nonHtml().maxLength(100)"},//1
				new { FName = "LastName",Type="String", LenMax=100,Validity="require().nonHtml().maxLength(100)"},//2
				new { FName = "DateBorn",Type="Date", Default="", Validity="require().match('date').lessThanOrEqualTo(new Date())"},//3  "Plugin":{"datepicker":{"minDate":"-3y","maxDate":"0"}} , Plugin = new {datepicker = new {maxDate=0}}
				new { FName = "Phone",Type="Integer", LenMax=20,Validity="nonHtml().maxLength(20)"},//5
				new { FName = "Docs",Type="String", NotEditable=1},//6
				new { FName = "EndDate",Type="DateLess", Default="",Validity="match('date').lessThanOrEqualTo(new Date())", Plugin = new {datepicker = new {minDate="-25y", maxDate=0}}},//7
				new { FName = "NotUnique", Default=""},//7
			}; JSON.Cols = Cols;
			JSON.Config = new { Controler = "Drivers", tblUpdate = "tblDrivers", titleFields = new object[] { "firstName", "lastName" }, Msg = new { AddNew = "Pridėti naują vairuotoją", Edit = "Vairuotojo duomenų redagavimas", Delete = "Ištrinti vairuotoją", GenName = "Vairuotojas", GenNameWhat = "vairuotoją", ListName = "Vairuotojų sąrašas" } };
			//JSON.Grid = new {
			//   aoColumns = new object[]{
			//      new {bVisible=false},//0//ID////DefaultUpdate=0
			//      new {sTitle="Vardas",sClass="smallFont"},//1//FirstName//
			//      new {sTitle="Pavardė",sClass="smallFont"},//2//LastName//
			//      new {sTitle="Gimimo data"},//3//DateBorn//
			//      new {sTitle="Mobilus telefonas"},//5//Phone//
			//      new {sTitle="Dokumentai"},//6//Docs//
			//      new {sTitle="Darbo pabaiga",bVisible=false}//7//EndDate//
			//   }, //aaSorting = new object[] { new object[] { 2, "asc" } },//???
			//};
			return JSON;
		}

		public jsonArrays GetJSON_tblAccidentTypes() {
			jsonArrays JSON = new jsonArrays();
			//JSON.Data = from c in dc.proc_Clients(LoginData.LoginID, null)
			JSON.Data = from d in dc.tblAccidentsTypes
							select new object[] {
				d.ID,//0
				d.Name//1
			};
			object[] Cols ={//NotEditable=true // Unique=true// LenMax/LenEqual/LenMin:10
				//Date,DateLess,DateNoLess,Time,String
				new { FName = "ID"},//0
				new { FName = "Name",Type="String", LenMax=30,Validity="require().nonHtml().maxLength(30)"}//1
			}; JSON.Cols = Cols;
			JSON.Config = new { Controler = "AccidentsTypes", tblUpdate = "tblAccidentsTypes" };
			//JSON.Grid = new {
			//   aoColumns = new object[]{
			//      new {bVisible=false},//0//ID////DefaultUpdate=0
			//      new {sTitle="Name",sClass="smallFont"}//1//Name//
			//   },
			//   aaSorting = new object[] { new object[] { 1, "asc" } },//???
			//};
			return JSON;
		}
		// JSON.Data = from d in dc.tblAccidents
		//       where d.No == No && d.IsDeleted == false
		public jsonArrays GetJSON_tblClaimTypes() {
			jsonArrays JSON = new jsonArrays();
			//JSON.Data = from c in dc.proc_Clients(LoginData.LoginID, null)
			JSON.Data = from d in dc.tblClaimTypes //where d.ID>0 //orderby d.Name
							select new object[] {
				d.ID,//0
				d.Name//1
			};
			object[] Cols ={//NotEditable=true // Unique=true// LenMax/LenEqual/LenMin:10
				//Date,DateLess,DateNoLess,Time,String
				new { FName = "ID"},//0
				new { FName = "Name",Type="String", LenMax=30,Validity="require().nonHtml().maxLength(30)"}//1
			}; JSON.Cols = Cols;
			JSON.Config = new { Controler = "ClaimTypes", tblUpdate = "tblClaimTypes" };
			//JSON.Grid = new {
			//   aoColumns = new object[]{
			//      new {bVisible=false},//0//ID////DefaultUpdate=0
			//      new {sTitle="Name"}//1//Name//
			//   }//,
			//   //aaSorting = new object[] { new object[] { 1, "asc" } },//???
			//};
			return JSON;
		}
		public jsonArrays GetJSON_proc_Years() {
			jsonArrays JSON = new jsonArrays();
			JSON.Data = from d in dc.proc_AccidentsYears(UserData.AccountID)
							select new object[] { d.years };
			object[] Cols = { new { FName = "Year" } }; JSON.Cols = Cols;
			return JSON;
		}

		public jsonArrays GetJSON_proc_Vehicles(bool? OnlyTop) {
			jsonArrays JSON = new jsonArrays();
			JSON.Data = from d in dc.proc_Vehicles(UserData.AccountID, OnlyTop)
							select new object[] {
				d.ID,//0
				d.Plate,//2
				d.Type,//1
				d.Make,//3
				d.Model,//4
				d.Year,//5
				d.Docs,//6
				d.EndDate,//7
				d.TypeID,//8
				d.MakeID//9
				};
			object[] Cols ={
				new { FName = "ID"},//0
				new { FName = "Plate",Type="String", LenMax=10,IsUnique=new object[]{2},Validity="require().nonHtml().maxLength(10)"},//2
				new { FName = "Type",Type="String",IdField="typeID"},//1
				new { FName = "Make",IdField="makeID"},//3
				new { FName = "Model",Type="String", LenMax=30,Validity="require().nonHtml().maxLength(30)"},//4
				new { FName = "Year",Type="Integer", LenEqual=4,Validity="require()"},//5
				new { FName = "Docs",Type="String",NotEditable=1},//6
				new { FName = "EndDate",Type="Date", LenMax=30,Validity="match('date').lessThanOrEqualTo(new Date())"},//7
				new { FName = "TypeID",List=new{Source="tblVehicleTypes",ListType="List", iVal="iD",iText=new object []{"name"}}},//8
				new { FName = "MakeID",List=new{Source="tblVehicleMakes",Editable=new{EditList=true},ListType="List", iVal="iD",iText=new object []{"name"}}}//9
			}; JSON.Cols = Cols;
			JSON.Config = new { Controler = "Vehicles", tblUpdate = "tblVehicles", titleFields = new object[] { "plate", "make" }, Msg = new { AddNew = "Naujos transporto priemonės sukūrimas", Edit = "Transporto priemonių redagavimas", Delete = "Ištrinti transporoto priemonę", GenName = "Transporto priemonė", GenNameWhat = "Transporto priemonę", ListName = "Transporto priemonių sąrašas" } };
			//JSON.Grid = new {
			//   aoColumns = new object[]{
			//      new {bVisible=false},//0//ID
			//      new {sTitle="Valst.Nr."},//2//Plate//
			//      new {sTitle="Tipas"},//1//Type//
			//      new {sTitle="Markė"},//3//Make
			//      new {sTitle="Modelis"},//4//Model//
			//      new {sTitle="Pagaminimo metai"},//5//Year//
			//      new {sTitle="Dokumentai"},//6//Docs//
			//      new {bVisible=false,sTitle="Naudojimo pabaigos data"},//7//EndDate//
			//      new {bVisible=false,sTitle="Tipas"},//8//TypeID//
			//      new {bVisible=false,sTitle="Markė"}//9//MakeID//
			//   },
			//   //aaSorting = new object[] { new object[] { 1, "asc" } },//???
			//};
			return JSON;
		}

		public jsonArrays GetJSON_tblUsers() {
			jsonArrays JSON = new jsonArrays();
			JSON.Data = from d in dc.tblUsers where d.AccountID == UserData.AccountID && d.IsDeleted == false
							select new object[] {
				d.ID,//0
				d.FirstName,//2
				d.Surname,//1
				d.Email,//3
				d.IsAdmin,
				d.IsActive,
				d.LanguageID,
				d.Position,
				d.Phone,
				d.MobPhone,
				d.EMailForIns,
				d.warnOnNewClaim,
				d.warnOnTaskExpire,
				d.warnOnInfoSubmitExpire,
				d.warnOnPaymentExpire
				};
			object[] Cols ={
				new { FName = "ID"},//0
				new { FName = "FirstName",Type="String",Validity="require().nonHtml().maxLength(50)"},//2
				new { FName = "Surname",Type="String",Validity="require().nonHtml().maxLength(50)"},//1
				new { FName = "Email",Type="Email",Validity="require().nonHtml().match(\"email\").maxLength(35)"},//3 'email'
				new { FName = "IsAdmin",Type="Boolean"},//3
				new { FName = "IsActive",Type="Boolean"},//3
				new { FName = "LanguageID",List=new{Source="tblLanguages",ListType="List", iVal="iD",iText=new object []{"name"}}},
				new { FName = "Position",Type="String"},
				new { FName = "Phone",Type="String"},
				new { FName = "MobPhone",Type="String"},
				new { FName = "EMailForIns",Type="Email",Validity="nonHtml().match(\"email\").maxLength(35)"},
				new { FName = "warnOnNewClaim",Type="Integer"},
				new { FName = "warnOnTaskExpire",Type="Integer"},
				new { FName = "warnOnInfoSubmitExpire",Type="Integer"},
				new { FName = "warnOnPaymentExpire",Type="Integer"}
			}; JSON.Cols = Cols;
			JSON.Config = new { tblUpdate = "tblUsers", titleFields = new object[] { "firstName", "surname" }, Msg = new { AddNew = "Naujo vartotojo sukūrimas", Edit = "Vartotojo redagavimas", Delete = "Ištrinti vartotoją", GenName = "Vartotojas", GenNameWhat = "Vartotoją", ListName = "Vartotojų sąrašas" } };
			//JSON.Grid = new {
			//   aoColumns = new object[]{
			//      new {bVisible=false},//0//ID
			//      new {sTitle="Vardas"},
			//      new {sTitle="Pavardė"},
			//      new {sTitle="El. paštas"},
			//      new {sTitle="Yra administratorius"},
			//      new {sTitle="Prisijungti leidžiama"},
			//      new {sTitle="Sąsajos kalba"},
			//      new {sTitle="Pareigos"},
			//      new {sTitle="Telefonas"},
			//      new {sTitle="Mobilus"},
			//      new {sTitle="El. paštas"}
			//      //nuo warnOnNewClaim titulu nededu, nes jie nereikalingi
			//   },
			//   //aaSorting = new object[] { new object[] { 1, "asc" } },//???
			//};
			return JSON;
		}

		public jsonArrays GetJSON_proc_InsPolicies(bool? OnlyTop) {
			jsonArrays JSON = new jsonArrays();
			JSON.Data = from p in dc.proc_InsPolicies(UserData.AccountID, OnlyTop) //where p.ID>0
							select new object[] {
				p.ID,//0
				p.ClaimType,//1
				p.InsurerName,//2
				p.PolicyNumber,//3
				p.EndDate,//4
				p.InsuredName,//5
				p.InsuredCode,//6
				p.InsuredAddress,//7
				p.InsuredContactName,//8
				p.InsuredContactID,//9
				p.ClaimTypeID,//10
				p.InsurerID,//11
				p.MailsAddresses,
				p.warn_DocsAfterAccTerm,
				p.warn_DocsSupplyTermExpire,
				p.warn_PaymentTerm
			};
			object[] Cols ={//NotEditable=true // Unique=true// LenMax/LenEqual/LenMin:10
				//Date,DateLess,DateNoLess,Time,String
				new { FName = "ID"},//0
				new { FName = "ClaimType",IdField="claimTypeID"},//2
				new { FName = "InsurerName",IdField="insurerID"},//3
				new { FName = "PolicyNumber",Type="String", LenMax=50,Validity="require().nonHtml().maxLength(50)"},//3

				new { FName = "EndDate",Type="DateMore", Default="Today",Validity="require().match('date')"},//.greaterThanOrEqualTo(new Date()) 4
				new { FName = "InsuredName",Type="String", LenMax=50,Validity="nonHtml().maxLength(50)"},//5
				new { FName = "InsuredCode",Type="String", LenMax=50,Validity="nonHtml().maxLength(50)"},//6

				new { FName = "InsuredAddress",Type="String", LenMax=100,Validity="nonHtml().maxLength(100)"},//7
				new { FName = "InsuredContactName",Type="String"},//8
				new { FName = "InsuredContactID",List=new{Source="tblUsers",ListType="List", iVal="iD",iText=new object []{"firstName","surname"},mapWithNoCommas=1}},//9
				new { FName = "ClaimTypeID",List=new{Source="tblClaimTypes",ListType="List", iVal="iD",iText=new object []{"name"}}},//10
				new { FName = "InsurerID",List=new{Source="tblInsurers",Editable=new{EditList=true},ListType="List", iVal="iD",iText=new object []{"name"}}},//11
				new { FName = "MailsAddresses",Type="String",LenMax=250,Validity="nonHtml().maxLength(250)"},//5

				new { FName = "warn_DocsAfterAccTerm",Type="Integer",Validity="require().match('integer').maxLength(4).greaterThanOrEqualTo(0)"},//6
				new { FName = "warn_DocsSupplyTermExpire",Type="Integer",Validity="require().match('integer').maxLength(4).greaterThanOrEqualTo(0)"},//7
				new { FName = "warn_PaymentTerm",Type="Integer",Validity="require().match('integer').maxLength(4).greaterThanOrEqualTo(0)"},//8
								}; JSON.Cols = Cols;
			JSON.Config = new { Controler = "InsPolicy", tblUpdate = "tblInsPolicies", titleFields = new object[] { "policyNumber", "insurerName" }, Msg = new { AddNew = "Naujos draudimo sutarties sukūrimas", Edit = "Draudimo sutarties redagavimas", Delete = "Ištrinti draudimo sutartį", GenName = "Draudimo sutartis", GenNameWhat = "draudimo polisą", ListName = "Draudimo sutarčių sąrašas" } };
			//JSON.Grid = new {
			//   aoColumns = new object[]{
			//      new {bVisible=false},//0//ID////DefaultUpdate=0
			//      new {sTitle="Draudimo rūšis"},//1//ClaimType//
			//      new {sTitle="Draudimo kompanija"},//2//InsurerName//
			//      new {sTitle="Poliso numeris"},//3//PolicyNumber//

			//      new {sTitle="Poliso pabaigos data"},//4//EndDate//

			//      new {sTitle="Draudėjas"},//5//InsuredName////DefaultUpdate=0
			//      new {sTitle="Draudėjo kodas",bVisible=false},//6//InsuredName//
			//      new {sTitle="Draudėjo adresas",bVisible=false},//7//InsuredCode//
			//      new {sTitle="Kontaktinis asmuo",bVisible=false},//8//InsuredContact//
			//      new {bVisible=false,sTitle="Kontaktinis asmuo"},//9//InsuredContactID////UserID
			//      new {bVisible=false,sTitle="Draudimo rūšis"},//10//ClaimTypeID////DefaultUpdate=0
			//      new {bVisible=false,sTitle="Draudimo kompanija"},//11//InsurerID////
			//      new {bVisible=false,sTitle="Pranešimą apie žalą siųsti į:"},//12//InsurerID////

			//      new {sTitle=""},
			//      new {sTitle=""},
			//      new {sTitle=""}

			//   }
			//   // aaSorting = new object[] { new object[] { 3, "asc" } },//???
			//};
			return JSON;
		}

		public jsonArrays GetJSON_tblAccident1(int No) {
			jsonArrays JSON = new jsonArrays();
			JSON.Data = from d in dc.tblAccidents
							where d.No == No && d.IsDeleted == false
							select new object[] {
				d.ID,//0
				d.AccidentTypeID,//1
				d.AccountID,//2
				d.DriverID,//3
				d.No,//4
				//(d.Date.ToShortDateString()+' '+d.Date.ToShortTimeString()),//5
				new string[]{d.Date.ToShortDateString().Replace(".","-"),d.Date.ToShortTimeString()},
				d.IsNotOurFault,//6
				d.IsOtherParticipants,//7
				d.ShortNote,//8
				d.LongNote,//9
				d.LocationCountry,//10
				d.LocationAddress,//11
				d.LocationDistrict,//12
				d.Lat,//13
				d.Lng,//14
				d.GMT,//15
				//d.IsDeleted//16
			};

			object[] Cols ={//NotEditable=true // Unique=true// LenMax/LenEqual/LenMin:10
				//Date,DateLess,DateNoLess,Time,String
				new { FName = "ID"},//0
				new { FName = "AccidentTypeID",Tip="Pasirinkite iš sąrašo11.."},//1
				new { FName = "AccountID"},//2
				new { FName = "DriverID",Tip="Pradėkite vesti11.."},//3
				new { FName = "No",Type="Integer",Validity="require().match('integer').maxLength(13).greaterThanOrEqualTo(0)"},//4
				new { FName = "Date",Type="Date", Default="Today",Validity="require().match('date').lessThanOrEqualTo(new Date())"},//5
				new { FName = "IsNotOurFault",Type="Boolean",Validity="require()"},//6
				new { FName = "IsOtherParticipants",Type="Boolean",Validity="require()"},//7
				new { FName = "ShortNote",Tip="Vienu sakiniu11..",Type="String", LenMax=50,Validity="require().nonHtml().maxLength(50)"},//8
				new { FName = "LongNote",Type="String", LenMax=400,Validity="nonHtml().maxLength(400)"},//9
				new { FName = "LocationCountry",Type="String", LenMax=50,Validity="require().nonHtml().maxLength(50)"},//10
				new { FName = "LocationAddress",Type="String", LenMax=200,Validity="require().nonHtml().maxLength(200)"},//11
				new { FName = "LocationDistrict",Type="String", LenMax=80,Validity="require().nonHtml().maxLength(80)"},//12
				new { FName = "Lat",Type="Decimal",Validity="require().match('number').greaterThanOrEqualTo(0)"},//13
				new { FName = "Lng",Type="Decimal",Validity="require().match('number').greaterThanOrEqualTo(0)"},//14
				new { FName = "GMT",Type="Integer",Validity="require().match('integer').maxLength(13).greaterThanOrEqualTo(0)"},//15
				//new { FName = "IsDeleted",Type="Boolean"}}//16
			}; JSON.Cols = Cols;
			JSON.Config = new { Controler = "Accidents", tblUpdate = "tblAccidents" };
			//JSON.Grid = new {
			//   aoColumns = new object[]{
			//      new {bVisible=false},//0//ID////DefaultUpdate=0
			//      new {bVisible=false},//1//AccidentTypeID////DefaultUpdate=0
			//      new {bVisible=false},//2//AccountID////DefaultUpdate=0
			//      new {bVisible=false},//3//DriverID////DefaultUpdate=0
			//      new {sTitle="Nr"},//4//No//
			//      new {sTitle="Įvykio data ir laikas (įvykio vietos laiku)"},//5//Date//
			//      new {sTitle="Kaltininkas - trečia šalis"},//6//IsNotOurFault//
			//      new {sTitle="Yra daugiau nei vienas kaltininkas"},//7//IsOtherParticipants//
			//      new {sTitle="Kas atsitiko",sClass="smallFont"},//8//ShortNote//
			//      new {sTitle="Įvykio aplinkybės",sClass="smallFont"},//9//LongNote//
			//      new {sTitle="LocationCountry",sClass="smallFont"},//10//LocationCountry//
			//      new {sTitle="Adresas",sClass="smallFont"},//11//LocationAddress//
			//      new {sTitle="LocationDistrict",sClass="smallFont"},//12//LocationDistrict//
			//      new {sTitle="Lat"},//13//Lat//
			//      new {sTitle="Lng"},//14//Lng//
			//      new {sTitle="GMT"},//15//GMT//
			//      //new {sTitle="IsDeleted"}//16//IsDeleted//
			//   }
			//};
			return JSON;
		}

		public tblAccident Get_tblAccident(int No) {
			return (from d in dc.tblAccidents
					  where d.No == No && d.IsDeleted == false && d.AccountID == UserData.AccountID
					  select d).SingleOrDefault() ?? null;
		}
		public IQueryable<AccidentVehicles> Get_Vehicles(int accidentID) {
			return (from c in dc.tblClaims join v in dc.tblVehicles on c.VehicleID equals v.ID
					  where c.AccidentID == accidentID && c.IsDeleted == false
					  select new AccidentVehicles {
						  ID = v.ID,
						  Title = v.Plate + "," + v.tblVehicleMake.Name + "," + v.Model + " dokumentai"
					  });
		}

		public jsonArrays GetJSON_tblInsurers() {
			jsonArrays JSON = new jsonArrays();
			JSON.Data = from d in dc.tblInsurers
							where d.IsDeleted == false && d.AccountID == UserData.AccountID
							select new object[] {
				d.ID,//0
				d.Name,//1
				d.CountryID,//2
				d.CountryDefault,//3
			};
			object[] Cols ={//NotEditable=true // Unique=true// LenMax/LenEqual/LenMin:10
				//Date,DateLess,DateNoLess,Time,String
				new { FName = "ID"},//0
				new { FName = "Name",Type="String", LenMax=50,IsUnique=new object[]{1},Validity="require().nonHtml().maxLength(50)"},//1
				new { FName = "CountryID"},//2
				new { FName = "CountryDefault",Type="Integer",Validity="require().match('integer').maxLength(13).greaterThanOrEqualTo(0)"},//3
			}; JSON.Cols = Cols;
			JSON.Config = new { Controler = "Insurers", tblUpdate = "tblInsurers", Msg = new { AddNew = "Naujo draudiko sukūrimas", Edit = "Draudiko redagavimas", Delete = "Ištrinti draudiką", GenName = "Draudikas", GenNameWhat = "Draudiką", ListName = "Draudimo kompanijos" } };

			//JSON.Grid = new {
			//   aoColumns = new object[]{
			//      new {bVisible=false},//0//ID////DefaultUpdate=0
			//      new {sTitle="Name",sClass="smallFont"},//1//Name//
			//      new {bVisible=false},//2//CountryID////DefaultUpdate=0
			//      new {sTitle="CountryDefault"},//3//CountryDefault//
			//   }, aaSorting = new object[] { new object[] { 3, "asc" } },//???
			//};
			return JSON;
		}

		public jsonArrays GetJSON_tblVehicleMakes() {
			jsonArrays JSON = new jsonArrays();
			//JSON.Data = from c in dc.proc_Clients(LoginData.LoginID, null)
			JSON.Data = from d in dc.tblVehicleMakes
							where d.IsDeleted == false && d.AccountID == UserData.AccountID
							select new object[] {
				d.ID,//0
				d.Name,//1
			};
			object[] Cols ={//NotEditable=true // Unique=true// LenMax/LenEqual/LenMin:10
				//Date,DateLess,DateNoLess,Time,String
				new { FName = "ID"},//0
				new { FName = "Name",Type="String", LenMax=50,IsUnique=new object[]{1},Validity="require().nonHtml().maxLength(50)"},//1
			}; JSON.Cols = Cols;
			JSON.Config = new { Controler = "VehicleMakes", tblUpdate = "tblVehicleMakes", titleFields = new object[] { "name" }, Msg = new { AddNew = "Naujos tr. priemonių markės sukūrimas", Edit = "Tr. priemonių markės redagavimas", Delete = "Ištrinti tr. priemonių markę", GenName = "Tr. priemonės markė", GenNameWhat = "transporto priemonę", ListName = "Transporto priemonių markės" } };
			//JSON.Grid = new {
			//   aoColumns = new object[]{
			//      new {bVisible=false,sTitle="Markė"},//0//ID////DefaultUpdate=0
			//      new {sTitle="Name",sClass="smallFont"}//1//Name//
			//   }//, aaSorting = new object[] { new object[] { 3, "asc" } },//???
			//};
			return JSON;
		}

		public jsonArrays GetJSON_tblVehicleTypes() {
			jsonArrays JSON = new jsonArrays();
			//JSON.Data = from c in dc.proc_Clients(LoginData.LoginID, null)
			JSON.Data = from d in dc.tblVehicleTypes
							select new object[] {
				d.ID,//0
				d.Name,//1
			};
			object[] Cols ={//NotEditable=true // Unique=true// LenMax/LenEqual/LenMin:10
				//Date,DateLess,DateNoLess,Time,String
				new { FName = "ID"},//0
				new { FName = "Name",Type="String", LenMax=50,IsUnique=new object[]{1},Validity="require().nonHtml().maxLength(50)"},//1
			}; JSON.Cols = Cols;
			//JSON.Config = new { Controler = "VehicleMakes", tblUpdate = "tblVehicleMakes", Msg = new { AddNew = "Naujos tr. priemonių markės sukūrimas", Edit = "Tr. priemonių markės redagavimas", Delete = "Ištrinti tr. priemonių markę", GenName = "Tr. priemonės markė", GenNameWhat = "transporto priemonę", ListName = "Tr. priemonių sąrašas" } };
			//JSON.Grid = new {
			//   aoColumns = new object[]{
			//      new {bVisible=false},//0//ID////DefaultUpdate=0
			//      new {sTitle="Name",sClass="smallFont"},//1//Name//
			//   }//, aaSorting = new object[] { new object[] { 3, "asc" } },//???
			//};
			return JSON;
		}
		public jsonArrays GetJSON_tblLanguages() {
			jsonArrays JSON = new jsonArrays();
			//JSON.Data = from c in dc.proc_Clients(LoginData.LoginID, null)
			JSON.Data = from d in dc.tblLanguages
							select new object[] {
				d.ID,//0
				d.Name//1
			};
			object[] Cols ={//NotEditable=true // Unique=true// LenMax/LenEqual/LenMin:10
				//Date,DateLess,DateNoLess,Time,String
				new { FName = "ID"},//0
				new { FName = "Name",Type="String", LenMax=50,IsUnique=new object[]{1},Validity="require().nonHtml().maxLength(50)"}
			}; JSON.Cols = Cols;
			//JSON.Config = new { Controler = "VehicleMakes", tblUpdate = "tblVehicleMakes", Msg = new { AddNew = "Naujos tr. priemonių markės sukūrimas", Edit = "Tr. priemonių markės redagavimas", Delete = "Ištrinti tr. priemonių markę", GenName = "Tr. priemonės markė", GenNameWhat = "transporto priemonę", ListName = "Tr. priemonių sąrašas" } };
			//JSON.Grid = new {
			//   aoColumns = new object[]{
			//      new {bVisible=false},//0//ID////DefaultUpdate=0
			//      new {sTitle="Name"}
			//   }//, aaSorting = new object[] { new object[] { 3, "asc" } },//???
			//};
			return JSON;
		}
		public jsonArrays GetJSON_proc_Claim1(int ClaimID) {//Laukai turi sutapt su GetJSON_proc_Claims
			jsonArrays JSON = new jsonArrays();
			JSON.Data = from d in dc.proc_Claims(UserData.AccountID, ClaimID)
							select new {
				d.ID,//0
				d.ClaimTypeID,//1
				d.AccidentID,//2
				d.InsPolicyID,//3
				d.VehicleID,//4
				d.No,//5
				d.IsTotalLoss,//6
				d.LossAmount,//7
				d.InsuranceClaimAmount,//8
				d.IsInjuredPersons,//9
				d.InsurerClaimID,//10
				d.ClaimStatus,//11
				d.AmountIsConfirmed,//12
				d.Days,//13
				d.PerDay,//14
				d.DateNotification,
				d.DateDocsSent
				};
			return JSON;
		}
		public jsonArrays GetJSON_proc_Claims() { //Laukai turi sutapt su GetJSON_proc_Claim1
			jsonArrays JSON = new jsonArrays();
			JSON.Data = from d in dc.proc_Claims(UserData.AccountID,null)
							select new object[] {
				d.ID,//0
				d.ClaimTypeID,//1
				d.AccidentID,//2
				d.InsPolicyID,//3
				d.VehicleID,//4
				d.No,//5
				d.IsTotalLoss,//6
				d.LossAmount,//7
				d.InsuranceClaimAmount,//8
				d.IsInjuredPersons,//9
				d.InsurerClaimID,//10
				d.ClaimStatus,//11
				d.AmountIsConfirmed,//12
				d.Days,//13
				d.PerDay,//14
				d.DateNotification,
				d.DateDocsSent
				};

			object[] Cols ={
				new { FName = "ID"},//0
				new { FName = "ClaimTypeID", List=new{Source="tblClaimTypes",iVal="iD",iText=new object[]{"name"},ListType="List"}},//1
				new { FName = "AccidentID"},//2
				new { FName = "InsPolicyID", List=new{Source="proc_InsPolicies",iVal="iD",iText=new object[]{"claimType","insurerName"},Editable = new{EditThis=true,AddNew=true},ListType="List"}},//Editable=new{EditList=true}3 ,Append=new{id=0,value="Neapdrausta"}
				new { FName = "VehicleID", List=new{Source="proc_Vehicles",iVal="iD",iText=new object[]{"plate","type","make","model"},ListType="None"}},//4
				new { FName = "No",Type="Integer", LenMax=10,Validity="require().match('integer').maxLength(13).greaterThanOrEqualTo(0)"},//5
				new { FName = "IsTotalLoss",Type="Boolean"},//6
				new { FName = "LossAmount",Type="Money", LenMax=15,Validity="require().match('number').greaterThanOrEqualTo(0)"},//7
				new { FName = "InsuranceClaimAmount",Type="Money", LenMax=15,Validity="require().match('number').greaterThanOrEqualTo(0)"},//8
				new { FName = "IsInjuredPersons",Type="Boolean"},//9
				new { FName = "InsurerClaimID",Type="String", LenMax=50,Validity="maxLength(50)"},//10
				new { FName = "ClaimStatus",Type="Integer", LenEqual=2,Validity="require().match('integer').maxLength(2).greaterThanOrEqualTo(0)"},//11
				new { FName = "AmountIsConfirmed",Type="Boolean"},//12
				new { FName = "Days",Type="Integer", LenMax=10,Validity="require().match('integer').maxLength(10).greaterThanOrEqualTo(0)"},//13
				new { FName = "PerDay",Type="Money", LenEqual=10,Validity="require().match('number').greaterThanOrEqualTo(0)"},//14
				new { FName = "DateNotification",Type="Date", Validity="match('date')"},
				new { FName = "DateDocsSent",Type="Date", Validity="match('date')"}
				}; JSON.Cols = Cols;
			JSON.Config = new {
				Controler = "Claims", tblUpdate = "tblClaims", Msg = new { AddNew = "Naujos žalos pridėjimas", Edit = "Žalos redagavimas", Delete = "Ištrinti žalą", GenName = "Žala" }
			};
			//JSON.Grid = new {
			//   aoColumns = new object[]{
			//   new {bVisible=false},//0
			//   new {sTitle="Draudimo rūšis"},//1//ClaimTypeID////DefaultUpdate=0
			//   new {bVisible=false},//2//AccidentID////DefaultUpdate=0
			//   new {sTitle="Draudimo sutartis"},//3//InsPolicyID////DefaultUpdate=0
			//   new {sTitle="Transporto priemonė"},//4//VehicleID////DefaultUpdate=0
			//   new {sTitle="Nr"},//5//No//
			//   new {sTitle="Visiškas praradimas"},//6//IsTotalLoss//
			//   new {sTitle="Planuojama žalos suma"},//7//LossAmount//
			//   new {sTitle="Planuojama draudimo išmoka"},//8//InsuranceClaimAmount//
			//   new {sTitle="Įvykio metu sužaloti tretieji asmenys"},//9//IsInjuredPersons//
			//   new {sTitle="Žalos nr. draudiko sistemoje"},//10//InsurerClaimID////DefaultUpdate=0
			//   new {sTitle="Žalos būklė"},//11//ClaimStatus//
			//   new {sTitle="Žalos suma patvirtinta"},//12//AmountIsConfirmed//
			//   new {sTitle="Prastovų skaičius dienomis"},//13//Days//
			//   new {sTitle="Vienos dienos prastovos kaina"},//14//PerDay//
			//   new {sTitle="Pranešimo data"},
			//   new {sTitle="Dokumentų pateikimo data"}
			//   }
			//};
			return JSON;
		}

		public IEnumerable<tblAccidentsType> Get_tblAccident_Types() {
			return (from d in dc.tblAccidentsTypes
					  //where d.No == No && d.IsDeleted == false
					  select d).AsEnumerable();
		}

		public jsonArrays GetJSON_proc_Activities() {
			jsonArrays JSON = new jsonArrays();
			JSON.Data = from a in dc.proc_Activities(UserData.AccountID)
							select new object[] {
				a.ID,//0
				a.ClaimID,//1
				a.TypeID,//2
				a.FromText,//3
				a.FromID,//4
				a.ToText,//5
				a.ToID,//6
				a.Subject,//7
				a.Body,//8
				a.Date,//9
				a.UserID,//10
				a.EntryDate,//11
				a.Amount,//12
				a.Docs//13
				};
			object[] Cols ={
				new { FName = "ID"},//0
				new { FName = "ClaimID"},//1
				new { FName = "TypeID"},//2
				new { FName = "FromText",Type="String"},//3 Value pagal nutylėjimą esamas useris
				new { FName = "FromID", List=new{Source="tblUsers",iVal="iD",iText=new object[]{"firstName","surname"},ListType="List"}},//4
				new { FName = "ToText",Type="String"},//5 
				new { FName = "ToID", List=new{Source="tblUsers",iVal="iD",iText=new object[]{"firstName","surname"},ListType="List"}},//6
				new { FName = "Subject",Type="String",Validity="require()"},//7
				new { FName = "Body",Type="Textarea"},//8
				new { FName = "Date",Default="Today",Type="Date", Validity="require().match('date')",Plugin = new {datepicker = new {minDate=0, maxDate="2y"}}},//9
				new { FName = "UserID", Default="UserId"},//10
				new { FName = "EntryDate", Default="Today"},//11
				new { FName = "Amount",Type="Money", LenMax=15,Validity="require().match('number').greaterThanOrEqualTo(0)"},//12
				new { FName = "Docs"}//13
				}; JSON.Cols = Cols;
			JSON.Config = new {
				tblUpdate = "tblActivity", Msg = new { AddNew = "Naujos veiklos pridėjimas", Edit = "Veiklos redagavimas", Delete = "Ištrinti veiklą", GenName = "Veikla" }
			};
			//JSON.Grid = new {
			//   aoColumns = new object[]{
			//   new {bVisible=false},//0
			//   new {bVisible=false},//1 ClaimID
			//   new {bVisible=false},//2 TypeID
			//   new {sTitle="Kas"},//3 FromText
			//   new {sTitle="Kas"},// FromID
			//   new {sTitle="Su kuo"},//5 ToText
			//   new {sTitle="Su kuo"},//6 ToID
			//   new {sTitle="Tema"},//7 Subject
			//   new {sTitle=""},//8 Body
			//   new {sTitle="Kada"},//9 Date
			//   new {sTitle=""},//10 UserID
			//   new {sTitle=""},//11 EntryDate
			//   new {sTitle="Suma"},//11 Amount
			//   new {sTitle="Priedai"}//11 Docs
			//   }
			//};
			return JSON;
		}
		//from c in dc.tblClaims join v in dc.tblVehicles on c.VehicleID equals v.ID
		public jsonArrays GetJSON_tblActivityTypes() {
			jsonArrays JSON = new jsonArrays();
			JSON.Data = from a in dc.tblActivityTypes where a.ID>2
							from wTitle in dc.fnWords(UserData.GetUserLanguageID(), "tblActivities").Where(w => w.KeyName == a.Tmp).DefaultIfEmpty()
							from wTypeTitle in dc.fnWords(UserData.GetUserLanguageID(), "tblActivities").Where(w => w.KeyName == a.Name).DefaultIfEmpty()
							//from w in this.dc.proc_Words(UserData.GetUserLanguageID(), "tblActivities").Select(w => w).ToList().Where(wd => wd.KeyName == a.Tmp).DefaultIfEmpty()
							//from w in words.Where(wd => wd.KeyName==a.Tmp).DefaultIfEmpty()
							//from w in words.Where(wd => a.Tmp.Contains(wd.KeyName)).DefaultIfEmpty()
							//on a.Tmp equals w.KeyName
							select new object[] {
				a.ID,//0
				a.Name,//1
				wTitle.Label,
				wTypeTitle.Label,
				a.Tmp,
				a.Icon,
				a.IsFinances,
				a.Other
				};
			object[] Cols ={
				new { FName = "ID"},//0
				new { FName = "Name"},//1
				new { FName = "Title"},
				new { FName = "TypeTitle"},
				new { FName = "Tmp"},
				new { FName = "Icon"},
				new { FName = "IsFinances"},
				new { FName = "Other"}
				}; JSON.Cols = Cols;
			JSON.Config = new {
				tblUpdate = ""//, Msg = new { AddNew = "Naujos veiklos pridėjimas", Edit = "Veiklos redagavimas", Delete = "Ištrinti veiklą", GenName = "Veikla" }
			};
			//JSON.Grid = new {
			//   aoColumns = new object[]{
			//   new {bVisible=false}//,//0
			//   }
			//};
			return JSON;
		}

		public jsonArrays GetJSON_tblDocsInActivity() {
			jsonArrays JSON = new jsonArrays();

			//JSON.Data = from d in dc.tblClaims join a in dc.tblAccidents on d.AccidentID equals a.ID
			//   where d.IsDeleted == false && a.AccountID == UserData.AccountID
			//   select new object[] {

			JSON.Data = from dIna in dc.tblDocsInActivities join a in dc.tblActivities on dIna.ActivityID equals a.ID
							join d in dc.tblDocs on dIna.DocID equals d.ID
							join u in dc.tblUsers on d.UserID equals u.ID
							where a.IsDeleted == false && d.IsDeleted == false && u.AccountID == UserData.AccountID
							select new object[] {
			      dIna.ID,//0
			      dIna.ActivityID,//1
			      dIna.DocID//2
			   };

			object[] Cols ={
			   new { FName = "ID"},//0
			   new { FName = "ActivityID"},//1
			   new { FName = "DocID"}//2
			   }; JSON.Cols = Cols;
			JSON.Config = new {
				tblUpdate = "tblDocsInActivity"
			};
			return JSON;
		}
		public jsonArrays GetJSON_wReports() {
			jsonArrays JSON = new jsonArrays();
			//int objectID = (from r in dc.tblObjects_IDs where r.tblName == "Reports" select r.ID).Single();
			//JSON.Data = from r in dc.tblWords where r.LanguageID == UserData.GetUserLanguageID() && r.ObjectID == objectID
			//            select new object[] { r.ID,r.KeyName,r.Label };
			JSON.Data = Get_Words("Reports",false);
			object[] Cols = { new { FName = "ID" }, new { FName = "Name" }, new { FName = "Title" }}; JSON.Cols = Cols;
			JSON.Config = new { tblUpdate = "" };
			return JSON;
		}

		public object Get_Words(string ObjectName, bool withTip) {
			int objectID = (from r in dc.tblObjects_IDs where r.tblName == ObjectName select r.ID).Single();
			if (withTip) {
				return from r in dc.tblWords where r.LanguageID == UserData.GetUserLanguageID() && r.ObjectID == objectID
						 select new object[] { r.ID, r.KeyName, r.Label, r.Tip };
			}
			else {
				return from r in dc.tblWords where r.LanguageID == UserData.GetUserLanguageID() && r.ObjectID == objectID
						 select new object[] { r.ID, r.KeyName, r.Label };
			}
		}
		//	{ FName = "ID" }, new { FName = "Name" }, new { FName = "Title" }, new { FName = "Tip" } 

	}
}