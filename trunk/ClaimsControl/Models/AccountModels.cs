using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Web.Mvc;
using System.Web.Security;
using CC.Classes;

namespace CC.Models {
   #region Models

   public class ChangePasswordModel {

      [Required]
      [DataType(DataType.Password)]
      [Display(Name = "Current password")]
      public string OldPassword { get; set; }

      [Required]
      [ValidatePasswordLength]
      [DataType(DataType.Password)]
      [Display(Name = "New password")]
      public string NewPassword { get; set; }

      [DataType(DataType.Password)]
      [Display(Name = "Confirm new password")]
      [Compare("NewPassword", ErrorMessage = "The new password and confirmation password do not match.")]
      public string ConfirmPassword { get; set; }
   }

   public class LogOnModel {

      public LogOnModel() { }

      public LogOnModel(string _Name, string _Password) { this.Email = _Name; this.Password = _Password; this.RememberMe = false; }

      [Display(Name = "Naudotojo vardas:")]
      public string Email { get; set; }

      [DataType(DataType.Password)]
      [Display(Name = "Slaptažodis:")]
      public string Password { get; set; }

      [Display(Name = "Prisiminti mane šiame kompiuteryje")]
      public bool RememberMe { get; set; }
   }

   public class RegisterModel {

      [Required]
      [Display(Name = "Paskyros pavadinimas:")]
      public string UserName { get; set; }

      [Required]
      [Display(Name = "Vardas:")]
      public string Name { get; set; }

      [Required]
      [Display(Name = "Pavardė:")]
      public string Surname { get; set; }

      [Required]
      [DataType(DataType.EmailAddress)]
      [Display(Name = "El. paštas:")]
      [RegularExpression("^(?i)[a-z0-9_\\+-]+(\\.[a-z0-9_\\+-]+)*@[a-z0-9-]+(\\.[a-z0-9-]+)*\\.([a-z]{2,4})$", ErrorMessage = "Neteisingas pašto adresas")]
      public string Email { get; set; }

      [Required]
      [Display(Name = " ")]
      public bool Accept { get; set; }

      [Display(Name = "Pasirinkite kalbą")]
      public string LanguageId { get; set; }
   }

   public class RegisterOKModel {

      public Guid UserId { get; set; }

      public string Email { get; set; }

      public string Mailer { get; set; }

      public string UserName { get; set; }
   }

   public class ChangeEmailModel {

      public Guid UserId { get; set; }

      [Required]
      [DataType(DataType.EmailAddress)]
      [Display(Name = "Sistemoje registruotas el. paštas:")]
      public string OldEmail { get; set; }

      [Required]
      [DataType(DataType.EmailAddress)]
      [Display(Name = "Naujas el. paštas:")]
      [RegularExpression("^[a-z0-9_\\+-]+(\\.[a-z0-9_\\+-]+)*@[a-z0-9-]+(\\.[a-z0-9-]+)*\\.([a-z]{2,4})$", ErrorMessage = "Neteisingas pašto adresas")]
      public string Email { get; set; }
   }

   public class NewPasswordModel {

      [Required]
      [ValidatePasswordLength]
      [DataType(DataType.Password)]
      [Display(Name = "Pasirinkite slaptažodį:")]
      public string Password { get; set; }

      [DataType(DataType.Password)]
      [Display(Name = "Pakartokite slaptažodį:")]
      [Compare("Password", ErrorMessage = "Slaptažodis ir jo patvirtinimas privalo būti vienodi.")]
      public string ConfirmPassword { get; set; }
   }

   public class RecoverPasswordModel {

      [Required]
      [DataType(DataType.EmailAddress)]
      [Display(Name = "Pašto adresas:")]
      [RegularExpression("^[a-z0-9_\\+-]+(\\.[a-z0-9_\\+-]+)*@[a-z0-9-]+(\\.[a-z0-9-]+)*\\.([a-z]{2,4})$", ErrorMessage = "Neteisingas pašto adresas")]
      public string Email { get; set; }

      internal RecoverPasswordModel(string currentUserName) {
         //MembershipUser aUser = Membership.GetUser(currentUserName);
         //PasswordQuestion = aUser.PasswordQuestion;
         //Email = aUser.Email;
      }

      public RecoverPasswordModel() {
      }
   }

   #endregion Models

   #region Services

   // The FormsAuthentication type is sealed and contains static members, so it is difficult to
   // unit test code that calls its members. The interface and helper class below demonstrate
   // how to create an abstract wrapper around such a type in order to make the AccountController
   // code unit testable.

   //public interface IMembershipService
   //{
   //    int MinPasswordLength { get; }

   //    bool ValidateUser(string userName, string password);
   //    MembershipCreateStatus CreateUser(string userName, string password, string email);
   //    bool ChangePassword(string userName, string oldPassword, string newPassword);
   //}

   //public class AccountMembershipService : IMembershipService
   //{
   //    private readonly MembershipProvider _provider;

   //    public AccountMembershipService()
   //        : this(null)
   //    {
   //    }

   //    public AccountMembershipService(MembershipProvider provider)
   //    {
   //        _provider = provider ?? Membership.Provider;
   //    }

   //    public int MinPasswordLength
   //    {
   //        get
   //        {
   //            return _provider.MinRequiredPasswordLength;
   //        }
   //    }

