using System.Configuration;

namespace CC.Models {

   public class cls_db_partial {
   }

   //public partial class dbDataContext {
   //   public dbDataContext()
   //      : base(ConfigurationManager.ConnectionStrings["ClaimsControlConnectionString"].ConnectionString, mappingSource) {
   //      OnCreated();
   //   }
   //}

   public partial class dbDataContext : System.Data.Linq.DataContext {

      partial void OnCreated() {
         this.Connection.ConnectionString = ConfigurationManager.ConnectionStrings["ClaimsControlConnectionString"].ToString();
      }
   }
}