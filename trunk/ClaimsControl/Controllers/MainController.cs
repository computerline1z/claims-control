using System.Web.Mvc;
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
			string currentVer = "4"; if (ver != currentVer) tmp = true; ver = currentVer;
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
		public JsonResult tabAccidents(string ver, bool tmp, bool obj) {
			Repositories_Main acc = new Repositories_Main();
			string currentVer = "1"; if (ver != currentVer) tmp = true; ver = currentVer;
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
						tblDocs = acc.GetJSON_tblDocs(),
						tblDocsInAccidents = acc.GetJSON_tblDocsInAccidents(),
						tblDocType = acc.GetJSON_tblDocType(),
						tblDocGroup = acc.GetJSON_tblDocGroup(),
						userData = acc.GetJSON_userData()
					},
					templates = new {
						tmpClaimEdit = RenderPartialViewToString("Accidents/tmpClaimEdit"),
						tmpUploadForm = RenderPartialViewToString("Files/tmpUploadForm"),
						tmp2templateDownload = RenderPartialViewToString("Files/tmp2templateDownload"),
						tmp2templateUpload = RenderPartialViewToString("Files/tmp2templateUpload"),

						tmpDocsCategory = RenderPartialViewToString("Files/tmpDocsCategory"),
						tmpDocsView = RenderPartialViewToString("Files/tmpDocsView"),
						tmpDocsNodes = RenderPartialViewToString("Files/tmpDocsNodes"),
						tmpDocsTree = RenderPartialViewToString("Files/tmpDocsTree"),

						tmp_Drivers = RenderPartialViewToString("Lists/tmp_Drivers"),
						tmp_InsPolicies = RenderPartialViewToString("Lists/tmp_InsPolicies"),
						tmp_Vehicles = RenderPartialViewToString("Lists/tmp_Vehicles")
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