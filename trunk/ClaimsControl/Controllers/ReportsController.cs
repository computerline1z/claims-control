using System.Web.Mvc;
using CC.Models;
using CC.Classes;
using System.Diagnostics;
using System.IO;
using System.Web.Caching;
using System;
using System.Web;
using ClosedXML.Excel;
using MyHelper;

namespace ClaimsControl.Controllers {

	[Authorize]
	public class ReportsController : ToStringController {
		[HttpPost]
		public JsonResult Main(string ver, string name) {
			Repositories_Report acc = new Repositories_Report();

			//Action = "claimsList";
			//Debug.Print(Request.ToString());
			//Debug.Print(HttpContext.Request.Params.ToString());
			//CC.Classes.HttpParameters pars = new HttpParameters(HttpContext.Request.Params.ToString());

			//string currentVer = "6"; bool tmp = false; if (ver != currentVer) tmp = true; ver = currentVer;
			//tmp = true;
			return Json(
				new {
					ver = ver,
					//jsonObj ir tmp pavadinimai bus name, pvz "rep_claimsList"
					jsonObj = new { obj = acc.GetJSON_Reports(name) }//,
					//templates = (tmp) ? new {
					//   tmpRep = RenderPartialViewToString("Reports/" + name)
					//} : new {
					//   tmpRep = "",
					//}
				}
			);
		}
		//public ActionResult ShowFileFNdlNm(string id) {
		//   string mp = Server.MapPath("~/Content/" + id);
		//   return File(mp, "text/plain", id);
		//}
		//public ActionResult Image(string id) {
		//   var dir = Server.MapPath("/Images");
		//   var path = Path.Combine(dir, id + ".jpg");
		//   return base.File(path, "image/jpeg");
		//}
		//public ActionResult MyFile(string MetaValue, int OrganizationId = 0) {
		//   //OrganizationUsersDataContext OrgMeta = new OrganizationUsersDataContext();
		//   JobsRepository JobsRespository = new JobsRepository();
		//   string CvPath = JobsRespository.GetCvPath();
		//   var FilePathForOrganization = OrgMeta.OrganizationMetas.FirstOrDefault(m => m.bit_IsDeletable == true && m.int_OrganizationId == OrganizationId && m.vcr_MetaKey == "PhysicalPath");
		//   string CompletePhysicalPath = FilePathForOrganization.vcr_MetaValue + CvPath + MetaValue;
		//   return File(@CompletePhysicalPath, "");
		//}
		//public ActionResult Download() {
		//   var document = "...";
		//   var cd = new System.Net.Mime.ContentDisposition {
		//      // for example foo.bak
		//      FileName = document.FileName,
		//      // always prompt the user for downloading, set to true if you want 
		//      // the browser to try to show the file inline
		//      Inline = false,
		//   };
		//   Response.AppendHeader("Content-Disposition", cd.ToString());
		//   return File(document.Data, document.ContentType);
		//}
	}
	public class DownloadController : Controller {
		//private readonly HtmlViewRenderer htmlViewRenderer;
		//private readonly StandardPdfRenderer standardPdfRenderer;
		//public PdfViewController() {
		//   this.htmlViewRenderer = new HtmlViewRenderer();
		//   this.standardPdfRenderer = new StandardPdfRenderer();
		//}

		//protected ActionResult File(string pageTitle, string viewName, object model) {
		//   // Render the view html to a string.
		//   string htmlText = this.htmlViewRenderer.RenderViewToString(this, viewName, model);

		//   // Let the html be rendered into a PDF document through iTextSharp.
		//   byte[] buffer = standardPdfRenderer.Render(htmlText, pageTitle);

		//   // Return the PDF as a binary stream to the client.
		//   return new BinaryContentResult(buffer, "application/pdf"); JsonResult
		//}
		[HttpPost]
		public JsonResult makeReport(string type, string reportName, string[] Fields, int[] ID) {//, string sortedField, bool asc
			//type -xls or pdf
			string html = Reports.GetHTML(type, reportName, Fields, ID);
			if (type == "pdf") { HttpRuntime.Cache.Insert(reportName + "." + type, Reports.GetPdfFromHtml(html), null, System.DateTime.Now.AddMinutes(3), Cache.NoSlidingExpiration); }
			else { HttpRuntime.Cache.Insert(reportName + "." + type, Reports.GetXlsFromHtml(html), null, System.DateTime.Now.AddMinutes(3), Cache.NoSlidingExpiration); };//xls
			return Json(new { ok = true });
		}
		/*[HttpPost]
		public ActionResult ReportFile(string type, string reportName, string[] Fields, int[] id, string sortedField, bool asc) {
			
			var ms = new MemoryStream(pdf);
			//return new FileStreamResult(ms, "application/pdf");
			//return File(pdf, System.Net.Mime.MediaTypeNames.Application.Octet, "example");
			var fileStream = System.IO.File.Create("C:\\Path\\To\\File");
			 
	
			return Json(new{ok= true});
		}
		*/

		public ActionResult GetFile(string id) {
			MemoryStream ms = CreateExcelFile();
			// return the filestream
			// Rewind the memory stream to the beginning
			ms.Seek(0, SeekOrigin.Begin);
			string filename = "DownloadedExcelFile.xlsx";
			return File(ms, @"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml", filename);
		}

		public MemoryStream CreateExcelFile() {
			try {
				// Create an Excel Workbook
				XLWorkbook wb = new XLWorkbook();
				// Add the "Product Index" worksheet
				//IXLWorksheet sheet = workbook.Worksheets.Add("New Worksheet");
				// Add your data ...
				wb.Worksheets.Add("Sample").Cell(1, 1).SetValue("Hello World");

				// All done
				MemoryStream ms = new MemoryStream();
				wb.SaveAs(ms);
				return ms;
			}
			catch (Exception e) {
				string errmsg = String.Format("Failed to create Excel file: {0}", e.Message);
				MyEventLog.AddEvent(errmsg, "CreateExcelFile", 104);
				throw new Exception(errmsg, e);
			}
		}





