﻿using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using CC.Classes;

namespace CC.Models {

   public class clsAccident {
		
		public clsAccident(int? id) {
         Repositories_Accidents AccRep = new Repositories_Accidents();
         Accident = AccRep.Get_tblAccident((id == null) ? 0 : id.Value);
         if (Accident == null) {
            Accident = new tblAccident {
               ID = 0,
               //Accident.AccountID=
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
         }
         else { NewRec = 0; }
         var s = AccRep.Get_tblAccident_Types();
         //AccTypes = s.ToSelectListItem(1, i => i.ID, i => i.Name, i => i.ID.ToString());
      }

      public tblAccident Accident { get; set; }

      public int NewRec { get; set; }

      //public IEnumerable<SelectListItem> AccTypes { get; set; }
      //public IEnumerable<SelectListItem> Drivers { get; set; }
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

   public class Repositories_Accidents {
      private dbDataContext dc;

      public Repositories_Accidents() { dc = new dbDataContext(ConfigurationManager.ConnectionStrings["ClaimsControlConnectionString"].ConnectionString); }
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
				new { FName = "Email",Type="String", LenMax=50,Validity="require().match('textWithPoint').maxLength(50)"},//5
			}; JSON.Cols = Cols;
			JSON.Config = new { tblUpdate = "tblAccounts", Msg = new { Edit = "Sąskaitos redagavimas", GenName = "Sąskaita", GenNameWhat = "Sąskaitą" } };
			JSON.Grid = new {
				aoColumns = new object[]{
					new {bVisible=false},//0//ID////DefaultUpdate=0
					new {sTitle="Įmonės pavadinimas"},//1//ClaimType//
					new {sTitle="Šalis"},//2//InsurerName//
					new {sTitle="Valiuta"},//3//PolicyNumber//
					new {sTitle="Laiko juosta"},//4//EndDate//
					new {sTitle="Paskyros el. pašto adresas"}
				}
			};
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
			JSON.Grid = new {
				aoColumns = new object[]{
		         new {bVisible=false},//0//ID
		         new {sTitle="Valiuta"}
		      },
			};
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
			JSON.Grid = new {
				aoColumns = new object[]{
		         new {bVisible=false},//0//ID
		         new {sTitle="Šalis"}
		      },
			};
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
			JSON.Grid = new {
				aoColumns = new object[]{
		         new {bVisible=false},//0//ID
		         new {sTitle="Laiko juosta"}
		      },
			};
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
				//new { FName = "AccidentTypeID", Tip="Pasirinkite iš sąrašo..",List=new{Source="tblAccidentsTypes",iVal="iD",iText=new object[]{1},Editable=0,ListType="List"}},//1
				//new { FName = "DriverID",Tip="Pradėkite vesti..", List=new{Source="proc_Drivers",iVal="iD",iText=new object[]{1,2},Editable=1,ListType="Combo"}},//3
				new { FName = "AccidentTypeID", Tip="Pasirinkite iš sąrašo..",List=new{Source="tblAccidentsTypes",iVal="iD",iText=new object[]{"name"},Editable=0,ListType="List"}},//1
				new { FName = "DriverID",Tip="Pradėkite vesti..", List=new{Source="proc_Drivers",iVal="iD",iText=new object[]{"firstName","lastName"},Editable=1,ListType="Combo"}},//3
				new { FName = "No",Type="Integer",Validity="require().match('integer')"},//4
				new { FName = "Date",Type="Date", Default="Today",Validity="require().match('date').lessThanOrEqualTo(new Date())"},//5
				new { FName = "IsNotOurFault",Type="Boolean"},//6
				new { FName = "IsOtherParticipants",Type="Boolean"},//7
				new { FName = "ShortNote", Tip="Vienu sakiniu..",Type="String", LenMax=100,Validity="require().nonHtml().maxLength(100)"},//8
				new { FName = "LongNote",Tip="Papildoma informacija, pastabos, užrašai ir pan.",Type="String", LenMax=800,Validity="nonHtml().maxLength(800)"},//9
				new { FName = "LocationCountry",Type="String", LenMax=100,Validity="require().nonHtml().maxLength(100)"},//10
				new { FName = "LocationAddress",Type="String", LenMax=400,Validity="require().nonHtml().maxLength(400)"},//11
				new { FName = "LocationDistrict",Type="String", LenMax=80,Validity="require().nonHtml().maxLength(80)"},//12
				new { FName = "Lat",Type="Decimal", LenEqual=10,Validity="require().match('number')"},//13
				new { FName = "Lng",Type="Decimal", LenEqual=10,Validity="require().match('number')"},//14
				new { FName = "GMT",Type="Integer",Validity="require().match('integer')"}//15
			}; JSON.Cols = Cols;
         JSON.Config = new { Controler = "Accidents", tblUpdate = "tblAccidents" };
         JSON.Grid = new {
            aoColumns = new object[]{
					new {bVisible=false},//0//ID////DefaultUpdate=0
					new {sTitle="Įvykio tipas"},//1//AccidentTypeID////DefaultUpdate=0
					//new {bVisible=false},//2//AccountID////DefaultUpdate=0
					new {sTitle="Atsakingas vairuotojas",bVisible=false},//3//DriverID////DefaultUpdate=0
					new {sTitle="Nr"},//4//No//
					new {sTitle="Įvykio data ir laikas (vietos laiku)"},//5//Date//
					new {sTitle="Kaltininkas trečia šalis"},//6//IsOurFault//
					new {sTitle="Daugiau nei vienas kaltininkas"},//7//IsOtherParticipants//
					new {sTitle="Įvykio apibūdinimas",sClass="smallFont"},//8//ShortNote//
					new {sTitle="Pastabos",sClass="smallFont"},//9//LongNote//
					new {sTitle="Šalis",sClass="smallFont"},//10//LocationCountry//
					new {sTitle="Adresas",sClass="smallFont"},//11//LocationAddress//
					new {sTitle="Rajonas",sClass="smallFont"},//12//LocationDistrict//
					new {sTitle="Lat"},//13//Lat//
					new {sTitle="Lng"},//14//Lng//
					new {sTitle="GMT"}//15//GMT//
				},
            aaSorting = new object[] { new object[] { 4, "asc" } },
         };
         return JSON;
      }

