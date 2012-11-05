using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CC.Services.Interfaces;
using CC.Models;
using CC.Classes;
using Ninject;
using System.IO;

namespace CC.Services.Implementation
{
    public class FileManager : IFileManager
    {
        private dbDataContext _dc;
        public string UploadDirectory { get; private set; }
        public string VirtualUploadDirectory { get; private set; }

        [Inject]
        public FileManager(dbDataContext dc, string virtualUploadDirectory, string uploadDirectory)
        {
            this._dc = dc;
            this.VirtualUploadDirectory = virtualUploadDirectory;
            this.UploadDirectory = uploadDirectory;
        }

        #region Interface implementation

        public IQueryable<tblDoc> GetFileDescriptors(int? AccountID)
        {
            var rzlt = from doc in this._dc.tblDocs select doc;
            if (AccountID.HasValue)
                rzlt = rzlt.Where(x => x.tblUser.AccountID == AccountID.Value);
            return rzlt;
        }

        public bool StoreFile(string account, string userName, string fileName, byte[] content)
        {
            string individualDirectory = GetIndividualDirectory(account, userName);
            string storedFileName = Path.Combine(individualDirectory, fileName);
            File.WriteAllBytes(storedFileName, content);
            return true;
        }

        public IQueryable<tblDocGroup> GetTblDocGroups()
        {
            var rzlt = from docGroup in _dc.tblDocGroups
                       where !docGroup.IsDeleted
                       select docGroup;
            return rzlt;
        }

        public IQueryable<tblDocType> GetTblDocTypes(int? accountID, int? docGroupID)
        {
            var rzlt = from docType in _dc.tblDocTypes
                       where !docType.IsDeleted
                       select docType;
            if (accountID.HasValue)
                rzlt = rzlt.Where(x => x.AccountID == accountID.Value);
            if (docGroupID.HasValue)
                rzlt = rzlt.Where(x => x.DocGroupID == docGroupID.Value);
            return rzlt;
        }

        public tblDoc StoreTblDocs(FileDescriptor descriptor, out string errorMessage)
        {
            tblDoc record;

            try
            {
                // Tranzakcija būtina tam, kad niekas nepakeistų SortNo, kol operacija neužbaigta.
                _dc.Connection.Open();
                _dc.Transaction = _dc.Connection.BeginTransaction(System.Data.IsolationLevel.ReadCommitted);

                record = new tblDoc()
                {
                    DocName = descriptor.DocName,
                    FileName = descriptor.FileName,
                    FileType = descriptor.FileType,
                    FileDate = descriptor.FileDate ?? DateTime.Now,
                    FileSize = descriptor.FileSize ?? 0,
                    UserID = descriptor.UserID,
                    DocTypeID = descriptor.DocTypeID,
                    RefID = descriptor.RefID,
                    SortNo = GetSortNumber(descriptor.UserID, descriptor.AccidentID),
                    IsDeleted = false,
                    GroupID = descriptor.GroupID,
                    AccidentID = descriptor.AccidentID
                };

                _dc.tblDocs.InsertOnSubmit(record);
                _dc.SubmitChanges();
                _dc.Transaction.Commit();
                errorMessage = String.Empty;
            }
            catch (Exception e)
            {
                _dc.Transaction.Rollback();
                errorMessage = e.Message;
                record = null;
            }
            finally
            {
                _dc.Transaction = null;
                _dc.Connection.Close();
            }
            return record;
        }
        public void UpdateFileName(tblDoc record, string fileName, out string errorMessage)
        {
            _dc.Connection.Open();
            _dc.Transaction = _dc.Connection.BeginTransaction(System.Data.IsolationLevel.ReadCommitted);
            try
            {
                record.FileName = fileName;
                _dc.SubmitChanges();
                _dc.Transaction.Commit();
                errorMessage = String.Empty;
            }
            catch (Exception ex)
            {
                _dc.Transaction.Rollback();
                errorMessage = ex.Message;
                record = null;
            }
            finally
            {
                _dc.Transaction = null;
                _dc.Connection.Close();
            }
        }

        public string GetIndividualDirectory(string account, string userName)
        {
            string rzlt = Path.Combine(UploadDirectory, account, userName);
            if (!Directory.Exists(rzlt))
                Directory.CreateDirectory(rzlt);
            return rzlt;
        }

        public string GetIndividualVirtualDirectory(string account, string userName)
        {
            string rzlt = String.Format("{0}/{1}/{2}", this.VirtualUploadDirectory, account, userName);
            return rzlt;
        }

        #endregion

        #region Private methods

        private short GetSortNumber(int userID, int? accidentID)
        {
            var rzlt = from docs in _dc.tblDocs
                       where !docs.IsDeleted && docs.UserID == userID
                       select new { SortNo = docs.SortNo, AccidentID = docs.AccidentID };
            if (accidentID.HasValue)
                rzlt = rzlt.Where(z => !z.AccidentID.HasValue || z.AccidentID == accidentID);

            var maxSortNo = rzlt.OrderByDescending(x => x.SortNo).FirstOrDefault();
            if (maxSortNo == null)
                return (short)1;
            else
                return (short)(maxSortNo.SortNo + 1);
        }

        #endregion

    }
}