using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CC.Controllers
{
    public class FilesController : Controller
    {
        //
        // GET: /Files/
        [Authorize]
        public ActionResult Index()
        {
            return View();
        }

    }
}
