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
        void UpdateFileName(tblDoc record, string fileName, out string errorMessage);
        tblDoc StoreTblDocs(FileDescriptor descriptor, out string errorMessage);
        string GetIndividualDirectory(string account, string userName, bool uploadDirectory);
        string GetIndividualVirtualDirectory(string account, string userName, bool uploadDirectory);
    }
}
