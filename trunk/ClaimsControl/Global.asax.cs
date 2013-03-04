using System.Globalization;
using System.Threading;
using System.Web.Mvc;
using System.Web.Routing;
using CC.Services.Ninject;

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
   }
}