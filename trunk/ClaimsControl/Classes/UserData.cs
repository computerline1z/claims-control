using System;
using System.Configuration;
using System.Linq;
using System.Web;
using CC.Models;
using System.IO;
using System.Web.Security;

namespace CC.Classes {

	public static class UserData {
		private static string conString = ConfigurationManager.ConnectionStrings["ClaimsControlConnectionString"].ConnectionString;
		public static void CheckIt() {
			if (HttpContext.Current.Session["UserData_Email"] != null && (String)HttpContext.Current.Session["UserData_Email"] == HttpContext.Current.User.Identity.Name) return; // && HttpContext.Current.User.Identity.Name!=null
			else { SetParameters(); }
		}

		public static void SetParameters() {
			//CC.Providers.CCMemProvider CCP = new CC.Providers.CCMemProvider();
			using (dbDataContext db = new dbDataContext(conString)) {
				var u = (from l in db.tblUsers
							where l.Email == HttpContext.Current.User.Identity.Name && l.IsDeleted == false && l.IsLockedOut == false && l.IsActive == true && l.IsApproved == true
							select l).SingleOrDefault();
				if (u != null) {
					var acount = (from aa in db.tblAccounts where aa.ID == u.AccountID select aa).Single();
					SetParameters(u, acount);
				}
				else {
					FormsAuthentication.SignOut();
					HttpContext.Current.Response.Redirect("Account/LogOn");
					//RedirectToRoute("/Report/Error/", new { exceptionType = ex.GetType().Name  });
					//Response.Redirect(Url.Action("Error", "Report", new { exceptionType = ex.GetType().Name });
					//Controller.RedirectToAction("LogOn", "Account");
					//RedirectToAction("Error", "Report", rnew { exceptionType = ex.GetType().Name });
					UserName = ""; UserID = 0; Roles_GroupID = 0; Email = ""; Account = ""; AccountID = 0; DocsPath = "";
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
			using (dbDataContext db = new dbDataContext(conString)) {
				int? TimeZoneID = (from aa in db.tblAccounts where aa.ID == UserData.AccountID select aa.TimeZoneID).Single();
				int addHours = (TimeZoneID == null) ? TimeZoneID.Value - 1 : 2;//ID=1 reiškia GMT+0, 2 - GMT+1 ir t.t.
				return DateTime.Now;
				//return DateTime.Now.AddHours(addHours);//pridedam valandas jai mūsų serve nustatyta GMT laikas
			}
		}
		public static Int32 GetUserLanguageID() {
			Int32 LanguageID;
			using (dbDataContext db = new dbDataContext(conString)) {
				LanguageID = (from aa in db.tblUsers where aa.ID == UserData.UserID select aa.LanguageID).Single();
			}
			return LanguageID;
		}
		public static string GetStringDate(DateTime date) {
			return date.ToShortDateString();
		}
		public static void UpdateUser(string firstName, string surname, string email, int accountID, int languageID, string roleNames) {
			using (dbDataContext db = new dbDataContext(conString)) {
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
		public static tblUser User {
			get {
				tblUser user = null;
				using (dbDataContext db = new dbDataContext(conString)) { user = (from u in db.tblUsers where u.ID == UserData.UserID select u).FirstOrDefault(); }
				return user;
			}
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
		public static string GetFullReportsPath {
			get { CheckIt(); return HttpContext.Current.Server.MapPath(@"~//Uploads//" + UserData.DocsPath + "//Reports"); }
		}
		//public static bool PersistentCookie {
		//   get { CheckIt(); return (bool)HttpContext.Current.Session["PersistentCookie"]; }
		//   set { HttpContext.Current.Session["PersistentCookie"] = value; }
		//}

		//public static string GetMailPath(string tmplName, string email) {
		//   CheckIt(); string Lang = "";
		//   using (dbDataContext db = new dbDataContext(ConfigurationManager.ConnectionStrings["ClaimsControlConnectionString"].ConnectionString)) {
		//      Lang = (from aa in db.tblUsers where aa.Email == email select aa.tblLanguage.ShortName).Single();
		//   }
		//   string relativePath = String.Format("~/App_Data/MailTmpl/{0}/{1}.htm", Lang, tmplName);
		//   return HttpContext.Current.Server.MapPath(relativePath);
		//}


		//public static Nullable<Guid> GetUI(string email) {
		//   Nullable<Guid> ui = null;
		//   using (dbDataContext db = new dbDataContext(ConfigurationManager.ConnectionStrings["ClaimsControlConnectionString"].ConnectionString)) {
		//      ui = (from aa in db.tblUsers where aa.Email == email select aa.tempUI).Single();
		//   }
		//   if (ui == null) { MyEventLog.AddException(String.Format("Reąuested '{0}'.", email), "No TempUI", 1000); }
		//   return ui;
		//}



		public static tblUser GetUserByEmail(string Email) {
			tblUser user = null;
			using (dbDataContext db = new dbDataContext(conString)) {
				user = (from u in db.tblUsers where u.AccountID == UserData.AccountID && u.Email==Email select u).FirstOrDefault();
			}
			return user;
		}



		public static string GetMailBody_SetUrl(string email, string tmplName) {
			CheckIt(); string Lang = ""; tblUser User = null; string body = "";
			using (dbDataContext db = new dbDataContext(conString)) {
				User = (from aa in db.tblUsers where aa.Email == email select aa).Single();
				Lang = User.tblLanguage.ShortName;

				string relativePath = String.Format("~/App_Data/MailTmpl/{0}/{1}.htm", Lang, tmplName);
				string Path = HttpContext.Current.Server.MapPath(relativePath);
				if (!File.Exists(Path)) {
					MyEventLog.AddException(String.Format("Nerastas toks šablonas '{0}'.", Path), "Err in MailHelper", 69);
					throw new Exception(String.Format("Nerastas toks šablonas '{0}'.", Path));
				}
				if (User.tempUI == null) { User.tempUI = Guid.NewGuid(); db.SubmitChanges(); }//guido nebus resetinant. Naujiems jis atsiras pagal nutylejima

				body = File.ReadAllText(Path); var uri = HttpContext.Current.Request.Url;
				string url = uri.Scheme + "://" + uri.Authority + "/Account/NewPassword/" + User.tempUI.ToString();

				if (tmplName == "ResetUserPsw" || tmplName == "NewUserPsw") { body = body.Replace("/*homeUrl*/", url).Replace("/*userName*/", (" " + User.FirstName + " " + User.Surname)).Replace("/*companyName*/", (User.tblAccount.Name + " ")); }

			}
			return body;//bus tusčia jei nerado šablono
		}
		public static MembershipUser GetUserIdFromTempUi(Guid? TempUi) {
			tblUser User = null;
			using (dbDataContext db = new dbDataContext(conString)) {
				User = (from u in db.tblUsers where u.tempUI == TempUi select u).SingleOrDefault();
			}
			return Membership.GetUser(User.Email);
		}
	}
}