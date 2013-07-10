﻿using System;
using System.Web.Mvc;
using CC.Models;

namespace CC.Controllers {

   [Authorize]
   public class UpdateController : Controller {

      [HttpPost]
      public JsonResult Add(string[] Data, string[] Fields, string DataTable, string Ext) {
         Repositories_Update UpdateRep = new Repositories_Update();
         return Json(UpdateRep.AddNew(Data, Fields, DataTable, Ext));
      }

      [HttpPost]
      public JsonResult Edit(Int32 id, string[] Data, string[] Fields, string DataTable, string Ext) {
         Repositories_Update UpdateRep = new Repositories_Update();
         return Json(UpdateRep.Edit(id, Data, Fields, DataTable, Ext));
      }

      [HttpPost]
      public JsonResult Delete(Int32 id, string DataTable, string Ext) {
         Repositories_Update UpdateRep = new Repositories_Update();
         return Json(UpdateRep.Delete(id, DataTable, Ext));
      }
		[HttpPost]
		public JsonResult updateRelations(Int32 id, string idField, string Field, string[] Data, string DataTable) {
			Repositories_Update UpdateRep = new Repositories_Update();
			return Json(UpdateRep.updateRelations(id, idField, Field, Data, DataTable));
			//return Json(new jsonResponse { ErrorMsg = "", ResponseMsg = "" });
		}
   }
}