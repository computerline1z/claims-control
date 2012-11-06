using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Ninject;
using CC.Services.Interfaces;
using CC.Services.Implementation;
using System.Web.Routing;
using CC.Models;
using System.Configuration;
using CC.Controllers;

namespace CC.Services.Ninject
{
    public class NinjectControllerFactory : DefaultControllerFactory
    {
        private IKernel ninjectKernel;
        public NinjectControllerFactory()
        {
            ninjectKernel = new StandardKernel();
            AddBindings();
        }
        protected override IController GetControllerInstance(RequestContext requestContext, Type controllerType)
        {
            return controllerType == null ? null : (IController)ninjectKernel.Get(controllerType);
        }
        private void AddBindings()
        {
            ninjectKernel.Bind<dbDataContext>()
                .ToConstructor(c => new dbDataContext(ConfigurationManager.ConnectionStrings["ClaimsControlConnectionString"].ConnectionString))
                .InScope(ctx => HttpContext.Current);
            
            string virtualUploadDirectory = ConfigurationManager.AppSettings["uploadDirectory"];
            string uploadDirectory = HttpContext.Current.Server.MapPath(virtualUploadDirectory);
            string virtualThumbnailDirectory = ConfigurationManager.AppSettings["thumbnailDirectory"];
            string thumbnailDirectory = HttpContext.Current.Server.MapPath(virtualThumbnailDirectory);
            int thumbnailSize;
            if (!Int32.TryParse(ConfigurationManager.AppSettings["thumbnailSize"], out thumbnailSize))
                thumbnailSize = 32;

            ninjectKernel.Bind<IFileManager>().To<FileManager>()
                .InScope(ctx => HttpContext.Current)
                .WithConstructorArgument("virtualUploadDirectory", virtualUploadDirectory)
                .WithConstructorArgument("uploadDirectory", uploadDirectory)
                .WithConstructorArgument("virtualThumbnailDirectory", virtualThumbnailDirectory)
                .WithConstructorArgument("thumbnailDirectory", thumbnailDirectory)
                .WithConstructorArgument("thumbnailSize", thumbnailSize);

            string fileNameFormat = ConfigurationManager.AppSettings["fileNameFormat"] ?? "{0:D8}";
            ninjectKernel.Bind<FilesController>().ToSelf().WithConstructorArgument("fileNameFormat", fileNameFormat);
        }
    }
}