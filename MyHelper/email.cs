using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using RazorTemplates.Core;
using System.Configuration;
using System.IO;
using System.Reflection;
using Newtonsoft.Json;
using System.Net.Mail;
using System.Text.RegularExpressions;

//Razor templates - https://github.com/volkovku/RazorTemplates

namespace MyHelper {
	/*public class mail {
		public string render() {
			//string assemblyFolder = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
			//string xmlFileName = Path.Combine(assemblyFolder, "AggregatorItems.xml");
			var template = Template.Compile("Hello @Model.Name!");
			string rez = template.Render(new { UserName = "Jonas Antanaitis", ClaimTypeName="Kasko", AccidentDate="2011-05-06", AccidentCountry="Ispanija", PlateNo="BRU641", ClaimNo="15-01" });
			MyEventLog.AddEvent(rez, "Test rez", 1000);
			return rez;
		
	}}*/
	public static class Logger {
		public static string getProps(object obj) {
			string ret = "Object:" + Environment.NewLine;
			foreach (var prop in obj.GetType().GetProperties(BindingFlags.Instance | BindingFlags.Public)) {
				//Console.WriteLine("Name: {0}, Value: {1}", prop.Name, prop.GetValue(obj, null));
				ret += String.Format("{0}={1}{2}", prop.Name, prop.GetValue(obj, null), Environment.NewLine);
			}
			return ret;
		}
	}

	public static class email {

		public static bool sendFromTemplate(string fileName, string language, object model, string[] emails) {
			bool OK = false; string filePath = ConfigurationManager.AppSettings.Get("pathToMailTmpl");//servisui imam iš jo settingu
			if (filePath==null){filePath=AppDomain.CurrentDomain.BaseDirectory + "App_Data\\MailTmpl";}
			filePath += "\\"+language + "\\" + fileName + ".cshtml";
			if (File.Exists(filePath)) {
				try {
					string tmpl = File.ReadAllText(filePath);
					Regex rgx = new Regex(@"{{.*}}");
					string subject = Regex.Match(tmpl, @"{{.*}}").Value.Replace("{{subject='", "").Replace("'}}", "");
					tmpl = rgx.Replace(tmpl, "");
					var template = Template.Compile(tmpl);
					MyEventLog.AddEvent(Logger.getProps(model), "sendFromTemplate.object." + fileName, 1100);
					string body = template.Render(model);
					MyEventLog.AddEvent(body, "body for mail OK", 1100);
					OK = true;
					foreach (string email in emails) {
						if (!SendMailMessage(email, null, null, subject, body)) { OK = false; }
					}
					MyEventLog.AddEvent(body, "send mail OK", 1100);
				}
				catch (Exception ex) {
				   MyEventLog.AddException("fileName:"+fileName+Environment.NewLine+ ex.Message, "Error in sendFromTemplate", 1100);
				}
			}
			else {
				MyEventLog.AddException("Wrong template filePath in raizor.email:" + Environment.NewLine + filePath, "Wrong template", 2000);
			}
			return OK;
		}





		public static bool SendMailMessage(string to, string bcc, string cc, string subject, string body) {
			bool ok = false;
			var mMailMessage = new MailMessage() {
				Subject = subject,
				Body = body,
				IsBodyHtml = true,
				Priority = MailPriority.Normal,
				//From= new MailAddress("zalukontrole@gmail.com", "ClaimsControl")
			};


			mMailMessage.To.Add(new MailAddress(to));
			if (!String.IsNullOrEmpty(bcc))
				mMailMessage.Bcc.Add(new MailAddress(bcc));
			if (!String.IsNullOrEmpty(cc))
				mMailMessage.CC.Add(new MailAddress(cc));

			var mSmtpClient = new SmtpClient();
			mSmtpClient.EnableSsl = true;
			//SmtpClient SmtpServer = new SmtpClient("mail.claimscontrol.com",465);
			////SmtpServer.Port = 465;
			//SmtpServer.EnableSsl = true;
			//SmtpServer.Timeout = 30000;
			//SmtpServer.UseDefaultCredentials = false;
			//SmtpServer.Credentials = new System.Net.NetworkCredential("support@claimscontrol.com", "uD8qfbVJ");


			//SmtpServer.Timeout = 1; fdgd
			//SmtpServer.DeliveryMethod = System.Net.Mail.SmtpDeliveryMethod.Network;
			//mSmtpClient.Send(mMailMessage);

			string msg = "Subject:" + subject + Environment.NewLine;
			msg += "body:" + body + Environment.NewLine;
			msg += "to:" + to + Environment.NewLine;
			msg += "Host:" + mSmtpClient.Host.ToString() + Environment.NewLine;
			msg += "Port:" + mSmtpClient.Port.ToString() + Environment.NewLine;
			//MyEventLog.AddEvent(msg, "Start sending email", 70);

			try {
				mSmtpClient.Send(mMailMessage);
				MyEventLog.AddEvent(msg, "Sending email OK", 70);
				ok = true;
			}
			catch (Exception e) {
				MyEventLog.AddException(e.Message + Environment.NewLine + msg, "SendMail ", 70);
				//throw e;
			}
			return ok;
		}
	}
}
