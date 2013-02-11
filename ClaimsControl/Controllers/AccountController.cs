using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web.Mvc;
using System.Web.Routing;
using System.Web.Security;
using CC.Models;
//using CC.Views.Account;
using DataModels.DataSources;
using Ninject;
using CC.Services.Interfaces;
using CC.Classes;

namespace ClaimsControl.Controllers {

	public class AccountController : Controller {
		private string currentUserIdKey = "{799B06C7-CD4C-4F52-B39C-6E573A3A2626}";
		private IUserManager _userManager;

		public IFormsAuthenticationService FormsService { get; set; }

		[Inject]
		public AccountController(IUserManager userManager) {
			this._userManager = userManager;
		}

		protected override void Initialize(RequestContext requestContext) {
			if (FormsService == null) { FormsService = new FormsAuthenticationService(); }
			//if (MembershipService == null) { MembershipService = new CCMemProvider(); }

			base.Initialize(requestContext);
		}

		// **************************************
		// URL: /Account/LogOn
		// **************************************

		public ActionResult LogOn() {
			return View();
		}

		[HttpPost]
		public ActionResult LogOn(LogOnModel model, string returnUrl, string submitButton) {
			if (ModelState.IsValid) {
				var currentUserName = Membership.GetUserNameByEmail(model.Email);
				if (currentUserName == null) {
					ModelState.AddModelError("", String.Format("{0} - Nežinomas e-paštas.", model.Email));
					return View(model);
				}
				return performLogonAction(model, returnUrl, currentUserName);
			}
			return View(model);
		}

		private ActionResult performLogonAction(LogOnModel model, string returnUrl, string currentUserName) {
			if (String.IsNullOrEmpty(model.Password)) {
				ModelState.AddModelError("", "Būtina nurodyti slaptažodį.");
				return View(model);
			}
			if (ModelState.IsValid) {
				if (Membership.ValidateUser(currentUserName, model.Password)) {
					FormsService.SignIn(model.Email, model.RememberMe);
					if (Url.IsLocalUrl(returnUrl)) {
						return Redirect(returnUrl);
					}
					else {
						return RedirectToAction("Start", "Main");
					}
				}
				else {
					MembershipUser aUser = Membership.GetUser(currentUserName);
					if (!aUser.IsApproved)
						ModelState.AddModelError("", "Paskyra neaktyvuota. " +
							 "Atidarykite registracijos metu gautą laišką ir paspauskite aktyvavimo nuorodą.");
					else if (aUser.IsLockedOut)
						ModelState.AddModelError("", "Jūsų paskyra užblokuota. " +
							 "Kreipkitės į sistemos administratorių.");
					else
						ModelState.AddModelError("", "Neteisingas slaptažodis.");
				}
			}
			return View(model);
		}

		// **************************************
		// URL: /Account/RecoverPassword
		// **************************************
		[HttpGet]
		public ActionResult RecoverPassword() {
			var model = new RecoverPasswordModel();      //(currentUserName);
			return View(model);
		}

