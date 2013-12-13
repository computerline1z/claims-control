using System;
using System.Collections;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using MyHelper;

namespace MyHelper {
	public class sql {
		static string connectionString;
		public static void UpdateByStr(string sql,string conString) {
            connectionString=conString;
			using (SqlConnection conn = new SqlConnection(connectionString)) {
				using (SqlCommand comm = new SqlCommand()) {
					comm.Connection = conn;
					comm.CommandText = sql;
					comm.CommandType = CommandType.Text;
					try {
						conn.Open();
						comm.ExecuteNonQuery();
					}
					catch (SqlException ex) {
						MyEventLog.AddException(ex.Message, "sql.UpdateByStr", 1200);
						//throw ex;
					}

				}
			}
		}
		/*public void UpdateByStr(string sql) {
			string updateCommand = "UPDATE RoomsTable SET [Date Checked]=@checkedDate WHERE ID = @id"; // '9/27/2012'
			using (SqlConnection conn = new SqlConnection(connectionString)) {
				using (SqlCommand comm = new SqlCommand()) {

					comm.Connection = conn;
					comm.CommandText = updateCommand;
					comm.CommandType = CommandType.Text;
					comm.Parameters.AddWithValue("@checkedDate", "df");
					comm.Parameters.AddWithValue("@id", "fgd");
					try {
						conn.Open();
						comm.ExecuteNonQuery();
					}
					catch (SqlException ex) {
						MyEventLog.AddException(ex.Message, "sql.UpdateByStr", 1200);
					}

				}
			}
		}*/
	}
}