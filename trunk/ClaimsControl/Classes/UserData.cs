using System;
using System.Configuration;
using System.Linq;
using System.Web;
using CC.Models;

namespace CC.Classes {

	public static class UserData {

		public static void CheckIt() {
			if (HttpContext.Current.Session["UserData_LoginName"] != null) return;
			else SetParameters();
		}

		public static void SetParameters() {
			//CC.Providers.CCMemProvider CCP = new CC.Providers.CCMemProvider();
			using (dbDataContext db = new dbDataContext(ConfigurationManager.ConnectionStrings["ClaimsControlConnectionString"].ConnectionString)) {
				var u = (from l in db.tblUsers
							where l.Email == HttpContext.Current.User.Identity.Name
							select l).SingleOrDefault();
				if (u != null) {
					var acount = (from aa in db.tblAccounts where aa.ID == u.AccountID select aa).Single();
					SetParameters(u, acount);
				}
			}
		}

		public static void SetParameters(tblUser U, tblAccount account) {
			UserName = U.FirstName + " " + U.Surname;
			UserID = U.ID;
			Roles_GroupID = U.RoleGroupID;
			Email = U.Email;
			Account = account.Name.ToString();
			AccountID = U.AccountID;
			DocsPath = account.DocsPath;
		}

		public static DateTime GetUserTime() { 
			using (dbDataContext db = new dbDataContext(ConfigurationManager.ConnectionStrings["ClaimsControlConnectionString"].ConnectionString)) {
				int? TimeZoneID = (from aa in db.tblAccounts where aa.ID == UserData.AccountID select aa.TimeZoneID).Single();
				int addHours = (TimeZoneID==null) ? TimeZoneID.Value - 1 : 2;//ID=1 reiškia GMT+0, 2 - GMT+1 ir t.t.
				return DateTime.Now;
				//return DateTime.Now.AddHours(addHours);//pridedam valandas jai mūsų serve nustatyta GMT laikas
			}		
		}
		public static string GetStringDate(DateTime date) {
			return date.ToShortDateString();
		}
		public static void UpdateUser(string firstName, string surname, string email, int accountID, int languageID, string roleNames) {
			using (dbDataContext db = new dbDataContext(ConfigurationManager.ConnectionStrings["ClaimsControlConnectionString"].ConnectionString)) {
				int? userId = null;
				int rzlt = db.proc_Update_Edit_tblUsers(ref userId, firstName, surname, email, accountID, languageID, roleNames);
			}
		}

		public static string UserName {
			get { CheckIt(); return (string)HttpContext.Current.Session["UserData_UserName"]; }
			set { HttpContext.Current.Session["UserData_UserName"] = value; }
		}

		public static Int32 AccountID {
			get { CheckIt(); return (Int32)HttpContext.Current.Session["UserData_AccountID"]; }
			set { HttpContext.Current.Session["UserData_AccountID"] = value; }
		}

		public static string Account {
			get { CheckIt(); return (string)HttpContext.Current.Session["UserData_Account"]; }
			set { HttpContext.Current.Session["UserData_Account"] = value; }
		}

		public static Int32 UserID {
			get { CheckIt(); return (Int32)HttpContext.Current.Session["UserData_UserID"]; }
			set { HttpContext.Current.Session["UserData_UserID"] = value; }
		}

		public static Int32 Roles_GroupID {
			get { CheckIt(); return (Int32)HttpContext.Current.Session["UserData_Roles_GroupID"]; }
			set { HttpContext.Current.Session["UserData_Roles_GroupID"] = value; }
		}

		public static string Email {
			get { CheckIt(); return (string)HttpContext.Current.Session["UserData_Email"]; }
			set { HttpContext.Current.Session["UserData_Email"] = value; }
		}
		public static string DocsPath {
			get { CheckIt(); return (string)HttpContext.Current.Session["DocsPath"]; }
			set { HttpContext.Current.Session["DocsPath"] = value; }
		}
	}
}