		[HttpPost]
		public ActionResult RecoverPassword(RecoverPasswordModel model) {
			if (ModelState.IsValid) {
				string currentUserName = Membership.GetUserNameByEmail(model.Email);
				if (String.IsNullOrEmpty(currentUserName)) {
					ModelState.AddModelError("EMail", String.Format("{0} - Neteisingas pašto addresas.", model.Email));
					return View(model);
				}
				//MembershipUser aUser = Membership.GetUser(currentUserName);
				MailHelper.SendMail_SetUrl(model.Email, "ResetUserPsw", "ClaimsControl sistemos slaptažodžio atnaujinimas");
				//SendPasswordChangedMail(aUser.UserName, model.Email, (Guid)aUser.ProviderUserKey);
				ModelState.AddModelError("", "Laiškas iškeliavo!");
				return View(model);
			}
			ModelState.AddModelError("", "Nežinoma klaida. Susisiekite su sistemos administratorium");
			return View(model);
		}
		[HttpPost]
		public JsonResult RecoverPassword2(string email, string mailTmpl) {//mailTmpl = "ResetUserPsw", "NewUserPsw"
			jsonResponse JsonResp = new jsonResponse { ErrorMsg = "Kita klaida siunčiant slaptažodžio keitimo laišką.", ResponseMsg = "" };
			if (ModelState.IsValid) {
				string UserName = Membership.GetUserNameByEmail(email);
				if (String.IsNullOrEmpty(UserName)) {
					JsonResp.ErrorMsg = String.Format("Pašto adresas {0} nerastas.", email);
				}
				else {
					//MembershipUser aUser = Membership.GetUser(UserName);
					//SendPasswordChangedMail(aUser.UserName, email, (Guid)aUser.ProviderUserKey);
					MailHelper.SendMail_SetUrl(email, "ResetUserPsw", "ClaimsControl sistemos slaptažodžio atnaujinimas");
					JsonResp.ResponseMsg = "Slaptažodžio pakeitimo laiškas išsiųstas."; JsonResp.ErrorMsg = "";
				}
			}
			else {
				JsonResp.ErrorMsg = "Baigėsi prisijungimo laikas. Prašome registruotis iš naujo.";
			}
			return Json(JsonResp);
		}
		//private void SendPasswordChangedMail(string userName, string email, Guid UserId) {
		//   var x = this.HttpContext.Request;
		//   var k=HttpContext.Request;
		//   string url = x.Url.Scheme + @"://" + x.Url.Authority + "/Account/NewPassword/" + UserId.ToString();
		//   string messageBody = MailHelper.BuildMailMessage(this.HttpContext, "lt", userName, email, String.Empty,
		//                                                    url, "template");

		//   MailHelper.SendMailMessage(email, String.Empty, String.Empty, "ClaimsControl slaptažodžio atnaujinimas", messageBody);
		//   MailHelper.SendMail_SetUrl(email, string tmplName, "ClaimsControl slaptažodžio atnaujinimas");

		//}

		// **************************************
		// URL: /Account/LogOff
		// **************************************

		[Authorize]
		public ActionResult LogOff() {
			FormsService.SignOut();

			return RedirectToAction("LogOn", "Account");
		}

		// **************************************
		// URL: /Account/Register
		// **************************************

		public ActionResult Register() {
			ViewBag.LanguageId = this._userManager.GetLanguages();
			return View("Register");
		}

		/// <summary>
		/// Registers new user
		/// Membership.Comments saugo paskyros pavadinima
		/// </summary>
		/// <param name="model"><see cref="RegisterModel"/></param>
		/// <returns>RegisterOK view or existsing view with an error message</returns>
		[HttpPost]
		public ActionResult Register(RegisterModel model) {
			Action<string> showError = delegate(string errorMessage) {
				ModelState.AddModelError("", errorMessage);
				int languageId;
				if (!Int32.TryParse(model.LanguageId, out languageId))
					languageId = 0;
				ViewBag.LanguageId = this._userManager.GetLanguages(languageId);
			};

			if (!model.Accept) {
				showError("Patvirtinkite, kad sutinkate su paslaugos teikimo sutarties sąlygomis");
				return View("Register");
			}
			if (!ModelState.IsValid) {
				showError("Užpildykite būtinus laukus.");
				return View("Register");
			}
			if (Membership.GetUserNameByEmail(model.Email) != null) {
				showError(String.Format("{0} jau užregistruotas sistemoje."));
				return View("Register");
			}

			string passwd = Membership.GeneratePassword(8, 2);

			MembershipCreateStatus status;
			MembershipUser aUser = Membership.CreateUser(model.Email, passwd, model.Email, null, null, false, out status);
			if (status != MembershipCreateStatus.Success) {
				showError(GetErrorMessage(status, model));
				return View("Register");
			}
			else {
				aUser.Comment = model.UserName;
				Membership.UpdateUser(aUser);
				this._userManager.UpdateClientInUsersTable(model.Name, model.Surname, model.Email, model.LanguageId);
				//SendConfirmationMail(model, (Guid)aUser.ProviderUserKey);
				MailHelper.SendMail_SetUrl(model.Email, "NewUserPsw", "Registracija Žalų valdymo sistemoje");
			}
			this.TempData[currentUserIdKey] = aUser.ProviderUserKey.ToString();
			return RedirectToAction("RegisterOK", "Account");
		}

