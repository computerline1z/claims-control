using System;
using System.Collections;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using MyHelper;

namespace MyHelper {
	public class sql {
		public static void UpdateByStr(string sql,string conString) {
            using (SqlConnection conn = new SqlConnection(conString))
            {
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
        public static int InsertAndGetID(string sql, string conString)
        {
           int ID = 0;
            using (SqlConnection conn = new SqlConnection(conString))
            {
                using (SqlCommand comm = new SqlCommand())
                {
                    comm.Connection = conn;
                    comm.CommandText = sql + " SELECT SCOPE_IDENTITY()";
                    comm.CommandType = CommandType.Text;
                    try
                    {
                        conn.Open();
                        ID = (int)(decimal)comm.ExecuteScalar();
                    }
                    catch (SqlException ex)
                    {
                        MyEventLog.AddException(ex.Message, "sql.UpdateByStr", 1200);
                        //throw ex;
                    }
                }
            }
            return ID;
        }
        public static string GetStr(string sql, string conString)
        {
            string ret = "";
            using (SqlConnection conn = new SqlConnection(conString))
            {
                using (SqlCommand comm = new SqlCommand())
                {
                    comm.Connection = conn;
                    comm.CommandText = sql;
                    comm.CommandType = CommandType.Text;
                    try
                    {
                        conn.Open();
                        ret = (string)comm.ExecuteScalar();
                    }
                    catch (SqlException ex)
                    {
                        MyEventLog.AddException(ex.Message, "sql.GetStr", 1200);
                        //throw ex;
                    }
                }
            }
            return ret;
        }

	}
}