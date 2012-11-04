using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.Web.UI.WebControls;
using System.Text;

namespace CC.Models
{
    public enum FileStatus { NewFileDescriptor, StoredToDatabase, UploadRejected }

    /// <summary>
    /// <see cref="[dbo].[tblDocs]"/>
    /// </summary>
    [Serializable]
    public class FileDescriptor
    {
        #region Duomenų bazės laukai

        /// <summary>
        /// <code>[ID] [int] IDENTITY(1,1) NOT NULL</code> 
        /// Naujiems dokumentams NULLas
        /// </summary>
        [HiddenInput(DisplayValue = false)]
        public int? ID { get; set; }

        /// <summary>
        /// Documento pavadinimas. Gali sutapti su failo vardu
        /// <code>[DocName] [nvarchar](100) NULL</code>
        /// </summary>
        public String DocName { get; set; }

        /// <summary>
        /// <code>[FileType] [varchar](5) NOT NULL</code>
        /// </summary>
        [HiddenInput(DisplayValue = false)]
        public String FileType { get; set; }

        /// <summary>
        /// <code>[FileName] [nvarchar](100) NOT NULL</code>
        /// </summary>
        [HiddenInput(DisplayValue = false)]
        public String FileName { get; set; }

        /// <summary>
        /// <code>[FileDate] [date] NOT NULL</code>
        /// TODO: patikrinti, ar tikrai reikia
        /// </summary>
        public DateTime? FileDate { get; set; }

        /// <summary>
        /// <code>[FileSize] [int] NOT NULL</code>
        /// TODO: patikrinti, ar tikrai reikia
        /// </summary>
        public int? FileSize { get; set; }

        /// <summary>
        /// <code>[UserID] [int] NOT NULL</code>
        /// </summary>
        public int UserID { get; set; }

        /// <summary>
        /// <code>[DocTypeID] [int] NOT NULL</code>
        /// </summary>
        public int DocTypeID { get; set; }

        /// <summary>
        /// <code>[RefID] [int] NOT NULL</code>
        /// </summary>
        public int? RefID { get; set; }

        /// <summary>
        /// <code>[SortNo] [smallint] NOT NULL</code>
        /// Naujai keliamiems dokumentams NULLas
        /// </summary>
        public int? SortNo { get; set; }

        /// <summary>
        /// <code>[GroupID] [int] NULL</code>
        /// </summary>
        public int? GroupID { get; set; }

        /// <summary>
        /// <code>[AccidentID] [int] NULL</code>
        /// </summary>
        public int? AccidentID { get; set; }

        #endregion

        #region Papildomi laukai

        /// <summary>
        /// Lauko duomenų bazėje nėra; užpildomas automatiškai.
        /// </summary>
        public FileStatus Status { get; set; }
        public bool success { get; set; }

        /// <summary>
        /// Failo turinys (naujam deskriptoriui <code>null</code>
        /// </summary>
        public byte[] Content { get; set; }

        #endregion

        #region Konstruktorius

        public FileDescriptor()
        {
            Status = FileStatus.NewFileDescriptor;
        }

        public static FileDescriptor CreateFileDescriptor(PostedCustomerDocumentModel model, int fileSize, int userID)
        {
            string extension = System.IO.Path.GetExtension(model.qqfile);
            if (!String.IsNullOrEmpty(extension) && extension.StartsWith("."))
                extension = extension.Substring(1);

            var rzlt = new FileDescriptor()
            {
                DocName = model.fileName,
                FileName = model.qqfile,
                FileType = extension,
                FileDate = CreatedatefromString(model.DateCreated),
                FileSize = fileSize,
                UserID = userID,
                DocTypeID = model.docTypeID,
                GroupID = model.DocGroupID,
            };
            int tmp;
            if (!String.IsNullOrEmpty(model.RefID) && Int32.TryParse(model.RefID, out tmp))
                rzlt.RefID = tmp;
            if (!String.IsNullOrEmpty(model.AccidentID) && Int32.TryParse(model.AccidentID, out tmp))
                rzlt.AccidentID = tmp;
            return rzlt;
        }
        #endregion

        private static DateTime CreatedatefromString(string dateCreated)
        {
            DateTime rzlt;
            if (String.IsNullOrEmpty(dateCreated) || !DateTime.TryParse(dateCreated, out rzlt))
                return DateTime.Now;
            return rzlt;
        }
    }

    /// <summary>
    /// Įrašyti į DB failai (grąžinama po sėkmingo (ar nelabai) POSTo.
    /// </summary>
    [Serializable]
    public class FileDescriptorList : Collection<FileDescriptor>
    {
    }

    [Serializable]
    public class CustomerDocumentsModel
    {
        public Int32? AccountID { get; set; }
        public string Account { get; set; }
        public Int32? UserID { get; set; }
        public string UserName { get; set; }
        public int? DocGroupID { get; set; }
        public string RefID { get; set; }
        public string AccidentID { get; set; }
        public List<SelectListItem> DocTypes { get; set; }
        public CustomerDocumentsModel()
        {
            this.DocTypes = new List<SelectListItem>();
        }
    }

    [Serializable]
    public class PostedCustomerDocumentModel
    {
        public Int32? AccountID { get; set; }
        public int? DocGroupID { get; set; }
        public string fileName { get; set; }
        public int fileSize { get; set; }
        public string currentMemo { get; set; }
        public string qqfile { get; set; }
        public string DateCreated { get; set; }
        public int docTypeID { get; set; }
        public string RefID { get; set; }
        public string AccidentID { get; set; }
    }

    /// <summary>
    /// Testavimui.
    /// </summary>
    [Serializable]
    public class FakeFileDescriptorList
    {
        [Required]
        public string Name { get; set; }

        [Required]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; }

        [Required]
        [UIHint("Multiline")]
        public string Message { get; set; }
    }


}