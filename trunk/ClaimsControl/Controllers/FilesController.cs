﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CC.Services.Interfaces;
using Ninject;
using CC.Models;
using CC.Classes;
using System.Configuration;
using System.Web.UI.WebControls;

namespace CC.Controllers
{
    /// <summary>
    /// <see cref="http://dotnet.dzone.com/articles/progressive-enhancement"/>
    /// <see cref="http://blueimp.github.com/jQuery-File-Upload/"/>
    /// <see cref="https://github.com/blueimp/jQuery-File-Upload"/>
    /// </summary>
    public class FilesController : Controller
    {
        //
        // GET: /File/

        private IFileManager _flManager;
        private string _fileNameFormat;

        [Inject]
        public FilesController(IFileManager flManager, string fileNameFormat)
        {
            this._flManager = flManager;
            _fileNameFormat = fileNameFormat;
        }

        /// <summary>
        /// <see cref="http://yassershaikh.com/introduction-to-dropdownlist-with-asp-net-mvc-3-razor/"/>
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult Start(int? accountId, int? docGroupId, int? refID, int? accidentID)
        {
            var model = new CustomerDocumentsModel()
            {
                AccountID = UserData.AccountID,
                Account = UserData.Account,
                UserID = UserData.UserID,
                UserName = UserData.UserName,
                DocGroupID = docGroupId,
                RefID = refID.HasValue && refID.Value > 0 ? refID.Value.ToString() : String.Empty,
                AccidentID = accidentID.HasValue && accidentID.Value > 0 ? accidentID.Value.ToString() : String.Empty
            };
            bool selected = true;
            foreach (tblDocType docType in this._flManager.GetTblDocTypes(accountId, docGroupId))
            {
                model.DocTypes.Add(new SelectListItem() { Text = docType.Name, Value = docType.ID.ToString(), Selected = selected });
                selected &= false;
            }

            ViewBag.CustomerDocumentsData = model;
            if (Request.IsAjaxRequest())
            {
                return PartialView("_Start");
            }
            return View("Start");
        }

        [HttpPost]
        public JsonResult Start(PostedCustomerDocumentModel model)
        {
            string errorMessage;
            try
            {
                var stream = Request.Files[0].InputStream;  // Request.InputStream;
                if (String.IsNullOrEmpty(model.qqfile)) // IE explorer ?
                    model.qqfile = System.IO.Path.GetFileName(Request.Files[0].FileName);
                if (model.fileSize != stream.Length)
                    throw new Exception(String.Format("Duomenų perdavimo klaida: laukiama {0} baitų, gauta - {1}.", model.fileSize, stream.Length));

                var buffer = new byte[model.fileSize];  //     [stream.Length];
                if (buffer.Length > 0)
                {
                    stream.Read(buffer, 0, buffer.Length);
                    FileDescriptor descriptor = FileDescriptor.CreateFileDescriptor(model, buffer.Length, UserData.UserID);
                    tblDoc newRecord = this._flManager.StoreTblDocs(descriptor, out errorMessage);
                    if (String.IsNullOrEmpty(errorMessage))
                    {
                        string fileName = String.Format(_fileNameFormat, newRecord.ID) + "." + newRecord.FileType;
                        _flManager.StoreFile(UserData.Account, UserData.UserName, fileName, buffer);
                        string relativeUri = String.Format("{0}/{1}",
                            this._flManager.GetIndividualVirtualDirectory(UserData.Account, UserData.UserName), fileName);
                        this._flManager.UpdateFileName(newRecord, relativeUri, out errorMessage);
                        if (!String.IsNullOrEmpty(errorMessage))
                            throw new Exception(errorMessage);
                    }
                    else
                        throw new Exception(errorMessage);
                }
                return Json(new { success = true }, "text/html");
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, "application/json");
            }
        }

        /// <summary>
        /// Testavimui
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult UploadTest()
        {
            return View("UploadTest");
        }
    }
}
