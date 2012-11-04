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
            
            string uploadDirectory = HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["uploadDirectory"]);
            ninjectKernel.Bind<IFileManager>().To<FileManager>()
                .InScope(ctx => HttpContext.Current)
                .WithConstructorArgument("uploadDirectory", uploadDirectory);

            string fileNameFormat = ConfigurationManager.AppSettings["fileNameFormat"] ?? "{0:D8}";
            ninjectKernel.Bind<FilesController>().ToSelf().WithConstructorArgument("fileNameFormat", fileNameFormat);
        }
    }
}