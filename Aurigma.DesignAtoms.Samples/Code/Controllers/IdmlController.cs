using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http;
using Aurigma.DesignAtoms.Convert;
using Aurigma.DesignAtoms.Serialization;
using Newtonsoft.Json;

namespace Aurigma.DesignAtoms.Samples.Code.Controllers
{
    public class IdmlController : ApiController
    {
        private readonly ITemplateConverter _templateConverter;
        private readonly ProductJsonConverter _productJsonConverter;

        public IdmlController(ITemplateConverter converter, ProductJsonConverter jsonConverter)
        {
            _templateConverter = converter;
            _productJsonConverter = jsonConverter;
        }

        [ActionName("designs")]
        public HttpResponseMessage GetFiles()
        {
            var idmlFiles = Directory
                .GetFiles(GetDesignsFolder(), "*.idml")
                .Select(Path.GetFileNameWithoutExtension);

            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(JsonConvert.SerializeObject(idmlFiles), Encoding.UTF8, "application/json")
            };
        }

        [ActionName("product")]
        public HttpResponseMessage GetProduct(string file)
        {
            var fullDesignName = Path.ChangeExtension(Path.Combine(GetDesignsFolder(), file), "idml");

            if (!File.Exists(fullDesignName))
            {
                return new HttpResponseMessage(HttpStatusCode.NotFound)
                {
                    Content = new StringContent($"Design {file} not found")
                };
            }

            var serializedProduct = JsonConvert.SerializeObject(_templateConverter.Convert(fullDesignName), _productJsonConverter);

            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(serializedProduct, Encoding.UTF8, "application/json")
            };
        }

        private static string GetDesignsFolder()
        {
            return System.Web.Hosting.HostingEnvironment.MapPath("~/assets/designs");
        }
    }
}