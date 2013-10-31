using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;
using System.Diagnostics;
using System.Web;
using System.Data;
using System.Configuration;
using System.Threading.Tasks;

namespace MyHelper {
	//class utils {
	//}
	public class MyEventLog {
		private static void CreateSource(string src, EventLog ELog) {
			try {
				if (!EventLog.SourceExists(src)) { EventLog.CreateEventSource(src, "ClaimsControl"); }
				ELog.Source = src;
			}
			catch (Exception ex) {
				System.Diagnostics.Debug.Print(ex.Message);
			}

		}
		public static void AddEvent(string Message, string src, int eventID) {
			try {
				EventLog EL = new EventLog(); CreateSource(src, EL);
				if (EL.Source.Length > 0) {
					EL.WriteEntry(Message, EventLogEntryType.Information, eventID, 1);
				}
			}
			catch { }

		}

		public static void AddException(string Message, string src, int eventID) {
			try {
				EventLog EL = new EventLog(); CreateSource(src, EL);
				EL.WriteEntry(Message, EventLogEntryType.Error, eventID, 1);
				sendMail("saulius.bruklys@gmail.com","Exception:" + src, Message);
			}
			catch { }
		}
		public static void AddWarning(string Message, string src, int eventID) {
			try {
				EventLog EL = new EventLog(); CreateSource(src, EL);
				EL.WriteEntry(Message, EventLogEntryType.Warning, eventID, 1);
				sendMail("saulius.bruklys@gmail.com", "Warning:" + src, Message);
			}
			catch { }
		}
		public static void sendMail(string to,string subject, string body){
			new Task(() => { email.SendMailMessage(to, null, null, subject, body); }).Start();
		}
	}

	#region Utils, Extensions

	internal static class utils {
		private static Regex _isNumber = new Regex(@"^[-+]?[0-9]*\.?[0-9]+$");
		private static Regex _isInteger = new Regex(@"^\d+$");

		public static bool IsInteger(string theValue) {
			Match m = _isInteger.Match(theValue);
			return m.Success;
		}

		public static string EncodeJsString(string s) {
			StringBuilder sb = new StringBuilder();
			//sb.Append("\"");
			foreach (char c in s) {
				switch (c) {
					//case '\'':
					//    sb.Append("\\\""); break;
					case '\"':
						sb.Append("\\\""); break;
					case '\\':
						sb.Append("\\\\"); break;
					case '\b':
						sb.Append("\\b"); break;
					case '\f':
						sb.Append("\\f"); break;
					case '\n':
						sb.Append("\\n"); break;
					case '\r':
						sb.Append("\\r"); break;
					case '\t':
						sb.Append("\\t"); break;
					default:
						//int i = (int)c;  - pagaidina lietuviskas raides
						//if (i < 32 || i > 127)
						//{ sb.AppendFormat("\\u{0:X04}", i); }
						//else
								{ sb.Append(c); }

								break;
				}
			}
			//sb.Append("\"");
			return sb.ToString();
		}

		public static bool IsNumber(object theValue) {
			Match m = _isNumber.Match(theValue.ToString());
			return m.Success;
		}

		public static DataTable convertToTbl(int[] arr) {
			DataTable relTbl = new DataTable("tbl");
			relTbl.Columns.Add("ID", typeof(int));
			arr.ForEach(d => relTbl.Rows.Add(d));
			return relTbl;
		}
		public static DataTable convertToTbl(string[] arr) {
			DataTable relTbl = new DataTable("tbl");
			relTbl.Columns.Add("Name", typeof(string));
			arr.ForEach(d => relTbl.Rows.Add(d));
			return relTbl;
		}
	}

	public static class MyExtensions {

		public static bool In(this object o, IEnumerable<object> c) {
			foreach (object i in c) { if (i.Equals(o)) return true; }
			return false;
		}

		//Naudojamas Repositories.cs getJson
		public static List<T> ListOfType<T>(this T type) {
			return new List<T>();
		}

		//public static void AddItem<T>(this List<T> List, T obj)
		//{
		//    List.Add(obj);
		//}
		//public static string toJson(this IEnumerable<object> sequence)
		//{
		//    StringBuilder sb = new StringBuilder();
		//    foreach (var item in sequence)
		//    {
		//        sb.Append(item.toString());
		//    }
		//    return sb.ToString();
		//}


