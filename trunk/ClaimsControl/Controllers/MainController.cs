﻿using System.Web.Mvc;
using CC.Models;


using CC.Classes;

namespace ClaimsControl.Controllers {

	[Authorize]
	public class MainController : ToStringController {

		public ActionResult Start() {
			ViewBag.Title = "Žalų valdymo sistema";
			return View();
		}

		public ActionResult StartDebug() {
			ViewBag.Title = "Žalų valdymo sistema";
			return View();
		}

		[HttpPost]
		public JsonResult tabLists(string ver, bool tmp, bool obj) {
			Repositories_Main acc = new Repositories_Main();
			string currentVer = "3"; if (ver != currentVer) tmp = true; ver = currentVer;
			System.Diagnostics.Debug.Print("ver - " + ver + "; obj - " + obj.ToString());
			return Json(
				new {
					ver = ver,
					jsonObj = new {//šitam visada atnaujinu objektus
						proc_topDrivers = acc.GetJSON_proc_Drivers(true),
						proc_topVehicles = acc.GetJSON_proc_Vehicles(true),
						proc_topInsPolicies = acc.GetJSON_proc_InsPolicies(true)
					},
					templates = (tmp) ? new {
						tmpDriverRow = RenderPartialViewToString("Lists/tmpDriverRow"),
						tmpVehicleRow = RenderPartialViewToString("Lists/tmpVehicleRow"),
						tmpInsPolicyRow = RenderPartialViewToString("Lists/tmpInsPolicyRow"),
						tmpAllDrivers = RenderPartialViewToString("Lists/tmpAllDrivers"),
						tmpAllVehicles = RenderPartialViewToString("Lists/tmpAllVehicles"),
						tmpAllInsPolicies = RenderPartialViewToString("Lists/tmpAllInsPolicies"),
						tmpListsTop = RenderPartialViewToString("Lists/tmpListsTop"),
						tmp_Drivers = RenderPartialViewToString("Lists/tmp_Drivers"),
						tmp_InsPolicies = RenderPartialViewToString("Lists/tmp_InsPolicies"),
						tmp_Vehicles = RenderPartialViewToString("Lists/tmp_Vehicles")
					} : new {
						tmpDriverRow = "",
						tmpVehicleRow = "",
						tmpInsPolicyRow = "",
						tmpAllDrivers = "",
						tmpAllVehicles = "",
						tmpAllInsPolicies = "",
						tmpListsTop = "",
						tmp_Drivers = "",
						tmp_InsPolicies = "",
						tmp_Vehicles = ""
					},
					Script = new { File = "/Scripts/Forms/tabLists.js?ver="+ver, Pars = "" }
				}
			);
		}

		[HttpPost]
		public JsonResult tabAccidents() {
			Repositories_Main acc = new Repositories_Main();
			return Json(
				new {
					ver = "No ver",//kol kas šitas be versijų
					jsonObj = new {
						//proc_Accidents = acc.GetJSON_proc_Accidents(),
						tblAccidents = acc.GetJSON_tblAccidents(),
						proc_Drivers = acc.GetJSON_proc_Drivers(false),
						tblAccidentsTypes = acc.GetJSON_tblAccidentTypes(),
						proc_Years = acc.GetJSON_proc_Years(),
						tblClaimTypes = acc.GetJSON_tblClaimTypes(),
						proc_Vehicles = acc.GetJSON_proc_Vehicles(false),
						proc_InsPolicies = acc.GetJSON_proc_InsPolicies(false),
						tblInsurers = acc.GetJSON_tblInsurers(),
						tblVehicleMakes = acc.GetJSON_tblVehicleMakes(),
						tblVehicleTypes = acc.GetJSON_tblVehicleTypes(),
						tblClaims = acc.GetJSON_tblClaims(),
						tblUsers = acc.GetJSON_tblUsers(),
						//tblAccount = acc.GetJSON_tblAccount(),
						//tblCurrencies = acc.GetJSON_tblCurrencies(),
						//tblCountries = acc.GetJSON_tblCountries(),
						//tblTimeZones = acc.GetJSON_tblTimeZones()
					},
					templates = new {
						tmpClaimEdit = RenderPartialViewToString("Accidents/tmpClaimEdit")//,
						//tmpDriverRow = RenderPartialViewToString("Lists/tmpDriverRow"),
						//tmpVehicleRow = RenderPartialViewToString("Lists/tmpVehicleRow"),
						//tmpInsPolicyRow = RenderPartialViewToString("Lists/tmpInsPolicyRow"),
						//tmpAllDrivers = RenderPartialViewToString("Lists/tmpAllDrivers"),
						//tmpAllVehicles = RenderPartialViewToString("Lists/tmpAllVehicles"),
						//tmpAllInsPolicies = RenderPartialViewToString("Lists/tmpAllInsPolicies"),
						//tmpListsTop = RenderPartialViewToString("Lists/tmpListsTop"),
						//tmp_Drivers = RenderPartialViewToString("Lists/tmp_Drivers"),
						//tmp_InsPolicies = RenderPartialViewToString("Lists/tmp_InsPolicies"),
						//tmp_Vehicles = RenderPartialViewToString("Lists/tmp_Vehicles"),
						//tmpAdminMain = RenderPartialViewToString("Admin/tmpAdminMain"),
						//tmpUserRow = RenderPartialViewToString("Admin/tmpUserRow")
						}
				}

			);
		}

		[HttpPost]
		public JsonResult tabAdmin(string ver, bool tmp, bool obj) {
			Repositories_Main acc = new Repositories_Main();
			string currentVer = "3";if (ver != currentVer) tmp = true; ver = currentVer;
			System.Diagnostics.Debug.Print("ver - " + ver + "; obj - " + obj.ToString());
			return Json(
				new {
					ver = ver,
					jsonObj = (obj) ? new {
						tblAccount = acc.GetJSON_tblAccount(),
						tblCurrencies = acc.GetJSON_tblCurrencies(),
						tblCountries = acc.GetJSON_tblCountries(),
						tblTimeZones = acc.GetJSON_tblTimeZones()
					} : new {
						tblAccount = acc.GetJSON_tblAccount(),
						tblCurrencies = acc.GetJSON_tblCurrencies(),
						tblCountries = acc.GetJSON_tblCountries(),
						tblTimeZones = acc.GetJSON_tblTimeZones()
					},
					templates = (tmp) ? new {
						tmpUserRow = RenderPartialViewToString("Admin/tmpUserRow"),
						tmpAdminMain = RenderPartialViewToString("Admin/tmpAdminMain")
					} : new {
						tmpUserRow = "",
						tmpAdminMain = ""
					},
					Script = new { File = "/Scripts/Forms/tabAdmin.js?ver="+ver, Pars = "" }
				}
			);
		}
	}
}