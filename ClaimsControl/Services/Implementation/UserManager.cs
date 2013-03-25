using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CC.Services.Interfaces;
using CC.Models;
using Ninject;
using System.Web.Mvc;
using CC.Classes;

namespace CC.Services.Implementation {
	public class UserManager : IUserManager {
		private dbDataContext _dc;
		private string _defaultLanguage;

		[Inject]
		public UserManager(dbDataContext dc, string defaultLanguage) {
			this._dc = dc;
			this._defaultLanguage = defaultLanguage;
		}

		public IList<System.Web.Mvc.SelectListItem> GetLanguages(int selectedLanguageId = 0) {
			var ddListItems = new List<SelectListItem>();

			var languages =
				 from lng in _dc.tblLanguages
				 select new {
					 Value = lng.ID,
					 Text = lng.Name
				 };
			foreach (var lngItem in languages) {
				var newItem = new SelectListItem() {
					Value = lngItem.Value.ToString(),
					Text = lngItem.Text,
				};
				if (selectedLanguageId > 0)
					newItem.Selected = lngItem.Value == selectedLanguageId;
				else
					newItem.Selected = String.Compare(lngItem.Text, _defaultLanguage) == 0;
				ddListItems.Add(newItem);
			}

			return ddListItems;
		}

		public int UpdateClientInUsersTable(string name, string surname, string email, string languageId)//Trinti šitą nesamonę
		{
			var accountId = (
				 from acc in _dc.tblAccounts
				 select acc.ID
				 ).FirstOrDefault();
			int iLanguageId;
			if (!Int32.TryParse(languageId, out iLanguageId)) {
				iLanguageId = (
					 from acc in _dc.tblLanguages
					 where acc.Name == this._defaultLanguage
					 select acc.ID
					 ).FirstOrDefault();
			}

			int? recId = 0;
			return _dc.proc_Update_Edit_tblUsers(ref recId, name, surname, email, accountId, iLanguageId, "Client");
		}
		//public int CreateAccountAddUserEtc(string name, string surname, string email, string languageId, string accountName) {
		//   int iLanguageId;
		//   if (!Int32.TryParse(languageId, out iLanguageId)) {
		//      iLanguageId = (
		//          from acc in _dc.tblLanguages
		//          where acc.Name == this._defaultLanguage
		//          select acc.ID
		//          ).FirstOrDefault();
		//   }

		//   int? recId = 0;
		//   return _dc.proc_CreateAccountAddUserEtc(ref recId, name, surname, email, iLanguageId, string accountName);//, "Client"
		//}
	}
}