		//private void SendConfirmationMail(RegisterModel model, Guid UserId) {
		//   var x = this.HttpContext.Request;
		//   string url = x.Url.Scheme + @"://" + x.Url.Authority + "/Account/NewPassword/" + UserId.ToString();

		//   string messageBody = MailHelper.BuildMailMessage(this.HttpContext, "lt", model.UserName,
		//                                                    model.Email, String.Empty, url, "template");
		//   MailHelper.SendMailMessage(model.Email, String.Empty, String.Empty, "Registracija Žalų valdymo sistemoje", messageBody);
		//}

		/// <summary>
		/// Return lithuanian error messages.
		/// </summary>
		/// <param name="status"><see cref="MembershipCreateStatus"/></param>
		/// <param name="model"><see cref="RegisterModel"/></param>
		/// <returns></returns>
		private string GetErrorMessage(MembershipCreateStatus status, RegisterModel model) {
			switch (status) {
				case MembershipCreateStatus.DuplicateUserName:
					return String.Format("{0} jau užregistruotas. Pasirinkite kitą el. paštą.", model.Email);

				case MembershipCreateStatus.DuplicateEmail:
					return String.Format("Pašto dėžutė {0} jau užregistruota sistemoje. Panaudokite kitą REALŲ pašto adresą.", model.Email);

				case MembershipCreateStatus.InvalidPassword:
					return "Neteisingas slaptažodis. Sukurkite kitą 6 simbolių kombinaciją.";

				case MembershipCreateStatus.InvalidEmail:
					return String.Format("{0} - neteisingas pašto adreso formatas. Patikrinkite adresą ir įveskite teisingą reikšmę.", model.Email);

				case MembershipCreateStatus.InvalidUserName:
					return String.Format("{0} - neteisingas prisijungimo vardas. Patikrinkite reikšmę ir pakartokite registravimą.", model.Email);

				case MembershipCreateStatus.ProviderError:
					return "MS SQL vartotojų registravimo sistema atmetė jūsų registravimą. Pakartokite registraciją. Pasikartojus klaidai kreipkitės į sistemos administratorių.";

				case MembershipCreateStatus.UserRejected:
					return "Registracija buvo nutraukta. Pakartokite registraciją. Pasikartojus klaidai kreipkitės į sistemos administratorių.";

				default:
					return "Nežinoma sistemos klaida. Pakartokite registraciją. Pasikartojus klaidai kreipkitės į sistemos administratorių.";
			}
		}

		// **************************************
		// URL: /Account/RegisterOK
		// **************************************

		public ActionResult RegisterOK() {
			Guid userId = Guid.Parse((string)this.TempData[currentUserIdKey]);
			MembershipUser aUser = Membership.GetUser(userId);

			var model = new RegisterOKModel() {
				UserId = userId,
				Email = aUser.Email,
				Mailer = "mailto:" + aUser.Email,
			};

			TempData[currentUserIdKey] = userId.ToString();
			return View(model);
		}

		public ActionResult RegisterOK_1(string id) {
			Guid userId = Guid.Parse(id);
			MembershipUser aUser = Membership.GetUser(userId);

			var model = new RegisterOKModel() { UserId = userId, Email = aUser.Email, UserName = aUser.Comment };

			//var x = this.HttpContext.Request;
			//string url = x.Url.Scheme + @"://" + x.Url.Authority + "/Account/NewPassword/" + id;
			//string messageBody = MailHelper.BuildMailMessage(this.HttpContext, "lt", model.UserName,
			//                                                 model.Email, String.Empty, url, "template");
			MailHelper.SendMail_SetUrl(model.Email, "NewUserPsw", "Registracija Žalų valdymo sistemoje");
			//MailHelper.SendMailMessage(model.Email, String.Empty, String.Empty, "Registracija Žalų valdymo sistemoje", messageBody);

			TempData[currentUserIdKey] = userId.ToString();
			return View("RegisterOK", model);
		}

