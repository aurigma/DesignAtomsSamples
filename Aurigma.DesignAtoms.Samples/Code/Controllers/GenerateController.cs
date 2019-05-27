using System.Drawing;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http;
using Aurigma.DesignAtoms.Canvas.Collection;
using Aurigma.DesignAtoms.Common;
using Aurigma.DesignAtoms.Model;
using Aurigma.DesignAtoms.Model.Items;
using Aurigma.DesignAtoms.Serialization;
using Newtonsoft.Json;

namespace Aurigma.DesignAtoms.Samples.Code.Controllers
{
    public class TestItem
    {
        public string title { get; set; }
        public string url { get; set; }
    }
    public class GenerateController : ApiController
    {
        private readonly ProductJsonConverter _productJsonConverter;

        public GenerateController(ProductJsonConverter productJsonConverter)
        {
            _productJsonConverter = productJsonConverter;
        }

        [HttpGet]
        public HttpResponseMessage DemoProduct()
        {
            var product = new Product
            {
                Surfaces =
                {
                    new Surface(491.5f, 667.2f)
                    {
                        PrintAreas = { new PrintArea(new RectangleF(0, 0, 419.5f, 595.2f))},
                        Containers =
                        {
                            new SurfaceContainer(new Collection<BaseItem>
                            {
                                new PlainTextItem("Just about any kind\nof print product",new PointF(95.2f, 321.5f),"Montserrat-Bold",24),
                                new BoundedTextItem("Many packaged web-to-print solutions on the market today work well enough, but they can also be rigid and prevent the customizability that many printers want. Customer's Canvas provides an opportunity for printers to get a solution that is better tailored to their internal workflows and give their customers a more unique and intuitive experience.",new RectangleF(94.8f, 372.15f, 301.5f, 197.1f),"Montserrat-Regular",15),
                                new ImageItem(new FileInfo(System.Web.Hosting.HostingEnvironment.MapPath("~/assets/image.jpg")), new PointF(58.8f , 60) , 301.9f, 174.48f)
                                
                                
                            })
                            {
                                Name = Utils.MainContainerName
                            }
                        }
                    }
                }
            };

            var productJson = JsonConvert.SerializeObject(product, _productJsonConverter);

            //Deserialization sample
            //var test = JsonConvert.DeserializeObject<Product>(productJson, _productJsonConverter);

            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(productJson, Encoding.UTF8, "application/json")
            };
        }


        [HttpGet]
        [Route("api/products/{id}")]
        public HttpResponseMessage Products(string id)
        {
            Product product = null;
            switch (id)
            {
                case "vector-mask":
                    product = DemoProducts.CreateVectorMaskProduct();
                    break;
                case "curved-text":
                    product = DemoProducts.CreateCurvedTextProduct();
                    break;
                case "open-type-feature":
                    product = DemoProducts.CreateOpenTypeFeaturesProduct();
                    break;
            }

            if (product == null)
            {
                return new HttpResponseMessage(HttpStatusCode.BadRequest)
                {
                    Content = new StringContent("Cannot found the specified product", Encoding.UTF8)
                };
            }
            
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(JsonConvert.SerializeObject(product, _productJsonConverter), Encoding.UTF8, "application/json")
            };
        }
    }
}
