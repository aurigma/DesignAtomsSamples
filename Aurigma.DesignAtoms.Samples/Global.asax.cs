using Aurigma.DesignAtoms.Licensing;

namespace Aurigma.DesignAtoms.Samples
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            // Initializing Design Atoms backend
            // If you want to add Design Atoms in your backend include those calls into your project
            // And ensure that you don't call HttpConfigurationExtensions.MapHttpAttributeRoutes method in your code.
            Aurigma.DesignAtoms.Configuration.Configuration.Setup(enableCors: true);

            License.Check();
        }
    }
}
