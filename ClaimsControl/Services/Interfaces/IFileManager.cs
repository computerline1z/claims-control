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

        bool StoreFile(string fileName, byte[] content);
        //void UpdateFileName(tblDoc record, string fileName, out string errorMessage);
		  //tblDoc StoreTblDocs(FileDescriptor descriptor, out tblDocsInAccident _tblDocsInAccidents, out string errorMessage, byte[] buffer);
		  tblDoc StoreTblDocs(FileDescriptor descriptor, out string errorMessage, byte[] buffer);
        string GetIndividualDirectory(bool uploadDirectory);
        string GetIndividualVirtualDirectory(bool uploadDirectory);
    }
}
