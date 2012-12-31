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

        bool StoreFile(string account, string fileName, byte[] content);
        //void UpdateFileName(tblDoc record, string fileName, out string errorMessage);
		  tblDoc StoreTblDocs(FileDescriptor descriptor, out tblDocsInAccident _tblDocsInAccidents, out string errorMessage, byte[] buffer);
        string GetIndividualDirectory(string account, bool uploadDirectory);
        string GetIndividualVirtualDirectory(string account, bool uploadDirectory);
    }
}
