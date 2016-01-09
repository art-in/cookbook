using System.Web.Mvc;
using System.Web.Routing;

namespace cookbook
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            // all routes (except webapi and files) 
            // targeted to SPA controller
            routes.MapRoute("Default", "{*all}",
                new {controller = "Home", action = "Index", id = UrlParameter.Optional}
                );
        }
    }
}