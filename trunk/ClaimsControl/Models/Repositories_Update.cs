using System;
using System.Data;
using System.Data.SqlClient;
using CC.Classes;
using System.Diagnostics;
using System.Text.RegularExpressions;
using System.Configuration;
using System.Linq;

namespace CC.Models {
	public interface IUpdate {

		jsonResponse AddNew(string[] Data, string[] Fields, string DataTable, string Ext);

		jsonResponse Edit(Int32 id, string Data, string Field, string DataTable, string Ext);

		jsonResponse Delete(Int32 id, string DataTable, string Ext);
	}

	public class Repositories_Update {
		private static string conStr = ConfigurationManager.ConnectionStrings["ClaimsControlConnectionString"].ToString();

		private string GetStringFromArrSpec(string[] Arr) {
			if (Arr == null) return "null";
			for (int i = 0; i < Arr.GetLength(0); i++) { if (Arr[i] == null || Arr[i] == "") Arr[i] = "null"; }//Nes null jei bus ant join teliks null
			return string.Join("#|#", Arr);
		}

		private string GetStringFromArrComma(string[] Arr) { return string.Join(",", Arr); }

		public jsonResponse AddNew(string[] Data, string[] Fields, string DataObject, string Ext) {
			jsonResponse JsonResp = new jsonResponse { ErrorMsg = "", ResponseMsg = "" };
			SqlConnection con = new SqlConnection(conStr);
			SqlCommand cmd = new SqlCommand("proc_Update_AddNew", con);
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@TableName", DataObject.Trim());
			cmd.Parameters.AddWithValue("@Data", GetStringFromArrSpec(Data));//Spec duomenu delimiteris, nes ten kbl gali but
			cmd.Parameters.AddWithValue("@Fields", GetStringFromArrComma(Fields));

			SqlParameter Extout = cmd.Parameters.AddWithValue("@Ext", ((Ext == null) ? "" : Ext));
			Extout.SqlDbType = System.Data.SqlDbType.NVarChar;
			Extout.Size = -1;
			Extout.Direction = ParameterDirection.InputOutput;

			SqlParameter IDout = cmd.Parameters.AddWithValue("@ID", 0);
			IDout.Direction = ParameterDirection.InputOutput;

			cmd.Parameters.AddWithValue("@UserID", UserData.UserID);
			cmd.Parameters.AddWithValue("@AccountID", UserData.AccountID);

			try {
				con.Open(); cmd.ExecuteNonQuery(); Int32 ID = Convert.ToInt32(IDout.Value);
				JsonResp.ResponseMsg = new { ID = ID, Ext = ((Extout.Value != null) ? Convert.ToString(Extout.Value) : "") };
			}
			catch (SqlException ex) { JsonResp.ErrorMsg = ErrorHandler.GetAddNewMsg(Data, Fields, DataObject, ex); }
			finally { con.Close(); }
			return JsonResp;
		}

		public jsonResponse Edit(Int32 id, string[] Data, string[] Fields, string DataObject, string Ext) {
			jsonResponse JsonResp = new jsonResponse { ErrorMsg = "", ResponseMsg = "" };
			SqlConnection con = new SqlConnection(conStr);
			SqlCommand cmd = new SqlCommand("proc_Update_Edit", con);
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@TableName", DataObject.Trim());
			cmd.Parameters.AddWithValue("@Data", GetStringFromArrSpec(Data));
			cmd.Parameters.AddWithValue("@Fields", GetStringFromArrComma(Fields));
			cmd.Parameters.AddWithValue("@ID", id);
			cmd.Parameters.AddWithValue("@UserID", UserData.UserID);

			SqlParameter Extout = cmd.Parameters.AddWithValue("@Ext", ((Ext == null) ? "" : Ext));
			Extout.SqlDbType = System.Data.SqlDbType.NVarChar;
			Extout.Size = -1;
			Extout.Direction = ParameterDirection.InputOutput;

			cmd.Parameters.AddWithValue("@AccountID", UserData.AccountID);

			try {
				con.Open(); cmd.ExecuteNonQuery();
				if (Extout.Value != null) { JsonResp.ResponseMsg = new { Ext = ((Extout.Value != null) ? Convert.ToString(Extout.Value) : "") }; }
			}
			catch (SqlException ex) { JsonResp.ErrorMsg = ErrorHandler.GetEditMsg(id, Data, Fields, DataObject, ex); }
			finally { con.Close(); }
			return JsonResp;
		}

