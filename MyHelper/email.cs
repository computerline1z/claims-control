using System;
using System.Text;
using RazorTemplates.Core;
using System.IO;
using System.Reflection;
using System.Net.Mail;
using System.Text.RegularExpressions;
using System.Threading;
using System.Linq;

//Razor templates - https://github.com/volkovku/RazorTemplates

namespace MyHelper
{
    /*public class mail {
        public string render() {
            //string assemblyFolder = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
            //string xmlFileName = Path.Combine(assemblyFolder, "AggregatorItems.xml");
            var template = Template.Compile("Hello @Model.Name!");
            string rez = template.Render(new { UserName = "Jonas Antanaitis", ClaimTypeName="Kasko", AccidentDate="2011-05-06", AccidentCountry="Ispanija", PlateNo="BRU641", ClaimNo="15-01" });
            MyEventLog.AddEvent(rez, "Test rez", 1000);
            return rez;
		
    }}*/
    public static class Logger
    {
        public static string getProps(object obj)
        {
            string ret = "Object:" + Environment.NewLine;
            foreach (var prop in obj.GetType().GetProperties(BindingFlags.Instance | BindingFlags.Public))
            {
                //Console.WriteLine("Name: {0}, Value: {1}", prop.Name, prop.GetValue(obj, null));
                ret += String.Format("{0}={1}{2}", prop.Name, prop.GetValue(obj, null), Environment.NewLine);
            }
            return ret;
        }
    }

    public static class email
    {

        public static bool sendFromTemplate(string fileName, object model, string[] emails, string tmplFolder = null)
        {
            bool OK = false; string filePath;//servisui imam iš jo settingu
            if (tmplFolder == null) { filePath = AppDomain.CurrentDomain.BaseDirectory + "Resource\\MailTmpl"; } else { filePath = tmplFolder; }
            string shorLang = (Thread.CurrentThread.CurrentUICulture.Name.Length > 2) ? "LT" : Thread.CurrentThread.CurrentUICulture.Name.ToUpper();
            filePath += "\\" + shorLang + "\\" + fileName + ".cshtml";//  string Lang = Thread.CurrentThread.Name turi but LT pas mus!!!
            if (File.Exists(filePath))
            {
                try
                {
                    string tmpl = File.ReadAllText(filePath);
                    Regex rgx = new Regex(@"{{.*}}");
                    string subject = Regex.Match(tmpl, @"{{.*}}").Value.Replace("{{subject='", "").Replace("'}}", "");
                    tmpl = rgx.Replace(tmpl, "");
                    var template = Template.Compile(tmpl);
                    MyEventLog.AddEvent(Logger.getProps(model), "sendFromTemplate.object." + fileName, 1100);
                    string body = template.Render(model);
                    MyEventLog.AddEvent(body, "body for mail OK", 1100);
                    OK = true;
                    foreach (string email in emails)
                    {
                        if (!SendMailMessage(email, null, null, subject, body)) { OK = false; }
                    }
                    MyEventLog.AddEvent(body, "send mail OK", 1100);
                }
                catch (Exception ex)
                {
                    MyEventLog.AddException("fileName:" + fileName + Environment.NewLine + ex.Message, "Error in sendFromTemplate", 1100);
                }
            }
            else
            {
                MyEventLog.AddException("Wrong template filePath in raizor.email:" + Environment.NewLine + filePath, "Wrong template", 2000);
            }
            return OK;
        }

        public static bool SendMailMessage(string to, string bcc, string cc, string subject, string body)
        {
            bool ok = false;
            if (body.Contains("81.7.123.25:82")) { body = body.Replace("81.7.123.25:82", "ccs2.claimscontrol.com"); }
            else if (body.Contains("81.7.123.25:86")) { body = body.Replace("81.7.123.25:86", "ccs.claimscontrol.com"); }
            else if (body.Contains("127.0.0.1")) { body = body.Replace("127.0.0.1", "localhost"); }

            var mMailMessage = new MailMessage()
            {
                Subject = subject,
                Body = Regex.Replace(body, @"<(.|\n)*?>", string.Empty),
                IsBodyHtml = false,//true,
                Priority = MailPriority.Normal,
                From = new MailAddress("no-reply@claimscontrol.com", "ClaimsControl"),
                BodyEncoding = Encoding.UTF8,
                SubjectEncoding = Encoding.UTF8
            };

            //AlternateView plainView = AlternateView.CreateAlternateViewFromString(Regex.Replace(body, @"<(.|\n)*?>", string.Empty), null, "text/plain");

            body = "<!DOCTYPE html><HTML><HEAD><META http-equiv=Content-Type content=\"text/html; charset=utf-8\"></HEAD><BODY>"
                + body + "</BODY></HTML>";
            AlternateView htmlView = AlternateView.CreateAlternateViewFromString(body, null, "text/html");
            mMailMessage.AlternateViews.Add(htmlView);

            #region MyRegion
            mMailMessage.To.Add(new MailAddress(to));
            if (!String.IsNullOrEmpty(bcc))
                mMailMessage.Bcc.Add(new MailAddress(bcc));
            if (!String.IsNullOrEmpty(cc))
                mMailMessage.CC.Add(new MailAddress(cc));

            var mSmtpClient = new SmtpClient();
            string msg = "Subject:" + subject + Environment.NewLine;
            msg += "body:" + body + Environment.NewLine;
            msg += "to:" + to + Environment.NewLine;
            msg += "Host:" + mSmtpClient.Host.ToString() + Environment.NewLine;
            msg += "Port:" + mSmtpClient.Port.ToString() + Environment.NewLine;
            #endregion
            try { mSmtpClient.Send(mMailMessage); }
            catch (Exception e)
            {
                MyEventLog.AddException(e.Message + Environment.NewLine + msg, "SendMail ", 70);
                //throw e;
            }
            return ok;
        }
    }
}
