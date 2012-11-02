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
		public JsonResult Messages() {
			return Json(new { Proba = "Šalia kelio karčema" });
		}

		[HttpPost]
		public JsonResult tabAccidents() {
			Repositories_Accidents acc = new Repositories_Accidents();
			return Json(

				new {
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
						tblUsers = acc.GetJSON_tblUsers()
					},
					templates = new {
						tmpClaimEdit = RenderPartialViewToString("Accidents/tmpClaimEdit"),
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
						}
				}

			);
		}

		[HttpPost]
		public JsonResult topNew() {
			Repositories_Accidents acc = new Repositories_Accidents();
			return Json(
				new {
					jsonObj = new {
						proc_topDrivers = acc.GetJSON_proc_Drivers(true),
						proc_topVehicles = acc.GetJSON_proc_Vehicles(true),
						proc_topInsPolicies = acc.GetJSON_proc_InsPolicies(true)
					}
				}

			);
		}
		[HttpPost]
		public JsonResult Claims() {
			return Json(new { Proba = "Šalia kelio karčema1" });
		}

		[HttpPost]
		public JsonResult Map() {
			return Json(new { Proba = "Šalia kelio karčema2" });
		}

		[HttpPost]
		public JsonResult Reports() {
			return Json(new { Proba = "Šalia kelio karčema3" });
		}
	}
}