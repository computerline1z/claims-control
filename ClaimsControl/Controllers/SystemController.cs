using System.Web;
using System.Web.SessionState;
using System;
using System.Web.Mvc;
using System.Web.Security;

public class SystemController : Controller, IRequiresSessionState {
	[HttpPost]
	public void Beat() {//(HttpContext context) 

		//System.Diagnostics.Debug.Print(Convert.ToString(HttpContext.Session["Heartbeat"] + " " + Convert.ToString(HttpContext.Session["UserData_UserName"])) + " " + Convert.ToString(HttpContext.User.Identity.IsAuthenticated));
		//System.Diagnostics.Debug.Print(Convert.ToString(HttpContext.User.Identity));

		//var cookie = Request.Cookies[FormsAuthentication.FormsCookieName];FormsAuthenticationTicket ticket = null;
		//try {ticket = FormsAuthentication.Decrypt(cookie.Value);}
		//catch (Exception decryptError) { System.Diagnostics.Debug.Print(Convert.ToString(decryptError.Message)); }
		//System.Diagnostics.Debug.Print(Convert.ToString(ticket));
		//System.Diagnostics.Debug.Print("-----------------------------------------------------------");
		//context.Session["Heartbeat"] = DateTime.Now;

		//if (ticket == null) return; // Not authorised
		//if (ticket.Expiration > DateTime.Now) { Response.Redirect("SessionExpiredPage.aspx");}
		//System.Diagnostics.Debug.Print(DateTime.Now.ToShortTimeString());
	}
}