		public jsonResponse Delete(Int32 id, string DataObject, string Ext) {
			jsonResponse JsonResp = new jsonResponse { ErrorMsg = "", ResponseMsg = "" };
			SqlConnection con = new SqlConnection(conStr);
			SqlCommand cmd = new SqlCommand("proc_Update_Delete", con);
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@TableName", DataObject.Trim());
			cmd.Parameters.AddWithValue("@ID", id);
			cmd.Parameters.AddWithValue("@UserID", UserData.UserID);

			SqlParameter Extout = cmd.Parameters.AddWithValue("@Ext", ((Ext == null) ? "" : Ext));
			Extout.SqlDbType = System.Data.SqlDbType.NVarChar;
			Extout.Size = -1;
			Extout.Direction = ParameterDirection.InputOutput;

			//SqlParameter SuccessMsg = cmd.Parameters.AddWithValue("@SuccessMsg", "");
			//SuccessMsg.SqlDbType = System.Data.SqlDbType.NVarChar;
			//SuccessMsg.Size = -1;
			//SuccessMsg.Direction = ParameterDirection.InputOutput;

			cmd.Parameters.AddWithValue("@AccountID", UserData.AccountID);

			try {
				con.Open(); cmd.ExecuteNonQuery(); { JsonResp.ResponseMsg = new { Ext = ((Extout.Value != null) ? Convert.ToString(Extout.Value) : "") }; }
				//con.Open(); cmd.ExecuteNonQuery(); { JsonResp.ResponseMsg = new { SuccessMsg = ((SuccessMsg.Value != null) ? Convert.ToString(SuccessMsg.Value) : ""), Ext = ((Extout.Value != null) ? Convert.ToString(Extout.Value) : "") }; }
			}
			catch (Exception ex) { JsonResp.ErrorMsg = ex.Message; }
			finally { con.Close(); }
			return JsonResp;
		}

		public jsonResponse updateRelations(Int32 id, string idField, string Field, string[] Data, string DataTable) {
			jsonResponse JsonResp = new jsonResponse { ErrorMsg = "", ResponseMsg = "" };

			DataTable relTbl = new DataTable("tblRelations");
			relTbl.Columns.Add("ID", typeof(int));
			Data.ForEach(d => relTbl.Rows.Add(d));

			SqlConnection con = new SqlConnection(conStr);
			SqlCommand cmd = new SqlCommand("proc_InsertRelations", con);
			cmd.CommandType = System.Data.CommandType.StoredProcedure;

			SqlParameter tbl = cmd.Parameters.AddWithValue("@relTbl", relTbl);
			tbl.SqlDbType = SqlDbType.Structured;
			tbl.TypeName = "dbo.RelationsTbl";

			cmd.Parameters.AddWithValue("@MainID", id);
			cmd.Parameters.AddWithValue("@IDField", idField);
			cmd.Parameters.AddWithValue("@Field", Field);
			cmd.Parameters.AddWithValue("@DataTable", DataTable);
			cmd.Parameters.AddWithValue("@DeletePrevious", true);
			try {
				con.Open(); cmd.ExecuteNonQuery(); { JsonResp.ResponseMsg = ""; }
			}
			catch (Exception ex) { JsonResp.ErrorMsg = ex.Message; }
			finally { con.Close(); }
			return JsonResp;
		}
	}





	public static class ErrorHandler {
		private static string conStr = ConfigurationManager.ConnectionStrings["ClaimsControlConnectionString"].ToString();
		public static string GetAddNewMsg(string[] Data, string[] Fields, string DataObject, SqlException ex) {
			Debug.Print(ex.Message); Debug.Print(ex.Number.ToString());
			MyEventLog.AddWarning("Data:" + String.Join(",", Data) + Environment.NewLine + "Fields:" + String.Join(",", Fields) + Environment.NewLine + "tbl:" + DataObject + Environment.NewLine + "Error: " + ex.Message, "Error on AddNew", 100);
			return GetMsgFromDb(ex.Message, ex.Number, DataObject, Data, Fields);
		}