		//public static IEnumerable<T> Where<T>(this IEnumerable<T> sequence, Predicate<T> predicate) {
		//   foreach (T item in sequence) {
		//      if (predicate(item)) {
		//         yield return item;
		//      }
		//   }
		//}

		public static void ForEach<T>(this IEnumerable<T> list, Action<T> action) {
			foreach (var item in list) action(item);
		}

		#region Stringbuilder

		public static void AppendCollection<TItem>(this StringBuilder builder, IEnumerable<TItem> items, Func<TItem, string> valueSelector) {
			foreach (TItem item in items) { builder.Append(valueSelector(item)); }
		}

		public static void AppendCollection<TItem>(this StringBuilder builder, IEnumerable<TItem> items) { AppendCollection(builder, items, x => x.ToString()); }

		public static void AppendCollection1<TItem>(this StringBuilder builder, IEnumerable<TItem> items, Func<TItem, string> GetString) {
			foreach (TItem item in items) { builder.Append(GetString(item)); }
		}

		public static void AppendNodeCollection(this StringBuilder builder, IEnumerable<string> items, string NodeName) {
			builder.Append("<"); builder.Append(NodeName); builder.Append(">");
			foreach (string item in items) { builder.Append(item); }
			builder.Append("</"); builder.Append(NodeName); builder.Append(">");
		}

		//public static void AppendNodeCollectionFromDict(this StringBuilder builder, MyDictionary<string, string> items, string NodeName)
		//{
		//    builder.Append("<"); builder.Append(NodeName); builder.Append(" ");
		//    foreach (var item in items)
		//    { builder.Append(item.Key); builder.Append("=\""); builder.Append(item.Value); builder.Append("\""); }
		//    builder.Append("/>");
		//}

		public static void AppendNode(this StringBuilder builder, string item, string NodeName) {
			builder.Append("<"); builder.Append(NodeName); builder.Append(">");
			builder.Append(item);
			builder.Append("</"); builder.Append(NodeName); builder.Append(">");
		}

		#endregion Stringbuilder

		#region String

		public static bool IsEmpty(this string o) {
			if (o != null) { if (o.Length > 0) return false; }
			return true;
		}

		public static bool IsInteger(this string s) {
			Regex regex = new Regex(@"^\d+$");
			return regex.IsMatch(s);
		}

		public static bool IsDate(this string s) {
			try { System.DateTime.Parse(s); return true; }
			catch (Exception) { return false; }
		}

		public static bool IsValidEmailAddress(this string s) {
			Regex regex = new Regex(@"^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$");
			return regex.IsMatch(s);
		}

		public static int toInt(this string s, int DefaultVal) {
			try { DefaultVal = Convert.ToInt32(s); }
			catch (Exception) { ;}
			return DefaultVal;
		}

		#endregion String
	}

	public static class FileHelper {

		public static StringBuilder GetBuilder(string FullFPath) {
			StringBuilder strB;
			StreamReader reader = new StreamReader(FullFPath);
			strB = new StringBuilder(reader.ReadToEnd());
			reader.Close();
			return strB;
		}

		public static string GetString(string FullFPath) {
			StreamReader reader = new StreamReader(FullFPath);
			string strB = reader.ReadToEnd();
			reader.Close();
			return strB;
		}

		public static void WriteStr(string Body, string NewFileFullFPath) {
			StreamWriter writer = new StreamWriter(NewFileFullFPath);
			writer.Write(Body);
			writer.Close();
		}

		public static void InsertXMLtoRoot(string BodyToAppend, string FileFullFPath) {
			string fileContents = "";
			if (!File.Exists(FileFullFPath)) { fileContents = "<?xml version=\"1.0\" encoding=\"utf-8\"?><Log>" + BodyToAppend + "</Log>"; }
			else {
				using (TextReader reader = File.OpenText(FileFullFPath)) { fileContents = reader.ReadToEnd(); reader.Close(); }
				fileContents = System.Text.RegularExpressions.Regex.Replace(fileContents, "</Log>$", BodyToAppend + "</Log>");
			}
			using (TextWriter sw = File.CreateText(FileFullFPath)) { sw.Write(fileContents); sw.Close(); }
		}

		public static void WriteBuilder(StringBuilder StrB, string NewFileFullFPath) {
			StreamWriter writer = new StreamWriter(NewFileFullFPath);
			writer.Write(StrB.ToString());
			writer.Close();
		}
	}

	#endregion Utils, Extensions


}