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
			string currentVer = "6"; if (ver != currentVer) tmp = true; ver = currentVer;
			tmp = true;
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
						tmpListsTop = RenderPartialViewToString("Lists/tmpListsTop")
						//tmp_Drivers = RenderPartialViewToString("Lists/tmp_Drivers"),//tabAccidents siunčiam
						//tmp_InsPolicies = RenderPartialViewToString("Lists/tmp_InsPolicies"),
						//tmp_Vehicles = RenderPartialViewToString("Lists/tmp_Vehicles")
					} : new {
						tmpDriverRow = "",
						tmpVehicleRow = "",
						tmpInsPolicyRow = "",
						tmpAllDrivers = "",
						tmpAllVehicles = "",
						tmpAllInsPolicies = "",
						tmpListsTop = ""
						//tmp_Drivers = "",
						//tmp_InsPolicies = "",
						//tmp_Vehicles = ""
					}//,
					//Script = new { File = "/Scripts/Forms/tabLists.js?ver="+ver, Pars = "" } listus siunčiu su visais nes jų reikia
				}
			);
		}

		[HttpPost]
		public JsonResult tabClaims(string ver, bool tmp, bool obj) {
			Repositories_Main acc = new Repositories_Main();
			string currentVer = "1"; if (ver != currentVer) tmp = true; ver = currentVer;
			tmp = true;
			System.Diagnostics.Debug.Print("ver - " + ver + "; obj - " + obj.ToString());
			return Json(
				new {
					ver = ver,
					//jsonObj = new {//šitam visada atnaujinu objektus
					//   proc_topDrivers = acc.GetJSON_proc_Drivers(true),
					//   proc_topVehicles = acc.GetJSON_proc_Vehicles(true),
					//   proc_topInsPolicies = acc.GetJSON_proc_InsPolicies(true)
					//},
					templates = (tmp) ? new {
						tmpClaimsMain = RenderPartialViewToString("Claims/tmpClaimsMain"),
						tmpClaimView = RenderPartialViewToString("Claims/tmpClaimView"),
						tmpSidePanelForClaims = RenderPartialViewToString("Claims/tmpSidePanelForClaims"),
						tmpClaimRegulation = RenderPartialViewToString("Claims/tmpClaimRegulation"),
						tmpActionMain = RenderPartialViewToString("Claims/tmpActionMain"),
						tmpActionWrapper = RenderPartialViewToString("Claims/tmpActionWrapper"),
						tmpAction_sendEmail = RenderPartialViewToString("Claims/tmpAction_sendEmail"),
						tmpAction_addEmail = RenderPartialViewToString("Claims/tmpAction_addEmail"),
						tmpAction_meeting = RenderPartialViewToString("Claims/tmpAction_meeting"),
						tmpAction_note = RenderPartialViewToString("Claims/tmpAction_note"),
						tmpAction_phone = RenderPartialViewToString("Claims/tmpAction_phone"),
						tmpAction_task = RenderPartialViewToString("Claims/tmpAction_task"),
						tmpAddCompensation = RenderPartialViewToString("Claims/tmpAddCompensation"),
						tmpAddInsuranceBenefit = RenderPartialViewToString("Claims/tmpAddInsuranceBenefit"),
						tmpAddInvoice = RenderPartialViewToString("Claims/tmpAddInvoice"),
						tmpAddPropReport = RenderPartialViewToString("Claims/tmpAddPropReport")
					} : new {
						tmpClaimsMain = "",
						tmpClaimView = "",
						tmpSidePanelForClaims = "",
						tmpClaimRegulation = "",
						tmpActionMain = "",
						tmpActionWrapper = "",
						tmpAction_sendEmail = "",
						tmpAction_addEmail = "",
						tmpAction_meeting = "",
						tmpAction_note = "",
						tmpAction_phone = "",
						tmpAction_task = "",
						tmpAddCompensation = "",
						tmpAddInsuranceBenefit = "",
						tmpAddInvoice = "",
						tmpAddPropReport = ""
					}//,
					//Script = new { File = "/Scripts/Forms/tabLists.js?ver="+ver, Pars = "" } listus siunčiu su visais nes jų reikia
				}
			);
		}

		[HttpPost]
		public JsonResult tabMain(string ver, bool tmp, bool obj) {
			Repositories_Main acc = new Repositories_Main();
			string currentVer = "14"; if (ver != currentVer) tmp = true; ver = currentVer;
			tmp = true;
			System.Diagnostics.Debug.Print("ver - " + ver + "; obj - " + obj.ToString());
			return Json(
				new {
					ver = ver,
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
						tblCountries = acc.GetJSON_tblCountries(),
						tblDocs = acc.GetJSON_tblDocs(),
						//tblDocsInAccidents = acc.GetJSON_tblDocsInAccidents(),
						tblDocTypes = acc.GetJSON_tblDocType(),
						tblDocGroup = acc.GetJSON_tblDocGroup(),
						userData = acc.GetJSON_userData(),
						tblLanguages = acc.GetJSON_tblLanguages()
					},
					templates = (tmp) ? new {
						tmpClaimEdit = RenderPartialViewToString("Accidents/tmpClaimEdit"),
						tmpUploadForm = RenderPartialViewToString("Files/tmpUploadForm"),
						tmp2templateDownload = RenderPartialViewToString("Files/tmp2templateDownload"),
						tmp2templateUpload = RenderPartialViewToString("Files/tmp2templateUpload"),

						tmpDocsCategory = RenderPartialViewToString("Files/tmpDocsCategory"),
						tmpDocsView = RenderPartialViewToString("Files/tmpDocsView"),
						tmpDocsNodes = RenderPartialViewToString("Files/tmpDocsNodes"),
						tmpDocsTree = RenderPartialViewToString("Files/tmpDocsTree"),

						tmpDocTypes = RenderPartialViewToString("Files/tmpDocTypes"),
						tmp_Drivers = RenderPartialViewToString("Lists/tmp_Drivers"),
						tmp_InsPolicies = RenderPartialViewToString("Lists/tmp_InsPolicies"),
						tmp_Vehicles = RenderPartialViewToString("Lists/tmp_Vehicles"),
						//tmpVehicleMakes = RenderPartialViewToString("Lists/tmpVehicleMakes"),
						tmpEditItems = RenderPartialViewToString("Lists/tmpEditItems"),
						tmpUserCard = RenderPartialViewToString("Admin/tmpUserCard"),
						tmpChangeUsrPass = RenderPartialViewToString("Admin/tmpChangeUsrPass")						
					} : new {
						tmpClaimEdit = "",
						tmpUploadForm = "",
						tmp2templateDownload = "",
						tmp2templateUpload = "",

						tmpDocsCategory = "",
						tmpDocsView = "",
						tmpDocsNodes = "",
						tmpDocsTree = "",

						tmpDocTypes = "",
						tmp_Drivers = "",
						tmp_InsPolicies = "",
						tmp_Vehicles = "",
						tmpEditItems = "",
						tmpUserCard = "",
						tmpChangeUsrPass = RenderPartialViewToString("Admin/tmpChangeUsrPass")
					}
				}

			);
			
		}

		[HttpPost]
		public JsonResult tabAdmin(string ver, bool tmp, bool obj) {
			Repositories_Main acc = new Repositories_Main();
			string currentVer = "6";if (ver != currentVer) tmp = true; ver = currentVer;
			tmp = true;
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