		public static string GetEditMsg(Int32 id, string[] Data, string[] Fields, string DataObject, SqlException ex) {
			Debug.Print(ex.Message); Debug.Print(ex.Number.ToString());
			MyEventLog.AddWarning("Data:" + String.Join(",", Data) + Environment.NewLine + "Fields:" + String.Join(",", Fields) + Environment.NewLine + "tbl:" + DataObject + Environment.NewLine + "Error: " + ex.Message, "Error on Edit", 101);
			return GetMsgFromDb(ex.Message, ex.Number, DataObject, Data, Fields);
		}

		public static string GetDeleteMsg(Int32 id, string DataObject, SqlException ex) {
			Debug.Print(ex.Message); Debug.Print(ex.Number.ToString());
			MyEventLog.AddWarning("id:" + id + ", tbl:" + DataObject + Environment.NewLine + "Error: " + ex.Message, "Error on Delete", 102);
			return GetMsgFromDb(ex.Message, ex.Number, DataObject, null, null, id);
		}
		private static string GetMsgFromDb(string ErrMsg, int ErrNo, string tbl, string[] Data, string[] Fields, int id = 0){
			string Reference = "", dublicate = null, appendString="";
			
			if (ErrNo == 2601) {//"IX_tblUsers_Email" "IX_tblAccounts_Email" "IX_tblVehicles_Plate"  //SELECT * FROM sysmessages /547 ForeignKey Violation, 2627 Unique Index/ Primary key Violation
				Reference = GetMatch(1, ErrMsg).Replace("\'", "");
				dublicate = Regex.Match(ErrMsg, @"The duplicate key value is \(([^)]*)\)").Groups[1].Value;
				int index = dublicate.IndexOf(",");
				if (index > 0) { dublicate = dublicate.Substring(0,index); }

				if (Reference == "IX_tblUsers_Email") { if (UserData.GetUserByEmail(dublicate) == null) { Reference += "_anotherAccount"; } }
				else if (Reference == "IX_tblVehicles_Plate") {
					using (dbDataContext db = new dbDataContext(conStr)) {
						var Vehicle = (from v in db.tblVehicles where v.Plate==dublicate && v.AccountID==UserData.AccountID select v).FirstOrDefault();
						if (Vehicle.EndDate == null) { appendString = " Transporto priemonė aktyviai naudojama."; } else { appendString = " Transporto priemonė šiuo metu nenaudojama."; };
					}
				}
			}

			else if (ErrNo == 2627) { Reference = GetMatch(0, ErrMsg).Replace("\'", ""); }
			else { MyEventLog.AddException("Msg: " + ErrMsg, "Other err No:" + ErrNo, 182); }

			
			using (dbDataContext db = new dbDataContext(conStr)) {
				var Msg = (from m in db.tblUserMsgs where m.LanguageID == UserData.User.LanguageID && m.ReferenceKey == Reference select m).FirstOrDefault();
				if (Msg != null) { ErrMsg = Msg.Msg; if (dublicate != null) { ErrMsg = ErrMsg.Replace("{{}}", dublicate); } }
				else MyEventLog.AddException("Reference:" + Reference + Environment.NewLine + "Language: " + UserData.User.LanguageID, "Msg Refference not found:" + Reference, 202);
			}
			return (ErrMsg + appendString);
		}

		private static string GetMatch(int No, string input) {
			string pattern = "\'[^\'\r]*\'", ret = ""; int i = 0;
			Match match = Regex.Match(input, pattern);
			while (match.Success) {
				Debug.Print(match.Value);
				if (i == No) { ret = match.Value; }
				i++; match = match.NextMatch();
			}
			return ret;
		}
		private static string GetField(string Field, string[] Data, string[] Fields) {
			string value = "";
			for (int i = 0; i < Fields.Length; i++) {
				if (Field == Fields[i]) { value = Data[i]; break; }
			}
			return value;
		}
	}

}