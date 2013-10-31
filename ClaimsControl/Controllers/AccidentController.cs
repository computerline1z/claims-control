using System.Web.Mvc;
using CC.Classes;
using CC.Models;
using System;

namespace CC.Controllers {

   [Authorize]
   public class AccidentController : ToStringController {

      //[HttpPost]
      //public ActionResult Accident(int? id) {
      //   clsAccident a = new clsAccident(id);
      //   return View(a);
      //}
      //RenderPartialViewToString(“~/Path/To/View.aspx”)
      [HttpPost]
      public JsonResult GetAccident(int? AccidentNo)//GetAccidentLists()//Naudoja AccidentsCard
      {
         Repositories_Main AccRep = new Repositories_Main();
         string View = ""; int AccNo = (AccidentNo.HasValue) ? AccidentNo.Value : 0;
         clsAccident a = new clsAccident(AccNo);
         View = RenderPartialViewToString("Card", a);
         //if (AccidentNo == 0) { }//new { NewRec = NewRec }
         //else {
         //   View = RenderPartialViewToString("Card", a);
         //}
         return Json(new {
            //Render - pirmas, ExecFn - paskutinis
				Render = new { divAccidentEdit = View } //tabAccidents
				//tblAccidentsTypes = AccRep.GetJSON_tblAccidentTypes(),
				//proc_Drivers = AccRep.GetJSON_proc_Drivers(false),
				//Vietoj apationio $("#accidentTab").tabs() darom LoadScript'e accidentCard.js 
				//ExecFn = new { accidentTab = "tabs" } //tabAccidents // accidentTab = "tabs" 
         });
      }

      [HttpPost]
      public JsonResult AccidentsList(string ver) {
			//warnings w = new warnings();
			//w.sendWarnigns();

         Repositories_Main acc = new Repositories_Main();
			return Json(
				new {
					ver = "0",//kol kas šitas be versijų
					jsonObj = new {proc_Accidents = acc.GetJSON_proc_Accidents()}
					//templates = new {tmpClaimEdit = RenderPartialViewToString("Accidents/tmpClaimEdit")}					
				}
			);
      }
   }
}