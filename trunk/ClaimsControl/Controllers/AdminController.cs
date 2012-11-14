using System.Web.Mvc;
using CC.Models;


using CC.Classes;

namespace ClaimsControl.Controllers {

	[Authorize]
	public class AdminController : ToStringController {
		[HttpPost]
		public JsonResult edit(bool tmp, bool obj) {
			Repositories_Admin acc = new Repositories_Admin();
			return Json(
				new {
					jsonObj = (obj) ? new {
						tblAccount = acc.GetJSON_tblAccount(),
						tblCurrencies = acc.GetJSON_tblCurrencies(),
						tblCountries = acc.GetJSON_tblCountries(),
						tblTimeZones = acc.GetJSON_tblTimeZones()
					} :  new {
						tblAccount = acc.GetJSON_tblAccount(),
						tblCurrencies = acc.GetJSON_tblCurrencies(),
						tblCountries = acc.GetJSON_tblCountries(),
						tblTimeZones = acc.GetJSON_tblTimeZones()
					},
					templates = (tmp) ? new {
						tmpAdminMain = RenderPartialViewToString("Admin/tmpAdminMain"),
						tmpUserRow = RenderPartialViewToString("Admin/tmpUserRow")
					} : new {
						tmpAdminMain = "",
						tmpUserRow = ""
					},
					Script = new { File = "/Scripts/Forms/admin.js?ver=1", Pars = "" }
				}
			);
		}
	}
}