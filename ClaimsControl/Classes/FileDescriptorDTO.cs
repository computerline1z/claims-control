using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CC.Classes
{
    /// <summary>
    /// <code>[dbo].[tblFileDescriptor]</code>
    /// </summary>
    [Serializable]
    public class FileDescriptorDTO
    {
        /// <summary>
        /// <code>[ID] [uniqueidentifier] NOT NULL,</code>
        /// </summary>
        public Guid ID { get; set; }

        /// <summary>
        /// <code>[MimeType] [nvarchar](50) NULL</code>
        /// </summary>
        public string MimeType { get; set; }
	
        /// <summary>
        /// <code>[DateCreation] [datetime] NOT NULL</code>
        /// </summary>
        public DateTime DateCreation { get; set; }
	
        /// <summary>
        /// <code>[DateModification] [datetime] NULL</code>
        /// </summary>
        public DateTime? DateModification { get; set; }
	
        /// <summary>
        /// <code>[Icon] [image] NULL</code>
        /// </summary>
        public byte[] Icon { get; set; }
	
        /// <summary>
        /// <code>[Owner] [uniqueidentifier] NOT NULL</code>
        /// </summary>
        public Guid Owner { get; set; }
	
        /// <summary>
        /// <code>[IsPublic] [bit] NOT NULL</code>
        /// </summary>
        public bool IsPublic { get; set; }
	
        /// <summary>
        /// <code>[Path] [nvarchar](max) NOT NULL</code>
        /// </summary>
        public string Path { get; set; }
	
        /// <summary>
        /// <code>[Version] [timestamp] NOT NULL</code>
        /// </summary>
        public byte[] Version { get; set; }
    }

    [Serializable]
    public class FileInfoDTO : FileDescriptorDTO
    {
        /// <summary>
        /// <code>Binary content</code>
        /// </summary>
        public byte[] Content { get; set; }
    }
}