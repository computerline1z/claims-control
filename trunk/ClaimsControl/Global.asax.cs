using System.Globalization;
using System.Threading;
using System.Web.Mvc;
using System.Web.Routing;
using CC.Services.Ninject;
using System;
using System.Web;
using System.Web.Security;
using System.Security.Principal;

namespace ClaimsControl {
   // Note: For instructions on enabling IIS6 or IIS7 classic mode,
   // visit http://go.microsoft.com/?LinkId=9394801

   public class MvcApplication : System.Web.HttpApplication {

      public static void RegisterGlobalFilters(GlobalFilterCollection filters) {
         filters.Add(new HandleErrorAttribute());
      }

      public static void RegisterRoutes(RouteCollection routes) {
         //routes.RouteExistingFiles = true;
         routes.IgnoreRoute("{resource}.axd/{*pathInfo}");//Buvo

         //routes.IgnoreRoute("{file}.txt");
         //routes.IgnoreRoute("{file}.htm");
         //routes.IgnoreRoute("{file}.html");
         //routes.IgnoreRoute("{file}.js");
         routes.MapRoute(
         "Default", // Route name
         "{controller}/{action}/{id}", // URL with parameters
         new { controller = "Main", action = "Start", id = UrlParameter.Optional }); // Parameter defaults
      }

      protected void Application_Start() {
         AreaRegistration.RegisterAllAreas();
         Thread.CurrentThread.CurrentUICulture = new CultureInfo("lt-LT");
         RegisterGlobalFilters(GlobalFilters.Filters);
         RegisterRoutes(RouteTable.Routes);

         ControllerBuilder.Current.SetControllerFactory(new NinjectControllerFactory());
      }
		protected void Session_End() {
			System.Diagnostics.Debug.Print("Session ended");
		}




		//public static void Logoff(HttpSessionStateBase session, HttpResponseBase response) {
		//   // Delete the user details from cache.
		//   session.Abandon();

		//   // Delete the authentication ticket and sign out.
		//   FormsAuthentication.SignOut();

		//   // Clear authentication cookie.
		//   HttpCookie cookie = new HttpCookie(FormsAuthentication.FormsCookieName, "");
		//   cookie.Expires = DateTime.Now.AddYears(-1);
		//   response.Cookies.Add(cookie);
		//}

		//void context_BeginRequest(object sender, EventArgs e) {
		//   string cookie = ((HttpApplication)sender).Context.Request.Cookies[".ASPXFORMSAUTHSS"].Value;
		//   FormsAuthenticationTicket ticket = FormsAuthentication.Decrypt(cookie);
		//}

		//protected void Application_AuthenticateRequest(object sender, EventArgs e) {
		//   HttpCookie authCookie = Request.Cookies[FormsAuthentication.FormsCookieName];
		//   if (authCookie != null) {
		//      // Get the forms authentication ticket.
		//      FormsAuthenticationTicket authTicket = FormsAuthentication.Decrypt(authCookie.Value);
		//      var identity = new GenericIdentity(authTicket.Name, "Forms");
		//      //var principal = new MyPrincipal(identity);

		//      // Get the custom user data encrypted in the ticket.
		//      string userData = ((FormsIdentity)(Context.User.Identity)).Ticket.UserData;

		//      //// Deserialize the json data and set it on the custom principal.
		//      //var serializer = new JavaScriptSerializer();
		//      //principal.User = (User)serializer.Deserialize(userData, typeof(User));

		//      //// Set the context user.
		//      //Context.User = principal;
		//   }
		//}

		protected virtual void OnException(ExceptionContext filterContext) {
			System.Diagnostics.Debug.Print("Error occured - " + filterContext.Exception.Message);
		}
   }
}