		// **************************************
		// URL: /Account/ChangeEmail
		// **************************************
		[HttpGet]
		public ActionResult ChangeEmail(string id) {
			Guid userId = Guid.Parse(id);
			MembershipUser aUser = Membership.GetUser(userId);

			var model = new ChangeEmailModel() {
				UserId = userId,
				OldEmail = aUser.Email,
				Email = aUser.Email,
			};

			TempData[currentUserIdKey] = userId.ToString();
			return View("ChangeEmail", model);
		}

		[HttpPost]
		public ActionResult ChangeEmail(ChangeEmailModel model) {
			Guid userId = Guid.Parse((string)TempData[currentUserIdKey]);
			MembershipUserCollection collection = Membership.FindUsersByEmail(model.Email);
			if (collection.Count > 0) {
				foreach (MembershipUser aUser in collection) {
					if ((Guid)aUser.ProviderUserKey != userId) {
						ModelState.AddModelError("", String.Format("{0} - jau užregistruotas sistemoje.", model.Email));
						TempData[currentUserIdKey] = userId.ToString();
						return View();
					}
				}
			}
			MembershipUser currentUser = Membership.GetUser(userId);
			currentUser.Email = model.Email;
			Membership.UpdateUser(currentUser);

			return RedirectToAction("LogOn");
		}

		// **************************************
		// URL: /Account/NewPassword
		// **************************************
		public ActionResult NewPassword(string Id) {
			TempData[currentUserIdKey] = Id;
			return View("NewPassword");
		}

		/// <summary>
		/// Activate user
		/// </summary>
		/// <param name="model"><see cref="RegisterModel"/></param>
		/// <returns>RegisterOK view or existsing view with an error message</returns>
		[HttpPost]
		public ActionResult NewPassword(NewPasswordModel model) {
			//Guid? userId = HttpContext.Request.RequestContext.RouteData.Values["id"];
			Guid? TempUi = Guid.Parse((string)HttpContext.Request.RequestContext.RouteData.Values["id"]);
			try {
				if (TempUi == null)
					throw new Exception("Paspauskite nuorodą laiške, kuris buvo atsiųstas į jūsų el. pašto dėžutę.");
				//userId = Guid.Parse((string)TempData[currentUserIdKey]);
				MembershipUser currentUser = UserData.GetUserIdFromTempUi(TempUi);

				if (ModelState.IsValid) {
					string tmpPasswd = currentUser.ResetPassword();
					currentUser.ChangePassword(tmpPasswd, model.Password);
					Membership.UpdateUser(currentUser);
					return RedirectToAction("LogOn");
				}
			}
			catch (Exception ex) {
				ModelState.AddModelError("", ex.Message);
			}
			// If we got this far, something failed, redisplay form
			//if (TempUi.HasValue)
				//TempData[currentUserIdKey] = userId.Value.ToString();
			return View("NewPassword");
		}
		[HttpPost]
		public JsonResult NewPassword2(string OldPassword, string NewPassword, int UserId) {
			jsonResponse JsonResp = new jsonResponse { ErrorMsg = "Kita klaida keičiant slaptažodį.", ResponseMsg = "" };
			if (ModelState.IsValid) {
				MembershipUser currentUser = Membership.GetUser(true);
				if (Membership.ValidateUser(currentUser.UserName, OldPassword)) {
					string tmpPasswd = currentUser.ResetPassword();
					currentUser.ChangePassword(tmpPasswd, NewPassword);
					Membership.UpdateUser(currentUser);
					JsonResp.ResponseMsg = "Slaptažodis sėkmingai pakeistas."; JsonResp.ErrorMsg = "";
				}
				else {
					JsonResp.ErrorMsg = "Neteisingas ankstesnis slaptažodis. Pasitikrinkite ir bandykite dar kartą.";
				};
			}
			else {
				JsonResp.ErrorMsg = "Baigėsi prisijungimo laikas. Prašome registruotis iš naujo.";
			}

			return Json(JsonResp);
		}
		//public ActionResult NewPasswordComfirm(string Id) {
		//   TempData[currentUserIdKey] = Id;
		//   return View("NewPassword");
		//}

