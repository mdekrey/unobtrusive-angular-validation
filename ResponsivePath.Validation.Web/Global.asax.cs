using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using System.Web.Security;
using System.Web.SessionState;

namespace ResponsivePath.Validation.Web
{
    public class Global : System.Web.HttpApplication
    {

        protected void Application_Start(object sender, EventArgs e)
        {
            var routes = RouteTable.Routes;
            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );

            BundleTable.Bundles.Add(new ScriptBundle("~/bundles/angularValidation")
                .Include("~/Scripts/angular.unobtrusive.validation.js")
            );

        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {
            if (this.Context.Request.AppRelativeCurrentExecutionFilePath == "~/bundles/angularValidation")
            {
                var temp = BundleTable.Bundles.GetBundleFor("~/bundles/angularValidation").GenerateBundleResponse(new BundleContext(new HttpContextWrapper(this.Context), BundleTable.Bundles, string.Empty)).Content;
                System.IO.File.WriteAllText(Context.Server.MapPath("~/Scripts/angular.unobtrusive.validation.min.js"), temp);
            }

        }
    }
}