      public jsonArrays GetJSON_proc_Accidents() {
         jsonArrays JSON = new jsonArrays();
         JSON.Data = from d in dc.proc_Accidents(UserData.AccountID, null)
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
				d.Claims_TypeID
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
			}; JSON.Cols = Cols;
         JSON.Config = new { Controler = "Accidents", tblUpdate = "" };
         JSON.Grid = new {
            //                aoColumns = new object[]{
            //new {bVisible=false},//0//ID//
            //new {sTitle="Nr"},//1//No
            //new {sTitle="Data"},//2//Date
            //new {sTitle="Vieta"},//3//Place
            //new {sTitle="Tipas"},//4//AccType
            //new {sTitle="Visos"},//5//CNo_All
            //new {sTitle="Atviros"},//6//CNo_NotF
            //new {sTitle="Žalos suma"},//7//LossSum
            //new {sTitle="Visa žalos suma?",bVisible=false},//8//AmountIsConfirmed
            //new {sTitle="Kas atsitiko"},//9//ShortNote//
            //new {sTitle="Pastabos",bVisible=false,sClass="smallFont"},//10//LongNote//
            //new {sTitle="Vairuotojas",bVisible=false},//11//Driver
            //new {sTitle="Kas įvedė",bVisible=false},//12//UserName
            //new {sTitle="Žalos",bVisible=false},//13//Claims_C
            //new {sTitle="Žalos2",bVisible=false},//14//Claims_C2
            //new {bSortable=false}//14//Claims_C
            aoColumns = new object[]{
					new {bVisible=false},//0//ID//
					new {sTitle="Nr"},//1//No
					new {sTitle="Data"},//2//Date
					new {sTitle="Vieta"},//3//Place
					new {sTitle="Tipas"},//4//AccType
					new {sTitle="Visos"},//5//CNo_All
					new {sTitle="Atviros"},//6//CNo_NotF
					new {sTitle="Žalos suma"},//7//LossSum
					new {sTitle="Visa žalos suma"},//8//AmountIsConfirmed
					new {sTitle="Kas atsitiko"},//9//ShortNote//
					new {sTitle="Pastabos",sClass="smallFont"},//10//LongNote//
					new {sTitle="Vairuotojas"},//11//Driver
					new {sTitle="Kas įvedė"},//12//UserName
					new {sTitle="Žalos"},//13//Claims_C
					new {sTitle="Žalos2"},//14//Claims_C2
					new {sTitle="Praėjo dienų"},//14//Claims_C2
					new {sTitle="Dokumentai"},//14//Claims_C2
					new {sTitle="Žalų tipai"}//14//Claims_C2
					//new {bSortable=false,fnRender=function(){return <span class='ui-icon ui-icon-mail-closed'></span><span class='ui-icon ui-icon-mail-closed'></span>;}} //"function(oObj){return oObj.aData[0];}"}
				}
            //aaSorting = new object[] { new object[] { 2, "desc" } },
         };
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
				d.DateExpierence,//3
				d.DrivingCategory,//4
				d.Phone,//5
				d.Docs,//6
				d.EndDate,//7
			};
         object[] Cols ={
				new { FName = "ID"},//0
				new { FName = "FirstName",Type="String", LenMax=100,IsUnique=new object[]{1,2},Validity="require().nonHtml().maxLength(100)"},//1
				new { FName = "LastName",Type="String", LenMax=100,Validity="require().nonHtml().maxLength(100)"},//2
				new { FName = "DateExpierence",Type="Date", Default="Today",Validity="require().match('date').lessThanOrEqualTo(new Date())", Plugin = new {datepicker = new {minDate="-25y", maxDate=0}}},//3  "Plugin":{"datepicker":{"minDate":"-3y","maxDate":"0"}}
				new { FName = "DrivingCategory",Type="String", LenMax=20,Validity="require().nonHtml().maxLength(20)"},//4
				new { FName = "Phone",Type="Integer", LenMax=20,Validity="require().nonHtml().maxLength(20)"},//5
				new { FName = "Docs",Type="String", NotEditable=1},//6
				new { FName = "EndDate",Type="DateLess", Default="",Validity="match('date').lessThanOrEqualTo(new Date())", Plugin = new {datepicker = new {minDate="-25y", maxDate=0}}},//7
			}; JSON.Cols = Cols;
         JSON.Config = new { Controler = "Drivers", tblUpdate = "tblDrivers",titleFields=new object []{"firstName","lastName"},Msg = new { AddNew = "Pridėti naują vairuotoją", Edit = "Vairuotojo duomenų redagavimas", Delete = "Ištrinti vairuotoją", GenName = "Vairuotojas", GenNameWhat = "vairuotoją", ListName = "Vairuotojų sąrašas" } };
         JSON.Grid = new {
            aoColumns = new object[]{
					new {bVisible=false},//0//ID////DefaultUpdate=0
					new {sTitle="Vardas",sClass="smallFont"},//1//FirstName//
					new {sTitle="Pavardė",sClass="smallFont"},//2//LastName//
					new {sTitle="Darbo stažas nuo"},//3//DateExpierence//
					new {sTitle="Vairavimo kategorijos"},//4//DrivingCategory//
					new {sTitle="Telefonas"},//5//Phone//
					new {sTitle="Dokumentai"},//6//Docs//
					new {sTitle="Darbo pabaiga",bVisible=false},//7//EndDate//
				}, //aaSorting = new object[] { new object[] { 2, "asc" } },//???
         };
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
         JSON.Grid = new {
            aoColumns = new object[]{
					new {bVisible=false},//0//ID////DefaultUpdate=0
					new {sTitle="Name",sClass="smallFont"}//1//Name//
				},
            aaSorting = new object[] { new object[] { 1, "asc" } },//???
         };
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
         JSON.Grid = new {
            aoColumns = new object[]{
					new {bVisible=false},//0//ID////DefaultUpdate=0
					new {sTitle="Name"}//1//Name//
				}//,
            //aaSorting = new object[] { new object[] { 1, "asc" } },//???
         };
         return JSON;
      }
		public jsonArrays GetJSON_proc_Years() {
			jsonArrays JSON = new jsonArrays();
			JSON.Data = from d in dc.proc_AccidentsYears(UserData.AccountID)
							select new object[] {d.years};
			object[] Cols ={new { FName = "Year"}}; JSON.Cols = Cols;
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
				new { FName = "TypeID",List=new{Source="tblVehicleTypes",Editable=0,ListType="List", iVal="iD",iText=new object []{"name"}}},//8
				new { FName = "MakeID",List=new{Source="tblVehicleMakes",Editable=1,ListType="List", iVal="iD",iText=new object []{"name"}}}//9
			}; JSON.Cols = Cols;
         JSON.Config = new { Controler = "Vehicles", tblUpdate = "tblVehicles",titleFields=new object []{"plate","make"}, Msg = new { AddNew = "Naujos transporto priemonės sukūrimas", Edit = "Transporto priemonių redagavimas", Delete = "Ištrinti transporoto priemonę", GenName = "Transporto priemonė", GenNameWhat = "transporto priemonę", ListName = "Transporto priemonių sąrašas" } };
         JSON.Grid = new {
            aoColumns = new object[]{
					new {bVisible=false},//0//ID
					new {sTitle="Valst.Nr."},//2//Plate//
					new {sTitle="Tipas"},//1//Type//
					new {sTitle="Markė"},//3//Make
					new {sTitle="Modelis"},//4//Model//
					new {sTitle="Metai"},//5//Year//
					new {sTitle="Dokumentai"},//6//Docs//
					new {bVisible=false,sTitle="Naudojimo pabaigos data"},//7//EndDate//
					new {bVisible=false,sTitle="Tipas"},//8//TypeID//
					new {bVisible=false,sTitle="Markė"}//9//MakeID//
				},
            //aaSorting = new object[] { new object[] { 1, "asc" } },//???
         };
         return JSON;
      }

		public jsonArrays GetJSON_tblUsers() {
			jsonArrays JSON = new jsonArrays();
			JSON.Data = from d in dc.tblUsers where d.AccountID== UserData.AccountID && d.IsDeleted==false
							select new object[] {
				d.ID,//0
				d.FirstName,//2
				d.Surname,//1
				d.Email,//3
				d.IsAdmin,
				d.IsActive
				};
			object[] Cols ={
				new { FName = "ID"},//0
				new { FName = "FirstName",Type="String",Validity="require().nonHtml().maxLength(50)"},//2
				new { FName = "Surname",Type="String",Validity="require().nonHtml().maxLength(50)"},//1
				new { FName = "Email",Validity="require().nonHtml().match('email').maxLength(35)"},//3
				new { FName = "IsAdmin"},//3
				new { FName = "IsActive"}//3
			}; JSON.Cols = Cols;
			JSON.Config = new { tblUpdate = "tblUsers", Msg = new { AddNew = "Naujo vartotojo sukūrimas", Edit = "Vartotojo redagavimas", Delete = "Ištrinti vartotoją", GenName = "Vartotojas", GenNameWhat = "Vartotoją", ListName = "Vartotojų sąrašas" } };
			JSON.Grid = new {
				aoColumns = new object[]{
					new {bVisible=false},//0//ID
					new {sTitle="Vardas"},
					new {sTitle="Pavardė"},
					new {sTitle="E-paštas"},
					new {sTitle="Yra administratorius"},
					new {sTitle="Yra aktyvus"}
				},
				//aaSorting = new object[] { new object[] { 1, "asc" } },//???
			};
			return JSON;
		}

      public jsonArrays GetJSON_proc_InsPolicies(bool? OnlyTop) {
         jsonArrays JSON = new jsonArrays();
         JSON.Data = from p in dc.proc_InsPolicies(UserData.AccountID, OnlyTop)
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
				p.MailsAddresses
			};
         object[] Cols ={//NotEditable=true // Unique=true// LenMax/LenEqual/LenMin:10
				//Date,DateLess,DateNoLess,Time,String
				new { FName = "ID"},//0
				new { FName = "ClaimType",IdField="claimTypeID"},//2
				new { FName = "InsurerName",IdField="insurerID"},//3
				new { FName = "PolicyNumber",Type="String", LenMax=50,Validity="require().nonHtml().maxLength(50)"},//3

				new { FName = "EndDate",Type="DateMore", Default="Today",Validity="require().match('date').greaterThanOrEqualTo(new Date())"},//4
				new { FName = "InsuredName",Type="String", LenMax=50,Validity="require().nonHtml().maxLength(50)"},//5
				new { FName = "InsuredCode",Type="String", LenMax=50,Validity="require().nonHtml().maxLength(50)"},//6

				new { FName = "InsuredAddress",Type="String", LenMax=100,Validity="require().nonHtml().maxLength(100)"},//7
				new { FName = "InsuredContactName",Type="String"},//8
				new { FName = "InsuredContactID",List=new{Source="tblUsers",Editable=1,ListType="List", iVal="iD",iText=new object []{"firstName","surName"}}},//9
				new { FName = "ClaimTypeID",List=new{Source="tblClaimTypes",Editable=0,ListType="List", iVal="iD",iText=new object []{"name"}}},//10
				new { FName = "InsurerID",List=new{Source="tblInsurers",Editable=1,ListType="List", iVal="iD",iText=new object []{"name"}}},//11
				new { FName = "MailsAddresses",Type="String", Tip="Įveskite vieną ar kelis draudiko ar brokerio el. pašto adresus (atskirti kableliu ar kabletaškiu)", LenMax=250,Validity="nonHtml().maxLength(250)"},//5
								}; JSON.Cols = Cols;
			JSON.Config = new { Controler = "InsPolicy", tblUpdate = "tblInsPolicies", titleFields = new object[] {"policyNumber","insurerName"}, Msg = new { AddNew = "Naujo draudimo poliso sukūrimas", Edit = "Draudimo poliso redagavimas", Delete = "Ištrinti draudimo polisą", GenName = "Draudimo polisas", GenNameWhat = "draudimo polisą", ListName = "Draudimo polisų sąrašas" } };
         JSON.Grid = new {
            aoColumns = new object[]{
					new {bVisible=false},//0//ID////DefaultUpdate=0
					new {sTitle="Draudimo rūšis"},//1//ClaimType//
					new {sTitle="Draudimo kompanija"},//2//InsurerName//
					new {sTitle="Poliso Nr."},//3//PolicyNumber//

					new {sTitle="Galiojimo data"},//4//EndDate//

					new {sTitle="Draudėjas"},//5//InsuredName////DefaultUpdate=0
					new {sTitle="Draudėjo kodas",bVisible=false},//6//InsuredName//
					new {sTitle="Draudėjo adresas",bVisible=false},//7//InsuredCode//
					new {sTitle="Draudėjo kontaktas",bVisible=false},//8//InsuredContact//
					new {bVisible=false,sTitle="Draudėjo kontaktas"},//9//InsuredContactID////UserID
					new {bVisible=false,sTitle="Žalos tipas"},//10//ClaimTypeID////DefaultUpdate=0
					new {bVisible=false,sTitle="Draudikas"},//11//InsurerID////
					new {bVisible=false,sTitle="Pranešimą apie žalą siųsti:"}//11//InsurerID////
				}
            // aaSorting = new object[] { new object[] { 3, "asc" } },//???
         };
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
				new { FName = "AccidentTypeID",Tip="Pasirinkite iš sąrašo.."},//1
				new { FName = "AccountID"},//2
				new { FName = "DriverID",Tip="Pradėkite vesti.."},//3
				new { FName = "No",Type="Integer",Validity="require().match('integer').maxLength(13).greaterThanOrEqualTo(0)"},//4
				new { FName = "Date",Type="Date", Default="Today",Validity="require().match('date').lessThanOrEqualTo(new Date())"},//5
				new { FName = "IsNotOurFault",Type="Boolean",Validity="require()"},//6
				new { FName = "IsOtherParticipants",Type="Boolean",Validity="require()"},//7
				new { FName = "ShortNote",Tip="Vienu sakiniu..",Type="String", LenMax=50,Validity="require().nonHtml().maxLength(50)"},//8
				new { FName = "LongNote",Tip="Papildoma informacija, pastabos, užrašai ir pan.",Type="String", LenMax=400,Validity="nonHtml().maxLength(400)"},//9
				new { FName = "LocationCountry",Type="String", LenMax=50,Validity="require().nonHtml().maxLength(50)"},//10
				new { FName = "LocationAddress",Type="String", LenMax=200,Validity="require().nonHtml().maxLength(200)"},//11
				new { FName = "LocationDistrict",Type="String", LenMax=80,Validity="require().nonHtml().maxLength(80)"},//12
				new { FName = "Lat",Type="Decimal",Validity="require().match('number').greaterThanOrEqualTo(0)"},//13
				new { FName = "Lng",Type="Decimal",Validity="require().match('number').greaterThanOrEqualTo(0)"},//14
				new { FName = "GMT",Type="Integer",Validity="require().match('integer').maxLength(13).greaterThanOrEqualTo(0)"},//15
				//new { FName = "IsDeleted",Type="Boolean"}}//16
			}; JSON.Cols = Cols;
         JSON.Config = new { Controler = "Accidents", tblUpdate = "tblAccidents" };
         JSON.Grid = new {
            aoColumns = new object[]{
					new {bVisible=false},//0//ID////DefaultUpdate=0
					new {bVisible=false},//1//AccidentTypeID////DefaultUpdate=0
					new {bVisible=false},//2//AccountID////DefaultUpdate=0
					new {bVisible=false},//3//DriverID////DefaultUpdate=0
					new {sTitle="Nr"},//4//No//
					new {sTitle="Įvykio data ir laikas (vietos laiku)"},//5//Date//
					new {sTitle="Kaltininkas trečia šalis"},//6//IsNotOurFault//
					new {sTitle="Daugiau nei vienas kaltininkas"},//7//IsOtherParticipants//
					new {sTitle="Kas atsitiko",sClass="smallFont"},//8//ShortNote//
					new {sTitle="Pastabos",sClass="smallFont"},//9//LongNote//
					new {sTitle="LocationCountry",sClass="smallFont"},//10//LocationCountry//
					new {sTitle="Adresas",sClass="smallFont"},//11//LocationAddress//
					new {sTitle="LocationDistrict",sClass="smallFont"},//12//LocationDistrict//
					new {sTitle="Lat"},//13//Lat//
					new {sTitle="Lng"},//14//Lng//
					new {sTitle="GMT"},//15//GMT//
					//new {sTitle="IsDeleted"}//16//IsDeleted//
				}
         };
         return JSON;
      }

      public tblAccident Get_tblAccident(int No) {
         return (from d in dc.tblAccidents
                 where d.No == No && d.IsDeleted == false
                 select d).SingleOrDefault() ?? null;
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
         JSON.Config = new { Controler = "Insurers", tblUpdate = "tblInsurers", Msg = new { AddNew = "Naujo draudiko sukūrimas", Edit = "Draudiko redagavimas", Delete = "Ištrinti draudiką", GenName = "Draudikas", GenNameWhat = "draudiką", ListName = "Draudikų sąrašas" } };

         JSON.Grid = new {
            aoColumns = new object[]{
					new {bVisible=false},//0//ID////DefaultUpdate=0
					new {sTitle="Name",sClass="smallFont"},//1//Name//
					new {bVisible=false},//2//CountryID////DefaultUpdate=0
					new {sTitle="CountryDefault"},//3//CountryDefault//
				}, aaSorting = new object[] { new object[] { 3, "asc" } },//???
         };
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
         JSON.Config = new { Controler = "VehicleMakes", tblUpdate = "tblVehicleMakes", Msg = new { AddNew = "Naujos tr. priemonių markės sukūrimas", Edit = "Tr. priemonių markės redagavimas", Delete = "Ištrinti tr. priemonių markę", GenName = "Tr. priemonės markė", GenNameWhat = "transporto priemonę", ListName = "Tr. priemonių sąrašas" } };
         JSON.Grid = new {
            aoColumns = new object[]{
					new {bVisible=false,sTitle="Markė1"},//0//ID////DefaultUpdate=0
					new {sTitle="Name",sClass="smallFont"}//1//Name//
				}//, aaSorting = new object[] { new object[] { 3, "asc" } },//???
         };
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
         JSON.Grid = new {
            aoColumns = new object[]{
					new {bVisible=false},//0//ID////DefaultUpdate=0
					new {sTitle="Name",sClass="smallFont"},//1//Name//
				}//, aaSorting = new object[] { new object[] { 3, "asc" } },//???
         };
         return JSON;
      }

      public jsonArrays GetJSON_tblClaims() {
         jsonArrays JSON = new jsonArrays();
         JSON.Data = from d in dc.tblClaims join a in dc.tblAccidents on d.AccidentID equals a.ID
                     where d.IsDeleted == false && a.AccountID == UserData.AccountID
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
				d.PerDay//14
				};
         //Datepicker ir plugin on blur
         //Markup.Type:Date,Date,DateNotLess,DateLess,Year,YearLess,YearNotLess,Integer,Decimal
         //NotImplemented:String,String,NotEditable=true,LenMax/LenEqual/LenMin:10

         //GenerateHTML
         //Markup.Type:Boolean(checkbox),substring(0,4)==="Date"(Date),LenMax>100(textarea)
         //else if Cols[i].List(List)else text
         //Markup:IsUnique=new object[]{1,2}
         //Markup:Default=Today
         //Tip="Pradėkite vesti.."
         //List=new{Source="tblVehicleMakes",iVal="iD",iText=new object []{1}}
         object[] Cols ={
				new { FName = "ID"},//0
				new { FName = "ClaimTypeID",Tip="Pasirinkite žalos tipą..", List=new{Source="tblClaimTypes",iVal="iD",iText=new object[]{"name"},Editable=0,ListType="List"}},//1
				new { FName = "AccidentID"},//2
				new { FName = "InsPolicyID",Tip="Pasirinkite iš sąrašo..", List=new{Source="proc_InsPolicies",iVal="iD",iText=new object[]{"claimType","insurerName"},Editable=1,ListType="List"}},//3 ,Append=new{id=0,value="Neapdrausta"}
				new { FName = "VehicleID",Tip="Valst.Nr.", List=new{Source="proc_Vehicles",iVal="iD",iText=new object[]{"plate","type","make","model"},ListType="None"}},//4 , markė, modelis arba metai
				new { FName = "No",Type="Integer", LenMax=10,Validity="require().match('integer').maxLength(13).greaterThanOrEqualTo(0)"},//5
				new { FName = "IsTotalLoss",Type="Boolean"},//6
				new { FName = "LossAmount",Type="Decimal", LenMax=15,Validity="require().match('number').greaterThanOrEqualTo(0)"},//7
				new { FName = "InsuranceClaimAmount",Type="Decimal", LenMax=15,Validity="require().match('number').greaterThanOrEqualTo(0)"},//8
				new { FName = "IsInjuredPersons",Type="Boolean"},//9
				new { FName = "InsurerClaimID",Type="String", LenMax=50,Validity="maxLength(50)"},//10
				new { FName = "ClaimStatus",Type="Integer", LenEqual=2,Validity="require().match('integer').maxLength(2).greaterThanOrEqualTo(0)"},//11
				new { FName = "AmountIsConfirmed",Type="Boolean"},//12
				new { FName = "Days",Type="Integer", LenMax=10,Validity="require().match('integer').maxLength(10).greaterThanOrEqualTo(0)"},//13
				new { FName = "PerDay",Type="Decimal", LenEqual=10,Validity="require().match('number').greaterThanOrEqualTo(0)"}//14
				}; JSON.Cols = Cols;
         JSON.Config = new {
            Controler = "Claims", tblUpdate = "tblClaims", Msg = new { AddNew = "Naujos žalos pridėjimas", Edit = "Žalos redagavimas", Delete = "Ištrinti žalą", GenName = "Žala" }
         };
         JSON.Grid = new {
            aoColumns = new object[]{
				new {bVisible=false},//0//ID////DefaultUpdate=0
				new {sTitle="Žalos tipas"},//1//ClaimTypeID////DefaultUpdate=0
				new {bVisible=false},//2//AccidentID////DefaultUpdate=0
				new {sTitle="Polisas"},//3//InsPolicyID////DefaultUpdate=0
				new {sTitle="Transporto priemonė"},//4//VehicleID////DefaultUpdate=0
				new {sTitle="Nr"},//5//No//
				new {sTitle="Visiškas praradimas"},//6//IsTotalLoss//
				new {sTitle="Planuojama žalos suma"},//7//LossAmount//
				new {sTitle="Planuojama draudimo išmoka"},//8//InsuranceClaimAmount//
				new {sTitle="Įvykio metu sužaloti tretieji asmenys"},//9//IsInjuredPersons//
				new {sTitle="Žalos nr. draudiko sistemoje"},//10//InsurerClaimID////DefaultUpdate=0
				new {sTitle="Žalos būklė"},//11//ClaimStatus//
				new {sTitle="Žalos suma patvirtinta"},//12//AmountIsConfirmed//
				new {sTitle="Prastova dienomis"},//13//Days//
				new {sTitle="Prastovos kaina per dieną"}//14//PerDay//
				}
         };
         return JSON;
      }

      public IEnumerable<tblAccidentsType> Get_tblAccident_Types() {
         return (from d in dc.tblAccidentsTypes
                 //where d.No == No && d.IsDeleted == false
                 select d).AsEnumerable();
      }
   }
}