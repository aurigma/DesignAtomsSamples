using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
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
                    new Surface(400, 300)
                    {
                        PrintAreas = { new PrintArea(new RectangleF(0, 0, 400, 300))},
                        Containers =
                        {
                            new SurfaceContainer(new Collection<BaseItem>
                            {
                                new RectangleItem(100, 100, 200, 100)
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
    }
}