		//[HttpPost]
		//public ActionResult NewPasswordComfirm(NewPasswordModel model) {
		//   Guid? userId = null;
		//   try {
		//      if (TempData[currentUserIdKey] == null)
		//         throw new Exception("Paspauskite nuorodą laiške, kuris buvo atsiųstas į jūsų el. pašto dėžutę.");
		//      userId = Guid.Parse((string)TempData[currentUserIdKey]);
		//      MembershipUser currentUser = Membership.GetUser(userId);
		//      if (currentUser == null)
		//         throw new Exception("Laikinas prisijungimas nebegalioja. Bandykite registruotis iš naujo.");

		//      if (ModelState.IsValid) {
		//         string tmpPasswd = currentUser.ResetPassword();
		//         currentUser.ChangePassword(tmpPasswd, model.Password);
		//         currentUser.IsApproved = true;
		//         Membership.UpdateUser(currentUser);

		//         return RedirectToAction("LogOn");
		//      }
		//   }
		//   catch (Exception ex) {
		//      ModelState.AddModelError("", ex.Message);
		//   }
		//   // If we got this far, something failed, redisplay form

		//   if (userId.HasValue)
		//      TempData[currentUserIdKey] = userId.Value.ToString();
		//   return View("NewPassword");
		//}

		//[Authorize]
		//public ActionResult ChangePassword() {
		//   ViewBag.PasswordLength = MembershipService.MinRequiredPasswordLength;
		//   return View();
		//}

		//[Authorize]
		//[HttpPost]
		//public ActionResult ChangePassword(ChangePasswordModel model) {
		//   if (ModelState.IsValid) {
		//      if (MembershipService.ChangePassword(User.Identity.Name, model.OldPassword, model.NewPassword)) {
		//         return RedirectToAction("ChangePasswordSuccess");
		//      }
		//      else {
		//         ModelState.AddModelError("", "The current password is incorrect or the new password is invalid.");
		//      }
		//   }

		//   // If we got this far, something failed, redisplay form
		//   ViewBag.PasswordLength = MembershipService.MinRequiredPasswordLength;
		//   return View(model);
		//}

		//private bool MailIsInvalid(Guid userId, string eMail)
		//{
		//    MembershipUserCollection registeredMails = Membership.FindUsersByEmail(eMail);
		//    if (registeredMails.Count < 1)
		//        return false;

		// }

		// **************************************
		// URL: /Account/Sutartis
		// **************************************
		public ActionResult Sutartis() {
			return View("Sutartis");
		}

		// **************************************
		// URL: /Account/ChangePasswordSuccess
		// **************************************

		[Authorize]
		public ActionResult ChangePasswordSuccess() {
			return View();
		}

		private IEnumerable<SelectListItem> GetAccountList(int selectedIndex) {
			int i = 0;
			using (dbDataContext db = new dbDataContext(ConfigurationManager.ConnectionStrings["ClaimsControlConnectionString"].ConnectionString)) {
				var acc = (
					 from aa in db.tblAccounts
					 orderby aa.Name
					 select new {
						 Id = aa.ID,
						 Name = aa.Name
					 })
					 .ToList()
					 .ConvertAll<SelectListItem>(a => new SelectListItem() {
						 Text = a.Name,
						 Value = a.Id.ToString(),
						 Selected = (selectedIndex == i++)
					 });
				return acc;
			}
		}

		public ActionResult Header() {
			//var model = new HeaderModel();
			//model.Title = ConfigurationManager.AppSettings["ProgramName"];
			//return View("Header", model);
			return View("Header");
		}
	}
}