   //    public bool ValidateUser(string userName, string password)
   //    {
   //        if (String.IsNullOrEmpty(userName)) throw new ArgumentException("Value cannot be null or empty.", "userName");
   //        if (String.IsNullOrEmpty(password)) throw new ArgumentException("Value cannot be null or empty.", "password");

   //        return _provider.ValidateUser(userName, password);
   //    }

   //    public MembershipCreateStatus CreateUser(string userName, string password, string email)
   //    {
   //        if (String.IsNullOrEmpty(userName)) throw new ArgumentException("Value cannot be null or empty.", "userName");
   //        if (String.IsNullOrEmpty(password)) throw new ArgumentException("Value cannot be null or empty.", "password");
   //        if (String.IsNullOrEmpty(email)) throw new ArgumentException("Value cannot be null or empty.", "email");

   //        MembershipCreateStatus status;
   //        _provider.CreateUser(userName, password, email, null, null, true, null, out status);
   //        return status;
   //    }

   //    public bool ChangePassword(string userName, string oldPassword, string newPassword)
   //    {
   //        if (String.IsNullOrEmpty(userName)) throw new ArgumentException("Value cannot be null or empty.", "userName");
   //        if (String.IsNullOrEmpty(oldPassword)) throw new ArgumentException("Value cannot be null or empty.", "oldPassword");
   //        if (String.IsNullOrEmpty(newPassword)) throw new ArgumentException("Value cannot be null or empty.", "newPassword");

   //        // The underlying ChangePassword() will throw an exception rather
   //        // than return false in certain failure scenarios.
   //        try
   //        {
   //            MembershipUser currentUser = _provider.GetUser(userName, true /* userIsOnline */);
   //            return currentUser.ChangePassword(oldPassword, newPassword);
   //        }
   //        catch (ArgumentException)
   //        {
   //            return false;
   //        }
   //        catch (MembershipPasswordException)
   //        {
   //            return false;
   //        }
   //    }
   //}

   public interface IFormsAuthenticationService {

      void SignIn(string userName, bool createPersistentCookie);

      void SignOut();
   }

   public class FormsAuthenticationService : IFormsAuthenticationService {

      public void SignIn(string userName, bool createPersistentCookie) {
         if (String.IsNullOrEmpty(userName)) throw new ArgumentException("Value cannot be null or empty.", "userName");

         FormsAuthentication.SetAuthCookie(userName, createPersistentCookie);
			//if (createPersistentCookie) {
			//   UserData.PersistentCookie = true;
			//}
			//else {
			//   UserData.PersistentCookie = false;
			//}
      }

      public void SignOut() {
         FormsAuthentication.SignOut();
      }
   }

   #endregion Services

   #region Validation

   public static class AccountValidation {

      public static string ErrorCodeToString(MembershipCreateStatus createStatus) {
         // See http://go.microsoft.com/fwlink/?LinkID=177550 for
         // a full list of status codes.
         switch (createStatus) {
            case MembershipCreateStatus.DuplicateUserName:
               return "Username already exists. Please enter a different user name.";

            case MembershipCreateStatus.DuplicateEmail:
               return "A username for that e-mail address already exists. Please enter a different e-mail address.";

            case MembershipCreateStatus.InvalidPassword:
               return "The password provided is invalid. Please enter a valid password value.";

            case MembershipCreateStatus.InvalidEmail:
               return "The e-mail address provided is invalid. Please check the value and try again.";

            case MembershipCreateStatus.InvalidAnswer:
               return "The password retrieval answer provided is invalid. Please check the value and try again.";

            case MembershipCreateStatus.InvalidQuestion:
               return "The password retrieval question provided is invalid. Please check the value and try again.";

            case MembershipCreateStatus.InvalidUserName:
               return "The user name provided is invalid. Please check the value and try again.";

            case MembershipCreateStatus.ProviderError:
               return "The authentication provider returned an error. Please verify your entry and try again. If the problem persists, please contact your system administrator.";

            case MembershipCreateStatus.UserRejected:
               return "The user creation request has been canceled. Please verify your entry and try again. If the problem persists, please contact your system administrator.";

            default:
               return "An unknown error occurred. Please verify your entry and try again. If the problem persists, please contact your system administrator.";
         }
      }
   }

   [AttributeUsage(AttributeTargets.Field | AttributeTargets.Property, AllowMultiple = false, Inherited = true)]
   public sealed class ValidatePasswordLengthAttribute : ValidationAttribute, IClientValidatable {
       private const string _defaultErrorMessage = "'{0}' must be at least {1} characters long.";
       private readonly int _minCharacters = Membership.Provider.MinRequiredPasswordLength;

       public ValidatePasswordLengthAttribute()
           : base(_defaultErrorMessage) {
       }

       public override string FormatErrorMessage(string name) {
           return String.Format(CultureInfo.CurrentCulture, ErrorMessageString,
               name, _minCharacters);
       }

       public override bool IsValid(object value) {
           string valueAsString = value as string;
           return (valueAsString != null && valueAsString.Length >= _minCharacters);
       }

       public IEnumerable<ModelClientValidationRule> GetClientValidationRules(ModelMetadata metadata, ControllerContext context) {
           return new[]{
                new ModelClientValidationStringLengthRule(FormatErrorMessage(metadata.GetDisplayName()), _minCharacters, int.MaxValue)
            };
       }
   }

   #endregion Validation
}