using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Mvc;

namespace CC.Services.Interfaces
{
    public interface IUserManager
    {
        IList<SelectListItem> GetLanguages(int selectedLanguageId = 0);
        int UpdateClientInUsersTable(string name, string surname, string email, string languageId);
    }
}
