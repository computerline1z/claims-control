using System;
using System.IO;
using System.Net.Mail;
using System.Web;
using CC.Classes;
using System.Web.Security;

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
				From = new MailAddress("support@claimscontrol.com", "ClaimsControl")
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
				MyEventLog.AddException(e.Message,"Err in SendMailMessage",69);
				//mSmtpClient.Send(mMailMessage);
			}

      }

		//public static string BuildMailMessage(HttpContextBase context, string language,
		//                                      string paskyra, string email, string password,
		//                                      string homeUrl, string bodyName) {
		public static void SendMail_SetUrl(string email, string tmplName, string title) {
			string body = UserData.GetMailBody_SetUrl(email, tmplName);
			if (body != null) { SendMailMessage(email, String.Empty, String.Empty, title, body); }
			else MyEventLog.AddException(String.Format("Nepavyko suformuot laiško paštui '{0}'.", email), "Err in MailHelper.SendMail", 69);
      }
   }
}