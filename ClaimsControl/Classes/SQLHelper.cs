using System;
using System.Collections;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using CC.Classes;

namespace CC.SQLHelper {

	public static class SQLHelper {

		//StoredProcedureCollection spCollection = new StoredProcedureCollection();
		//StoredProcedure spData = new StoredProcedure();
		//spData.ProcName="TestMe";
		//spData.SetParam("@CountryCode",SqlDbType.Int,1);
		//spData.SetParam("@City",SqlDbType.VarChar, Hyderabad );
		//spCollection.add(spProcedure);
		public static bool ExecuteSps(StoredProcedureCollection spCollection, SqlConnection Connection) {
			try {
				foreach (StoredProcedure spData in spCollection) {
					SqlCommand cmd = new SqlCommand();
					int i = 0;
					if (Connection.State != ConnectionState.Open)
						Connection.Open();
					cmd.Connection = Connection;
					cmd.CommandType = CommandType.StoredProcedure;
					cmd.CommandText = spData.ProcName;
					IEnumerator myEnumerator = spData.GetParams().GetEnumerator();
					while (myEnumerator.MoveNext()) {
						ParamData pData = (ParamData)myEnumerator.Current;
						cmd.Parameters.Add(pData.pName, pData.pDataType);
						cmd.Parameters[i].Value = pData.pValue;
						i = i + 1;
					}
					cmd.ExecuteNonQuery();
				}
				return true;
			}
			catch {
				return false;
			}
		}
	}

	public struct ParamData {
		public string pName, pValue;
		public SqlDbType pDataType;

		public ParamData(string pName, SqlDbType pDataType, string pValue) {
			this.pName = pName;
			this.pDataType = pDataType;
			this.pValue = pValue;
		}
	}

	public class StoredProcedure {
		private string sProcName;
		private ArrayList sParams = new ArrayList();

		public void SetParam(string pName, SqlDbType pDataType, string pValue) {
			ParamData pData = new ParamData(pName, pDataType, pValue);
			sParams.Add(pData);
		}

		public ArrayList GetParams() {
			if (!(sParams == null)) { return sParams; }
			else { return null; }
		}

		public string ProcName {
			get { return sProcName; }
			set { sProcName = value; }
		}
	}

	public class StoredProcedureCollection : System.Collections.CollectionBase {

		public void add(StoredProcedure value) { List.Add(value); }

		public void Remove(int index) {
			if (index > Count - 1 || index < 0) { Console.WriteLine("No data to remove"); }//ignore
			else { List.RemoveAt(index); }
		}

		public StoredProcedure Item(int Index) {
			return (StoredProcedure)List[Index];
		}
	}

	//------------------------------------------------------------------------------------------------------------------------------------
	//public class ControlsInMenu
	//{
	//    public ControlsInMenu() { ;}
	//    public Int32 MenuID { get; set; }
	//    public Int32 ControlID { get; set; }
	//}
	public static class Readers {
		public static string conString = System.Configuration.ConfigurationManager.ConnectionStrings["ClaimsControlConnectionString"].ToString();

		public static StringBuilder ReportTable(string reportName, string[] Fields, int[] ID) {
			StringBuilder strBuilder = new StringBuilder("<table>");
			using (SqlConnection connection = new SqlConnection(conString)) {
				connection.Open();
				using (SqlCommand cmd = new SqlCommand("proc_Reports", connection)) {
					cmd.CommandType = CommandType.StoredProcedure;
					cmd.Parameters.AddWithValue("@AccountID", UserData.AccountID);
					cmd.Parameters.AddWithValue("@LanguageID", UserData.GetUserLanguageID());
					cmd.Parameters.AddWithValue("@reportName", reportName);
					DataTable relTbl = Utils.convertToTbl(ID);
					SqlParameter ids = cmd.Parameters.AddWithValue("@ids", Utils.convertToTbl(ID));//jei int -> fieldName bus ID
					ids.SqlDbType = SqlDbType.Structured; ids.TypeName = "dbo.RelationsTbl";
					SqlParameter fields = cmd.Parameters.AddWithValue("@fields", Utils.convertToTbl(Fields));//jei string -> fieldName bus Name
					fields.SqlDbType = SqlDbType.Structured; fields.TypeName = "dbo.NamesTbl";

					using (SqlDataReader reader = cmd.ExecuteReader()) {
						int ind = 0;
						while (reader.Read()) {
							strBuilder.Append("<tr>");
							for (int i = 0; i < reader.FieldCount; i++) {
								if (i == 0) {strBuilder.Append("<th>"); strBuilder.Append(reader.GetString(i)); strBuilder.Append("</th>");}
								else {strBuilder.Append("<td>"); strBuilder.Append(reader.GetString(i)); strBuilder.Append("</td>");}
							}
							ind++; strBuilder.Append("</tr>");
						}
					}
					strBuilder.Append("</table>");
				}
			}
			return strBuilder;
		}
		//public static object GetControlsInMenu(Int32 TabID) {
		//   List<Int32[]> CinMenu = new List<Int32[]>();
		//   using (SqlConnection con = new SqlConnection(conStr)) {
		//      SqlCommand cmd = new SqlCommand("proc_Action_ControlsInMenu", con);
		//      cmd.CommandType = System.Data.CommandType.StoredProcedure;
		//      cmd.Parameters.AddWithValue("@LoginID", LoginData.LoginID);
		//      cmd.Parameters.AddWithValue("@TabID", TabID);
		//      con.Open();
		//      using (SqlDataReader dr = cmd.ExecuteReader()) {
		//         while (dr.Read()) {
		//            Int32[] arr = new Int32[2];
		//            arr[0] = dr.GetInt32(0);
		//            arr[1] = dr.GetInt32(1);
		//            CinMenu.Add(arr);
		//         }
		//      }
		//   }
		//   return CinMenu;
		//}
	}
}