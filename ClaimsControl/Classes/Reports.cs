using System.IO;
using System.Web.Mvc;
using System.Web;
using System.Diagnostics;
using System;
using System.Text;
using CC.SQLHelper;

namespace CC.Classes {
	/// <summary>
	/// An ActionResult used to send binary data to the browser.
	/// </summary>
	public class BinaryContentResult : ActionResult {
		private readonly string contentType;
		private readonly byte[] contentBytes;

		public BinaryContentResult(byte[] contentBytes, string contentType) {
			this.contentBytes = contentBytes;
			this.contentType = contentType;
		}

		public override void ExecuteResult(ControllerContext context) {
			var response = context.HttpContext.Response;
			response.Clear();
			response.Cache.SetCacheability(HttpCacheability.Public);
			response.ContentType = this.contentType;

			using (var stream = new MemoryStream(this.contentBytes)) {
				stream.WriteTo(response.OutputStream);
				stream.Flush();
			}
		}
	}



	public class Reports {
		public static string GetHTML(string type, string reportName, string[] Fields, int[] ID) {
			StringBuilder strBuilder = Readers.ReportTable(reportName, Fields, ID);
			return strBuilder.ToString();
		}

		public static byte[] GetPdfFromHtml(string html) {//byte[]
			Process p=null;
			ProcessStartInfo psi = new ProcessStartInfo();
			//psi.FileName = HttpContext.Current.Server.MapPath("~/Library")+"//wkhtmltopdf.exe";
			psi.FileName = "C:\\Program Files (x86)\\wkhtmltopdf\\wkhtmltopdf.exe";
			psi.WorkingDirectory = Path.GetDirectoryName(psi.FileName);

			// run the conversion utility
			psi.UseShellExecute = false;
			psi.CreateNoWindow = true;
			psi.RedirectStandardInput = true;
			psi.RedirectStandardOutput = true;
			psi.RedirectStandardError = true;

			psi.Arguments = "-q -n --disable-smart-shrinking --orientation Portrait --outline-depth 0 --page-size A4 --encoding utf-8 - -";
			string path = UserData.GetFullReportsPath;
			Directory.CreateDirectory(path);
			//psi.Arguments = "-q -n - " + path + "proba.pdf";
			try { p = Process.Start(psi); }
			catch (Exception ex) { MyEventLog.AddEvent("Could not start process./n " + ex.Message, "wkhtmltopdf.exe", 102); }

			try {
				StreamWriter stdin = new StreamWriter(p.StandardInput.BaseStream, Encoding.UTF8);
				using (stdin) { stdin.AutoFlush = true; stdin.Write(html); }
				//using (StreamWriter stdin = p.StandardInput) { stdin.AutoFlush = true; stdin.Write(source); }
				byte[] buffer = new byte[32768], file;
				using (var ms = new MemoryStream()) {
					while (true) {
						int read = p.StandardOutput.BaseStream.Read(buffer, 0, buffer.Length);
						if (read <= 0)
							break;
						ms.Write(buffer, 0, read);
					}
					file = ms.ToArray();
				}
				p.StandardOutput.Close();
				p.WaitForExit(60000);// wait or exit

				// read the exit code, close process
				int returnCode = p.ExitCode;
				p.Close();

				if (returnCode == 0)
					return file;
				else
					MyEventLog.AddEvent("Could not create PDF, returnCode:" + returnCode, "Could not create PDF", 101);
			}
			catch (Exception ex) {
				MyEventLog.AddEvent(ex.Message, "Could not create PDF", 102);
			}
			finally {
				p.Close(); p.Dispose();
			}
			return null;
		}

		public static string GetXlsFromHtml(string html) {
			//Response.ContentType = "application/force-download";
			//Response.AddHeader("content-disposition", "attachment; filename=Print.xls");


			//return @"<html xmlns:x=""urn:schemas-microsoft-com:office:excel"">
			//<head><META http-equiv=""Content-Type"" content=""text/html; charset=utf-8""></head>" + html;

			return @"Year;Make;Model;Description;Price" + Environment.NewLine + @"1997;Ford;E350;""ac; abs; moon"";3000.00" + Environment.NewLine + @"1997;Ford;E350;""Šalia kelio karčema"";3000.00" + Environment.NewLine;

			//<!--[if gte mso 9]><xml>
			//<x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Report Data</x:Name><x:WorksheetOptions>
			//<x:Print><x:ValidPrinterInfo/></x:Print>
			//</x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook>
			//</xml><![endif]--> " + html + "</head>";


			//Response.flush();
		}

	}


}