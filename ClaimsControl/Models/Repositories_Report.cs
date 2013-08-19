using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using CC.Classes;

namespace CC.Models {

	public class Repositories_Report {
		private dbDataContext dc;

		public Repositories_Report() { dc = new dbDataContext(ConfigurationManager.ConnectionStrings["ClaimsControlConnectionString"].ConnectionString); }

		public object GetJSON_Reports(string Name) {
			if (Name == "rep_claimsList") {
				return "proc_Claims";
			}
			else {
				jsonArrays JSON = new jsonArrays();
				//JSON.Data = from r in dc.tblReports
				//            select new object[] { r.ID, r.Name, r.Title };
				//object[] Cols = { new { FName = "ID" }, new { FName = "Name" }, new { FName = "Title" } }; JSON.Cols = Cols;
				//JSON.Config = new { tblUpdate = "tblReports" };
				return JSON;
			}
		}
	}
}