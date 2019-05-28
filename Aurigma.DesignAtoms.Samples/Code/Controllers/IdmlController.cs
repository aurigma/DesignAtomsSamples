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
            var idmlFiles = new[]
            {
                new DesignFile
                {
                    Name = "bc",
                    Path = "bc.idml"
                },
                new DesignFile
                {
                    Name = "flyer",
                    Path = Path.Combine("single", "flyer.idml")
                }
            };

            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(JsonConvert.SerializeObject(idmlFiles), Encoding.UTF8, "application/json")
            };
        }

        [ActionName("product")]
        public HttpResponseMessage GetProduct(string filePath)
        {
            var fullDesignName = Path.ChangeExtension(Path.Combine(GetDesignsFolder(), filePath), "idml");

            if (!File.Exists(fullDesignName))
            {
                return new HttpResponseMessage(HttpStatusCode.NotFound)
                {
                    Content = new StringContent($"Design {filePath} not found")
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


    public class DesignFile
    {
        public string Name;
        public string Path;
    }
}