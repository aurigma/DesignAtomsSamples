using System.Web.Http;
using System.Web.Routing;
using Aurigma.DesignAtoms.Licensing;
using Aurigma.DesignAtoms.Samples.Code.Controllers;

namespace Aurigma.DesignAtoms.Samples
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            // Initializing Design Atoms backend
            // If you want to add Design Atoms in your backend include those calls into your project
            // And ensure that you don't call HttpConfigurationExtensions.MapHttpAttributeRoutes method in your code.
            Aurigma.DesignAtoms.Configuration.Configuration.Setup(enableCors: true, controllerAssemblies: new []
            {
                typeof(GenerateController).Assembly,
                typeof(RenderController).Assembly
            });

            License.Check();

            RouteTable.Routes.MapHttpRoute(
                name: "GenerateApi",
                routeTemplate: "api/Generate/{action}",
                defaults: new { controller = "Generate", action = "DemoProduct" }
            );

            RouteTable.Routes.MapHttpRoute(
                name: "RenderApi",
                routeTemplate: "api/Render/{format}",
                defaults: new { controller = "Render", format = "Pdf" }
            );

            RouteTable.Routes.MapHttpRoute(
                name: "StateApi",
                routeTemplate: "api/State/{action}/{id}",
                defaults: new { controller = "State", id = RouteParameter.Optional }
            );
        }
    }
}