		public FileResult GetFile2(string id) {//fileName
			//byte[] fileBytes = (byte[])HttpRuntime.Cache.Get(id);  //Reports.GetPdfFromHtml(html);
			var file = HttpRuntime.Cache.Get(id);
			//return File(fileBytes, System.Net.Mime.MediaTypeNames.Application.Octet, id);
			//Reports.createExcel();
			if (Path.GetExtension(id) == ".pdf") { return File((byte[])file, System.Net.Mime.MediaTypeNames.Application.Octet, id); }
			else {
				//HttpContext.Response.ContentType = "application/vnd.ms-excel";
				//byte[] buffer = System.Text.Encoding.UTF8.GetBytes((string)file);
				//return File(buffer, System.Net.Mime.MediaTypeNames.Application.Octet, id.Replace("xls", "csv"));//.Replace("xls","xlsx")

				var wb = new XLWorkbook();
				wb.Worksheets.Add("Sample").Cell(1, 1).SetValue("Hello World");
				//var ws = wb.Worksheets.Add("Contacts");

				//// Title
				//ws.Cell("B2").Value = "Contacts";

				//// First Names
				//ws.Cell("B3").Value = "FName";
				//ws.Cell("B4").Value = "John";
				//ws.Cell("B5").Value = "Hank";
				//ws.Cell("B6").Value = "Dagny";

				//// Last Names
				//ws.Cell("C3").Value = "LName";
				//ws.Cell("C4").Value = "Galt";
				//ws.Cell("C5").Value = "Rearden";
				//ws.Cell("C6").Value = "Taggart";

				//// Boolean
				//ws.Cell("D3").Value = "Outcast";
				//ws.Cell("D4").Value = true;
				//ws.Cell("D5").Value = false;
				//ws.Cell("D6").Value = false;

				//// DateTime
				//ws.Cell("E3").Value = "DOB";
				//ws.Cell("E4").Value = new DateTime(1919, 1, 21);
				//ws.Cell("E5").Value = new DateTime(1907, 3, 4);
				//ws.Cell("E6").Value = new DateTime(1921, 12, 15);

				//// Numeric
				//ws.Cell("F3").Value = "Income";
				//ws.Cell("F4").Value = 2000;
				//ws.Cell("F5").Value = 40000;
				//ws.Cell("F6").Value = 10000;

				//// From worksheet
				//var rngTable = ws.Range("B2:F6");
				//var rngHeaders = rngTable.Range("A2:E2"); // The address is relative to rngTable (NOT the worksheet)
				//rngHeaders.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
				//rngHeaders.Style.Font.Bold = true;
				//rngHeaders.Style.Fill.BackgroundColor = XLColor.Aqua;
				//ws.Columns(2, 6).AdjustToContents();

				byte[] fileContent; MemoryStream memoryStream = new MemoryStream();
				wb.SaveAs(memoryStream);
				fileContent = ReadFully(memoryStream);
				return File(fileContent, System.Net.Mime.MediaTypeNames.Application.Octet, id);// 
				//HttpContext.Response.End();"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"


				//XLWorkbook wb = new XLWorkbook();
				//var ws = wb.Worksheets.Add(sheetName);
				//ws.Cell(2, 1).InsertTable(data);
				//HttpContext.Current.Response.Clear();
				//HttpContext.Current.Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
				//HttpContext.Current.Response.AddHeader("content-disposition", String.Format(@"attachment;filename={0}.xlsx", sheetName.Replace(" ", "_")));

				//using (MemoryStream memoryStream = new MemoryStream()) {
				//   wb.SaveAs(memoryStream);
				//   memoryStream.WriteTo(HttpContext.Current.Response.OutputStream);
				//   memoryStream.Close();
				//}


				//return File(virtualFilePath, System.Net.Mime.MediaTypeNames.Application.Octet, Path.GetFileName(virtualFilePath));
				//return File(Path.Combine(@"c:\path", fileFromDB.FileNameOnDisk), MimeMapping.GetMimeMapping(fileFromDB.FileName), fileFromDB.FileName);

				//FileContentResult File(byte[] fileContents, string contentType)
				//FileContentResult File(byte[] fileContents, string contentType, string fileDownloadName)
				//FileStreamResult File(Stream fileStream, string contentType)
				//FileStreamResult File(Stream fileStream, string contentType, string fileDownloadName)
				//FilePathResult File(string fileName, string contentType)
				//FilePathResult File(string fileName, string contentType, string fileDownloadName)
			}

			//return File((byte[])file, System.Net.Mime.MediaTypeNames.Application.Octet, id);
		}

		byte[] GetReportFile(string fileName) {
			string fullPathName = Path.Combine(UserData.GetFullReportsPath, fileName);
			System.IO.FileStream fs = System.IO.File.OpenRead(fullPathName);
			byte[] data = new byte[fs.Length];
			int br = fs.Read(data, 0, data.Length);
			if (br != fs.Length)
				throw new System.IO.IOException(fullPathName);
			return data;
		}

		private static byte[] ReadFully(Stream input) {
			byte[] buffer = new byte[16 * 1024];
			using (MemoryStream ms = new MemoryStream()) {
				int read;
				while ((read = input.Read(buffer, 0, buffer.Length)) > 0) {
					ms.Write(buffer, 0, read);
				}
				return ms.ToArray();
			}
		}
	}
}