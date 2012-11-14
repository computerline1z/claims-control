using System.Web.Mvc;
using CC.Classes;
using CC.Models;
using System.Dynamic;

namespace CC.Controllers {

    [Authorize]
    public class ListsController : ToStringController
    {

      [HttpPost]
      public JsonResult GetListItem(int? id, string tbl, bool GetAll)//GetAccidentLists()//Naudoja AccidentsCard
      {
         /// <summary>
         /// Siuncia Json objektus kiekvienam lenteles list itemsui.
         /// <para>Tusti objektai ("") ignoruojami<see cref="System.Console.WriteLine(System.String)"/></para>
         /// <para>Render = new { div = View } - renderina View i #div ir jei ten yra div.inputForm pravaro ją per js UpdatableForm metoda,
         ///  taip prideda controlsus pagal markupa arba jsona kuris nurodomas tam div.inputForm kaip Source</para>
         /// <para>ExecFn = new { tabAccidents = "tabs" } - pravaro jQuery pluginus ant kontrolsu</para>
         /// </summary>

         Repositories_Lists ListRep = new Repositories_Lists();
         string View = ""; object obj;
         if (tbl == "tblDrivers") {
            clsDriver d = new clsDriver(id);
            View = RenderPartialViewToString(tbl, d);//"tblDriver"
         }
         else if (tbl == "tblVehicles") {
            clsVehicle d = new clsVehicle(id);
            View = RenderPartialViewToString(tbl, d);//"tblVehicles"
         }
         else if (tbl == "tblInsPolicies") {
            clsInsPolicy d = new clsInsPolicy(id);
            View = RenderPartialViewToString(tbl, d);//"tblInsPolicies"
         }

         if (GetAll) {
            Repositories_Accidents AccRep = new Repositories_Accidents();
            obj = new {
               //tbl pirmi, Render - antras, ExecFn - paskutinis
               ItemData = ListRep.Get_ItemData(tbl, (id.HasValue) ? id.Value : 0),
               tblDocs = ListRep.GetJSON_tblDocs(),
               tblDocType = ListRep.GetJSON_tblDocType(),
               tblDocGroup = ListRep.GetJSON_tblDocGroup(),
               //tblVehicleTypes = AccRep.GetJSON_tblVehicleTypes(), turim iš starto
               //tblVehicleMakes = AccRep.GetJSON_tblVehicleMakes(),
               //tblInsurers = AccRep.GetJSON_tblInsurers(),
               Render = new { divEditableForm = View }//,
               //ExecFn = new { tabAccidents = "tabs" }
            };
         }
         else { obj = new { Render = new { divEditableForm = View } }; }
         return Json(obj);
      }

		[HttpPost]
		public JsonResult topNew(bool tmp, bool obj) {
			Repositories_Accidents acc = new Repositories_Accidents();
			System.Diagnostics.Debug.Print("obj - " + obj.ToString());
			return Json(
				new {
					jsonObj = new {//šitam visada atnaujinu objektus
						proc_topDrivers = acc.GetJSON_proc_Drivers(true),
						proc_topVehicles = acc.GetJSON_proc_Vehicles(true),
						proc_topInsPolicies = acc.GetJSON_proc_InsPolicies(true)
					},
					templates = (tmp)? new {
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
					Script = new { File = "/Scripts/Forms/lists.js?ver=1", Pars = "" } 
				}
			);
		}



		//[HttpPost]
		//public JsonResult tabAccidents() {
		//   Repositories_Accidents acc = new Repositories_Accidents();
		//   return Json(
		//      new {
		//         jsonObj = new {
		//            //proc_Accidents = acc.GetJSON_proc_Accidents(),
		//            tblAccidents = acc.GetJSON_tblAccidents(),
		//            proc_Drivers = acc.GetJSON_proc_Drivers(false),
		//            tblAccidentsTypes = acc.GetJSON_tblAccidentTypes(),
		//            proc_Years = acc.GetJSON_proc_Years(),
		//            tblClaimTypes = acc.GetJSON_tblClaimTypes(),
		//            proc_Vehicles = acc.GetJSON_proc_Vehicles(false),
		//            proc_InsPolicies = acc.GetJSON_proc_InsPolicies(false),
		//            tblInsurers = acc.GetJSON_tblInsurers(),
		//            tblVehicleMakes = acc.GetJSON_tblVehicleMakes(),
		//            tblVehicleTypes = acc.GetJSON_tblVehicleTypes(),
		//            tblClaims = acc.GetJSON_tblClaims(),
		//            tblUsers = acc.GetJSON_tblUsers()
		//         },
		//         templates = new {
		//            tmpClaimEdit = RenderPartialViewToString("Accidents/tmpClaimEdit"),
		//            tmpDriverRow = RenderPartialViewToString("Lists/tmpDriverRow"),
		//            tmpVehicleRow = RenderPartialViewToString("Lists/tmpVehicleRow"),
		//            tmpInsPolicyRow = RenderPartialViewToString("Lists/tmpInsPolicyRow"),
		//            tmpAllDrivers = RenderPartialViewToString("Lists/tmpAllDrivers"),
		//            tmpAllVehicles = RenderPartialViewToString("Lists/tmpAllVehicles"),
		//            tmpAllInsPolicies = RenderPartialViewToString("Lists/tmpAllInsPolicies"),
		//            tmpListsTop = RenderPartialViewToString("Lists/tmpListsTop"),
		//            tmp_Drivers = RenderPartialViewToString("Lists/tmp_Drivers"),
		//            tmp_InsPolicies = RenderPartialViewToString("Lists/tmp_InsPolicies"),
		//            tmp_Vehicles = RenderPartialViewToString("Lists/tmp_Vehicles"),
		//            tmpAdminMain = RenderPartialViewToString("Admin/tmpAdminMain"),
		//            tmpUserRow = RenderPartialViewToString("Admin/tmpUserRow")
		//         }
		//      }
		//   );
		//}
   }
}