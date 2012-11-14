using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using CC.Classes;

namespace CC.Models {

   public class Repositories_Admin {
      private dbDataContext dc;

		public Repositories_Admin() { dc = new dbDataContext(ConfigurationManager.ConnectionStrings["ClaimsControlConnectionString"].ConnectionString); }
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

   }
}