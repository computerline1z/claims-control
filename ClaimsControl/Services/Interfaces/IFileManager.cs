using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using CC.Classes;

namespace CC.Services.Interfaces
{
    public interface IFileManager
    {
        public IQueryable<FileDescriptorDTO> GetFileDescriptors(Guid ownerId);
    }
}
