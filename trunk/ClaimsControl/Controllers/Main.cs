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
						tblClaimTypes = acc.GetJSON_tblClaimTypes(),
						proc_Vehicles = acc.GetJSON_proc_Vehicles(false),
						proc_InsPolicies = acc.GetJSON_proc_InsPolicies(false),
						tblInsurers = acc.GetJSON_tblInsurers(),
						tblVehicleMakes = acc.GetJSON_tblVehicleMakes(),
						tblVehicleTypes = acc.GetJSON_tblVehicleTypes(),
						tblClaims = acc.GetJSON_tblClaims()
					},
					templates = new {
						tmpClaimEdit = RenderPartialViewToString("tmpClaimEdit")
						//tmpAccidentRowObj = RenderPartialViewToString("tmpAccidentRowObj")
						//tmpAccidentRow = RenderPartialViewToString("tmpAccidentRow")
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