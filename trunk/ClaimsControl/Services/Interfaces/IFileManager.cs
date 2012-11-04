using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using CC.Classes;
using CC.Models;

namespace CC.Services.Interfaces
{
    public interface IFileManager
    {
        string UploadDirectory { get; }

        IQueryable<tblDoc> GetFileDescriptors(int? AccountID);
        IQueryable<tblDocGroup> GetTblDocGroups();
        IQueryable<tblDocType> GetTblDocTypes(int? accountID, int? docGroupID);

        bool StoreFile(string account, string userName, string fileName, byte[] content);
        tblDoc StoreTblDocs(FileDescriptor descriptor, out string errorMessage);
    }
}
