using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Ninject.Modules;
using CC.Services.Interfaces;
using CC.Services.Implementation;

namespace CC.Services.Ninject
{
    public class NinjectServiceModule : NinjectModule
    {
        public override void Load()
        {
            Bind<IFileManager>().To<FileManager>();
        }
    }
}