using Aurigma.DesignAtoms.Licensing;

namespace Aurigma.DesignAtoms.Samples
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            Aurigma.DesignAtoms.Configuration.Configuration.Setup(enableCors: true);

            License.Check();
        }
    }
}
