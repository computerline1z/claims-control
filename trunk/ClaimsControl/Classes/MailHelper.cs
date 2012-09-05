using System;
using System.IO;
using System.Net.Mail;
using System.Web;

//using msOutlook =  Microsoft.Office.Interop.Outlook;

namespace DataModels.DataSources {

   /// <summary>
   /// Summary description for MailHelper
   /// </summary>
   public class MailHelper {

      public MailHelper() {
      }

      /// <summary>
      /// Sends an mail message
      /// </summary>
      /// <param name="from">Sender address</param>
      /// <param name="to">Recepient address</param>
      /// <param name="bcc">Bcc recepient</param>
      /// <param name="cc">Cc recepient</param>
      /// <param name="subject">Subject of mail message</param>
      /// <param name="body">Body of mail message</param>
      public static void SendMailMessage(string to, string bcc, string cc, string subject, string body) {
         var mMailMessage = new MailMessage() {
            Subject = subject,
            Body = body,
            IsBodyHtml = true,
            Priority = MailPriority.Normal,
         };

         mMailMessage.To.Add(new MailAddress(to));
         if (!String.IsNullOrEmpty(bcc))
            mMailMessage.Bcc.Add(new MailAddress(bcc));
         if (!String.IsNullOrEmpty(cc))
            mMailMessage.CC.Add(new MailAddress(cc));

         var mSmtpClient = new SmtpClient();
			mSmtpClient.EnableSsl = true;

			try { mSmtpClient.Send(mMailMessage); }
			catch (Exception e) {
				//MyEventLog.AddException(e);
				
				//mSmtpClient.Send(mMailMessage);
			}

      }

      public static string BuildMailMessage(HttpContextBase context, string language,
                                            string paskyra, string email, string password,
                                            string homeUrl, string bodyName) {
         string relativePath = String.Format("~/App_Data/Mail.{0}.{1}.htm", bodyName, language);
         string absolutePath = context.Server.MapPath(relativePath);
         if (!File.Exists(absolutePath))
            throw new Exception(String.Format("WEP applikacija neturi failo '{0}'.", relativePath));

         string template = File.ReadAllText(absolutePath);

         template = template.Replace("/*paskyra*/", paskyra);
         template = template.Replace("/*email*/", email);
         template = template.Replace("/*homeUrl*/", homeUrl);

         template = template.Replace("/*date*/", DateTime.Now.ToString("yyyy.MM.dd"));
         return template;
      }
   }
}